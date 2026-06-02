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
$registered_password = null; // shown on success screen

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_verify();

    $email = trim(strtolower($_POST['email'] ?? ''));
    $alias = trim($_POST['alias'] ?? '');

    // Validate
    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'A valid email address is required.';
    }
    if ($alias === '') {
        $errors['alias'] = 'Display name is required.';
    } elseif (mb_strlen($alias) < 2 || mb_strlen($alias) > 30) {
        $errors['alias'] = 'Display name must be 2–30 characters.';
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
        // Auto-generate a secure temporary password
        $chars  = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
        $tmp_pw = '';
        for ($i = 0; $i < 8; $i++) {
            $tmp_pw .= $chars[random_int(0, strlen($chars) - 1)];
        }

        $hash = password_hash($tmp_pw, PASSWORD_BCRYPT);
        $db->prepare(
            "INSERT INTO users (email, alias, password_hash, is_admin, is_active, must_change_password)
             VALUES (?, ?, ?, 0, 1, 1)"
        )->execute([$email, $alias, $hash]);

        $user_id = (int)$db->lastInsertId();

        // Create empty score row
        $db->prepare(
            "INSERT INTO user_scores (user_id) VALUES (?)"
        )->execute([$user_id]);

        // Show success screen with the generated password (do NOT auto-login here)
        $registered_alias    = htmlspecialchars($alias);
        $registered_password = $tmp_pw; // displayed on screen below
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

<?php if ($registered_password !== null): ?>
        <!-- SUCCESS: show the generated password -->
        <div style="text-align:center;padding:1rem 0">
            <div style="font-size:2.5rem">✅</div>
            <h2 style="color:#1e3a5f;margin:.5rem 0">Account Created!</h2>
            <p style="color:#555;margin-bottom:1.5rem">
                Welcome, <strong><?= $registered_alias ?></strong>! Use the password below to log in.
            </p>

            <div style="background:#fefce8;border:2px solid #facc15;border-radius:.75rem;padding:1rem;margin-bottom:1.25rem">
                <p style="font-size:.8rem;font-weight:600;color:#92400e;margin:0 0 .5rem">
                    ⚠️ Note this password — it will not be shown again!
                </p>
                <div style="display:flex;align-items:center;justify-content:center;gap:.5rem;flex-wrap:wrap">
                    <code id="tmp-pw" style="font-size:1.5rem;font-family:monospace;font-weight:700;letter-spacing:.15em;color:#1e3a5f;background:#fff;border:1px solid #fde047;border-radius:.5rem;padding:.35rem .75rem">
                        <?= htmlspecialchars($registered_password) ?>
                    </code>
                    <button onclick="copyPw()" style="font-size:.8rem;padding:.3rem .7rem;border:1px solid #cbd5e1;border-radius:.375rem;background:#fff;cursor:pointer" id="copy-btn">
                        Copy
                    </button>
                </div>
            </div>

            <ol style="text-align:left;font-size:.9rem;color:#555;line-height:1.8;margin-bottom:1.5rem;padding-left:1.25rem">
                <li>Write down or copy your password above</li>
                <li>Go to login and use your email + this password</li>
                <li>You will be asked to set a new password after logging in</li>
            </ol>

            <a href="login.php" class="btn btn-gold" style="width:100%;justify-content:center;display:flex">Go to Login →</a>
        </div>

        <script>
        function copyPw() {
            var pw = document.getElementById('tmp-pw').innerText.trim();
            navigator.clipboard.writeText(pw).then(function() {
                document.getElementById('copy-btn').innerText = '✓ Copied';
                setTimeout(function(){ document.getElementById('copy-btn').innerText = 'Copy'; }, 2000);
            });
        }
        </script>

<?php else: ?>
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
                <div class="form-hint">Used to identify your account — no emails will be sent</div>
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

            <div class="form-hint" style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:.5rem;padding:.6rem .8rem;margin-bottom:1rem;font-size:.85rem;color:#0369a1">
                🔑 A temporary password will be generated and shown on screen after registering.
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
<?php endif; ?>

    </div>
</div>
</body>
</html>
