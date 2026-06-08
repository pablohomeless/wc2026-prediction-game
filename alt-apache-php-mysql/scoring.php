<?php
/**
 * Scoring Engine — WC 2026 Prediction Game (PHP port)
 *
 * Scoring rules:
 *   Match: Correct sign (1/X/2) = 1pt
 *          Correct goal diff AND sign    = 2pt
 *          Exact score                   = 4pt  (also covers sign + diff)
 *   Bonus game: ×3 multiplier (max 12pt)
 *
 *   Group standings: 1pt per correct position (1st–4th)
 *
 *   Special predictions:
 *     Champion   = 10pt
 *     Runner-up  = 5pt
 *     3rd place  = 2pt
 *     Each golden boot/ball slot = 5pt (if awarded)
 */

require_once __DIR__ . '/db.php';

// ─────────────────────────────────────────────────────────────────
// Match scoring
// ─────────────────────────────────────────────────────────────────

function get_sign(int $home, int $away): string {
    if ($home > $away) return '1';
    if ($home === $away) return 'X';
    return '2';
}

/**
 * Calculate points for a single match prediction.
 *
 * @param array $result     Keys: home_score, away_score, home_score_aet, away_score_aet
 * @param array $prediction Keys: home_score, away_score
 * @param bool  $is_bonus
 */
function calculate_match_points(array $result, array $prediction, bool $is_bonus): int {
    // Use AET score if available
    $actual_home = $result['home_score_aet'] ?? $result['home_score'];
    $actual_away = $result['away_score_aet'] ?? $result['away_score'];

    $pred_home = (int)$prediction['home_score'];
    $pred_away = (int)$prediction['away_score'];

    $actual_home = (int)$actual_home;
    $actual_away = (int)$actual_away;

    $points = 0;

    if ($pred_home === $actual_home && $pred_away === $actual_away) {
        // Exact score: 4pt (includes sign + diff)
        $points = 4;
    } elseif (get_sign($pred_home, $pred_away) === get_sign($actual_home, $actual_away)) {
        // Correct sign: 1pt
        $points = 1;
        // Correct goal diff: +1pt
        if (($pred_home - $pred_away) === ($actual_home - $actual_away)) {
            $points = 2;
        }
    }

    if ($is_bonus) {
        $points *= 3;
    }

    return $points;
}

/**
 * Calculate group standings points.
 * $predicted and $actual are arrays of 4 team IDs [1st, 2nd, 3rd, 4th].
 */
function calculate_group_standing_points(array $predicted, array $actual): int {
    $points = 0;
    for ($i = 0; $i < 4; $i++) {
        if (isset($predicted[$i], $actual[$i]) && (int)$predicted[$i] === (int)$actual[$i]) {
            $points++;
        }
    }
    return $points;
}

/**
 * Calculate special prediction points.
 * $pred: row from special_predictions
 * $settings: row from tournament_settings
 */
