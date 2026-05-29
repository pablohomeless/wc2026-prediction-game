<?php
require_once __DIR__ . '/../auth.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../data.php';
require_once __DIR__ . '/../_layout.php';

auth_start();
require_admin();

$db = get_db();

// ─── Load data for all tabs ────────────────────────────────────────
$round_filter = $_GET['round'] ?? 'ALL';
$valid_rounds = ['ALL','GROUP','R32','R16','QF','SF','THIRD','FINAL'];
if (!in_array($round_filter, $valid_rounds, true)) $round_filter = 'ALL';

$where = $round_filter !== 'ALL' ? "WHERE m.round = " . $db->quote($round_filter) : '';

$matches = $db->query(
    "SELECT m.*,
            th.name as home_name, th.flag as home_flag,
            ta.name as away_name, ta.flag as away_flag
     FROM matches m
     LEFT JOIN teams th ON th.id = m.home_team_id
     LEFT JOIN teams ta ON ta.id = m.away_team_id
     {$where}
     ORDER BY m.match_number"
)->fetchAll();

// Users tab
$search = trim($_GET['search'] ?? '');
$user_sql = "SELECT u.*, COALESCE(us.points_total,0) as points_total
             FROM users u
             LEFT JOIN user_scores us ON us.user_id = u.id";
if ($search !== '') {
    $user_sql .= " WHERE u.alias LIKE " . $db->quote('%'.$search.'%') . " OR u.email LIKE " . $db->quote('%'.$search.'%');
}
$user_sql .= " ORDER BY u.alias";
$users = $db->query($user_sql)->fetchAll();

// Settings tab
$settings = $db->query("SELECT * FROM tournament_settings WHERE id = 1")->fetch();

// All teams for champion/runner-up dropdowns
$all_teams = TEAMS;
usort($all_teams, fn($a,$b) => strcmp($a['name'], $b['name']));

$active_tab = $_GET['tab'] ?? 'matches';

layout_head('Admin Dashboard');
?>

<div class="card-title" style="font-size:1.4rem;margin-bottom:1rem">⚙️ Admin Dashboard</div>

<div class="tab-container">
<div class="tabs">
    <button class="tab-btn <?= $active_tab==='matches'?'active':'' ?>" data-tab="tab-matches">⚽ Matches</button>
    <button class="tab-btn <?= $active_tab==='users'?'active':'' ?>" data-tab="tab-users">👥 Users</button>
    <button class="tab-btn <?= $active_tab==='settings'?'active':'' ?>" data-tab="tab-settings">⚙️ Settings</button>
</div>

<!-- ══ TAB 1: Match results ════════════════════════════════════════ -->
<div class="tab-panel <?= $active_tab==='matches'?'active':'' ?>" id="tab-matches">

<!-- Round filter -->
<div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1rem">
    <?php foreach (['ALL'=>'All','GROUP'=>'Group','R32'=>'R32','R16'=>'R16','QF'=>'QF','SF'=>'SF','THIRD'=>'3rd','FINAL'=>'Final'] as $r => $lbl): ?>
    <a href="?tab=matches&round=<?= $r ?>" class="btn btn-sm <?= $round_filter===$r?'btn-primary':'btn-secondary' ?>"><?= $lbl ?></a>
    <?php endforeach; ?>
</div>

<?php foreach ($matches as $m):
    $has_result = $m['home_score'] !== null;
