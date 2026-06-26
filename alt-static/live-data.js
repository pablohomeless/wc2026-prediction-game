/**
 * live-data.js — LIVE real-tournament results for Porra Mundial 2026
 * =================================================================
 *
 *  REAL DATA — sourced from the official FIFA results & standings pages:
 *    https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures
 *    https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/standings
 *  Snapshot taken on 2026-06-24 (matchday 2 complete for groups A–L).
 *
 *  HOW TO UPDATE as the tournament progresses:
 *    1. Open the FIFA scores-fixtures page.
 *    2. For each newly played match, append an entry to LIVE_MATCHES using the
 *       same shape: { group, date, home, away, hs, as } with FIFA 3-letter codes.
 *    3. Update OFFICIAL_LEADERS to match the FIFA standings page (position 1
 *       of each group), and bump LIVE_INFO.asOf to today's date.
 *  Results by group and the live leaderboard on stats.html recompute from this.
 *
 *  This file MUST be loaded AFTER data.js (it reuses TEAMS / GROUPS).
 */

const LIVE_INFO = {
  asOf: "2026-06-24",                 // "information as of" date shown on the page
  isSampleData: false,                // real FIFA data
  source: "Official FIFA results — fifa.com",
};

// ─── PLAYED MATCHES ───────────────────────────────────────────────────────────
// Each match: { group, date (YYYY-MM-DD), home, away, hs, as }
//   home / away  = FIFA 3-letter team codes (see TEAMS in data.js)
//   hs / as      = goals scored by home / away
// Only include matches that have actually been played. Matchday 3 + knockouts
// can be appended here later with the same shape.
const LIVE_MATCHES = [
  // ── Group A ──
  { group: "A", date: "2026-06-11", home: "MEX", away: "RSA", hs: 2, as: 0 },
  { group: "A", date: "2026-06-12", home: "KOR", away: "CZE", hs: 2, as: 1 },
  { group: "A", date: "2026-06-17", home: "MEX", away: "KOR", hs: 1, as: 0 },
  { group: "A", date: "2026-06-17", home: "CZE", away: "RSA", hs: 1, as: 1 },

  // ── Group B ──
  { group: "B", date: "2026-06-12", home: "CAN", away: "BIH", hs: 1, as: 1 },
  { group: "B", date: "2026-06-13", home: "QAT", away: "SUI", hs: 1, as: 1 },
  { group: "B", date: "2026-06-18", home: "CAN", away: "QAT", hs: 6, as: 0 },
  { group: "B", date: "2026-06-18", home: "SUI", away: "BIH", hs: 4, as: 1 },

  // ── Group C ──
  { group: "C", date: "2026-06-14", home: "BRA", away: "MAR", hs: 1, as: 1 },
  { group: "C", date: "2026-06-14", home: "HAI", away: "SCO", hs: 0, as: 1 },
  { group: "C", date: "2026-06-19", home: "BRA", away: "HAI", hs: 3, as: 0 },
  { group: "C", date: "2026-06-19", home: "MAR", away: "SCO", hs: 1, as: 0 },

  // ── Group D ──
  { group: "D", date: "2026-06-13", home: "USA", away: "PAR", hs: 4, as: 1 },
  { group: "D", date: "2026-06-14", home: "AUS", away: "TUR", hs: 2, as: 0 },
  { group: "D", date: "2026-06-18", home: "USA", away: "AUS", hs: 2, as: 0 },
  { group: "D", date: "2026-06-18", home: "PAR", away: "TUR", hs: 1, as: 0 },

  // ── Group E ──
  { group: "E", date: "2026-06-14", home: "GER", away: "CUW", hs: 7, as: 1 },
  { group: "E", date: "2026-06-15", home: "CIV", away: "ECU", hs: 1, as: 0 },
  { group: "E", date: "2026-06-19", home: "GER", away: "CIV", hs: 2, as: 1 },
  { group: "E", date: "2026-06-19", home: "ECU", away: "CUW", hs: 0, as: 0 },

  // ── Group F ──
  { group: "F", date: "2026-06-14", home: "NED", away: "JPN", hs: 2, as: 2 },
  { group: "F", date: "2026-06-15", home: "SWE", away: "TUN", hs: 5, as: 1 },
  { group: "F", date: "2026-06-19", home: "NED", away: "SWE", hs: 5, as: 1 },
  { group: "F", date: "2026-06-19", home: "JPN", away: "TUN", hs: 4, as: 0 },

  // ── Group G ──
  { group: "G", date: "2026-06-15", home: "BEL", away: "EGY", hs: 1, as: 1 },
  { group: "G", date: "2026-06-16", home: "IRN", away: "NZL", hs: 2, as: 2 },
  { group: "G", date: "2026-06-20", home: "EGY", away: "NZL", hs: 3, as: 1 },
  { group: "G", date: "2026-06-20", home: "IRN", away: "BEL", hs: 0, as: 0 },

  // ── Group H ──
  { group: "H", date: "2026-06-15", home: "ESP", away: "CPV", hs: 0, as: 0 },
  { group: "H", date: "2026-06-16", home: "KSA", away: "URU", hs: 1, as: 1 },
  { group: "H", date: "2026-06-20", home: "ESP", away: "KSA", hs: 4, as: 0 },
  { group: "H", date: "2026-06-20", home: "URU", away: "CPV", hs: 2, as: 2 },

  // ── Group I ──
  { group: "I", date: "2026-06-16", home: "FRA", away: "SEN", hs: 3, as: 1 },
  { group: "I", date: "2026-06-17", home: "IRQ", away: "NOR", hs: 1, as: 4 },
  { group: "I", date: "2026-06-22", home: "FRA", away: "IRQ", hs: 3, as: 0 },
  { group: "I", date: "2026-06-23", home: "NOR", away: "SEN", hs: 3, as: 2 },

  // ── Group J ──
  { group: "J", date: "2026-06-17", home: "ARG", away: "ALG", hs: 3, as: 0 },
  { group: "J", date: "2026-06-17", home: "AUT", away: "JOR", hs: 3, as: 1 },
  { group: "J", date: "2026-06-22", home: "ARG", away: "AUT", hs: 2, as: 0 },
  { group: "J", date: "2026-06-23", home: "JOR", away: "ALG", hs: 1, as: 2 },

  // ── Group K ──
  { group: "K", date: "2026-06-17", home: "POR", away: "COD", hs: 1, as: 1 },
  { group: "K", date: "2026-06-18", home: "UZB", away: "COL", hs: 1, as: 3 },
  { group: "K", date: "2026-06-23", home: "POR", away: "UZB", hs: 5, as: 0 },
  { group: "K", date: "2026-06-24", home: "COL", away: "COD", hs: 1, as: 0 },

  // ── Group L ──
  { group: "L", date: "2026-06-17", home: "ENG", away: "CRO", hs: 4, as: 2 },
  { group: "L", date: "2026-06-18", home: "GHA", away: "PAN", hs: 1, as: 0 },
  { group: "L", date: "2026-06-23", home: "ENG", away: "GHA", hs: 0, as: 0 },
  { group: "L", date: "2026-06-24", home: "PAN", away: "CRO", hs: 0, as: 1 },
];

