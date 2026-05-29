<?php
require_once __DIR__ . '/auth.php';

auth_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_verify();
    auth_logout();
    flash_set('info', 'You have been logged out.');
} else {
    // GET redirect silently
    auth_logout();
}

header('Location: login.php');
exit;
