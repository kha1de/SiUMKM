let cart = [];
let produkList = [];

async function renderPOS() {
    const el = document.getElementById('pageContent');
    // POS layout khusus: gunakan wrapper div
    el.style.cssText = 'margin-left:280px;margin-top:80px;height:calc(100vh - 80px);padding:0;background:var(--neo-bg);display:block;overflow:hidden';
    el.innerHTML = `
    <div class="flex h-full overflow-hidden animate-up">
        <!-- Left: Product Grid -->
        <section class="flex-1 h-full overflow-y-auto p-8 border-r-4 border-black">
            <div class="flex justify-between items-end mb-8">
                <div>
                    <h1 class="text-2xl font-black uppercase italic tracking-tight">Katalog Produk</h1>
                    <p class="text-xs font-bold text-[#5e5e5e] uppercase tracking-widest mt-1">Pilih produk untuk pesanan</p>
                </div>
                <div class="flex gap-3">
                    <div class="relative">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-[#5e5e5e]">search</span>
                        <input type="text" id="posSearch" placeholder="Cari..." oninput="filterProdukPOS()" class="page-input" style="padding:0.5rem 1rem 0.5rem 2.5rem; width:180px; font-size:0.75rem"/>
                    </div>
                    <select id="posKat" onchange="filterProdukPOS()" class="page-input" style="padding:0.5rem; width:auto; font-size:0.75rem; font-weight:900; text-transform:uppercase">
                        <option value="">Semua</option>
                    </select>
                </div>
            </div>
            <div id="produkGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"></div>
        </section>

        <!-- Right: Cart Panel -->
        <aside class="w-[400px] h-full bg-white flex flex-col flex-shrink-0 shadow-[-10px_0_30px_rgba(0,0,0,0.05)]">
            <div class="p-6 border-b-4 border-black bg-[#fdfdfd]">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-black uppercase italic">Keranjang <span id="cartCount" class="text-xs font-bold text-[#a1a1a1] not-italic"></span></h2>
                    <span id="orderNumber" class="bg-black text-white font-black px-3 py-1 text-[10px] tracking-widest">ORDER #${Math.floor(Math.random()*9000)+1000}</span>
                </div>
                <div class="flex gap-2">
                    <select id="posMember" class="page-input flex-1" style="padding:0.5rem; font-size:0.75rem; font-weight:700">
                        <option value="">Pilih Member</option>
                    </select>
                    <button onclick="clearCart()" class="w-10 h-10 flex items-center justify-center border-3 border-black hover:bg-[#FF3B30] hover:text-white transition-all">
                        <span class="material-symbols-outlined">delete_sweep</span>
                    </button>
                </div>
            </div>

            <div id="cartItems" class="flex-1 overflow-y-auto p-6">
                <div class="flex flex-col items-center justify-center h-full opacity-30">
                    <span class="material-symbols-outlined text-6xl mb-2">shopping_basket</span>
                    <p class="text-xs font-black uppercase tracking-widest">Keranjang Kosong</p>
                </div>
            </div>

            <div class="p-6 border-t-4 border-black bg-[#f3f3f4]">
                <div class="flex justify-between text-xs font-black uppercase mb-2">
                    <span class="text-[#5e5e5e]">Subtotal</span>
                    <span id="cartSubtotal">Rp 0</span>
                </div>
                <div class="flex items-center gap-3 mb-4">
                    <label class="text-[10px] font-black uppercase tracking-widest text-[#5e5e5e]">Diskon</label>
                    <input type="number" id="cartDiskon" placeholder="0" oninput="updateCartTotal()" class="page-input text-right" style="padding:0.5rem; font-size:0.875rem"/>
                </div>
                
                <div class="border-t-2 border-black/10 pt-4 mb-4">
                    <div class="flex justify-between items-center">
                        <span class="text-xl font-black italic">TOTAL</span>
                        <span class="text-2xl font-black text-[#6a5f00]" id="cartTotal">Rp 0</span>
                    </div>
                </div>

                <div class="flex flex-col gap-3">
                    <select id="metodeBayar" onchange="toggleBayar()" class="page-input font-black uppercase text-xs">
                        <option value="tunai">Bayar Tunai</option>
                        <option value="qris">Scan QRIS</option>
                        <option value="transfer">Transfer Bank</option>
                    </select>

                    <div id="bayarGroup" class="animate-up">
                        <input type="number" id="uangBayar" placeholder="Masukkan nominal uang..." oninput="hitungKembalian()" class="page-input" style="padding:0.75rem"/>
                        <div class="flex justify-between items-center mt-2 px-1">
                            <span class="text-[10px] font-black uppercase text-[#5e5e5e]">Kembalian</span>
                            <span id="kembalian" class="font-black text-[#16a34a]">Rp 0</span>
                        </div>
                    </div>

                    <div id="transferGroup" class="hidden animate-up p-4 border-2 border-black bg-white">
                        <p class="text-[10px] font-black uppercase mb-3 text-center border-b-2 border-black pb-2">Tujuan Transfer</p>
                        <div id="transferBanks" class="flex flex-col gap-2"></div>
                    </div>

                    <div id="qrisGroup" class="hidden animate-up p-4 border-2 border-black bg-white text-center">
                        <p class="text-[10px] font-black uppercase mb-3 border-b-2 border-black pb-2">Scan QRIS Merchant</p>
                        <img id="posQrisImage" src="" class="w-full max-w-[160px] mx-auto border-2 border-black mb-2 hidden" />
                        <p id="posQrisMerchant" class="text-xs font-black uppercase"></p>
                    </div>

                    <button onclick="prosesTransaksi()" class="page-btn page-btn-primary w-full justify-center !py-4 !text-lg !shadow-lg">
                        <span class="material-symbols-outlined">check_circle</span> SELESAI & CETAK
                    </button>
                </div>
            </div>
        </aside>
    </div>`;

    const [produkRes, memberRes] = await Promise.all([api.get('/produk'), api.get('/member')]);
    produkList = produkRes?.data || [];
    renderProdukGrid(produkList);

    const kats = [...new Set(produkList.map(p => p.kategori?.nama).filter(Boolean))];
    const katSel = document.getElementById('posKat');
    kats.forEach(k => { const o = document.createElement('option'); o.value = k; o.textContent = k; katSel.appendChild(o); });

    const memSel = document.getElementById('posMember');
    (memberRes?.data || []).forEach(p => {
        const o = document.createElement('option'); o.value = p.id;
        o.textContent = `${p.nama} (${p.poin} poin)`; memSel.appendChild(o);
    });
}

