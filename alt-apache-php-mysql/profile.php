<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/_layout.php';

auth_start();
require_login();

$db   = get_db();
$user = current_user();
$uid  = (int)$user['id'];

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_verify();

    $current_pw = $_POST['current_password'] ?? '';
    $new_pw     = $_POST['new_password'] ?? '';
    $confirm_pw = $_POST['confirm_password'] ?? '';

    if ($current_pw === '') {
        $errors['current_password'] = 'Current password is required.';
    }
    if (strlen($new_pw) < 8) {
        $errors['new_password'] = 'New password must be at least 8 characters.';
    }
    if ($new_pw !== $confirm_pw) {
        $errors['confirm_password'] = 'Passwords do not match.';
    }

    if (empty($errors)) {
        // Re-fetch to get latest hash
        $stmt = $db->prepare("SELECT password_hash FROM users WHERE id = ? LIMIT 1");
        $stmt->execute([$uid]);
        $row = $stmt->fetch();

        if (!password_verify($current_pw, $row['password_hash'])) {
            $errors['current_password'] = 'Current password is incorrect.';
        }
    }

    if (empty($errors)) {
        $hash = password_hash($new_pw, PASSWORD_BCRYPT);
        $db->prepare(
            "UPDATE users SET password_hash = ?, must_change_password = 0 WHERE id = ?"
        )->execute([$hash, $uid]);

        // Update session flag
        $_SESSION['user']['must_change_password'] = 0;

        flash_set('success', 'Password changed successfully.');
        header('Location: profile.php');
        exit;
    }
}

// Load user scores summary
$scores = $db->prepare("SELECT * FROM user_scores WHERE user_id = ? LIMIT 1");
$scores->execute([$uid]);
$pts = $scores->fetch();

layout_head('My Profile');
?>

<div class="card-title" style="font-size:1.4rem;margin-bottom:1rem">👤 My Profile</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;align-items:start;">

<!-- Account info -->
<div class="card">
    <div class="card-title">Account</div>
    <table class="data-table" style="font-size:.95rem">
        <tr><td class="text-muted">Display name</td><td><strong><?= htmlspecialchars($user['alias']) ?></strong></td></tr>
        <tr><td class="text-muted">Email</td><td><?= htmlspecialchars($user['email']) ?></td></tr>
        <tr><td class="text-muted">Role</td><td><?= $user['is_admin'] ? '<span class="badge badge-admin">Admin</span>' : 'Player' ?></td></tr>
    </table>
</div>

<!-- Points summary -->
<div class="card">
    <div class="card-title">My Points</div>
    <?php if ($pts): ?>
    <div class="stat-cards" style="grid-template-columns:repeat(2,1fr)">
        <div class="stat-card">
            <div class="stat-val text-gold"><?= (int)$pts['points_total'] ?></div>
            <div class="stat-lbl">Total</div>
        </div>
        <div class="stat-card">
            <div class="stat-val"><?= (int)$pts['points_group_matches'] ?></div>
            <div class="stat-lbl">Group Matches</div>
        </div>
        <div class="stat-card">
            <div class="stat-val"><?= (int)$pts['points_group_standings'] ?></div>
            <div class="stat-lbl">Standings</div>
        </div>
        <div class="stat-card">
            <div class="stat-val"><?= (int)$pts['points_knockout'] ?></div>
            <div class="stat-lbl">Knockout</div>
        </div>
        <div class="stat-card">
            <div class="stat-val"><?= (int)$pts['points_special'] ?></div>
            <div class="stat-lbl">Special</div>
        </div>
        <div class="stat-card">
            <div class="stat-val"><?= (int)$pts['points_bonus'] ?></div>
            <div class="stat-lbl">Bonus Bonus</div>
        </div>
    </div>
    <?php else: ?>
    <p class="text-muted">No predictions scored yet.</p>
    <?php endif; ?>
</div>

</div><!-- grid -->

<!-- Change password -->
<div class="card" style="max-width:480px">
    <div class="card-title">🔑 Change Password</div>

    <?php if ($user['must_change_password']): ?>
    <div class="alert alert-warning">You are required to change your password.</div>
    <?php endif; ?>

    <form method="POST" action="profile.php" novalidate>
        <?= csrf_field() ?>

        <div class="form-group">
            <label class="form-label" for="current_password">Current Password</label>
            <input id="current_password" name="current_password" type="password"
                   class="form-control <?= isset($errors['current_password'])?'is-invalid':'' ?>"
                   autocomplete="current-password" required>
            <?php if (isset($errors['current_password'])): ?>
            <div class="form-error"><?= htmlspecialchars($errors['current_password']) ?></div>
            <?php endif; ?>
        </div>

        <div class="form-group">
            <label class="form-label" for="new_password">New Password</label>
            <input id="new_password" name="new_password" type="password"
                   class="form-control <?= isset($errors['new_password'])?'is-invalid':'' ?>"
                   autocomplete="new-password" required>
            <?php if (isset($errors['new_password'])): ?>
            <div class="form-error"><?= htmlspecialchars($errors['new_password']) ?></div>
            <?php endif; ?>
            <div class="form-hint">Minimum 8 characters.</div>
        </div>

        <div class="form-group">
            <label class="form-label" for="confirm_password">Confirm New Password</label>
            <input id="confirm_password" name="confirm_password" type="password"
                   class="form-control <?= isset($errors['confirm_password'])?'is-invalid':'' ?>"
                   autocomplete="new-password" required>
            <?php if (isset($errors['confirm_password'])): ?>
            <div class="form-error"><?= htmlspecialchars($errors['confirm_password']) ?></div>
            <?php endif; ?>
        </div>

        <button type="submit" class="btn btn-primary">Update Password</button>
    </form>
</div>

<?php layout_foot(); ?>
