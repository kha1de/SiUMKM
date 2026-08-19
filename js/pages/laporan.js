async function renderLaporan() {
    const el = document.getElementById('pageContent');
    el.innerHTML = `
        <div class="flex flex-col items-center justify-center py-20 opacity-20">
            <div class="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="font-black uppercase tracking-[0.3em] text-[10px]">Memuat Laporan...</p>
        </div>`;

    const res = await api.get('/laporan');
    if (!res?.success) {
        el.innerHTML = '<div class="empty-state" style="padding:4rem;text-align:center;font-weight:900;color:#FF3B30">GAGAL MEMUAT DATA LAPORAN</div>';
        return;
    }

    const d = res.data;
    const margin = d.totalPendapatan > 0 ? ((d.labaBersih / d.totalPendapatan) * 100).toFixed(1) : 0;

    el.innerHTML = `
    <div class="animate-up">
        <h1 class="pg-page-title">Laporan Keuangan</h1>
        <p class="pg-page-sub">Ringkasan performa bisnis Anda berdasarkan transaksi riil.</p>

        <div class="pg-grid-4 pg-mb">
            <div class="pg-kpi">
                <p class="pg-kpi-label">Total Pendapatan</p>
                <div class="pg-kpi-val text-[#6a5f00]">${fmt(d.totalPendapatan)}</div>
                <div class="pg-kpi-sub text-[#16a34a]">Omzet Penjualan</div>
            </div>
            <div class="pg-kpi">
                <p class="pg-kpi-label">Total Pengeluaran</p>
                <div class="pg-kpi-val text-[#c0000a]">${fmt(d.totalPengeluaran)}</div>
                <div class="pg-kpi-sub text-[#c0000a]">Harga Pokok Penjualan</div>
            </div>
            <div class="pg-kpi">
                <p class="pg-kpi-label">Laba Bersih</p>
                <div class="pg-kpi-val">${fmt(d.labaBersih)}</div>
                <div class="pg-kpi-sub text-[#5e5e5e]">Margin ${margin}%</div>
            </div>
            <div class="pg-kpi" style="background:var(--neo-primary)">
                <p class="pg-kpi-label" style="color:black">Total Transaksi</p>
                <div class="pg-kpi-val">${d.totalTransaksi}</div>
                <div class="pg-kpi-sub text-black">Transaksi sukses</div>
            </div>
        </div>

        <div class="pg-grid-84">
            <div class="pg-section">
                <div class="pg-section-head">
                    <span class="pg-section-title">Grafik Pendapatan & Laba (7 Hari Terakhir)</span>
                </div>
                <div class="pg-section-body">
                    <div id="barChart" style="display:flex;align-items:flex-end;gap:1rem;height:180px;margin-bottom:1.5rem"></div>
                    <div style="display:flex;gap:1.5rem">
                        <span style="display:flex;align-items:center;gap:0.5rem;font-size:0.75rem;font-weight:900;text-transform:uppercase">
                            <span style="width:12px;height:12px;background:var(--neo-primary);border:2px solid black;display:inline-block"></span> Pendapatan
                        </span>
                        <span style="display:flex;align-items:center;gap:0.5rem;font-size:0.75rem;font-weight:900;text-transform:uppercase">
                            <span style="width:12px;height:12px;background:black;display:inline-block"></span> Laba Bersih
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="pg-section">
                <div class="pg-section-head">
                    <span class="pg-section-title">Produk Terlaris</span>
                </div>
                <div class="pg-section-body">
                    ${d.topProduk.map(p => `
                    <div style="margin-bottom:1.25rem">
                        <div class="pg-flex-between" style="margin-bottom:0.5rem">
                            <span style="font-weight:800;font-size:0.875rem;text-transform:uppercase">${p.nama}</span>
                            <span style="font-weight:900;font-size:0.875rem">${p.pct}%</span>
                        </div>
                        <div style="height:12px;background:#eee;border:2px solid black;box-shadow:2px 2px 0 black">
                            <div style="width:${p.pct}%;height:100%;background:var(--neo-primary)"></div>
                        </div>
                    </div>`).join('')}
                </div>
            </div>
        </div>
    </div>`;

    // Render bar chart
    const chart = document.getElementById('barChart');
    if (chart && d.chart && d.chart.length > 0) {
        const maxVal = Math.max(...d.chart.map(c => c.pendapatan), 1); // hindari pembagian dengan 0
        chart.innerHTML = d.chart.map(c => {
            const hPendapatan = (c.pendapatan / maxVal) * 140;
            const hLaba = (c.laba / maxVal) * 140;
            return `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:0.5rem">
                <div style="width:100%;display:flex;align-items:flex-end;gap:4px;height:160px">
                    <div style="flex:1;background:var(--neo-primary);border:2px solid black;box-shadow:2px 2px 0 black;height:${Math.max(2, hPendapatan)}px" title="Pendapatan: ${fmt(c.pendapatan)}"></div>
                    <div style="flex:1;background:black;border:2px solid black;height:${Math.max(2, hLaba)}px" title="Laba: ${fmt(c.laba)}"></div>
                </div>
                <span style="font-size:0.65rem;font-weight:900;text-transform:uppercase;color:#5e5e5e">${c.day}</span>
            </div>`;
        }).join('');
    }
}