?>
<div class="card" style="padding:1rem;margin-bottom:.75rem">
    <form method="POST" action="save_result.php" style="display:flex;align-items:center;gap:.75rem;flex-wrap:wrap">
        <?= csrf_field() ?>
        <input type="hidden" name="match_id" value="<?= $m['id'] ?>">

        <span class="match-meta" style="min-width:2.5rem">M<?= $m['match_number'] ?></span>
        <?php if ($m['is_bonus']): ?><span class="badge badge-bonus">Bonus</span><?php endif; ?>
        <span style="font-weight:600;flex:1;min-width:200px">
            <?= $m['home_flag']??'' ?> <?= htmlspecialchars($m['home_name'] ?? $m['home_slot'] ?? '?') ?>
            <span class="text-muted"> vs </span>
            <?= htmlspecialchars($m['away_name'] ?? $m['away_slot'] ?? '?') ?> <?= $m['away_flag']??'' ?>
        </span>

        <!-- Regular time -->
        <div style="display:flex;align-items:center;gap:.35rem">
            <label class="form-label" style="margin:0;font-size:.8rem">FT</label>
            <input type="number" name="home_score" class="score-input" min="0" max="99"
                   value="<?= $m['home_score'] !== null ? $m['home_score'] : '' ?>"
                   placeholder="H">
            <span class="score-sep">–</span>
            <input type="number" name="away_score" class="score-input" min="0" max="99"
                   value="<?= $m['away_score'] !== null ? $m['away_score'] : '' ?>"
                   placeholder="A">
        </div>

        <!-- AET / penalties (only shown for knockout) -->
        <?php if ($m['round'] !== 'GROUP'): ?>
        <div style="display:flex;align-items:center;gap:.35rem">
            <label class="form-label" style="margin:0;font-size:.8rem">AET</label>
            <input type="number" name="home_score_aet" class="score-input" min="0" max="99"
                   value="<?= $m['home_score_aet'] !== null ? $m['home_score_aet'] : '' ?>"
                   placeholder="H">
            <span class="score-sep">–</span>
            <input type="number" name="away_score_aet" class="score-input" min="0" max="99"
                   value="<?= $m['away_score_aet'] !== null ? $m['away_score_aet'] : '' ?>"
                   placeholder="A">
        </div>
        <div style="display:flex;align-items:center;gap:.35rem">
            <label class="form-label" style="margin:0;font-size:.8rem">Pens W</label>
            <select name="penalty_winner_id" class="form-control" style="width:auto;padding:.3rem .5rem">
                <option value="">—</option>
                <?php if ($m['home_team_id']): ?>
                <option value="<?= $m['home_team_id'] ?>" <?= $m['penalty_winner_id']==$m['home_team_id']?'selected':'' ?>>
                    <?= htmlspecialchars($m['home_name'] ?? '') ?>
                </option>
                <option value="<?= $m['away_team_id'] ?>" <?= $m['penalty_winner_id']==$m['away_team_id']?'selected':'' ?>>
                    <?= htmlspecialchars($m['away_name'] ?? '') ?>
                </option>
                <?php endif; ?>
            </select>
        </div>
        <?php else: ?>
        <input type="hidden" name="home_score_aet" value="">
        <input type="hidden" name="away_score_aet" value="">
        <input type="hidden" name="penalty_winner_id" value="">
        <?php endif; ?>

        <button type="submit" class="btn btn-primary btn-sm">Save</button>
        <?php if ($has_result): ?><span class="badge badge-done">Saved</span><?php endif; ?>
    </form>
</div>
<?php endforeach; ?>

<div style="margin-top:1rem">
    <form method="POST" action="recalculate.php">
        <?= csrf_field() ?>
        <button type="submit" class="btn btn-gold" onclick="return confirm('Recalculate ALL user scores?')">
            🔄 Recalculate All Scores
        </button>
    </form>
</div>
</div>

<!-- ══ TAB 2: Users ════════════════════════════════════════════════ -->
<div class="tab-panel <?= $active_tab==='users'?'active':'' ?>" id="tab-users">
<form method="GET" style="display:flex;gap:.5rem;margin-bottom:1rem">
    <input type="hidden" name="tab" value="users">
    <input type="text" name="search" class="form-control" style="max-width:300px"
           value="<?= htmlspecialchars($search) ?>" placeholder="Search alias or email…">
    <button type="submit" class="btn btn-secondary btn-sm">Search</button>
    <?php if ($search): ?><a href="?tab=users" class="btn btn-secondary btn-sm">Clear</a><?php endif; ?>
</form>

<div class="table-wrap">
<table class="data-table">
    <thead>
        <tr><th>Alias</th><th>Email</th><th>Pts</th><th>Admin</th><th>Active</th><th>Actions</th></tr>
    </thead>
    <tbody>
    <?php foreach ($users as $u): ?>
    <tr>
        <td><strong><?= htmlspecialchars($u['alias']) ?></strong></td>
        <td><?= htmlspecialchars($u['email']) ?></td>
        <td><?= (int)$u['points_total'] ?></td>
        <td><?= $u['is_admin'] ? '<span class="badge badge-admin">Admin</span>' : '—' ?></td>
        <td><?= $u['is_active'] ? '<span class="badge badge-done">Active</span>' : '<span class="badge badge-pending">Disabled</span>' ?></td>
        <td style="white-space:nowrap;display:flex;gap:.4rem">
            <!-- Toggle active -->
            <form method="POST" action="toggle_user.php" style="display:inline">
                <?= csrf_field() ?>
                <input type="hidden" name="user_id" value="<?= $u['id'] ?>">
                <button type="submit" class="btn btn-sm btn-secondary"
                        onclick="return confirm('Toggle active status?')">
                    <?= $u['is_active'] ? 'Disable' : 'Enable' ?>
                </button>
            </form>
            <!-- Reset password -->
            <form method="POST" action="reset_password.php" style="display:inline">
                <?= csrf_field() ?>
                <input type="hidden" name="user_id" value="<?= $u['id'] ?>">
                <button type="submit" class="btn btn-sm btn-danger"
                        onclick="return confirm('Reset password for <?= htmlspecialchars(addslashes($u['alias'])) ?>?')">
                    Reset PW
                </button>
            </form>
        </td>
    </tr>
    <?php endforeach; ?>
    </tbody>
