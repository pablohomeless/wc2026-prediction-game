"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  TEAMS as WC2026_TEAMS,
  ALL_MATCHES as WC2026_MATCHES,
  PREDICTION_DEADLINE,
  GROUPS,
  getTeamsByGroup,
  KNOWN_PLAYERS,
} from "@/lib/wc2026-data";
import type { TeamData as Team } from "@/lib/wc2026-data";

// ---- Types ----
type MatchPred = { homeScore: number; awayScore: number };
type GroupPred = { pos1TeamId: number; pos2TeamId: number; pos3TeamId: number; pos4TeamId: number };
type KnockoutPred = { round: string; slot: number; teamId: number };
type SpecialPred = {
  championId: number | null;
  runnerUpId: number | null;
  thirdPlaceId: number | null;
  goldenBoot1: string; goldenBoot2: string; goldenBoot3: string;
  goldenBall1: string; goldenBall2: string; goldenBall3: string;
};

const TABS = ["Group Matches", "Group Standings", "Knockout", "Honor Board"] as const;

function TeamFlag({ team }: { team: Team | undefined }) {
  if (!team) return <span className="text-gray-400">TBD</span>;
  return (
    <span className="flex items-center gap-1">
      <span>{team.flagEmoji}</span>
      <span className="font-medium text-sm">{team.code}</span>
    </span>
  );
}

function ScoreInput({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled: boolean;
}) {
  return (
    <input
      type="number"
      min={0}
      max={30}
      value={value}
      onChange={(e) => onChange(Math.max(0, Math.min(30, parseInt(e.target.value) || 0)))}
      className="score-input"
      disabled={disabled}
    />
  );
}