function renderProdukGrid(list) {
    const grid = document.getElementById('produkGrid');
    if (!grid) return;
    if (!list.length) { grid.innerHTML = '<div class="col-span-full py-20 text-center opacity-30 font-black uppercase italic">Produk tidak tersedia</div>'; return; }
    grid.innerHTML = list.map(p => `
    <div onclick="${p.stok > 0 ? `addToCart(${p.id})` : ''}" 
         class="group bg-white border-3 border-black neo-shadow-sm hover:translate-y-[-4px] hover:neo-shadow transition-all cursor-pointer ${p.stok === 0 ? 'opacity-40 grayscale' : ''}">
        <div class="aspect-square bg-[#f3f3f4] border-b-3 border-black flex items-center justify-center overflow-hidden relative">
            ${p.gambar ? `<img src="/${p.gambar}" class="w-full h-full object-cover group-hover:scale-110 transition-transform"/>` : `<span class="material-symbols-outlined text-5xl text-black/10">${p.kategori?.nama === 'Makanan' ? 'restaurant' : p.kategori?.nama === 'Minuman' ? 'local_cafe' : 'inventory_2'}</span>`}
            ${p.stok === 0 ? `<div class="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-black uppercase text-xs tracking-tighter">HABIS</div>` : ''}
        </div>
        <div class="p-4">
            <div class="flex justify-between items-start mb-1">
                <span class="bg-[var(--neo-primary)] border-2 border-black px-2 py-0.5 text-[9px] font-black uppercase">${p.kategori?.nama || 'Umum'}</span>
                <span class="text-[10px] font-black text-[#a1a1a1]">${p.stok} ${p.satuan}</span>
            </div>
            <h3 class="font-black text-sm uppercase truncate mb-1">${p.nama}</h3>
            <p class="font-black text-[#6a5f00] text-base">${fmt(p.hargaJual)}</p>
        </div>
    </div>`).join('');
}

