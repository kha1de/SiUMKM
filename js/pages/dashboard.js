async function renderDashboard() {
    const el = document.getElementById('pageContent');
    const data = await api.get('/laporan/dashboard');
    if (!data?.success) { el.innerHTML = '<div class="empty-state" style="padding:4rem;text-align:center;font-weight:900;color:#FF3B30">GAGAL MEMUAT DATA DASHBOARD</div>'; return; }
    const d = data.data;

    el.innerHTML = `
    <div class="animate-up">
        <h1 class="pg-page-title">Dashboard Utama</h1>
        <p class="pg-page-sub">Pantau performa bisnis UMKM Anda secara real-time.</p>

        ${d.stokRendahCount > 0 ? `
        <div class="pg-section" style="background:#FF3B30; border-color:black; margin-bottom:2rem; box-shadow:8px 8px 0 black">
            <div class="pg-section-body flex items-center gap-6">
                <span class="material-symbols-outlined text-5xl text-white">warning</span>
                <div class="flex-1">
                    <p class="font-black text-sm uppercase text-white mb-1">Peringatan: ${d.stokRendahCount} Produk Stok Rendah!</p>
                    <p class="text-xs font-semibold text-white/80">Segera lakukan restok untuk menjaga kelancaran operasional penjualan Anda.</p>
                </div>
                <button onclick="navigate('produk')" class="page-btn" style="background:white; color:black; border-color:black; padding:0.5rem 1.5rem">CEK STOK</button>
            </div>
        </div>` : ''}

        <div class="pg-grid-4 pg-mb">
            <div class="pg-kpi">
                <div class="pg-flex-between mb-4">
                    <p class="pg-kpi-label">Pendapatan Hari Ini</p>
                    <span class="material-symbols-outlined text-xl text-[#6a5f00]">payments</span>
                </div>
                <div class="pg-kpi-val">${fmt(d.pendapatanHari)}</div>
                <div class="pg-kpi-sub text-[#16a34a]">↑ Target Harian Tercapai</div>
            </div>
            
            <div class="pg-kpi">
                <div class="pg-flex-between mb-4">
                    <p class="pg-kpi-label">Pendapatan Bulan Ini</p>
                    <span class="material-symbols-outlined text-xl text-[#6a5f00]">calendar_month</span>
                </div>
                <div class="pg-kpi-val">${fmt(d.pendapatanBulan)}</div>
                <div class="pg-kpi-sub text-[#16a34a]">↑ Tren Positif</div>
            </div>

            <div class="pg-kpi">
                <div class="pg-flex-between mb-4">
                    <p class="pg-kpi-label">Inventaris Produk</p>
                    <span class="material-symbols-outlined text-xl text-[#6a5f00]">inventory_2</span>
                </div>
                <div class="pg-kpi-val">${d.totalProduk} <small class="text-xs font-normal">Item</small></div>
                <div class="pg-kpi-sub ${d.stokRendahCount > 0 ? 'text-[#FF3B30]' : 'text-[#5e5e5e]'}">${d.stokRendahCount} Produk Butuh Atensi</div>
            </div>

            <div class="pg-kpi" style="background:var(--neo-primary)">
                <div class="pg-flex-between mb-4">
                    <p class="pg-kpi-label" style="color:black">Total Member</p>
                    <span class="material-symbols-outlined text-xl text-black">people</span>
                </div>
                <div class="pg-kpi-val">${d.totalMember}</div>
                <div class="pg-kpi-sub text-black/60">Loyalitas Terjaga</div>
            </div>
        </div>

        <div class="pg-grid-84">
            <div class="pg-section">
                <div class="pg-section-head">
                    <span class="pg-section-title">Transaksi Terbaru</span>
                    <button onclick="navigate('transaksi')" class="text-[10px] font-black uppercase flex items-center gap-1 hover:underline">
                        Lihat Semua <span class="material-symbols-outlined" style="font-size:14px">arrow_forward</span>
                    </button>
                </div>
                <div style="overflow-x:auto">
                    <table class="page-table">
                        <thead>
                            <tr>
                                <th>No. Faktur</th>
                                <th>Total</th>
                                <th>Metode</th>
                                <th>Waktu</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${d.transaksiTerbaru.length ? d.transaksiTerbaru.map(t => `
                            <tr>
                                <td><code style="font-weight:900; font-size:0.8rem; background:#f3f3f4; padding:2px 6px; border:1px solid black">${t.noFaktur}</code></td>
                                <td><span style="font-weight:900; color:#6a5f00">${fmt(t.total)}</span></td>
                                <td><span class="page-badge page-badge-blue">${t.metodeBayar}</span></td>
                                <td style="font-size:0.8rem; color:#5e5e5e">${fmtTanggal(t.createdAt)}</td>
                            </tr>`).join('') : '<tr><td colspan="4" style="padding:4rem; text-align:center; font-weight:700; color:#a1a1a1">Belum ada data transaksi</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="pg-section">
                <div class="pg-section-head">
                    <span class="pg-section-title">Log Stok Rendah</span>
                </div>
                <div class="pg-section-body">
                    ${d.stokRendah.length ? d.stokRendah.map(p => `
                    <div class="flex justify-between items-center mb-4 pb-4 border-b-2 border-black/5 last:border-0 last:mb-0 last:pb-0">
                        <div>
                            <p class="font-black text-sm uppercase">${p.nama}</p>
                            <p class="text-[10px] font-bold text-[#5e5e5e]">Minimal Stok: ${p.stokMinimum} ${p.satuan}</p>
                        </div>
                        <span class="page-badge ${p.stok === 0 ? 'page-badge-red' : 'page-badge-yellow'}">${p.stok === 0 ? 'HABIS' : p.stok + ' ' + p.satuan}</span>
                    </div>`).join('') : '<p class="text-sm font-bold text-[#5e5e5e] text-center py-6">Semua persediaan aman ✅</p>'}
                </div>
            </div>
        </div>
    </div>`;
}