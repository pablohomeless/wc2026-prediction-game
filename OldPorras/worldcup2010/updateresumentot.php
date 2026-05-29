<?
include("dbinfo.inc.php");
mysql_connect(localhost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");


	$query="SELECT usuario,puntospartidos,puntosprimeros,puntoscuartos,puntossemis,puntosfinal,puntoscampeon,puntosgoleadores FROM resumen WHERE (usuario!='system')";
	$result=mysql_query($query);
	$numusers=mysql_numrows($result); 

	$k=0;
	while ($k < $numusers) {
		$usuario=mysql_result($result,$k,"usuario");
		$puntospartidos=mysql_result($result,$k,"puntospartidos");
		$puntosprimeros=mysql_result($result,$k,"puntosprimeros");
		$puntoscuartos=mysql_result($result,$k,"puntoscuartos");
		$puntossemis=mysql_result($result,$k,"puntossemis");
		$puntosfinal=mysql_result($result,$k,"puntosfinal");
		$puntoscampeon=mysql_result($result,$k,"puntoscampeon");
		$puntosgoleadores=mysql_result($result,$k,"puntosgoleadores");
		$puntostot=0;


		$puntostot = $puntospartidos + $puntosprimeros + $puntoscuartos + $puntossemis + $puntosfinal + $puntoscampeon + $puntosgoleadores;
		$query_update="UPDATE resumen SET puntostotales='$puntostot' WHERE (usuario='$usuario')";
		mysql_query($query_update);
		++$k;
	} 

mysql_close();
echo "<b>ACTUALIZACION FINALIZADA</b>";
?>
