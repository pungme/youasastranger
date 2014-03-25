<?php

    $dbhost = 'localhost';
    $dbuser = 'root';
    $dbpass = '';
    $conn = mysql_connect($dbhost, $dbuser, $dbpass);

    if(! $conn ){
      die('Could not connect: ' . mysql_error());
    }

    mysql_select_db("youasastranger");

	function JEncode($arr){
		if (version_compare(PHP_VERSION,"5.2","<"))
		{    
			require_once("./JSON.php");   //if php<5.2 need JSON class
			$json = new Services_JSON();  //instantiate new json object
			$data=$json->encode($arr);    //encode the data in json format
		} else
		{
			$data = json_encode($arr);    //encode the data in json format
		}
		return $data;
	}

?>