<!--<body background="./images/emblem_yllow_l.jpg">-->
<?
include("dbinfo.inc.php");
include("gradient.inc");
mysql_connect(localhost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");
$query="SELECT * FROM `resumen` WHERE usuario <> 'system' GROUP BY usuario ORDER BY puntostotales DESC";
$result=mysql_query($query);

$num=mysql_numrows($result); 

mysql_close();

echo "<b><center>Resumen de Estado</center></b><br><br>";

?>
<center>
<table border='0' cellspacing='2' cellpadding='2' bgcolor='#ffffff'>
<tr> 
<th bgcolor='#dddddd'><font face="Arial, Helvetica, sans-serif" color=red>Usuario</font></th>
<!--<th><font face="Arial, Helvetica, sans-serif" color=red>Nombre</font></th>-->
<th bgcolor='#dddddd'><font face="Arial, Helvetica, sans-serif" color=red><a href="./primerafase.php">Ptos. Fase 1</a></font></th>
<th bgcolor='#dddddd'><font face="Arial, Helvetica, sans-serif" color=red><a href="./primerosgrupo.php">Ptos. Primeros</a></font></th>
<th bgcolor='#dddddd'><font face="Arial, Helvetica, sans-serif" color=red><a href="./cuartos.php">Ptos. Cuartos</a></font></th>
<th bgcolor='#dddddd'><font face="Arial, Helvetica, sans-serif" color=red><a href="./semis.php">Ptos. Semis</a></font></th>
<th bgcolor='#dddddd'><font face="Arial, Helvetica, sans-serif" color=red><a href="./final.php">Ptos. Final</a></font></th>
<th bgcolor='#dddddd'><font face="Arial, Helvetica, sans-serif" color=red><a href="./campeon.php">Ptos. Campeon</a></font></th>
<th bgcolor='#dddddd'><font face="Arial, Helvetica, sans-serif" color=red><a href="./goleadores.php">Ptos. Goleadores</a></font></th>
<th bgcolor='#dddddd'><font face="Arial, Helvetica, sans-serif" color=red>Ptos. Totales</font></th>
</tr>

<?
$i=0;
$bg_colors = gradient("00FF00","FF0000",$num);
while ($i < $num) {
//$bgcolor = $bg_colors[$i];
$bgcolor = "#00FF00";

$usuario=mysql_result($result,$i,"usuario");
$nombre=mysql_result($result,$i,"nombre");
$puntospartidos=mysql_result($result,$i,"puntospartidos");
$puntosprimeros=mysql_result($result,$i,"puntosprimeros");
$puntoscuartos=mysql_result($result,$i,"puntoscuartos");
$puntossemis=mysql_result($result,$i,"puntossemis");
$puntosfinal=mysql_result($result,$i,"puntosfinal"); 
$puntoscampeon=mysql_result($result,$i,"puntoscampeon"); 
$puntosgoleadores=mysql_result($result,$i,"puntosgoleadores"); 
$puntostotales=mysql_result($result,$i,"puntostotales"); 
?>

<tr> 
<td bgcolor='#dddddd'><font face="Arial, Helvetica, sans-serif"><? echo "$nombre"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$puntospartidos"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$puntosprimeros"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$puntoscuartos"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$puntossemis"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$puntosfinal"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$puntoscampeon"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$puntosgoleadores"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$puntostotales"; ?></font></td>
</tr>
<?
++$i;
} 
echo "</table>";


?>
</center>
</body>
