<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die(json_encode(["success" => false, "message" => "Metode tidak valid"]));
}

if (!isset($_FILES['image'])) {
    die(json_encode(["success" => false, "message" => "File tidak ditemukan"]));
}

$file = $_FILES['image'];
$targetDir = "../uploads/";

if (!is_dir($targetDir)) {
    mkdir($targetDir, 0777, true);
}

$imageFileType = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
$validExtensions = ["jpg", "jpeg", "png"];
if (!in_array($imageFileType, $validExtensions)) {
    die(json_encode(["success" => false, "message" => "Hanya JPG, JPEG, dan PNG yang diperbolehkan"]));
}

// Penamaan file upload (default: produk_<timestamp>.<ext>)
$prefix = "produk";
if (isset($_POST['type']) && $_POST['type'] === 'qris') {
    $prefix = "qris";
}

$newFileName = $prefix . "_" . time() . "." . $imageFileType;
$targetFile = $targetDir . $newFileName;

if (move_uploaded_file($file["tmp_name"], $targetFile)) {
    echo json_encode([
        "success" => true, 
        "message" => "Berhasil diunggah", 
        "url" => "uploads/" . $newFileName
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Gagal menyimpan file"]);
}
?>
