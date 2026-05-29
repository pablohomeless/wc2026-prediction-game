<?php
/**
 * Layout helpers — call layout_head() / layout_foot() on every page.
 * Requires auth.php to already be included.
 */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

function layout_head(string $title = ''): void {
    $user   = current_user();
    $flash  = flash_get();
    $page   = basename($_SERVER['PHP_SELF']);
    $root   = rtrim(str_replace(basename($_SERVER['PHP_SELF']), '', $_SERVER['PHP_SELF']), '/');
    // Make asset path relative to the root dir of the app
    $assetPath = $root . '/assets/style.css';
    $full_title = $title ? htmlspecialchars($title) . ' — ' . APP_NAME : APP_NAME;
    ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title><?= $full_title ?></title>
    <link rel="stylesheet" href="<?= $assetPath ?>">
</head>
<body>
<div class="page-wrapper">

<?php if (is_admin()): ?>
<div class="admin-bar">⚙️ Admin Mode — <a href="<?= $root ?>/admin/index.php">Dashboard</a></div>
<?php endif; ?>

<nav class="navbar">
    <a class="navbar-brand" href="<?= $root ?>/index.php">⚽ <?= APP_NAME ?></a>
    <div class="navbar-links">
        <a href="<?= $root ?>/index.php"      class="<?= $page==='index.php'?'active':'' ?>">🏆 Scoreboard</a>
        <?php if ($user): ?>
        <a href="<?= $root ?>/predictions.php" class="<?= $page==='predictions.php'?'active':'' ?>">📝 Predictions</a>
        <a href="<?= $root ?>/results.php"     class="<?= $page==='results.php'?'active':'' ?>">⚽ Results</a>
        <?php endif; ?>
        <a href="<?= $root ?>/rules.php"        class="<?= $page==='rules.php'?'active':'' ?>">📋 Rules</a>
        <a href="<?= $root ?>/how-to-play.php" class="<?= $page==='how-to-play.php'?'active':'' ?>">🎯 How to Play</a>
    </div>
    <div class="navbar-user">
        <?php if ($user): ?>
            👤 <strong><?= htmlspecialchars($user['alias']) ?></strong>
            <a href="<?= $root ?>/profile.php">Settings</a>
            <a href="<?= $root ?>/logout.php">Logout</a>
        <?php else: ?>
            <a href="<?= $root ?>/login.php">Login</a>
            <a href="<?= $root ?>/register.php">Register</a>
        <?php endif; ?>
    </div>
</nav>

<main class="main-content">
<?php
    // Flash message
    if ($flash):
        $cls = match($flash['type']) {
            'success' => 'alert-success',
            'error'   => 'alert-error',
            'warning' => 'alert-warning',
            default   => 'alert-info',
        };
?>
<div class="alert <?= $cls ?>">
    <?= htmlspecialchars($flash['message']) ?>
</div>
<?php endif; ?>
<?php
}

function layout_foot(): void {
    $year = date('Y');
    echo <<<HTML
</main>
<footer>
    <p>⚽ Porra Mundial 2026 &mdash; FIFA World Cup USA &bull; Canada &bull; Mexico &mdash; &copy; {$year}</p>
</footer>
</div><!-- .page-wrapper -->
<script>
// Simple tab switcher
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.tabs').forEach(function (tabs) {
        tabs.querySelectorAll('.tab-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var target = btn.dataset.tab;
                var container = tabs.closest('.tab-container') || document;
                tabs.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
                btn.classList.add('active');
                container.querySelectorAll('.tab-panel').forEach(function(p){
                    p.classList.toggle('active', p.id === target);
                });
            });
        });
    });
});
</script>
</body>
</html>
HTML;
}
