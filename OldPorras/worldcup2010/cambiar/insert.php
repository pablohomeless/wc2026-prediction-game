<?
include("dbinfo.inc.php");
mysql_connect("mysql10.000webhost.com",$username,$password);
@mysql_select_db($database) or die( "Unable to select database"); 

$query = "INSERT INTO contacts VALUES ('','$first','$last','$phone','$mobile','$fax','$email','$web')";
mysql_query($query);

mysql_close();
?> 
