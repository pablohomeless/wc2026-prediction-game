import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decryptEmail } from "@/lib/encryption";
import { generateRandomPassword } from "@/lib/encryption";
import bcrypt from "bcryptjs";
import { z } from "zod";

// GET /api/admin/users — list all users with scores
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    include: { userScore: true },
    orderBy: { id: "asc" },
  });

  return NextResponse.json(
    users.map((u) => ({
      id: u.id,
      alias: u.alias,
      email: (() => {
        try {
          return decryptEmail(u.emailEncrypted);
        } catch {
          return "[decryption error]";
        }
      })(),
      isAdmin: u.isAdmin,
      isActive: u.isActive,
      mustChangePassword: u.mustChangePassword,
      total: u.userScore?.pointsTotal ?? 0,
      createdAt: u.createdAt,
    }))
  );
}

const patchSchema = z.object({
  userId: z.number().int().positive(),
  action: z.enum(["changeAlias", "resetPassword", "toggleActive", "grantOverride"]),
  newAlias: z.string().min(2).max(30).optional(),
  matchId: z.number().int().positive().optional(),
  overridePoints: z.number().int().optional(),
  overrideReason: z.string().max(255).optional(),
});

// PATCH /api/admin/users — admin user management actions
export async function PATCH(req: NextRequest) {
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

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const { userId, action, newAlias, matchId, overridePoints, overrideReason } = parsed.data;
  const adminId = parseInt(session.user.id);

  switch (action) {
    case "changeAlias": {
      if (!newAlias) return NextResponse.json({ error: "newAlias is required" }, { status: 400 });
      const exists = await prisma.user.findFirst({
        where: { alias: { equals: newAlias, mode: "insensitive" }, NOT: { id: userId } },
      });
      if (exists) return NextResponse.json({ error: "Alias already taken" }, { status: 409 });
      await prisma.user.update({ where: { id: userId }, data: { alias: newAlias } });
      return NextResponse.json({ success: true });
    }

    case "resetPassword": {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

      const newPassword = generateRandomPassword();
      const passwordHash = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash, mustChangePassword: true },
      });

      return NextResponse.json({ success: true, newPassword });
    }

    case "toggleActive": {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
      await prisma.user.update({ where: { id: userId }, data: { isActive: !user.isActive } });
      return NextResponse.json({ success: true });
    }

    case "grantOverride": {
      if (matchId == null || overridePoints == null) {
        return NextResponse.json({ error: "matchId and overridePoints are required" }, { status: 400 });
      }
      await prisma.adminOverride.upsert({
        where: { userId_matchId: { userId, matchId } } as any,
        create: {
          userId,
          matchId,
          overridePoints,
          reason: overrideReason ?? "",
          appliedById: adminId,
        },
        update: {
          overridePoints,
          reason: overrideReason ?? "",
          appliedById: adminId,
        },
      });
      return NextResponse.json({ success: true });
    }

    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
