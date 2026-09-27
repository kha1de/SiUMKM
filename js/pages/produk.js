async function renderProduk() {
    const el = document.getElementById('pageContent');
    el.innerHTML = `
    <div class="animate-up">
        <div class="pg-flex-between pg-mb">
            <div>
                <h1 class="pg-page-title">Inventaris Produk</h1>
                <p class="pg-page-sub">Kelola stok, harga, dan katalog produk UMKM Anda.</p>
            </div>
            <button onclick="showModalProduk()" class="page-btn page-btn-primary">
                <span class="material-symbols-outlined">add_box</span> TAMBAH PRODUK
            </button>
        </div>

        <div class="pg-grid-3 pg-mb">
            <div class="pg-kpi">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 flex items-center justify-center bg-[var(--neo-primary)] border-2 border-black">
                        <span class="material-symbols-outlined text-black font-black">inventory</span>
                    </div>
                    <span class="pg-kpi-label">Total Produk</span>
                </div>
                <div class="flex items-baseline gap-2">
                    <span class="pg-kpi-val" id="statTotalProduk">0</span>
                    <span class="text-[10px] font-black uppercase text-[#a1a1a1]">Item</span>
                </div>
                <div class="pg-kpi-sub text-[#16a34a]">↑ Katalog Aktif</div>
            </div>
            
            <div class="pg-kpi">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 flex items-center justify-center bg-[#fee2e2] border-2 border-black">
                        <span class="material-symbols-outlined text-[#FF3B30] font-black">running_with_errors</span>
                    </div>
                    <span class="pg-kpi-label">Stok Menipis</span>
                </div>
                <div class="flex items-baseline gap-2">
                    <span class="pg-kpi-val text-[#FF3B30]" id="statStokRendah">0</span>
                    <span class="text-[10px] font-black uppercase text-[#FF3B30]">Kritis</span>
                </div>
                <div class="pg-kpi-sub text-[#FF3B30]">Segera Re-stock</div>
            </div>

            <div class="pg-kpi">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 flex items-center justify-center bg-[#f3f3f4] border-2 border-black">
                        <span class="material-symbols-outlined text-black font-black">category</span>
                    </div>
                    <span class="pg-kpi-label">Total SKU</span>
                </div>
                <div class="flex items-baseline gap-2">
                    <span class="pg-kpi-val" id="statNilaiAset">0</span>
                    <span class="text-[10px] font-black uppercase text-[#a1a1a1]">SKU</span>
                </div>
                <div class="pg-kpi-sub text-[#5e5e5e]">Unit Tersimpan</div>
            </div>
        </div>

        <div class="pg-section">
            <div class="pg-section-head">
                <span class="pg-section-title">Daftar Inventaris</span>
                <div style="position:relative; width:300px">
                    <span class="material-symbols-outlined" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:20px;color:#5e5e5e">search</span>
                    <input type="text" id="searchProduk" placeholder="Cari nama atau kode..." oninput="loadTableProduk()" class="page-input" style="padding-left:3rem"/>
                </div>
            </div>
            <div style="overflow-x:auto">
                <table class="page-table">
                    <thead>
                        <tr>
                            <th style="width:40%">Nama Produk</th>
                            <th>Kategori</th>
                            <th>Sisa Stok</th>
                            <th>Harga Jual</th>
                            <th style="text-align:center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="produkTable">
                        <tr><td colspan="5" class="empty-state" style="padding:4rem;text-align:center;font-weight:700;color:#a1a1a1">Memuat data...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Modal Produk -->
    <div class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-6 hidden" id="modalProduk">
        <div class="pg-section animate-up" style="width:100%; max-width:600px; margin-bottom:0">
            <div class="pg-section-head">
                <span class="pg-section-title" id="modalTitle">Tambah Produk Baru</span>
                <button onclick="document.getElementById('modalProduk').classList.add('hidden')" class="w-8 h-8 flex items-center justify-center border-2 border-black hover:bg-[#eee] transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <div class="pg-section-body">
                <div id="produkError" class="hidden border-2 border-[#FF3B30] bg-[#fee2e2] text-[#FF3B30] p-4 mb-4 text-xs font-black uppercase"></div>
                <input type="hidden" id="pId" value=""/>
                
                <div class="flex gap-6 mb-6">
                    <div class="w-32 h-32 border-3 border-black bg-[#f3f3f4] flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img id="pPreview" src="" class="w-full h-full object-cover hidden"/>
                        <span id="pPreviewIcon" class="material-symbols-outlined text-4xl text-[#ccc]">image</span>
                    </div>
                    <div class="flex-1">
                        <div class="mb-4">
                            <label class="page-label">Kategori</label>
                            <select id="pKategori" class="page-input font-black text-xs uppercase">
                                <option value="Makanan">🍛 Makanan</option>
                                <option value="Minuman">🥤 Minuman</option>
                                <option value="Snack">🍿 Snack</option>
                                <option value="Alat">🛠️ Alat</option>
                                <option value="Lainnya">📦 Lainnya</option>
                            </select>
                        </div>
                        <div>
                            <label class="page-label">Ganti Foto</label>
                            <input type="file" id="pGambar" accept="image/*" class="page-input text-[10px]" onchange="previewImage(this)"/>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="page-label">Kode SKU</label>
                        <input type="text" id="pKode" placeholder="EX: PRD-001" class="page-input"/>
                    </div>
                    <div>
                        <label class="page-label">Nama Produk *</label>
                        <input type="text" id="pNama" placeholder="Nama item" class="page-input"/>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="page-label">Harga Beli</label>
                        <input type="number" id="pHargaBeli" placeholder="Rp 0" class="page-input"/>
                    </div>
                    <div>
                        <label class="page-label">Harga Jual *</label>
                        <input type="number" id="pHargaJual" placeholder="Rp 0" class="page-input"/>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-4 mb-6">
                    <div>
                        <label class="page-label">Stok</label>
                        <input type="number" id="pStok" placeholder="0" class="page-input"/>
                    </div>
                    <div>
                        <label class="page-label">Stok Min.</label>
                        <input type="number" id="pStokMin" placeholder="5" class="page-input"/>
                    </div>
                    <div>
                        <label class="page-label">Satuan</label>
                        <input type="text" id="pSatuan" placeholder="pcs" class="page-input"/>
                    </div>
                </div>

                <div class="flex gap-4">
                    <button onclick="saveProduk()" class="page-btn page-btn-primary flex-1">SIMPAN DATA PRODUK</button>
                    <button onclick="document.getElementById('modalProduk').classList.add('hidden')" class="page-btn page-btn-outline">BATAL</button>
                </div>
            </div>
        </div>
    </div>`;

    loadTableProduk();
}

