# WC 2026 Database Update Guide
**Date: 2026-06-26**  
**Status: Group Stage Results Updated**

---

## Overview

Two SQL update files have been created to update your FIFA World Cup 2026 databases with real match results from the group stage:

1. **MySQL Database** (for your alt-apache-php-mysql Apache/PHP deployment)
2. **PostgreSQL Database** (for your Azure App Service deployment)

Both files contain identical match results but use database-appropriate syntax (MySQL uses `1`/`0` for boolean, PostgreSQL uses `true`/`false`).

---

## File Locations

- **MySQL Updates:** `/alt-apache-php-mysql/UPDATE_RESULTS_2026-06-26.sql`
- **PostgreSQL Updates:** `/UPDATE_RESULTS_POSTGRESQL_2026-06-26.sql`

---

## What's Included

Both SQL files update:
- ✅ All 72 group stage matches (Groups A-L, 6 matches per group)
- ✅ Match scores (home_score, away_score)
- ✅ Match status (is_scored = 1 or true)
- ✅ Verification queries to confirm updates

---

## ⚙️ For MySQL (alt-apache-php-mysql)

### Method 1: phpMyAdmin (Recommended - Easiest)

1. **Open phpMyAdmin** in your browser (usually `http://localhost/phpmyadmin`)
2. **Select Database:** Click on `wc2026_porra` in the left sidebar
3. **Open SQL Tab:** Click the "SQL" tab at the top
4. **Copy the SQL file content:**
   - Open `/alt-apache-php-mysql/UPDATE_RESULTS_2026-06-26.sql` in a text editor
   - Select all content (Ctrl+A)
   - Copy (Ctrl+C)
5. **Paste in phpMyAdmin:** Paste into the SQL query box (Ctrl+V)
6. **Execute:** Click the "Go" or "Execute" button (red triangle)
7. **Verify:** You should see a success message and result: `scored_matches = 72`

### Method 2: Command Line (For SSH/Server Access)

```bash
# From your server where MySQL is running
mysql -u DB_USER -p wc2026_porra < UPDATE_RESULTS_2026-06-26.sql

# Replace DB_USER with your actual database user
# When prompted, enter your database password
```

### Method 3: During Deployment

If deploying to production PHP server:
```bash
# Upload the SQL file to the server
scp UPDATE_RESULTS_2026-06-26.sql user@server.com:/path/to/app/

# Then SSH in and run:
mysql -h db-host -u db-user -p db-name < UPDATE_RESULTS_2026-06-26.sql
```

---

## ⚙️ For PostgreSQL (Azure Deployment)

### Method 1: Azure Portal Query Editor (Easiest)

1. **Open Azure Portal** → Navigate to your **PostgreSQL Flexible Server**
2. **Query Editor:** Click "Query editor (preview)" in left sidebar
3. **Connect:** Login with your admin credentials
4. **Copy & Paste:** 
   - Open `/UPDATE_RESULTS_POSTGRESQL_2026-06-26.sql`
   - Select all content
   - Copy to Query Editor
5. **Execute:** Click "Run" or press Ctrl+Enter
6. **Verify:** Check the result message (should show `72` scored_matches)

### Method 2: psql Command Line

```bash
# From your local machine with psql installed
psql -h your-server.postgres.database.azure.com \
     -U your-admin-user@your-server \
     -d wc2026_porra \
     -f UPDATE_RESULTS_POSTGRESQL_2026-06-26.sql

# You'll be prompted for password
```

### Method 3: Prisma Migrate (Recommended for Azure App Service)

```bash
# In your project root
npx prisma db execute --stdin < UPDATE_RESULTS_POSTGRESQL_2026-06-26.sql

# Or via Azure CLI
az postgres flexible-server execute \
    --resource-group your-rg \
    --server-name your-server \
    --admin-user your-admin \
    --database-name wc2026_porra \
    --query-file UPDATE_RESULTS_POSTGRESQL_2026-06-26.sql
```

### Method 4: Azure CLI Script

```bash
# Create a temporary SQL file and execute
az sql db execute-sql \
    --resource-group your-rg \
    --server your-server \
    --database wc2026_porra \
    --input-file UPDATE_RESULTS_POSTGRESQL_2026-06-26.sql
```

