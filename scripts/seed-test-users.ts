/**
 * Seed 3 test users with realistic predictions for validation testing.
 * Run: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed-test-users.ts
 *
 * Users created:
 *   Anton Almond    — anton@test.invalid   / TestPass1!
 *   Brenda Bowser   — brenda@test.invalid  / TestPass1!
 *   Carla Curious   — carla@test.invalid   / TestPass1!
 */

import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import { encryptEmail, hashEmail } from "../src/lib/encryption";

// ---------------------------------------------------------------------------
// Test users
// ---------------------------------------------------------------------------
const TEST_USERS = [
  { email: "anton@test.invalid",  alias: "AntonAlmond",  password: "TestPass1!" },
  { email: "brenda@test.invalid", alias: "BrendaBowser", password: "TestPass1!" },
  { email: "carla@test.invalid",  alias: "CarlaCurious", password: "TestPass1!" },
];

// ---------------------------------------------------------------------------
// Prediction helpers — each user gets a slightly different set
// ---------------------------------------------------------------------------

// Group stage scores (matchId 1-72 map to matchNumber 1-72 in the DB)
// We'll just set scores for all 72 group matches per user.
// Format: [homeScore, awayScore]
// Anton: favours favourites, low scoring
// Brenda: lots of draws, mid scoring
// Carla: upsets, high scoring

function antonMatchScores(matchId: number): [number, number] {
  // Group winner (pos1) usually wins 2-0 or 1-0; draws occasionally
  const seed = matchId % 7;
  if (seed === 0) return [1, 1];
  if (seed === 3) return [0, 0];
  return matchId % 2 === 0 ? [2, 0] : [1, 0];
}

function brendaMatchScores(matchId: number): [number, number] {
  const seed = matchId % 5;
  if (seed === 0) return [1, 1];
  if (seed === 1) return [2, 2];
  if (seed === 2) return [0, 0];
  return matchId % 2 === 0 ? [1, 0] : [0, 1];
}

function carlaMatchScores(matchId: number): [number, number] {
  const seed = matchId % 6;
  if (seed === 0) return [3, 2];
  if (seed === 1) return [0, 3];
  if (seed === 2) return [2, 3];
  if (seed === 3) return [4, 1];
  return matchId % 2 === 0 ? [1, 2] : [2, 1];
}

// Group position predictions (pos1-4 team IDs per group)
// Groups A-L with team IDs as defined in wc2026-data.ts
const GROUP_TEAMS: Record<string, [number, number, number, number]> = {
  A: [1, 2, 3, 4],
  B: [5, 6, 7, 8],
  C: [9, 10, 11, 12],
  D: [13, 14, 15, 16],
  E: [17, 18, 19, 20],
  F: [21, 22, 23, 24],
  G: [25, 26, 27, 28],
  H: [29, 30, 31, 32],
  I: [33, 34, 35, 36],
  J: [37, 38, 39, 40],
  K: [41, 42, 43, 44],
  L: [45, 46, 47, 48],
};

// Anton: favours the seeded order (pos1=1st, pos2=2nd, ...)
function antonGroupPreds(groupId: string) {
  const [p1, p2, p3, p4] = GROUP_TEAMS[groupId];
  return { pos1TeamId: p1, pos2TeamId: p2, pos3TeamId: p3, pos4TeamId: p4 };
}

// Brenda: swaps pos1 and pos2 in half the groups
function brendaGroupPreds(groupId: string) {
  const [p1, p2, p3, p4] = GROUP_TEAMS[groupId];
  const swap = "BDFHJL".includes(groupId);
  return {
    pos1TeamId: swap ? p2 : p1,
    pos2TeamId: swap ? p1 : p2,
    pos3TeamId: p3,
    pos4TeamId: p4,
  };
}

// Carla: shuffles a bit more — pos2 first, then pos1, reversed bottom half
function carlaGroupPreds(groupId: string) {
  const [p1, p2, p3, p4] = GROUP_TEAMS[groupId];
  const upset = "CEGIKL".includes(groupId);
  return {
    pos1TeamId: upset ? p2 : p1,
    pos2TeamId: upset ? p3 : p2,
    pos3TeamId: upset ? p1 : p3,
    pos4TeamId: p4,
  };
}

// Knockout round predictions (R32: slots 1-16, R16: 1-8, QF: 1-4, SF: 1-2, THIRD: 1, FINAL: 1)
// We'll pick teams by slot index for simplicity
const KNOCKOUT_ROUNDS = ["R32", "R16", "QF", "SF", "THIRD", "FINAL"] as const;
const KNOCKOUT_SLOTS: Record<string, number> = { R32: 16, R16: 8, QF: 4, SF: 2, THIRD: 1, FINAL: 1 };

// Anton champions: Brazil (9), runner-up: France (33), third: Germany (17)
// Brenda champions: Spain (29), runner-up: England (45), third: Argentina (37)
// Carla champions: Argentina (37), runner-up: Brazil (9), third: Spain (29)

