"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [alias, setAlias] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), alias: alias.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Registration failed. Please try again.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card text-center space-y-4">
          <div className="text-5xl">✅</div>
          <h2 className="text-2xl font-bold text-wc-darkblue">Registration Successful!</h2>
          <p className="text-gray-600">
            Check your email for your temporary password. You can now log in and enter your predictions.
          </p>
          <button onClick={() => router.push("/login")} className="btn-primary w-full">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="wc-header-gradient rounded-t-2xl p-8 text-center text-white">
        <div className="text-4xl mb-2">⚽</div>
        <h1 className="text-2xl font-bold text-wc-gold">Register to Play</h1>
        <p className="text-gray-300 text-sm mt-1">Porra Mundial 2026</p>
      </div>

      <div className="card rounded-t-none border-t-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Your temporary password will be sent here</p>
          </div>

          <div>
            <label className="form-label" htmlFor="alias">Display name (alias)</label>
            <input
              id="alias"
              type="text"
              autoComplete="nickname"
              className="form-input"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="e.g. PabloFC"
              minLength={2}
              maxLength={30}
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              2–30 characters. Letters, numbers, spaces, hyphens, underscores, dots.
            </p>
          </div>

          {error && <div className="alert-error">{error}</div>}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Registering…" : "Create Account"}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm text-gray-500">
          <p>✅ A temporary password will be emailed to you</p>
          <p>🔒 Predictions close on June 10, 2026</p>
          <p>📋 <Link href="/rules" className="text-wc-darkblue hover:underline">Read the rules</Link> before entering predictions</p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-wc-darkblue hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
