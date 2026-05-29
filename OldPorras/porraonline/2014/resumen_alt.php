<!--<body background="./images/emblem_yllow_l.jpg">-->
<?
include("dbinfo.inc.php");
include("gradient.inc");
mysql_connect(localhost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");
$query="SELECT * FROM `resumen` WHERE usuario <> 'system' GROUP BY usuario ORDER BY puntostotales DESC";
$result=mysql_query($query);

$num=mysql_numrows($result); 

$querypercent="SELECT count(*) as resultpercent FROM `partidos` WHERE usuario='system' and goles1 is not NULL";
$resultpercent=mysql_query($querypercent);

$querypercentprimeros="SELECT count(*) as resultpercent FROM `primeros` WHERE usuario='PabloSanchez' and puntos is not NULL";
$resultpercentprimeros=mysql_query($querypercentprimeros);
$ptosmaxprimeros = mysql_result($resultpercentprimeros,0,"resultpercent");

$querypercentcuartos="SELECT count(*) as resultpercent FROM `cuartos` WHERE usuario='PabloSanchez' and puntos is not NULL";
$resultpercentcuartos=mysql_query($querypercentcuartos);
$ptosmaxcuartos = mysql_result($resultpercentcuartos,0,"resultpercent");

$querypercentsemis="SELECT count(*) as resultpercent FROM `semis` WHERE usuario='PabloSanchez' and puntos is not NULL";
$resultpercentsemis=mysql_query($querypercentsemis);
$ptosmaxsemis = mysql_result($resultpercentsemis,0,"resultpercent");

$querypercentfinal="SELECT count(*) as resultpercent FROM `final` WHERE usuario='PabloSanchez' and puntos is not NULL";
$resultpercentfinal=mysql_query($querypercentfinal);
$ptosmaxfinal = mysql_result($resultpercentfinal,0,"resultpercent");

$querypercentcampeon="SELECT count(*) as resultpercent FROM `campeon` WHERE usuario='PabloSanchez' and puntos is not NULL";
$resultpercentcampeon=mysql_query($querypercentcampeon);
$ptosmaxcampeon = 3 * mysql_result($resultpercentcampeon,0,"resultpercent");

$querypercentgoleadores="SELECT count(*) as resultpercent FROM `goleadores` WHERE usuario='PabloSanchez' and puntos is not NULL";
$resultpercentgoleadores=mysql_query($querypercentgoleadores);
$ptosmaxgoleadores = 3 * mysql_result($resultpercentgoleadores,0,"resultpercent");

mysql_close();

$ptosmaxprimerafase = 2 * mysql_result($resultpercent,0,"resultpercent");
$totpuntosmax = $ptosmaxprimerafase + $ptosmaxprimeros + $ptosmaxcuartos + $ptosmaxsemis + $ptosmaxfinal + $ptosmaxcampeon + $ptosmaxgoleadores;

echo "<b><center>Resumen de Estado</center></b><br><br>";

?>
<center>
<table border='0' cellspacing='2' cellpadding='2' bgcolor='#ffffff'>
<tr> 
<th bgcolor='#dddddd'><font face="Arial, Helvetica, sans-serif" color=red>Usuario</font></th>
<!--<th><font face="Arial, Helvetica, sans-serif" color=red>Nombre</font></th>-->
<th bgcolor='#dddddd'><font face="Arial, Helvetica, sans-serif" color=red><a href="./primerafase.php">Ptos. Fase 1 <br>(<? echo "$ptosmaxprimerafase"; ?> Ptos Jugados)</a></font></th>
<th bgcolor='#dddddd'><font face="Arial, Helvetica, sans-serif" color=red><a href="./primerosgrupo.php">Ptos. Primeros</a></font></th>
<th bgcolor='#dddddd'><font face="Arial, Helvetica, sans-serif" color=red><a href="./cuartos.php">Ptos. Cuartos</a></font></th>
<th bgcolor='#dddddd'><font face="Arial, Helvetica, sans-serif" color=red><a href="./semis.php">Ptos. Semis</a></font></th>
<th bgcolor='#dddddd'><font face="Arial, Helvetica, sans-serif" color=red><a href="./final.php">Ptos. Final</a></font></th>
<th bgcolor='#dddddd'><font face="Arial, Helvetica, sans-serif" color=red><a href="./campeon.php">Ptos. Campeon</a></font></th>
<th bgcolor='#dddddd'><font face="Arial, Helvetica, sans-serif" color=red><a href="./goleadores.php">Ptos. Goleadores</a></font></th>
<th bgcolor='#dddddd'><font face="Arial, Helvetica, sans-serif" color=red>Ptos. Totales (<? echo "$totpuntosmax"; ?> Ptos Jugados)</font></th>
</tr>

<?
$i=0;
$bg_colors = gradient("00FF00","FF0000",$num);
while ($i < $num) {
$bgcolor = $bg_colors[$i];
//$bgcolor = "#00FF00";

$usuario=mysql_result($result,$i,"usuario");
$nombre=mysql_result($result,$i,"nombre");
$puntospartidos=mysql_result($result,$i,"puntospartidos");
$tantoporcientopartidos=$num = number_format((($puntospartidos*100)/$ptosmaxprimerafase), 2, '.', '');
$puntosprimeros=mysql_result($result,$i,"puntosprimeros");
$puntoscuartos=mysql_result($result,$i,"puntoscuartos");
$puntossemis=mysql_result($result,$i,"puntossemis");
$puntosfinal=mysql_result($result,$i,"puntosfinal"); 
$puntoscampeon=mysql_result($result,$i,"puntoscampeon"); 
$puntosgoleadores=mysql_result($result,$i,"puntosgoleadores"); 
$puntostotales=mysql_result($result,$i,"puntostotales"); 
$tantoporcientototal=$num = number_format((($puntostotales*100)/$totpuntosmax), 2, '.', '');
?>

<tr> 
<td bgcolor='#dddddd'><font face="Arial, Helvetica, sans-serif"><? echo "$nombre"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$puntospartidos"; ?> (<? echo "$tantoporcientopartidos"; ?> %)</font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$puntosprimeros"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$puntoscuartos"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$puntossemis"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$puntosfinal"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$puntoscampeon"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$puntosgoleadores"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$puntostotales"; ?> (<? echo "$tantoporcientototal"; ?> %)</font></td>
</tr>
<?
++$i;
} 
echo "</table>";


?>
</center>
</body>
