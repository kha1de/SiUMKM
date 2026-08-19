# SiUMKM — Sistem Informasi Usaha Mikro, Kecil & Menengah

Aplikasi kasir dan manajemen bisnis berbasis web (SPA) untuk UMKM. Dirancang dengan antarmuka **Neobrutalism** modern, memungkinkan pemilik usaha mengelola produk, transaksi, member, laporan keuangan, dan pengaturan toko dalam satu platform.

---

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Teknologi](#-teknologi)
- [Struktur Folder](#-struktur-folder)
- [Database](#-database)
- [Prasyarat](#-prasyarat)
- [Cara Instalasi](#-cara-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Cara Menjalankan](#-cara-menjalankan)
- [Akun Default](#-akun-default)
- [API Endpoints](#-api-endpoints)
- [Catatan Tambahan](#-catatan-tambahan)
- [TODO](#-todo--informasi-yang-belum-diketahui)

---

## ✨ Fitur

### 🏠 Dashboard
- Ringkasan **pendapatan hari ini** dan **pendapatan bulan ini**
- Total produk aktif dan jumlah member
- **Peringatan stok rendah** otomatis (tampil jika stok ≤ stok minimum)
- Daftar **3 transaksi terbaru**
- Log produk yang membutuhkan restok

### 🛒 Kasir / Point of Sale (POS)
- Katalog produk dengan **pencarian** dan **filter kategori**
- Keranjang belanja dengan manajemen quantity
- Pilihan member (untuk program loyalitas)
- Input **diskon** manual
- 3 metode pembayaran: **Tunai**, **QRIS**, **Transfer Bank**
- Hitung kembalian otomatis (untuk pembayaran tunai)
- Tampil kode QRIS dan info rekening bank saat checkout
- **Cetak struk** (format 58mm / 80mm) langsung dari browser
- Pemrosesan transaksi dengan ACID database transaction (rollback otomatis jika gagal)
- Pengurangan stok otomatis saat transaksi berhasil

### 📦 Inventaris Produk
- CRUD produk lengkap (Tambah, Lihat, Edit, Hapus)
- Field produk: Kode, Nama, Kategori, Harga Beli, Harga Jual, Stok, Stok Minimum, Satuan, Deskripsi, Gambar
- Pencarian produk (berdasarkan nama atau kode)
- Indikator stok rendah / habis pada daftar produk

### 🧾 Riwayat Transaksi
- Daftar semua transaksi dengan No. Faktur, total, diskon, metode bayar, nama member, jumlah item, dan waktu
- Tampilan tabel

### 👥 Manajemen Member
- CRUD data member (Tambah, Edit, Hapus)
- Field member: Nama, Telepon, Email, Poin, Total Transaksi, Tanggal Bergabung
- **Program loyalitas poin**: 1 poin setiap pembelanjaan Rp 10.000
- Poin dan total transaksi member diperbarui otomatis setiap transaksi berhasil

### 📊 Laporan Keuangan
- Total pendapatan, total pengeluaran (COGS), dan laba bersih (all-time)
- Total jumlah transaksi
- Grafik **pendapatan & laba 7 hari terakhir** (nama hari dalam Bahasa Indonesia)
- **Top 5 produk terlaris** dengan visualisasi persentase

### ✨ AI Rekomendasi
- Analisis stok otomatis: menampilkan daftar produk **stok habis** (KRITIS) dan **stok menipis** (REVALUASI)
- Saran strategi bisnis berbasis data penjualan (pendapatan bulan ini, jumlah member, jumlah produk)
- Rekomendasi optimalisasi inventaris

### ⚙️ Pengaturan Toko
- **Profil bisnis**: Nama UMKM, Slogan, Alamat, WhatsApp/Telepon, Email
- **Konfigurasi struk**: Ukuran kertas (58mm / 80mm), Pesan footer struk
- **Metode Pembayaran QRIS**: Upload gambar kode QRIS, nama merchant
- **Daftar Rekening Bank**: Tambah/hapus rekening (nama bank, nomor rekening, atas nama)

### 🔐 Autentikasi
- Halaman login terpisah (`login.html`)
- Login menggunakan **email** dan **password** (bcrypt hash)
- Token autentikasi disimpan di `localStorage` (`siumkm_token`, `siumkm_user`)
- Proteksi halaman: redirect ke `login.html` jika token tidak ditemukan
- Logout menghapus token dari localStorage

---

## 🛠 Teknologi

### Frontend

| Teknologi | Keterangan |
|---|---|
| **HTML5** | Struktur halaman (`index.html`, `login.html`) |
| **Vanilla JavaScript** | Logika aplikasi, routing SPA, Fetch API |
| **Tailwind CSS** (CDN) | Utility-class styling, dimuat via `cdn.tailwindcss.com` |
| **Vanilla CSS** | Design system custom (`css/style.css`), CSS variables Neobrutalism |
| **Space Grotesk** | Font utama, dimuat dari Google Fonts |
| **Material Symbols Outlined** | Icon set, dimuat dari Google Fonts |

### Backend

| Teknologi | Keterangan |
|---|---|
| **PHP** (Built-in Server / XAMPP) | REST API handler, dijalankan via PHP CLI atau Apache |
| **MySQLi** | Ekstensi PHP untuk koneksi database MySQL |
| **MySQL / MariaDB** | Database relasional (via XAMPP) |

### Arsitektur

- **Single Page Application (SPA)**: Satu file `index.html`, navigasi antar halaman tanpa reload via JavaScript router
- **REST API**: Frontend berkomunikasi ke backend PHP melalui `fetch()` API dengan JSON
- **No framework backend**: Murni PHP prosedural
- **No framework frontend**: Murni Vanilla JavaScript

---

## 📁 Struktur Folder

```
SiUMKM/
├── index.html              # Halaman utama aplikasi (SPA shell)
├── login.html              # Halaman login
├── run_server.bat          # Script menjalankan PHP built-in server (Windows)
│
├── api/                    # Backend PHP (REST API endpoints)
│   ├── db.php              # Konfigurasi & koneksi database
│   ├── login.php           # POST  — autentikasi user
│   ├── dashboard.php       # GET   — data ringkasan dashboard
│   ├── produk.php          # GET/POST/PUT/DELETE — manajemen produk
│   ├── transaksi.php       # GET/POST — transaksi POS
│   ├── member.php          # GET/POST/PUT/DELETE — data member
│   ├── laporan.php         # GET   — laporan keuangan & grafik
│   ├── settings.php        # GET/PUT — pengaturan toko
│   ├── upload.php          # POST  — upload gambar QRIS
│   └── migration.php       # Script migrasi database (jalankan sekali)
│
├── css/
│   └── style.css           # Design system utama (CSS variables, komponen UI)
│
├── js/
│   ├── api.js              # Helper fetch API, custom alert/confirm dialog
│   ├── app.js              # Router SPA, auth check, navigasi sidebar
│   ├── login.js            # Logika halaman login
│   └── pages/              # Modul halaman (di-load via script di index.html)
│       ├── dashboard.js    # Render halaman Dashboard
│       ├── pos.js          # Render halaman Kasir / POS
│       ├── produk.js       # Render halaman Inventaris Produk
│       ├── transaksi.js    # Render halaman Riwayat Transaksi
│       ├── member.js       # Render halaman Data Member
│       ├── laporan.js      # Render halaman Laporan Keuangan
│       ├── ai.js           # Render halaman AI Rekomendasi
│       └── settings.js     # Render halaman Pengaturan Toko
│
└── uploads/                # Direktori penyimpanan gambar upload (QRIS)
    └── qris_*.jpg/jpeg     # File gambar QRIS yang telah diupload
```

---

## 🗄 Database

**Nama Database**: `db_siumkm`
**Host**: `127.0.0.1`
**Port**: `3306` (default MySQL)

### Tabel

#### `users`
Menyimpan data akun pengguna aplikasi.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INT AUTO_INCREMENT | Primary Key |
| `username` | VARCHAR(50) UNIQUE | Username login |
| `email` | VARCHAR(100) UNIQUE | Email login |
| `password` | VARCHAR(255) | Password (bcrypt hash) |
| `nama` | VARCHAR(100) | Nama lengkap |
| `role` | VARCHAR(20) | Peran pengguna (default: `admin`) |

#### `produk`
Menyimpan data inventaris produk.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INT AUTO_INCREMENT | Primary Key |
| `kode` | VARCHAR | Kode unik produk (auto-generate jika kosong) |
| `nama` | VARCHAR | Nama produk |
| `kategori` | VARCHAR | Kategori produk (default: `Umum`) |
| `harga_beli` | INT | Harga beli / modal |
| `harga_jual` | INT | Harga jual ke pelanggan |
| `stok` | INT | Jumlah stok saat ini |
| `stok_minimum` | INT | Batas minimum stok (trigger peringatan, default: 5) |
| `satuan` | VARCHAR | Satuan produk (default: `pcs`) |
| `deskripsi` | TEXT | Deskripsi produk |
| `gambar` | VARCHAR | Path gambar produk |

#### `transaksi`
Menyimpan data header transaksi penjualan.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INT AUTO_INCREMENT | Primary Key |
| `member_id` | INT NULL | FK ke tabel `member` (nullable) |
| `no_faktur` | VARCHAR | Nomor faktur unik (format: `INV-YYYYMMDDHHiiss`) |
| `total` | INT | Total pembayaran setelah diskon |
| `diskon` | INT | Jumlah diskon (default: 0) |
| `metode_bayar` | VARCHAR | Metode pembayaran (TUNAI/QRIS/TRANSFER) |
| `created_at` | DATETIME | Waktu transaksi dibuat (auto) |

#### `detail_transaksi`
Menyimpan item-item dalam setiap transaksi.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INT AUTO_INCREMENT | Primary Key |
| `transaksi_id` | INT | FK ke `transaksi.id` (CASCADE DELETE) |
| `produk_id` | INT | FK ke `produk.id` |
| `qty` | INT | Jumlah item dibeli |
| `harga_beli` | INT | Snapshot harga beli saat transaksi |
| `harga_jual` | INT | Snapshot harga jual saat transaksi |

#### `member`
Menyimpan data pelanggan / member program loyalitas.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INT AUTO_INCREMENT | Primary Key |
| `nama` | VARCHAR | Nama member |
| `telp` | VARCHAR | Nomor telepon |
| `email` | VARCHAR | Email member |
| `poin` | INT | Total poin loyalitas |
| `total_transaksi` | INT | Jumlah total transaksi yang pernah dilakukan |
| `bergabung` | DATE | Tanggal pendaftaran member |

#### `settings`
Menyimpan konfigurasi toko (1 baris, id = 1).

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INT | Primary Key (selalu 1) |
| `nama_toko` | VARCHAR | Nama UMKM / toko |
| `slogan` | VARCHAR | Slogan toko (muncul di struk) |
| `alamat_toko` | TEXT | Alamat lengkap toko |
| `kontak_toko` | VARCHAR | WhatsApp / telepon |
| `email_toko` | VARCHAR | Email toko |
| `ukuran_struk` | VARCHAR | Ukuran kertas struk (`58mm` atau `80mm`) |
| `footer_struk` | TEXT | Pesan kaki struk |
| `rekening_bank` | TEXT | Array rekening bank (JSON string) |
| `qris_image` | VARCHAR | Path gambar QRIS yang diupload |
| `qris_merchant` | VARCHAR | Nama merchant QRIS |

---

## ✅ Prasyarat

Pastikan software berikut sudah terinstal:

- **XAMPP** — menyediakan PHP CLI dan MySQL/MariaDB
  - Path PHP yang digunakan: `C:\xampp\php\php.exe`
- **Web Browser** (Chrome, Firefox, Edge, dll.)

> Apache XAMPP tidak wajib diaktifkan — aplikasi menggunakan PHP built-in server.

---

## 🚀 Cara Instalasi

### Langkah 1: Jalankan MySQL XAMPP

Buka **XAMPP Control Panel** dan klik **Start** pada modul **MySQL**.

### Langkah 2: Buat Database

1. Akses **phpMyAdmin**: `http://localhost/phpmyadmin`
2. Buat database baru dengan nama: `db_siumkm`
3. Jalankan SQL berikut di tab **SQL**:

```sql
CREATE DATABASE IF NOT EXISTS `db_siumkm`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `db_siumkm`;

CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `role` VARCHAR(20) DEFAULT 'admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `produk` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `kode` VARCHAR(50),
    `nama` VARCHAR(255) NOT NULL,
    `kategori` VARCHAR(100) DEFAULT 'Umum',
    `harga_beli` INT NOT NULL DEFAULT 0,
    `harga_jual` INT NOT NULL DEFAULT 0,
    `stok` INT NOT NULL DEFAULT 0,
    `stok_minimum` INT NOT NULL DEFAULT 5,
    `satuan` VARCHAR(20) DEFAULT 'pcs',
    `deskripsi` TEXT,
    `gambar` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `member` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nama` VARCHAR(100) NOT NULL,
    `telp` VARCHAR(20),
    `email` VARCHAR(100),
    `poin` INT NOT NULL DEFAULT 0,
    `total_transaksi` INT NOT NULL DEFAULT 0,
    `bergabung` DATE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `transaksi` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `member_id` INT NULL DEFAULT NULL,
    `no_faktur` VARCHAR(50) NOT NULL,
    `total` INT NOT NULL DEFAULT 0,
    `diskon` INT NOT NULL DEFAULT 0,
    `metode_bayar` VARCHAR(20) DEFAULT 'TUNAI',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `detail_transaksi` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `transaksi_id` INT NOT NULL,
    `produk_id` INT NOT NULL,
    `qty` INT NOT NULL,
    `harga_beli` INT NOT NULL,
    `harga_jual` INT NOT NULL,
    FOREIGN KEY (`transaksi_id`) REFERENCES `transaksi` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `settings` (
    `id` INT PRIMARY KEY,
    `nama_toko` VARCHAR(100) DEFAULT 'SiUMKM',
    `slogan` VARCHAR(255),
    `alamat_toko` TEXT,
    `kontak_toko` VARCHAR(50),
    `email_toko` VARCHAR(100),
    `ukuran_struk` VARCHAR(10) DEFAULT '58mm',
    `footer_struk` TEXT,
    `rekening_bank` TEXT,
    `qris_image` VARCHAR(255),
    `qris_merchant` VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Langkah 3: Jalankan Migrasi (Buat Akun Admin)

1. Jalankan server terlebih dahulu (lihat [Cara Menjalankan](#-cara-menjalankan))
2. Buka browser dan akses:
   ```
   http://localhost:8000/api/migration.php
   ```
3. Jika berhasil, output akan menampilkan:
   ```
   === MEMULAI MIGRASI DATABASE ===
   [+] User admin default berhasil ditambahkan (admin@siumkm.com / admin123)
   === MIGRASI SELESAI ===
   ```

> Script `migration.php` aman dijalankan berulang kali — hanya menambahkan data jika belum ada.

---

## ⚙️ Konfigurasi

### Konfigurasi Database

Edit file `api/db.php` jika konfigurasi MySQL berbeda dari default XAMPP:

```php
$host   = "127.0.0.1";   // Host database
$user   = "root";         // Username MySQL (default XAMPP: root)
$pass   = "";             // Password MySQL (default XAMPP: kosong)
$dbname = "db_siumkm";   // Nama database
```

### Konfigurasi PHP CLI

Edit `run_server.bat` jika XAMPP diinstal bukan di `C:\xampp\`:

```bat
C:\xampp\php\php.exe -S localhost:8000
```

Ganti path `C:\xampp\php\php.exe` sesuai lokasi instalasi XAMPP Anda.

---

## ▶️ Cara Menjalankan

### Metode 1: Double-click `run_server.bat` *(Direkomendasikan)*

1. Pastikan **MySQL XAMPP** sudah berjalan.
2. Masuk ke folder project `SiUMKM`.
3. **Double-click** file `run_server.bat`.
4. Jendela Command Prompt akan terbuka dengan pesan:
   ```
   Memulai Server SiUMKM...
   Buka browser dan ketik: http://localhost:8000
   JANGAN TUTUP jendela ini (Tekan Ctrl+C untuk mematikan server).
   ```
5. Buka browser dan akses: **`http://localhost:8000`**

> ⚠️ **Jangan tutup jendela Command Prompt** selama aplikasi digunakan.

### Metode 2: Manual via PowerShell

```powershell
cd "C:\Users\LOQ\Documents\Project mandiri\SiUMKM"
C:\xampp\php\php.exe -S localhost:8000
```

---

## 🔑 Akun Default

Setelah menjalankan `migration.php`, gunakan kredensial berikut:

| Field | Value |
|---|---|
| **Email** | `admin@siumkm.com` |
| **Password** | `admin123` |

> ⚠️ Sangat disarankan mengganti password default setelah pertama kali login.

---

## 📡 API Endpoints

Semua endpoint berada di folder `/api/` dan mengembalikan respons **JSON**.

| Method | Endpoint | Fungsi |
|---|---|---|
| `POST` | `/api/login.php` | Autentikasi user |
| `GET` | `/api/dashboard.php` | Data ringkasan dashboard |
| `GET` | `/api/laporan.php` | Data laporan keuangan & grafik |
| `GET` | `/api/produk.php` | Daftar produk (support `?search=`) |
| `POST` | `/api/produk.php` | Tambah produk baru |
| `PUT` | `/api/produk.php?id={id}` | Update produk |
| `DELETE` | `/api/produk.php?id={id}` | Hapus produk |
| `GET` | `/api/transaksi.php` | Daftar riwayat transaksi |
| `POST` | `/api/transaksi.php` | Buat transaksi baru (POS checkout) |
| `GET` | `/api/member.php` | Daftar semua member |
| `POST` | `/api/member.php` | Tambah member baru |
| `PUT` | `/api/member.php?id={id}` | Update data member |
| `DELETE` | `/api/member.php?id={id}` | Hapus member |
| `GET` | `/api/settings.php` | Ambil pengaturan toko |
| `PUT` | `/api/settings.php` | Simpan pengaturan toko |
| `POST` | `/api/upload.php` | Upload gambar QRIS |
| `GET` | `/api/migration.php` | Jalankan migrasi database |

---

## 📝 Catatan Tambahan

- **Upload file**: Hanya mendukung `JPG`, `JPEG`, dan `PNG`. File disimpan di `uploads/` dengan nama `qris_{timestamp}.ext`.
- **Cetak struk**: Menggunakan `window.print()` browser — tidak memerlukan printer termal khusus.
- **Token autentikasi**: Menggunakan `md5(email + timestamp)`, bersifat stateless, tidak disimpan di database. Cocok untuk penggunaan lokal/single-user.
- **Grafik laporan**: Dibuat menggunakan HTML/CSS murni tanpa library charting eksternal.
- **Notifikasi real-time**: Tidak ada WebSocket — notifikasi stok rendah hanya tampil saat halaman di-refresh.
- **Skema poin loyalitas**: 1 poin untuk setiap Rp 10.000 yang dibelanjakan (dihitung dari total setelah diskon).

---

## ❓ TODO / Informasi yang Belum Diketahui

- [ ] **Fitur ganti password** belum tersedia di UI — harus dilakukan langsung di database.
- [ ] **Fitur registrasi user baru** belum tersedia di UI — akun hanya bisa dibuat via `migration.php` atau langsung di database.
- [ ] **Role-based access control (RBAC)** — field `role` ada di tabel `users`, namun pembatasan akses berdasarkan role belum diimplementasikan di frontend.
- [ ] **Versi PHP minimum** yang dibutuhkan belum terdokumentasi secara eksplisit (diperkirakan PHP ≥ 7.4 berdasarkan sintaks yang digunakan).
- [ ] **Fitur export laporan** (PDF/Excel) belum tersedia.
- [ ] **Fitur pelanggan** (`js/pages/pelanggan.js` ada di folder namun tidak terdaftar di router `app.js`) — TODO: periksa apakah fitur ini masih dalam pengembangan.
