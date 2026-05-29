"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        pathname === href
          ? "bg-blue-900 text-white"
          : "text-gray-200 hover:bg-blue-800 hover:text-white"
      }`}
      onClick={() => setMenuOpen(false)}
    >
      {label}
    </Link>
  );

  return (
    <nav className="wc-header-gradient shadow-lg">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">⚽</span>
            <div>
              <div className="text-wc-gold font-bold text-lg leading-tight">Porra Mundial 2026</div>
              <div className="text-gray-300 text-xs">USA / Mexico / Canada</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLink("/", "Scoreboard")}
            {navLink("/results", "Results")}
            {navLink("/rules", "Rules")}
            {navLink("/how-to-play", "How to Play")}
            {status === "authenticated" && navLink("/predictions", "My Predictions")}
            {session?.user?.isAdmin && navLink("/admin", "Admin")}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            {status === "loading" ? (
              <div className="w-20 h-8 bg-blue-800 animate-pulse rounded" />
            ) : session ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" className="text-wc-gold text-sm font-medium hover:underline">
                  👤 {session.user.alias}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-200 hover:text-white text-sm px-3 py-1.5">
                  Sign in
                </Link>
                <Link href="/register" className="btn-gold text-sm !py-1.5 !px-3">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-1">
            {navLink("/", "Scoreboard")}
            {navLink("/results", "Results")}
            {navLink("/rules", "Rules")}
            {navLink("/how-to-play", "How to Play")}
            {status === "authenticated" && navLink("/predictions", "My Predictions")}
            {session?.user?.isAdmin && navLink("/admin", "Admin")}
            <hr className="border-blue-700 my-2" />
            {session ? (
              <>
                <Link href="/profile" className="text-wc-gold px-3 py-2 text-sm" onClick={() => setMenuOpen(false)}>
                  👤 {session.user.alias}
                </Link>
                <button
                  onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                  className="text-gray-300 px-3 py-2 text-sm text-left"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-200 px-3 py-2 text-sm" onClick={() => setMenuOpen(false)}>Sign in</Link>
                <Link href="/register" className="text-wc-gold px-3 py-2 text-sm font-bold" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
