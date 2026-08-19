<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, PUT");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $conn->prepare("SELECT id, nama_toko, slogan, alamat_toko, kontak_toko, email_toko, ukuran_struk, footer_struk, rekening_bank, qris_image, qris_merchant FROM settings WHERE id = 1");
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if (!empty($row['rekening_bank'])) {
            $row['rekening_bank'] = json_decode($row['rekening_bank'], true);
        } else {
            $row['rekening_bank'] = [];
        }
        echo json_encode(["success" => true, "data" => $row]);
    } else {
        echo json_encode(["success" => true, "data" => ["nama_toko" => "SiUMKM", "rekening_bank" => []]]);
    }
    $stmt->close();

} elseif ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        die(json_encode(["success" => false, "message" => "Data tidak valid"]));
    }
    
    $namaToko = trim($input['nama_toko'] ?? 'SiUMKM');
    $slogan = trim($input['slogan'] ?? '');
    $alamatToko = trim($input['alamat_toko'] ?? '');
    $kontakToko = trim($input['kontak_toko'] ?? '');
    $emailToko = trim($input['email_toko'] ?? '');
    $ukuranStruk = trim($input['ukuran_struk'] ?? '58mm');
    $footerStruk = trim($input['footer_struk'] ?? '');
    $qrisImage = trim($input['qris_image'] ?? '');
    $qrisMerchant = trim($input['qris_merchant'] ?? '');
    
    $rekeningBank = isset($input['rekening_bank']) ? json_encode($input['rekening_bank']) : '[]';
    
    $check = $conn->query("SELECT id FROM settings WHERE id = 1");
    if ($check && $check->num_rows > 0) {
        $stmt = $conn->prepare("UPDATE settings SET 
            nama_toko=?, slogan=?, alamat_toko=?, kontak_toko=?, email_toko=?, 
            ukuran_struk=?, footer_struk=?, rekening_bank=?, qris_image=?, qris_merchant=? WHERE id = 1");
        $stmt->bind_param("ssssssssss", $namaToko, $slogan, $alamatToko, $kontakToko, $emailToko, $ukuranStruk, $footerStruk, $rekeningBank, $qrisImage, $qrisMerchant);
    } else {
        $stmt = $conn->prepare("INSERT INTO settings (id, nama_toko, slogan, alamat_toko, kontak_toko, email_toko, ukuran_struk, footer_struk, rekening_bank, qris_image, qris_merchant) 
                VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssssssss", $namaToko, $slogan, $alamatToko, $kontakToko, $emailToko, $ukuranStruk, $footerStruk, $rekeningBank, $qrisImage, $qrisMerchant);
    }
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Pengaturan berhasil disimpan"]);
    } else {
        echo json_encode(["success" => false, "message" => "Gagal menyimpan pengaturan: " . $stmt->error]);
    }
    $stmt->close();
}

$conn->close();
?>
