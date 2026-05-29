import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  calculateMatchPoints,
  calculateGroupStandingPoints,
  calculateHonorBoardPoints,
  ROUND_ADVANCEMENT_POINTS,
} from "@/lib/scoring";
import { Round } from "@prisma/client";

// POST /api/calculate — recalculate scores for a user or all users
// Body: { userId?: number } — if omitted, recalculate all
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { userId?: number } = {};
  try {
    body = await req.json();
  } catch {
    // Empty body is fine
  }

  const targetUserIds: number[] = [];
  if (body.userId) {
    targetUserIds.push(body.userId);
  } else {
    const users = await prisma.user.findMany({ select: { id: true } });
    targetUserIds.push(...users.map((u) => u.id));
  }

  // Load tournament settings (results)
  const settings = await prisma.tournamentSettings.findUnique({ where: { id: 1 } });

  // Load all scored matches
  const matches = await prisma.match.findMany({ where: { isScored: true } });
  const matchMap = new Map(matches.map((m) => [m.id, m]));

  // Errors per user
  const errors: string[] = [];

  for (const userId of targetUserIds) {
    try {
      await recalculateUser(userId, matchMap, settings, matches);
    } catch (err) {
      errors.push(`userId ${userId}: ${String(err)}`);
    }
  }

  return NextResponse.json({
    success: true,
    processed: targetUserIds.length,
    errors: errors.length ? errors : undefined,
  });
}

