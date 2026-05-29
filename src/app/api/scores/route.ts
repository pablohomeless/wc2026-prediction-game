import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/scores — public scoreboard
export async function GET() {
  const scores = await prisma.userScore.findMany({
    include: {
      user: {
        select: { alias: true, isAdmin: true },
      },
    },
    orderBy: { pointsTotal: "desc" },
  });

  return NextResponse.json(
    scores.map((s, index) => ({
      rank: index + 1,
      userId: s.userId,
      alias: s.user.alias,
      total: s.pointsTotal,
      groupMatches: s.pointsGroupMatches,
      groupStandings: s.pointsGroupStandings,
      r32Matches: s.pointsR32,
      r32Advancement: s.pointsR32Advancement,
      r16Matches: s.pointsR16,
      r16Advancement: s.pointsR16Advancement,
      qfMatches: s.pointsQF,
      qfAdvancement: s.pointsQFAdvancement,
      sfMatches: s.pointsSF,
      sfAdvancement: s.pointsSFAdvancement,
      thirdMatch: s.pointsThird,
      thirdAdvancement: 0,
      finalMatch: s.pointsFinal,
      finalAdvancement: 0,
      honorBoard: s.pointsHonorBoard,
    }))
  );
}
