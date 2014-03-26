<?php

    require_once('get_db_connection.php');


    $data = json_decode(file_get_contents("php://input"));
    $imgsrc = $data->base64data;
    $email = $data->email;
    //echo $imgsrc; 

    $filename = uniqid() . '.png';
	$filepath = "../img/" . $filename;
	$success = file_put_contents($filepath, base64_decode($imgsrc));
    
    $query = "INSERT INTO strangers (`email`, `imgpath` ,`approved`) VALUES ('".$email."', '".$filename."','1');";
    //TODO: if email already exist, update img path instead
    $result = mysql_query($query);
    
    $id = mysql_insert_id();
       
    echo $id; // return id

?>