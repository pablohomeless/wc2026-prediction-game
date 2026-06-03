/**
 * data.js — Manual data entry file for Porra Mundial 2026 Static Site
 *
 * Fill in the values below as the tournament progresses.
 * Then open index.html, predictions.html, and results.html in your browser (or GitHub Pages).
 *
 * SECTIONS:
 *  1. PARTICIPANTS  — list of players with their predictions and points breakdown
 *  2. GROUP_WINNERS — actual group winners (filled as groups finish)
 *  3. KNOCKOUT_RESULTS — match results for R32 → Final
 *  4. SETTINGS — deadline, tournament status
 */

// ─── 1. PARTICIPANTS ──────────────────────────────────────────────────────────
// Each participant has:
//   alias       : display name (no email!)
//   predictions : their picks (group winners, semis, finalists, winner, 3rd-4th winner, topScorer)
//   points      : scoring breakdown (fill in as tournament progresses)

const PARTICIPANTS = [
  {
    alias: "Pablo",
    predictions: {
      // Group winners: one team code per group A-L
      groupWinners: {
        A: "MEX", B: "CAN", C: "BRA", D: "USA",
        E: "GER", F: "NED", G: "BEL", H: "ESP",
        I: "FRA", J: "ARG", K: "POR", L: "ENG",
      },
      // 4 semi-finalists (team codes, any order)
      semiFinals: ["BRA", "FRA", "ESP", "ARG"],
      // 2 finalists (team codes)
      finalists: ["BRA", "ARG"],
      // 2 teams in the 3rd/4th place game
      thirdPlaceParticipants: ["FRA", "ESP"],
      // Winner of the Final
      champion: "ARG",
      // Winner of 3rd/4th place match
      thirdPlace: "FRA",
      // Top scorer (player name)
      topScorer: "Mbappe",
    },
    points: {
      groupWinners: 0,           // 1pt per correct group winner
      semiFinals: 0,             // 2pt per correct semi-finalist
      finalists: 0,              // 4pt per correct finalist
      thirdPlaceParticipants: 0, // 3pt per correct 3rd/4th team
      champion: 0,               // 10pt if correct
      thirdPlace: 0,             // 2pt if correct
      topScorer: 0,              // 5pt if correct
      total: 0,
    },
  },
  // ── Add more participants below, copy the block above ──
  // {
  //   alias: "Maria",
  //   predictions: {
  //     groupWinners: { A: "MEX", B: "CAN", C: "BRA", D: "USA", E: "GER", F: "NED", G: "ESP", H: "URU", I: "FRA", J: "ARG", K: "POR", L: "ENG" },
  //     semiFinals: ["BRA", "ENG", "ESP", "ARG"],
  //     finalists: ["ENG", "ARG"],
  //     thirdPlaceParticipants: ["BRA", "ESP"],
  //     champion: "ENG",
  //     thirdPlace: "BRA",
  //     topScorer: "Bellingham",
  //   },
  //   points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  // },
];

// ─── 2. ACTUAL RESULTS (fill in as tournament progresses) ─────────────────────

const ACTUAL_RESULTS = {
  // Actual group winners (fill as groups are decided)
  // Leave as null until known
  groupWinners: {
    A: null, B: null, C: null, D: null,
    E: null, F: null, G: null, H: null,
    I: null, J: null, K: null, L: null,
  },
  // Actual 4 semi-finalists (team codes), null until known
  semiFinals: null, // e.g. ["BRA", "FRA", "ESP", "ENG"]
  // Actual 2 finalists
  finalists: null,              // e.g. ["ARG", "FRA"]
  // Actual 2 teams in 3rd/4th place game
  thirdPlaceParticipants: null, // e.g. ["ESP", "ENG"]
  // Champion
  champion: null,               // e.g. "ARG"
  // 3rd place winner
  thirdPlace: null,             // e.g. "FRA"
  // Top scorer name (must match prediction string, case-insensitive)
  topScorer: null,  // e.g. "Mbappe"
};

// ─── 3. SETTINGS ──────────────────────────────────────────────────────────────

