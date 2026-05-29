import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  matchId: z.number().int().positive(),
  homeScore: z.number().int().min(0),
  awayScore: z.number().int().min(0),
  homeScoreAet: z.number().int().min(0).optional().nullable(),
  awayScoreAet: z.number().int().min(0).optional().nullable(),
  penaltyWinnerId: z.number().int().positive().optional().nullable(),
});

// POST /api/admin/match — set/update a match result
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const { matchId, homeScore, awayScore, homeScoreAet, awayScoreAet, penaltyWinnerId } = parsed.data;

  const match = await prisma.match.update({
    where: { id: matchId },
    data: {
      homeScore,
      awayScore,
      homeScoreAet: homeScoreAet ?? null,
      awayScoreAet: awayScoreAet ?? null,
      penaltyWinnerId: penaltyWinnerId ?? null,
      isScored: true,
    },
  });

  return NextResponse.json({ success: true, match });
}
