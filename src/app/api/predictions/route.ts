import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PREDICTION_DEADLINE } from "@/lib/wc2026-data";
import { z } from "zod";

// GET /api/predictions — fetch current user's predictions
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = parseInt(session.user.id);

  const [matchPredictions, groupPredictions, knockoutPredictions, specialPrediction] =
    await Promise.all([
      prisma.matchPrediction.findMany({ where: { userId } }),
      prisma.groupPrediction.findMany({ where: { userId } }),
      prisma.knockoutPrediction.findMany({ where: { userId } }),
      prisma.specialPrediction.findUnique({ where: { userId } }),
    ]);

  return NextResponse.json({
    matchPredictions,
    groupPredictions,
    knockoutPredictions,
    specialPrediction,
  });
}

// --- Validation schemas ---

const matchPredSchema = z.object({
  matchId: z.number().int().positive(),
  homeScore: z.number().int().min(0).max(30),
  awayScore: z.number().int().min(0).max(30),
});

const groupPredSchema = z.object({
  groupId: z.string().length(1),
  pos1TeamId: z.number().int().positive(),
  pos2TeamId: z.number().int().positive(),
  pos3TeamId: z.number().int().positive(),
  pos4TeamId: z.number().int().positive(),
});

const knockoutPredSchema = z.object({
  round: z.enum(["R32", "R16", "QF", "SF", "THIRD", "FINAL"]),
  slot: z.number().int().positive(),
  teamId: z.number().int().positive(),
});

const specialPredSchema = z.object({
  championId: z.number().int().positive().optional().nullable(),
  runnerUpId: z.number().int().positive().optional().nullable(),
  thirdPlaceId: z.number().int().positive().optional().nullable(),
  goldenBoot1: z.string().max(100).optional().nullable(),
  goldenBoot2: z.string().max(100).optional().nullable(),
  goldenBoot3: z.string().max(100).optional().nullable(),
  goldenBall1: z.string().max(100).optional().nullable(),
  goldenBall2: z.string().max(100).optional().nullable(),
  goldenBall3: z.string().max(100).optional().nullable(),
});

const saveSchema = z.object({
  matches: z.array(matchPredSchema).optional().default([]),
  groups: z.array(groupPredSchema).optional().default([]),
  knockouts: z.array(knockoutPredSchema).optional().default([]),
  special: specialPredSchema.optional().nullable(),
});

// POST /api/predictions — save predictions (all or partial)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check deadline
  if (new Date() > PREDICTION_DEADLINE) {
    return NextResponse.json(
      { error: "The prediction deadline has passed. Predictions are locked." },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = saveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const userId = parseInt(session.user.id);
  const { matches, groups, knockouts, special } = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      // Upsert match predictions
      for (const m of matches) {
        await tx.matchPrediction.upsert({
          where: { userId_matchId: { userId, matchId: m.matchId } },
          create: { userId, matchId: m.matchId, homeScore: m.homeScore, awayScore: m.awayScore },
          update: { homeScore: m.homeScore, awayScore: m.awayScore },
        });
      }

      // Upsert group predictions
      for (const g of groups) {
        await tx.groupPrediction.upsert({
          where: { userId_groupId: { userId, groupId: g.groupId } },
          create: {
            userId,
            groupId: g.groupId,
            pos1TeamId: g.pos1TeamId,
            pos2TeamId: g.pos2TeamId,
            pos3TeamId: g.pos3TeamId,
            pos4TeamId: g.pos4TeamId,
          },
          update: {
            pos1TeamId: g.pos1TeamId,
            pos2TeamId: g.pos2TeamId,
            pos3TeamId: g.pos3TeamId,
            pos4TeamId: g.pos4TeamId,
          },
        });
      }

      // Upsert knockout predictions
      for (const k of knockouts) {
        await tx.knockoutPrediction.upsert({
          where: { userId_round_slot: { userId, round: k.round, slot: k.slot } },
          create: { userId, round: k.round, slot: k.slot, teamId: k.teamId },
          update: { teamId: k.teamId },
        });
      }

      // Upsert special prediction
      if (special !== undefined && special !== null) {
        await tx.specialPrediction.upsert({
          where: { userId },
          create: { userId, ...special },
          update: special,
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Predictions save error:", err);
    return NextResponse.json({ error: "Failed to save predictions." }, { status: 500 });
  }
}
