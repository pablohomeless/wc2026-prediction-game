-- ========================================================================
-- WC 2026 GROUP STAGE WINNERS & FINAL STANDINGS - MySQL Update
-- ========================================================================
-- Purpose: Update the group_standings table with final group positions
-- Created: 2026-06-26
-- Database: MySQL 5.7+
-- Status: Ready for production
-- 
-- This file updates which team finished in 1st, 2nd, 3rd, and 4th place
-- in each group (A-L). Used to determine knockout bracket and calculate
-- group prediction scores.
-- ========================================================================

-- Team ID Reference (from teams table):
-- Group A: 1=Mexico, 2=South Africa, 3=South Korea, 4=Czech Republic
-- Group B: 5=Canada, 6=Bosnia, 7=Qatar, 8=Switzerland
-- Group C: 9=Brazil, 10=Morocco, 11=Haiti, 12=Scotland
-- Group D: 13=USA, 14=Paraguay, 15=Australia, 16=Turkey
-- Group E: 17=Germany, 18=Curaçao, 19=Ivory Coast, 20=Ecuador
-- Group F: 21=Netherlands, 22=Japan, 23=Sweden, 24=Tunisia
-- Group G: 25=Belgium, 26=Egypt, 27=Iran, 28=New Zealand
-- Group H: 29=Spain, 30=Costa Rica, 31=Italy, 32=Croatia
-- Group I: 33=France, 34=Poland, 35=Uruguay, 36=Bolivia
-- Group J: 37=Argentina, 38=Algeria, 39=Austria, 40=Jordan
-- Group K: 41=Portugal, 42=DR Congo, 43=Uzbekistan, 44=Colombia
-- Group L: 45=England, 46=Croatia, 47=Ghana, 48=Panama

-- ========================================================================
-- GROUP A: Mexico, South Africa, South Korea, Czech Republic
-- ========================================================================
UPDATE group_standings SET 
  pos1_team_id = 1,   -- Mexico (Winner)
  pos2_team_id = 2,   -- South Africa
  pos3_team_id = 3,   -- South Korea
  pos4_team_id = 4    -- Czech Republic
WHERE group_id = 'A';

-- ========================================================================
-- GROUP B: Canada, Bosnia, Qatar, Switzerland
-- ========================================================================
UPDATE group_standings SET 
  pos1_team_id = 8,   -- Switzerland (Winner)
  pos2_team_id = 6,   -- Bosnia and Herzegovina
  pos3_team_id = 5,   -- Canada
  pos4_team_id = 7    -- Qatar
WHERE group_id = 'B';

-- ========================================================================
-- GROUP C: Brazil, Morocco, Haiti, Scotland
-- ========================================================================
UPDATE group_standings SET 
  pos1_team_id = 9,   -- Brazil (Winner)
  pos2_team_id = 10,  -- Morocco
  pos3_team_id = 12,  -- Scotland
  pos4_team_id = 11   -- Haiti
WHERE group_id = 'C';

-- ========================================================================
-- GROUP D: USA, Paraguay, Australia, Turkey
-- ========================================================================
UPDATE group_standings SET 
  pos1_team_id = 13,  -- USA (Winner)
  pos2_team_id = 15,  -- Australia
  pos3_team_id = 14,  -- Paraguay
  pos4_team_id = 16   -- Turkey
WHERE group_id = 'D';

-- ========================================================================
-- GROUP E: Germany, Curaçao, Ivory Coast, Ecuador
-- ========================================================================
UPDATE group_standings SET 
  pos1_team_id = 17,  -- Germany (Winner)
  pos2_team_id = 20,  -- Ecuador
  pos3_team_id = 19,  -- Ivory Coast
  pos4_team_id = 18   -- Curaçao
WHERE group_id = 'E';

-- ========================================================================
-- GROUP F: Netherlands, Japan, Sweden, Tunisia
-- ========================================================================
UPDATE group_standings SET 
  pos1_team_id = 21,  -- Netherlands (Winner)
  pos2_team_id = 22,  -- Japan
  pos3_team_id = 23,  -- Sweden
  pos4_team_id = 24   -- Tunisia
WHERE group_id = 'F';

-- ─────────────────────────────────────────────────────────────────────────────
-- COMPLETED: Groups A-F (6 groups) - 2026-06-26
-- PENDING: Groups G-L will be added as matches complete
-- ─────────────────────────────────────────────────────────────────────────────

-- ========================================================================
-- VERIFICATION: Display all group standings after update
-- ========================================================================
SELECT 
  gs.group_id,
  CONCAT(t1.flag_emoji, ' ', t1.name) as pos1_winner,
  CONCAT(t2.flag_emoji, ' ', t2.name) as pos2_finalist,
  CONCAT(t3.flag_emoji, ' ', t3.name) as pos3_third,
  CONCAT(t4.flag_emoji, ' ', t4.name) as pos4_fourth
FROM group_standings gs
LEFT JOIN teams t1 ON gs.pos1_team_id = t1.id
LEFT JOIN teams t2 ON gs.pos2_team_id = t2.id
LEFT JOIN teams t3 ON gs.pos3_team_id = t3.id
LEFT JOIN teams t4 ON gs.pos4_team_id = t4.id
WHERE gs.group_id IN ('A', 'B', 'C', 'D', 'E', 'F')
ORDER BY gs.group_id;

-- Expected output: 6 rows (Groups A-F) with all 4 teams per group

-- ========================================================================
-- COUNT verification - should show 6 groups with all positions filled
-- ========================================================================
SELECT 
  COUNT(*) as groups_updated,
  COUNT(DISTINCT group_id) as unique_groups,
  COUNT(CASE WHEN pos1_team_id IS NOT NULL THEN 1 END) as groups_with_winner
FROM group_standings
WHERE group_id IN ('A', 'B', 'C', 'D', 'E', 'F');

-- Expected: groups_updated=6, unique_groups=6, groups_with_winner=6

-- ========================================================================
-- OPTIONAL: Display Group Winners Only (Advancing to R32)
-- ========================================================================
-- Use this to verify which 12 teams advance from each group
--
-- SELECT 
--   gs.group_id,
--   CONCAT(t1.flag_emoji, ' ', t1.name) as winner,
--   t1.code as code
-- FROM group_standings gs
-- LEFT JOIN teams t1 ON gs.pos1_team_id = t1.id
-- ORDER BY gs.group_id;
--
-- Expected 12 teams advancing to Round of 32
