<?php
/**
 * Database configuration
 * Override each value with an environment variable, or edit directly for local dev.
 */

define('DB_HOST',   getenv('DB_HOST')   ?: 'localhost');
define('DB_PORT',   getenv('DB_PORT')   ?: '3306');
define('DB_NAME',   getenv('DB_NAME')   ?: 'wc2026_porra');
define('DB_USER',   getenv('DB_USER')   ?: 'root');
define('DB_PASS',   getenv('DB_PASS')   ?: '');

// Application name shown in page titles
define('APP_NAME',  'Porra Mundial 2026');

// Secret key for CSRF token generation — CHANGE THIS in production
define('APP_SECRET', getenv('APP_SECRET') ?: 'change-this-32-char-secret-key!!');

// Session cookie name
define('SESSION_NAME', 'wc2026_sess');
