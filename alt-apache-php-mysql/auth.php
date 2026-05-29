<?php
require_once __DIR__ . '/config.php';

// ─────────────────────────────────────────────────────────────────
// Session bootstrap
// ─────────────────────────────────────────────────────────────────

function auth_start(): void {
    if (session_status() === PHP_SESSION_NONE) {
        session_name(SESSION_NAME);
        session_set_cookie_params([
            'lifetime' => 0,
            'path'     => '/',
            'secure'   => isset($_SERVER['HTTPS']),
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
        session_start();
    }
}

// ─────────────────────────────────────────────────────────────────
// CSRF helpers
// ─────────────────────────────────────────────────────────────────

function csrf_token(): string {
    auth_start();
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function csrf_verify(): void {
    $token = $_POST['csrf_token'] ?? '';
    if (!hash_equals(csrf_token(), $token)) {
        http_response_code(403);
        exit('Invalid CSRF token.');
    }
}

function csrf_field(): string {
    return '<input type="hidden" name="csrf_token" value="' . htmlspecialchars(csrf_token()) . '">';
}

// ─────────────────────────────────────────────────────────────────
// Current user helpers
// ─────────────────────────────────────────────────────────────────

function current_user(): ?array {
    auth_start();
    return $_SESSION['user'] ?? null;
}

function is_logged_in(): bool {
    return current_user() !== null;
}

function is_admin(): bool {
    $u = current_user();
    return $u !== null && !empty($u['is_admin']);
}

function require_login(string $redirect = '/login.php'): void {
    if (!is_logged_in()) {
        $base = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');
        $dest = $base . $redirect;
        header('Location: ' . $dest);
        exit;
    }
}

function require_admin(): void {
    require_login();
    if (!is_admin()) {
        http_response_code(403);
        include __DIR__ . '/_layout.php';
        layout_head('403 Forbidden');
        echo '<div class="card"><h2 class="text-wc-red">403 — Forbidden</h2><p>Admin access required.</p></div>';
        layout_foot();
        exit;
    }
}

// ─────────────────────────────────────────────────────────────────
// Login / logout
// ─────────────────────────────────────────────────────────────────

function auth_login(array $user): void {
    auth_start();
    session_regenerate_id(true); // prevent session fixation
    $_SESSION['user'] = [
        'id'                  => (int)$user['id'],
        'alias'               => $user['alias'],
        'email'               => $user['email'],
        'is_admin'            => (bool)$user['is_admin'],
        'is_active'           => (bool)$user['is_active'],
        'must_change_password'=> (bool)$user['must_change_password'],
    ];
    unset($_SESSION['csrf_token']); // regenerate CSRF after login
}

function auth_logout(): void {
    auth_start();
    $_SESSION = [];
    session_destroy();
}

// ─────────────────────────────────────────────────────────────────
// Flash messages (one-shot session notices)
// ─────────────────────────────────────────────────────────────────

function flash_set(string $type, string $message): void {
    auth_start();
    $_SESSION['flash'] = ['type' => $type, 'message' => $message];
}

function flash_get(): ?array {
    auth_start();
    $f = $_SESSION['flash'] ?? null;
    unset($_SESSION['flash']);
    return $f;
}
