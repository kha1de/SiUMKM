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
    // 1. Total Pendapatan
    $resRev = $conn->query("SELECT SUM(total) as total FROM transaksi");
    $totalPendapatan = (int)($resRev->fetch_assoc()['total'] ?? 0);

    // 2. Total Pengeluaran (COGS berdasarkan barang terluar)
    $resExp = $conn->query("SELECT SUM(qty * harga_beli) as total FROM detail_transaksi");
    $totalPengeluaran = (int)($resExp->fetch_assoc()['total'] ?? 0);

    // 3. Laba Bersih
    $labaBersih = $totalPendapatan - $totalPengeluaran;

    // 4. Total Transaksi
    $resCount = $conn->query("SELECT COUNT(*) as count FROM transaksi");
    $totalTransaksi = (int)($resCount->fetch_assoc()['count'] ?? 0);

    // 5. Pendapatan & Laba 7 Hari Terakhir
    $days_map = [
        'Sunday' => 'Min',
        'Monday' => 'Sen',
        'Tuesday' => 'Sel',
        'Wednesday' => 'Rab',
        'Thursday' => 'Kam',
        'Friday' => 'Jum',
        'Saturday' => 'Sab'
    ];

    $chartData = [];
    for ($i = 6; $i >= 0; $i--) {
        $d = date('Y-m-d', strtotime("-$i days"));
        $dayEn = date('l', strtotime($d));
        $dayId = $days_map[$dayEn] ?? substr($dayEn, 0, 3);
        $chartData[$d] = [
            "day" => $dayId,
            "pendapatan" => 0,
            "laba" => 0
        ];
    }

    $sqlChart = "SELECT DATE(t.created_at) as tgl, 
                        SUM(t.total) as total_rev,
                        SUM(t.total - COALESCE((SELECT SUM(d.qty * d.harga_beli) FROM detail_transaksi d WHERE d.transaksi_id = t.id), 0)) as total_laba
                 FROM transaksi t
                 WHERE t.created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
                 GROUP BY DATE(t.created_at)";
    
    $resChart = $conn->query($sqlChart);
    if ($resChart) {
        while ($row = $resChart->fetch_assoc()) {
            $tgl = $row['tgl'];
            if (isset($chartData[$tgl])) {
                $chartData[$tgl]['pendapatan'] = (int)$row['total_rev'];
                $chartData[$tgl]['laba'] = (int)$row['total_laba'];
            }
        }
    }

    // 6. Produk Terlaris
    $sqlTop = "SELECT p.nama, SUM(d.qty) as total_qty
               FROM detail_transaksi d
               JOIN produk p ON d.produk_id = p.id
               GROUP BY d.produk_id
               ORDER BY total_qty DESC
               LIMIT 5";
    $resTop = $conn->query($sqlTop);
    
    $topProdukRaw = [];
    $maxQty = 0;
    if ($resTop) {
        while ($row = $resTop->fetch_assoc()) {
            $qty = (int)$row['total_qty'];
            if ($qty > $maxQty) $maxQty = $qty;
            $topProdukRaw[] = [
                "nama" => $row['nama'],
                "qty" => $qty
            ];
        }
    }

    $topProduk = [];
    foreach ($topProdukRaw as $tp) {
        $pct = $maxQty > 0 ? round(($tp['qty'] / $maxQty) * 100) : 0;
        $topProduk[] = [
            "nama" => $tp['nama'],
            "pct" => $pct
        ];
    }

    // fallback jika belum ada data
    if (empty($topProduk)) {
        $topProduk = [
            ["nama" => "Belum Ada Data", "pct" => 0]
        ];
    }

    echo json_encode([
        "success" => true,
        "data" => [
            "totalPendapatan" => $totalPendapatan,
            "totalPengeluaran" => $totalPengeluaran,
            "labaBersih" => $labaBersih,
            "totalTransaksi" => $totalTransaksi,
            "chart" => array_values($chartData),
            "topProduk" => $topProduk
        ]
    ]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();
?>
