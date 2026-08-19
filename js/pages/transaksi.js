async function renderTransaksi() {
    const el = document.getElementById('pageContent');
    el.innerHTML = `
    <div class="animate-up">
        <h1 class="pg-page-title">Riwayat Transaksi</h1>
        <p class="pg-page-sub">Semua riwayat penjualan UMKM Anda.</p>
        
        <div class="pg-section">
            <div class="pg-section-head" style="flex-wrap:wrap;gap:1rem">
                <div style="position:relative;flex:1;min-width:260px">
                    <span class="material-symbols-outlined" style="position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:20px;color:#5e5e5e">search</span>
                    <input type="text" id="searchTransaksi" placeholder="Cari invoice atau member..." oninput="loadTableTransaksi()" class="page-input" style="padding-left:3rem"/>
                </div>
                <div class="pg-flex" style="gap:0.5rem">
                    <input type="date" id="tglDari" onchange="loadTableTransaksi()" class="page-input" style="width:auto"/>
                    <input type="date" id="tglSampai" onchange="loadTableTransaksi()" class="page-input" style="width:auto"/>
                </div>
            </div>
            <div style="overflow-x:auto">
                <table class="page-table">
                    <thead>
                        <tr>
                            <th>No. Invoice</th>
                            <th>Waktu Transaksi</th>
                            <th>Nama Member</th>
                            <th>Jumlah Item</th>
                            <th>Metode Pembayaran</th>
                            <th>Total Bayar</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="transaksiTable">
                        <tr><td colspan="7" class="empty-state" style="padding:4rem;text-align:center;font-weight:700;color:#a1a1a1">Memuat data...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
    loadTableTransaksi();
}

async function loadTableTransaksi() {
    const tbody = document.getElementById('transaksiTable');
    if (!tbody) return;
    
    const res = await api.get('/transaksi');
    if (!res?.success) {
        tbody.innerHTML = '<tr><td colspan="7" style="padding:4rem;text-align:center;font-weight:700;color:#FF3B30">Gagal memuat data transaksi</td></tr>';
        return;
    }
    
    const data = res.data || [];
    
    const s = document.getElementById('searchTransaksi')?.value?.toLowerCase() || '';
    const tglDari = document.getElementById('tglDari')?.value || '';
    const tglSampai = document.getElementById('tglSampai')?.value || '';
    
    const filtered = data.filter(t => {
        // Filter pencarian invoice atau nama member
        const matchSearch = !s || t.noFaktur.toLowerCase().includes(s) || t.member.toLowerCase().includes(s);
        
        // Filter rentang tanggal
        const tDate = t.createdAt.substring(0, 10); // format YYYY-MM-DD
        const matchDari = !tglDari || tDate >= tglDari;
        const matchSampai = !tglSampai || tDate <= tglSampai;
        
        return matchSearch && matchDari && matchSampai;
    });
    
    if (!filtered.length) { 
        tbody.innerHTML = '<tr><td colspan="7" style="padding:4rem;text-align:center;font-weight:700;color:#a1a1a1">Transaksi tidak ditemukan</td></tr>'; 
        return; 
    }
    
    tbody.innerHTML = filtered.map(t => `
    <tr class="hover:bg-[#f9f9f9] transition-colors">
        <td><code style="font-weight:900;font-size:0.8rem;background:#f3f3f4;padding:2px 6px;border:1px solid black">${t.noFaktur}</code></td>
        <td style="color:#5e5e5e;font-size:0.8rem">${fmtTanggal(t.createdAt)}</td>
        <td style="font-weight:800">${t.member}</td>
        <td style="font-weight:700">${t.items} item</td>
        <td><span class="page-badge page-badge-blue">${t.metodeBayar}</span></td>
        <td><span style="color:#6a5f00;font-weight:900">${fmt(t.total)}</span></td>
        <td><span class="page-badge page-badge-green">${t.status}</span></td>
    </tr>`).join('');
}

