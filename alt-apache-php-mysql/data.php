<?php
/**
 * WC 2026 Static Tournament Data
 * 48 teams, 12 groups (A–L), 104 matches
 */

// ─────────────────────────────────────────────────────────────────
// TEAMS
// ─────────────────────────────────────────────────────────────────

const TEAMS = [
    // Group A
    ['id'=>1,  'name'=>'Mexico',         'name_es'=>'México',               'code'=>'MEX','group_id'=>'A','group_pos'=>1,'flag'=>'🇲🇽'],
    ['id'=>2,  'name'=>'South Africa',   'name_es'=>'Sudáfrica',             'code'=>'RSA','group_id'=>'A','group_pos'=>2,'flag'=>'🇿🇦'],
    ['id'=>3,  'name'=>'South Korea',    'name_es'=>'Corea del Sur',          'code'=>'KOR','group_id'=>'A','group_pos'=>3,'flag'=>'🇰🇷'],
    ['id'=>4,  'name'=>'Czech Republic', 'name_es'=>'República Checa',        'code'=>'CZE','group_id'=>'A','group_pos'=>4,'flag'=>'🇨🇿'],
    // Group B
    ['id'=>5,  'name'=>'Canada',         'name_es'=>'Canadá',                'code'=>'CAN','group_id'=>'B','group_pos'=>1,'flag'=>'🇨🇦'],
    ['id'=>6,  'name'=>'Bosnia',         'name_es'=>'Bosnia y Herzegovina',   'code'=>'BIH','group_id'=>'B','group_pos'=>2,'flag'=>'🇧🇦'],
    ['id'=>7,  'name'=>'Qatar',          'name_es'=>'Catar',                 'code'=>'QAT','group_id'=>'B','group_pos'=>3,'flag'=>'🇶🇦'],
    ['id'=>8,  'name'=>'Switzerland',    'name_es'=>'Suiza',                 'code'=>'SUI','group_id'=>'B','group_pos'=>4,'flag'=>'🇨🇭'],
    // Group C
    ['id'=>9,  'name'=>'Brazil',         'name_es'=>'Brasil',                'code'=>'BRA','group_id'=>'C','group_pos'=>1,'flag'=>'🇧🇷'],
    ['id'=>10, 'name'=>'Morocco',        'name_es'=>'Marruecos',             'code'=>'MAR','group_id'=>'C','group_pos'=>2,'flag'=>'🇲🇦'],
    ['id'=>11, 'name'=>'Haiti',          'name_es'=>'Haití',                 'code'=>'HAI','group_id'=>'C','group_pos'=>3,'flag'=>'🇭🇹'],
    ['id'=>12, 'name'=>'Scotland',       'name_es'=>'Escocia',               'code'=>'SCO','group_id'=>'C','group_pos'=>4,'flag'=>'🏴󠁧󠁢󠁳󠁣󠁴󠁿'],
    // Group D
    ['id'=>13, 'name'=>'USA',            'name_es'=>'Estados Unidos',         'code'=>'USA','group_id'=>'D','group_pos'=>1,'flag'=>'🇺🇸'],
    ['id'=>14, 'name'=>'Paraguay',       'name_es'=>'Paraguay',              'code'=>'PAR','group_id'=>'D','group_pos'=>2,'flag'=>'🇵🇾'],
    ['id'=>15, 'name'=>'Australia',      'name_es'=>'Australia',             'code'=>'AUS','group_id'=>'D','group_pos'=>3,'flag'=>'🇦🇺'],
    ['id'=>16, 'name'=>'Turkey',         'name_es'=>'Turquía',               'code'=>'TUR','group_id'=>'D','group_pos'=>4,'flag'=>'🇹🇷'],
    // Group E
    ['id'=>17, 'name'=>'Germany',        'name_es'=>'Alemania',              'code'=>'GER','group_id'=>'E','group_pos'=>1,'flag'=>'🇩🇪'],
    ['id'=>18, 'name'=>'Curaçao',        'name_es'=>'Curazao',               'code'=>'CUW','group_id'=>'E','group_pos'=>2,'flag'=>'🇨🇼'],
    ['id'=>19, 'name'=>'Ivory Coast',    'name_es'=>'Costa de Marfil',        'code'=>'CIV','group_id'=>'E','group_pos'=>3,'flag'=>'🇨🇮'],
    ['id'=>20, 'name'=>'Ecuador',        'name_es'=>'Ecuador',               'code'=>'ECU','group_id'=>'E','group_pos'=>4,'flag'=>'🇪🇨'],
    // Group F
    ['id'=>21, 'name'=>'Netherlands',    'name_es'=>'Países Bajos',           'code'=>'NED','group_id'=>'F','group_pos'=>1,'flag'=>'🇳🇱'],
    ['id'=>22, 'name'=>'Japan',          'name_es'=>'Japón',                 'code'=>'JPN','group_id'=>'F','group_pos'=>2,'flag'=>'🇯🇵'],
    ['id'=>23, 'name'=>'Sweden',         'name_es'=>'Suecia',                'code'=>'SWE','group_id'=>'F','group_pos'=>3,'flag'=>'🇸🇪'],
    ['id'=>24, 'name'=>'Tunisia',        'name_es'=>'Túnez',                 'code'=>'TUN','group_id'=>'F','group_pos'=>4,'flag'=>'🇹🇳'],
    // Group G
    ['id'=>25, 'name'=>'Belgium',        'name_es'=>'Bélgica',               'code'=>'BEL','group_id'=>'G','group_pos'=>1,'flag'=>'🇧🇪'],
    ['id'=>26, 'name'=>'Egypt',          'name_es'=>'Egipto',                'code'=>'EGY','group_id'=>'G','group_pos'=>2,'flag'=>'🇪🇬'],
    ['id'=>27, 'name'=>'Iran',           'name_es'=>'Irán',                  'code'=>'IRN','group_id'=>'G','group_pos'=>3,'flag'=>'🇮🇷'],
    ['id'=>28, 'name'=>'New Zealand',    'name_es'=>'Nueva Zelanda',          'code'=>'NZL','group_id'=>'G','group_pos'=>4,'flag'=>'🇳🇿'],
    // Group H
    ['id'=>29, 'name'=>'Spain',          'name_es'=>'España',                'code'=>'ESP','group_id'=>'H','group_pos'=>1,'flag'=>'🇪🇸'],
    ['id'=>30, 'name'=>'Cape Verde',     'name_es'=>'Cabo Verde',             'code'=>'CPV','group_id'=>'H','group_pos'=>2,'flag'=>'🇨🇻'],
    ['id'=>31, 'name'=>'Saudi Arabia',   'name_es'=>'Arabia Saudita',         'code'=>'KSA','group_id'=>'H','group_pos'=>3,'flag'=>'🇸🇦'],
    ['id'=>32, 'name'=>'Uruguay',        'name_es'=>'Uruguay',               'code'=>'URU','group_id'=>'H','group_pos'=>4,'flag'=>'🇺🇾'],
    // Group I
    ['id'=>33, 'name'=>'France',         'name_es'=>'Francia',               'code'=>'FRA','group_id'=>'I','group_pos'=>1,'flag'=>'🇫🇷'],
    ['id'=>34, 'name'=>'Senegal',        'name_es'=>'Senegal',               'code'=>'SEN','group_id'=>'I','group_pos'=>2,'flag'=>'🇸🇳'],
    ['id'=>35, 'name'=>'Iraq',           'name_es'=>'Irak',                  'code'=>'IRQ','group_id'=>'I','group_pos'=>3,'flag'=>'🇮🇶'],
    ['id'=>36, 'name'=>'Norway',         'name_es'=>'Noruega',               'code'=>'NOR','group_id'=>'I','group_pos'=>4,'flag'=>'🇳🇴'],
    // Group J
    ['id'=>37, 'name'=>'Argentina',      'name_es'=>'Argentina',             'code'=>'ARG','group_id'=>'J','group_pos'=>1,'flag'=>'🇦🇷'],
    ['id'=>38, 'name'=>'Algeria',        'name_es'=>'Argelia',               'code'=>'ALG','group_id'=>'J','group_pos'=>2,'flag'=>'🇩🇿'],
    ['id'=>39, 'name'=>'Austria',        'name_es'=>'Austria',               'code'=>'AUT','group_id'=>'J','group_pos'=>3,'flag'=>'🇦🇹'],
    ['id'=>40, 'name'=>'Jordan',         'name_es'=>'Jordania',              'code'=>'JOR','group_id'=>'J','group_pos'=>4,'flag'=>'🇯🇴'],
    // Group K
    ['id'=>41, 'name'=>'Portugal',       'name_es'=>'Portugal',              'code'=>'POR','group_id'=>'K','group_pos'=>1,'flag'=>'🇵🇹'],
    ['id'=>42, 'name'=>'DR Congo',       'name_es'=>'RD Congo',              'code'=>'COD','group_id'=>'K','group_pos'=>2,'flag'=>'🇨🇩'],
    ['id'=>43, 'name'=>'Uzbekistan',     'name_es'=>'Uzbekistán',            'code'=>'UZB','group_id'=>'K','group_pos'=>3,'flag'=>'🇺🇿'],
    ['id'=>44, 'name'=>'Colombia',       'name_es'=>'Colombia',              'code'=>'COL','group_id'=>'K','group_pos'=>4,'flag'=>'🇨🇴'],
    // Group L
    ['id'=>45, 'name'=>'England',        'name_es'=>'Inglaterra',            'code'=>'ENG','group_id'=>'L','group_pos'=>1,'flag'=>'🏴󠁧󠁢󠁥󠁮󠁧󠁿'],
    ['id'=>46, 'name'=>'Croatia',        'name_es'=>'Croacia',               'code'=>'CRO','group_id'=>'L','group_pos'=>2,'flag'=>'🇭🇷'],
    ['id'=>47, 'name'=>'Ghana',          'name_es'=>'Ghana',                 'code'=>'GHA','group_id'=>'L','group_pos'=>3,'flag'=>'🇬🇭'],
    ['id'=>48, 'name'=>'Panama',         'name_es'=>'Panamá',                'code'=>'PAN','group_id'=>'L','group_pos'=>4,'flag'=>'🇵🇦'],
];

