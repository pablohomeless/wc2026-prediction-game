<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/data.php';
require_once __DIR__ . '/_layout.php';

auth_start();

$db   = get_db();
$user = current_user();
$uid  = $user ? (int)$user['id'] : null;

// Round filter
$round_filter = $_GET['round'] ?? 'ALL';
$valid_rounds = ['ALL','GROUP','R32','R16','QF','SF','THIRD','FINAL'];
if (!in_array($round_filter, $valid_rounds, true)) $round_filter = 'ALL';

// Build SQL
$where = $round_filter !== 'ALL' ? "WHERE m.round = " . $db->quote($round_filter) : '';

$matches = $db->query(
    "SELECT m.*,
            th.name as home_name, th.code as home_code, th.flag_emoji as home_flag,
            ta.name as away_name, ta.code as away_code, ta.flag_emoji as away_flag
     FROM matches m
     JOIN teams th ON th.id = m.home_team_id
     JOIN teams ta ON ta.id = m.away_team_id
     {$where}
     ORDER BY m.match_number"
)->fetchAll();

// Load user's match predictions if logged in
$my_preds = [];
if ($uid) {
    $stmt = $db->prepare("SELECT match_id, home_score, away_score FROM match_predictions WHERE user_id = ?");
    $stmt->execute([$uid]);
    foreach ($stmt->fetchAll() as $row) {
        $my_preds[$row['match_id']] = $row;
    }
}

// Load user's knockout advancement predictions
$my_ko_preds = [];
if ($uid) {
    $stmt = $db->prepare("SELECT round, team_id, points FROM knockout_predictions WHERE user_id = ?");
    $stmt->execute([$uid]);
    foreach ($stmt->fetchAll() as $row) {
        $my_ko_preds[$row['round']][] = $row;
    }
}

$teams_map = get_teams_map();

// User total points
$my_total = null;
if ($uid) {
    $stmt = $db->prepare("SELECT points_total FROM user_scores WHERE user_id = ?");
    $stmt->execute([$uid]);
    $my_total = $stmt->fetchColumn();
}

require_once __DIR__ . '/scoring.php';

function result_pts(array $m, ?array $pred): ?int {
    if ($pred === null) return null;
    if ($m['home_score'] === null || $m['away_score'] === null) return null;
    $result = [
        'home_score' => (int)$m['home_score'],
        'away_score' => (int)$m['away_score'],
        'home_score_aet' => $m['home_score_aet'] !== null ? (int)$m['home_score_aet'] : null,
        'away_score_aet' => $m['away_score_aet'] !== null ? (int)$m['away_score_aet'] : null,
    ];
    $prediction = [
        'home_score' => (int)$pred['home_score'],
        'away_score' => (int)$pred['away_score'],
    ];
    return calculate_match_points($result, $prediction, (bool)$m['is_bonus_game']);
}

$round_labels = [
    'ALL'   => 'All Matches',
    'GROUP' => 'Group Stage',
    'R32'   => 'Round of 32',
    'R16'   => 'Round of 16',
    'QF'    => 'Quarterfinals',
    'SF'    => 'Semifinals',
    'THIRD' => '3rd Place',
    'FINAL' => 'Final',
];

layout_head('Results');
?>

<div class="card-title" style="font-size:1.4rem;margin-bottom:1rem">⚽ Match Results</div>

<!-- Round filter -->
<div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1.25rem;">
    <?php foreach ($round_labels as $r => $lbl): ?>
    <a href="?round=<?= $r ?>"
       class="btn btn-sm <?= $round_filter===$r ? 'btn-primary' : 'btn-secondary' ?>">
       <?= htmlspecialchars($lbl) ?>
    </a>
    <?php endforeach; ?>
</div>

<?php if ($uid && $my_total !== null): ?>
<div class="stat-cards" style="margin-bottom:1.25rem">
    <div class="stat-card">
        <div class="stat-val text-gold"><?= (int)$my_total ?></div>
        <div class="stat-lbl">Your Total Points</div>
    </div>
</div>
<?php endif; ?>

<?php if (empty($matches)): ?>
<div class="card text-center" style="padding:2.5rem">
    <div style="font-size:2.5rem">🏟️</div>
    <p style="margin-top:.5rem">No matches found for this filter.</p>
</div>
<?php else: ?>

<?php
// Group by round for display
$by_round = [];
foreach ($matches as $m) {
    $by_round[$m['round']][] = $m;
}

// Build a set of team IDs that actually appeared in each knockout round
$teams_in_round = [];
foreach ($matches as $m) {
    if ($m['round'] !== 'GROUP' && $m['home_team_id'] !== null) {
        $teams_in_round[$m['round']][(int)$m['home_team_id']] = true;
        $teams_in_round[$m['round']][(int)$m['away_team_id']] = true;
    }
}
?>

