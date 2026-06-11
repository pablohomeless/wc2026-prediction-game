/**
 * participants-import.js
 * Imported from "FIFA World Cup 2026 — FinalPredictions-CSV.csv"
 * Excluded fields: Email, Name, Last Modified Time
 *
 * ⚠️  ANOMALIES TO REVIEW BEFORE MERGING:
 *
 *  1. Maya (row 5):
 *       semiFinals has 5 teams instead of 4: ARG, BRA, FRA, JPN, MEX
 *       — included as-is; trim to 4 if the scoring logic caps at 4
 *
 *  2. Zamankar (row 9):
 *       thirdPlaceParticipants has 3 teams instead of 2: FRA, COD, POR
 *       — included as-is; COD (DR Congo) is NOT in the semi-finalists list
 *
 *  3. Ohad Demri (row 13):
 *       thirdPlace = "POR" but thirdPlaceParticipants = ["ENG", "GER"]
 *       Portugal is not in the 3rd/4th match — inconsistent entry
 *
 *  4. Alfred (row 20):
 *       semiFinals has 3 teams instead of 4: ESP, FRA, BRA
 *       — one semi-finalist appears to be missing from the form submission
 *
 *  5. Manuel Neuer Versuch (row 24):
 *       thirdPlaceParticipants has 1 team instead of 2: ["FRA"]
 *       — one team appears to be missing from the form submission
 *
 * To merge: copy the array entries below into the PARTICIPANTS array in data.js
 */

