import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rules – Porra Mundial 2026",
};

export default function RulesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="wc-header-gradient rounded-2xl p-8 text-center text-white">
        <h1 className="text-3xl font-bold text-wc-gold">📋 Rules & Scoring</h1>
        <p className="text-gray-200 mt-2">How the Porra Mundial 2026 works</p>
      </div>

      <div className="card space-y-4">
        <h2 className="text-xl font-bold text-wc-darkblue border-b pb-2">⚽ Match Predictions</h2>
        <p className="text-gray-700">
          For every match (group stage and knockouts) you predict the exact final score at 90 minutes.
          For knockout matches that go to extra time, the <strong>120-minute score</strong> is used
          (penalty goals do not count).
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-wc-darkblue text-white">
                <th className="px-4 py-2 text-left">Correct prediction</th>
                <th className="px-4 py-2 text-center">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2">Correct result (Win/Draw/Loss)</td>
                <td className="px-4 py-2 text-center font-bold">1 pt</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-2">Correct result + correct goal difference</td>
                <td className="px-4 py-2 text-center font-bold">2 pt</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Exact score (includes above)</td>
                <td className="px-4 py-2 text-center font-bold">4 pt</td>
              </tr>
              <tr className="bg-yellow-50">
                <td className="px-4 py-2">
                  <strong>Bonus game</strong> — multiply all points × 3
                  <span className="ml-2 text-xs text-gray-500">(1 per group, 12 marked matches)</span>
                </td>
                <td className="px-4 py-2 text-center font-bold text-wc-red">×3 (max 12 pt)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500">
          One match per group is designated as the <strong>Bonus Game</strong> — all points earned for that match are tripled.
        </p>
      </div>

      <div className="card space-y-4">
        <h2 className="text-xl font-bold text-wc-darkblue border-b pb-2">🏟️ Group Standings</h2>
        <p className="text-gray-700">
          For each of the 12 groups (A–L), predict the final standings (1st, 2nd, 3rd, 4th).
          You earn <strong>1 point per correctly predicted position</strong>.
        </p>
        <div className="bg-blue-50 rounded-md px-4 py-3 text-sm text-blue-800">
          Example: If you correctly predict 1st and 3rd place but not 2nd and 4th → 2 points for that group.
        </div>
        <p className="text-sm text-gray-600">
          Maximum: 4 pts × 12 groups = <strong>48 points</strong>
        </p>
      </div>

      <div className="card space-y-4">
        <h2 className="text-xl font-bold text-wc-darkblue border-b pb-2">🏆 Knockout Advancement</h2>
        <p className="text-gray-700">
          Predict which teams advance through each knockout round. Points are awarded when a team you picked
          actually participates in that round.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-wc-darkblue text-white">
                <th className="px-4 py-2 text-left">Round</th>
                <th className="px-4 py-2 text-center">Teams</th>
                <th className="px-4 py-2 text-center">Points per team</th>
                <th className="px-4 py-2 text-center">Max</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { round: "Round of 32", teams: 32, pts: 1, max: 32 },
                { round: "Round of 16", teams: 16, pts: 2, max: 32 },
                { round: "Quarter-finals", teams: 8, pts: 2, max: 16 },
                { round: "Semi-finals", teams: 4, pts: 2, max: 8 },
                { round: "3rd Place match", teams: 2, pts: 2, max: 4 },
                { round: "Final", teams: 2, pts: 2, max: 4 },
              ].map((r, i) => (
                <tr key={r.round} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                  <td className="px-4 py-2">{r.round}</td>
                  <td className="px-4 py-2 text-center">{r.teams}</td>
                  <td className="px-4 py-2 text-center font-bold">{r.pts} pt</td>
                  <td className="px-4 py-2 text-center text-gray-500">{r.max} pt</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="text-xl font-bold text-wc-darkblue border-b pb-2">🌟 Honor Board</h2>
        <p className="text-gray-700">Predict the tournament special awards:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-wc-darkblue text-white">
                <th className="px-4 py-2 text-left">Prediction</th>
                <th className="px-4 py-2 text-center">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { label: "🏆 Champion", pts: 10 },
                { label: "🥈 Runner-up", pts: 5 },
                { label: "🥉 3rd Place", pts: 2 },
                { label: "👟 Golden Boot (1st scorer)", pts: 5 },
                { label: "👟 Golden Boot (2nd scorer)*", pts: 5 },
                { label: "👟 Golden Boot (3rd scorer)*", pts: 5 },
                { label: "⚽ Golden Ball (Best player)", pts: 5 },
                { label: "⚽ Golden Ball (2nd)*", pts: 5 },
                { label: "⚽ Golden Ball (3rd)*", pts: 5 },
              ].map((r, i) => (
                <tr key={r.label} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                  <td className="px-4 py-2">{r.label}</td>
                  <td className="px-4 py-2 text-center font-bold">{r.pts} pt</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500">
          * 2nd and 3rd Golden Boot/Ball are only awarded if FIFA officially announces them.
        </p>
      </div>

      <div className="card space-y-3">
        <h2 className="text-xl font-bold text-wc-darkblue border-b pb-2">📅 Deadlines & Rules</h2>
        <ul className="space-y-2 text-gray-700 list-none">
          <li className="flex gap-2">
            <span>🔒</span>
            <span>All predictions must be submitted before <strong>June 10, 2026 at 23:59 UTC</strong></span>
          </li>
          <li className="flex gap-2">
            <span>✏️</span>
            <span>You may edit predictions any number of times before the deadline</span>
          </li>
          <li className="flex gap-2">
            <span>👁️</span>
            <span>After the deadline, all predictions are visible to all participants</span>
          </li>
          <li className="flex gap-2">
            <span>⚖️</span>
            <span>The administrator may manually adjust scores in exceptional circumstances</span>
          </li>
          <li className="flex gap-2">
            <span>🎲</span>
            <span>Ties in the final ranking are broken by: Honor Board → Group Standings → alphabetical order</span>
          </li>
        </ul>
      </div>

      <div className="card bg-wc-darkblue text-white">
        <div className="text-center">
          <p className="text-wc-gold font-bold text-lg">Maximum Possible Score</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
            <div>
              <div className="text-2xl font-bold">432</div>
              <div className="text-gray-400">Group Matches</div>
            </div>
            <div>
              <div className="text-2xl font-bold">48</div>
              <div className="text-gray-400">Group Standings</div>
            </div>
            <div>
              <div className="text-2xl font-bold">~196</div>
              <div className="text-gray-400">Knockout (matches + adv.)</div>
            </div>
            <div>
              <div className="text-2xl font-bold">47</div>
              <div className="text-gray-400">Honor Board</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
