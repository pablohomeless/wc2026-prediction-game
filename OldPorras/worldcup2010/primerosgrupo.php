<body background="./images/mundial_sudafrica_2010_wallpapers_3.jpg">

<?
include("dbinfo.inc.php");
mysql_connect(localhost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");
$query="SELECT * FROM primeros where usuario != 'system' ORDER BY usuario";
$result=mysql_query($query);

$num=mysql_numrows($result); 

mysql_close();

echo "<b><center>Primeros de Grupo</center></b><br><br>";

?>
<center>
<table border='0' cellspacing='2' cellpadding='2' bgcolor='222222'> 
<!-- <table border="1" cellspacing="2" cellpadding="2"> -->
<tr> 
<th><font face="Arial, Helvetica, sans-serif" color=red>Usuario</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Grupo A</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Grupo B</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Grupo C</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Grupo D</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Grupo E</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Grupo F</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Grupo G</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Grupo H</font></th>
<th><font face="Arial, Helvetica, sans-serif" color=red>Puntos</font></th>
</tr>

<?
$i=0;
$bgcolor = "#FFFFFF";
while ($i < $num) {
$usuario=mysql_result($result,$i,"usuario");
$grupoa=mysql_result($result,$i,"grupoa");
$grupoc=mysql_result($result,$i,"grupoc"); // cambiados grupo b y c!!
$grupob=mysql_result($result,$i,"grupob");
$grupod=mysql_result($result,$i,"grupod");
$grupoe=mysql_result($result,$i,"grupoe");
$grupof=mysql_result($result,$i,"grupof");
$grupog=mysql_result($result,$i,"grupog");
$grupoh=mysql_result($result,$i,"grupoh");
$puntos=mysql_result($result,$i,"puntos"); 

?>

<tr> 
<td bgcolor='#CCCCCC'><font face="Arial, Helvetica, sans-serif"><? echo "$usuario"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$grupoa"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$grupob"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$grupoc"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$grupod"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$grupoe"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$grupof"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$grupog"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$grupoh"; ?></font></td>
<td bgcolor='<?echo $bgcolor?>'><font face="Arial, Helvetica, sans-serif"><? echo "$puntos"; ?></font>&nbsp;</td>
</tr>
<?
++$i;
} 
echo "</table>";


?>
</center>

</body>
