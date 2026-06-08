<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/data.php';
require_once __DIR__ . '/_layout.php';

auth_start();
require_login();

$db   = get_db();
$user = current_user();
$uid  = (int)$user['id'];

// ─── Deadline check ────────────────────────────────────────────────
$settings = $db->query("SELECT * FROM tournament_settings WHERE id = 1")->fetch();
$locked = false;
if (!empty($settings['prediction_deadline'])) {
    $locked = new DateTime() > new DateTime($settings['prediction_deadline']);
}

// ─── POST handlers ────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$locked) {
    csrf_verify();
    $tab = $_POST['active_tab'] ?? 'group-stage';

    if ($tab === 'group-stage') {
        // Save group-stage match predictions
        $stmt = $db->prepare(
            "INSERT INTO match_predictions (user_id, match_id, home_score, away_score)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE home_score = VALUES(home_score), away_score = VALUES(away_score)"
        );
        foreach ($_POST['home'] ?? [] as $match_id => $home_score) {
            $away_score = $_POST['away'][$match_id] ?? null;
            if ($home_score !== '' && $away_score !== '') {
                $stmt->execute([$uid, (int)$match_id, (int)$home_score, (int)$away_score]);
            }
        }
        flash_set('success', 'Group stage predictions saved!');
        header('Location: predictions.php?tab=group-stage');
        exit;
    }

    if ($tab === 'standings') {
        // Save group standings predictions
        $stmt = $db->prepare(
            "INSERT INTO group_predictions (user_id, group_id, pos1_team_id, pos2_team_id, pos3_team_id, pos4_team_id)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE pos1_team_id=VALUES(pos1_team_id),
             pos2_team_id=VALUES(pos2_team_id), pos3_team_id=VALUES(pos3_team_id),
             pos4_team_id=VALUES(pos4_team_id)"
        );
        foreach ($_POST['standings'] ?? [] as $group_id => $positions) {
            $p = $positions;
            if (!empty($p[1]) && !empty($p[2]) && !empty($p[3]) && !empty($p[4])) {
                $stmt->execute([
                    $uid, strtoupper($group_id),
                    (int)$p[1], (int)$p[2], (int)$p[3], (int)$p[4],
                ]);
            }
        }
        flash_set('success', 'Group standings predictions saved!');
        header('Location: predictions.php?tab=standings');
        exit;
    }

    if ($tab === 'knockout') {
        // Save knockout round advancement predictions
        $allowed_rounds = ['R32', 'R16', 'QF', 'SF', 'THIRD', 'FINAL'];
        $stmt = $db->prepare(
            "INSERT INTO knockout_predictions (user_id, round, slot, team_id)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE team_id = VALUES(team_id)"
        );
        foreach ($_POST['knockout'] ?? [] as $round => $slots) {
            if (!in_array($round, $allowed_rounds, true)) continue;
            foreach ($slots as $slot => $team_id) {
                $team_id = (int)$team_id;
                $slot    = (int)$slot;
                if ($team_id > 0 && $slot > 0) {
                    $stmt->execute([$uid, $round, $slot, $team_id]);
                }
            }
        }
        flash_set('success', 'Knockout predictions saved!');
        header('Location: predictions.php?tab=knockout');
        exit;
    }

    if ($tab === 'special') {
        // Save special predictions
        $champion   = (int)($_POST['champion_team_id'] ?? 0);
        $runner_up  = (int)($_POST['runner_up_team_id'] ?? 0);
        $third      = (int)($_POST['third_place_team_id'] ?? 0);
        $boot1      = trim($_POST['golden_boot_1'] ?? '');
        $boot2      = trim($_POST['golden_boot_2'] ?? '');
        $boot3      = trim($_POST['golden_boot_3'] ?? '');
        $ball1      = trim($_POST['golden_ball_1'] ?? '');
        $ball2      = trim($_POST['golden_ball_2'] ?? '');
        $ball3      = trim($_POST['golden_ball_3'] ?? '');

        $db->prepare(
            "INSERT INTO special_predictions
              (user_id, champion_id, runner_up_id, third_place_id,
               golden_boot_1, golden_boot_2, golden_boot_3,
               golden_ball_1, golden_ball_2, golden_ball_3)
             VALUES (?,?,?,?,?,?,?,?,?,?)
             ON DUPLICATE KEY UPDATE
              champion_id=VALUES(champion_id),
              runner_up_id=VALUES(runner_up_id),
              third_place_id=VALUES(third_place_id),
              golden_boot_1=VALUES(golden_boot_1), golden_boot_2=VALUES(golden_boot_2),
              golden_boot_3=VALUES(golden_boot_3), golden_ball_1=VALUES(golden_ball_1),
              golden_ball_2=VALUES(golden_ball_2), golden_ball_3=VALUES(golden_ball_3)"
        )->execute([
            $uid, $champion ?: null, $runner_up ?: null, $third ?: null,
            $boot1 ?: null, $boot2 ?: null, $boot3 ?: null,
            $ball1 ?: null, $ball2 ?: null, $ball3 ?: null,
        ]);

        flash_set('success', 'Special predictions saved!');
        header('Location: predictions.php?tab=special');
        exit;
    }
}

