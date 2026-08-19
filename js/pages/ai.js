async function renderAI() {
    const el = document.getElementById('pageContent');
    el.innerHTML = `<div class="empty-state" style="padding:4rem;text-align:center;font-weight:900;text-transform:uppercase;letter-spacing:0.1em;color:#a1a1a1">AI Sedang Menganalisis...</div>`;

    const res = await api.get('/laporan/dashboard');
    const data = res?.data || {};
    const stokRendah = data.stokRendah || [];
    
    let alertHtml = '';
    
    if (stokRendah.length === 0) {
        alertHtml = `
        <div class="pg-section" style="background:#dcfce7;border-color:#166534;margin-bottom:0">
            <div class="pg-section-body flex items-center gap-6">
                <span class="material-symbols-outlined text-5xl text-[#166534]">check_circle</span>
                <div class="flex-1">
                    <p class="font-black text-sm uppercase text-[#166534] mb-1">Semua Produk Aman</p>
                    <p class="text-xs font-semibold text-[#5e5e5e]">Tidak ada produk dengan stok menipis saat ini. Persediaan Anda dalam kondisi optimal.</p>
                </div>
                <span class="page-badge page-badge-green" style="background:#166534; color:white">AMAN</span>
            </div>
        </div>`;
    } else {
        alertHtml = stokRendah.map(p => {
            const isHabis = p.stok === 0;
            const bg = isHabis ? '#fee2e2' : '#fef3c7';
            const border = isHabis ? '#c0000a' : '#92400e';
            const icon = isHabis ? 'error' : 'warning';
            const title = isHabis ? `${p.nama} — STOK HABIS` : `${p.nama} — STOK MENIPIS`;
            const badge = isHabis ? `<span class="page-badge page-badge-red" style="background:#c0000a; color:white">KRITIS</span>` : `<span class="page-badge page-badge-yellow">REVALUASI</span>`;
            
            return `
            <div class="pg-section" style="background:${bg};border-color:${border};margin-bottom:0">
                <div class="pg-section-body flex items-center gap-6">
                    <span class="material-symbols-outlined text-5xl text-[${border}]">${icon}</span>
                    <div class="flex-1">
                        <p class="font-black text-sm uppercase text-[${border}] mb-1">${title}</p>
                        <p class="text-xs font-semibold text-[#5e5e5e]">Sisa stok: <b class="text-black">${p.stok} ${p.satuan}</b>. Segera lakukan pemesanan ulang untuk menghindari gangguan operasional.</p>
                    </div>
                    ${badge}
                </div>
            </div>`;
        }).join('');
    }

    el.innerHTML = `
    <div class="animate-up">
        <h1 class="pg-page-title">AI Rekomendasi</h1>
        <p class="pg-page-sub">Analisis otomatis berbasis data penjualan dan stok terkini.</p>

        <div class="grid grid-cols-1 gap-4 pg-mb">
            ${alertHtml}
        </div>

        <div class="pg-section">
            <div class="pg-section-head">
                <span class="pg-section-title">Saran Strategi Bisnis</span>
            </div>
            <div class="pg-section-body">
                <div style="border-left:5px solid var(--neo-primary);padding:1.5rem;background:#fdfdfd;margin-bottom:1.5rem">
                    <p class="font-black text-sm uppercase mb-2">Analisis Pemasukan: ${fmt(data.pendapatanBulan || 0)}</p>
                    <p class="text-sm font-semibold text-[#5e5e5e] leading-relaxed">Pertahankan momentum! Anda memiliki total <b class="text-black">${data.totalMember || 0} member</b> setia. Gunakan data ini untuk mengirimkan kampanye promo WhatsApp tertarget guna meningkatkan retensi.</p>
                </div>
                
                <div style="border-left:5px solid black;padding:1.5rem;background:#fdfdfd;margin-bottom:2rem">
                    <p class="font-black text-sm uppercase mb-2">Optimalisasi Inventaris</p>
                    <p class="text-sm font-semibold text-[#5e5e5e] leading-relaxed">Saat ini terdapat <b class="text-black">${data.totalProduk || 0} produk aktif</b> dalam katalog. Rekomendasi AI: Fokuskan promosi pada 3 produk teratas untuk memaksimalkan perputaran kas (Cash Flow).</p>
                </div>

                <!-- Promo Card -->
                <div style="background:black; padding:2.5rem; position:relative; overflow:hidden">
                    <div class="relative z-10">
                        <h3 style="font-size:1.75rem; font-weight:900; color:var(--neo-primary); margin-bottom:0.75rem; line-height:1">BUTUH PINJAMAN MODAL?</h3>
                        <p style="font-size:0.9rem; font-weight:600; color:rgba(255,255,255,0.7); margin-bottom:1.5rem; max-width:400px">
                            SiUMKM bekerja sama dengan mitra keuangan terpercaya untuk membantu ekspansi bisnis Anda hingga Rp 500.000.000.
                        </p>
                        <button class="page-btn page-btn-primary" style="padding:1rem 2rem; font-size:1rem">AJUKAN SEKARANG</button>
                    </div>
                    <span class="material-symbols-outlined" style="position:absolute; bottom:-2rem; right:-1rem; font-size:10rem; color:rgba(255,255,255,0.06); font-variation-settings:'FILL' 1">payments</span>
                </div>
            </div>
        </div>
    </div>`;
}

