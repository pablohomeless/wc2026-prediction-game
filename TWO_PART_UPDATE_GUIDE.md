# 🎯 Two-Part Database Update Guide
**Match Results + Group Winners**

**Date Created:** 2026-06-26  
**Status:** ✅ Complete Package Ready  

---

## 📋 Overview

The complete database update for WC 2026 group stage consists of **TWO separate files per database**:

### Part 1: **Match Results** (Individual Match Scores)
- Updates the `matches` table with score for each of 72 group stage games
- Records home_score, away_score, and marks match as scored
- Files:
  - MySQL: `alt-apache-php-mysql/UPDATE_RESULTS_2026-06-26.sql`
  - PostgreSQL: `UPDATE_RESULTS_POSTGRESQL_2026-06-26.sql`

### Part 2: **Group Winners** (Final Standings)
- Updates the `group_standings` table with 1st, 2nd, 3rd, 4th place team per group
- Records which team wins each group and who advances to knockout
- Files:
  - MySQL: `alt-apache-php-mysql/UPDATE_GROUP_WINNERS_2026-06-26.sql`
  - PostgreSQL: `UPDATE_GROUP_WINNERS_2026-06-26.sql`

---

## 🔄 Why Two Files?

These updates serve different purposes:

| Aspect | Match Results | Group Winners |
|--------|---------------|---------------|
| **What It Updates** | Individual match scores | Final group standings |
| **Which Table** | `matches` | `group_standings` |
| **Purpose** | Score predictions accuracy | Determine knockout bracket |
| **Columns Updated** | home_score, away_score, is_scored | pos1_team_id, pos2_team_id, pos3_team_id, pos4_team_id |
| **Affects** | User match predictions scoring | User group prediction scoring |
| **When to Run** | After group stage completes | After group stage completes |
| **Frequency** | Once per match (72 matches) | Once per group (12 groups) |

---

## ✅ Complete Update Sequence

### Step-by-Step (Do BOTH for complete update):

#### 1️⃣ Backup Your Database
```bash
# MySQL
mysqldump -u user -p wc2026_porra > backup_2026-06-26.sql

# PostgreSQL
pg_dump -h host -U user wc2026_porra > backup_2026-06-26.sql
```

#### 2️⃣ Import Match Results File
```
Choose your database:

MySQL (PhpMyAdmin):
  1. Open phpMyAdmin → wc2026_porra
  2. SQL tab → Copy UPDATE_RESULTS_2026-06-26.sql
  3. Paste → Click "Go"

PostgreSQL (Azure Query Editor):
  1. Open Azure Portal → Query Editor
  2. Copy UPDATE_RESULTS_POSTGRESQL_2026-06-26.sql
  3. Paste → Click "Run"
```

#### 3️⃣ Verify Match Results
```sql
-- Check that all 72 group stage matches are marked as scored
SELECT COUNT(*) as scored_matches FROM matches 
WHERE round='GROUP' AND is_scored=1;  -- MySQL: expect 72
-- OR
WHERE round='GROUP' AND is_scored=true;  -- PostgreSQL: expect 72
```

#### 4️⃣ Import Group Winners File
```
Same process as step 2️⃣, but use the UPDATE_GROUP_WINNERS file:

MySQL (PhpMyAdmin):
  1. SQL tab → Copy UPDATE_GROUP_WINNERS_2026-06-26.sql
  2. Paste → Click "Go"

PostgreSQL (Azure Query Editor):
  1. Copy UPDATE_GROUP_WINNERS_2026-06-26.sql
  2. Paste → Click "Run"
```

#### 5️⃣ Verify Group Winners
```sql
-- Check that all 12 groups have winners assigned
SELECT COUNT(*) as groups_with_winners FROM group_standings
WHERE pos1_team_id IS NOT NULL;  -- expect 12

-- View the winners
SELECT group_id,
  (SELECT name FROM teams WHERE id = pos1_team_id) as winner
FROM group_standings
ORDER BY group_id;
```

---

## 📊 Data Structure

### Match Results Update
```sql
-- Updates the matches table
UPDATE matches SET 
  home_score = 1,
  away_score = 0,
  is_scored = 1  -- or true for PostgreSQL
WHERE match_number = 1;
```

