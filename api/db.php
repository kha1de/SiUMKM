<?php
$host = "127.0.0.1";
$user = "root";
$pass = "";
$dbname = "db_siumkm";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    header("Content-Type: application/json; charset=UTF-8");
    die(json_encode(["success" => false, "message" => "Gagal konek ke database: " . $conn->connect_error]));
}
?>
