<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($method === 'GET') {
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    
    if ($search !== '') {
        $likeSearch = "%" . $search . "%";
        $stmt = $conn->prepare("SELECT id, kode, nama, kategori, harga_beli, harga_jual, stok, stok_minimum, satuan, deskripsi, gambar FROM produk WHERE nama LIKE ? OR kode LIKE ? ORDER BY id DESC");
        $stmt->bind_param("ss", $likeSearch, $likeSearch);
    } else {
        $stmt = $conn->prepare("SELECT id, kode, nama, kategori, harga_beli, harga_jual, stok, stok_minimum, satuan, deskripsi, gambar FROM produk ORDER BY id DESC");
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $data = [];
    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $data[] = [
                "id" => (int)$row['id'],
                "kode" => $row['kode'],
                "nama" => $row['nama'],
                "kategori" => [
                    "nama" => $row['kategori'] ?? 'Umum',
                    "ikon" => ""
                ],
                "hargaBeli" => (int)$row['harga_beli'],
                "hargaJual" => (int)$row['harga_jual'],
                "stok" => (int)$row['stok'],
                "stokMinimum" => (int)$row['stok_minimum'],
                "satuan" => $row['satuan'],
                "deskripsi" => $row['deskripsi'],
                "gambar" => $row['gambar']
            ];
        }
    }
    $stmt->close();
    echo json_encode(["success" => true, "data" => $data]);

} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        die(json_encode(["success" => false, "message" => "Data tidak diterima"]));
    }
    
    $kode = trim($input['kode'] ?? '');
    if (empty($kode)) {
        $kode = 'P' . time();
    }
    $nama = trim($input['nama'] ?? '');
    
    $kategori = 'Umum';
    if (isset($input['kategori'])) {
        if (is_array($input['kategori'])) {
            $kategori = $input['kategori']['nama'] ?? 'Umum';
        } else {
            $kategori = $input['kategori'];
        }
    }
    $kategori = trim($kategori);
    
    $hargaBeli = (int)($input['hargaBeli'] ?? 0);
    $hargaJual = (int)($input['hargaJual'] ?? 0);
    $stok = (int)($input['stok'] ?? 0);
    $stokMinimum = (int)($input['stokMinimum'] ?? 5);
    $satuan = trim($input['satuan'] ?? 'pcs');
    $deskripsi = trim($input['deskripsi'] ?? '');
    $gambar = trim($input['gambar'] ?? '');

    $stmt = $conn->prepare("INSERT INTO produk (kode, nama, kategori, harga_beli, harga_jual, stok, stok_minimum, satuan, deskripsi, gambar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssiijisss", $kode, $nama, $kategori, $hargaBeli, $hargaJual, $stok, $stokMinimum, $satuan, $deskripsi, $gambar);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Berhasil simpan produk"]);
    } else {
        echo json_encode(["success" => false, "message" => "Gagal menyimpan produk: " . $stmt->error]);
    }
    $stmt->close();

} elseif ($method === 'PUT') {
    if ($id <= 0) {
        die(json_encode(["success" => false, "message" => "ID tidak valid"]));
    }

    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        die(json_encode(["success" => false, "message" => "Data update tidak valid"]));
    }
    
    $kode = trim($input['kode'] ?? '');
    $nama = trim($input['nama'] ?? '');
    
    $kategori = 'Umum';
    if (isset($input['kategori'])) {
        if (is_array($input['kategori'])) {
            $kategori = $input['kategori']['nama'] ?? 'Umum';
        } else {
            $kategori = $input['kategori'];
        }
    }
    $kategori = trim($kategori);

    $hargaBeli = (int)($input['hargaBeli'] ?? 0);
    $hargaJual = (int)($input['hargaJual'] ?? 0);
    $stok = (int)($input['stok'] ?? 0);
    $stokMinimum = (int)($input['stokMinimum'] ?? 5);
    $satuan = trim($input['satuan'] ?? 'pcs');
    $deskripsi = trim($input['deskripsi'] ?? '');
    
    if (isset($input['gambar'])) {
        $gambar = trim($input['gambar']);
        $stmt = $conn->prepare("UPDATE produk SET kode=?, nama=?, kategori=?, harga_beli=?, harga_jual=?, stok=?, stok_minimum=?, satuan=?, deskripsi=?, gambar=? WHERE id=?");
        $stmt->bind_param("sssiijisssi", $kode, $nama, $kategori, $hargaBeli, $hargaJual, $stok, $stokMinimum, $satuan, $deskripsi, $gambar, $id);
    } else {
        $stmt = $conn->prepare("UPDATE produk SET kode=?, nama=?, kategori=?, harga_beli=?, harga_jual=?, stok=?, stok_minimum=?, satuan=?, deskripsi=? WHERE id=?");
        $stmt->bind_param("sssiijissi", $kode, $nama, $kategori, $hargaBeli, $hargaJual, $stok, $stokMinimum, $satuan, $deskripsi, $id);
    }
            
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Berhasil update"]);
    } else {
        echo json_encode(["success" => false, "message" => "Gagal update produk: " . $stmt->error]);
    }
    $stmt->close();

} elseif ($method === 'DELETE') {
    if ($id <= 0) {
        die(json_encode(["success" => false, "message" => "ID tidak valid"]));
    }
    
    $stmt = $conn->prepare("DELETE FROM produk WHERE id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Berhasil hapus"]);
    } else {
        echo json_encode(["success" => false, "message" => "Gagal menghapus produk: " . $stmt->error]);
    }
    $stmt->close();
}

$conn->close();
?>
