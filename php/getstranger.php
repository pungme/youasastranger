<?php

	require_once('get_db_connection.php');
    mysql_query("SET NAMES UTF8");

    $data = json_decode(file_get_contents("php://input"));
    $userID = $data->userId;

    $query = "SELECT * FROM strangers WHERE approved = '1' ORDER BY numsent Limit 1;";
    $result = mysql_query($query);
    $nbrows = mysql_num_rows($result);	
    if($nbrows>0){
        while($rec = mysql_fetch_assoc($result)){
            $arr[] = $rec;
        }
        $jsonresult = JEncode($arr);
        echo $jsonresult;
    } else {
        echo '{}';
    }


?>