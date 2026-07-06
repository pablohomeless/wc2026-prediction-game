/**
 * roundof16-data.js — Round of 16 "Extra Points" mini-game data
 *
 * Two knockout games:
 *   • Brazil vs Norway   → actual: Norway won, 90' score Brazil 1 – 2 Norway
 *   • Mexico vs England  → actual: England won, 90' score Mexico 2 – 3 England
 *
 * SCORING
 *   • Game winner (team that qualifies to the Round of 8, after
 *     regular + extra time + penalties)  →  2 points per game
 *   • Exact result at the end of the 90 minutes (before extra time
 *     and penalties)                      →  3 points per game
 *
 * Aliases below come from the MASTER predictions file
 * (FIFA World Cup 2026 — FinalPredictions-CSV.csv), matched by email.
 * Some participants never submitted a Round of 16 prediction — they are
 * NOT listed here; the page renders them as empty/grey rows by comparing
 * against PARTICIPANTS in data.js.
 *
 * Depends on data.js (TEAMS, FLAG_ICONS, flagHtml, PARTICIPANTS, calcPoints, ACTUAL_RESULTS).
 */

// ─── Match definitions ────────────────────────────────────────────────────────
const R16_MATCHES = {
  braNor: { key: "braNor", home: "BRA", away: "NOR", title: "Brazil vs Norway" },
  mexEng: { key: "mexEng", home: "MEX", away: "ENG", title: "Mexico vs England" },
};

// ─── Actual results (FINAL) ───────────────────────────────────────────────────
// winner : team code that advanced (after ET + penalties)
// home   : goals for the home team at the 90' mark (before ET/penalties)
// away   : goals for the away team at the 90' mark (before ET/penalties)
const R16_ACTUAL = {
  braNor: { winner: "NOR", home: 1, away: 2 }, // Norway won · Brazil 1 – 2 Norway (90')
  mexEng: { winner: "ENG", home: 2, away: 3 }, // England won · Mexico 2 – 3 England (90')
};

