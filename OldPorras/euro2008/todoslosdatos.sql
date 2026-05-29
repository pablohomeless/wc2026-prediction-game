CREATE TABLE `partidos` (
`idpartido` INT NOT NULL ,
`partido` VARCHAR( 100 ) NOT NULL ,
`usuario` VARCHAR( 100 ) NOT NULL ,
`quiniela` VARCHAR( 1 ) NOT NULL ,
`goles1` INT NULL ,
`goles2` INT NULL ,
`puntos` INT NULL
) ENGINE = MYISAM COMMENT = 'partidos';

CREATE TABLE `primeros` (
`usuario` VARCHAR( 100 ) NOT NULL ,
`grupoa` VARCHAR( 100 ) NULL ,
`grupob` VARCHAR( 100 ) NULL ,
`grupoc` VARCHAR( 100 ) NULL ,
`grupod` VARCHAR( 100 ) NULL ,
`puntos` INT NULL
) ENGINE = MYISAM COMMENT = 'primeros de grupo';

CREATE TABLE `cuartos` (
`usuario` VARCHAR( 100 ) NOT NULL ,
`cuarto1` VARCHAR( 100 ) NULL ,
`cuarto2` VARCHAR( 100 ) NULL ,
`cuarto3` VARCHAR( 100 ) NULL ,
`cuarto4` VARCHAR( 100 ) NULL ,
`cuarto5` VARCHAR( 100 ) NULL ,
`cuarto6` VARCHAR( 100 ) NULL ,
`cuarto7` VARCHAR( 100 ) NULL ,
`cuarto8` VARCHAR( 100 ) NULL ,
`puntos` INT NULL
) ENGINE = MYISAM COMMENT = 'cuartofinalistas';

CREATE TABLE `semis` (
`usuario` VARCHAR( 100 ) NOT NULL ,
`semi1` VARCHAR( 100 ) NULL ,
`semi2` VARCHAR( 100 ) NULL ,
`semi3` VARCHAR( 100 ) NULL ,
`semi4` VARCHAR( 100 ) NULL ,
`puntos` INT NULL
) ENGINE = MYISAM COMMENT = 'semifinalistas';

CREATE TABLE `final` (
`usuario` VARCHAR( 100 ) NOT NULL ,
`final1` VARCHAR( 100 ) NULL ,
`final2` VARCHAR( 100 ) NULL ,
`puntos` INT NULL
) ENGINE = MYISAM COMMENT = 'finalistas';

CREATE TABLE `campeon` (
`usuario` VARCHAR( 100 ) NOT NULL ,
`campeon` VARCHAR( 100 ) NULL ,
`puntos` INT NULL
) ENGINE = MYISAM COMMENT = 'campeon';

CREATE TABLE `goleadores` (
`usuario` VARCHAR( 100 ) NOT NULL ,
`goleador1` VARCHAR( 100 ) NULL ,
`goleador2` VARCHAR( 100 ) NULL ,
`goleador3` VARCHAR( 100 ) NULL ,
`puntos` INT NULL
) ENGINE = MYISAM COMMENT = 'goleadores';


CREATE TABLE `resumen` (
`usuario` VARCHAR( 100 ) NOT NULL ,
`nombre` VARCHAR( 200 ) NOT NULL ,
`puntospartidos` INT NULL ,
`puntosprimeros` INT NULL ,
`puntoscuartos` INT NULL ,
`puntossemis` INT NULL ,
`puntosfinal` INT NULL ,
`puntoscampeon` INT NULL ,
`puntosgoleadores` INT NULL ,
`puntostotales` INT NULL
) ENGINE = MYISAM COMMENT = 'resumen';
