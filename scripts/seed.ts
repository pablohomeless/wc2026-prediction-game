import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import { encryptEmail, hashEmail } from "../src/lib/encryption";
import { TEAMS as WC2026_TEAMS, ALL_MATCHES as WC2026_MATCHES, PREDICTION_DEADLINE } from "../src/lib/wc2026-data";

async function main() {
  console.log("🌱 Seeding WC 2026 database...");

  // --- Tournament Settings ---
  await prisma.tournamentSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      predictionDeadline: PREDICTION_DEADLINE,
      tournamentStarted: false,
    },
    update: {},
  });
  console.log("✅ Tournament settings");

  // --- Teams ---
  for (const team of WC2026_TEAMS) {
    await prisma.team.upsert({
      where: { id: team.id },
      create: {
        id: team.id,
        name: team.name,
        nameEs: team.nameEs,
        code: team.code,
        groupId: team.groupId,
        groupPos: team.groupPos,
        flagEmoji: team.flagEmoji,
      },
      update: {
        name: team.name,
        nameEs: team.nameEs,
        code: team.code,
        groupId: team.groupId,
        groupPos: team.groupPos,
        flagEmoji: team.flagEmoji,
      },
    });
  }
  console.log(`✅ ${WC2026_TEAMS.length} teams`);

  // --- Matches ---
  for (const match of WC2026_MATCHES) {
    await prisma.match.upsert({
      where: { matchNumber: match.matchNumber },
      create: {
        matchNumber: match.matchNumber,
        round: match.round as any,
        groupId: match.groupId ?? null,
        matchDate: match.matchDate ? new Date(match.matchDate) : null,
        homeTeamId: match.homeTeamId ?? null,
        awayTeamId: match.awayTeamId ?? null,
        homeSlotLabel: match.homeSlotLabel ?? null,
        awaySlotLabel: match.awaySlotLabel ?? null,
        isBonusGame: match.isBonusGame ?? false,
        isScored: false,
      },
      update: {
        round: match.round as any,
        groupId: match.groupId ?? null,
        matchDate: match.matchDate ? new Date(match.matchDate) : null,
        homeTeamId: match.homeTeamId ?? null,
        awayTeamId: match.awayTeamId ?? null,
        homeSlotLabel: match.homeSlotLabel ?? null,
        awaySlotLabel: match.awaySlotLabel ?? null,
        isBonusGame: match.isBonusGame ?? false,
      },
    });
  }
  console.log(`✅ ${WC2026_MATCHES.length} matches`);

  // --- Admin user ---
  const adminEmail = process.env.ADMIN_EMAIL ?? "pablosanchez@microsoft.com";
  const adminPassword = "PORRAMUNDIAL2026!";
  const adminAlias = "PabloS";

  const adminHash = hashEmail(adminEmail);
  const adminEncrypted = encryptEmail(adminEmail);
  const adminPasswordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { emailHash: adminHash },
    create: {
      emailEncrypted: adminEncrypted,
      emailHash: adminHash,
      alias: adminAlias,
      passwordHash: adminPasswordHash,
      isAdmin: true,
      isActive: true,
      mustChangePassword: false,
      userScore: { create: {} },
    },
    update: {
      isAdmin: true,
      mustChangePassword: false,
    },
  });
  console.log(`✅ Admin user: ${adminEmail} (id: ${admin.id})`);

  console.log("\n🎉 Seed complete!");
  console.log(`\nAdmin login:`);
  console.log(`  Email:    ${adminEmail}`);
  console.log(`  Password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