// ─── Predictions (FINAL set) ──────────────────────────────────────────────────
// Each entry:
//   alias   : display name (from master file, by email — never email/full name)
//   braNor  : { winner, home, away }  → home = Brazil goals, away = Norway goals (90')
//   mexEng  : { winner, home, away }  → home = Mexico goals, away = England goals (90')
const R16_PREDICTIONS = [
  { alias: "FreeCopilot",              braNor: { winner: "BRA", home: 3, away: 2 }, mexEng: { winner: "ENG", home: 1, away: 1 } },
  { alias: "Baihas",                   braNor: { winner: "BRA", home: 3, away: 1 }, mexEng: { winner: "MEX", home: 2, away: 1 } },
  { alias: "Dominique Dusabeyezu",     braNor: { winner: "BRA", home: 3, away: 1 }, mexEng: { winner: "ENG", home: 2, away: 3 } },
  { alias: "Heinpe",                   braNor: { winner: "BRA", home: 4, away: 2 }, mexEng: { winner: "ENG", home: 1, away: 3 } },
  { alias: "Grandma",                  braNor: { winner: "BRA", home: 3, away: 1 }, mexEng: { winner: "MEX", home: 4, away: 2 } },
  { alias: "chverstr",                 braNor: { winner: "BRA", home: 2, away: 1 }, mexEng: { winner: "MEX", home: 2, away: 1 } },
  { alias: "coguiu",                   braNor: { winner: "BRA", home: 3, away: 1 }, mexEng: { winner: "ENG", home: 1, away: 1 } },
  { alias: "Kunal Parmar",             braNor: { winner: "BRA", home: 2, away: 1 }, mexEng: { winner: "MEX", home: 2, away: 1 } },
  { alias: "NotAFan",                  braNor: { winner: "BRA", home: 2, away: 0 }, mexEng: { winner: "ENG", home: 2, away: 3 } },
  { alias: "Manuel Neuer Versuch",     braNor: { winner: "BRA", home: 3, away: 2 }, mexEng: { winner: "MEX", home: 3, away: 2 } },
  { alias: "Wrong shaped ball",        braNor: { winner: "BRA", home: 2, away: 1 }, mexEng: { winner: "ENG", home: 1, away: 2 } },
  { alias: "Patriot",                  braNor: { winner: "BRA", home: 3, away: 2 }, mexEng: { winner: "ENG", home: 1, away: 2 } },
  { alias: "Laurence Evans / levans",  braNor: { winner: "BRA", home: 2, away: 1 }, mexEng: { winner: "ENG", home: 2, away: 3 } },
  { alias: "Maya",                     braNor: { winner: "BRA", home: 3, away: 1 }, mexEng: { winner: "MEX", home: 1, away: 0 } },
  { alias: "rutrac",                   braNor: { winner: "BRA", home: 2, away: 1 }, mexEng: { winner: "ENG", home: 1, away: 2 } },
  { alias: "Alberto",                  braNor: { winner: "BRA", home: 3, away: 1 }, mexEng: { winner: "MEX", home: 1, away: 0 } },
  { alias: "Josunefo",                 braNor: { winner: "BRA", home: 3, away: 2 }, mexEng: { winner: "ENG", home: 1, away: 2 } },
  { alias: "Agentic",                  braNor: { winner: "NOR", home: 1, away: 2 }, mexEng: { winner: "ENG", home: 1, away: 3 } },
  { alias: "Ohad Demri",               braNor: { winner: "BRA", home: 2, away: 1 }, mexEng: { winner: "ENG", home: 1, away: 2 } },
  { alias: "Santi (snunez)",           braNor: { winner: "BRA", home: 2, away: 1 }, mexEng: { winner: "ENG", home: 1, away: 2 } },
  { alias: "Mo Abdelaziz",             braNor: { winner: "BRA", home: 2, away: 1 }, mexEng: { winner: "ENG", home: 2, away: 3 } },
  { alias: "Alfred",                   braNor: { winner: "BRA", home: 3, away: 2 }, mexEng: { winner: "ENG", home: 2, away: 4 } },
  { alias: "Zamankar",                 braNor: { winner: "BRA", home: 2, away: 1 }, mexEng: { winner: "ENG", home: 0, away: 2 } },
];

// ─── Scoring ──────────────────────────────────────────────────────────────────
const R16_POINTS_WINNER = 2; // correct qualifier (after ET + penalties)
const R16_POINTS_EXACT  = 3; // exact 90-minute result

// Points for one match prediction vs the actual result.
// Returns { winner, exact, total }. If the actual result is not known yet,
// all values are 0 (nothing to score).
function r16MatchPoints(pred, actual) {
  const res = { winner: 0, exact: 0, total: 0 };
  if (!pred || !actual) return res;
  if (actual.winner && pred.winner === actual.winner) {
    res.winner = R16_POINTS_WINNER;
  }
  if (actual.home != null && actual.away != null &&
      pred.home === actual.home && pred.away === actual.away) {
    res.exact = R16_POINTS_EXACT;
  }
  res.total = res.winner + res.exact;
  return res;
}

// Whether both Round of 16 games have final results entered.
function r16HasResults() {
  return R16_ACTUAL.braNor.winner != null && R16_ACTUAL.mexEng.winner != null;
}

// Full extra-point breakdown for a given alias.
// played=false when the person never submitted a Round of 16 prediction.
function r16PointsFor(alias) {
  const p = R16_PREDICTIONS.find(x => x.alias === alias);
  if (!p) {
    return {
      played: false,
      braNor: { winner: 0, exact: 0, total: 0 },
      mexEng: { winner: 0, exact: 0, total: 0 },
      total: 0,
    };
  }
  const braNor = r16MatchPoints(p.braNor, R16_ACTUAL.braNor);
  const mexEng = r16MatchPoints(p.mexEng, R16_ACTUAL.mexEng);
  return { played: true, braNor, mexEng, total: braNor.total + mexEng.total };
}

// Average extra points among the people who actually played (fairness suggestion
// for the participants who never submitted a Round of 16 prediction).
function r16AveragePlayed() {
  if (!R16_PREDICTIONS.length) return 0;
  const sum = R16_PREDICTIONS.reduce((s, p) => s + r16PointsFor(p.alias).total, 0);
  return sum / R16_PREDICTIONS.length;
}