function calculate_special_points(array $pred, array $settings): array {
    $pts = [
        'pts_champion'   => 0,
        'pts_runner_up'  => 0,
        'pts_third_place'=> 0,
        'pts_golden_boot'=> 0,
        'pts_golden_ball'=> 0,
    ];

    if (!empty($settings['champion_id']) && (int)$pred['champion_id'] === (int)$settings['champion_id']) {
        $pts['pts_champion'] = 10;
    }
    if (!empty($settings['runner_up_id']) && (int)$pred['runner_up_id'] === (int)$settings['runner_up_id']) {
        $pts['pts_runner_up'] = 5;
    }
    if (!empty($settings['third_place_id']) && (int)$pred['third_place_id'] === (int)$settings['third_place_id']) {
        $pts['pts_third_place'] = 2;
    }

    // Golden Boot (up to 3 slots, 5pt each if slot is awarded)
    $boot_pts = 0;
    $boot_slots = [
        ['pred' => 'golden_boot_1', 'actual' => 'golden_boot_1', 'awarded' => true],
        ['pred' => 'golden_boot_2', 'actual' => 'golden_boot_2', 'awarded' => !empty($settings['boot_2_awarded'])],
        ['pred' => 'golden_boot_3', 'actual' => 'golden_boot_3', 'awarded' => !empty($settings['boot_3_awarded'])],
    ];
    foreach ($boot_slots as $slot) {
        if ($slot['awarded'] && !empty($settings[$slot['actual']]) && !empty($pred[$slot['pred']])) {
            if (mb_strtolower(trim($pred[$slot['pred']])) === mb_strtolower(trim($settings[$slot['actual']]))) {
                $boot_pts += 5;
            }
        }
    }
    $pts['pts_golden_boot'] = $boot_pts;

    // Golden Ball
    $ball_pts = 0;
    $ball_slots = [
        ['pred' => 'golden_ball_1', 'actual' => 'golden_ball_1', 'awarded' => true],
        ['pred' => 'golden_ball_2', 'actual' => 'golden_ball_2', 'awarded' => !empty($settings['ball_2_awarded'])],
        ['pred' => 'golden_ball_3', 'actual' => 'golden_ball_3', 'awarded' => !empty($settings['ball_3_awarded'])],
    ];
    foreach ($ball_slots as $slot) {
        if ($slot['awarded'] && !empty($settings[$slot['actual']]) && !empty($pred[$slot['pred']])) {
            if (mb_strtolower(trim($pred[$slot['pred']])) === mb_strtolower(trim($settings[$slot['actual']]))) {
                $ball_pts += 5;
            }
        }
    }
    $pts['pts_golden_ball'] = $ball_pts;

    return $pts;
}

// ─────────────────────────────────────────────────────────────────
// Group standings calculation from match results
// ─────────────────────────────────────────────────────────────────

/**
 * Derive actual group standings from completed matches for a given group.
 * Returns array of team_ids ordered 1st→4th, or null if group not complete.
 *
 * Uses: W (3pt), D (1pt), L (0pt), then GD, then GF tiebreaker.
 */
function compute_group_standings(string $group_id): ?array {
    $db = get_db();
    $stmt = $db->prepare(
        "SELECT m.home_team_id, m.away_team_id, m.home_score, m.away_score
         FROM matches m
         WHERE m.group_id = ? AND m.home_score IS NOT NULL AND m.away_score IS NOT NULL"
    );
    $stmt->execute([$group_id]);
    $results = $stmt->fetchAll();

    if (count($results) < 6) {
        return null; // group not complete
    }

    // Collect all team IDs in this group
    $team_ids_q = $db->prepare(
        "SELECT id FROM teams WHERE group_id = ? ORDER BY group_pos"
    );
    $team_ids_q->execute([$group_id]);
    $teams = array_column($team_ids_q->fetchAll(), 'id');

    $table = [];
    foreach ($teams as $tid) {
        $table[$tid] = ['pts' => 0, 'gd' => 0, 'gf' => 0];
    }

    foreach ($results as $r) {
        $h = (int)$r['home_team_id'];
        $a = (int)$r['away_team_id'];
        $hs = (int)$r['home_score'];
        $as = (int)$r['away_score'];

        $table[$h]['gf'] += $hs;
        $table[$a]['gf'] += $as;
        $table[$h]['gd'] += $hs - $as;
        $table[$a]['gd'] += $as - $hs;

        if ($hs > $as) {
            $table[$h]['pts'] += 3;
        } elseif ($hs === $as) {
            $table[$h]['pts'] += 1;
            $table[$a]['pts'] += 1;
        } else {
            $table[$a]['pts'] += 3;
        }
    }

    uasort($table, function ($x, $y) {
        if ($y['pts'] !== $x['pts']) return $y['pts'] - $x['pts'];
        if ($y['gd']  !== $x['gd'])  return $y['gd']  - $x['gd'];
        return $y['gf'] - $x['gf'];
    });

    return array_keys($table);
}

