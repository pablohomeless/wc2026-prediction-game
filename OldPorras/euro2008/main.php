<style type="text/css">
  td { font-family: Verdana, sans-serif; font-size: 11px; }
</style>
<body background="./images/emblem_yllow_l.jpg">
<?
include("dbinfo.inc.php");
include("gradient.inc.php");
mysql_connect(localhost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");
$querytot="SELECT usuario, sum( totaluno ) AS total FROM ( SELECT usuario, sum( puntos ) AS totaluno FROM partidos WHERE usuario <> 'system' GROUP BY partidos.usuario UNION SELECT usuario, sum( puntos ) AS totaluno FROM primeros WHERE usuario <> 'system' GROUP BY primeros.usuario ) TOTALSUM GROUP BY usuario ORDER BY total DESC";
$resulttot=mysql_query($querytot);
$num=mysql_numrows($resulttot);


?>
<h1 align='center'>Clasificacion General </h1><br>
<center>
<table border="0" cellspacing="2" cellpadding="2" bgcolor='#222222'>
<tr bgcolor='#AAAAAA'> 
<th><font face="Arial, Helvetica, sans-serif" color=red>Posicion</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Usuario</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red><a href="./primerafase.php">Ptos. Fase 1</a></font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red><a href="./primerosgrupo.php">Ptos. Primeros</a></font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red><a href="./cuartos.php">Ptos. Cuartos</a></font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red><a href="./semis.php">Ptos. Semis</a></font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red><a href="./final.php">Ptos. Final</a></font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red><a href="./campeon.php">Ptos. Campeon</a></font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red><a href="./goleadores.php">Ptos. Goleadores</a></font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Ptos. Totales</font></th>
</tr>

<?
$i=0;
$bg_colors = gradient("00FF00","FF0000",$num);
while ($i < $num) {
  $bgcolor = $bg_colors[$i];
  $usuario=mysql_result($resulttot,$i,"usuario");
  $puntostot=mysql_result($resulttot,$i,"total");

  $query="SELECT sum( puntos ) AS total_pf FROM `partidos` WHERE usuario <> 'system' and usuario='$usuario'";
  $result_pf=mysql_query($query);
  $puntospartidos=mysql_result($result_pf,0,0);

  $querydos="SELECT sum( puntos ) AS total_pg FROM `primeros` WHERE usuario <> 'system' and usuario='$usuario'";
  $resultdos=mysql_query($querydos);
  $puntosprimeros=mysql_result($resultdos,0,0);


?>

<tr bgcolor='ffffff'> 
<td align='right' bgcolor='<?=$bgcolor;?>'><font face="Arial, Helvetica, sans-serif"><? echo $i+1; ?></font></td>
<td bgcolor='<?=$bgcolor;?>'><font face="Arial, Helvetica, sans-serif"><? echo "$usuario"; ?></font></td>
<td bgcolor='<?=$bgcolor;?>'><font face="Arial, Helvetica, sans-serif"><? echo "$puntospartidos"; ?></font></td>
<td bgcolor='<?=$bgcolor;?>'><font face="Arial, Helvetica, sans-serif"><? echo "$puntosprimeros"; ?></font></td>
<td bgcolor='<?=$bgcolor;?>'><font face="Arial, Helvetica, sans-serif">&nbsp;</font></td>
<td bgcolor='<?=$bgcolor;?>'><font face="Arial, Helvetica, sans-serif">&nbsp;</font></td>
<td bgcolor='<?=$bgcolor;?>'><font face="Arial, Helvetica, sans-serif">&nbsp;</font></td>
<td bgcolor='<?=$bgcolor;?>'><font face="Arial, Helvetica, sans-serif">&nbsp;</font></td>
<td bgcolor='<?=$bgcolor;?>'><font face="Arial, Helvetica, sans-serif">&nbsp;</font></td>
<td bgcolor='<?=$bgcolor;?>'><font face="Arial, Helvetica, sans-serif"><? echo "$puntostot"; ?></font></td>
</tr>
<?
++$i;
} 
echo "</table>";

mysql_close();

?>
</center>
</body>