function filterProdukPOS() {
    const s = document.getElementById('posSearch')?.value?.toLowerCase() || '';
    const k = document.getElementById('posKat')?.value || '';
    renderProdukGrid(produkList.filter(p => (!s || p.nama.toLowerCase().includes(s)) && (!k || p.kategori?.nama === k)));
}

function addToCart(produkId) {
    const p = produkList.find(x => x.id === produkId);
    if (!p) return;
    const existing = cart.find(c => c.produkId === produkId);
    if (existing) {
        if (existing.qty >= p.stok) { alert(`Stok terbatas! Sisa ${p.stok} ${p.satuan}`); return; }
        existing.qty++;
    } else {
        cart.push({ produkId, nama: p.nama, gambar: p.gambar, harga: parseFloat(p.hargaJual), qty: 1, stok: p.stok });
    }
    renderCart();
}

function updateQty(produkId, delta) {
    const item = cart.find(c => c.produkId === produkId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(c => c.produkId !== produkId);
    renderCart();
}

function renderCart() {
    const el = document.getElementById('cartItems');
    if (!el) return;
    
    const countEl = document.getElementById('cartCount');
    if (countEl) countEl.textContent = `[${cart.length}]`;
    
    if (!cart.length) {
        el.innerHTML = `<div class="flex flex-col items-center justify-center h-full opacity-30"><span class="material-symbols-outlined text-6xl mb-2">shopping_basket</span><p class="text-xs font-black uppercase tracking-widest">Keranjang Kosong</p></div>`;
        updateCartTotal(); return;
    }
    el.innerHTML = cart.map(c => `
    <div class="flex items-center gap-4 mb-4 pb-4 border-b-2 border-black/5 last:border-0 last:mb-0 last:pb-0">
        <div class="w-12 h-12 border-2 border-black bg-[#f3f3f4] flex-shrink-0 overflow-hidden">
            ${c.gambar ? `<img src="/${c.gambar}" class="w-full h-full object-cover"/>` : `<span class="material-symbols-outlined text-black/20 flex h-full items-center justify-center">image</span>`}
        </div>
        <div class="flex-1 min-width-0">
            <p class="font-black text-xs uppercase truncate mb-1">${c.nama}</p>
            <p class="text-[10px] font-bold text-[#6a5f00]">${fmt(c.harga)}</p>
        </div>
        <div class="flex items-center border-2 border-black bg-white overflow-hidden">
            <button onclick="updateQty(${c.produkId},-1)" class="w-7 h-7 font-black hover:bg-[var(--neo-primary)] transition-colors">-</button>
            <span class="px-2 font-black text-xs">${c.qty}</span>
            <button onclick="updateQty(${c.produkId},1)" class="w-7 h-7 font-black hover:bg-[var(--neo-primary)] transition-colors">+</button>
        </div>
    </div>`).join('');
    updateCartTotal();
}

function updateCartTotal() {
    const subtotal = cart.reduce((s, c) => s + c.harga * c.qty, 0);
    const diskon = parseFloat(document.getElementById('cartDiskon')?.value) || 0;
    const total = subtotal - diskon;
    const subEl = document.getElementById('cartSubtotal');
    const totEl = document.getElementById('cartTotal');
    if (subEl) subEl.textContent = fmt(subtotal);
    if (totEl) totEl.textContent = fmt(total);
    hitungKembalian();
}

function hitungKembalian() {
    const total = cart.reduce((s, c) => s + c.harga * c.qty, 0) - (parseFloat(document.getElementById('cartDiskon')?.value) || 0);
    const bayar = parseFloat(document.getElementById('uangBayar')?.value) || 0;
    const el = document.getElementById('kembalian');
    if (el) el.textContent = fmt(Math.max(0, bayar - total));
}

function toggleBayar() {
    const metode = document.getElementById('metodeBayar')?.value;
    const bg = document.getElementById('bayarGroup');
    const tg = document.getElementById('transferGroup');
    const qg = document.getElementById('qrisGroup');
    
    bg.classList.toggle('hidden', metode !== 'tunai');
    tg.classList.toggle('hidden', metode !== 'transfer');
    qg.classList.toggle('hidden', metode !== 'qris');
    
    if (metode === 'transfer') {
        const banks = window.appSettings?.rekening_bank || [];
        document.getElementById('transferBanks').innerHTML = banks.length > 0 
            ? banks.map(b => `<div class="bg-white border-2 border-black p-3 mb-1 animate-up"><p class="text-[10px] font-black uppercase text-[#5e5e5e] mb-1">${b.bank}</p><p class="text-sm font-black text-[#6a5f00]">${b.no_rek}</p><p class="text-[9px] font-bold text-[#a1a1a1]">A.N. ${b.atas_nama}</p></div>`).join('')
            : '<p class="text-[10px] font-black text-[#FF3B30] text-center">Rekening tujuan belum diatur.</p>';
    }
    
    if (metode === 'qris') {
        const imgUrl = window.appSettings?.qris_image;
        const merch = window.appSettings?.qris_merchant || window.appSettings?.nama_toko || 'QRIS MERCHANT';
        const imgEl = document.getElementById('posQrisImage');
        if (imgUrl) { imgEl.src = '/' + imgUrl; imgEl.classList.remove('hidden'); } else { imgEl.classList.add('hidden'); }
        document.getElementById('posQrisMerchant').textContent = merch;
    }
}

async function prosesTransaksi() {
    if (!cart.length) { alert('Keranjang belanja masih kosong!'); return; }
    const subtotal = cart.reduce((s, c) => s + c.harga * c.qty, 0);
    const diskon = parseFloat(document.getElementById('cartDiskon')?.value) || 0;
    const total = subtotal - diskon;
    const metode = document.getElementById('metodeBayar')?.value || 'tunai';
    const bayar = metode === 'tunai' ? parseFloat(document.getElementById('uangBayar')?.value) : total;
    if (isNaN(bayar) || bayar < total) { alert('Uang bayar tidak mencukupi total belanja!'); return; }
    
    const res = await api.post('/transaksi', { 
        items: cart.map(c => ({ produkId: c.produkId, qty: c.qty })), 
        diskon, 
        bayar, 
        metodeBayar: metode, 
        memberId: document.getElementById('posMember')?.value || null 
    });
    
    if (!res?.success) { alert('Gagal memproses transaksi: ' + res?.message); return; }
    
    cetakStruk({ 
        noFaktur: res.noFaktur,
        items: [...cart], 
        subtotal, 
        diskon, 
        total, 
        bayar, 
        kembalian: bayar - total, 
        metode 
    });
    clearCart();
}

function cetakStruk(data) {
    const w = window.open('', '_blank');
    w.document.write(`
        <html><head><title>Struk Pembayaran</title>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;900&display=swap" rel="stylesheet">
        <style>
            body { font-family: 'Space Grotesk', sans-serif; padding: 20px; background: #f9f9f9; display: flex; justify-content: center; }
            .struk { width: ${window.appSettings?.ukuran_struk === '80mm' ? '340px' : '280px'}; background: white; border: 4px solid black; box-shadow: 8px 8px 0px black; padding: 24px; }
            .header { text-align: center; border-bottom: 4px solid black; padding-bottom: 16px; margin-bottom: 16px; }
            h2 { font-weight: 900; font-size: 24px; text-transform: uppercase; margin: 0 0 4px 0; italic: true; }
            p { margin: 0; font-weight: 700; font-size: 12px; }
            .badge { display: inline-block; background: #ffe500; border: 2px solid black; padding: 2px 8px; font-weight: 900; font-size: 10px; text-transform: uppercase; margin-top: 8px; }
            .items { margin-bottom: 16px; }
            .item { display: flex; justify-content: space-between; font-weight: 700; font-size: 13px; margin-bottom: 6px; }
            .divider { border-top: 4px dashed black; margin: 16px 0; }
            .row { display: flex; justify-content: space-between; font-weight: 700; font-size: 13px; margin-bottom: 4px; }
            .total-row { display: flex; justify-content: space-between; font-weight: 900; font-size: 18px; text-transform: uppercase; margin: 12px 0; background: #ffe500; border: 2px solid black; padding: 8px; }
            .footer { text-align: center; border-top: 4px solid black; padding-top: 16px; margin-top: 16px; font-weight: 900; font-size: 11px; text-transform: uppercase; }
            @media print { body { background: white; padding: 0; } .struk { box-shadow: none; border: none; width: 100%; padding: 0; } .no-print { display: none !important; } }
        </style></head>
        <body>
            <div style="display:flex; flex-direction:column; align-items:center; gap:16px;">
                <div class="struk">
                    <div class="header">
                        <h2>${window.appSettings?.nama_toko || 'SiUMKM'}</h2>
                        ${window.appSettings?.slogan ? `<p style="font-weight:900; font-size:12px; margin-bottom:4px; italic:true">${window.appSettings.slogan}</p>` : ''}
                        <p>${window.appSettings?.alamat_toko || 'BUKTI PEMBAYARAN SAH'}</p>
                        <div class="badge">LUNAS</div>
                    </div>
                    <div class="row" style="font-size:10px; color:#5e5e5e; margin-bottom:12px">
                        <span>Invoice: <b>${data.noFaktur}</b></span>
                    </div>
                    <div class="row" style="font-size:10px; color:#5e5e5e; margin-bottom:12px">
                        <span>${new Date().toLocaleString('id-ID')}</span>
                        <span style="text-transform:uppercase">${data.metode}</span>
                    </div>
                    <div class="items">
                        ${data.items.map(i => `<div class="item"><span>${i.nama} x${i.qty}</span><span>${fmt(i.harga * i.qty)}</span></div>`).join('')}
                    </div>
                    <div class="divider"></div>
                    ${data.diskon > 0 ? `<div class="row"><span>Subtotal</span><span>${fmt(data.subtotal)}</span></div><div class="row" style="color:#c0000a"><span>Diskon</span><span>-${fmt(data.diskon)}</span></div>` : ''}
                    <div class="total-row"><span>TOTAL</span><span>${fmt(data.total)}</span></div>
                    ${data.metode === 'tunai' ? `<div class="row"><span>Bayar</span><span>${fmt(data.bayar)}</span></div><div class="row"><span>Kembalian</span><span>${fmt(data.kembalian)}</span></div>` : ''}
                    <div class="footer">${window.appSettings?.footer_struk ? window.appSettings.footer_struk.replace(/\\n/g, '<br>') : 'TERIMA KASIH ATAS KUNJUNGAN ANDA!'}</div>
                </div>
                <div class="no-print" style="width: 100%; display:flex; gap:10px;">
                    <button onclick="window.print()" style="flex:1; background:#ffe500; border:3px solid black; padding:12px; font-family:inherit; font-weight:900; cursor:pointer; box-shadow:4px 4px 0px black; text-transform:uppercase;">Cetak</button>
                    <button onclick="window.close()" style="flex:1; background:white; border:3px solid black; padding:12px; font-family:inherit; font-weight:900; cursor:pointer; box-shadow:4px 4px 0px black; text-transform:uppercase;">Tutup</button>
                </div>
            </div>
        </body></html>
    `);
    w.document.close();
    w.focus();
}

function clearCart() {
    cart = [];
    
    const diskonEl = document.getElementById('cartDiskon');
    if (diskonEl) diskonEl.value = '';
    
    const bayarEl = document.getElementById('uangBayar');
    if (bayarEl) bayarEl.value = '';
    
    const memberEl = document.getElementById('posMember');
    if (memberEl) memberEl.value = '';
    
    const metodeEl = document.getElementById('metodeBayar');
    if (metodeEl) {
        metodeEl.value = 'tunai';
        toggleBayar();
    }

    const orderEl = document.getElementById('orderNumber');
    if (orderEl) {
        orderEl.textContent = `ORDER #${Math.floor(Math.random()*9000)+1000}`;
    }
    
    renderCart();
}