import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { encryptEmail, hashEmail, generateRandomPassword } from "@/lib/encryption";
import { sendWelcomeEmail } from "@/lib/email";
import { PREDICTION_DEADLINE } from "@/lib/wc2026-data";

const schema = z.object({
  email: z.string().email().max(255),
  alias: z
    .string()
    .min(2)
    .max(30)
    .regex(/^[a-zA-Z0-9_\-. ]+$/, "Alias can only contain letters, numbers, spaces, hyphens, underscores and dots"),
});

export async function POST(req: NextRequest) {
  // Registrations closed after deadline
  if (new Date() > PREDICTION_DEADLINE) {
    return NextResponse.json(
      { error: "Registration is closed. The prediction deadline has passed." },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { email, alias } = result.data;
  const normalizedEmail = email.toLowerCase().trim();

  // Check if email already registered
  const emailHash = hashEmail(normalizedEmail);
  const existing = await prisma.user.findFirst({
    where: { OR: [{ emailHash }, { alias: { equals: alias, mode: "insensitive" } }] },
  });

  if (existing) {
    // Return generic message for security (don't reveal if email exists)
    return NextResponse.json(
      { error: "Email or alias is already taken. Please try a different one." },
      { status: 409 }
    );
  }

  const temporaryPassword = generateRandomPassword();
  const passwordHash = await bcrypt.hash(temporaryPassword, 12);
  const emailEncrypted = encryptEmail(normalizedEmail);

  const isAdminEmail = normalizedEmail === (process.env.ADMIN_EMAIL ?? "").toLowerCase().trim();

  try {
    const user = await prisma.user.create({
      data: {
        emailEncrypted,
        emailHash,
        alias,
        passwordHash,
        isAdmin: isAdminEmail,
        mustChangePassword: !isAdminEmail, // admin does not need to change password
        userScore: { create: {} }, // Initialize score record
      },
    });

    // Send welcome email
    try {
      await sendWelcomeEmail(normalizedEmail, alias, temporaryPassword);
    } catch (emailErr) {
      console.error("Failed to send welcome email:", emailErr);
      // Don't fail registration if email fails — return password in response for dev
      if (process.env.NODE_ENV === "development") {
        return NextResponse.json({
          success: true,
          message: "Account created. Email sending failed (dev mode).",
          temporaryPassword, // Only in development!
          userId: user.id,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "Registration successful! Please check your email for your temporary password.",
    });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
