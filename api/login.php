<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die(json_encode(["success" => false, "message" => "Metode tidak valid"]));
}

$input = json_decode(file_get_contents('php://input'), true);
$email = trim($input['email'] ?? '');
$password = trim($input['password'] ?? '');

if (empty($email) || empty($password)) {
    die(json_encode(["success" => false, "message" => "Email dan password wajib diisi"]));
}

$stmt = $conn->prepare("SELECT `id`, `username`, `email`, `password`, `nama`, `role` FROM `users` WHERE `email` = ?");
if (!$stmt) {
    die(json_encode(["success" => false, "message" => "Kesalahan server: " . $conn->error]));
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $user = $result->fetch_assoc();
    if (password_verify($password, $user['password'])) {
        // Login sukses, generate token sederhana
        $token = md5($user['email'] . time());
        echo json_encode([
            "success" => true,
            "message" => "Login berhasil",
            "token" => $token,
            "user" => [
                "nama" => $user['nama'],
                "role" => $user['role']
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Email atau password salah!"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Email atau password salah!"]);
}

$stmt->close();
$conn->close();
?>
