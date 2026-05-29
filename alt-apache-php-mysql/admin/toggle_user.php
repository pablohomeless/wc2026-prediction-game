<?php
require_once __DIR__ . '/../auth.php';
require_once __DIR__ . '/../db.php';

auth_start();
require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php?tab=users');
    exit;
}

csrf_verify();

$user_id = (int)($_POST['user_id'] ?? 0);
if ($user_id <= 0) {
    flash_set('error', 'Invalid user ID.');
    header('Location: index.php?tab=users');
    exit;
}

$db = get_db();

// Prevent admin from disabling themselves
$current = current_user();
if ($user_id === (int)$current['id']) {
    flash_set('error', 'You cannot disable your own account.');
    header('Location: index.php?tab=users');
    exit;
}

$stmt = $db->prepare("SELECT alias, is_active FROM users WHERE id = ? LIMIT 1");
$stmt->execute([$user_id]);
$target = $stmt->fetch();

if (!$target) {
    flash_set('error', 'User not found.');
    header('Location: index.php?tab=users');
    exit;
}

$new_status = $target['is_active'] ? 0 : 1;
$db->prepare("UPDATE users SET is_active = ? WHERE id = ?")->execute([$new_status, $user_id]);

$action = $new_status ? 'enabled' : 'disabled';
flash_set('success', 'User ' . htmlspecialchars($target['alias']) . ' has been ' . $action . '.');
header('Location: index.php?tab=users');
exit;
