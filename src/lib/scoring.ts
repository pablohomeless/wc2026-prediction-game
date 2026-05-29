/**
 * Scoring Engine for WC 2026 Prediction Game
 *
 * Match scoring rules (same for group stage and knockouts):
 *  - Correct sign (1/X/2): 1pt
 *  - Correct goal difference (AND correct sign): 1pt
 *  - Exact score: 2pt  (this also means sign=correct AND diff=correct automatically)
 *  - Bonus game: ×3 multiplier (max 12pt)
 *  - Max 4pt per match (12pt if bonus)
 *
 * For knockout matches with extra time:
 *  - Use AET score if match went to extra time (not penalties for goals)
 *  - Penalty result only determines who advances, NOT scored
 *
 * Group standings:
 *  - 1pt per correct position (1st/2nd/3rd/4th) per group
 *
 * Knockout advancement:
 *  - R32: 1pt per team correctly predicted to reach R32
 *  - R16: 2pt per team correctly predicted to reach R16
 *  - QF: 2pt
 *  - SF: 2pt
 *  - 3rd place match teams: 2pt
 *  - Finalists: 2pt
 *
 * Honor board:
 *  - Champion: 10pt
 *  - Runner-up: 5pt
 *  - 3rd place: 2pt
 *  - Golden Boot 1st: 5pt
 *  - Golden Boot 2nd/3rd: 5pt each (if FIFA awards them)
 *  - Golden Ball 1st: 5pt
 *  - Golden Ball 2nd/3rd: 5pt each (if FIFA awards them)
 */

export interface MatchResult {
  homeScore: number;
  awayScore: number;
  homeScoreAet?: number | null;
  awayScoreAet?: number | null;
}

export interface MatchPrediction {
  homeScore: number;
  awayScore: number;
}

function getSign(homeScore: number, awayScore: number): "1" | "X" | "2" {
  if (homeScore > awayScore) return "1";
  if (homeScore === awayScore) return "X";
  return "2";
}

function getGoalDiff(homeScore: number, awayScore: number): number {
  return homeScore - awayScore;
}

/**
 * Calculate points for a single match prediction.
 * Uses AET score if available (knockout rounds that went to extra time).
 */
export function calculateMatchPoints(
  result: MatchResult,
  prediction: MatchPrediction,
  isBonusGame: boolean
): number {
  // Use AET score if match went to extra time
  const actualHome =
    result.homeScoreAet != null ? result.homeScoreAet : result.homeScore;
  const actualAway =
    result.awayScoreAet != null ? result.awayScoreAet : result.awayScore;

  const predHome = prediction.homeScore;
  const predAway = prediction.awayScore;

  let points = 0;

  const actualSign = getSign(actualHome, actualAway);
  const predSign = getSign(predHome, predAway);

  // Exact score: 2pt + implicit sign + diff correct
  if (predHome === actualHome && predAway === actualAway) {
    points = 4; // 2pt exact + 1pt sign + 1pt diff
  } else if (actualSign === predSign) {
    // Correct sign: 1pt
    points += 1;
    // Correct goal difference: additional 1pt
    if (getGoalDiff(predHome, predAway) === getGoalDiff(actualHome, actualAway)) {
      points += 1;
    }
  }

  // Apply bonus multiplier
  if (isBonusGame) {
    points *= 3;
  }

  return points;
}

/**
 * Calculate group standings points.
 * 1 point per correctly predicted position.
 */
export function calculateGroupStandingPoints(
  predicted: [number, number, number, number], // team IDs [1st, 2nd, 3rd, 4th]
  actual: [number, number, number, number]
): number {
  let points = 0;
  for (let i = 0; i < 4; i++) {
    if (predicted[i] === actual[i]) points++;
  }
  return points;
}

/**
 * Points for correctly predicting a team advances to a given round.
 */
export const ROUND_ADVANCEMENT_POINTS: Record<string, number> = {
  R32: 1,
  R16: 2,
  QF: 2,
  SF: 2,
  THIRD: 2,
  FINAL: 2,
};

/**
 * Honor board points
 */
export const HONOR_BOARD_POINTS = {
  champion: 10,
  runnerUp: 5,
  thirdPlace: 2,
  goldenBoot1: 5,
  goldenBoot2: 5,
  goldenBoot3: 5,
  goldenBall1: 5,
  goldenBall2: 5,
  goldenBall3: 5,
};

/**
 * Calculate honor board points.
 */
