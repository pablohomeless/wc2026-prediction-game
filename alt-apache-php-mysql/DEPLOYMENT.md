# Deployment Guide — PHP/Apache/MySQL Version

> **Quick start for local testing:** `cd alt-apache-php-mysql && php -S localhost:8080`

---

## Option A — Shared Hosting (cPanel / DirectAdmin)

Most common scenario for a friend-group prediction game.

### 1. Create the database
In your hosting control panel (e.g. cPanel → MySQL Databases):
- Create a database, e.g. `wc2026_porra`
- Create a DB user with a strong password
- Grant that user **All Privileges** on the database

### 2. Import the schema
Use **phpMyAdmin** (included on most shared hosts):
1. Select your database → **Import** tab
2. Upload `schema.sql`
3. Click **Go** — this creates all tables and seeds all 48 teams + 104 matches

### 3. Upload files
Upload the entire `alt-apache-php-mysql/` folder via FTP/SFTP (FileZilla, etc.) to your `public_html/` directory (or a subdirectory like `public_html/porra/`).

### 4. Configure database credentials
Edit `config.php` with your hosting credentials:

```php
// Or set these as environment variables if your host supports it
define('DB_HOST', 'localhost');    // usually 'localhost' on shared hosts
define('DB_NAME', 'cpanelusername_wc2026_porra');
define('DB_USER', 'cpanelusername_dbuser');
define('DB_PASS', 'your-strong-password');
define('APP_SECRET', 'replace-with-a-long-random-string-32-chars');
```

### 5. Create your admin account
In phpMyAdmin → SQL tab, run:

```sql
-- 1. Generate a bcrypt hash first:
--    Run on your local machine: php -r "echo password_hash('YourPassword123!', PASSWORD_BCRYPT);"
--    Paste the result below:

INSERT INTO users (email, alias, password_hash, is_admin, is_active, must_change_password)
VALUES ('you@example.com', 'Admin', '$2y$12$PASTE_HASH_HERE', 1, 1, 0);

INSERT INTO user_scores (user_id) VALUES (LAST_INSERT_ID());
```

### 6. Test
Visit `https://yourdomain.com/porra/` (or wherever you uploaded it). You should see the Scoreboard page.

---

## Option B — VPS / Dedicated Server (Ubuntu/Debian)

### 1. Install the stack

```bash
sudo apt update && sudo apt install -y apache2 php8.2 php8.2-mysql libapache2-mod-php8.2 mysql-server
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### 2. Clone / upload the app

```bash
sudo mkdir -p /var/www/porra
sudo cp -r /path/to/alt-apache-php-mysql/* /var/www/porra/
sudo chown -R www-data:www-data /var/www/porra
```

### 3. Apache virtual host

Create `/etc/apache2/sites-available/porra.conf`:

```apache
<VirtualHost *:80>
    ServerName porra.yourdomain.com
    DocumentRoot /var/www/porra

    <Directory /var/www/porra>
        AllowOverride All
        Require all granted
        Options -Indexes
    </Directory>

    ErrorLog  ${APACHE_LOG_DIR}/porra-error.log
    CustomLog ${APACHE_LOG_DIR}/porra-access.log combined
</VirtualHost>
```

```bash
sudo a2ensite porra.conf
sudo systemctl reload apache2
```

### 4. MySQL setup

```bash
sudo mysql
```
```sql
CREATE DATABASE wc2026_porra CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'wc2026'@'localhost' IDENTIFIED BY 'StrongPasswordHere!';
GRANT ALL ON wc2026_porra.* TO 'wc2026'@'localhost';
FLUSH PRIVILEGES;
EXIT;

mysql -u wc2026 -p wc2026_porra < /var/www/porra/schema.sql
```

### 5. HTTPS with Let's Encrypt (recommended)

```bash
sudo apt install -y certbot python3-certbot-apache
sudo certbot --apache -d porra.yourdomain.com
```

Certbot will automatically update your vhost for HTTPS and set up auto-renewal.

### 6. Environment variables (optional, more secure than editing config.php)

Add to `/etc/apache2/sites-available/porra.conf` inside `<VirtualHost>`:

```apache
SetEnv DB_HOST     localhost
SetEnv DB_NAME     wc2026_porra
SetEnv DB_USER     wc2026
SetEnv DB_PASS     StrongPasswordHere!
SetEnv APP_SECRET  replace-with-64-random-chars
```

---

## Option C — Docker (single-container, quick demo)

Create a `Dockerfile` alongside this folder:

```dockerfile
FROM php:8.2-apache
RUN docker-php-ext-install pdo pdo_mysql
COPY . /var/www/html/
RUN chown -R www-data:www-data /var/www/html
```

```bash
# Build
docker build -t wc2026-porra .

# Run (connect to external MySQL)
docker run -d -p 8080:80 \
  -e DB_HOST=host.docker.internal \
  -e DB_NAME=wc2026_porra \
  -e DB_USER=wc2026 \
  -e DB_PASS=yourpassword \
  -e APP_SECRET=changeme \
  wc2026-porra
```

Or use **Docker Compose** with a bundled MySQL:

```yaml
version: "3.9"
services:
  app:
    build: .
    ports:
      - "8080:80"
    environment:
      DB_HOST: db
      DB_NAME: wc2026_porra
      DB_USER: wc2026
      DB_PASS: secret
      APP_SECRET: changeme-use-64-random-chars
    depends_on:
      db:
        condition: service_healthy

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootsecret
      MYSQL_DATABASE: wc2026_porra
      MYSQL_USER: wc2026
      MYSQL_PASSWORD: secret
    volumes:
      - db_data:/var/lib/mysql
      - ./schema.sql:/docker-entrypoint-initdb.d/schema.sql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 5s
      retries: 10

volumes:
  db_data:
```

```bash
docker compose up -d
# Visit http://localhost:8080
```

---

## Production Security Checklist

- [ ] Change `APP_SECRET` to a random 64-character string
- [ ] Use a dedicated MySQL user with only `SELECT/INSERT/UPDATE/DELETE` (not `ALL`) if preferred
- [ ] Enable HTTPS (Let's Encrypt or hosting SSL)
- [ ] Set `display_errors = Off` in `php.ini` (or add `ini_set('display_errors', 0)` to `config.php`)
- [ ] Restrict access to `schema.sql` and `*.md` files from the web:
  ```apache
  <FilesMatch "\.(sql|md|sh)$">
      Require all denied
  </FilesMatch>
  ```
- [ ] Keep PHP and MySQL updated

---

## Database Backups

```bash
# Manual dump
mysqldump -u wc2026 -p wc2026_porra > backup_$(date +%Y%m%d).sql

# Simple daily cron (add via crontab -e)
0 3 * * * mysqldump -u wc2026 -pYourPass wc2026_porra > /backups/porra_$(date +\%Y\%m\%d).sql
```

---

## First Login

After deploying and importing the schema, create your admin account (see step above), then:

1. Visit the app URL → **Login**
2. Go to **Admin → Settings** → set the **Prediction Deadline**
3. Share the registration link with participants: `https://yourdomain.com/register.php`
4. Once the tournament starts, enter results via **Admin → Matches** and click **Recalculate All Scores** after each match day
