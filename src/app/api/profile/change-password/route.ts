import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { hashEmail } from "@/lib/encryption";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(100),
});

// POST /api/profile/change-password
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  const userId = parseInt(session.user.id);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const match = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!match) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  }

  const newHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newHash, mustChangePassword: false },
  });

  return NextResponse.json({ success: true });
}