**Impact:**
- Enables scoring of user match predictions
- Shows which matches have been played
- Provides reference for user accuracy

### Group Winners Update
```sql
-- Updates the group_standings table
UPDATE group_standings SET 
  pos1_team_id = 1,    -- Mexico wins Group A
  pos2_team_id = 2,    -- South Africa 2nd
  pos3_team_id = 3,    -- South Korea 3rd
  pos4_team_id = 4     -- Czech Republic 4th
WHERE group_id = 'A';
```

**Impact:**
- Determines knockout bracket matchups (1st vs 2nd from other groups)
- Enables scoring of group prediction guesses
- Shows which teams advance to Round of 32

---

## 🎯 Group Winners Summary

All 12 group winners advancing to Round of 32:

| Group | Winner | 2nd Place | 3rd Place | 4th Place |
|-------|--------|-----------|-----------|-----------|
| A | 🇲🇽 Mexico | 🇿🇦 South Africa | 🇰🇷 South Korea | 🇨🇿 Czech Republic |
| B | 🇨🇭 Switzerland | 🇧🇦 Bosnia | 🇨🇦 Canada | 🇶🇦 Qatar |
| C | 🇧🇷 Brazil | 🇲🇦 Morocco | 🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland | 🇭🇹 Haiti |
| D | 🇺🇸 USA | 🇦🇺 Australia | 🇵🇾 Paraguay | 🇹🇷 Turkey |
| E | 🇩🇪 Germany | 🇪🇨 Ecuador | 🇨🇮 Ivory Coast | 🇨🇼 Curaçao |
| F | 🇳🇱 Netherlands | 🇯🇵 Japan | 🇸🇪 Sweden | 🇹🇳 Tunisia |
| G | 🇧🇪 Belgium | 🇮🇷 Iran | 🇪🇬 Egypt | 🇳🇿 New Zealand |
| H | 🇪🇸 Spain | 🇮🇹 Italy | 🇭🇷 Croatia | 🇨🇷 Costa Rica |
| I | 🇫🇷 France | 🇵🇱 Poland | 🇺🇾 Uruguay | 🇧🇴 Bolivia |
| J | 🇦🇷 Argentina | 🇩🇿 Algeria | 🇦🇹 Austria | 🇯🇴 Jordan |
| K | 🇵🇹 Portugal | 🇨🇩 DR Congo | 🇺🇿 Uzbekistan | 🇨🇴 Colombia |
| L | 🏴󠁧󠁢󠁥󠁮󠁧󠁿 England | 🇭🇷 Croatia | 🇬🇭 Ghana | 🇵🇦 Panama |

---

## 🔍 Verification Checklist

### After Import - Part 1 (Match Results):
- [ ] No errors during SQL execution
- [ ] SELECT COUNT returns 72 scored group matches
- [ ] Sample match scores look correct
- [ ] Date/time stamps updated

### After Import - Part 2 (Group Winners):
- [ ] No errors during SQL execution
- [ ] SELECT COUNT returns 12 groups with winners
- [ ] All 12 group positions filled (pos1-pos4)
- [ ] Correct teams in each group

### Final Verification (Both Complete):
- [ ] Total 72 matches scored
- [ ] Total 12 groups with 4 teams each
- [ ] All user predictions can now be scored
- [ ] Knockout bracket can be generated

---

## 🔄 Team IDs Reference (For Troubleshooting)

If you need to manually verify team IDs:

```sql
-- MySQL
SELECT group_id, id, name FROM teams ORDER BY group_id, id;

-- PostgreSQL (same)
SELECT group_id, id, name FROM teams ORDER BY group_id, id;
```

**Group A (1-4):** Mexico, South Africa, South Korea, Czech Republic  
**Group B (5-8):** Canada, Bosnia, Qatar, Switzerland  
**Group C (9-12):** Brazil, Morocco, Haiti, Scotland  
**Group D (13-16):** USA, Paraguay, Australia, Turkey  
**Group E (17-20):** Germany, Curaçao, Ivory Coast, Ecuador  
**Group F (21-24):** Netherlands, Japan, Sweden, Tunisia  
**Group G (25-28):** Belgium, Egypt, Iran, New Zealand  
**Group H (29-32):** Spain, Costa Rica, Italy, Croatia  
**Group I (33-36):** France, Poland, Uruguay, Bolivia  
**Group J (37-40):** Argentina, Algeria, Austria, Jordan  
**Group K (41-44):** Portugal, DR Congo, Uzbekistan, Colombia  
**Group L (45-48):** England, Croatia, Ghana, Panama  

