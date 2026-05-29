-- WC 2026 Prediction Game - MySQL Schema
-- Run: mysql -u root -p wc2026_porra < schema.sql
-- Or import via phpMyAdmin

CREATE DATABASE IF NOT EXISTS wc2026_porra CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE wc2026_porra;

-- ─────────────────────────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id                  INT           NOT NULL AUTO_INCREMENT,
    email               VARCHAR(255)  NOT NULL,
    alias               VARCHAR(50)   NOT NULL,
    password_hash       VARCHAR(255)  NOT NULL,
    is_admin            TINYINT(1)    NOT NULL DEFAULT 0,
    is_active           TINYINT(1)    NOT NULL DEFAULT 1,
    must_change_password TINYINT(1)   NOT NULL DEFAULT 0,
    created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_email  (email),
    UNIQUE KEY uq_alias  (alias)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────────
-- TEAMS
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS teams (
    id          INT          NOT NULL,
    name        VARCHAR(100) NOT NULL,
    name_es     VARCHAR(100) NOT NULL,
    code        CHAR(3)      NOT NULL,
    group_id    CHAR(1)      NOT NULL,
    group_pos   TINYINT      NOT NULL,
    flag_emoji  VARCHAR(20)  NOT NULL DEFAULT '',
    PRIMARY KEY (id),
    KEY idx_group (group_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────────
-- MATCHES
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS matches (
    id               INT          NOT NULL AUTO_INCREMENT,
    match_number     INT          NOT NULL,
    round            ENUM('GROUP','R32','R16','QF','SF','THIRD','FINAL') NOT NULL,
    group_id         CHAR(1)      DEFAULT NULL,
    match_date       DATETIME     DEFAULT NULL,
    home_team_id     INT          DEFAULT NULL,
    away_team_id     INT          DEFAULT NULL,
    home_slot_label  VARCHAR(20)  DEFAULT NULL,
    away_slot_label  VARCHAR(20)  DEFAULT NULL,
    home_score       INT          DEFAULT NULL,
    away_score       INT          DEFAULT NULL,
    home_score_aet   INT          DEFAULT NULL,
    away_score_aet   INT          DEFAULT NULL,
    penalty_winner_id INT         DEFAULT NULL,
    is_bonus_game    TINYINT(1)   NOT NULL DEFAULT 0,
    is_scored        TINYINT(1)   NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uq_match_number (match_number),
    KEY idx_round   (round),
    KEY idx_group   (group_id),
    CONSTRAINT fk_match_home   FOREIGN KEY (home_team_id)      REFERENCES teams(id),
    CONSTRAINT fk_match_away   FOREIGN KEY (away_team_id)      REFERENCES teams(id),
    CONSTRAINT fk_match_pen    FOREIGN KEY (penalty_winner_id) REFERENCES teams(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────────
-- MATCH PREDICTIONS (score guesses for every match)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS match_predictions (
    id         INT NOT NULL AUTO_INCREMENT,
    user_id    INT NOT NULL,
    match_id   INT NOT NULL,
    home_score INT NOT NULL,
    away_score INT NOT NULL,
    points     INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uq_user_match (user_id, match_id),
    KEY idx_match (match_id),
    CONSTRAINT fk_mp_user  FOREIGN KEY (user_id)  REFERENCES users(id)   ON DELETE CASCADE,
    CONSTRAINT fk_mp_match FOREIGN KEY (match_id) REFERENCES matches(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────────
-- GROUP PREDICTIONS (predict final 1st-4th per group)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS group_predictions (
    id           INT  NOT NULL AUTO_INCREMENT,
    user_id      INT  NOT NULL,
    group_id     CHAR(1) NOT NULL,
    pos1_team_id INT  DEFAULT NULL,
    pos2_team_id INT  DEFAULT NULL,
    pos3_team_id INT  DEFAULT NULL,
    pos4_team_id INT  DEFAULT NULL,
    points       INT  NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uq_user_group (user_id, group_id),
    CONSTRAINT fk_gp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────────
-- SPECIAL PREDICTIONS (champion, golden boot/ball, etc.)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS special_predictions (
    id                INT          NOT NULL AUTO_INCREMENT,
    user_id           INT          NOT NULL,
    champion_id       INT          DEFAULT NULL,
    runner_up_id      INT          DEFAULT NULL,
    third_place_id    INT          DEFAULT NULL,
    golden_boot_1     VARCHAR(100) DEFAULT NULL,
    golden_boot_2     VARCHAR(100) DEFAULT NULL,
    golden_boot_3     VARCHAR(100) DEFAULT NULL,
    golden_ball_1     VARCHAR(100) DEFAULT NULL,
    golden_ball_2     VARCHAR(100) DEFAULT NULL,
    golden_ball_3     VARCHAR(100) DEFAULT NULL,
    pts_champion      INT          NOT NULL DEFAULT 0,
    pts_runner_up     INT          NOT NULL DEFAULT 0,
    pts_third_place   INT          NOT NULL DEFAULT 0,
    pts_golden_boot   INT          NOT NULL DEFAULT 0,
    pts_golden_ball   INT          NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uq_user (user_id),
    CONSTRAINT fk_sp_user      FOREIGN KEY (user_id)        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_sp_champion  FOREIGN KEY (champion_id)    REFERENCES teams(id),
    CONSTRAINT fk_sp_runner    FOREIGN KEY (runner_up_id)   REFERENCES teams(id),
    CONSTRAINT fk_sp_third     FOREIGN KEY (third_place_id) REFERENCES teams(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────────
-- USER SCORES (rolling totals, recalculated by admin)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_scores (
    id                    INT NOT NULL AUTO_INCREMENT,
    user_id               INT NOT NULL,
    points_total          INT NOT NULL DEFAULT 0,
    points_group_matches  INT NOT NULL DEFAULT 0,
    points_group_standings INT NOT NULL DEFAULT 0,
    points_knockout       INT NOT NULL DEFAULT 0,
    points_bonus          INT NOT NULL DEFAULT 0,
    points_special        INT NOT NULL DEFAULT 0,
    updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_user (user_id),
    CONSTRAINT fk_us_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────────
-- ADMIN OVERRIDES (manual point corrections)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_overrides (
    id              INT          NOT NULL AUTO_INCREMENT,
    user_id         INT          NOT NULL,
    match_id        INT          DEFAULT NULL,
    points_override INT          NOT NULL DEFAULT 0,
    reason          VARCHAR(255) DEFAULT NULL,
    admin_id        INT          NOT NULL,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_ao_user  FOREIGN KEY (user_id)  REFERENCES users(id),
    CONSTRAINT fk_ao_match FOREIGN KEY (match_id) REFERENCES matches(id),
    CONSTRAINT fk_ao_admin FOREIGN KEY (admin_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────────
-- TOURNAMENT SETTINGS (singleton row, id=1)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tournament_settings (
    id                  INT          NOT NULL DEFAULT 1,
    prediction_deadline DATETIME     DEFAULT NULL,
    game_status         ENUM('upcoming','active','finished') NOT NULL DEFAULT 'upcoming',
    champion_id         INT          DEFAULT NULL,
    runner_up_id        INT          DEFAULT NULL,
    third_place_id      INT          DEFAULT NULL,
    golden_boot_1       VARCHAR(100) DEFAULT NULL,
    golden_boot_2       VARCHAR(100) DEFAULT NULL,
    golden_boot_3       VARCHAR(100) DEFAULT NULL,
    golden_ball_1       VARCHAR(100) DEFAULT NULL,
    golden_ball_2       VARCHAR(100) DEFAULT NULL,
    golden_ball_3       VARCHAR(100) DEFAULT NULL,
    boot_2_awarded      TINYINT(1)   NOT NULL DEFAULT 0,
    boot_3_awarded      TINYINT(1)   NOT NULL DEFAULT 0,
    ball_2_awarded      TINYINT(1)   NOT NULL DEFAULT 0,
    ball_3_awarded      TINYINT(1)   NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_ts_champion FOREIGN KEY (champion_id)  REFERENCES teams(id),
    CONSTRAINT fk_ts_runner   FOREIGN KEY (runner_up_id) REFERENCES teams(id),
    CONSTRAINT fk_ts_third    FOREIGN KEY (third_place_id) REFERENCES teams(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────────
-- SEED: Teams (48 teams, WC 2026)
-- ─────────────────────────────────────────────────────────────────
INSERT INTO teams (id, name, name_es, code, group_id, group_pos, flag_emoji) VALUES
-- Group A
(1,  'Mexico',         'México',               'MEX', 'A', 1, '🇲🇽'),
(2,  'South Africa',   'Sudáfrica',             'RSA', 'A', 2, '🇿🇦'),
(3,  'South Korea',    'Corea del Sur',          'KOR', 'A', 3, '🇰🇷'),
(4,  'Czech Republic', 'República Checa',        'CZE', 'A', 4, '🇨🇿'),
-- Group B
(5,  'Canada',         'Canadá',                'CAN', 'B', 1, '🇨🇦'),
(6,  'Bosnia',         'Bosnia y Herzegovina',   'BIH', 'B', 2, '🇧🇦'),
(7,  'Qatar',          'Catar',                 'QAT', 'B', 3, '🇶🇦'),
(8,  'Switzerland',    'Suiza',                 'SUI', 'B', 4, '🇨🇭'),
-- Group C
(9,  'Brazil',         'Brasil',                'BRA', 'C', 1, '🇧🇷'),
(10, 'Morocco',        'Marruecos',             'MAR', 'C', 2, '🇲🇦'),
(11, 'Haiti',          'Haití',                 'HAI', 'C', 3, '🇭🇹'),
(12, 'Scotland',       'Escocia',               'SCO', 'C', 4, '🏴󠁧󠁢󠁳󠁣󠁴󠁿'),
-- Group D
(13, 'USA',            'Estados Unidos',         'USA', 'D', 1, '🇺🇸'),
(14, 'Paraguay',       'Paraguay',              'PAR', 'D', 2, '🇵🇾'),
(15, 'Australia',      'Australia',             'AUS', 'D', 3, '🇦🇺'),
(16, 'Turkey',         'Turquía',               'TUR', 'D', 4, '🇹🇷'),
-- Group E
(17, 'Germany',        'Alemania',              'GER', 'E', 1, '🇩🇪'),
(18, 'Curaçao',        'Curazao',               'CUW', 'E', 2, '🇨🇼'),
(19, 'Ivory Coast',    'Costa de Marfil',        'CIV', 'E', 3, '🇨🇮'),
(20, 'Ecuador',        'Ecuador',               'ECU', 'E', 4, '🇪🇨'),
-- Group F
(21, 'Netherlands',    'Países Bajos',           'NED', 'F', 1, '🇳🇱'),
(22, 'Japan',          'Japón',                 'JPN', 'F', 2, '🇯🇵'),
(23, 'Sweden',         'Suecia',                'SWE', 'F', 3, '🇸🇪'),
(24, 'Tunisia',        'Túnez',                 'TUN', 'F', 4, '🇹🇳'),
-- Group G
(25, 'Belgium',        'Bélgica',               'BEL', 'G', 1, '🇧🇪'),
(26, 'Egypt',          'Egipto',                'EGY', 'G', 2, '🇪🇬'),
(27, 'Iran',           'Irán',                  'IRN', 'G', 3, '🇮🇷'),
(28, 'New Zealand',    'Nueva Zelanda',          'NZL', 'G', 4, '🇳🇿'),
-- Group H
(29, 'Spain',          'España',                'ESP', 'H', 1, '🇪🇸'),
(30, 'Cape Verde',     'Cabo Verde',             'CPV', 'H', 2, '🇨🇻'),
(31, 'Saudi Arabia',   'Arabia Saudita',         'KSA', 'H', 3, '🇸🇦'),
(32, 'Uruguay',        'Uruguay',               'URU', 'H', 4, '🇺🇾'),
-- Group I
(33, 'France',         'Francia',               'FRA', 'I', 1, '🇫🇷'),
(34, 'Senegal',        'Senegal',               'SEN', 'I', 2, '🇸🇳'),
(35, 'Iraq',           'Irak',                  'IRQ', 'I', 3, '🇮🇶'),
(36, 'Norway',         'Noruega',               'NOR', 'I', 4, '🇳🇴'),
-- Group J
(37, 'Argentina',      'Argentina',             'ARG', 'J', 1, '🇦🇷'),
(38, 'Algeria',        'Argelia',               'ALG', 'J', 2, '🇩🇿'),
(39, 'Austria',        'Austria',               'AUT', 'J', 3, '🇦🇹'),
(40, 'Jordan',         'Jordania',              'JOR', 'J', 4, '🇯🇴'),
-- Group K
(41, 'Portugal',       'Portugal',              'POR', 'K', 1, '🇵🇹'),
(42, 'DR Congo',       'RD Congo',              'COD', 'K', 2, '🇨🇩'),
(43, 'Uzbekistan',     'Uzbekistán',            'UZB', 'K', 3, '🇺🇿'),
(44, 'Colombia',       'Colombia',              'COL', 'K', 4, '🇨🇴'),
-- Group L
(45, 'England',        'Inglaterra',            'ENG', 'L', 1, '🏴󠁧󠁢󠁥󠁮󠁧󠁿'),
(46, 'Croatia',        'Croacia',               'CRO', 'L', 2, '🇭🇷'),
(47, 'Ghana',          'Ghana',                 'GHA', 'L', 3, '🇬🇭'),
(48, 'Panama',         'Panamá',                'PAN', 'L', 4, '🇵🇦');

-- ─────────────────────────────────────────────────────────────────
-- SEED: Matches (104 matches: 72 group stage + 32 knockout)
-- ─────────────────────────────────────────────────────────────────
INSERT INTO matches (match_number, round, group_id, match_date, home_team_id, away_team_id, home_slot_label, away_slot_label, is_bonus_game) VALUES
-- Group A (1v2, 3v4, 1v3, 2v4, 1v4, 2v3)
(1,  'GROUP','A','2026-06-11 15:00:00', 1,  2,  NULL,NULL, 0),
(2,  'GROUP','A','2026-06-11 22:00:00', 3,  4,  NULL,NULL, 1),
(3,  'GROUP','A','2026-06-18 12:00:00', 1,  3,  NULL,NULL, 0),
(4,  'GROUP','A','2026-06-18 21:00:00', 2,  4,  NULL,NULL, 0),
(5,  'GROUP','A','2026-06-24 21:00:00', 1,  4,  NULL,NULL, 0),
(6,  'GROUP','A','2026-06-24 21:00:00', 2,  3,  NULL,NULL, 0),
-- Group B
(7,  'GROUP','B','2026-06-12 15:00:00', 5,  6,  NULL,NULL, 0),
(8,  'GROUP','B','2026-06-13 15:00:00', 7,  8,  NULL,NULL, 0),
(9,  'GROUP','B','2026-06-18 15:00:00', 5,  7,  NULL,NULL, 1),
(10, 'GROUP','B','2026-06-18 18:00:00', 6,  8,  NULL,NULL, 0),
(11, 'GROUP','B','2026-06-24 15:00:00', 5,  8,  NULL,NULL, 0),
(12, 'GROUP','B','2026-06-24 15:00:00', 6,  7,  NULL,NULL, 0),
-- Group C
(13, 'GROUP','C','2026-06-13 18:00:00', 9,  10, NULL,NULL, 0),
(14, 'GROUP','C','2026-06-13 21:00:00', 11, 12, NULL,NULL, 1),
(15, 'GROUP','C','2026-06-19 18:00:00', 9,  11, NULL,NULL, 0),
(16, 'GROUP','C','2026-06-19 20:30:00', 10, 12, NULL,NULL, 0),
(17, 'GROUP','C','2026-06-24 18:00:00', 9,  12, NULL,NULL, 0),
(18, 'GROUP','C','2026-06-24 18:00:00', 10, 11, NULL,NULL, 0),
-- Group D
(19, 'GROUP','D','2026-06-12 21:00:00', 13, 14, NULL,NULL, 0),
(20, 'GROUP','D','2026-06-14 00:00:00', 15, 16, NULL,NULL, 1),
(21, 'GROUP','D','2026-06-19 15:00:00', 13, 15, NULL,NULL, 0),
(22, 'GROUP','D','2026-06-19 23:00:00', 14, 16, NULL,NULL, 0),
(23, 'GROUP','D','2026-06-25 22:00:00', 13, 16, NULL,NULL, 0),
(24, 'GROUP','D','2026-06-25 22:00:00', 14, 15, NULL,NULL, 0),
-- Group E
(25, 'GROUP','E','2026-06-14 13:00:00', 17, 18, NULL,NULL, 0),
(26, 'GROUP','E','2026-06-14 19:00:00', 19, 20, NULL,NULL, 0),
(27, 'GROUP','E','2026-06-20 16:00:00', 17, 19, NULL,NULL, 0),
(28, 'GROUP','E','2026-06-20 20:00:00', 18, 20, NULL,NULL, 0),
(29, 'GROUP','E','2026-06-25 16:00:00', 17, 20, NULL,NULL, 0),
(30, 'GROUP','E','2026-06-25 16:00:00', 18, 19, NULL,NULL, 1),
-- Group F
(31, 'GROUP','F','2026-06-14 16:00:00', 21, 22, NULL,NULL, 0),
(32, 'GROUP','F','2026-06-14 22:00:00', 23, 24, NULL,NULL, 0),
(33, 'GROUP','F','2026-06-20 13:00:00', 21, 23, NULL,NULL, 0),
(34, 'GROUP','F','2026-06-21 00:00:00', 22, 24, NULL,NULL, 1),
(35, 'GROUP','F','2026-06-25 19:00:00', 21, 24, NULL,NULL, 0),
(36, 'GROUP','F','2026-06-25 19:00:00', 22, 23, NULL,NULL, 0),
-- Group G
(37, 'GROUP','G','2026-06-15 15:00:00', 25, 26, NULL,NULL, 0),
(38, 'GROUP','G','2026-06-15 21:00:00', 27, 28, NULL,NULL, 1),
(39, 'GROUP','G','2026-06-21 15:00:00', 25, 27, NULL,NULL, 0),
(40, 'GROUP','G','2026-06-21 21:00:00', 26, 28, NULL,NULL, 0),
(41, 'GROUP','G','2026-06-26 23:00:00', 25, 28, NULL,NULL, 0),
(42, 'GROUP','G','2026-06-26 23:00:00', 26, 27, NULL,NULL, 0),
-- Group H
(43, 'GROUP','H','2026-06-15 12:00:00', 29, 30, NULL,NULL, 0),
(44, 'GROUP','H','2026-06-15 18:00:00', 31, 32, NULL,NULL, 1),
(45, 'GROUP','H','2026-06-21 12:00:00', 29, 31, NULL,NULL, 0),
(46, 'GROUP','H','2026-06-21 18:00:00', 30, 32, NULL,NULL, 0),
(47, 'GROUP','H','2026-06-26 20:00:00', 29, 32, NULL,NULL, 0),
(48, 'GROUP','H','2026-06-26 20:00:00', 30, 31, NULL,NULL, 0),
-- Group I
(49, 'GROUP','I','2026-06-16 15:00:00', 33, 34, NULL,NULL, 0),
(50, 'GROUP','I','2026-06-16 18:00:00', 35, 36, NULL,NULL, 1),
(51, 'GROUP','I','2026-06-22 17:00:00', 33, 35, NULL,NULL, 0),
(52, 'GROUP','I','2026-06-22 20:00:00', 34, 36, NULL,NULL, 0),
(53, 'GROUP','I','2026-06-26 15:00:00', 33, 36, NULL,NULL, 0),
(54, 'GROUP','I','2026-06-26 15:00:00', 34, 35, NULL,NULL, 0),
-- Group J
(55, 'GROUP','J','2026-06-16 21:00:00', 37, 38, NULL,NULL, 0),
(56, 'GROUP','J','2026-06-17 00:00:00', 39, 40, NULL,NULL, 0),
(57, 'GROUP','J','2026-06-22 13:00:00', 37, 39, NULL,NULL, 0),
(58, 'GROUP','J','2026-06-22 23:00:00', 38, 40, NULL,NULL, 1),
(59, 'GROUP','J','2026-06-27 22:00:00', 37, 40, NULL,NULL, 0),
(60, 'GROUP','J','2026-06-27 22:00:00', 38, 39, NULL,NULL, 0),
-- Group K
(61, 'GROUP','K','2026-06-17 13:00:00', 41, 42, NULL,NULL, 0),
(62, 'GROUP','K','2026-06-17 22:00:00', 43, 44, NULL,NULL, 0),
(63, 'GROUP','K','2026-06-23 13:00:00', 41, 43, NULL,NULL, 0),
(64, 'GROUP','K','2026-06-23 22:00:00', 42, 44, NULL,NULL, 0),
(65, 'GROUP','K','2026-06-27 19:30:00', 41, 44, NULL,NULL, 0),
(66, 'GROUP','K','2026-06-27 19:30:00', 42, 43, NULL,NULL, 1),
-- Group L
(67, 'GROUP','L','2026-06-17 16:00:00', 45, 46, NULL,NULL, 0),
(68, 'GROUP','L','2026-06-17 19:00:00', 47, 48, NULL,NULL, 0),
(69, 'GROUP','L','2026-06-23 16:00:00', 45, 47, NULL,NULL, 0),
(70, 'GROUP','L','2026-06-23 19:00:00', 46, 48, NULL,NULL, 1),
(71, 'GROUP','L','2026-06-27 17:00:00', 45, 48, NULL,NULL, 0),
(72, 'GROUP','L','2026-06-27 17:00:00', 46, 47, NULL,NULL, 0),
-- Round of 32 (73-88)
(73, 'R32',NULL,'2026-06-29 19:00:00',NULL,NULL,'1A',  '2B',    0),
(74, 'R32',NULL,'2026-06-29 23:00:00',NULL,NULL,'1C',  '2D',    0),
(75, 'R32',NULL,'2026-06-30 19:00:00',NULL,NULL,'1B',  '2A',    0),
(76, 'R32',NULL,'2026-06-30 23:00:00',NULL,NULL,'1D',  '2C',    0),
(77, 'R32',NULL,'2026-07-01 19:00:00',NULL,NULL,'1E',  '2F',    0),
(78, 'R32',NULL,'2026-07-01 23:00:00',NULL,NULL,'1G',  '2H',    0),
(79, 'R32',NULL,'2026-07-02 19:00:00',NULL,NULL,'1F',  '2E',    0),
(80, 'R32',NULL,'2026-07-02 23:00:00',NULL,NULL,'1H',  '2G',    0),
(81, 'R32',NULL,'2026-07-03 19:00:00',NULL,NULL,'1I',  '2J',    0),
(82, 'R32',NULL,'2026-07-03 23:00:00',NULL,NULL,'1K',  '2L',    0),
(83, 'R32',NULL,'2026-07-04 19:00:00',NULL,NULL,'1J',  '2I',    0),
(84, 'R32',NULL,'2026-07-04 23:00:00',NULL,NULL,'1L',  '2K',    0),
(85, 'R32',NULL,'2026-07-05 19:00:00',NULL,NULL,'3ABCD','3EFGH', 0),
(86, 'R32',NULL,'2026-07-05 23:00:00',NULL,NULL,'3IJKL','3ABEF', 0),
(87, 'R32',NULL,'2026-07-06 19:00:00',NULL,NULL,'3CDIJ','3GHKL', 0),
(88, 'R32',NULL,'2026-07-06 23:00:00',NULL,NULL,'3ABCG','3DEFL', 0),
-- Round of 16 (89-96)
(89, 'R16',NULL,'2026-07-09 19:00:00',NULL,NULL,'W73','W74',0),
(90, 'R16',NULL,'2026-07-09 23:00:00',NULL,NULL,'W75','W76',0),
(91, 'R16',NULL,'2026-07-10 19:00:00',NULL,NULL,'W77','W78',0),
(92, 'R16',NULL,'2026-07-10 23:00:00',NULL,NULL,'W79','W80',0),
(93, 'R16',NULL,'2026-07-11 19:00:00',NULL,NULL,'W81','W82',0),
(94, 'R16',NULL,'2026-07-11 23:00:00',NULL,NULL,'W83','W84',0),
(95, 'R16',NULL,'2026-07-12 19:00:00',NULL,NULL,'W85','W86',0),
(96, 'R16',NULL,'2026-07-12 23:00:00',NULL,NULL,'W87','W88',0),
-- Quarterfinals (97-100)
(97, 'QF',NULL,'2026-07-16 19:00:00',NULL,NULL,'W89','W90',0),
(98, 'QF',NULL,'2026-07-17 23:00:00',NULL,NULL,'W91','W92',0),
(99, 'QF',NULL,'2026-07-18 19:00:00',NULL,NULL,'W93','W94',0),
(100,'QF',NULL,'2026-07-19 23:00:00',NULL,NULL,'W95','W96',0),
-- Semifinals (101-102)
(101,'SF',NULL,'2026-07-23 23:00:00',NULL,NULL,'W97', 'W98', 0),
(102,'SF',NULL,'2026-07-24 23:00:00',NULL,NULL,'W99', 'W100',0),
-- 3rd/4th place (103)
(103,'THIRD',NULL,'2026-07-27 20:00:00',NULL,NULL,'L101','L102',0),
-- Final (104)
(104,'FINAL',NULL,'2026-07-29 20:00:00',NULL,NULL,'W101','W102',0);

-- ─────────────────────────────────────────────────────────────────
-- SEED: Tournament settings (single row)
-- ─────────────────────────────────────────────────────────────────
INSERT INTO tournament_settings (id, prediction_deadline, game_status)
VALUES (1, '2026-06-10 23:59:59', 'upcoming')
ON DUPLICATE KEY UPDATE id=id;