const SETTINGS = {
  // Phase: "pre" | "group" | "knockout" | "finished"
  //   "pre"      = before tournament (scoreboard hidden, just show predictions)
  //   "group"    = group stage in progress
  //   "knockout" = knockout stage
  //   "finished" = all done
  phase: "pre",

  predictionDeadline: "2026-06-10T23:59:59Z",
};

// ─── 4. TEAM DATA ─────────────────────────────────────────────────────────────

const TEAMS = {
  MEX: { name: "Mexico",        flag: "🇲🇽", group: "A" },
  RSA: { name: "South Africa",  flag: "🇿🇦", group: "A" },
  KOR: { name: "South Korea",   flag: "🇰🇷", group: "A" },
  CZE: { name: "Czech Rep.",    flag: "🇨🇿", group: "A" },
  CAN: { name: "Canada",        flag: "🇨🇦", group: "B" },
  BIH: { name: "Bosnia",        flag: "🇧🇦", group: "B" },
  QAT: { name: "Qatar",         flag: "🇶🇦", group: "B" },
  SUI: { name: "Switzerland",   flag: "🇨🇭", group: "B" },
  BRA: { name: "Brazil",        flag: "🇧🇷", group: "C" },
  MAR: { name: "Morocco",       flag: "🇲🇦", group: "C" },
  HAI: { name: "Haiti",         flag: "🇭🇹", group: "C" },
  SCO: { name: "Scotland",      flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", group: "C" },
  USA: { name: "USA",           flag: "🇺🇸", group: "D" },
  PAR: { name: "Paraguay",      flag: "🇵🇾", group: "D" },
  AUS: { name: "Australia",     flag: "🇦🇺", group: "D" },
  TUR: { name: "Turkey",        flag: "🇹🇷", group: "D" },
  GER: { name: "Germany",       flag: "🇩🇪", group: "E" },
  CUW: { name: "Curaçao",       flag: "🇨🇼", group: "E" },
  CIV: { name: "Ivory Coast",   flag: "🇨🇮", group: "E" },
  ECU: { name: "Ecuador",       flag: "🇪🇨", group: "E" },
  NED: { name: "Netherlands",   flag: "🇳🇱", group: "F" },
  JPN: { name: "Japan",         flag: "🇯🇵", group: "F" },
  SWE: { name: "Sweden",        flag: "🇸🇪", group: "F" },
  TUN: { name: "Tunisia",       flag: "🇹🇳", group: "F" },
  BEL: { name: "Belgium",       flag: "🇧🇪", group: "G" },
  EGY: { name: "Egypt",         flag: "🇪🇬", group: "G" },
  IRN: { name: "Iran",          flag: "🇮🇷", group: "G" },
  NZL: { name: "New Zealand",   flag: "🇳🇿", group: "G" },
  ESP: { name: "Spain",         flag: "🇪🇸", group: "H" },
  CPV: { name: "Cape Verde",    flag: "🇨🇻", group: "H" },
  KSA: { name: "Saudi Arabia",  flag: "🇸🇦", group: "H" },
  URU: { name: "Uruguay",       flag: "🇺🇾", group: "H" },
  FRA: { name: "France",        flag: "🇫🇷", group: "I" },
  SEN: { name: "Senegal",       flag: "🇸🇳", group: "I" },
  IRQ: { name: "Iraq",          flag: "🇮🇶", group: "I" },
  NOR: { name: "Norway",        flag: "🇳🇴", group: "I" },
  ARG: { name: "Argentina",     flag: "🇦🇷", group: "J" },
  ALG: { name: "Algeria",       flag: "🇩🇿", group: "J" },
  AUT: { name: "Austria",       flag: "🇦🇹", group: "J" },
  JOR: { name: "Jordan",        flag: "🇯🇴", group: "J" },
  POR: { name: "Portugal",      flag: "🇵🇹", group: "K" },
  COD: { name: "DR Congo",      flag: "🇨🇩", group: "K" },
  UZB: { name: "Uzbekistan",    flag: "🇺🇿", group: "K" },
  COL: { name: "Colombia",      flag: "🇨🇴", group: "K" },
  ENG: { name: "England",       flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "L" },
  CRO: { name: "Croatia",       flag: "🇭🇷", group: "L" },
  GHA: { name: "Ghana",         flag: "🇬🇭", group: "L" },
  PAN: { name: "Panama",        flag: "🇵🇦", group: "L" },
};

const GROUPS = ["A","B","C","D","E","F","G","H","I","J","K","L"];

// ─── FLAG ICON MAPPING (FIFA 3-letter → ISO 3166-1 alpha-2 for flag-icons CSS) ─
const FLAG_ICONS = {
  MEX: "mx", RSA: "za", KOR: "kr", CZE: "cz",
  CAN: "ca", BIH: "ba", QAT: "qa", SUI: "ch",
  BRA: "br", MAR: "ma", HAI: "ht", SCO: "gb-sct",
  USA: "us", PAR: "py", AUS: "au", TUR: "tr",
  GER: "de", CUW: "cw", CIV: "ci", ECU: "ec",
  NED: "nl", JPN: "jp", SWE: "se", TUN: "tn",
  BEL: "be", EGY: "eg", IRN: "ir", NZL: "nz",
  ESP: "es", CPV: "cv", KSA: "sa", URU: "uy",
  FRA: "fr", SEN: "sn", IRQ: "iq", NOR: "no",
  ARG: "ar", ALG: "dz", AUT: "at", JOR: "jo",
  POR: "pt", COD: "cd", UZB: "uz", COL: "co",
  ENG: "gb-eng", CRO: "hr", GHA: "gh", PAN: "pa",
};

// Returns an <img> flag tag for a FIFA 3-letter code
function flagHtml(code) {
  const iso = FLAG_ICONS[code];
  if (!iso) return '';
  const t = TEAMS[code];
  return `<span class="fi fi-${iso}" title="${t ? t.name : code}"></span>`;
}

// ─── SCORING LOGIC (do not edit) ─────────────────────────────────────────────

function teamDisplay(code) {
  if (!code) return "—";
  const t = TEAMS[code];
  return t ? `${t.flag} ${t.name}` : code;
}

function calcPoints(p, actual) {
  const pts = { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 };

  // Group winners: 1pt each
  if (actual.groupWinners) {
    for (const g of GROUPS) {
      if (actual.groupWinners[g] && p.predictions.groupWinners[g] === actual.groupWinners[g]) {
        pts.groupWinners++;
      }
    }
  }

  // Semi-finalists: 2pt each correct
  if (actual.semiFinals && p.predictions.semiFinals) {
    for (const team of p.predictions.semiFinals) {
      if (actual.semiFinals.includes(team)) pts.semiFinals += 2;
    }
  }

  // Finalists: 4pt each correct
  if (actual.finalists && p.predictions.finalists) {
    for (const team of p.predictions.finalists) {
      if (actual.finalists.includes(team)) pts.finalists += 4;
    }
  }

  // 3rd/4th participants: 3pt each correct
  if (actual.thirdPlaceParticipants && p.predictions.thirdPlaceParticipants) {
    for (const team of p.predictions.thirdPlaceParticipants) {
      if (actual.thirdPlaceParticipants.includes(team)) pts.thirdPlaceParticipants += 3;
    }
  }

  // Champion: 10pt
  if (actual.champion && p.predictions.champion === actual.champion) pts.champion = 10;

  // 3rd place winner: 2pt
  if (actual.thirdPlace && p.predictions.thirdPlace === actual.thirdPlace) pts.thirdPlace = 2;

  // Top scorer: 5pt (case-insensitive)
  if (actual.topScorer && p.predictions.topScorer) {
    if (p.predictions.topScorer.toLowerCase().trim() === actual.topScorer.toLowerCase().trim()) {
      pts.topScorer = 5;
    }
  }

  pts.total = pts.groupWinners + pts.semiFinals + pts.finalists + pts.thirdPlaceParticipants + pts.champion + pts.thirdPlace + pts.topScorer;
  return pts;
}

// Auto-calculate points from ACTUAL_RESULTS (overrides manual points in PARTICIPANTS)
function getComputedParticipants() {
  return PARTICIPANTS.map(p => {
    const pts = calcPoints(p, ACTUAL_RESULTS);
    return { ...p, points: pts };
  }).sort((a, b) => b.points.total - a.points.total);
}