export default function PredictionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tab, setTab] = useState<(typeof TABS)[number]>("Group Matches");
  const [groupTab, setGroupTab] = useState("A");
  const [matchPreds, setMatchPreds] = useState<Record<number, MatchPred>>({});
  const [groupPreds, setGroupPreds] = useState<Record<string, GroupPred>>({});
  const [knockoutPreds, setKnockoutPreds] = useState<KnockoutPred[]>([]);
  const [special, setSpecial] = useState<SpecialPred>({
    championId: null, runnerUpId: null, thirdPlaceId: null,
    goldenBoot1: "", goldenBoot2: "", goldenBoot3: "",
    goldenBall1: "", goldenBall2: "", goldenBall3: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const isDeadlinePassed = new Date() > PREDICTION_DEADLINE;
  const isReadOnly = isDeadlinePassed;

  // Load existing predictions
  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/predictions")
      .then((r) => r.json())
      .then((data) => {
        if (data.matchPredictions) {
          const mp: Record<number, MatchPred> = {};
          for (const p of data.matchPredictions) mp[p.matchId] = { homeScore: p.homeScore, awayScore: p.awayScore };
          setMatchPreds(mp);
        }
        if (data.groupPredictions) {
          const gp: Record<string, GroupPred> = {};
          for (const p of data.groupPredictions) gp[p.groupId] = p;
          setGroupPreds(gp);
        }
        if (data.knockoutPredictions) setKnockoutPreds(data.knockoutPredictions);
        if (data.specialPrediction) {
          setSpecial({
            championId: data.specialPrediction.championId ?? null,
            runnerUpId: data.specialPrediction.runnerUpId ?? null,
            thirdPlaceId: data.specialPrediction.thirdPlaceId ?? null,
            goldenBoot1: data.specialPrediction.goldenBoot1 ?? "",
            goldenBoot2: data.specialPrediction.goldenBoot2 ?? "",
            goldenBoot3: data.specialPrediction.goldenBoot3 ?? "",
            goldenBall1: data.specialPrediction.goldenBall1 ?? "",
            goldenBall2: data.specialPrediction.goldenBall2 ?? "",
            goldenBall3: data.specialPrediction.goldenBall3 ?? "",
          });
        }
      })
      .catch(console.error);
  }, [status]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const matches = Object.entries(matchPreds).map(([id, p]) => ({
        matchId: parseInt(id),
        homeScore: p.homeScore,
        awayScore: p.awayScore,
      }));
      const groups = Object.entries(groupPreds).map(([groupId, p]) => ({ groupId, ...p }));

      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matches, groups, knockouts: knockoutPreds, special }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Save failed");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return <div className="text-center py-12 text-gray-400">Loading…</div>;
  }

  if (status === "unauthenticated") return null;

  const groupMatches = WC2026_MATCHES.filter((m) => m.round === "GROUP" && m.groupId === groupTab);
  const getTeam = (id?: number | null) => WC2026_TEAMS.find((t) => t.id === id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-wc-darkblue">🎯 My Predictions</h1>
          {isReadOnly ? (
            <p className="text-sm text-gray-500 mt-1">Prediction deadline has passed — view only</p>
          ) : (
            <p className="text-sm text-gray-500 mt-1">
              Deadline: <strong>June 10, 2026 at 23:59 UTC</strong>
            </p>
          )}
        </div>
        {!isReadOnly && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? "Saving…" : saved ? "✅ Saved!" : "💾 Save All"}
          </button>
        )}
      </div>

      {error && <div className="alert-error">{error}</div>}

      {/* Main tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-0">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={tab === t ? "tab-active" : "tab-inactive"}
          >
            {t}
          </button>
        ))}
      </div>

      {/* === GROUP MATCHES TAB === */}
      {tab === "Group Matches" && (
        <div className="space-y-4">
          {/* Group selector */}
          <div className="group-tabs">
            {GROUPS.map((g) => (
              <button
                key={g}
                onClick={() => setGroupTab(g)}
                className={groupTab === g ? "tab-active" : "tab-inactive"}
              >
                Group {g}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {groupMatches.map((match) => {
              const homeTeam = getTeam(match.homeTeamId);
              const awayTeam = getTeam(match.awayTeamId);
              const pred = matchPreds[match.matchNumber] ?? { homeScore: 0, awayScore: 0 };

              return (
                <div
                  key={match.matchNumber}
                  className={`match-card flex items-center gap-3 ${match.isBonusGame ? "border-wc-gold border-2" : ""}`}
                >
                  {match.isBonusGame && (
                    <span className="text-xs font-bold text-wc-red bg-yellow-100 px-2 py-0.5 rounded">BONUS ×3</span>
                  )}
                  <div className="flex-1 flex items-center gap-2">
                    <TeamFlag team={homeTeam} />
                    <ScoreInput
                      value={pred.homeScore}
                      onChange={(v) =>
                        !isReadOnly &&
                        setMatchPreds((p) => ({ ...p, [match.matchNumber]: { ...pred, homeScore: v } }))
                      }
                      disabled={isReadOnly}
                    />
                    <span className="text-gray-400 font-bold">-</span>
                    <ScoreInput
                      value={pred.awayScore}
                      onChange={(v) =>
                        !isReadOnly &&
                        setMatchPreds((p) => ({ ...p, [match.matchNumber]: { ...pred, awayScore: v } }))
                      }
                      disabled={isReadOnly}
                    />
                    <TeamFlag team={awayTeam} />
                  </div>
                  {match.matchDate && (
                    <span className="text-xs text-gray-400 hidden md:block">
                      {new Date(match.matchDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* === GROUP STANDINGS TAB === */}
      {tab === "Group Standings" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GROUPS.map((g) => {
            const teams = getTeamsByGroup(g);
            const pred = groupPreds[g] ?? { pos1TeamId: 0, pos2TeamId: 0, pos3TeamId: 0, pos4TeamId: 0 };
            const positions = [pred.pos1TeamId, pred.pos2TeamId, pred.pos3TeamId, pred.pos4TeamId];

            const setPos = (pos: number, teamId: number) => {
              if (isReadOnly) return;
              const newPred = { ...pred };
              const keys = ["pos1TeamId", "pos2TeamId", "pos3TeamId", "pos4TeamId"] as const;
              // Remove team from any existing position
              for (const k of keys) {
                if (newPred[k] === teamId) newPred[k] = 0;
              }
              newPred[keys[pos]] = teamId;
              setGroupPreds((p) => ({ ...p, [g]: newPred }));
            };

            return (
              <div key={g} className="card space-y-3">
                <h3 className="font-bold text-wc-darkblue">Group {g}</h3>
                <div className="space-y-1">
                  {[1, 2, 3, 4].map((pos) => {
                    const selectedTeamId = positions[pos - 1];
                    const selectedTeam = getTeam(selectedTeamId);
                    return (
                      <div key={pos} className="flex items-center gap-2">
                        <span className="w-6 text-sm font-bold text-gray-500">{pos}.</span>
                        <select
                          className="form-input flex-1 text-sm"
                          value={selectedTeamId || ""}
                          onChange={(e) => setPos(pos - 1, parseInt(e.target.value) || 0)}
                          disabled={isReadOnly}
                        >
                          <option value="">— Select team —</option>
                          {teams.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.flagEmoji} {t.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === KNOCKOUT TAB === */}
      {tab === "Knockout" && (
        <div className="space-y-6">
          <p className="text-sm text-gray-500">
            Predict which teams advance through each knockout round.
            Select any team — teams don&apos;t need to match your group predictions.
          </p>
          {(["R32", "R16", "QF", "SF", "THIRD", "FINAL"] as const).map((round) => {
            const roundMatches = WC2026_MATCHES.filter((m) => m.round === round);
            const slotsNeeded = round === "R32" ? 32 : round === "R16" ? 16 : round === "QF" ? 8 : round === "SF" ? 4 : 2;
            const roundLabels: Record<string, string> = {
              R32: "Round of 32", R16: "Round of 16", QF: "Quarter-finals",
              SF: "Semi-finals", THIRD: "3rd Place", FINAL: "Final",
            };
            const roundPreds = knockoutPreds.filter((k) => k.round === round);

            const setKnockoutTeam = (slot: number, teamId: number) => {
              if (isReadOnly) return;
              setKnockoutPreds((prev) => {
                const filtered = prev.filter((k) => !(k.round === round && k.slot === slot));
                if (teamId) filtered.push({ round, slot, teamId });
                return filtered;
              });
            };

            return (
              <div key={round} className="card space-y-3">
                <h3 className="font-bold text-wc-darkblue text-lg">{roundLabels[round]}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Array.from({ length: slotsNeeded }, (_, i) => i + 1).map((slot) => {
                    const slotPred = roundPreds.find((k) => k.slot === slot);
                    return (
                      <select
                        key={slot}
                        className="form-input text-sm"
                        value={slotPred?.teamId || ""}
                        onChange={(e) => setKnockoutTeam(slot, parseInt(e.target.value) || 0)}
                        disabled={isReadOnly}
                      >
                        <option value="">— Team {slot} —</option>
                        {WC2026_TEAMS.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.flagEmoji} {t.name}
                          </option>
                        ))}
                      </select>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === HONOR BOARD TAB === */}
      {tab === "Honor Board" && (
        <div className="max-w-lg space-y-6">
          <div className="card space-y-4">
            <h3 className="font-bold text-wc-darkblue">🏆 Final Standings</h3>
            {(["championId", "runnerUpId", "thirdPlaceId"] as const).map((field) => {
              const labels = { championId: "🥇 Champion (10pt)", runnerUpId: "🥈 Runner-up (5pt)", thirdPlaceId: "🥉 3rd Place (2pt)" };
              return (
                <div key={field}>
                  <label className="form-label">{labels[field]}</label>
                  <select
                    className="form-input"
                    value={special[field] || ""}
                    onChange={(e) =>
                      !isReadOnly && setSpecial((p) => ({ ...p, [field]: parseInt(e.target.value) || null }))
                    }
                    disabled={isReadOnly}
                  >
                    <option value="">— Select team —</option>
                    {WC2026_TEAMS.map((t) => (
                      <option key={t.id} value={t.id}>{t.flagEmoji} {t.name}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>

          <div className="card space-y-4">
            <h3 className="font-bold text-wc-darkblue">👟 Golden Boot (Top scorer)</h3>
            {(["goldenBoot1", "goldenBoot2", "goldenBoot3"] as const).map((field, i) => (
              <div key={field}>
                <label className="form-label">
                  {i === 0 ? "🥇 1st (5pt)" : i === 1 ? "🥈 2nd (5pt)*" : "🥉 3rd (5pt)*"}
                </label>
                <PlayerAutocomplete
                  value={special[field]}
                  onChange={(v) => !isReadOnly && setSpecial((p) => ({ ...p, [field]: v }))}
                  disabled={isReadOnly}
                />
              </div>
            ))}
            <p className="text-xs text-gray-400">* Only awarded if FIFA announces 2nd/3rd Golden Boot</p>
          </div>

          <div className="card space-y-4">
            <h3 className="font-bold text-wc-darkblue">⚽ Golden Ball (Best player)</h3>
            {(["goldenBall1", "goldenBall2", "goldenBall3"] as const).map((field, i) => (
              <div key={field}>
                <label className="form-label">
                  {i === 0 ? "🥇 1st (5pt)" : i === 1 ? "🥈 2nd (5pt)*" : "🥉 3rd (5pt)*"}
                </label>
                <PlayerAutocomplete
                  value={special[field]}
                  onChange={(v) => !isReadOnly && setSpecial((p) => ({ ...p, [field]: v }))}
                  disabled={isReadOnly}
                />
              </div>
            ))}
            <p className="text-xs text-gray-400">* Only awarded if FIFA announces 2nd/3rd Golden Ball</p>
          </div>
        </div>
      )}

      {/* Save button at bottom */}
      {!isReadOnly && (
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? "Saving…" : saved ? "✅ Saved!" : "💾 Save All Predictions"}
          </button>
        </div>
      )}
    </div>
  );
}

// Player autocomplete component
function PlayerAutocomplete({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [show, setShow] = useState(false);

  const handleChange = useCallback(
    (v: string) => {
      onChange(v);
      if (v.length >= 2) {
        const q = v.toLowerCase();
        setSuggestions(KNOWN_PLAYERS.filter((p) => p.toLowerCase().includes(q)).slice(0, 8));
        setShow(true);
      } else {
        setSuggestions([]);
        setShow(false);
      }
    },
    [onChange]
  );

  return (
    <div className="relative">
      <input
        type="text"
        className="form-input"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => setTimeout(() => setShow(false), 150)}
        placeholder="Type player name…"
        disabled={disabled}
      />
      {show && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-200 rounded-md shadow-lg w-full mt-1 max-h-48 overflow-y-auto">
          {suggestions.map((s) => (
            <li
              key={s}
              className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
              onMouseDown={() => { onChange(s); setShow(false); }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