---

## 📊 Match Results Summary

### Group Stage Results Updated:
- **Group A:** Mexico (9pts) | South Africa (4) | Korea Republic (3) | Czechia (1)
- **Group B:** Switzerland (7pts) | Canada (4) | Bosnia & Herzegovina (4) | Qatar (1)
- **Group C:** Brazil (7pts) | Morocco (7) | Scotland (3) | Haiti (0)
- **Group D:** USA (6pts) | Australia (4) | Paraguay (4) | Türkiye (3)
- **Groups E-L:** Complete group stage results included

**Total Matches Updated:** 72  
**Database Records Modified:** 72 matches table rows

---

## ✅ Verification Queries

After running the update scripts, verify the changes:

### For MySQL:
```sql
-- Check group stage matches
SELECT COUNT(*) as scored_matches FROM matches WHERE round = 'GROUP' AND is_scored = 1;
-- Expected: 72

-- View sample results
SELECT match_number, home_score, away_score FROM matches WHERE round = 'GROUP' LIMIT 10;
```

### For PostgreSQL:
```sql
-- Check group stage matches
SELECT COUNT(*) as scored_matches FROM matches WHERE round = 'GROUP' AND is_scored = true;
-- Expected: 72

-- View sample results
SELECT match_number, home_score, away_score FROM matches WHERE round = 'GROUP' LIMIT 10;
```

---

## ⚠️ Before Running

**IMPORTANT CHECKS:**

1. **Backup Your Database**
   - MySQL: `mysqldump -u user -p wc2026_porra > backup_2026-06-26.sql`
   - PostgreSQL: `pg_dump -h host -U user wc2026_porra > backup_2026-06-26.sql`

2. **Verify Database Connection**
   - Ensure you can connect to your database
   - Confirm the `matches` table exists

3. **Match IDs Check**
   - Verify your matches are numbered 1-72
   - If different, adjust the UPDATE statements accordingly

4. **No Ongoing Transactions**
   - Ensure no scoring calculations are running
   - No active user predictions being submitted

---

## 🐛 Troubleshooting

### Error: "Table 'matches' doesn't exist"
- Ensure the schema/migrations have been run
- Run `npx prisma migrate deploy` first (for Azure PostgreSQL)

### Error: "Match not found" / "0 rows affected"
- Your match numbers may not be 1-72
- Query your matches table: `SELECT COUNT(*), MIN(match_number), MAX(match_number) FROM matches;`
- Adjust the UPDATE statements if needed

### Error: "Column 'is_scored' doesn't exist"
- Ensure your schema migration includes the `is_scored` column
- Check your database schema definition

### Connection Timeout
- Check firewall rules allow your connection
- Verify username/password credentials
- For Azure: Ensure your IP is in the firewall allowlist

---

## 📝 Next Steps

After updating results:

1. **Run Scoring Calculations**
   - Execute your match prediction scoring logic
   - Update user_scores with calculated points

2. **Update Knockout Rounds** (when they begin)
   - Create separate SQL files for R32, R16, QF, SF, THIRD, FINAL rounds
   - Follow same procedure as group stage

3. **Monitor User Points**
   - Verify predictions against actual results
   - Check leaderboard/standings are accurate

4. **Archive These Files**
   - Keep these SQL files with your tournament records
   - Date them (2026-06-26) for reference

---

## 📞 Support

### Common Questions

**Q: Can I run this multiple times?**  
A: Yes, it's safe to run multiple times. The UPDATEs are idempotent (same result each time).

**Q: What if I need to update only some matches?**  
A: Edit the SQL file and comment out (--) the matches you don't need to update.

**Q: How do I add knockout stage results later?**  
A: Create new SQL files with match_numbers 73+ and follow the same format.

**Q: Can I undo these changes?**  
A: Yes, use your backup file: `mysql wc2026_porra < backup_2026-06-26.sql`

---

**Last Updated:** 2026-06-26  
**Status:** Group Stage Complete - Ready for Distribution  
**Files:** 2 SQL scripts (MySQL + PostgreSQL)  
**Matches:** 72 group stage results