// ─────────────────────────────────────────────────────────────────
// Helper functions
// ─────────────────────────────────────────────────────────────────

function get_team_by_id(int $id): ?array {
    foreach (TEAMS as $t) {
        if ($t['id'] === $id) return $t;
    }
    return null;
}

function get_teams_map(): array {
    $map = [];
    foreach (TEAMS as $t) {
        $map[$t['id']] = $t;
    }
    return $map;
}

function get_teams_by_group(string $group_id): array {
    $result = [];
    foreach (TEAMS as $t) {
        if ($t['group_id'] === $group_id) $result[] = $t;
    }
    usort($result, fn($a,$b) => $a['group_pos'] - $b['group_pos']);
    return $result;
}

const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

const ROUND_LABELS = [
    'GROUP' => 'Group Stage',
    'R32'   => 'Round of 32',
    'R16'   => 'Round of 16',
    'QF'    => 'Quarterfinals',
    'SF'    => 'Semifinals',
    'THIRD' => '3rd/4th Place',
    'FINAL' => 'Final',
];

// Well-known players for autocomplete (golden boot/ball)
const KNOWN_PLAYERS = [
    'Kylian Mbappé','Erling Haaland','Lionel Messi','Cristiano Ronaldo',
    'Neymar Jr.','Vinicius Jr.','Rodri','Pedri','Lamine Yamal',
    'Jude Bellingham','Phil Foden','Harry Kane','Bukayo Saka',
    'Florian Wirtz','Jamal Musiala','Robert Lewandowski','Mohamed Salah',
    'Sadio Mané','Achraf Hakimi','Alphonso Davies','Son Heung-min',
    'Takumi Minamino','Darwin Núñez','Kaoru Mitoma','Martin Ødegaard',
    'Antoine Griezmann','Ousmane Dembélé','Marcus Thuram','Gabriel Martinelli',
    'Raphinha','Rúben Neves','Bernardo Silva','Bruno Fernandes','Diogo Jota',
    'Memphis Depay','Virgil van Dijk','Paulo Dybala','Nico Williams','Dani Olmo',
];
