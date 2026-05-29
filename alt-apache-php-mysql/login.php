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

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_verify();

    $email    = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($email === '') $errors['email'] = 'Email is required.';
    if ($password === '') $errors['password'] = 'Password is required.';

    if (empty($errors)) {
        $db = get_db();
        $stmt = $db->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            $errors['general'] = 'Invalid email or password.';
        } elseif (!$user['is_active']) {
            $errors['general'] = 'Your account has been disabled. Contact the admin.';
        } else {
            auth_login($user);
            if ($user['must_change_password']) {
                flash_set('warning', 'Please change your password.');
                header('Location: profile.php');
            } else {
                flash_set('success', 'Welcome back, ' . $user['alias'] . '!');
                header('Location: index.php');
            }
            exit;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Login — <?= APP_NAME ?></title>
    <link rel="stylesheet" href="assets/style.css">
</head>
<body>
<div class="auth-page">
    <div class="auth-card">
        <div class="auth-logo">
            <div class="trophy">🏆</div>
            <h1><?= APP_NAME ?></h1>
            <p>World Cup 2026 Prediction Game</p>
        </div>

        <?php if (isset($errors['general'])): ?>
        <div class="alert alert-error"><?= htmlspecialchars($errors['general']) ?></div>
        <?php endif; ?>

        <form method="POST" action="login.php" novalidate>
            <?= csrf_field() ?>
            <div class="form-group">
                <label class="form-label" for="email">Email</label>
                <input id="email" name="email" type="email" class="form-control <?= isset($errors['email'])?'is-invalid':'' ?>"
                       value="<?= htmlspecialchars($_POST['email'] ?? '') ?>" autocomplete="email" required>
                <?php if (isset($errors['email'])): ?>
                <div class="form-error"><?= htmlspecialchars($errors['email']) ?></div>
                <?php endif; ?>
            </div>
            <div class="form-group">
                <label class="form-label" for="password">Password</label>
                <input id="password" name="password" type="password" class="form-control <?= isset($errors['password'])?'is-invalid':'' ?>"
                       autocomplete="current-password" required>
                <?php if (isset($errors['password'])): ?>
                <div class="form-error"><?= htmlspecialchars($errors['password']) ?></div>
                <?php endif; ?>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center">Login</button>
        </form>
        <p style="text-align:center;font-size:.9rem;margin-top:1rem">
            No account? <a href="register.php">Register here</a>
        </p>
        <p style="text-align:center;margin-top:.5rem">
            <a href="index.php" style="font-size:.85rem;color:#94a3b8">← Back to scoreboard</a>
        </p>
    </div>
</div>
</body>
</html>
