<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/_layout.php';

auth_start();

// Already logged in → go home
if (is_logged_in()) {
    header('Location: index.php');
    exit;
}

// Check if registration is still open (deadline not passed)
$db = get_db();
$settings = $db->query("SELECT prediction_deadline FROM tournament_settings WHERE id = 1")->fetch();
if (!empty($settings['prediction_deadline'])) {
    if (new DateTime() > new DateTime($settings['prediction_deadline'])) {
        flash_set('warning', 'Registration is closed — the prediction deadline has passed.');
        header('Location: index.php');
        exit;
    }
}

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_verify();

    $email    = trim(strtolower($_POST['email'] ?? ''));
    $alias    = trim($_POST['alias'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm  = $_POST['confirm_password'] ?? '';

    // Validate
    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'A valid email address is required.';
    }
    if ($alias === '') {
        $errors['alias'] = 'Display name is required.';
    } elseif (mb_strlen($alias) < 2 || mb_strlen($alias) > 30) {
        $errors['alias'] = 'Display name must be 2–30 characters.';
    }
    if (strlen($password) < 8) {
        $errors['password'] = 'Password must be at least 8 characters.';
    }
    if ($password !== $confirm) {
        $errors['confirm_password'] = 'Passwords do not match.';
    }

    if (empty($errors)) {
        // Check uniqueness
        $stmt = $db->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            $errors['email'] = 'That email is already registered.';
        }

        $stmt = $db->prepare("SELECT id FROM users WHERE alias = ? LIMIT 1");
        $stmt->execute([$alias]);
        if ($stmt->fetch()) {
            $errors['alias'] = 'That display name is already taken.';
        }
    }

    if (empty($errors)) {
        $hash = password_hash($password, PASSWORD_BCRYPT);
        $db->prepare(
            "INSERT INTO users (email, alias, password_hash, is_admin, is_active, must_change_password)
             VALUES (?, ?, ?, 0, 1, 0)"
        )->execute([$email, $alias, $hash]);

        $user_id = (int)$db->lastInsertId();

        // Create empty score row
        $db->prepare(
            "INSERT INTO user_scores (user_id) VALUES (?)"
        )->execute([$user_id]);

        // Log them in
        $user = $db->prepare("SELECT * FROM users WHERE id = ? LIMIT 1");
        $user->execute([$user_id]);
        auth_login($user->fetch());

        flash_set('success', 'Welcome, ' . htmlspecialchars($alias) . '! Enter your predictions before the deadline.');
        header('Location: predictions.php');
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Register — <?= APP_NAME ?></title>
    <link rel="stylesheet" href="assets/style.css">
</head>
<body>
<div class="auth-page">
    <div class="auth-card">
        <div class="auth-logo">
            <div class="trophy">🏆</div>
            <h1><?= APP_NAME ?></h1>
            <p>Create your account to play</p>
        </div>

        <form method="POST" action="register.php" novalidate>
            <?= csrf_field() ?>

            <div class="form-group">
                <label class="form-label" for="email">Email</label>
                <input id="email" name="email" type="email"
                       class="form-control <?= isset($errors['email'])?'is-invalid':'' ?>"
                       value="<?= htmlspecialchars($_POST['email'] ?? '') ?>"
                       autocomplete="email" required>
                <?php if (isset($errors['email'])): ?>
                <div class="form-error"><?= htmlspecialchars($errors['email']) ?></div>
                <?php endif; ?>
            </div>

            <div class="form-group">
                <label class="form-label" for="alias">Display Name <span class="form-hint">(shown on scoreboard)</span></label>
                <input id="alias" name="alias" type="text"
                       class="form-control <?= isset($errors['alias'])?'is-invalid':'' ?>"
                       value="<?= htmlspecialchars($_POST['alias'] ?? '') ?>"
                       autocomplete="nickname" maxlength="30" required>
                <?php if (isset($errors['alias'])): ?>
                <div class="form-error"><?= htmlspecialchars($errors['alias']) ?></div>
                <?php endif; ?>
            </div>

            <div class="form-group">
                <label class="form-label" for="password">Password</label>
                <input id="password" name="password" type="password"
                       class="form-control <?= isset($errors['password'])?'is-invalid':'' ?>"
                       autocomplete="new-password" required>
                <?php if (isset($errors['password'])): ?>
                <div class="form-error"><?= htmlspecialchars($errors['password']) ?></div>
                <?php endif; ?>
                <div class="form-hint">Minimum 8 characters.</div>
            </div>

            <div class="form-group">
                <label class="form-label" for="confirm_password">Confirm Password</label>
                <input id="confirm_password" name="confirm_password" type="password"
                       class="form-control <?= isset($errors['confirm_password'])?'is-invalid':'' ?>"
                       autocomplete="new-password" required>
                <?php if (isset($errors['confirm_password'])): ?>
                <div class="form-error"><?= htmlspecialchars($errors['confirm_password']) ?></div>
                <?php endif; ?>
            </div>

            <button type="submit" class="btn btn-gold" style="width:100%;justify-content:center">
                Create Account
            </button>
        </form>

        <p style="text-align:center;font-size:.9rem;margin-top:1rem">
            Already registered? <a href="login.php">Login here</a>
        </p>
        <p style="text-align:center;margin-top:.5rem">
            <a href="index.php" style="font-size:.85rem;color:#94a3b8">← Back to scoreboard</a>
        </p>
    </div>
</div>
</body>
</html>
