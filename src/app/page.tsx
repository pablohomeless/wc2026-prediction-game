import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getScoreboard() {
  const scores = await prisma.userScore.findMany({
    include: { user: { select: { alias: true } } },
    orderBy: { pointsTotal: "desc" },
  });
  return scores;
}

async function getSettings() {
  return prisma.tournamentSettings.findUnique({ where: { id: 1 } });
}



export default async function HomePage() {
  const [scores, settings] = await Promise.all([getScoreboard(), getSettings()]);
  const deadlinePassed = settings?.predictionDeadline
    ? new Date() > settings.predictionDeadline
    : false;

  const medalEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="wc-header-gradient rounded-2xl p-8 text-center text-white shadow-xl">
        <div className="text-5xl mb-3">⚽</div>
        <h1 className="text-3xl md:text-4xl font-bold text-wc-gold mb-2">
          Porra Mundial 2026
        </h1>
        <p className="text-gray-200 text-lg">FIFA World Cup USA / Mexico / Canada</p>
        {!deadlinePassed && (
          <div className="mt-4 inline-block bg-white/10 rounded-lg px-4 py-2">
            <span className="text-wc-gold font-semibold">Prediction Deadline:</span>{" "}
            <span className="text-white">June 10, 2026 at 23:59 UTC</span>
          </div>
        )}
        {!deadlinePassed && (
          <div className="mt-4 flex justify-center gap-3">
            <Link href="/register" className="btn-gold">
              Register & Play
            </Link>
            <Link href="/rules" className="btn-secondary !bg-transparent !text-white !border-white hover:!bg-white/10">
              View Rules
            </Link>
          </div>
        )}
      </div>

      {/* Scoreboard */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-wc-darkblue flex items-center gap-2">
            🏆 Leaderboard
          </h2>
          {scores.length > 0 && (
            <span className="text-sm text-gray-500">{scores.length} participant{scores.length !== 1 ? "s" : ""}</span>
          )}
        </div>

        {scores.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">🎯</div>
            <p className="text-lg font-medium">No participants yet</p>
            <p className="text-sm mt-1">Be the first to register!</p>
            <Link href="/register" className="btn-primary mt-4 inline-block">Register Now</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="pb-2 pr-3 w-12 text-center">#</th>
                  <th className="pb-2 pr-3">Player</th>
                  <th className="pb-2 pr-3 text-center">Group<br/>Matches</th>
                  <th className="pb-2 pr-3 text-center">Group<br/>Standings</th>
                  <th className="pb-2 pr-3 text-center">Knockout<br/>Matches</th>
                  <th className="pb-2 pr-3 text-center">Advancement</th>
                  <th className="pb-2 pr-3 text-center">Honor<br/>Board</th>
                  <th className="pb-2 text-center font-bold text-wc-darkblue">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((s, idx) => {
                  const rank = idx + 1;
                  const rowClass =
                    rank === 1 ? "rank-gold" :
                    rank === 2 ? "rank-silver" :
                    rank === 3 ? "rank-bronze" :
                    "hover:bg-gray-50";

                  const knockoutMatches =
                    (s.pointsR32 ?? 0) + (s.pointsR16 ?? 0) + (s.pointsQF ?? 0) +
                    (s.pointsSF ?? 0) + (s.pointsThird ?? 0) + (s.pointsFinal ?? 0);
                  const advancement =
                    (s.pointsR32Advancement ?? 0) + (s.pointsR16Advancement ?? 0) + (s.pointsQFAdvancement ?? 0) +
                    (s.pointsSFAdvancement ?? 0);

                  return (
                    <tr key={s.userId} className={`border-b border-gray-100 transition-colors ${rowClass}`}>
                      <td className="py-3 pr-3 text-center font-bold text-gray-500">
                        {medalEmoji(rank) ?? rank}
                      </td>
                      <td className="py-3 pr-3 font-semibold text-gray-800">
                        {s.user.alias}
                      </td>
                      <td className="py-3 pr-3 text-center text-gray-600">{s.pointsGroupMatches ?? 0}</td>
                      <td className="py-3 pr-3 text-center text-gray-600">{s.pointsGroupStandings ?? 0}</td>
                      <td className="py-3 pr-3 text-center text-gray-600">{knockoutMatches}</td>
                      <td className="py-3 pr-3 text-center text-gray-600">{advancement}</td>
                      <td className="py-3 pr-3 text-center text-gray-600">{s.pointsHonorBoard ?? 0}</td>
                      <td className="py-3 text-center font-bold text-xl text-wc-darkblue">{s.pointsTotal ?? 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/results" className="card hover:shadow-lg transition-shadow text-center group">
          <div className="text-3xl mb-2">📊</div>
          <h3 className="font-bold text-wc-darkblue group-hover:underline">Match Results</h3>
          <p className="text-sm text-gray-500 mt-1">See all match scores and predictions comparison</p>
        </Link>
        <Link href="/predictions" className="card hover:shadow-lg transition-shadow text-center group">
          <div className="text-3xl mb-2">🎯</div>
          <h3 className="font-bold text-wc-darkblue group-hover:underline">My Predictions</h3>
          <p className="text-sm text-gray-500 mt-1">Enter or view your predictions</p>
        </Link>
        <Link href="/rules" className="card hover:shadow-lg transition-shadow text-center group">
          <div className="text-3xl mb-2">📋</div>
          <h3 className="font-bold text-wc-darkblue group-hover:underline">Rules & Scoring</h3>
          <p className="text-sm text-gray-500 mt-1">How points are calculated</p>
        </Link>
      </div>
    </div>
  );
}