function previewImage(input) {
    const preview = document.getElementById('pPreview');
    const icon = document.getElementById('pPreviewIcon');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.classList.remove('hidden');
            icon.classList.add('hidden');
        }
        reader.readAsDataURL(input.files[0]);
    }
}

async function loadTableProduk() {
    const s = document.getElementById('searchProduk')?.value || '';
    const res = await api.get(`/produk?search=${s}`);
    const tbody = document.getElementById('produkTable');
    if (!tbody) return;
    if (!res?.data?.length) { 
        tbody.innerHTML = '<tr><td colspan="5" style="padding:4rem;text-align:center;font-weight:700;color:#a1a1a1">Produk tidak ditemukan</td></tr>'; 
        return; 
    }
    
    // Update stats
    document.getElementById('statTotalProduk').textContent = res.data.length;
    const rendah = res.data.filter(p => p.stok <= p.stokMinimum).length;
    document.getElementById('statStokRendah').textContent = rendah;
    document.getElementById('statNilaiAset').textContent = res.data.length;

    tbody.innerHTML = res.data.map(p => {
        const isRendah = p.stok <= p.stokMinimum;
        const isHabis = p.stok === 0;
        return `
        <tr class="hover:bg-[#f9f9f9] transition-colors">
            <td>
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 border-2 border-black bg-[#f3f3f4] flex items-center justify-center overflow-hidden flex-shrink-0">
                        ${p.gambar ? `<img src="/${p.gambar}" class="w-full h-full object-cover"/>` : '<span class="material-symbols-outlined text-black/10">inventory_2</span>'}
                    </div>
                    <div class="min-w-0">
                        <p class="font-black text-sm uppercase truncate">${p.nama}</p>
                        <p class="text-[10px] font-bold text-[#a1a1a1]">SKU: ${p.kode || '-'}</p>
                    </div>
                </div>
            </td>
            <td><span class="page-badge page-badge-gray">${p.kategori?.nama || 'UMUM'}</span></td>
            <td>
                <span class="font-black text-sm ${isHabis ? 'text-[#FF3B30]' : isRendah ? 'text-[#92400e]' : 'text-black'}">
                    ${p.stok} ${p.satuan}
                </span>
                ${isHabis ? '<span class="ml-1 text-[8px] font-black bg-[#FF3B30] text-white px-1">HABIS</span>' : isRendah ? '<span class="ml-1 text-[8px] font-black bg-[#92400e] text-white px-1">LOW</span>' : ''}
            </td>
            <td class="font-black text-[#6a5f00]">${fmt(p.hargaJual)}</td>
            <td>
                <div class="flex gap-2 justify-center">
                    <button onclick="editProduk(${p.id})" class="page-btn page-btn-outline page-btn-sm">
                        <span class="material-symbols-outlined" style="font-size:14px">edit</span>
                    </button>
                    <button onclick="hapusProduk(${p.id}, '${p.nama}')" class="page-btn page-btn-outline page-btn-sm" style="color:#FF3B30; border-color:#FF3B30">
                        <span class="material-symbols-outlined" style="font-size:14px">delete</span>
                    </button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function showModalProduk() { 
    document.getElementById('modalTitle').textContent = 'Tambah Produk Baru';
    document.getElementById('pId').value = '';
    document.getElementById('pKategori').value = 'Lainnya';
    document.getElementById('pKode').value = '';
    document.getElementById('pNama').value = '';
    document.getElementById('pHargaBeli').value = '';
    document.getElementById('pHargaJual').value = '';
    document.getElementById('pStok').value = '';
    document.getElementById('pStokMin').value = '5';
    document.getElementById('pSatuan').value = 'pcs';
    document.getElementById('pGambar').value = '';
    document.getElementById('pPreview').classList.add('hidden');
    document.getElementById('pPreviewIcon').classList.remove('hidden');
    document.getElementById('produkError').classList.add('hidden');
    document.getElementById('modalProduk').classList.remove('hidden'); 
}

async function saveProduk() {
    const id = document.getElementById('pId').value;
    const nama = document.getElementById('pNama').value.trim();
    const hargaJual = document.getElementById('pHargaJual').value;
    const errEl = document.getElementById('produkError');
    const btn = document.querySelector('button[onclick="saveProduk()"]');

    if (!nama || !hargaJual) { 
        errEl.textContent = 'Nama produk dan harga jual wajib diisi!'; 
        errEl.classList.remove('hidden'); 
        return; 
    }
    
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = 'PROSES...';

    const fileInput = document.getElementById('pGambar');
    let gambarUrl = null;
    
    if (fileInput.files && fileInput.files[0]) {
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        formData.append('type', 'produk');
        
        try {
            const upRes = await fetch('/api/upload.php', { method: 'POST', body: formData });
            const upData = await upRes.json();
            if (upData.success) {
                gambarUrl = upData.url;
            } else {
                throw new Error(upData.message);
            }
        } catch (e) {
            errEl.textContent = 'Gagal upload foto: ' + e.message;
            errEl.classList.remove('hidden');
            btn.disabled = false;
            btn.textContent = originalText;
            return;
        }
    }

    const payload = { 
        kode: document.getElementById('pKode').value, 
        nama, 
        kategori: document.getElementById('pKategori').value,
        hargaBeli: document.getElementById('pHargaBeli').value || 0, 
        hargaJual, 
        stok: document.getElementById('pStok').value || 0, 
        stokMinimum: document.getElementById('pStokMin').value || 5, 
        satuan: document.getElementById('pSatuan').value || 'pcs', 
        deskripsi: '' 
    };
    if (gambarUrl) payload.gambar = gambarUrl;

    const res = id ? await api.put(`/produk/${id}`, payload) : await api.post('/produk', payload);

    if (res?.success) {
        document.getElementById('modalProduk').classList.add('hidden');
        loadTableProduk();
    } else {
        errEl.textContent = res?.message || 'Gagal menyimpan data';
        errEl.classList.remove('hidden');
    }
    
    btn.disabled = false;
    btn.textContent = originalText;
}

async function editProduk(id) {
    const res = await api.get('/produk');
    if(res?.data) {
        const p = res.data.find(x => x.id === id);
        if(p) {
            document.getElementById('modalTitle').textContent = 'Edit Data Produk';
            document.getElementById('pId').value = p.id;
            document.getElementById('pKategori').value = p.kategori?.nama || 'Lainnya';
            document.getElementById('pKode').value = p.kode || '';
            document.getElementById('pNama').value = p.nama || '';
            document.getElementById('pHargaBeli').value = p.hargaBeli || '';
            document.getElementById('pHargaJual').value = p.hargaJual || '';
            document.getElementById('pStok').value = p.stok || '';
            document.getElementById('pStokMin').value = p.stokMinimum || '';
            document.getElementById('pSatuan').value = p.satuan || '';
            document.getElementById('pGambar').value = '';
            
            const preview = document.getElementById('pPreview');
            const icon = document.getElementById('pPreviewIcon');
            if (p.gambar) {
                preview.src = '/' + p.gambar;
                preview.classList.remove('hidden');
                icon.classList.add('hidden');
            } else {
                preview.classList.add('hidden');
                icon.classList.remove('hidden');
            }
            
            document.getElementById('produkError').classList.add('hidden');
            document.getElementById('modalProduk').classList.remove('hidden');
        }
    }
}

async function hapusProduk(id, nama) {
    showConfirm(`Apakah Anda yakin ingin menghapus produk "${nama}"?`, async () => {
        const res = await api.delete(`/produk/${id}`);
        if (res?.success) {
            loadTableProduk();
        } else {
            alert('Gagal menghapus produk: ' + (res?.message || 'Error'));
        }
    });
}