<?php
header("Content-Type: text/plain; charset=UTF-8");

$host = "127.0.0.1";
$user = "root";
$pass = "";
$dbname = "db_siumkm";

echo "=== MEMULAI MIGRASI DATABASE ===\n";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error . "\n");
}

// 1. Tambah kolom member_id ke tabel transaksi jika belum ada
$res = $conn->query("SHOW COLUMNS FROM `transaksi` LIKE 'member_id'");
if ($res && $res->num_rows == 0) {
    if ($conn->query("ALTER TABLE `transaksi` ADD COLUMN `member_id` INT NULL DEFAULT NULL AFTER `id`")) {
        echo "[+] Kolom 'member_id' berhasil ditambahkan ke tabel 'transaksi'\n";
    } else {
        echo "[-] Gagal menambahkan kolom 'member_id': " . $conn->error . "\n";
    }
} else {
    echo "[*] Kolom 'member_id' sudah ada di tabel 'transaksi'\n";
}

// 2. Tambah kolom diskon ke tabel transaksi jika belum ada
$res = $conn->query("SHOW COLUMNS FROM `transaksi` LIKE 'diskon'");
if ($res && $res->num_rows == 0) {
    if ($conn->query("ALTER TABLE `transaksi` ADD COLUMN `diskon` INT NOT NULL DEFAULT 0 AFTER `total`")) {
        echo "[+] Kolom 'diskon' berhasil ditambahkan ke tabel 'transaksi'\n";
    } else {
        echo "[-] Gagal menambahkan kolom 'diskon': " . $conn->error . "\n";
    }
} else {
    echo "[*] Kolom 'diskon' sudah ada di tabel 'transaksi'\n";
}

// 3. Buat tabel detail_transaksi jika belum ada
$sqlDetail = "CREATE TABLE IF NOT EXISTS `detail_transaksi` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `transaksi_id` INT NOT NULL,
    `produk_id` INT NOT NULL,
    `qty` INT NOT NULL,
    `harga_beli` INT NOT NULL,
    `harga_jual` INT NOT NULL,
    FOREIGN KEY (`transaksi_id`) REFERENCES `transaksi` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

if ($conn->query($sqlDetail) === TRUE) {
    echo "[+] Tabel 'detail_transaksi' siap/berhasil dibuat\n";
} else {
    echo "[-] Gagal membuat tabel 'detail_transaksi': " . $conn->error . "\n";
}

// 4. Buat tabel users jika belum ada
$sqlUsers = "CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `role` VARCHAR(20) DEFAULT 'admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

if ($conn->query($sqlUsers) === TRUE) {
    echo "[+] Tabel 'users' siap/berhasil dibuat\n";
} else {
    echo "[-] Gagal membuat tabel 'users': " . $conn->error . "\n";
}

// 5. Masukkan user admin default jika belum ada
$email = "admin@siumkm.com";
$checkUser = $conn->prepare("SELECT id FROM `users` WHERE `email` = ?");
$checkUser->bind_param("s", $email);
$checkUser->execute();
$checkUser->store_result();

if ($checkUser->num_rows == 0) {
    $checkUser->close();
    $username = "admin";
    $nama = "Administrator";
    $role = "admin";
    $password_hashed = password_hash("admin123", PASSWORD_BCRYPT);

    $insertUser = $conn->prepare("INSERT INTO `users` (`username`, `email`, `password`, `nama`, `role`) VALUES (?, ?, ?, ?, ?)");
    $insertUser->bind_param("sssss", $username, $email, $password_hashed, $nama, $role);
    
    if ($insertUser->execute()) {
        echo "[+] User admin default berhasil ditambahkan (admin@siumkm.com / admin123)\n";
    } else {
        echo "[-] Gagal menambahkan user admin default: " . $insertUser->error . "\n";
    }
    $insertUser->close();
} else {
    echo "[*] User admin default sudah terdaftar\n";
    $checkUser->close();
}

$conn->close();
echo "=== MIGRASI SELESAI ===\n";
?>