<?php foreach ($by_round as $round => $round_matches): ?>
<div class="card">
    <div class="card-title">
        <?= htmlspecialchars($round_labels[$round] ?? $round) ?>
        <span class="text-muted text-small">(<?= count($round_matches) ?> matches)</span>
    </div>

    <?php foreach ($round_matches as $m):
        $has_result = $m['home_score'] !== null && $m['away_score'] !== null;
        $pred = $my_preds[$m['id']] ?? null;
        $pts  = result_pts($m, $pred);
        $status_cls = $has_result ? 'badge-done' : 'badge-pending';
        $status_lbl = $has_result ? 'FT' : 'Pending';
    ?>
    <div class="match-row">
        <span class="match-meta">M<?= $m['match_number'] ?></span>
        <?php if ($m['is_bonus']): ?>
        <span class="badge badge-bonus">Bonus</span>
        <?php endif; ?>
        <span class="badge <?= $status_cls ?>"><?= $status_lbl ?></span>

        <div class="match-teams">
            <span class="team-home"><?= $m['home_flag']??'' ?> <?= htmlspecialchars($m['home_name']) ?></span>
            <?php if ($has_result): ?>
            <span style="font-weight:800;font-size:1.1rem;padding:0 .4rem;background:#f1f5f9;border-radius:6px;min-width:3.5rem;text-align:center">
                <?= $m['home_score'] ?>&ndash;<?= $m['away_score'] ?>
                <?php if ($m['home_score_aet'] !== null): ?>
                <span style="font-size:.7rem;color:#94a3b8">(AET)</span>
                <?php endif; ?>
            </span>
            <?php else: ?>
            <span class="vs">vs</span>
            <?php endif; ?>
            <span class="team-away"><?= htmlspecialchars($m['away_name']) ?> <?= $m['away_flag']??'' ?></span>
        </div>

        <?php if ($uid && $pred): ?>
        <span style="font-size:.82rem;color:#475569">
            Your prediction: <strong><?= (int)$pred['home_score'] ?>&ndash;<?= (int)$pred['away_score'] ?></strong>
        </span>
        <?php if ($pts !== null): ?>
        <span class="pts-chip pts-<?= $pts ?>">+<?= $pts ?>pt<?= $pts==1?'':'s' ?></span>
        <?php endif; ?>
        <?php elseif ($uid && !$pred && !$m['home_team_id']): ?>
        <!-- Knockout TBD — no prediction expected yet -->
        <?php elseif ($uid): ?>
        <span style="font-size:.82rem;color:#94a3b8">No prediction</span>
        <?php endif; ?>

    </div>
    <?php endforeach; ?>

    <?php
    // Show knockout advancement picks for this round (not group stage)
    if ($uid && $round !== 'GROUP' && !empty($my_ko_preds[$round])):
        $round_teams_known = !empty($teams_in_round[$round]);
        $ko_pts_total = array_sum(array_column($my_ko_preds[$round], 'points'));
    ?>
    <div style="margin-top:.75rem;padding:.75rem;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0">
        <div style="font-size:.82rem;font-weight:600;color:#475569;margin-bottom:.5rem">
            🏆 Your advancement picks
            <?php if ($round_teams_known && $ko_pts_total > 0): ?>
            <span class="pts-chip pts-<?= min($ko_pts_total,4) ?>" style="margin-left:.5rem">+<?= $ko_pts_total ?>pts</span>
            <?php endif; ?>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:.35rem">
        <?php foreach ($my_ko_preds[$round] as $kp):
            $team = $teams_map[$kp['team_id']] ?? null;
            if (!$team) continue;
            $correct  = $round_teams_known && isset($teams_in_round[$round][$kp['team_id']]);
            $unknown  = !$round_teams_known;
            $chip_bg  = $unknown ? '#e2e8f0' : ($correct ? '#dcfce7' : '#fee2e2');
            $chip_col = $unknown ? '#64748b' : ($correct ? '#166534' : '#991b1b');
            $icon     = $unknown ? '' : ($correct ? '✓ ' : '✗ ');
        ?>
        <span style="display:inline-flex;align-items:center;gap:.25rem;padding:.2rem .55rem;border-radius:999px;font-size:.78rem;font-weight:600;background:<?= $chip_bg ?>;color:<?= $chip_col ?>">
            <?= $team['flag']??'' ?> <?= $icon ?><?= htmlspecialchars($team['code']) ?>
        </span>
        <?php endforeach; ?>
        </div>
        <?php if (!$round_teams_known): ?>
        <p style="font-size:.75rem;color:#94a3b8;margin-top:.4rem">Results pending — picks will be evaluated once this round's matches are entered.</p>
        <?php endif; ?>
    </div>
    <?php endif; ?>
</div>
<?php endforeach; ?>
<?php endif; ?>

<?php layout_foot(); ?>
