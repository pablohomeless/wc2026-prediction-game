<?
include("dbinfo.inc.php");
mysql_connect(localhost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");

	$query="SELECT grupoa,grupob,grupoc,grupod,grupoe,grupof,grupog,grupoh FROM primeros WHERE usuario='system'";
	$result=mysql_query($query);
	$grupoa=strtolower(mysql_result($result,$j,"grupoa"));
	$grupob=strtolower(mysql_result($result,$j,"grupob"));
	$grupoc=strtolower(mysql_result($result,$j,"grupoc"));
	$grupod=strtolower(mysql_result($result,$j,"grupod"));
	$grupoe=strtolower(mysql_result($result,$j,"grupoe"));
	$grupof=strtolower(mysql_result($result,$j,"grupof"));
	$grupog=strtolower(mysql_result($result,$j,"grupog"));
	$grupoh=strtolower(mysql_result($result,$j,"grupoh"));

	$querydos="SELECT usuario,grupoa,grupob,grupoc,grupod,grupoe,grupof,grupog,grupoh FROM primeros WHERE usuario!='system' order by usuario";
	$resultdos=mysql_query($querydos);
	$numdos=mysql_numrows($resultdos); 

	$j=0;
	while ($j < $numdos) {
		$puntos=0;
		$usuario= mysql_result($resultdos,$j,"usuario");
		$grupoa_usu=strtolower(mysql_result($resultdos,$j,"grupoa"));
		$grupob_usu=strtolower(mysql_result($resultdos,$j,"grupob"));
		$grupoc_usu=strtolower(mysql_result($resultdos,$j,"grupoc"));
		$grupod_usu=strtolower(mysql_result($resultdos,$j,"grupod"));
		$grupoe_usu=strtolower(mysql_result($resultdos,$j,"grupoe"));
		$grupof_usu=strtolower(mysql_result($resultdos,$j,"grupof"));
		$grupog_usu=strtolower(mysql_result($resultdos,$j,"grupog"));
		$grupoh_usu=strtolower(mysql_result($resultdos,$j,"grupoh"));
		if (strcmp($grupoa,$grupoa_usu)==0) {
			++$puntos;
		}
		if (strcmp($grupob,$grupob_usu)==0) {
			++$puntos;
		}
		if (strcmp($grupoc,$grupoc_usu)==0) {
			++$puntos;
		}
		if (strcmp($grupod,$grupod_usu)==0) {
			++$puntos;
		}
		if (strcmp($grupoe,$grupoe_usu)==0) {
			++$puntos;
		}
		if (strcmp($grupof,$grupof_usu)==0) {
			++$puntos;
		}
		if (strcmp($grupog,$grupog_usu)==0) {
			++$puntos;
		}
		if (strcmp($grupoh,$grupoh_usu)==0) {
			++$puntos;
		}
		$query_update="UPDATE primeros SET puntos='$puntos' WHERE usuario='$usuario'";
		echo "<br>USUARIO: $usuario PUNTOS $puntos -> $query_update"; 
		mysql_query($query_update);
		++$j;
	}
mysql_close();
echo "<br><br><b>ACTUALIZACION DE PRIMEROS DE GRUPO FINALIZADA</b>";
?>