// ─── Load existing predictions ─────────────────────────────────────
$match_preds_raw = $db->prepare(
    "SELECT match_id, home_score, away_score FROM match_predictions WHERE user_id = ?"
);
$match_preds_raw->execute([$uid]);
$match_preds = [];
foreach ($match_preds_raw->fetchAll() as $row) {
    $match_preds[$row['match_id']] = $row;
}

$group_preds_raw = $db->prepare(
    "SELECT group_id, pos1_team_id, pos2_team_id, pos3_team_id, pos4_team_id
     FROM group_predictions WHERE user_id = ?"
);
$group_preds_raw->execute([$uid]);
$group_preds = [];
foreach ($group_preds_raw->fetchAll() as $row) {
    $group_preds[$row['group_id']] = $row;
}

$sp = $db->prepare("SELECT * FROM special_predictions WHERE user_id = ? LIMIT 1");
$sp->execute([$uid]);
$special = $sp->fetch() ?: [];

$ko_preds_raw = $db->prepare(
    "SELECT round, slot, team_id FROM knockout_predictions WHERE user_id = ?"
);
$ko_preds_raw->execute([$uid]);
$ko_preds = [];
foreach ($ko_preds_raw->fetchAll() as $row) {
    $ko_preds[$row['round']][(int)$row['slot']] = (int)$row['team_id'];
}

// ─── Load group stage matches (M1–M72) ────────────────────────────
$matches_raw = $db->query(
    "SELECT m.*, th.name as home_name, th.code as home_code, th.flag_emoji as home_flag,
            ta.name as away_name, ta.code as away_code, ta.flag_emoji as away_flag,
            m.group_id, m.is_bonus_game as is_bonus
     FROM matches m
     JOIN teams th ON th.id = m.home_team_id
     JOIN teams ta ON ta.id = m.away_team_id
     WHERE m.round = 'GROUP'
     ORDER BY m.group_id, m.match_number"
)->fetchAll();

// Group by group_id
$matches_by_group = [];
foreach ($matches_raw as $m) {
    $matches_by_group[$m['group_id']][] = $m;
}

$active_tab = $_GET['tab'] ?? 'group-stage';
$teams_map = get_teams_map();

// Build team options for selects
$all_teams_sorted = TEAMS;
usort($all_teams_sorted, fn($a,$b) => strcmp($a['name'], $b['name']));

$ko_rounds = [
    'R32'   => ['label' => 'Round of 32',    'slots' => 32],
    'R16'   => ['label' => 'Round of 16',    'slots' => 16],
    'QF'    => ['label' => 'Quarter-finals', 'slots' => 8],
    'SF'    => ['label' => 'Semi-finals',    'slots' => 4],
    'THIRD' => ['label' => '3rd Place',      'slots' => 2],
    'FINAL' => ['label' => 'Final',          'slots' => 2],
];

