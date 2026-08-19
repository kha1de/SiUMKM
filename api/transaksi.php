<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Ambil daftar transaksi dari database, join dengan data member dan subquery untuk jumlah item
    $sql = "SELECT t.id, t.no_faktur, t.total, t.diskon, t.metode_bayar, t.created_at, 
                   COALESCE(m.nama, '-') as member_nama,
                   COALESCE((SELECT SUM(qty) FROM detail_transaksi WHERE transaksi_id = t.id), 0) as total_items
            FROM transaksi t
            LEFT JOIN member m ON t.member_id = m.id
            ORDER BY t.created_at DESC";
            
    $result = $conn->query($sql);
    
    $data = [];
    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $data[] = [
                "id" => (int)$row['id'],
                "noFaktur" => $row['no_faktur'],
                "total" => (int)$row['total'],
                "diskon" => (int)$row['diskon'],
                "metodeBayar" => strtoupper($row['metode_bayar']),
                "member" => $row['member_nama'],
                "items" => (int)$row['total_items'],
                "createdAt" => str_replace(' ', 'T', $row['created_at']),
                "status" => "lunas" // default status
            ];
        }
    }
    echo json_encode(["success" => true, "data" => $data]);

} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        die(json_encode(["success" => false, "message" => "Data tidak diterima"]));
    }
    
    $items = $input['items'] ?? [];
    if (empty($items) || !is_array($items)) {
        die(json_encode(["success" => false, "message" => "Keranjang belanja kosong atau tidak valid"]));
    }
    
    $diskon = (int)($input['diskon'] ?? 0);
    $metodeBayar = trim($input['metodeBayar'] ?? 'TUNAI');
    $memberId = !empty($input['memberId']) ? (int)$input['memberId'] : null;
    
    // Mulai Database Transaction untuk keamanan ACID
    $conn->begin_transaction();
    
    try {
        $subtotal = 0;
        $processedItems = [];
        
        // 1. Validasi produk dan hitung subtotal secara aman di sisi server
        foreach ($items as $item) {
            $produkId = (int)($item['produkId'] ?? 0);
            $qty = (int)($item['qty'] ?? 0);
            
            if ($produkId <= 0 || $qty <= 0) {
                throw new Exception("ID Produk atau kuantitas tidak valid");
            }
            
            // Ambil info produk
            $stmt = $conn->prepare("SELECT id, nama, harga_beli, harga_jual, stok FROM produk WHERE id = ?");
            $stmt->bind_param("i", $produkId);
            $stmt->execute();
            $pResult = $stmt->get_result();
            
            if ($pResult->num_rows === 0) {
                throw new Exception("Produk dengan ID $produkId tidak ditemukan");
            }
            
            $produk = $pResult->fetch_assoc();
            $stmt->close();
            
            if ($produk['stok'] < $qty) {
                throw new Exception("Stok tidak mencukupi untuk produk: " . $produk['nama'] . " (Sisa: " . $produk['stok'] . ")");
            }
            
            $subtotal += (int)$produk['harga_jual'] * $qty;
            $processedItems[] = [
                "id" => $produk['id'],
                "qty" => $qty,
                "harga_beli" => (int)$produk['harga_beli'],
                "harga_jual" => (int)$produk['harga_jual']
            ];
        }
        
        $total = $subtotal - $diskon;
        if ($total < 0) $total = 0;
        
        $noFaktur = 'INV-' . date('YmdHis');
        
        // 2. Simpan data transaksi utama
        $stmtTrans = $conn->prepare("INSERT INTO transaksi (member_id, no_faktur, total, diskon, metode_bayar) VALUES (?, ?, ?, ?, ?)");
        $stmtTrans->bind_param("isiis", $memberId, $noFaktur, $total, $diskon, $metodeBayar);
        
        if (!$stmtTrans->execute()) {
            throw new Exception("Gagal menyimpan transaksi: " . $stmtTrans->error);
        }
        
        $transaksiId = $conn->insert_id;
        $stmtTrans->close();
        
        // 3. Simpan detail transaksi dan kurangi stok
        $stmtDetail = $conn->prepare("INSERT INTO detail_transaksi (transaksi_id, produk_id, qty, harga_beli, harga_jual) VALUES (?, ?, ?, ?, ?)");
        $stmtStok = $conn->prepare("UPDATE produk SET stok = stok - ? WHERE id = ?");
        
        foreach ($processedItems as $pItem) {
            // detail_transaksi
            $stmtDetail->bind_param("iiiii", $transaksiId, $pItem['id'], $pItem['qty'], $pItem['harga_beli'], $pItem['harga_jual']);
            if (!$stmtDetail->execute()) {
                throw new Exception("Gagal menyimpan detail transaksi: " . $stmtDetail->error);
            }
            
            // update stok
            $stmtStok->bind_param("ii", $pItem['qty'], $pItem['id']);
            if (!$stmtStok->execute()) {
                throw new Exception("Gagal memperbarui stok produk: " . $stmtStok->error);
            }
        }
        
        $stmtDetail->close();
        $stmtStok->close();
        
        // 4. Update total transaksi member dan tambah poin loyalitas
        if ($memberId !== null) {
            // Skema Poin: 1 Poin setiap pembelanjaan Rp 10.000 (tidak termasuk diskon)
            $poinDitambah = floor($total / 10000);
            
            $stmtMember = $conn->prepare("UPDATE member SET total_transaksi = total_transaksi + 1, poin = poin + ? WHERE id = ?");
            $stmtMember->bind_param("ii", $poinDitambah, $memberId);
            if (!$stmtMember->execute()) {
                throw new Exception("Gagal memperbarui data poin member: " . $stmtMember->error);
            }
            $stmtMember->close();
        }
        
        // Commit jika semua sukses
        $conn->commit();
        echo json_encode(["success" => true, "message" => "Transaksi berhasil disimpan", "noFaktur" => $noFaktur]);
        
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}

$conn->close();
?>
