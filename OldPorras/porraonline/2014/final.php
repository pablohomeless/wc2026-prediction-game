<body background="mundial_sudafrica_2010_wallpapers_3.jpg">

<?
include("dbinfo.inc.php");
mysql_connect($mydatabasehost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");
$query="SELECT * FROM final ORDER BY usuario";
$result=mysql_query($query);

$num=mysql_numrows($result); 

mysql_close();

echo "<b><center>Finalistas</center></b><br><br>";

?>
<center>
<table border='0' cellspacing='2' cellpadding='2' bgcolor='222222'>
<!--<table border="1" cellspacing="2" cellpadding="2">-->
<tr> 
<th><font face="Arial, Helvetica, sans-serif" color=red>Usuario</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Finalista 1</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Finalista 2</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Puntos</font></th>
</tr>

<?
$i=0;
$bgcolor = "#FFFFFF";
while ($i < $num) {
$usuario=mysql_result($result,$i,"usuario");
$final1=mysql_result($result,$i,"final1");
$final2=mysql_result($result,$i,"final2");
$puntos=mysql_result($result,$i,"puntos"); 
?>

<tr> 
<td bgcolor='#CCCCCC'><font face="Arial, Helvetica, sans-serif"><? echo "$usuario"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$final1"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$final2"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$puntos"; ?></font></td>
</tr>
<?
++$i;
} 
echo "</table>";


?>
</center>

</body>