function buildKnockoutPreds(
  userIndex: number
): Array<{ round: string; slot: number; teamId: number }> {
  // Top contenders by team ID
  const topTeams = [9, 13, 17, 21, 25, 29, 33, 37, 41, 45, 1, 5, 10, 14, 18, 22];
  const preds: Array<{ round: string; slot: number; teamId: number }> = [];

  for (const round of KNOCKOUT_ROUNDS) {
    const slots = KNOCKOUT_SLOTS[round];
    for (let slot = 1; slot <= slots; slot++) {
      // pick a team deterministically based on user + slot
      const idx = (slot + userIndex * 5) % topTeams.length;
      preds.push({ round, slot, teamId: topTeams[idx] });
    }
  }
  return preds;
}

const SPECIAL_PREDS = [
  // Anton
  { championId: 9,  runnerUpId: 33, thirdPlaceId: 17, goldenBoot1: "Vinicius Jr.", goldenBoot2: "Mbappé", goldenBoot3: "Müller", goldenBall1: "Vinicius Jr.", goldenBall2: "Mbappé", goldenBall3: "Bellingham" },
  // Brenda
  { championId: 29, runnerUpId: 45, thirdPlaceId: 37, goldenBoot1: "Morata",       goldenBoot2: "Kane",   goldenBoot3: "Messi",  goldenBall1: "Pedri",       goldenBall2: "Kane",   goldenBall3: "Messi" },
  // Carla
  { championId: 37, runnerUpId: 9,  thirdPlaceId: 29, goldenBoot1: "Messi",        goldenBoot2: "Vinicius Jr.", goldenBoot3: "Morata", goldenBall1: "Messi", goldenBall2: "Rodri", goldenBall3: "Vinicius Jr." },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("🌱 Seeding test users...\n");

  const scoreFns = [antonMatchScores, brendaMatchScores, carlaMatchScores];
  const groupFns = [antonGroupPreds, brendaGroupPreds, carlaGroupPreds];

  // Fetch all group-stage match IDs from DB (matchNumber 1-72)
  const groupMatches = await prisma.match.findMany({
    where: { round: "GROUP" },
    select: { id: true, matchNumber: true },
    orderBy: { matchNumber: "asc" },
  });

  for (let i = 0; i < TEST_USERS.length; i++) {
    const { email, alias, password } = TEST_USERS[i];
    const normalizedEmail = email.toLowerCase().trim();
    const emailHash = hashEmail(normalizedEmail);
    const emailEncrypted = encryptEmail(normalizedEmail);
    const passwordHash = await bcrypt.hash(password, 12);

    // Upsert user
    const user = await prisma.user.upsert({
      where: { emailHash },
      create: {
        emailEncrypted,
        emailHash,
        alias,
        passwordHash,
        isAdmin: false,
        isActive: true,
        mustChangePassword: false,
        userScore: { create: {} },
      },
      update: {
        alias,
        passwordHash,
        isActive: true,
        mustChangePassword: false,
      },
    });
    console.log(`✅ User: ${alias} (id: ${user.id})`);

    // Match predictions (all 72 group stage matches)
    const matchPreds = groupMatches.map((m) => {
      const [h, a] = scoreFns[i](m.matchNumber);
      return { userId: user.id, matchId: m.id, homeScore: h, awayScore: a };
    });

    for (const pred of matchPreds) {
      await prisma.matchPrediction.upsert({
        where: { userId_matchId: { userId: pred.userId, matchId: pred.matchId } },
        create: pred,
        update: { homeScore: pred.homeScore, awayScore: pred.awayScore },
      });
    }
    console.log(`   └─ ${matchPreds.length} match predictions`);

    // Group predictions
    for (const groupId of Object.keys(GROUP_TEAMS)) {
      const g = groupFns[i](groupId);
      await prisma.groupPrediction.upsert({
        where: { userId_groupId: { userId: user.id, groupId } },
        create: { userId: user.id, groupId, ...g },
        update: g,
      });
    }
    console.log(`   └─ 12 group position predictions`);

    // Knockout predictions
    const knockoutPreds = buildKnockoutPreds(i);
    for (const k of knockoutPreds) {
      await prisma.knockoutPrediction.upsert({
        where: { userId_round_slot: { userId: user.id, round: k.round as any, slot: k.slot } },
        create: { userId: user.id, round: k.round as any, slot: k.slot, teamId: k.teamId },
        update: { teamId: k.teamId },
      });
    }
    console.log(`   └─ ${knockoutPreds.length} knockout predictions`);

    // Special predictions
    const special = SPECIAL_PREDS[i];
    await prisma.specialPrediction.upsert({
      where: { userId: user.id },
      create: { userId: user.id, ...special },
      update: special,
    });
    console.log(`   └─ special predictions (champion: team id ${special.championId})\n`);
  }

  console.log("🎉 Done! Test user credentials:");
  for (const u of TEST_USERS) {
    console.log(`   ${u.alias.padEnd(14)} ${u.email.padEnd(25)} / ${u.password}`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