// Standard competition ranking (ties share the best rank).
function r16RankMap(rows, key) {
  const map = {};
  rows.forEach(r => {
    map[r.alias] = 1 + rows.filter(o => o[key] > r[key]).length;
  });
  return map;
}

// How the leaderboard positions shifted purely because of the R16 extra points.
// Needs PARTICIPANTS + calcPoints + ACTUAL_RESULTS from data.js/live-data.js.
// Returns { climber, faller, rows } or null if base scoring isn't available.
function r16PositionShifts() {
  if (typeof PARTICIPANTS === "undefined" || typeof calcPoints !== "function" ||
      typeof ACTUAL_RESULTS === "undefined") {
    return null;
  }
  const rows = PARTICIPANTS.map(p => {
    const base = calcPoints(p, ACTUAL_RESULTS).total;
    const extra = r16PointsFor(p.alias).total;
    return { alias: p.alias, base, extra, withExtra: base + extra };
  });
  const rBase = r16RankMap(rows, "base");
  const rWith = r16RankMap(rows, "withExtra");
  rows.forEach(r => {
    r.rankBase = rBase[r.alias];
    r.rankWith = rWith[r.alias];
    r.delta = r.rankBase - r.rankWith; // positive = climbed
  });
  const climber = rows.slice().sort((a, b) => b.delta - a.delta || b.extra - a.extra)[0];
  const faller  = rows.slice().sort((a, b) => a.delta - b.delta || a.extra - b.extra)[0];
  return { climber, faller, rows };
}

// A fun, country-flavoured highlight based ONLY on the Round of 16 bonus results:
// the round's top scorer(s) and how many drew a blank.
// Returns an HTML string (two tiles) or '' if results aren't ready.
function r16FunStatHtml() {
  if (!r16HasResults()) return "";
  const esc = s => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const scored = R16_PREDICTIONS.map(p => {
    const info = r16PointsFor(p.alias);
    return {
      alias: p.alias,
      pts: info.total,
      calledNor: p.braNor.winner === "NOR",
      norExact: info.braNor.exact > 0,
    };
  });
  if (!scored.length) return "";

  const top = Math.max.apply(null, scored.map(s => s.pts));
  const heroes = scored.filter(s => s.pts === top)
    .sort((a, b) => a.alias.localeCompare(b.alias));
  const runnersUp = scored.filter(s => s.pts > 0 && s.pts < top).length;
  const zeros = scored.filter(s => s.pts === 0);

  const heroNames = heroes.map(h => `<strong>${esc(h.alias)}</strong>`).join(", ");
  const heroFact = heroes.some(h => h.calledNor && h.norExact)
    ? `🇳🇴 The only one to back the <strong>Norway</strong> upset over Brazil <em>and</em> nail the exact 1–2 — a closet Viking scholar who clearly knew Norway have never lost to the Seleção (ask them about France '98). Bevisst valg.`
    : `🎯 Ice-cold reading of the Round of 16.`;

  const heroTile = `
    <div class="fun-tile green">
      <div class="ft-emoji">🏆</div>
      <div class="ft-title">Round of 16 MVP — ${top} pts</div>
      <div class="ft-body">${heroNames} topped the bonus round with <strong>${top} point${top === 1 ? "" : "s"}</strong>.
        ${heroFact}${runnersUp ? ` <span style="color:var(--gray-500)">(${runnersUp} others also got on the board.)</span>` : ""}</div>
    </div>`;

  const coldTile = zeros.length ? `
    <div class="fun-tile red">
      <div class="ft-emoji">🥶</div>
      <div class="ft-title">Ice-cold cards — 0 pts</div>
      <div class="ft-body"><strong>${zeros.length}</strong> player${zeros.length === 1 ? "" : "s"} drew a complete blank.
        Nearly everyone trusted the five-time champions — but Brazil (and Mexico) went home. 🇧🇷 The script had other ideas.</div>
    </div>` : "";

  return heroTile + coldTile;
}

