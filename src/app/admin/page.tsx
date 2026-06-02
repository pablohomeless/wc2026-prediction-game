"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ALL_MATCHES as WC2026_MATCHES, TEAMS as WC2026_TEAMS } from "@/lib/wc2026-data";

type User = {
  id: number;
  alias: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  total: number;
};

type MatchResult = {
  matchId: number; // matchNumber
  homeScore: number;
  awayScore: number;
  homeScoreAet?: number | null;
  awayScoreAet?: number | null;
  penaltyWinnerId?: number | null;
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"matches" | "users" | "settings">("matches");
  const [users, setUsers] = useState<User[]>([]);
  const [matchResults, setMatchResults] = useState<Record<number, MatchResult>>({});
  const [calculating, setCalculating] = useState(false);
  const [calcMsg, setCalcMsg] = useState("");
  const [saving, setSaving] = useState<Record<number, boolean>>({});
  const [resetPasswordInfo, setResetPasswordInfo] = useState<{ alias: string; password: string } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && !session?.user?.isAdmin) router.push("/");
  }, [status, session, router]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.isAdmin) return;
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then(setUsers)
      .catch(console.error);
  }, [status, session]);

  if (status === "loading") return <div className="text-center py-12">Loading…</div>;
  if (!session?.user?.isAdmin) return null;

  const getTeam = (id?: number | null) => WC2026_TEAMS.find((t) => t.id === id);

  const setResult = (matchId: number, field: keyof MatchResult, value: number | null) => {
    setMatchResults((prev) => ({
      ...prev,
      [matchId]: { ...(prev[matchId] ?? { matchId, homeScore: 0, awayScore: 0 }), [field]: value },
    }));
  };

  const saveResult = async (matchNumber: number) => {
    const result = matchResults[matchNumber];
    if (!result) return;
    setSaving((s) => ({ ...s, [matchNumber]: true }));
    try {
      const res = await fetch("/api/admin/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      if (!res.ok) {
        const d = await res.json();
        alert(d.error ?? "Failed to save result");
      }
    } finally {
      setSaving((s) => ({ ...s, [matchNumber]: false }));
    }
  };

  const recalculate = async (userId?: number) => {
    setCalculating(true);
    setCalcMsg("");
    const body = userId ? { userId } : {};
    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setCalcMsg(
        data.success
          ? `✅ Recalculated ${data.processed} user(s)${data.errors ? ` (${data.errors.length} errors)` : ""}`
          : `❌ Error`
      );
    } finally {
      setCalculating(false);
    }
  };

  const adminAction = async (userId: number, action: string, extra?: object) => {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action, ...extra }),
    });
    if (!res.ok) {
      const d = await res.json();
      alert(d.error ?? "Action failed");
    } else {
      const d = await res.json();
      if (action === "resetPassword" && d.newPassword) {
        setResetPasswordInfo({ alias: users.find((u) => u.id === userId)?.alias ?? "", password: d.newPassword });
      }
      // Refresh users
      const fresh = await fetch("/api/admin/users").then((r) => r.json());
      setUsers(fresh);
    }
  };

  // Group matches by round for display
  const groupedMatches: Record<string, typeof WC2026_MATCHES> = {};
  for (const m of WC2026_MATCHES) {
    const key = m.round;
    if (!groupedMatches[key]) groupedMatches[key] = [];
    groupedMatches[key].push(m);
  }

  return (
    <div className="space-y-6">
      {/* Password reset modal */}
      {resetPasswordInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 text-center">
            <div className="text-4xl">🔑</div>
            <h3 className="text-lg font-bold text-wc-darkblue">Password Reset</h3>
            <p className="text-gray-600 text-sm">
              New temporary password for <strong>{resetPasswordInfo.alias}</strong>:
            </p>
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-3">
              <p className="text-xs text-yellow-800 font-semibold mb-1">⚠️ Copy this now — it won&apos;t be shown again</p>
              <code className="text-xl font-mono font-bold tracking-widest text-wc-darkblue">
                {resetPasswordInfo.password}
              </code>
            </div>
            <p className="text-xs text-gray-500">The user will be prompted to change it on next login.</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(resetPasswordInfo.password);
                setResetPasswordInfo(null);
              }}
              className="btn-primary w-full"
            >
              Copy &amp; Close
            </button>
            <button onClick={() => setResetPasswordInfo(null)} className="text-sm text-gray-400 hover:text-gray-600 w-full">
              Close without copying
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-wc-darkblue">🛡️ Admin Dashboard</h1>
        <div className="flex gap-2">
          {(["matches", "users", "settings"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={activeTab === t ? "tab-active" : "tab-inactive"}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* MATCHES TAB */}
      {activeTab === "matches" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => recalculate()}
              disabled={calculating}
              className="btn-primary"
            >
              {calculating ? "Calculating…" : "🔄 Recalculate All Scores"}
            </button>
            {calcMsg && <span className="text-sm">{calcMsg}</span>}
          </div>

          {Object.entries(groupedMatches).map(([round, matches]) => (
            <div key={round} className="card space-y-3">
              <h3 className="font-bold text-wc-darkblue">{round}</h3>
              <div className="space-y-2">
                {matches.map((m) => {
                  const homeTeam = getTeam(m.homeTeamId);
                  const awayTeam = getTeam(m.awayTeamId);
                  const res = matchResults[m.matchNumber] ?? { matchId: m.matchNumber, homeScore: 0, awayScore: 0 };

                  return (
                    <div key={m.matchNumber} className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-2">
                      <span className="text-xs text-gray-400 w-8">#{m.matchNumber}</span>
                      <span className="text-sm w-28">
                        {homeTeam ? `${homeTeam.flagEmoji} ${homeTeam.code}` : m.homeSlotLabel}
                      </span>
                      <input
                        type="number"
                        min={0}
                        className="score-input"
                        value={res.homeScore}
                        onChange={(e) => setResult(m.matchNumber, "homeScore", parseInt(e.target.value) || 0)}
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        type="number"
                        min={0}
                        className="score-input"
                        value={res.awayScore}
                        onChange={(e) => setResult(m.matchNumber, "awayScore", parseInt(e.target.value) || 0)}
                      />
                      <span className="text-sm w-28">
                        {awayTeam ? `${awayTeam.code} ${awayTeam.flagEmoji}` : m.awaySlotLabel}
                      </span>
                      {m.round !== "GROUP" && (
                        <>
                          <span className="text-xs text-gray-400">AET:</span>
                          <input
                            type="number"
                            min={0}
                            placeholder="H"
                            className="score-input !w-10"
                            value={res.homeScoreAet ?? ""}
                            onChange={(e) =>
                              setResult(m.matchNumber, "homeScoreAet", e.target.value ? parseInt(e.target.value) : null)
                            }
                          />
                          <input
                            type="number"
                            min={0}
                            placeholder="A"
                            className="score-input !w-10"
                            value={res.awayScoreAet ?? ""}
                            onChange={(e) =>
                              setResult(m.matchNumber, "awayScoreAet", e.target.value ? parseInt(e.target.value) : null)
                            }
                          />
                        </>
                      )}
                      <button
                        onClick={() => saveResult(m.matchNumber)}
                        disabled={saving[m.matchNumber]}
                        className="btn-primary !py-1 !px-3 text-xs"
                      >
                        {saving[m.matchNumber] ? "…" : "Save"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === "users" && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200 text-left">
                <th className="pb-2 pr-3">ID</th>
                <th className="pb-2 pr-3">Alias</th>
                <th className="pb-2 pr-3">Email</th>
                <th className="pb-2 pr-3 text-center">Points</th>
                <th className="pb-2 pr-3 text-center">Active</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 pr-3 text-gray-400">{u.id}</td>
                  <td className="py-2 pr-3 font-medium">
                    {u.alias}
                    {u.isAdmin && <span className="ml-1 text-xs text-wc-red">[admin]</span>}
                  </td>
                  <td className="py-2 pr-3 text-gray-600 text-xs">{u.email}</td>
                  <td className="py-2 pr-3 text-center font-bold">{u.total}</td>
                  <td className="py-2 pr-3 text-center">{u.isActive ? "✅" : "❌"}</td>
                  <td className="py-2 flex gap-1 flex-wrap">
                    <button
                      onClick={() => {
                        const newAlias = prompt("New alias:", u.alias);
                        if (newAlias) adminAction(u.id, "changeAlias", { newAlias });
                      }}
                      className="text-xs btn-secondary !py-0.5 !px-2"
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Reset password for ${u.alias}?`)) adminAction(u.id, "resetPassword");
                      }}
                      className="text-xs btn-secondary !py-0.5 !px-2"
                    >
                      Reset pwd
                    </button>
                    <button
                      onClick={() => adminAction(u.id, "toggleActive")}
                      className="text-xs btn-danger !py-0.5 !px-2"
                    >
                      {u.isActive ? "Disable" : "Enable"}
                    </button>
                    <button
                      onClick={() => recalculate(u.id)}
                      disabled={calculating}
                      className="text-xs btn-secondary !py-0.5 !px-2"
                    >
                      Recalc
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === "settings" && (
        <div className="card max-w-lg space-y-4">
          <h3 className="font-bold text-wc-darkblue">Tournament Settings</h3>
          <p className="text-sm text-gray-500">
            Final results (Champion, Runner-up, etc.) are set via the Honor Board API.
            Use the Matches tab to enter match scores, then Recalculate All Scores.
          </p>
          <div className="alert-info text-sm">
            💡 Workflow: Enter result → Save → Recalculate All Scores
          </div>
        </div>
      )}
    </div>
  );
}
