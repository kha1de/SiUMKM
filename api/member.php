<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($method === 'GET') {
    $res = $conn->query("SELECT id, nama, telp, email, poin, total_transaksi, bergabung FROM member ORDER BY id DESC");
    
    $data = [];
    if ($res && $res->num_rows > 0) {
        while($row = $res->fetch_assoc()) {
            $data[] = [
                "id" => (int)$row['id'],
                "nama" => $row['nama'],
                "telp" => $row['telp'],
                "email" => $row['email'],
                "poin" => (int)$row['poin'],
                "totalTransaksi" => (int)($row['total_transaksi'] ?? 0),
                "bergabung" => $row['bergabung']
            ];
        }
    }
    echo json_encode(["success" => true, "data" => $data]);

} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $nama = trim($input['nama'] ?? '');
    $telp = trim($input['telp'] ?? '');
    $email = trim($input['email'] ?? '');
    $poin = (int)($input['poin'] ?? 0);
    $bergabung = date('Y-m-d');

    if (empty($nama)) {
        die(json_encode(["success" => false, "message" => "Nama wajib diisi"]));
    }

    $stmt = $conn->prepare("INSERT INTO member (nama, telp, email, poin, total_transaksi, bergabung) VALUES (?, ?, ?, ?, 0, ?)");
    $stmt->bind_param("sssis", $nama, $telp, $email, $poin, $bergabung);
            
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Berhasil menyimpan member"]);
    } else {
        echo json_encode(["success" => false, "message" => "Gagal menyimpan member: " . $stmt->error]);
    }
    $stmt->close();

} elseif ($method === 'PUT') {
    if ($id <= 0) {
        die(json_encode(["success" => false, "message" => "ID tidak valid"]));
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    $nama = trim($input['nama'] ?? '');
    $telp = trim($input['telp'] ?? '');
    $email = trim($input['email'] ?? '');
    $poin = (int)($input['poin'] ?? 0);

    $stmt = $conn->prepare("UPDATE member SET nama=?, telp=?, email=?, poin=? WHERE id=?");
    $stmt->bind_param("sssii", $nama, $telp, $email, $poin, $id);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Berhasil update member"]);
    } else {
        echo json_encode(["success" => false, "message" => "Gagal mengupdate member: " . $stmt->error]);
    }
    $stmt->close();

} elseif ($method === 'DELETE') {
    if ($id <= 0) {
        die(json_encode(["success" => false, "message" => "ID tidak valid"]));
    }
    
    $stmt = $conn->prepare("DELETE FROM member WHERE id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Berhasil menghapus member"]);
    } else {
        echo json_encode(["success" => false, "message" => "Gagal menghapus member: " . $stmt->error]);
    }
    $stmt->close();
}

$conn->close();
?>