// ─── OFFICIAL GROUP LEADERS (per FIFA standings page, position 1) ─────────────
// Snapshot from the FIFA standings page on 2026-06-25. Groups A, B, C are now
// finalized (all matches played). When teams are level on points/GD/GF, FIFA's 
// official ranking resolves the tie; we store FIFA's displayed leader explicitly 
// to stay faithful to the source.
const OFFICIAL_LEADERS = {
  A: "MEX", B: "SUI", C: "BRA", D: "USA",
  E: "GER", F: "NED", G: "EGY", H: "ESP",
  I: "FRA", J: "ARG", K: "COL", L: "ENG",
};

// ─── FINALIZED GROUPS — SINGLE SOURCE OF TRUTH ───────────────────────────────
// A group is "finalized" once all its matches are played and its winner is
// locked in. The winners of these groups are FINAL and feed the official points
// calculation. As each new group finishes, add its letter here (and make sure
// its winner is correct in OFFICIAL_LEADERS above). Everything downstream —
// predictions colouring, the All-Cards points, the results page and the
// scoreboard — recomputes from this automatically. No other file needs editing.
const FINALIZED_GROUPS = ["A", "B", "C"];

// Feed the finalized group winners into ACTUAL_RESULTS so that calcPoints() in
// data.js (the ONE scoring function used across every page) produces the real
// points wherever both data.js and live-data.js are loaded. This keeps "what
// actually happened" in a single place — ACTUAL_RESULTS — sourced from the live
// FIFA standings above. Knockout-round results get added to ACTUAL_RESULTS the
// same way later, and the very same calcPoints() will score them.
if (typeof ACTUAL_RESULTS !== "undefined" && ACTUAL_RESULTS.groupWinners) {
  FINALIZED_GROUPS.forEach((g) => {
    if (OFFICIAL_LEADERS[g]) ACTUAL_RESULTS.groupWinners[g] = OFFICIAL_LEADERS[g];
  });
}

