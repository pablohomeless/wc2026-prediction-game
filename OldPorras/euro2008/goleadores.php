<?
include("dbinfo.inc.php");
mysql_connect(localhost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");
$query="SELECT * FROM goleadores ORDER BY usuario";
$result=mysql_query($query);

$num=mysql_numrows($result); 

mysql_close();

echo "<b><center>Goleadores</center></b><br><br>";

?>
<center>
<table border='0' cellspacing='2' cellpadding='2' bgcolor='222222'>
<tr> 
<th><font face="Arial, Helvetica, sans-serif" color=red>Usuario</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Goleador 1</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Goleador 2</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Goleador 3</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Puntos</font></th>
</tr>

<?
$i=0;
$bgcolor = "#FFFFFF";
while ($i < $num) {
$usuario=mysql_result($result,$i,"usuario");
$goleador1=mysql_result($result,$i,"goleador1");
$goleador2=mysql_result($result,$i,"goleador2");
$goleador3=mysql_result($result,$i,"goleador3");
$puntos=mysql_result($result,$i,"puntos"); 
?>

<tr> 
<td bgcolor='#CCCCCC'><font face="Arial, Helvetica, sans-serif"><? echo "$usuario"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$goleador1"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$goleador2"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$goleador3"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$puntos"; ?></font></td>
</tr>
<?
++$i;
} 
echo "</table>";


?>
</center>
