<?php
require_once __DIR__ . '/../auth.php';
require_once __DIR__ . '/../scoring.php';

auth_start();
require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php');
    exit;
}

csrf_verify();

recalculate_all_scores();

flash_set('success', 'All scores recalculated successfully.');
header('Location: index.php?tab=matches');
exit;