layout_head('Predictions');
?>

<div class="card-title" style="font-size:1.4rem;margin-bottom:1rem">📝 My Predictions</div>

<?php if ($locked): ?>
<div class="deadline-banner">
    🔒 <strong>Predictions are locked.</strong> The deadline has passed — your submitted predictions are shown below (read-only).
</div>
<?php else: ?>
<div class="deadline-banner">
    ⏰ Deadline: <strong><?= !empty($settings['prediction_deadline'])
        ? date('M j, Y H:i', strtotime($settings['prediction_deadline'])) . ' UTC'
        : 'Not set' ?></strong>
    — Save each tab separately.
</div>
<?php endif; ?>

<!-- Tabs -->
<div class="tab-container">
<div class="tabs">
    <button class="tab-btn <?= $active_tab==='group-stage'?'active':'' ?>" data-tab="tab-group-stage">⚽ Group Stage</button>
    <button class="tab-btn <?= $active_tab==='standings'?'active':'' ?>" data-tab="tab-standings">📊 Standings</button>
    <button class="tab-btn <?= $active_tab==='knockout'?'active':'' ?>" data-tab="tab-knockout">🏆 Knockout</button>
    <button class="tab-btn <?= $active_tab==='special'?'active':'' ?>" data-tab="tab-special">⭐ Special</button>
</div>

<!-- ══ TAB 1: Group stage matches ══════════════════════════════════ -->
<div class="tab-panel <?= $active_tab==='group-stage'?'active':'' ?>" id="tab-group-stage">
<form method="POST">
    <?= csrf_field() ?>
    <input type="hidden" name="active_tab" value="group-stage">

    <?php foreach (GROUPS as $g): ?>
    <div class="card">
        <div class="card-title">Group <?= $g ?></div>
        <?php foreach ($matches_by_group[$g] ?? [] as $m):
            $pred = $match_preds[$m['id']] ?? null;
        ?>
        <div class="match-row">
            <span class="match-meta">M<?= $m['match_number'] ?></span>
            <?php if ($m['is_bonus']): ?>
            <span class="badge badge-bonus">Bonus ×3</span>
            <?php endif; ?>
            <div class="match-teams">
                <span class="team-home"><?= $m['home_flag'] ?? '' ?> <?= htmlspecialchars($m['home_name']) ?></span>
                <span class="vs">vs</span>
                <span class="team-away"><?= htmlspecialchars($m['away_name']) ?> <?= $m['away_flag'] ?? '' ?></span>
            </div>
            <div class="score-pair">
                <input type="number" name="home[<?= $m['id'] ?>]"
                       class="score-input" min="0" max="99"
                       value="<?= $pred ? htmlspecialchars($pred['home_score']) : '' ?>"
                       <?= $locked ? 'readonly' : '' ?>>
                <span class="score-sep">–</span>
                <input type="number" name="away[<?= $m['id'] ?>]"
                       class="score-input" min="0" max="99"
                       value="<?= $pred ? htmlspecialchars($pred['away_score']) : '' ?>"
                       <?= $locked ? 'readonly' : '' ?>>
            </div>
        </div>
        <?php endforeach; ?>
    </div>
    <?php endforeach; ?>

    <?php if (!$locked): ?>
    <button type="submit" class="btn btn-gold">💾 Save Group Stage Predictions</button>
    <?php endif; ?>
</form>
</div>

<!-- ══ TAB 2: Group standings ══════════════════════════════════════ -->
<div class="tab-panel <?= $active_tab==='standings'?'active':'' ?>" id="tab-standings">
<div class="card-title" style="margin-bottom:.5rem">
    Predict the final position of each team in each group (1st–4th).
    <span class="text-muted text-small"> 1pt per correct position.</span>
