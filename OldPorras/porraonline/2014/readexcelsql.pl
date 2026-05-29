#!/usr/bin/perl -w

use strict;
use Spreadsheet::ParseExcel;

my $oExcel = new Spreadsheet::ParseExcel;

die "Usage: $0 <file> <username>\n" unless $#ARGV == 1;

my $oBook = $oExcel->Parse($ARGV[0]);
my($iR, $iC, $oWkS, $oWkC, $casa, $visit, $quin, $idpartido,$sql,$partido);
for(my $iSheet=0; $iSheet < $oBook->{SheetCount} ; $iSheet++)
{
 $oWkS = $oBook->{Worksheet}[$iSheet];
 #print "--------- SHEET:", $oWkS->{Name}, "\n";
 if ($oWkS->{Name} ne "PARTIDOS") {
	next;
 }
 $idpartido = 0;
 for($iR = 6 ; $iR <= 53; $iR++)
  {
   $idpartido++;
   $casa = "NULL";
   $visit = "NULL";
   $quin = "";

   
   $partido = $oWkS->{Cells}[$iR][4]->Value;
   $casa = 0 if ($oWkS->{Cells}[$iR][9]->Value =~ /\w/);
   $casa = 1 if ($oWkS->{Cells}[$iR][10]->Value =~ /\w/);
   $casa = 2 if ($oWkS->{Cells}[$iR][11]->Value =~ /\w/);
   $casa = 3 if ($oWkS->{Cells}[$iR][12]->Value =~ /\w/);

   $visit = 0 if ($oWkS->{Cells}[$iR][13]->Value =~ /\w/);
   $visit = 1 if ($oWkS->{Cells}[$iR][14]->Value =~ /\w/);
   $visit = 2 if ($oWkS->{Cells}[$iR][15]->Value =~ /\w/);
   $visit = 3 if ($oWkS->{Cells}[$iR][16]->Value =~ /\w/);

   $quin = 1 if ($oWkS->{Cells}[$iR][6]->Value =~ /\w/);
   $quin = "X" if ($oWkS->{Cells}[$iR][7]->Value =~ /\w/);
   $quin = 2 if ($oWkS->{Cells}[$iR][8]->Value =~ /\w/);

   #print $oWkC->Value."\t".$quin."\t".$casa."\t".$visit."\n";
   $sql = "INSERT INTO partidos VALUES ('$idpartido','$partido','$ARGV[1]','$quin',$casa,$visit,NULL);";
   print "$sql\n";
  }

  print "\#-------------------------------------------\n";
  $sql = "INSERT INTO primeros VALUES (". 
  	"'".$ARGV[1]."',".
    	"'".$oWkS->{Cells}[56][4]->Value."',".
    	"'".$oWkS->{Cells}[57][4]->Value."',".
    	"'".$oWkS->{Cells}[58][4]->Value."',".
    	"'".$oWkS->{Cells}[59][4]->Value."',".
    	"'".$oWkS->{Cells}[60][4]->Value."',".
    	"'".$oWkS->{Cells}[61][4]->Value."',".
    	"'".$oWkS->{Cells}[62][4]->Value."',".
    	"'".$oWkS->{Cells}[63][4]->Value."',".
	"NULL);";
  print "$sql\n";

  $sql = "INSERT INTO cuartos VALUES (". 
  	"'".$ARGV[1]."',".
    	"'".$oWkS->{Cells}[66][4]->Value."',".
    	"'".$oWkS->{Cells}[67][4]->Value."',".
    	"'".$oWkS->{Cells}[68][4]->Value."',".
    	"'".$oWkS->{Cells}[69][4]->Value."',".
    	"'".$oWkS->{Cells}[70][4]->Value."',".
    	"'".$oWkS->{Cells}[71][4]->Value."',".
    	"'".$oWkS->{Cells}[72][4]->Value."',".
    	"'".$oWkS->{Cells}[73][4]->Value."',".
	"NULL);";
  print "$sql\n";

  $sql = "INSERT INTO semis VALUES (". 
  	"'".$ARGV[1]."',".
    	"'".$oWkS->{Cells}[76][4]->Value."',".
    	"'".$oWkS->{Cells}[77][4]->Value."',".
    	"'".$oWkS->{Cells}[78][4]->Value."',".
    	"'".$oWkS->{Cells}[79][4]->Value."',".
	"NULL);";
  print "$sql\n";

  $sql = "INSERT INTO final VALUES (". 
  	"'".$ARGV[1]."',".
    	"'".$oWkS->{Cells}[82][4]->Value."',".
    	"'".$oWkS->{Cells}[83][4]->Value."',".
	"NULL);";
  print "$sql\n";

  $sql = "INSERT INTO campeon VALUES (". 
  	"'".$ARGV[1]."',".
    	"'".$oWkS->{Cells}[86][4]->Value."',".
	"NULL);";
  print "$sql\n";

  $sql = "INSERT INTO goleadores VALUES (". 
  	"'".$ARGV[1]."',".
    	"'".$oWkS->{Cells}[89][4]->Value."',".
    	"'".$oWkS->{Cells}[90][4]->Value."',".
    	"'".$oWkS->{Cells}[91][4]->Value."',".
	"NULL);";
  print "$sql\n";

  $sql = "INSERT INTO resumen VALUES (".
        "'".$ARGV[1]."',".
        "'".$ARGV[1]."',".
	"NULL,".
	"NULL,".
	"NULL,".
	"NULL,".
	"NULL,".
	"NULL,".
	"NULL,".
        "NULL);";
  print "$sql\n";

  
}


