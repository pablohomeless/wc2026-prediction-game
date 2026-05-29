<?
include("dbinfo.inc.php");
mysql_connect(localhost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");
$query="SELECT * FROM semis ORDER BY usuario";
$result=mysql_query($query);

$num=mysql_numrows($result); 

mysql_close();

echo "<b><center>Semifinalistas</center></b><br><br>";

?>
<center>
<table border='0' cellspacing='2' cellpadding='2' bgcolor='222222'>
<!--<table border="1" cellspacing="2" cellpadding="2">-->
<tr> 
<th><font face="Arial, Helvetica, sans-serif" color=red>Usuario</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Semis 1</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Semis 2</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Semis 3</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Semis 4</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Puntos</font></th>
</tr>

<?
$i=0;
$bgcolor = "#FFFFFF";
while ($i < $num) {
$usuario=mysql_result($result,$i,"usuario");
$semi1=mysql_result($result,$i,"semi1");
$semi2=mysql_result($result,$i,"semi2");
$semi3=mysql_result($result,$i,"semi3");
$semi4=mysql_result($result,$i,"semi4");
$puntos=mysql_result($result,$i,"puntos"); 
?>

<tr> 
<td bgcolor='#CCCCC'><font face="Arial, Helvetica, sans-serif"><? echo "$usuario"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$semi1"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$semi2"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$semi3"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$semi4"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$puntos"; ?></font></td>
</tr>
<?
++$i;
} 
echo "</table>";


?>
</center>
