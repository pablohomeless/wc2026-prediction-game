"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push("/predictions");
      router.refresh();
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="wc-header-gradient rounded-t-2xl p-8 text-center text-white">
        <div className="text-4xl mb-2">⚽</div>
        <h1 className="text-2xl font-bold text-wc-gold">Sign In</h1>
        <p className="text-gray-300 text-sm mt-1">Porra Mundial 2026</p>
      </div>

      <div className="card rounded-t-none border-t-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && <div className="alert-error">{error}</div>}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-wc-darkblue hover:underline font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
