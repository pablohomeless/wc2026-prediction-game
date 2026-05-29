<?
include("dbinfo.inc.php");
mysql_connect(localhost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");

$i=1;
$num=24;

while ($i <= $num) {
	$query="SELECT quiniela,goles1,goles2 FROM partidos WHERE (usuario='system' and idpartido=$i)";
	$result=mysql_query($query);
	$quiniela=mysql_result($result,0,"quiniela");
	$goles1=mysql_result($result,0,"goles1");
	$goles2=mysql_result($result,0,"goles2");
	$querydos="SELECT usuario,idpartido,quiniela,goles1,goles2 FROM partidos WHERE (idpartido=$i and usuario!='system') order by usuario";
	$resultdos=mysql_query($querydos);
	$numdos=mysql_numrows($resultdos); 

	$j=0;
	while ($j < $numdos) {
		$puntos=0;
		$usuario= mysql_result($resultdos,$j,"usuario");
		$quiniela_usu=mysql_result($resultdos,$j,"quiniela");
		$goles1_usu=mysql_result($resultdos,$j,"goles1");
		$goles2_usu=mysql_result($resultdos,$j,"goles2");
		if ($quiniela==$quiniela_usu) {
			++$puntos;
		}
		if (($goles1==$goles1_usu) && ($goles2==$goles2_usu) && ($quiniela!="")) {
			++$puntos;
		}
		$query_update="UPDATE partidos SET puntos='$puntos' WHERE (idpartido=$i and usuario='$usuario')";
		mysql_query($query_update);
		++$j;
	}
	++$i;
} 
mysql_close();
echo "<b>ACTUALIZACION FINALIZADA</b>";
?>