</div>
<form method="POST">
    <?= csrf_field() ?>
    <input type="hidden" name="active_tab" value="standings">
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.25rem;">
    <?php foreach (GROUPS as $g):
        $gteams = get_teams_by_group($g);
        $gp = $group_preds[$g] ?? null;
    ?>
    <div class="card" style="margin-bottom:0">
        <div class="card-title">Group <?= $g ?></div>
        <?php for ($pos = 1; $pos <= 4; $pos++): ?>
        <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.5rem">
            <span style="font-weight:700;width:1.5rem"><?= $pos ?>.</span>
            <select name="standings[<?= $g ?>][<?= $pos ?>]"
                    class="form-control"
                    <?= $locked ? 'disabled' : '' ?>>
                <option value="">— Select team —</option>
                <?php foreach ($gteams as $t):
                    $sel_val = $gp ? (int)$gp['pos'.$pos.'_team_id'] : 0;
                ?>
                <option value="<?= $t['id'] ?>" <?= $sel_val===$t['id']?'selected':'' ?>>
                    <?= $t['flag'] ?? '' ?> <?= htmlspecialchars($t['name']) ?>
                </option>
                <?php endforeach; ?>
            </select>
        </div>
        <?php endfor; ?>
    </div>
    <?php endforeach; ?>
    </div>
    <?php if (!$locked): ?>
    <div style="margin-top:1.25rem">
    <button type="submit" class="btn btn-gold">💾 Save Standings Predictions</button>
    </div>
    <?php endif; ?>
</form>
</div>

<!-- ══ TAB 3: Knockout predictions ════════════════════════════════ -->
<div class="tab-panel <?= $active_tab==='knockout'?'active':'' ?>" id="tab-knockout">
<div class="card-title" style="margin-bottom:.5rem">
    Predict which teams advance through each knockout round.
    <span class="text-muted text-small"> Select any team — doesn't need to match your group predictions.</span>
</div>
<form method="POST">
    <?= csrf_field() ?>
    <input type="hidden" name="active_tab" value="knockout">

    <?php foreach ($ko_rounds as $round => $info):
        $round_preds = $ko_preds[$round] ?? [];
    ?>
    <div class="card">
        <div class="card-title"><?= htmlspecialchars($info['label']) ?></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:.5rem;">
        <?php for ($slot = 1; $slot <= $info['slots']; $slot++):
            $sel = $round_preds[$slot] ?? 0;
        ?>
            <select name="knockout[<?= $round ?>][<?= $slot ?>]"
                    class="form-control"
                    <?= $locked ? 'disabled' : '' ?>>
                <option value="">— Team <?= $slot ?> —</option>
                <?php foreach ($all_teams_sorted as $t): ?>
                <option value="<?= $t['id'] ?>" <?= $sel===$t['id']?'selected':'' ?>>
                    <?= $t['flag']??'' ?> <?= htmlspecialchars($t['name']) ?>
                </option>
                <?php endforeach; ?>
            </select>
        <?php endfor; ?>
        </div>
    </div>
    <?php endforeach; ?>

    <?php if (!$locked): ?>
    <button type="submit" class="btn btn-gold">💾 Save Knockout Predictions</button>
    <?php endif; ?>
</form>
</div>