async function recalculateUser(
  userId: number,
  matchMap: Map<number, Awaited<ReturnType<typeof prisma.match.findMany>>[number]>,
  settings: Awaited<ReturnType<typeof prisma.tournamentSettings.findUnique>>,
  allMatches: Awaited<ReturnType<typeof prisma.match.findMany>>
) {
  // Load user's predictions
  const [matchPreds, groupPreds, knockoutPreds, specialPred, overrides] = await Promise.all([
    prisma.matchPrediction.findMany({ where: { userId } }),
    prisma.groupPrediction.findMany({ where: { userId } }),
    prisma.knockoutPrediction.findMany({ where: { userId } }),
    prisma.specialPrediction.findUnique({ where: { userId } }),
    prisma.adminOverride.findMany({ where: { userId } }),
  ]);

  const overrideMap = new Map(overrides.map((o) => [o.matchId, o.overridePoints]));

  // --- Match points ---
  let groupMatchesTotal = 0;
  let r32Matches = 0, r16Matches = 0, qfMatches = 0, sfMatches = 0, thirdMatch = 0, finalMatch = 0;

  for (const pred of matchPreds) {
    const match = matchMap.get(pred.matchId);
    if (!match || !match.isScored) continue;

    const overridePoints = overrideMap.get(pred.matchId);
    let pts: number;

    if (overridePoints !== undefined) {
      pts = overridePoints;
    } else {
      pts = calculateMatchPoints(
        {
          homeScore: match.homeScore ?? 0,
          awayScore: match.awayScore ?? 0,
          homeScoreAet: match.homeScoreAet,
          awayScoreAet: match.awayScoreAet,
        },
        { homeScore: pred.homeScore, awayScore: pred.awayScore },
        match.isBonusGame
      );
    }

    // Update individual prediction points
    await prisma.matchPrediction.update({
      where: { userId_matchId: { userId, matchId: pred.matchId } },
      data: { points: pts },
    });

    switch (match.round) {
      case Round.GROUP: groupMatchesTotal += pts; break;
      case Round.R32: r32Matches += pts; break;
      case Round.R16: r16Matches += pts; break;
      case Round.QF: qfMatches += pts; break;
      case Round.SF: sfMatches += pts; break;
      case Round.THIRD: thirdMatch += pts; break;
      case Round.FINAL: finalMatch += pts; break;
    }
  }

  // --- Group standings points ---
  let groupStandings = 0;

  // We need actual group standings. Derive from R32 matches (first 16 slots = group winners/runners-up)
  // or from DB if stored. For now, compute from match results.
  // Actual group standings come from knowing which teams ended up in which positions.
  // We'll derive: for each group, the team that won slot pos = actual final standing.
  // Since we don't track group standings as DB results yet, we compute dynamically.
  // (This will be enhanced when tournament settings track actual group standings.)

  // For each group, load all GROUP matches and compute standings
  const groupMatchesByGroup = new Map<string, typeof allMatches>();
  for (const m of allMatches) {
    if (m.round !== Round.GROUP || !m.groupId) continue;
    if (!m.isScored) continue;
    const arr = groupMatchesByGroup.get(m.groupId) ?? [];
    arr.push(m);
    groupMatchesByGroup.set(m.groupId, arr);
  }

  for (const gp of groupPreds) {
    const groupGames = groupMatchesByGroup.get(gp.groupId);
    if (!groupGames || groupGames.length < 6) continue; // Not all group games scored yet

    // Compute actual standings from match results
    const actualStandings = computeGroupStandings(groupGames, gp.groupId);
    if (actualStandings.length < 4) continue;

    const predicted: [number, number, number, number] = [
      gp.pos1TeamId, gp.pos2TeamId, gp.pos3TeamId, gp.pos4TeamId,
    ];
    const actual: [number, number, number, number] = [
      actualStandings[0], actualStandings[1], actualStandings[2], actualStandings[3],
    ];

    const pts = calculateGroupStandingPoints(predicted, actual);
    groupStandings += pts;
    await prisma.groupPrediction.update({
      where: { userId_groupId: { userId, groupId: gp.groupId } },
      data: { points: pts },
    });
  }

  // --- Knockout advancement points ---
  let r32Advancement = 0, r16Advancement = 0, qfAdvancement = 0;
  let sfAdvancement = 0, thirdAdvancement = 0, finalAdvancement = 0;

  // Build actual teams per round from scored matches
  const actualTeamsByRound = buildActualTeamsByRound(allMatches);

  for (const kp of knockoutPreds) {
    const actualTeams = actualTeamsByRound.get(kp.round) ?? new Set<number>();
    if (actualTeams.has(kp.teamId)) {
      const pts = ROUND_ADVANCEMENT_POINTS[kp.round] ?? 0;
      await prisma.knockoutPrediction.update({
        where: { userId_round_slot: { userId, round: kp.round, slot: kp.slot } },
        data: { points: pts },
      });
      switch (kp.round) {
        case Round.R32: r32Advancement += pts; break;
        case Round.R16: r16Advancement += pts; break;
        case Round.QF: qfAdvancement += pts; break;
        case Round.SF: sfAdvancement += pts; break;
        case Round.THIRD: thirdAdvancement += pts; break;
        case Round.FINAL: finalAdvancement += pts; break;
      }
    } else {
      await prisma.knockoutPrediction.update({
        where: { userId_round_slot: { userId, round: kp.round, slot: kp.slot } },
        data: { points: 0 },
      });
    }
  }

  // --- Honor board points ---
  let honorBoard = 0;
  if (specialPred && settings) {
    const honorPts = calculateHonorBoardPoints(
      {
        championId: specialPred.championId,
        runnerUpId: specialPred.runnerUpId,
        thirdPlaceId: specialPred.thirdPlaceId,
        goldenBoot1: specialPred.goldenBoot1,
        goldenBoot2: specialPred.goldenBoot2,
        goldenBoot3: specialPred.goldenBoot3,
        goldenBall1: specialPred.goldenBall1,
        goldenBall2: specialPred.goldenBall2,
        goldenBall3: specialPred.goldenBall3,
      },
      {
        championId: settings.actualChampionId,
        runnerUpId: settings.actualRunnerUpId,
        thirdPlaceId: settings.actualThirdPlaceId,
        goldenBoot1: settings.actualGoldenBoot1,
        goldenBoot2: settings.actualGoldenBoot2,
        goldenBoot3: settings.actualGoldenBoot3,
        goldenBall1: settings.actualGoldenBall1,
        goldenBall2: settings.actualGoldenBall2,
        goldenBall3: settings.actualGoldenBall3,
        boot2Awarded: settings.boot2Awarded,
        boot3Awarded: settings.boot3Awarded,
        ball2Awarded: settings.ball2Awarded,
        ball3Awarded: settings.ball3Awarded,
      }
    );
    honorBoard = honorPts.total;
    await prisma.specialPrediction.update({
      where: { userId },
      data: {
        pointsChampion: honorPts.pointsChampion,
        pointsRunnerUp: honorPts.pointsRunnerUp,
        pointsThird: honorPts.pointsThird,
        pointsBoot1: honorPts.pointsBoot1,
        pointsBoot2: honorPts.pointsBoot2,
        pointsBoot3: honorPts.pointsBoot3,
        pointsBall1: honorPts.pointsBall1,
        pointsBall2: honorPts.pointsBall2,
        pointsBall3: honorPts.pointsBall3,
      },
    });
  }

  const total =
    groupMatchesTotal + groupStandings +
    r32Matches + r32Advancement +
    r16Matches + r16Advancement +
    qfMatches + qfAdvancement +
    sfMatches + sfAdvancement +
    thirdMatch + thirdAdvancement +
    finalMatch + finalAdvancement +
    honorBoard;

  await prisma.userScore.upsert({
    where: { userId },
    create: {
      userId,
      pointsTotal: total,
      pointsGroupMatches: groupMatchesTotal,
      pointsGroupStandings: groupStandings,
      pointsR32: r32Matches,
      pointsR32Advancement: r32Advancement,
      pointsR16: r16Matches,
      pointsR16Advancement: r16Advancement,
      pointsQF: qfMatches,
      pointsQFAdvancement: qfAdvancement,
      pointsSF: sfMatches,
      pointsSFAdvancement: sfAdvancement,
      pointsThird: thirdMatch,
      pointsFinal: finalMatch,
      pointsHonorBoard: honorBoard,
    },
    update: {
      pointsTotal: total,
      pointsGroupMatches: groupMatchesTotal,
      pointsGroupStandings: groupStandings,
      pointsR32: r32Matches,
      pointsR32Advancement: r32Advancement,
      pointsR16: r16Matches,
      pointsR16Advancement: r16Advancement,
      pointsQF: qfMatches,
      pointsQFAdvancement: qfAdvancement,
      pointsSF: sfMatches,
      pointsSFAdvancement: sfAdvancement,
      pointsThird: thirdMatch,
      pointsFinal: finalMatch,
      pointsHonorBoard: honorBoard,
    },
  });
}

