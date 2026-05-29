import { prisma } from "@/lib/prisma";
import { TEAMS as WC2026_TEAMS } from "@/lib/wc2026-data";
import { Round } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getData() {
  const [matches, predictions, users] = await Promise.all([
    prisma.match.findMany({ orderBy: { matchNumber: "asc" } }),
    prisma.matchPrediction.findMany({
      include: { user: { select: { alias: true } } },
    }),
    prisma.user.findMany({ select: { id: true, alias: true } }),
  ]);
  return { matches, predictions, users };
}

export default async function ResultsPage() {
  const { matches, predictions, users } = await getData();

  const scoredMatches = matches.filter((m) => m.isScored);
  const getTeam = (id?: number | null) => WC2026_TEAMS.find((t) => t.id === id);

  // Group by round
  const rounds = [Round.GROUP, Round.R32, Round.R16, Round.QF, Round.SF, Round.THIRD, Round.FINAL];
  const roundLabels: Record<string, string> = {
    GROUP: "Group Stage", R32: "Round of 32", R16: "Round of 16",
    QF: "Quarter-finals", SF: "Semi-finals", THIRD: "3rd Place", FINAL: "Final",
  };

  const byRound = new Map<string, typeof matches>();
  for (const m of matches) {
    const arr = byRound.get(m.round) ?? [];
    arr.push(m);
    byRound.set(m.round, arr);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-wc-darkblue">📊 Match Results</h1>
        <span className="text-sm text-gray-500">{scoredMatches.length} / {matches.length} matches played</span>
      </div>

      {rounds.map((round) => {
        const roundMatches = byRound.get(round) ?? [];
        if (roundMatches.length === 0) return null;

        return (
          <div key={round} className="card space-y-3">
            <h2 className="text-lg font-bold text-wc-darkblue border-b pb-2">{roundLabels[round]}</h2>
            <div className="space-y-2">
              {roundMatches.map((m) => {
                const homeTeam = getTeam(m.homeTeamId);
                const awayTeam = getTeam(m.awayTeamId);
                const matchPreds = predictions.filter((p) => p.matchId === m.id);

                return (
                  <div key={m.id} className={`rounded-lg border ${m.isScored ? "border-green-200 bg-green-50" : "border-gray-200 bg-white"} p-3`}>
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Teams and score */}
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-sm font-medium flex items-center gap-1">
                          {homeTeam ? <>{homeTeam.flagEmoji} {homeTeam.code}</> : m.homeSlotLabel}
                        </span>
                        {m.isScored ? (
                          <span className="font-bold text-lg text-wc-darkblue px-2">
                            {m.homeScoreAet != null
                              ? `${m.homeScoreAet}–${m.awayScoreAet}`
                              : `${m.homeScore}–${m.awayScore}`}
                            {m.homeScoreAet != null && (
                              <span className="text-xs text-gray-400 ml-1">AET</span>
                            )}
                          </span>
                        ) : (
                          <span className="text-gray-400 px-2">vs</span>
                        )}
                        <span className="text-sm font-medium flex items-center gap-1">
                          {awayTeam ? <>{awayTeam.code} {awayTeam.flagEmoji}</> : m.awaySlotLabel}
                        </span>
                        {m.isBonusGame && (
                          <span className="text-xs bg-yellow-100 text-wc-red font-bold px-1.5 py-0.5 rounded">BONUS</span>
                        )}
                      </div>

                      {/* Date */}
                      {m.matchDate && (
                        <span className="text-xs text-gray-400">
                          {new Date(m.matchDate).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>

                    {/* Predictions (only after deadline or when match is scored) */}
                    {m.isScored && matchPreds.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-100 flex flex-wrap gap-2">
                        {matchPreds.map((p) => {
                          const correct = p.homeScore === (m.homeScoreAet ?? m.homeScore) && p.awayScore === (m.awayScoreAet ?? m.awayScore);
                          return (
                            <span
                              key={p.userId}
                              className={`text-xs px-2 py-0.5 rounded-full ${correct ? "bg-green-100 text-green-800 font-bold" : "bg-gray-100 text-gray-600"}`}
                              title={p.user.alias}
                            >
                              {p.user.alias}: {p.homeScore}–{p.awayScore}
                              {p.points != null && <span className="ml-1 text-gray-400">({p.points}pt)</span>}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {scoredMatches.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">⏳</div>
          <p className="text-lg">Tournament hasn&apos;t started yet</p>
          <p className="text-sm mt-1">Check back after June 11, 2026!</p>
        </div>
      )}
    </div>
  );
}
