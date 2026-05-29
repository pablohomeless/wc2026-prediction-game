# Porra Mundial 2026 — PHP/Apache/MySQL Version

Alternative backup implementation of the WC 2026 Prediction Game, runnable on a classic **PHP + Apache + MySQL** stack (no Node.js, no Prisma, no Next.js required).

---

## Prerequisites

| Dependency | Minimum version |
|------------|-----------------|
| PHP        | 7.4+ (8.x recommended) |
| MySQL / MariaDB | 5.7+ / 10.4+ |
| Apache     | 2.4+ with `mod_rewrite` |

---

## 1. Create the database

```bash
mysql -u root -p -e "CREATE DATABASE wc2026_porra CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p wc2026_porra < schema.sql
```

This seeds:
- All 48 teams (12 groups × 4 teams)
- All 104 matches (72 group stage + 32 knockout placeholders)
- Default `tournament_settings` row

---

## 2. Create a MySQL user (recommended)

```sql
CREATE USER 'wc2026'@'localhost' IDENTIFIED BY 'yourpassword';
GRANT ALL PRIVILEGES ON wc2026_porra.* TO 'wc2026'@'localhost';
FLUSH PRIVILEGES;
```

---

## 3. Configure the app

Edit **`config.php`** (or set environment variables before running Apache):

```php
// config.php defaults — override via env vars:
// DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS
// APP_SECRET (change this! used for CSRF seed)
```

Or export env vars in your Apache vhost / `.env`:

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=wc2026_porra
DB_USER=wc2026
DB_PASS=yourpassword
APP_SECRET=change-me-to-a-long-random-string
```

---

## 4. Apache virtual host

```apache
<VirtualHost *:80>
    ServerName porra.local
    DocumentRoot /var/www/wc2026/alt-apache-php-mysql

    <Directory /var/www/wc2026/alt-apache-php-mysql>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Point your Apache `DocumentRoot` at this folder. An `.htaccess` is not required — all pages are plain `.php` files.

---

## 5. Create the first admin user

After running `schema.sql`, insert an admin account directly:

```sql
INSERT INTO users (email, alias, password_hash, is_admin, is_active, must_change_password)
VALUES (
  'admin@example.com',
  'Admin',
  '$2y$12$REPLACE_WITH_BCRYPT_HASH',   -- generate with: php -r "echo password_hash('yourpassword', PASSWORD_BCRYPT);"
  1, 1, 0
);

INSERT INTO user_scores (user_id) VALUES (LAST_INSERT_ID());
```

**Quick way to generate the hash:**

```bash
php -r "echo password_hash('yourpassword', PASSWORD_BCRYPT) . PHP_EOL;"
```

---

## File structure

```
alt-apache-php-mysql/
├── schema.sql          ← MySQL DDL + seed data (run once)
├── config.php          ← DB + app constants
├── db.php              ← PDO singleton (get_db())
├── auth.php            ← Session auth helpers
├── scoring.php         ← Scoring engine (PHP port of scoring.ts)
├── data.php            ← Static tournament data (teams, groups)
├── _layout.php         ← Shared HTML layout (nav, flash, footer)
│
├── index.php           ← Scoreboard (public)
├── login.php           ← Login
├── logout.php          ← Logout
├── register.php        ← Registration
├── predictions.php     ← Enter predictions (auth required)
├── results.php         ← View match results (public)
├── rules.php           ← Scoring rules (public)
├── profile.php         ← Change password (auth required)
│
├── admin/
│   ├── index.php           ← Admin dashboard (matches / users / settings tabs)
│   ├── save_result.php     ← POST: save match score
│   ├── save_settings.php   ← POST: save tournament settings
│   ├── recalculate.php     ← POST: recalculate all scores
│   ├── toggle_user.php     ← POST: enable/disable user
│   └── reset_password.php  ← POST: reset user password
│
└── assets/
    └── style.css       ← Shared CSS (dark blue / gold theme)
```

---

## Scoring rules (summary)

| Category | Points |
|----------|--------|
| Exact group-stage score | 4 pts |
| Correct winner + correct goal diff | 2 pts |
| Correct winner / draw | 1 pt |
| Bonus match (×3 multiplier) | max 12 pts |
| Group standing position (per team, per group) | 1 pt |
| Champion | 10 pts |
| Runner-up | 5 pts |
| 3rd place | 2 pts |
| Golden Boot / Golden Ball (per awarded slot) | 5 pts each |

Run **Admin → Recalculate All Scores** after entering any result or changing award settings.

---

## Security notes

- All DB queries use **PDO prepared statements** — no SQL injection.
- All HTML output is escaped with `htmlspecialchars()`.
- **CSRF tokens** are verified on every POST.
- Passwords stored as **bcrypt** (`password_hash()`/`password_verify()`).
- Sessions use `session_regenerate_id(true)` on login to prevent session fixation.
- Cookies: `httponly`, `samesite=Lax`.

---

## Development tips

- Enable PHP error reporting during development:
  ```php
  ini_set('display_errors', 1);
  error_reporting(E_ALL);
  ```
- PHP built-in server (no Apache needed for testing):
  ```bash
  cd alt-apache-php-mysql
  php -S localhost:8080
  ```
  Then open `http://localhost:8080`
