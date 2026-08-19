<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    die(json_encode(["success" => false, "message" => "Metode tidak valid"]));
}

try {
    // 1. Pendapatan Hari Ini
    $today = date('Y-m-d');
    $stmt = $conn->prepare("SELECT SUM(total) as total FROM transaksi WHERE DATE(created_at) = ?");
    $stmt->bind_param("s", $today);
    $stmt->execute();
    $res = $stmt->get_result();
    $pendapatanHari = (int)($res->fetch_assoc()['total'] ?? 0);
    $stmt->close();

    // 2. Pendapatan Bulan Ini
    $month = date('Y-m');
    $stmt = $conn->prepare("SELECT SUM(total) as total FROM transaksi WHERE DATE_FORMAT(created_at, '%Y-%m') = ?");
    $stmt->bind_param("s", $month);
    $stmt->execute();
    $res = $stmt->get_result();
    $pendapatanBulan = (int)($res->fetch_assoc()['total'] ?? 0);
    $stmt->close();

    // 3. Total Member
    $res = $conn->query("SELECT COUNT(*) as count FROM member");
    $totalMember = (int)($res->fetch_assoc()['count'] ?? 0);

    // 4. Total Produk & Stok Rendah
    $res = $conn->query("SELECT id, kode, nama, kategori, harga_beli, harga_jual, stok, stok_minimum, satuan FROM produk");
    $totalProduk = 0;
    $stokRendahList = [];

    if ($res && $res->num_rows > 0) {
        while($row = $res->fetch_assoc()) {
            $totalProduk++;
            if ((int)$row['stok'] <= (int)$row['stok_minimum']) {
                $stokRendahList[] = [
                    "id" => (int)$row['id'],
                    "kode" => $row['kode'],
                    "nama" => $row['nama'],
                    "kategori" => ["nama" => $row['kategori'], "ikon" => ""],
                    "hargaBeli" => (int)$row['harga_beli'],
                    "hargaJual" => (int)$row['harga_jual'],
                    "stok" => (int)$row['stok'],
                    "stokMinimum" => (int)$row['stok_minimum'],
                    "satuan" => $row['satuan']
                ];
            }
        }
    }

    // 5. Transaksi Terbaru (3 terakhir)
    $transaksiTerbaru = [];
    $res = $conn->query("SELECT no_faktur, total, metode_bayar, created_at FROM transaksi ORDER BY created_at DESC LIMIT 3");
    if ($res && $res->num_rows > 0) {
        while($row = $res->fetch_assoc()) {
            $transaksiTerbaru[] = [
                "noFaktur" => $row['no_faktur'],
                "total" => (int)$row['total'],
                "metodeBayar" => strtoupper($row['metode_bayar']),
                "createdAt" => str_replace(' ', 'T', $row['created_at'])
            ];
        }
    }

    $data = [
        "pendapatanHari" => $pendapatanHari,
        "pendapatanBulan" => $pendapatanBulan,
        "totalProduk" => $totalProduk,
        "stokRendahCount" => count($stokRendahList),
        "totalMember" => $totalMember,
        "stokRendah" => $stokRendahList,
        "transaksiTerbaru" => $transaksiTerbaru
    ];

    echo json_encode(["success" => true, "data" => $data]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();
?>