---

## ⏱️ Timeline

**Both files run in parallel:**

| Step | Time | Action |
|------|------|--------|
| 0 | - | Backup database |
| 1 | 2 min | Run match results file |
| 2 | 1 min | Verify match results |
| 3 | 2 min | Run group winners file |
| 4 | 1 min | Verify group winners |
| **Total** | **~6 min** | Both updates complete |

---

## 📞 Troubleshooting

### Issue: 0 rows affected for match results
**Solution:** Verify match_numbers are 1-72 in your matches table

### Issue: 0 rows affected for group winners
**Solution:** 
1. Ensure `group_standings` table exists
2. If not, create it first (see schema below)
3. Or use INSERT instead of UPDATE

### Issue: "column doesn't exist"
**Solution:** Your schema may differ. Adjust column names:
- MySQL: `is_scored` = TINYINT(1) or use `1`/`0`
- PostgreSQL: `is_scored` = BOOLEAN or use `true`/`false`

### Need to undo?
```bash
# Restore from backup
mysql -u user -p wc2026_porra < backup_2026-06-26.sql  # MySQL
psql -h host -U user wc2026_porra < backup_2026-06-26.sql  # PostgreSQL
```

---

## 📄 group_standings Table Schema

If your `group_standings` table doesn't exist, create it:

**PostgreSQL:**
```sql
CREATE TABLE IF NOT EXISTS group_standings (
  id SERIAL PRIMARY KEY,
  group_id CHAR(1) UNIQUE NOT NULL,
  pos1_team_id INT NOT NULL REFERENCES teams(id),
  pos2_team_id INT NOT NULL REFERENCES teams(id),
  pos3_team_id INT NOT NULL REFERENCES teams(id),
  pos4_team_id INT NOT NULL REFERENCES teams(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**MySQL:**
```sql
CREATE TABLE IF NOT EXISTS group_standings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_id CHAR(1) UNIQUE NOT NULL,
  pos1_team_id INT NOT NULL,
  pos2_team_id INT NOT NULL,
  pos3_team_id INT NOT NULL,
  pos4_team_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (pos1_team_id) REFERENCES teams(id),
  FOREIGN KEY (pos2_team_id) REFERENCES teams(id),
  FOREIGN KEY (pos3_team_id) REFERENCES teams(id),
  FOREIGN KEY (pos4_team_id) REFERENCES teams(id)
);
```

---

## 🎯 What's Next?

After both updates are complete:

1. ✅ **User Prediction Scoring** - System can now score user match predictions
2. ✅ **Group Prediction Scoring** - System can now score group standing predictions
3. ✅ **Knockout Bracket** - Round of 32 matchups can be generated
4. ⏳ **Knockout Stage Updates** - When R32 matches complete, create similar files for knockout rounds

---

## 📁 All Files in Package

```
/wc2026-prediction-game/
├── alt-apache-php-mysql/
│   ├── UPDATE_RESULTS_2026-06-26.sql            ← Match results (MySQL)
│   └── UPDATE_GROUP_WINNERS_2026-06-26.sql      ← Group winners (MySQL)
├── UPDATE_RESULTS_POSTGRESQL_2026-06-26.sql     ← Match results (PostgreSQL)
├── UPDATE_GROUP_WINNERS_2026-06-26.sql          ← Group winners (PostgreSQL)
├── START_HERE.md                                ← Quick overview
├── TWO_PART_UPDATE_GUIDE.md                     ← This file
├── DATABASE_UPDATE_GUIDE.md                     ← Detailed instructions
├── QUICK_REFERENCE.md                           ← Quick start
├── DATABASE_UPDATE_PACKAGE_SUMMARY.md           ← Package overview
└── MATCH_MAPPING_REFERENCE.md                   ← Match details
```

---

**Ready to import? Start with Part 1 (Match Results), then Part 2 (Group Winners)!**

*See DATABASE_UPDATE_GUIDE.md for detailed implementation methods.*
