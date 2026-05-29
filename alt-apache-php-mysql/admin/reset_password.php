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

$stmt = $db->prepare("SELECT alias FROM users WHERE id = ? LIMIT 1");
$stmt->execute([$user_id]);
$target = $stmt->fetch();

if (!$target) {
    flash_set('error', 'User not found.');
    header('Location: index.php?tab=users');
    exit;
}

// Generate a secure temporary password (12 chars)
$tmp_pw = '';
$chars  = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#';
for ($i = 0; $i < 12; $i++) {
    $tmp_pw .= $chars[random_int(0, strlen($chars) - 1)];
}

$hash = password_hash($tmp_pw, PASSWORD_BCRYPT);
$db->prepare(
    "UPDATE users SET password_hash = ?, must_change_password = 1 WHERE id = ?"
)->execute([$hash, $user_id]);

$alias = htmlspecialchars($target['alias']);
flash_set('success', "Password reset for {$alias}. Temporary password: {$tmp_pw}  — Ask them to log in and change it immediately.");
header('Location: index.php?tab=users');
exit;