const PARTICIPANTS_IMPORT = [
  {
    alias: "FreeCopilot",
    predictions: {
      groupWinners: { A: "MEX", B: "SUI", C: "MAR", D: "TUR", E: "GER", F: "JPN", G: "EGY", H: "URU", I: "FRA", J: "ARG", K: "POR", L: "ENG" },
      semiFinals: ["ARG", "BRA", "FRA", "ESP"],
      finalists: ["ARG", "FRA"],
      thirdPlaceParticipants: ["BRA", "ESP"],
      champion: "FRA",
      thirdPlace: "BRA",
      topScorer: "Kylian Mbappe",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "Fernando Cima",
    predictions: {
      groupWinners: { A: "MEX", B: "SUI", C: "BRA", D: "PAR", E: "ECU", F: "NED", G: "BEL", H: "ESP", I: "FRA", J: "ARG", K: "POR", L: "ENG" },
      semiFinals: ["BRA", "POR", "ESP", "FRA"],
      finalists: ["BRA", "FRA"],
      thirdPlaceParticipants: ["ESP", "POR"],
      champion: "BRA",
      thirdPlace: "POR",
      topScorer: "Kylian Mbappe",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "coguiu",
    predictions: {
      groupWinners: { A: "MEX", B: "SUI", C: "BRA", D: "USA", E: "GER", F: "NED", G: "BEL", H: "ESP", I: "FRA", J: "ARG", K: "POR", L: "ENG" },
      semiFinals: ["FRA", "ESP", "BRA", "GER"],
      finalists: ["GER", "BRA"],
      thirdPlaceParticipants: ["FRA", "ENG"],
      champion: "BRA",
      thirdPlace: "FRA",
      topScorer: "Harry Kane",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "Baihas",
    predictions: {
      groupWinners: { A: "KOR", B: "SUI", C: "MAR", D: "PAR", E: "ECU", F: "NED", G: "BEL", H: "ESP", I: "FRA", J: "ARG", K: "UZB", L: "CRO" },
      semiFinals: ["ARG", "MAR", "CRO", "UZB"],
      finalists: ["MAR", "FRA"],
      thirdPlaceParticipants: ["ARG", "UZB"],
      champion: "MAR",
      thirdPlace: "UZB",
      topScorer: "No Idea :D",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "Maya",
    predictions: {
      groupWinners: { A: "MEX", B: "SUI", C: "BRA", D: "USA", E: "ECU", F: "JPN", G: "EGY", H: "ESP", I: "FRA", J: "ARG", K: "POR", L: "CRO" },
      semiFinals: ["ARG", "BRA", "FRA", "JPN"],
      finalists: ["FRA", "BRA"],
      thirdPlaceParticipants: ["ARG", "JPN"],
      champion: "BRA",
      thirdPlace: "FRA",
      topScorer: "Kylian Mbappe",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "Grandma",
    predictions: {
      groupWinners: { A: "MEX", B: "SUI", C: "BRA", D: "TUR", E: "GER", F: "NED", G: "BEL", H: "ESP", I: "FRA", J: "ARG", K: "POR", L: "CRO" },
      semiFinals: ["BRA", "ARG", "CRO", "ESP"],
      finalists: ["CRO", "BRA"],
      thirdPlaceParticipants: ["ESP", "ARG"],
      champion: "CRO",
      thirdPlace: "ESP",
      topScorer: "Andrej Kramarić",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "PS",
    predictions: {
      groupWinners: { A: "MEX", B: "QAT", C: "BRA", D: "TUR", E: "GER", F: "NED", G: "BEL", H: "ESP", I: "FRA", J: "ARG", K: "POR", L: "ENG" },
      semiFinals: ["ARG", "FRA", "GER", "NED"],
      finalists: ["FRA", "NED"],
      thirdPlaceParticipants: ["ARG", "GER"],
      champion: "NED",
      thirdPlace: "GER",
      topScorer: "Kylian Mbappe",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "Kunal Parmar",
    predictions: {
      groupWinners: { A: "MEX", B: "QAT", C: "BRA", D: "PAR", E: "GER", F: "NED", G: "BEL", H: "ESP", I: "FRA", J: "ARG", K: "POR", L: "ENG" },
      semiFinals: ["ARG", "BRA", "ENG", "GER"],
      finalists: ["ENG", "ARG"],
      thirdPlaceParticipants: ["GER", "BRA"],
      champion: "ENG",
      thirdPlace: "GER",
      topScorer: "Harry Kane",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "Zamankar",
    predictions: {
      groupWinners: { A: "MEX", B: "SUI", C: "BRA", D: "PAR", E: "GER", F: "NED", G: "BEL", H: "ESP", I: "FRA", J: "ARG", K: "POR", L: "CRO" },
      semiFinals: ["NED", "POR", "ESP", "FRA"],
      finalists: ["NED", "ESP"],
      thirdPlaceParticipants: ["FRA", "POR"],
      champion: "NED",
      thirdPlace: "FRA",
      topScorer: "Michael Olise",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "NotAFan",
    predictions: {
      groupWinners: { A: "CZE", B: "QAT", C: "BRA", D: "PAR", E: "GER", F: "NED", G: "IRN", H: "ESP", I: "FRA", J: "ARG", K: "COL", L: "CRO" },
      semiFinals: ["ESP", "BRA", "CZE", "GER"],
      finalists: ["ESP", "GER"],
      thirdPlaceParticipants: ["BRA", "CZE"],
      champion: "ESP",
      thirdPlace: "BRA",
      topScorer: "Kylian Mbappe",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "ParagonSpectre",
    predictions: {
      groupWinners: { A: "MEX", B: "SUI", C: "BRA", D: "PAR", E: "GER", F: "NED", G: "EGY", H: "ESP", I: "FRA", J: "ARG", K: "POR", L: "CRO" },
      semiFinals: ["FRA", "ESP", "BRA", "ARG"],
      finalists: ["ARG", "ESP"],
      thirdPlaceParticipants: ["BRA", "FRA"],
      champion: "ESP",
      thirdPlace: "FRA",
      topScorer: "Lamine Yamal",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "Josunefo",
    predictions: {
      groupWinners: { A: "MEX", B: "SUI", C: "BRA", D: "USA", E: "GER", F: "NED", G: "BEL", H: "ESP", I: "FRA", J: "ARG", K: "POR", L: "ENG" },
      semiFinals: ["ESP", "FRA", "ARG", "ENG"],
      finalists: ["ESP", "FRA"],
      thirdPlaceParticipants: ["ARG", "ENG"],
      champion: "ESP",
      thirdPlace: "ARG",
      topScorer: "Kylian Mbappe",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "Ohad Demri",
    predictions: {
      groupWinners: { A: "MEX", B: "SUI", C: "BRA", D: "USA", E: "GER", F: "NED", G: "BEL", H: "ESP", I: "FRA", J: "ARG", K: "POR", L: "ENG" },
      semiFinals: ["FRA", "ESP", "ENG", "GER"],
      finalists: ["FRA", "ESP"],
      thirdPlaceParticipants: ["ENG", "GER"],
      champion: "ESP",
      thirdPlace: "ENG",
      topScorer: "Harry Kane",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "jtienda",
    predictions: {
      groupWinners: { A: "MEX", B: "CAN", C: "BRA", D: "USA", E: "GER", F: "NED", G: "BEL", H: "ESP", I: "FRA", J: "ARG", K: "POR", L: "ENG" },
      semiFinals: ["ESP", "FRA", "POR", "ARG"],
      finalists: ["FRA", "ESP"],
      thirdPlaceParticipants: ["ARG", "POR"],
      champion: "ESP",
      thirdPlace: "POR",
      topScorer: "Michael Olise",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "rutrac",
    predictions: {
      groupWinners: { A: "MEX", B: "SUI", C: "BRA", D: "PAR", E: "GER", F: "NED", G: "BEL", H: "ESP", I: "FRA", J: "ARG", K: "POR", L: "CRO" },
      semiFinals: ["ARG", "POR", "FRA", "BRA"],
      finalists: ["POR", "BRA"],
      thirdPlaceParticipants: ["ARG", "FRA"],
      champion: "POR",
      thirdPlace: "FRA",
      topScorer: "Cristiano Ronaldo",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "Heinpe",
    predictions: {
      groupWinners: { A: "KOR", B: "SUI", C: "BRA", D: "USA", E: "GER", F: "NED", G: "BEL", H: "ESP", I: "FRA", J: "ARG", K: "POR", L: "ENG" },
      semiFinals: ["ENG", "ESP", "FRA", "ARG"],
      finalists: ["FRA", "ESP"],
      thirdPlaceParticipants: ["ARG", "ENG"],
      champion: "ESP",
      thirdPlace: "ENG",
      topScorer: "Kylian Mbappe",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "Mo Abdelaziz",
    predictions: {
      groupWinners: { A: "CZE", B: "SUI", C: "BRA", D: "PAR", E: "GER", F: "NED", G: "BEL", H: "ESP", I: "FRA", J: "ARG", K: "POR", L: "ENG" },
      semiFinals: ["ENG", "FRA", "GER", "ESP"],
      finalists: ["FRA", "ESP"],
      thirdPlaceParticipants: ["BRA", "ENG"],
      champion: "ESP",
      thirdPlace: "ENG",
      topScorer: "Kylian Mbappe",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "chverstr",
    predictions: {
      groupWinners: { A: "MEX", B: "SUI", C: "BRA", D: "USA", E: "GER", F: "NED", G: "BEL", H: "ESP", I: "FRA", J: "ARG", K: "POR", L: "ENG" },
      semiFinals: ["BEL", "FRA", "ARG", "ESP"],
      finalists: ["FRA", "ESP"],
      thirdPlaceParticipants: ["BEL", "BRA"],
      champion: "ESP",
      thirdPlace: "BRA",
      topScorer: "Kylian Mbappe",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "Agentic",
    predictions: {
      groupWinners: { A: "MEX", B: "SUI", C: "MAR", D: "TUR", E: "GER", F: "NED", G: "BEL", H: "ESP", I: "FRA", J: "ARG", K: "POR", L: "ENG" },
      semiFinals: ["ARG", "FRA", "ESP", "ENG"],
      finalists: ["ESP", "FRA"],
      thirdPlaceParticipants: ["ARG", "ENG"],
      champion: "FRA",
      thirdPlace: "ARG",
      topScorer: "Kylian Mbappe",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "Alfred",
    predictions: {
      groupWinners: { A: "MEX", B: "SUI", C: "BRA", D: "USA", E: "GER", F: "NED", G: "BEL", H: "ESP", I: "FRA", J: "ARG", K: "POR", L: "ENG" },
      semiFinals: ["ESP", "FRA", "BRA", "ARG"],
      finalists: ["ESP", "ARG"],
      thirdPlaceParticipants: ["BRA", "FRA"],
      champion: "ESP",
      thirdPlace: "FRA",
      topScorer: "Kylian Mbappe",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "Dominique Dusabeyezu",
    predictions: {
      groupWinners: { A: "MEX", B: "QAT", C: "BRA", D: "PAR", E: "GER", F: "NED", G: "BEL", H: "ESP", I: "FRA", J: "ARG", K: "POR", L: "CRO" },
      semiFinals: ["BRA", "FRA", "ESP", "ARG"],
      finalists: ["FRA", "ESP"],
      thirdPlaceParticipants: ["ARG", "BRA"],
      champion: "ESP",
      thirdPlace: "BRA",
      topScorer: "Lamine Yamal",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "Patriot",
    predictions: {
      groupWinners: { A: "KOR", B: "SUI", C: "BRA", D: "USA", E: "GER", F: "NED", G: "BEL", H: "ESP", I: "FRA", J: "ARG", K: "COL", L: "ENG" },
      semiFinals: ["FRA", "ESP", "ARG", "POR"],
      finalists: ["FRA", "ESP"],
      thirdPlaceParticipants: ["ARG", "POR"],
      champion: "FRA",
      thirdPlace: "ARG",
      topScorer: "Kylian Mbappe",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "arthub",
    predictions: {
      groupWinners: { A: "MEX", B: "BIH", C: "BRA", D: "PAR", E: "GER", F: "NED", G: "BEL", H: "ESP", I: "FRA", J: "ARG", K: "POR", L: "CRO" },
      semiFinals: ["ARG", "FRA", "BRA", "ESP"],
      finalists: ["FRA", "ARG"],
      thirdPlaceParticipants: ["BRA", "ESP"],
      champion: "ARG",
      thirdPlace: "ESP",
      topScorer: "Lamine Yamal",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "Manuel Neuer Versuch",
    predictions: {
      groupWinners: { A: "MEX", B: "SUI", C: "BRA", D: "USA", E: "GER", F: "NED", G: "BEL", H: "ESP", I: "FRA", J: "ARG", K: "POR", L: "ENG" },
      semiFinals: ["ARG", "BRA", "FRA", "ESP"],
      finalists: ["ARG", "ESP"],
      thirdPlaceParticipants: ["FRA", "BRA"],
      champion: "ESP",
      thirdPlace: "FRA",
      topScorer: "Kylian Mbappe",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "Laurence Evans / levans",
    predictions: {
      groupWinners: { A: "MEX", B: "SUI", C: "BRA", D: "USA", E: "GER", F: "NED", G: "BEL", H: "ESP", I: "FRA", J: "ARG", K: "POR", L: "ENG" },
      semiFinals: ["ESP", "FRA", "ENG", "ARG"],
      finalists: ["ENG", "ESP"],
      thirdPlaceParticipants: ["ARG", "FRA"],
      champion: "ESP",
      thirdPlace: "FRA",
      topScorer: "Kylian Mbappe",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "Alberto",
    predictions: {
      groupWinners: { A: "MEX", B: "SUI", C: "BRA", D: "TUR", E: "GER", F: "NED", G: "BEL", H: "ESP", I: "FRA", J: "ARG", K: "POR", L: "ENG" },
      semiFinals: ["BRA", "FRA", "ESP", "ARG"],
      finalists: ["BRA", "ESP"],
      thirdPlaceParticipants: ["FRA", "ARG"],
      champion: "ESP",
      thirdPlace: "FRA",
      topScorer: "Kylian Mbappe",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "Wrong shaped ball",
    predictions: {
      groupWinners: { A: "MEX", B: "BIH", C: "BRA", D: "USA", E: "GER", F: "NED", G: "BEL", H: "ESP", I: "FRA", J: "ARG", K: "POR", L: "ENG" },
      semiFinals: ["ENG", "GER", "ESP", "BRA"],
      finalists: ["BRA", "ENG"],
      thirdPlaceParticipants: ["GER", "ESP"],
      champion: "ENG",
      thirdPlace: "ESP",
      topScorer: "Harry Kane",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "Santi (snunez)",
    predictions: {
      groupWinners: { A: "MEX", B: "CAN", C: "MAR", D: "TUR", E: "GER", F: "SWE", G: "EGY", H: "URU", I: "NOR", J: "AUT", K: "POR", L: "CRO" },
      semiFinals: ["FRA", "ESP", "BRA", "POR"],
      finalists: ["FRA", "ESP"],
      thirdPlaceParticipants: ["BRA", "POR"],
      champion: "FRA",
      thirdPlace: "POR",
      topScorer: "Kylian Mbappe",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
  {
    alias: "Max Family",
    predictions: {
      groupWinners: { A: "CZE", B: "SUI", C: "BRA", D: "TUR", E: "GER", F: "NED", G: "BEL", H: "ESP", I: "NOR", J: "ARG", K: "POR", L: "CRO" },
      semiFinals: ["NED", "POR", "BRA", "FRA"],
      finalists: ["BRA", "NED"],
      thirdPlaceParticipants: ["FRA", "POR"],
      champion: "BRA",
      thirdPlace: "FRA",
      topScorer: "Raphinha",
    },
    points: { groupWinners: 0, semiFinals: 0, finalists: 0, thirdPlaceParticipants: 0, champion: 0, thirdPlace: 0, topScorer: 0, total: 0 },
  },
];
