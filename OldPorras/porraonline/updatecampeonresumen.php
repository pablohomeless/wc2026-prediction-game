<?
include("dbinfo.inc.php");
$mydatabasehost = "mysql10.000webhost.com";
mysql_connect($mydatabasehost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");


	$query="SELECT usuario FROM campeon WHERE usuario!='system'";
	$result=mysql_query($query);
	$numusers=mysql_numrows($result); 

	$k=0;
	while ($k < $numusers) {
		$usuario=mysql_result($result,$k,"usuario");
		$querydos="";
		$querydos="SELECT puntos FROM campeon WHERE usuario='$usuario'";

		$resultdos=mysql_query($querydos);
		$numdos=mysql_numrows($resultdos); 

		$j=0;
		$puntostot=0;
		while ($j < $numdos) {
			$puntos=0;
			$puntos= mysql_result($resultdos,$j,"puntos");
			$puntostot = $puntostot + $puntos;
			++$j;
		}
		echo "UPDATE resumen SET puntoscampeon='$puntostot' WHERE (usuario='$usuario')<br>";
		$query_update="UPDATE resumen SET puntoscampeon='$puntostot' WHERE (usuario='$usuario')";
		mysql_query($query_update);
		++$k;
	} 

mysql_close();
echo "<b>ACTUALIZACION FINALIZADA</b>";
?>
