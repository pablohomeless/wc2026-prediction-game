<body>
<?
include("dbinfo.inc.php");
mysql_connect(localhost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");

$query="SELECT * FROM partidos WHERE usuario = 'system' ORDER BY idpartido,usuario";
$result=mysql_query($query);
$num=mysql_numrows($result); 
$i=0;
while ($i < $num) {
  $idpartido=mysql_result($result,$i,"idpartido");
  $golesuno=mysql_result($result,$i,"goles1");
  $golesdos=mysql_result($result,$i,"goles2");
  $quiniela =mysql_result($result,$i,"quiniela");
  $resultado[$idpartido][0] = $quiniela;
  if (!empty($quiniela)) {
    $resultado[$idpartido][1] = $golesuno;
    $resultado[$idpartido][2] = $golesdos;
  } else {
    $resultado[$idpartido][1] = "";
    $resultado[$idpartido][2] = "";
  }
  $i++;
}


$query="SELECT * FROM partidos WHERE usuario != 'system' ORDER BY idpartido,usuario";
$result=mysql_query($query);
$num=mysql_numrows($result); 
mysql_close();



//echo "<b><center>Primera Fase</center></b><br><br>";

?>
<h1 align='center'>Primera Fase</h1>
<center>
<table border='0' cellspacing='2' cellpadding='2' bgcolor='222222'>
<tr> 
<th><font face="Arial, Helvetica, sans-serif" color=red>Partido</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Usuario</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Quiniela</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Goles Equipo 1</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Goles Equipo 2</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Puntos</font></th>
</tr>

<?
$i=0;
$idpartidobefore="";
while ($i < $num) {
$partido=mysql_result($result,$i,"partido");
$idpartido=mysql_result($result,$i,"idpartido");
$usuario=mysql_result($result,$i,"usuario");
$quiniela=mysql_result($result,$i,"quiniela");
$golesuno=mysql_result($result,$i,"goles1");
$golesdos=mysql_result($result,$i,"goles2");
$puntos=mysql_result($result,$i,"puntos"); 


if ($idpartido != $idpartidobefore) { 
  $color = "#000000";
  $bgcolor = "#AAAAAA";
?>

<!-- system -->
<tr> 
<td bgcolor='<?=$bgcolor;?>' align='center'><font face="Arial, Helvetica, sans-serif" color='<?=$color;?>'><strong><? echo $partido; ?></strong></font></td>
<td bgcolor='<?=$bgcolor;?>' align='center'><font face="Arial, Helvetica, sans-serif" color='<?=$color;?>'><strong><? echo "master"; ?></strong></font></td>
<td bgcolor='<?=$bgcolor;?>' align='center'><font face="Arial, Helvetica, sans-serif" color='<?=$color;?>'><strong><? echo $resultado[$idpartido][0]; ?></strong></font></td>
<td bgcolor='<?=$bgcolor;?>' align='center'><font face="Arial, Helvetica, sans-serif" color='<?=$color;?>'><strong><? echo $resultado[$idpartido][1]; ?></strong></font></td>
<td bgcolor='<?=$bgcolor;?>' align='center'><font face="Arial, Helvetica, sans-serif" color='<?=$color;?>'><strong><? echo $resultado[$idpartido][2]; ?></strong></font></td>
<td bgcolor='<?=$bgcolor;?>' align='center'><font face="Arial, Helvetica, sans-serif" color='<?=$color;?>'><strong>2</strong></font></td>
</tr>
<!-- system -->
<?
}
$idpartidobefore = $idpartido;
$color = "#000000";
if ($idpartido%2 > 0) $bgcolor = '#FFFFFF';
else $bgcolor = '#DDDDFF';
?>
<tr> 
<td bgcolor='<?=$bgcolor;?>' align='center'><font face="Arial, Helvetica, sans-serif" color='<?=$color;?>'><? echo "$partido"; ?></font></td>
<td bgcolor='<?=$bgcolor;?>' align='center'><font face="Arial, Helvetica, sans-serif" color='<?=$color;?>'><? echo "$usuario"; ?></font></td>
<td bgcolor='<?=$bgcolor;?>' align='center'><font face="Arial, Helvetica, sans-serif" color='<?=$color;?>'><? echo "$quiniela"; ?></font></td>
<td bgcolor='<?=$bgcolor;?>' align='center'><font face="Arial, Helvetica, sans-serif" color='<?=$color;?>'><? echo "$golesuno"; ?></font></td>
<td bgcolor='<?=$bgcolor;?>' align='center'><font face="Arial, Helvetica, sans-serif" color='<?=$color;?>'><? echo "$golesdos"; ?></font></td>
<td bgcolor='<?=$bgcolor;?>' align='center'><font face="Arial, Helvetica, sans-serif" color='<?=$color;?>'><? if (!empty($puntos)) echo "$puntos"; ?></font></td>
</tr>
<?
++$i;
} 
echo "</table>";


?>
</center>
</body>
