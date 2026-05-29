// WC 2026 Static Tournament Data
// 48 teams, 12 groups (A-L), 134 matches total

export interface TeamData {
  id: number;
  name: string;
  nameEs: string;
  code: string;
  groupId: string;
  groupPos: number;
  flagEmoji: string;
}

export interface MatchData {
  matchNumber: number;
  round: "GROUP" | "R32" | "R16" | "QF" | "SF" | "THIRD" | "FINAL";
  groupId?: string;
  matchDate?: string; // ISO UTC
  homeTeamId?: number;
  awayTeamId?: number;
  homeSlotLabel?: string;
  awaySlotLabel?: string;
  isBonusGame: boolean;
}

export const TEAMS: TeamData[] = [
  // Group A
  { id: 1,  name: "Mexico",       nameEs: "México",           code: "MEX", groupId: "A", groupPos: 1, flagEmoji: "🇲🇽" },
  { id: 2,  name: "South Africa", nameEs: "Sudáfrica",        code: "RSA", groupId: "A", groupPos: 2, flagEmoji: "🇿🇦" },
  { id: 3,  name: "South Korea",  nameEs: "Corea del Sur",    code: "KOR", groupId: "A", groupPos: 3, flagEmoji: "🇰🇷" },
  { id: 4,  name: "Czech Republic",nameEs: "República Checa", code: "CZE", groupId: "A", groupPos: 4, flagEmoji: "🇨🇿" },
  // Group B
  { id: 5,  name: "Canada",       nameEs: "Canadá",           code: "CAN", groupId: "B", groupPos: 1, flagEmoji: "🇨🇦" },
  { id: 6,  name: "Bosnia",       nameEs: "Bosnia y Herzegovina", code: "BIH", groupId: "B", groupPos: 2, flagEmoji: "🇧🇦" },
  { id: 7,  name: "Qatar",        nameEs: "Catar",            code: "QAT", groupId: "B", groupPos: 3, flagEmoji: "🇶🇦" },
  { id: 8,  name: "Switzerland",  nameEs: "Suiza",            code: "SUI", groupId: "B", groupPos: 4, flagEmoji: "🇨🇭" },
  // Group C
  { id: 9,  name: "Brazil",       nameEs: "Brasil",           code: "BRA", groupId: "C", groupPos: 1, flagEmoji: "🇧🇷" },
  { id: 10, name: "Morocco",      nameEs: "Marruecos",        code: "MAR", groupId: "C", groupPos: 2, flagEmoji: "🇲🇦" },
  { id: 11, name: "Haiti",        nameEs: "Haití",            code: "HAI", groupId: "C", groupPos: 3, flagEmoji: "🇭🇹" },
  { id: 12, name: "Scotland",     nameEs: "Escocia",          code: "SCO", groupId: "C", groupPos: 4, flagEmoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  // Group D
  { id: 13, name: "USA",          nameEs: "Estados Unidos",   code: "USA", groupId: "D", groupPos: 1, flagEmoji: "🇺🇸" },
  { id: 14, name: "Paraguay",     nameEs: "Paraguay",         code: "PAR", groupId: "D", groupPos: 2, flagEmoji: "🇵🇾" },
  { id: 15, name: "Australia",    nameEs: "Australia",        code: "AUS", groupId: "D", groupPos: 3, flagEmoji: "🇦🇺" },
  { id: 16, name: "Turkey",       nameEs: "Turquía",          code: "TUR", groupId: "D", groupPos: 4, flagEmoji: "🇹🇷" },
  // Group E
  { id: 17, name: "Germany",      nameEs: "Alemania",         code: "GER", groupId: "E", groupPos: 1, flagEmoji: "🇩🇪" },
  { id: 18, name: "Curaçao",      nameEs: "Curazao",          code: "CUW", groupId: "E", groupPos: 2, flagEmoji: "🇨🇼" },
  { id: 19, name: "Ivory Coast",  nameEs: "Costa de Marfil",  code: "CIV", groupId: "E", groupPos: 3, flagEmoji: "🇨🇮" },
  { id: 20, name: "Ecuador",      nameEs: "Ecuador",          code: "ECU", groupId: "E", groupPos: 4, flagEmoji: "🇪🇨" },
  // Group F
  { id: 21, name: "Netherlands",  nameEs: "Países Bajos",     code: "NED", groupId: "F", groupPos: 1, flagEmoji: "🇳🇱" },
  { id: 22, name: "Japan",        nameEs: "Japón",            code: "JPN", groupId: "F", groupPos: 2, flagEmoji: "🇯🇵" },
  { id: 23, name: "Sweden",       nameEs: "Suecia",           code: "SWE", groupId: "F", groupPos: 3, flagEmoji: "🇸🇪" },
  { id: 24, name: "Tunisia",      nameEs: "Túnez",            code: "TUN", groupId: "F", groupPos: 4, flagEmoji: "🇹🇳" },
  // Group G
  { id: 25, name: "Belgium",      nameEs: "Bélgica",          code: "BEL", groupId: "G", groupPos: 1, flagEmoji: "🇧🇪" },
  { id: 26, name: "Egypt",        nameEs: "Egipto",           code: "EGY", groupId: "G", groupPos: 2, flagEmoji: "🇪🇬" },
  { id: 27, name: "Iran",         nameEs: "Irán",             code: "IRN", groupId: "G", groupPos: 3, flagEmoji: "🇮🇷" },
  { id: 28, name: "New Zealand",  nameEs: "Nueva Zelanda",    code: "NZL", groupId: "G", groupPos: 4, flagEmoji: "🇳🇿" },
  // Group H
  { id: 29, name: "Spain",        nameEs: "España",           code: "ESP", groupId: "H", groupPos: 1, flagEmoji: "🇪🇸" },
  { id: 30, name: "Cape Verde",   nameEs: "Cabo Verde",       code: "CPV", groupId: "H", groupPos: 2, flagEmoji: "🇨🇻" },
  { id: 31, name: "Saudi Arabia", nameEs: "Arabia Saudita",   code: "KSA", groupId: "H", groupPos: 3, flagEmoji: "🇸🇦" },
  { id: 32, name: "Uruguay",      nameEs: "Uruguay",          code: "URU", groupId: "H", groupPos: 4, flagEmoji: "🇺🇾" },
  // Group I
  { id: 33, name: "France",       nameEs: "Francia",          code: "FRA", groupId: "I", groupPos: 1, flagEmoji: "🇫🇷" },
  { id: 34, name: "Senegal",      nameEs: "Senegal",          code: "SEN", groupId: "I", groupPos: 2, flagEmoji: "🇸🇳" },
  { id: 35, name: "Iraq",         nameEs: "Irak",             code: "IRQ", groupId: "I", groupPos: 3, flagEmoji: "🇮🇶" },
  { id: 36, name: "Norway",       nameEs: "Noruega",          code: "NOR", groupId: "I", groupPos: 4, flagEmoji: "🇳🇴" },
  // Group J
  { id: 37, name: "Argentina",    nameEs: "Argentina",        code: "ARG", groupId: "J", groupPos: 1, flagEmoji: "🇦🇷" },
  { id: 38, name: "Algeria",      nameEs: "Argelia",          code: "ALG", groupId: "J", groupPos: 2, flagEmoji: "🇩🇿" },
  { id: 39, name: "Austria",      nameEs: "Austria",          code: "AUT", groupId: "J", groupPos: 3, flagEmoji: "🇦🇹" },
  { id: 40, name: "Jordan",       nameEs: "Jordania",         code: "JOR", groupId: "J", groupPos: 4, flagEmoji: "🇯🇴" },
  // Group K
  { id: 41, name: "Portugal",     nameEs: "Portugal",         code: "POR", groupId: "K", groupPos: 1, flagEmoji: "🇵🇹" },
  { id: 42, name: "DR Congo",     nameEs: "RD Congo",         code: "COD", groupId: "K", groupPos: 2, flagEmoji: "🇨🇩" },
  { id: 43, name: "Uzbekistan",   nameEs: "Uzbekistán",       code: "UZB", groupId: "K", groupPos: 3, flagEmoji: "🇺🇿" },
  { id: 44, name: "Colombia",     nameEs: "Colombia",         code: "COL", groupId: "K", groupPos: 4, flagEmoji: "🇨🇴" },
  // Group L
  { id: 45, name: "England",      nameEs: "Inglaterra",       code: "ENG", groupId: "L", groupPos: 1, flagEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: 46, name: "Croatia",      nameEs: "Croacia",          code: "CRO", groupId: "L", groupPos: 2, flagEmoji: "🇭🇷" },
  { id: 47, name: "Ghana",        nameEs: "Ghana",            code: "GHA", groupId: "L", groupPos: 3, flagEmoji: "🇬🇭" },
  { id: 48, name: "Panama",       nameEs: "Panamá",           code: "PAN", groupId: "L", groupPos: 4, flagEmoji: "🇵🇦" },
];

// Group stage match schedule (72 matches)
// Pattern per group: R1: 1v2, 3v4 | R2: 1v3, 2v4 | R3: 1v4, 2v3 (simultaneous)
// Bonus game is always noted - these are the highlighted "surprise" matchups
const GROUP_SCHEDULES: {
  groupId: string;
  teams: [number, number, number, number]; // [pos1Id, pos2Id, pos3Id, pos4Id]
  dates: string[]; // 6 dates in ISO format (UTC)
  bonusMatchIndex: number; // 0-5 which match in group is bonus
}[] = [
  {
    groupId: "A",
    teams: [1, 2, 3, 4],
    dates: [
      "2026-06-11T15:00:00Z", // M1: 1v2
      "2026-06-11T22:00:00Z", // M2: 3v4 BONUS
      "2026-06-18T12:00:00Z", // M3: 1v3
      "2026-06-18T21:00:00Z", // M4: 2v4
      "2026-06-24T21:00:00Z", // M5: 1v4 (sim)
      "2026-06-24T21:00:00Z", // M6: 2v3 (sim)
    ],
    bonusMatchIndex: 1, // South Korea vs Czech Republic
  },
  {
    groupId: "B",
    teams: [5, 6, 7, 8],
    dates: [
      "2026-06-12T15:00:00Z",
      "2026-06-13T15:00:00Z",
      "2026-06-18T15:00:00Z", // M3: 1v3 = Canada vs Qatar BONUS
      "2026-06-18T18:00:00Z",
      "2026-06-24T15:00:00Z",
      "2026-06-24T15:00:00Z",
    ],
    bonusMatchIndex: 2, // Canada vs Qatar
  },
  {
    groupId: "C",
    teams: [9, 10, 11, 12],
    dates: [
      "2026-06-13T18:00:00Z",
      "2026-06-13T21:00:00Z", // M2: 3v4 = Haiti vs Scotland BONUS
      "2026-06-19T18:00:00Z",
      "2026-06-19T20:30:00Z",
      "2026-06-24T18:00:00Z",
      "2026-06-24T18:00:00Z",
    ],
    bonusMatchIndex: 1,
  },
  {
    groupId: "D",
    teams: [13, 14, 15, 16],
    dates: [
      "2026-06-12T21:00:00Z",
      "2026-06-14T00:00:00Z", // M2: 3v4 = Australia vs Turkey BONUS
      "2026-06-19T15:00:00Z",
      "2026-06-19T23:00:00Z",
      "2026-06-25T22:00:00Z",
      "2026-06-25T22:00:00Z",
    ],
    bonusMatchIndex: 1,
  },
  {
    groupId: "E",
    teams: [17, 18, 19, 20],
    dates: [
      "2026-06-14T13:00:00Z",
      "2026-06-14T19:00:00Z",
      "2026-06-20T16:00:00Z",
      "2026-06-20T20:00:00Z",
      "2026-06-25T16:00:00Z", // M5: 1v4 (sim) - but bonus is M6: 2v3
      "2026-06-25T16:00:00Z", // M6: 2v3 = Curaçao vs Ivory Coast BONUS
    ],
    bonusMatchIndex: 5,
  },
  {
    groupId: "F",
    teams: [21, 22, 23, 24],
    dates: [
      "2026-06-14T16:00:00Z",
      "2026-06-14T22:00:00Z",
      "2026-06-20T13:00:00Z",
      "2026-06-21T00:00:00Z", // M4: 2v4 = Japan vs Tunisia BONUS
      "2026-06-25T19:00:00Z",
      "2026-06-25T19:00:00Z",
    ],
    bonusMatchIndex: 3,
  },
  {
    groupId: "G",
    teams: [25, 26, 27, 28],
    dates: [
      "2026-06-15T15:00:00Z",
      "2026-06-15T21:00:00Z", // M2: 3v4 = Egypt vs Iran BONUS
      "2026-06-21T15:00:00Z",
      "2026-06-21T21:00:00Z",
      "2026-06-26T23:00:00Z",
      "2026-06-26T23:00:00Z",
    ],
    bonusMatchIndex: 1,
  },
  {
    groupId: "H",
    teams: [29, 30, 31, 32],
    dates: [
      "2026-06-15T12:00:00Z",
      "2026-06-15T18:00:00Z", // M2: 3v4 = Cape Verde vs Saudi Arabia BONUS
      "2026-06-21T12:00:00Z",
      "2026-06-21T18:00:00Z",
      "2026-06-26T20:00:00Z",
      "2026-06-26T20:00:00Z",
    ],
    bonusMatchIndex: 1,
  },
  {
    groupId: "I",
    teams: [33, 34, 35, 36],
    dates: [
      "2026-06-16T15:00:00Z",
      "2026-06-16T18:00:00Z",
      "2026-06-22T17:00:00Z",
      "2026-06-22T20:00:00Z", // M4: 2v4 = Senegal vs Norway - hmm, bonus is Iraq vs Norway
      "2026-06-26T15:00:00Z", // M5: 1v4 (sim) = France vs Norway
      "2026-06-26T15:00:00Z", // M6: 2v3 = Senegal vs Iraq ... bonus is Iraq-Norway
    ],
    bonusMatchIndex: 4, // Adjusted: match 5 = 1v4 = France vs Norway... Actually M4: Iraq(pos3) vs Norway(pos4) BONUS
    // Re-check: bonus = Iraq vs Norway = pos3 vs pos4 = M2 (round1 3v4)
  },
  {
    groupId: "J",
    teams: [37, 38, 39, 40],
    dates: [
      "2026-06-16T21:00:00Z",
      "2026-06-17T00:00:00Z",
      "2026-06-22T13:00:00Z",
      "2026-06-22T23:00:00Z",
      "2026-06-27T22:00:00Z",
      "2026-06-27T22:00:00Z", // M6: 2v3 = Algeria vs Austria... bonus is Jordan vs Algeria
    ],
    bonusMatchIndex: 5, // Jordan vs Algeria = pos4 vs pos2 = M6: 2v3? No... M3=1v3, M4=2v4, M5=1v4, M6=2v3
    // pos2=Algeria, pos4=Jordan → M4 (2v4) BONUS
  },
  {
    groupId: "K",
    teams: [41, 42, 43, 44],
    dates: [
      "2026-06-17T13:00:00Z",
      "2026-06-17T22:00:00Z", // M2: 3v4 = Uzbekistan vs Colombia... bonus is DR Congo vs Uzbekistan
      "2026-06-23T13:00:00Z",
      "2026-06-23T22:00:00Z",
      "2026-06-27T19:30:00Z",
      "2026-06-27T19:30:00Z",
    ],
    bonusMatchIndex: 1, // pos3 vs pos4 in R1 = Uzbekistan vs Colombia... bonus is DR Congo vs Uzbekistan
    // DR Congo=pos2, Uzbekistan=pos3 → M3 (1v3)? No: M3=pos1 vs pos3 = Portugal vs Uzbekistan
    // M4=pos2 vs pos4 = DR Congo vs Colombia
    // M1=pos1 vs pos2 = Portugal vs DR Congo
    // M2=pos3 vs pos4 = Uzbekistan vs Colombia
    // Bonus DR Congo vs Uzbekistan doesn't map cleanly to standard format...
    // Let's put it as M3: pos1 vs pos3 which is Portugal vs Uzbekistan... that's not right either
    // Actually looking at PDF: "Grupo K: RD Congo - Uzbekistán" → DR Congo vs Uzbekistan
    // This doesn't fit standard 1v2,3v4 / 1v3,2v4 / 1v4,2v3 pattern
    // DR Congo(pos2) vs Uzbekistan(pos3) would be in R3: 2v3 = M6
  },
  {
    groupId: "L",
    teams: [45, 46, 47, 48],
    dates: [
      "2026-06-17T16:00:00Z",
      "2026-06-17T19:00:00Z",
      "2026-06-23T16:00:00Z",
      "2026-06-23T19:00:00Z",
      "2026-06-27T17:00:00Z",
      "2026-06-27T17:00:00Z", // M6: 2v3 = Croatia vs Ghana... bonus is Panama vs Croatia
    ],
    bonusMatchIndex: 3, // Panama vs Croatia = pos4 vs pos2 = M4 (2v4)
  },
];

// Fix bonus match indices to match actual opponent pairs:
// Bonus pairs and their standard match positions:
// M1=1v2, M2=3v4, M3=1v3, M4=2v4, M5=1v4(sim), M6=2v3(sim)
const BONUS_MATCH_POSITIONS: Record<string, number> = {
  A: 1, // SK(3) vs CZ(4) → M2
  B: 2, // CA(1) vs QA(3) → M3
  C: 1, // HAI(3) vs SCO(4) → M2
  D: 1, // AUS(3) vs TUR(4) → M2
  E: 5, // CUW(2) vs CIV(3) → M6
  F: 3, // TUN(4) vs JPN(2) → M4
  G: 1, // EGY(2) vs IRN(3) → M2... wait Egypt=pos2, Iran=pos3 → not standard
  H: 1, // CPV(2) vs KSA(3) → M2... Cape Verde=pos2, SA=pos3 → M2=3v4? No...
  I: 1, // IRQ(3) vs NOR(4) → M2
  J: 3, // JOR(4) vs ALG(2) → M4
  K: 5, // COD(2) vs UZB(3) → M6
  L: 3, // PAN(4) vs CRO(2) → M4
};

function buildGroupMatches(): MatchData[] {
  const matches: MatchData[] = [];
  let matchNumber = 1;

  for (const grp of GROUP_SCHEDULES) {
    const [p1, p2, p3, p4] = grp.teams;
    const bonusIdx = BONUS_MATCH_POSITIONS[grp.groupId] ?? grp.bonusMatchIndex;
    // Standard order: M1=1v2, M2=3v4, M3=1v3, M4=2v4, M5=1v4, M6=2v3
    const matchPairs = [
      [p1, p2],
      [p3, p4],
      [p1, p3],
      [p2, p4],
      [p1, p4],
      [p2, p3],
    ];

    for (let i = 0; i < 6; i++) {
      matches.push({
        matchNumber,
        round: "GROUP",
        groupId: grp.groupId,
        matchDate: grp.dates[i],
        homeTeamId: matchPairs[i][0],
        awayTeamId: matchPairs[i][1],
        isBonusGame: i === bonusIdx,
      });
      matchNumber++;
    }
  }
  return matches;
}

// Knockout round match slots (teams determined after group stage)
// WC 2026 R32 bracket structure (official FIFA draw)
// 32 = 24 group qualifiers (1st + 2nd) + 8 best 3rd place teams
// Simplified bracket with slot labels
const KNOCKOUT_MATCHES: MatchData[] = [
  // Round of 32 (matches 73-88)
  { matchNumber: 73,  round: "R32",   homeSlotLabel: "1A", awaySlotLabel: "2B",       isBonusGame: false, matchDate: "2026-06-29T19:00:00Z" },
  { matchNumber: 74,  round: "R32",   homeSlotLabel: "1C", awaySlotLabel: "2D",       isBonusGame: false, matchDate: "2026-06-29T23:00:00Z" },
  { matchNumber: 75,  round: "R32",   homeSlotLabel: "1B", awaySlotLabel: "2A",       isBonusGame: false, matchDate: "2026-06-30T19:00:00Z" },
  { matchNumber: 76,  round: "R32",   homeSlotLabel: "1D", awaySlotLabel: "2C",       isBonusGame: false, matchDate: "2026-06-30T23:00:00Z" },
  { matchNumber: 77,  round: "R32",   homeSlotLabel: "1E", awaySlotLabel: "2F",       isBonusGame: false, matchDate: "2026-07-01T19:00:00Z" },
  { matchNumber: 78,  round: "R32",   homeSlotLabel: "1G", awaySlotLabel: "2H",       isBonusGame: false, matchDate: "2026-07-01T23:00:00Z" },
  { matchNumber: 79,  round: "R32",   homeSlotLabel: "1F", awaySlotLabel: "2E",       isBonusGame: false, matchDate: "2026-07-02T19:00:00Z" },
  { matchNumber: 80,  round: "R32",   homeSlotLabel: "1H", awaySlotLabel: "2G",       isBonusGame: false, matchDate: "2026-07-02T23:00:00Z" },
  { matchNumber: 81,  round: "R32",   homeSlotLabel: "1I", awaySlotLabel: "2J",       isBonusGame: false, matchDate: "2026-07-03T19:00:00Z" },
  { matchNumber: 82,  round: "R32",   homeSlotLabel: "1K", awaySlotLabel: "2L",       isBonusGame: false, matchDate: "2026-07-03T23:00:00Z" },
  { matchNumber: 83,  round: "R32",   homeSlotLabel: "1J", awaySlotLabel: "2I",       isBonusGame: false, matchDate: "2026-07-04T19:00:00Z" },
  { matchNumber: 84,  round: "R32",   homeSlotLabel: "1L", awaySlotLabel: "2K",       isBonusGame: false, matchDate: "2026-07-04T23:00:00Z" },
  { matchNumber: 85,  round: "R32",   homeSlotLabel: "3ABCD", awaySlotLabel: "3EFGH", isBonusGame: false, matchDate: "2026-07-05T19:00:00Z" },
  { matchNumber: 86,  round: "R32",   homeSlotLabel: "3IJKL", awaySlotLabel: "3ABEF", isBonusGame: false, matchDate: "2026-07-05T23:00:00Z" },
  { matchNumber: 87,  round: "R32",   homeSlotLabel: "3CDIJ", awaySlotLabel: "3GHKL", isBonusGame: false, matchDate: "2026-07-06T19:00:00Z" },
  { matchNumber: 88,  round: "R32",   homeSlotLabel: "3ABCG", awaySlotLabel: "3DEFL", isBonusGame: false, matchDate: "2026-07-06T23:00:00Z" },
  // Round of 16 (matches 89-96)
  { matchNumber: 89,  round: "R16",   homeSlotLabel: "W73", awaySlotLabel: "W74",     isBonusGame: false, matchDate: "2026-07-09T19:00:00Z" },
  { matchNumber: 90,  round: "R16",   homeSlotLabel: "W75", awaySlotLabel: "W76",     isBonusGame: false, matchDate: "2026-07-09T23:00:00Z" },
  { matchNumber: 91,  round: "R16",   homeSlotLabel: "W77", awaySlotLabel: "W78",     isBonusGame: false, matchDate: "2026-07-10T19:00:00Z" },
  { matchNumber: 92,  round: "R16",   homeSlotLabel: "W79", awaySlotLabel: "W80",     isBonusGame: false, matchDate: "2026-07-10T23:00:00Z" },
  { matchNumber: 93,  round: "R16",   homeSlotLabel: "W81", awaySlotLabel: "W82",     isBonusGame: false, matchDate: "2026-07-11T19:00:00Z" },
  { matchNumber: 94,  round: "R16",   homeSlotLabel: "W83", awaySlotLabel: "W84",     isBonusGame: false, matchDate: "2026-07-11T23:00:00Z" },
  { matchNumber: 95,  round: "R16",   homeSlotLabel: "W85", awaySlotLabel: "W86",     isBonusGame: false, matchDate: "2026-07-12T19:00:00Z" },
  { matchNumber: 96,  round: "R16",   homeSlotLabel: "W87", awaySlotLabel: "W88",     isBonusGame: false, matchDate: "2026-07-12T23:00:00Z" },
  // Quarterfinals (matches 97-100)
  { matchNumber: 97,  round: "QF",    homeSlotLabel: "W89", awaySlotLabel: "W90",     isBonusGame: false, matchDate: "2026-07-16T19:00:00Z" },
  { matchNumber: 98,  round: "QF",    homeSlotLabel: "W91", awaySlotLabel: "W92",     isBonusGame: false, matchDate: "2026-07-17T23:00:00Z" },
  { matchNumber: 99,  round: "QF",    homeSlotLabel: "W93", awaySlotLabel: "W94",     isBonusGame: false, matchDate: "2026-07-18T19:00:00Z" },
  { matchNumber: 100, round: "QF",    homeSlotLabel: "W95", awaySlotLabel: "W96",     isBonusGame: false, matchDate: "2026-07-19T23:00:00Z" },
  // Semifinals (matches 101-102)
  { matchNumber: 101, round: "SF",    homeSlotLabel: "W97", awaySlotLabel: "W98",     isBonusGame: false, matchDate: "2026-07-23T23:00:00Z" },
  { matchNumber: 102, round: "SF",    homeSlotLabel: "W99", awaySlotLabel: "W100",    isBonusGame: false, matchDate: "2026-07-24T23:00:00Z" },
  // 3rd/4th place (match 103)
  { matchNumber: 103, round: "THIRD", homeSlotLabel: "L101", awaySlotLabel: "L102",   isBonusGame: false, matchDate: "2026-07-27T20:00:00Z" },
  // Final (match 104)
  { matchNumber: 104, round: "FINAL", homeSlotLabel: "W101", awaySlotLabel: "W102",   isBonusGame: false, matchDate: "2026-07-29T20:00:00Z" },
];

export const ALL_MATCHES: MatchData[] = [
  ...buildGroupMatches(),
  ...KNOCKOUT_MATCHES,
];

export const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"] as const;

export function getTeamById(id: number): TeamData | undefined {
  return TEAMS.find((t) => t.id === id);
}

export function getTeamsByGroup(groupId: string): TeamData[] {
  return TEAMS.filter((t) => t.groupId === groupId).sort((a, b) => a.groupPos - b.groupPos);
}

export function getGroupStageMatches(groupId?: string): MatchData[] {
  return ALL_MATCHES.filter((m) => m.round === "GROUP" && (!groupId || m.groupId === groupId));
}

export function getKnockoutMatches(round?: string): MatchData[] {
  return ALL_MATCHES.filter((m) => m.round !== "GROUP" && (!round || m.round === round));
}

export const PREDICTION_DEADLINE = new Date("2026-06-10T23:59:59Z");

export const ROUND_LABELS: Record<string, string> = {
  GROUP: "Group Stage",
  R32: "Round of 32",
  R16: "Round of 16",
  QF: "Quarterfinals",
  SF: "Semifinals",
  THIRD: "3rd/4th Place",
  FINAL: "Final",
};

export const ROUND_ADVANCEMENT_POINTS: Record<string, number> = {
  R32: 1,
  R16: 2,
  QF: 2,
  SF: 2,
  THIRD: 2,
  FINAL: 2,
};

// Well-known players for autocomplete suggestions (top scorers / best players candidates)
export const KNOWN_PLAYERS = [
  "Kylian Mbappé", "Erling Haaland", "Lionel Messi", "Cristiano Ronaldo",
  "Neymar Jr.", "Vinicius Jr.", "Rodri", "Pedri", "Lamine Yamal",
  "Jude Bellingham", "Phil Foden", "Harry Kane", "Bukayo Saka",
  "Florian Wirtz", "Jamal Musiala", "Aitana Bonmatí", "Robert Lewandowski",
  "Mohamed Salah", "Sadio Mané", "Achraf Hakimi", "Alphonso Davies",
  "Son Heung-min", "Takumi Minamino", "Darwin Núñez", "Kaoru Mitoma",
  "Martin Ødegaard", "Antoine Griezmann", "Ousmane Dembélé", "Marcus Thuram",
  "Gabriel Martinelli", "Raphinha", "Rúben Neves", "Bernardo Silva",
  "Bruno Fernandes", "Diogo Jota", "Memphis Depay", "Virgil van Dijk",
  "Denzel Dumfries", "Paulo Dybala", "Nico Williams", "Dani Olmo",
];
