<?
include("dbinfo.inc.php");
mysql_connect(localhost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");
$query="SELECT * FROM cuartos ORDER BY usuario";
$result=mysql_query($query);

$num=mysql_numrows($result); 

mysql_close();

echo "<b><center>Cuartos de Final</center></b><br><br>";

?>
<center>
<!--<table border="1" cellspacing="2" cellpadding="2">-->
<table border='0' cellspacing='2' cellpadding='2' bgcolor='222222'>

<tr> 
<th><font face="Arial, Helvetica, sans-serif" color=red>Usuario</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Cuartos 1</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Cuartos 2</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Cuartos 3</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Cuartos 4</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Cuartos 5</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Cuartos 6</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Cuartos 7</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Cuartos 8</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Puntos</font></th>
</tr>

<?
$i=0;
$bgcolor = "#FFFFF";
while ($i < $num) {
$usuario=mysql_result($result,$i,"usuario");
$cuarto1=mysql_result($result,$i,"cuarto1");
$cuarto2=mysql_result($result,$i,"cuarto2");
$cuarto3=mysql_result($result,$i,"cuarto3");
$cuarto4=mysql_result($result,$i,"cuarto4");
$cuarto5=mysql_result($result,$i,"cuarto5");
$cuarto6=mysql_result($result,$i,"cuarto6");
$cuarto7=mysql_result($result,$i,"cuarto7");
$cuarto8=mysql_result($result,$i,"cuarto8");
$puntos=mysql_result($result,$i,"puntos"); 
?>

<tr> 
<td bgcolor='#CCCCCC'><font face="Arial, Helvetica, sans-serif"><? echo "$usuario"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$cuarto1"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$cuarto2"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$cuarto3"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$cuarto4"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$cuarto5"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$cuarto6"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$cuarto7"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$cuarto8"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$puntos"; ?></font></td>
</tr>
<?
++$i;
} 
echo "</table>";


?>
</center>
