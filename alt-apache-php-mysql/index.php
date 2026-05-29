<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/_layout.php';

auth_start();
$db = get_db();

// Fetch scoreboard
$scores = $db->query(
    "SELECT us.*, u.alias
     FROM user_scores us
     JOIN users u ON u.id = us.user_id
     WHERE u.is_active = 1
     ORDER BY us.points_total DESC, u.alias ASC"
)->fetchAll();

// Fetch settings (deadline, status)
$settings = $db->query("SELECT * FROM tournament_settings WHERE id = 1")->fetch();
$deadline_passed = false;
if (!empty($settings['prediction_deadline'])) {
    $deadline_passed = new DateTime() > new DateTime($settings['prediction_deadline']);
}

$user = current_user();

layout_head('Scoreboard');
?>

<div class="hero">
    <div style="font-size:3rem">⚽</div>
    <h1>Porra Mundial 2026</h1>
    <p>FIFA World Cup — USA &bull; Mexico &bull; Canada</p>
    <?php if (!$deadline_passed && !empty($settings['prediction_deadline'])): ?>
    <div class="deadline-banner" style="max-width:420px;margin:1rem auto 0">
        ⏰ Prediction deadline:
        <strong><?= date('M j, Y H:i', strtotime($settings['prediction_deadline'])) ?> UTC</strong>
    </div>
    <?php endif; ?>
    <?php if (!$user && !$deadline_passed): ?>
    <div style="margin-top:1.25rem;display:flex;gap:.75rem;justify-content:center">
        <a href="register.php" class="btn btn-gold">Register &amp; Play</a>
        <a href="rules.php" class="btn btn-secondary">View Rules</a>
    </div>
    <?php endif; ?>
</div>

<?php if (!empty($scores)): ?>
<!-- Stat cards -->
<div class="stat-cards">
    <div class="stat-card">
        <div class="stat-val"><?= count($scores) ?></div>
        <div class="stat-lbl">Participants</div>
    </div>
    <?php $leader = $scores[0]; ?>
    <div class="stat-card">
        <div class="stat-val text-gold"><?= $leader['points_total'] ?></div>
        <div class="stat-lbl">Leader's pts</div>
    </div>
    <?php
        $user_row = null;
        if ($user) {
            foreach ($scores as $s) {
                if ($s['alias'] === $user['alias']) { $user_row = $s; break; }
            }
        }
    ?>
    <?php if ($user_row): ?>
    <div class="stat-card">
        <div class="stat-val"><?= $user_row['points_total'] ?></div>
        <div class="stat-lbl">Your points</div>
    </div>
    <?php endif; ?>
</div>
<?php endif; ?>

<div class="card">
    <div class="card-title">🏆 Leaderboard</div>

    <?php if (empty($scores)): ?>
    <div class="text-center" style="padding:2.5rem 0">
        <div style="font-size:2.5rem">🎯</div>
        <p style="font-size:1.1rem;margin:.5rem 0">No participants yet</p>
        <p class="text-muted">Be the first to register!</p>
        <a href="register.php" class="btn btn-primary mt-2">Register Now</a>
    </div>
    <?php else: ?>
    <div class="table-wrap">
    <table class="data-table">
        <thead>
            <tr>
                <th>#</th>
                <th>Player</th>
                <th>Groups</th>
                <th>Stand.</th>
                <th>Knockout</th>
                <th>Special</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
        <?php foreach ($scores as $i => $row):
            $rank = $i + 1;
            $medal = match($rank) { 1=>'🥇', 2=>'🥈', 3=>'🥉', default=>'' };
            $is_me = $user && $row['alias'] === $user['alias'];
        ?>
            <tr <?= $is_me ? 'style="background:#eff6ff"' : '' ?>>
                <td>
                    <?php if ($medal): ?>
                        <span class="rank-medal"><?= $medal ?></span>
                    <?php else: ?>
                        <span class="rank-num"><?= $rank ?></span>
                    <?php endif; ?>
                </td>
                <td>
                    <strong><?= htmlspecialchars($row['alias']) ?></strong>
                    <?php if ($is_me): ?> <span class="badge badge-pending">You</span><?php endif; ?>
                </td>
                <td><?= (int)$row['points_group_matches'] ?></td>
                <td><?= (int)$row['points_group_standings'] ?></td>
                <td><?= (int)$row['points_knockout'] ?></td>
                <td><?= (int)$row['points_special'] ?></td>
                <td><strong><?= (int)$row['points_total'] ?></strong></td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
    </div>
    <?php endif; ?>
</div>

<?php layout_foot(); ?>
