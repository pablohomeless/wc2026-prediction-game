<?php
require_once __DIR__ . '/../auth.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../scoring.php';

auth_start();
require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php');
    exit;
}

csrf_verify();

$match_id = (int)($_POST['match_id'] ?? 0);
if ($match_id <= 0) {
    flash_set('error', 'Invalid match.');
    header('Location: index.php');
    exit;
}

$home_score     = $_POST['home_score'] !== '' ? (int)$_POST['home_score'] : null;
$away_score     = $_POST['away_score'] !== '' ? (int)$_POST['away_score'] : null;
$home_score_aet = ($_POST['home_score_aet'] ?? '') !== '' ? (int)$_POST['home_score_aet'] : null;
$away_score_aet = ($_POST['away_score_aet'] ?? '') !== '' ? (int)$_POST['away_score_aet'] : null;
$penalty_winner = ($_POST['penalty_winner_id'] ?? '') !== '' ? (int)$_POST['penalty_winner_id'] : null;

$db = get_db();

// Validate match exists
$stmt = $db->prepare("SELECT id FROM matches WHERE id = ? LIMIT 1");
$stmt->execute([$match_id]);
if (!$stmt->fetch()) {
    flash_set('error', 'Match not found.');
    header('Location: index.php');
    exit;
}

$db->prepare(
    "UPDATE matches SET
        home_score = ?,
        away_score = ?,
        home_score_aet = ?,
        away_score_aet = ?,
        penalty_winner_id = ?
     WHERE id = ?"
)->execute([$home_score, $away_score, $home_score_aet, $away_score_aet, $penalty_winner, $match_id]);

// Auto-recalculate
recalculate_all_scores();

flash_set('success', 'Match M' . $match_id . ' result saved and scores recalculated.');
header('Location: index.php?tab=matches');
exit;
