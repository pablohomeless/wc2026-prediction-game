import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Play – Porra Mundial 2026",
  description: "Step-by-step guide to entering your World Cup 2026 predictions and earning points.",
};

const steps = [
  {
    icon: "📝",
    title: "Register",
    body: "Click Register in the top-right corner, choose a display name (this is what everyone sees on the scoreboard) and enter your email and a password.",
  },
  {
    icon: "⏰",
    title: "Check the deadline",
    body: "All predictions lock at the deadline shown on the Predictions page. Once it passes no changes are possible — don't leave it to the last minute.",
  },
  {
    icon: "⚽",
    title: "Predict group-stage scores",
    body: "Go to Predictions → Group Stage tab. For each of the 72 group matches type the score you expect at full time. You can save and come back as often as you like before the deadline.",
  },
  {
    icon: "📊",
    title: "Predict group standings",
    body: "Switch to the Standings tab and set the finishing order (1st–4th) for all 12 groups. Each team you place correctly earns 1 point.",
  },
  {
    icon: "⭐",
    title: "Special picks",
    body: "On the Special tab pick the tournament Champion, Runner-up and 3rd-place team. Also enter up to 3 names for the Golden Boot (top scorer) and Golden Ball (best player). You only need one of your three slots to match the real winner to earn the points.",
  },
  {
    icon: "🔄",
    title: "Follow the results",
    body: "Once the tournament begins check the Results page to see how matches ended and how many points each result earned you. The Scoreboard on the home page updates automatically.",
  },
];

const faqs = [
  {
    q: "Can I change my predictions after saving?",
    a: "Yes — as many times as you like before the deadline. Just reload the Predictions page, edit and save again.",
  },
  {
    q: "What score counts for knockout matches?",
    a: "The score at 90 minutes (regular time). If a match goes to extra time, the 120-minute score is used. Penalty shoot-out goals don't count.",
  },
  {
    q: "Do I need to predict knockout brackets?",
    a: "Only group-stage scores and standings are collected before the tournament. Your points come from those plus the special picks (Champion, Runner-up, etc.).",
  },
  {
    q: "What if I forget to save a tab?",
    a: "Each tab (Group Stage, Standings, Special) has its own Save button. An unsaved tab is lost when the deadline passes — save each one separately.",
  },
  {
    q: "What happens if two players have the same score?",
    a: "Tiebreakers in order: (1) most group-match points, (2) most special-pick points, (3) most standings points, (4) alphabetical by display name.",
  },
  {
    q: "Can I see other players' predictions before the deadline?",
    a: "No. Predictions are hidden until the deadline passes, then everyone can see all picks.",
  },
];

export default function HowToPlayPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero */}
      <div className="wc-header-gradient rounded-2xl p-8 text-center text-white">
        <div className="text-5xl mb-3">🎯</div>
        <h1 className="text-3xl font-bold text-wc-gold">How to Play</h1>
        <p className="text-gray-200 mt-2">
          Everything you need to know to enter your predictions and earn points
        </p>
      </div>

      {/* Steps */}
      <div className="card">
        <h2 className="text-xl font-bold text-wc-darkblue border-b pb-2 mb-4">📋 Step by step</h2>
        <ol className="space-y-0 divide-y divide-gray-100">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-4 py-4">
              <span className="text-3xl leading-none flex-shrink-0 mt-0.5">{step.icon}</span>
              <div>
                <div className="font-bold text-wc-darkblue mb-1">
                  Step {i + 1} — {step.title}
                </div>
                <p className="text-gray-600 text-sm">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Scoring */}
      <div className="card space-y-5">
        <h2 className="text-xl font-bold text-wc-darkblue border-b pb-2">🏆 How points are earned</h2>

        <div>
          <h3 className="font-semibold text-wc-darkblue mb-3">Match scores</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { pts: "4", label: "Exact score", note: "e.g. said 2–1, ended 2–1", color: "border-green-500 text-green-700" },
              { pts: "2", label: "Right winner + margin", note: "e.g. said 2–1, ended 3–2", color: "border-blue-500 text-blue-700" },
              { pts: "1", label: "Right winner only", note: "e.g. said 2–0, ended 1–0", color: "border-amber-500 text-amber-700" },
              { pts: "0", label: "Wrong outcome", note: "e.g. said home win, was draw", color: "border-gray-300 text-gray-400" },
            ].map((r) => (
              <div key={r.pts} className={`bg-white rounded-xl border-l-4 ${r.color} shadow-sm p-3 text-center`}>
                <div className={`text-3xl font-extrabold ${r.color.split(" ")[1]}`}>{r.pts}</div>
                <div className="text-xs font-semibold mt-1 text-gray-700">{r.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{r.note}</div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
            ⚡ <strong>Bonus match:</strong> One match per group is marked as a bonus match — all points for that match are <strong>tripled</strong> (so an exact score = 12 pts instead of 4).
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-wc-darkblue mb-2">Group standings</h3>
          <p className="text-gray-600 text-sm">
            <strong>+1 point</strong> for each team you correctly place in its final group position (1st, 2nd, 3rd or 4th).
            Maximum 4 pts per group × 12 groups = <strong>48 pts total</strong>.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-wc-darkblue mb-3">Special picks</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-wc-darkblue text-white">
                  <th className="px-4 py-2 text-left rounded-tl-lg">Pick</th>
                  <th className="px-4 py-2 text-center rounded-tr-lg">Points if correct</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ["🏆 Champion", "10 pts"],
                  ["🥈 Runner-up", "5 pts"],
                  ["🥉 3rd Place", "2 pts"],
                  ["👟 Golden Boot (any of your 3 slots matches the winner)", "5 pts"],
                  ["🏅 Golden Ball (any of your 3 slots matches the winner)", "5 pts"],
                ].map(([pick, pts]) => (
                  <tr key={pick} className="even:bg-gray-50">
                    <td className="px-4 py-2">{pick}</td>
                    <td className="px-4 py-2 text-center font-bold">{pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="card space-y-0 divide-y divide-gray-100">
        <h2 className="text-xl font-bold text-wc-darkblue pb-3">❓ Frequently asked questions</h2>
        {faqs.map((faq, i) => (
          <details key={i} className="py-3 group" {...(i === 0 ? { open: true } : {})}>
            <summary className="cursor-pointer font-semibold text-wc-darkblue flex items-center gap-2 list-none select-none">
              <span className="text-blue-600 group-open:rotate-90 transition-transform inline-block">›</span>
              {faq.q}
            </summary>
            <p className="mt-2 text-gray-600 text-sm pl-5">{faq.a}</p>
          </details>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center py-4">
        <Link href="/predictions" className="btn-gold text-base px-8 py-3 inline-block">
          Go to My Predictions ⚽
        </Link>
        <p className="text-sm text-gray-400 mt-2">
          Not registered yet?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
