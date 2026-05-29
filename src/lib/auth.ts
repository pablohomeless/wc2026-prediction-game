import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { hashEmail } from "./encryption";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const emailHash = hashEmail(credentials.email);
        const user = await prisma.user.findUnique({ where: { emailHash } });

        if (!user || !user.isActive) return null;

        const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!passwordMatch) return null;

        return {
          id: String(user.id),
          email: credentials.email, // We store plaintext in JWT only (not in DB)
          name: user.alias,
          isAdmin: user.isAdmin,
          mustChangePassword: user.mustChangePassword,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = (user as { isAdmin?: boolean }).isAdmin ?? false;
        token.mustChangePassword = (user as { mustChangePassword?: boolean }).mustChangePassword ?? false;
        token.alias = user.name ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.mustChangePassword = token.mustChangePassword as boolean;
        session.user.alias = token.alias as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    isAdmin?: boolean;
    mustChangePassword?: boolean;
  }
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      isAdmin: boolean;
      mustChangePassword: boolean;
      alias: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isAdmin: boolean;
    mustChangePassword: boolean;
    alias: string;
  }
}