<!-- ══ TAB 4: Special predictions ════════════════════════════════ -->
<div class="tab-panel <?= $active_tab==='special'?'active':'' ?>" id="tab-special">
<div class="card">
<form method="POST">
    <?= csrf_field() ?>
    <input type="hidden" name="active_tab" value="special">

    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.25rem;">
        <!-- Champion -->
        <div>
            <div class="card-title">🏆 Champion <span class="badge badge-bonus">+10 pts</span></div>
            <div class="form-group">
                <label class="form-label">Team</label>
                <select name="champion_team_id" class="form-control" <?= $locked?'disabled':'' ?>>
                    <option value="">— Select —</option>
                    <?php foreach ($all_teams_sorted as $t): ?>
                    <option value="<?= $t['id'] ?>" <?= (int)($special['champion_id']??0)===$t['id']?'selected':'' ?>>
                        <?= $t['flag']??'' ?> <?= htmlspecialchars($t['name']) ?>
                    </option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>

        <!-- Runner-up -->
        <div>
            <div class="card-title">🥈 Runner-up <span class="badge badge-bonus">+5 pts</span></div>
            <div class="form-group">
                <label class="form-label">Team</label>
                <select name="runner_up_team_id" class="form-control" <?= $locked?'disabled':'' ?>>
                    <option value="">— Select —</option>
                    <?php foreach ($all_teams_sorted as $t): ?>
                    <option value="<?= $t['id'] ?>" <?= (int)($special['runner_up_id']??0)===$t['id']?'selected':'' ?>>
                        <?= $t['flag']??'' ?> <?= htmlspecialchars($t['name']) ?>
                    </option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>

        <!-- 3rd place -->
        <div>
            <div class="card-title">🥉 3rd Place <span class="badge badge-bonus">+2 pts</span></div>
            <div class="form-group">
                <label class="form-label">Team</label>
                <select name="third_place_team_id" class="form-control" <?= $locked?'disabled':'' ?>>
                    <option value="">— Select —</option>
                    <?php foreach ($all_teams_sorted as $t): ?>
                    <option value="<?= $t['id'] ?>" <?= (int)($special['third_place_id']??0)===$t['id']?'selected':'' ?>>>
                        <?= $t['flag']??'' ?> <?= htmlspecialchars($t['name']) ?>
                    </option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>
    </div>

    <!-- Golden Boot -->
    <div class="card-title mt-2">👟 Golden Boot <span class="badge badge-pending">up to 3 predictions (+5 pts each)</span></div>
    <datalist id="players-list">
        <?php foreach (KNOWN_PLAYERS as $p): ?>
        <option value="<?= htmlspecialchars($p) ?>">
        <?php endforeach; ?>
    </datalist>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.75rem;margin-bottom:1.25rem;">
        <?php foreach ([1,2,3] as $n): ?>
        <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Prediction <?= $n ?></label>
            <input type="text" name="golden_boot_<?= $n ?>" list="players-list"
                   class="form-control"
                   value="<?= htmlspecialchars($special['golden_boot_'.$n] ?? '') ?>"
                   placeholder="Player name…"
                   <?= $locked?'readonly':'' ?>>
        </div>
        <?php endforeach; ?>
    </div>

    <!-- Golden Ball -->
    <div class="card-title">🏅 Golden Ball <span class="badge badge-pending">up to 3 predictions (+5 pts each)</span></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.75rem;margin-bottom:1.25rem;">
        <?php foreach ([1,2,3] as $n): ?>
        <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Prediction <?= $n ?></label>
            <input type="text" name="golden_ball_<?= $n ?>" list="players-list"
                   class="form-control"
                   value="<?= htmlspecialchars($special['golden_ball_'.$n] ?? '') ?>"
                   placeholder="Player name…"
                   <?= $locked?'readonly':'' ?>>
        </div>
        <?php endforeach; ?>
    </div>

    <?php if (!$locked): ?>
    <button type="submit" class="btn btn-gold">💾 Save Special Predictions</button>
    <?php endif; ?>
</form>
</div>
</div>

</div><!-- .tab-container -->

<script>
// Activate the right tab on load
document.addEventListener('DOMContentLoaded', function() {
    var param = new URLSearchParams(window.location.search).get('tab');
    var map = { 'group-stage':'tab-group-stage', 'standings':'tab-standings', 'knockout':'tab-knockout', 'special':'tab-special' };
    var target = map[param] || 'tab-group-stage';
    document.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.toggle('active', b.dataset.tab===target); });
    document.querySelectorAll('.tab-panel').forEach(function(p){ p.classList.toggle('active', p.id===target); });
});
</script>

<?php layout_foot(); ?>