export function calculateHonorBoardPoints(
  prediction: {
    championId?: number | null;
    runnerUpId?: number | null;
    thirdPlaceId?: number | null;
    goldenBoot1?: string | null;
    goldenBoot2?: string | null;
    goldenBoot3?: string | null;
    goldenBall1?: string | null;
    goldenBall2?: string | null;
    goldenBall3?: string | null;
  },
  actual: {
    championId?: number | null;
    runnerUpId?: number | null;
    thirdPlaceId?: number | null;
    goldenBoot1?: string | null;
    goldenBoot2?: string | null;
    goldenBoot3?: string | null;
    goldenBall1?: string | null;
    goldenBall2?: string | null;
    goldenBall3?: string | null;
    boot2Awarded: boolean;
    boot3Awarded: boolean;
    ball2Awarded: boolean;
    ball3Awarded: boolean;
  }
): {
  pointsChampion: number;
  pointsRunnerUp: number;
  pointsThird: number;
  pointsBoot1: number;
  pointsBoot2: number;
  pointsBoot3: number;
  pointsBall1: number;
  pointsBall2: number;
  pointsBall3: number;
  total: number;
} {
  const normalizePlayer = (name?: string | null) =>
    (name ?? "").toLowerCase().trim().replace(/\s+/g, " ");

  const pts = {
    pointsChampion:
      prediction.championId && actual.championId && prediction.championId === actual.championId
        ? HONOR_BOARD_POINTS.champion
        : 0,
    pointsRunnerUp:
      prediction.runnerUpId && actual.runnerUpId && prediction.runnerUpId === actual.runnerUpId
        ? HONOR_BOARD_POINTS.runnerUp
        : 0,
    pointsThird:
      prediction.thirdPlaceId && actual.thirdPlaceId && prediction.thirdPlaceId === actual.thirdPlaceId
        ? HONOR_BOARD_POINTS.thirdPlace
        : 0,
    pointsBoot1:
      actual.goldenBoot1 && normalizePlayer(prediction.goldenBoot1) === normalizePlayer(actual.goldenBoot1)
        ? HONOR_BOARD_POINTS.goldenBoot1
        : 0,
    pointsBoot2:
      actual.boot2Awarded && actual.goldenBoot2 &&
      normalizePlayer(prediction.goldenBoot2) === normalizePlayer(actual.goldenBoot2)
        ? HONOR_BOARD_POINTS.goldenBoot2
        : 0,
    pointsBoot3:
      actual.boot3Awarded && actual.goldenBoot3 &&
      normalizePlayer(prediction.goldenBoot3) === normalizePlayer(actual.goldenBoot3)
        ? HONOR_BOARD_POINTS.goldenBoot3
        : 0,
    pointsBall1:
      actual.goldenBall1 && normalizePlayer(prediction.goldenBall1) === normalizePlayer(actual.goldenBall1)
        ? HONOR_BOARD_POINTS.goldenBall1
        : 0,
    pointsBall2:
      actual.ball2Awarded && actual.goldenBall2 &&
      normalizePlayer(prediction.goldenBall2) === normalizePlayer(actual.goldenBall2)
        ? HONOR_BOARD_POINTS.goldenBall2
        : 0,
    pointsBall3:
      actual.ball3Awarded && actual.goldenBall3 &&
      normalizePlayer(prediction.goldenBall3) === normalizePlayer(actual.goldenBall3)
        ? HONOR_BOARD_POINTS.goldenBall3
        : 0,
  };

  const total = Object.values(pts).reduce((a, b) => a + b, 0);
  return { ...pts, total };
}

/**
 * Maximum possible points (theoretical perfect score)
 */
export const MAX_POINTS = {
  groupMatches: 72 * 4 + 12 * 8, // 72 normal (4pt max) + 12 bonus (12pt max) = 432
  groupStandings: 12 * 4, // 48
  r32Advancement: 16 * 1, // 16
  r32Matches: 16 * 4, // 64
  r16Advancement: 8 * 2, // 16
  r16Matches: 8 * 4, // 32
  qfAdvancement: 4 * 2, // 8
  qfMatches: 4 * 4, // 16
  sfAdvancement: 2 * 2, // 4 (not awarding for SF match teams - they reach FINAL and THIRD)
  sfMatches: 2 * 4, // 8
  thirdMatch: 1 * 4, // 4
  thirdAdvancement: 2 * 2, // 4 (teams in 3rd/4th)
  finalMatch: 1 * 4, // 4
  finalAdvancement: 2 * 2, // 4 (teams in final)
  honorBoard: 10 + 5 + 2 + 5 + 5 + 5 + 5 + 5 + 5, // 47
};
