<?php
    require '../PHPMailer/PHPMailerAutoload.php';
    $data = json_decode(file_get_contents("php://input"));
    $strangeremail = $data->strangerMail;
    $text = $data->text;
    $mail = new PHPMailer(); // create a new object
    $mail->IsSMTP(); // enable SMTP
    $mail->SMTPDebug = 1; // debugging: 1 = errors and messages, 2 = messages only
    $mail->SMTPAuth = true; // authentication enabled
    $mail->SMTPSecure = 'ssl'; // secure transfer enabled REQUIRED for GMail
    $mail->Host = "ehub23.webhostinghub.com";
    $mail->Port = 465; // or 587
    $mail->IsHTML(true);
    $mail->Username = "admin@pungme.com";
    $mail->Password = "12345678";
    $mail->SetFrom("admin@pungme.com");
    $mail->Subject = "You as a Stranger";
    $mail->Body = $text;
    $mail->AddAddress($strangeremail);

     if(!$mail->Send())
        {
        echo "Mailer Error: " . $mail->ErrorInfo;
        }
        else
        {
        echo "Message has been sent";
        }
?>