</table>
</div>
</div>

<!-- ══ TAB 3: Settings ════════════════════════════════════════════ -->
<div class="tab-panel <?= $active_tab==='settings'?'active':'' ?>" id="tab-settings">
<form method="POST" action="save_settings.php">
    <?= csrf_field() ?>
    <div class="card">
        <div class="card-title">Tournament Settings</div>

        <div class="form-group">
            <label class="form-label">Prediction Deadline (UTC)</label>
            <input type="datetime-local" name="prediction_deadline" class="form-control" style="max-width:280px"
                   value="<?= !empty($settings['prediction_deadline']) ? date('Y-m-d\TH:i', strtotime($settings['prediction_deadline'])) : '' ?>">
            <div class="form-hint">Predictions are locked after this date/time.</div>
        </div>

        <div class="form-group">
            <label class="form-label">Game Status</label>
            <select name="game_status" class="form-control" style="max-width:200px">
                <?php foreach (['not_started'=>'Not Started','group_stage'=>'Group Stage','knockout'=>'Knockout','finished'=>'Finished'] as $v => $l): ?>
                <option value="<?= $v ?>" <?= ($settings['game_status']??'')===$v?'selected':'' ?>><?= $l ?></option>
                <?php endforeach; ?>
            </select>
        </div>

        <hr style="border:none;border-top:1px solid #e2e8f0;margin:1.25rem 0">
        <div class="card-title" style="font-size:1rem">🏆 Award Outcomes</div>

        <!-- Champion / Runner-up / 3rd -->
        <?php foreach (['champion_team_id'=>'Champion','runner_up_team_id'=>'Runner-up','third_place_team_id'=>'3rd Place'] as $field => $lbl): ?>
        <div class="form-group">
            <label class="form-label"><?= $lbl ?></label>
            <select name="<?= $field ?>" class="form-control" style="max-width:280px">
                <option value="">— Not set —</option>
                <?php foreach ($all_teams as $t): ?>
                <option value="<?= $t['id'] ?>" <?= (int)($settings[$field]??0)===$t['id']?'selected':'' ?>>
                    <?= $t['flag']??'' ?> <?= htmlspecialchars($t['name']) ?>
                </option>
                <?php endforeach; ?>
            </select>
        </div>
        <?php endforeach; ?>

        <!-- Golden Boot / Ball -->
        <?php foreach (['golden_boot'=>'👟 Golden Boot','golden_ball'=>'🏅 Golden Ball'] as $base => $lbl): ?>
        <div class="form-group">
            <label class="form-label"><?= $lbl ?> (slot 1 = winner)</label>
            <div style="display:flex;flex-direction:column;gap:.4rem;max-width:320px">
                <?php foreach ([1,2,3] as $n): ?>
                <input type="text" name="<?= $base ?>_<?= $n ?>"
                       class="form-control"
                       value="<?= htmlspecialchars($settings[$base.'_'.$n] ?? '') ?>"
                       placeholder="Slot <?= $n ?> player…">
                <?php endforeach; ?>
            </div>
        </div>
        <?php endforeach; ?>

        <!-- Boot/Ball awarded flags -->
        <div class="card-title" style="font-size:.95rem;margin-top:.75rem">Award extra slots?</div>
        <?php foreach (['golden_boot_2_awarded'=>'Boot slot 2','golden_boot_3_awarded'=>'Boot slot 3','golden_ball_2_awarded'=>'Ball slot 2','golden_ball_3_awarded'=>'Ball slot 3'] as $field => $lbl): ?>
        <label style="display:flex;align-items:center;gap:.5rem;margin-bottom:.4rem;cursor:pointer">
            <input type="checkbox" name="<?= $field ?>" value="1" <?= !empty($settings[$field])?'checked':'' ?>>
            <?= $lbl ?>
        </label>
        <?php endforeach; ?>

        <div style="margin-top:1.25rem;display:flex;gap:.75rem;flex-wrap:wrap">
            <button type="submit" class="btn btn-gold">💾 Save Settings</button>
        </div>
    </div>
</form>

<div style="margin-top:1rem">
    <form method="POST" action="recalculate.php">
        <?= csrf_field() ?>
        <button type="submit" class="btn btn-secondary" onclick="return confirm('Recalculate ALL scores now?')">
            🔄 Recalculate All Scores
        </button>
        <span class="text-small text-muted"> — Run this after saving results or settings.</span>
    </form>
</div>
</div>

</div><!-- .tab-container -->

<?php layout_foot(); ?>