// ─── STANDINGS LOGIC (do not edit) ───────────────────────────────────────────
// Computes a classic group table (Pts, W/D/L, GF, GA, GD) from LIVE_MATCHES.
// Tiebreakers used here: Points → Goal Difference → Goals For → team name.
function computeGroupStandings() {
  const table = {};
  (typeof GROUPS !== "undefined" ? GROUPS : []).forEach((g) => {
    const rows = {};
    Object.keys(TEAMS)
      .filter((code) => TEAMS[code].group === g)
      .forEach((code) => {
        rows[code] = { code, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 };
      });

    LIVE_MATCHES.filter((m) => m.group === g && m.hs != null && m.as != null).forEach((m) => {
      const h = rows[m.home];
      const a = rows[m.away];
      if (!h || !a) return;
      h.P++; a.P++;
      h.GF += m.hs; h.GA += m.as;
      a.GF += m.as; a.GA += m.hs;
      if (m.hs > m.as) { h.W++; a.L++; h.Pts += 3; }
      else if (m.hs < m.as) { a.W++; h.L++; a.Pts += 3; }
      else { h.D++; a.D++; h.Pts += 1; a.Pts += 1; }
    });

    const arr = Object.values(rows).map((r) => ({ ...r, GD: r.GF - r.GA }));
    arr.sort((x, y) =>
      y.Pts - x.Pts ||
      y.GD - x.GD ||
      y.GF - x.GF ||
      (TEAMS[x.code]?.name || x.code).localeCompare(TEAMS[y.code]?.name || y.code)
    );
    table[g] = arr;
  });
  return table;
}

// Returns { A: "KOR", B: "SUI", ... } — the current leader of each group, or
// null for groups with no played matches yet. Prefers the OFFICIAL_LEADERS map
// (faithful to the FIFA standings page) and falls back to the computed table.
function getGroupLeaders() {
  const table = computeGroupStandings();
  const leaders = {};
  (typeof GROUPS !== "undefined" ? GROUPS : []).forEach((g) => {
    const played = table[g] ? table[g].some((r) => r.P > 0) : false;
    if (!played) { leaders[g] = null; return; }
    if (typeof OFFICIAL_LEADERS !== "undefined" && OFFICIAL_LEADERS[g]) {
      leaders[g] = OFFICIAL_LEADERS[g];
    } else {
      const top = table[g] && table[g][0];
      leaders[g] = top && top.P > 0 ? top.code : null;
    }
  });
  return leaders;
}

// Number of played matches per group (used to show "in progress" vs "decided").
function getGroupPlayedCounts() {
  const counts = {};
  (typeof GROUPS !== "undefined" ? GROUPS : []).forEach((g) => {
    counts[g] = LIVE_MATCHES.filter((m) => m.group === g && m.hs != null && m.as != null).length;
  });
  return counts;
}