interface TeamStats {
  teamId: number;
  points: number;
  gf: number;
  ga: number;
  gd: number;
  wins: number;
  draws: number;
  losses: number;
}

function computeGroupStandings(
  matches: Awaited<ReturnType<typeof prisma.match.findMany>>,
  groupId: string
): number[] {
  const stats = new Map<number, TeamStats>();

  const ensure = (id: number) => {
    if (!stats.has(id)) {
      stats.set(id, { teamId: id, points: 0, gf: 0, ga: 0, gd: 0, wins: 0, draws: 0, losses: 0 });
    }
  };

  for (const m of matches) {
    if (!m.homeTeamId || !m.awayTeamId || m.homeScore == null || m.awayScore == null) continue;
    ensure(m.homeTeamId);
    ensure(m.awayTeamId);
    const home = stats.get(m.homeTeamId)!;
    const away = stats.get(m.awayTeamId)!;

    home.gf += m.homeScore; home.ga += m.awayScore;
    away.gf += m.awayScore; away.ga += m.homeScore;
    home.gd = home.gf - home.ga;
    away.gd = away.gf - away.ga;

    if (m.homeScore > m.awayScore) {
      home.points += 3; home.wins++;
      away.losses++;
    } else if (m.homeScore === m.awayScore) {
      home.points += 1; away.points += 1;
      home.draws++; away.draws++;
    } else {
      away.points += 3; away.wins++;
      home.losses++;
    }
  }

  // Sort: points desc, GD desc, GF desc, team ID asc (tiebreak fallback)
  const sorted = Array.from(stats.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return a.teamId - b.teamId;
  });

  return sorted.map((s) => s.teamId);
}

function buildActualTeamsByRound(
  allMatches: Awaited<ReturnType<typeof prisma.match.findMany>>
): Map<string, Set<number>> {
  const result = new Map<string, Set<number>>();

  for (const m of allMatches) {
    if (!m.isScored) continue;
    if (m.round === Round.GROUP) continue;

    const round = m.round as string;
    if (!result.has(round)) result.set(round, new Set());
    if (m.homeTeamId) result.get(round)!.add(m.homeTeamId);
    if (m.awayTeamId) result.get(round)!.add(m.awayTeamId);
  }

  return result;
}
