<?php
require_once __DIR__ . '/../auth.php';
require_once __DIR__ . '/../db.php';

auth_start();
require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php');
    exit;
}

csrf_verify();

$db = get_db();

// Deadline: convert datetime-local to UTC string (MySQL DATETIME)
$deadline = $_POST['prediction_deadline'] ?? '';
if ($deadline !== '') {
    // datetime-local gives "YYYY-MM-DDTHH:MM" — convert to MySQL format
    $dt = DateTime::createFromFormat('Y-m-d\TH:i', $deadline);
    $deadline_sql = $dt ? $dt->format('Y-m-d H:i:s') : null;
} else {
    $deadline_sql = null;
}

$game_status = $_POST['game_status'] ?? 'upcoming';
$valid_statuses = ['upcoming', 'active', 'finished'];
if (!in_array($game_status, $valid_statuses, true)) {
    $game_status = 'upcoming';
}

$champion    = ($_POST['champion_team_id'] ?? '') !== '' ? (int)$_POST['champion_team_id'] : null;
$runner_up   = ($_POST['runner_up_team_id'] ?? '') !== '' ? (int)$_POST['runner_up_team_id'] : null;
$third_place = ($_POST['third_place_team_id'] ?? '') !== '' ? (int)$_POST['third_place_team_id'] : null;

$golden_boot_1 = trim($_POST['golden_boot_1'] ?? '') ?: null;
$golden_boot_2 = trim($_POST['golden_boot_2'] ?? '') ?: null;
$golden_boot_3 = trim($_POST['golden_boot_3'] ?? '') ?: null;
$golden_ball_1 = trim($_POST['golden_ball_1'] ?? '') ?: null;
$golden_ball_2 = trim($_POST['golden_ball_2'] ?? '') ?: null;
$golden_ball_3 = trim($_POST['golden_ball_3'] ?? '') ?: null;

$boot2_awarded = isset($_POST['boot_2_awarded']) ? 1 : 0;
$boot3_awarded = isset($_POST['boot_3_awarded']) ? 1 : 0;
$ball2_awarded = isset($_POST['ball_2_awarded']) ? 1 : 0;
$ball3_awarded = isset($_POST['ball_3_awarded']) ? 1 : 0;

$db->prepare(
    "UPDATE tournament_settings SET
        prediction_deadline = ?,
        game_status = ?,
        champion_id = ?,
        runner_up_id = ?,
        third_place_id = ?,
        golden_boot_1 = ?, golden_boot_2 = ?, golden_boot_3 = ?,
        golden_ball_1 = ?, golden_ball_2 = ?, golden_ball_3 = ?,
        boot_2_awarded = ?, boot_3_awarded = ?,
        ball_2_awarded = ?, ball_3_awarded = ?
     WHERE id = 1"
)->execute([
    $deadline_sql, $game_status,
    $champion, $runner_up, $third_place,
    $golden_boot_1, $golden_boot_2, $golden_boot_3,
    $golden_ball_1, $golden_ball_2, $golden_ball_3,
    $boot2_awarded, $boot3_awarded, $ball2_awarded, $ball3_awarded,
]);

flash_set('success', 'Settings saved successfully.');
header('Location: index.php?tab=settings');
exit;
