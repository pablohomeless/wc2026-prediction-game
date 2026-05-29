<body background="world_cup_2010_gold.jpg">
<?
include("dbinfo.inc.php");
mysql_connect($mydatabasehost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");
$query="SELECT * FROM campeon ORDER BY usuario";
$result=mysql_query($query);

$num=mysql_numrows($result); 

mysql_close();

echo "<b><center>Campeon</center></b><br><br>";

?>
<center>
<table border='0' cellspacing='2' cellpadding='2' bgcolor='222222'>
<tr> 
<th><font face="Arial, Helvetica, sans-serif" color=red>Usuario</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Campeon</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Puntos</font></th>
</tr>

<?
$i=0;
$bgcolor = "#FFFFFF";
while ($i < $num) {
$usuario=mysql_result($result,$i,"usuario");
$campeon=mysql_result($result,$i,"campeon");
$puntos=mysql_result($result,$i,"puntos"); 
?>

<tr> 
<td bgcolor='#CCCCCC'><font face="Arial, Helvetica, sans-serif"><? echo "$usuario"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$campeon"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$puntos"; ?></font></td>
</tr>
<?
++$i;
} 
echo "</table>";


?>
</center>
</body>