// ─────────────────────────────────────────────────────────────────
// Full recalculation
// ─────────────────────────────────────────────────────────────────

/**
 * Recalculate all user points from scratch.
 * Called by admin after entering results.
 */
function recalculate_all_scores(): void {
    $db = get_db();

    // 1. Recalculate match prediction points for every match that has a result
    $matches_stmt = $db->query(
        "SELECT id, round, home_score, away_score, home_score_aet, away_score_aet, is_bonus_game
         FROM matches
         WHERE home_score IS NOT NULL AND away_score IS NOT NULL"
    );
    $matches = $matches_stmt->fetchAll();

    foreach ($matches as $match) {
        $preds_stmt = $db->prepare(
            "SELECT id, home_score, away_score FROM match_predictions WHERE match_id = ?"
        );
        $preds_stmt->execute([$match['id']]);
        $predictions = $preds_stmt->fetchAll();

        foreach ($predictions as $pred) {
            $pts = calculate_match_points($match, $pred, (bool)$match['is_bonus_game']);
            $db->prepare("UPDATE match_predictions SET points = ? WHERE id = ?")
               ->execute([$pts, $pred['id']]);
        }
        $db->prepare("UPDATE matches SET is_scored = 1 WHERE id = ?")->execute([$match['id']]);
    }

    // 2. Recalculate group standing points for completed groups
    foreach (range('A', 'L') as $group_id) {
        $actual = compute_group_standings($group_id);
        if ($actual === null) continue;

        $gp_stmt = $db->prepare(
            "SELECT id, pos1_team_id, pos2_team_id, pos3_team_id, pos4_team_id
             FROM group_predictions WHERE group_id = ?"
        );
        $gp_stmt->execute([$group_id]);
        $gp_rows = $gp_stmt->fetchAll();

        foreach ($gp_rows as $gp) {
            $predicted = [
                $gp['pos1_team_id'],
                $gp['pos2_team_id'],
                $gp['pos3_team_id'],
                $gp['pos4_team_id'],
            ];
            $pts = calculate_group_standing_points($predicted, $actual);
            $db->prepare("UPDATE group_predictions SET points = ? WHERE id = ?")
               ->execute([$pts, $gp['id']]);
        }
    }

    // 3. Recalculate knockout advancement prediction points
    $ko_round_pts = ['R32' => 1, 'R16' => 2, 'QF' => 2, 'SF' => 2, 'THIRD' => 2, 'FINAL' => 2];
    foreach ($ko_round_pts as $round => $pts_per_team) {
        // Collect the teams that actually played in this round
        $teams_stmt = $db->prepare(
            "SELECT home_team_id, away_team_id FROM matches
             WHERE round = ? AND home_team_id IS NOT NULL AND away_team_id IS NOT NULL"
        );
        $teams_stmt->execute([$round]);
        $actual_teams = [];
        foreach ($teams_stmt->fetchAll() as $row) {
            $actual_teams[(int)$row['home_team_id']] = true;
            $actual_teams[(int)$row['away_team_id']] = true;
        }
        if (empty($actual_teams)) continue; // round hasn't started yet

        // Score each prediction for this round
        $kp_stmt = $db->prepare("SELECT id, team_id FROM knockout_predictions WHERE round = ?");
        $kp_stmt->execute([$round]);
        foreach ($kp_stmt->fetchAll() as $kp) {
            $pts = isset($actual_teams[(int)$kp['team_id']]) ? $pts_per_team : 0;
            $db->prepare("UPDATE knockout_predictions SET points = ? WHERE id = ?")
               ->execute([$pts, $kp['id']]);
        }
    }

    // 4. Recalculate special prediction points
    $settings_row = $db->query("SELECT * FROM tournament_settings WHERE id = 1")->fetch();
    if ($settings_row) {
        $sp_stmt = $db->query("SELECT * FROM special_predictions");
        foreach ($sp_stmt->fetchAll() as $sp) {
            $pts = calculate_special_points($sp, $settings_row);
            $db->prepare(
                "UPDATE special_predictions
                 SET pts_champion=?, pts_runner_up=?, pts_third_place=?, pts_golden_boot=?, pts_golden_ball=?
                 WHERE id=?"
            )->execute([
                $pts['pts_champion'],
                $pts['pts_runner_up'],
                $pts['pts_third_place'],
                $pts['pts_golden_boot'],
                $pts['pts_golden_ball'],
                $sp['id'],
            ]);
        }
    }

    // 5. Aggregate into user_scores
    $users_stmt = $db->query("SELECT id FROM users WHERE is_active = 1");
    foreach ($users_stmt->fetchAll() as $u) {
        $uid = $u['id'];

        // Match points split by round
        $match_pts_q = $db->prepare(
            "SELECT m.round, m.is_bonus_game, SUM(mp.points) AS pts
             FROM match_predictions mp
             JOIN matches m ON m.id = mp.match_id
             WHERE mp.user_id = ?
             GROUP BY m.round, m.is_bonus_game"
        );
        $match_pts_q->execute([$uid]);
        $rows = $match_pts_q->fetchAll();

        $pts_group = 0;
        $pts_knockout = 0;
        $pts_bonus = 0;

        foreach ($rows as $row) {
            $pts = (int)$row['pts'];
            if ($row['round'] === 'GROUP') {
                $pts_group += $pts;
                if ($row['is_bonus_game']) {
                    $pts_bonus += $pts;
                }
            } else {
                $pts_knockout += $pts;
            }
        }

        // Group standings points
        $gp_q = $db->prepare("SELECT COALESCE(SUM(points),0) AS pts FROM group_predictions WHERE user_id = ?");
        $gp_q->execute([$uid]);
        $pts_standings = (int)$gp_q->fetchColumn();

        // Knockout advancement points
        $ko_adv_q = $db->prepare("SELECT COALESCE(SUM(points),0) FROM knockout_predictions WHERE user_id = ?");
        $ko_adv_q->execute([$uid]);
        $pts_ko_advancement = (int)($ko_adv_q->fetchColumn() ?: 0);

        // Special points
        $sp_q = $db->prepare(
            "SELECT COALESCE(pts_champion+pts_runner_up+pts_third_place+pts_golden_boot+pts_golden_ball,0)
             FROM special_predictions WHERE user_id = ?"
        );
        $sp_q->execute([$uid]);
        $pts_special = (int)($sp_q->fetchColumn() ?: 0);

        // Admin overrides
        $ao_q = $db->prepare("SELECT COALESCE(SUM(points_override),0) FROM admin_overrides WHERE user_id = ?");
        $ao_q->execute([$uid]);
        $pts_override = (int)($ao_q->fetchColumn() ?: 0);

        $pts_total = $pts_group + $pts_knockout + $pts_ko_advancement + $pts_standings + $pts_special + $pts_override;

        // Upsert user_scores
        $db->prepare(
            "INSERT INTO user_scores (user_id, points_total, points_group_matches, points_group_standings,
             points_knockout, points_knockout_advancement, points_bonus, points_special)
             VALUES (?,?,?,?,?,?,?,?)
             ON DUPLICATE KEY UPDATE
             points_total=VALUES(points_total),
             points_group_matches=VALUES(points_group_matches),
             points_group_standings=VALUES(points_group_standings),
             points_knockout=VALUES(points_knockout),
             points_knockout_advancement=VALUES(points_knockout_advancement),
             points_bonus=VALUES(points_bonus),
             points_special=VALUES(points_special)"
        )->execute([$uid, $pts_total, $pts_group, $pts_standings, $pts_knockout, $pts_ko_advancement, $pts_bonus, $pts_special]);
    }
}
