let rekeningBank = [];

async function renderSettings() {
    const el = document.getElementById('pageContent');
    el.innerHTML = `<div class="empty-state" style="padding:4rem; text-align:center; font-weight:900; color:#a1a1a1">MEMUAT KONFIGURASI...</div>`;

    const res = await api.get('/settings');
    const data = res?.data || {};
    
    rekeningBank = data.rekening_bank || [];

    el.innerHTML = `
    <div class="animate-up">
        <div class="pg-flex-between pg-mb">
            <div>
                <h1 class="pg-page-title">Pengaturan Toko</h1>
                <p class="pg-page-sub">Konfigurasi profil, struk belanja, dan metode pembayaran.</p>
            </div>
            <button onclick="simpanSettings()" class="page-btn page-btn-primary">
                <span class="material-symbols-outlined">save</span> SIMPAN PERUBAHAN
            </button>
        </div>

        <div class="pg-grid-2">
            <!-- Kolom Kiri: Identitas -->
            <div class="flex flex-col gap-6">
                <div class="pg-section">
                    <div class="pg-section-head"><span class="pg-section-title">Profil Bisnis</span></div>
                    <div class="pg-section-body">
                        <div class="mb-4">
                            <label class="page-label">Nama UMKM / Toko</label>
                            <input type="text" id="setNama" class="page-input" value="${data.nama_toko || ''}" />
                        </div>
                        <div class="mb-4">
                            <label class="page-label">Slogan (Muncul di Struk)</label>
                            <input type="text" id="setSlogan" class="page-input" value="${data.slogan || ''}" placeholder="Contoh: Kualitas Terbaik Harga Hemat" />
                        </div>
                        <div class="mb-4">
                            <label class="page-label">Alamat Lengkap</label>
                            <textarea id="setAlamat" class="page-input" rows="3">${data.alamat_toko || ''}</textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="page-label">WhatsApp / Telepon</label>
                                <input type="text" id="setKontak" class="page-input" value="${data.kontak_toko || ''}" />
                            </div>
                            <div>
                                <label class="page-label">Email</label>
                                <input type="text" id="setEmail" class="page-input" value="${data.email_toko || ''}" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pg-section">
                    <div class="pg-section-head"><span class="pg-section-title">Metode Pembayaran QRIS</span></div>
                    <div class="pg-section-body">
                        <div class="flex gap-6 items-start">
                            <div class="w-32 h-32 border-3 border-black bg-[#f3f3f4] flex items-center justify-center overflow-hidden flex-shrink-0">
                                ${data.qris_image ? `<img id="qrisPreview" src="/${data.qris_image}" class="w-full h-full object-contain" />` : `<span id="qrisPreviewText" class="text-[10px] font-black uppercase text-[#a1a1a1]">No QR</span><img id="qrisPreview" class="hidden w-full h-full object-contain" />`}
                            </div>
                            <div class="flex-1">
                                <div class="mb-4">
                                    <label class="page-label">Upload Kode QRIS</label>
                                    <input type="file" id="qrisFile" accept="image/*" class="page-input text-[10px]" onchange="uploadQris()" />
                                    <input type="hidden" id="qrisImageUrl" value="${data.qris_image || ''}" />
                                </div>
                                <div>
                                    <label class="page-label">Nama Merchant</label>
                                    <input type="text" id="setQrisMerchant" class="page-input" value="${data.qris_merchant || ''}" placeholder="EX: TOKO MAJU JAYA" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Kolom Kanan: Operasional -->
            <div class="flex flex-col gap-6">
                <div class="pg-section">
                    <div class="pg-section-head"><span class="pg-section-title">Konfigurasi Struk</span></div>
                    <div class="pg-section-body">
                        <label class="page-label">Ukuran Kertas Printer</label>
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <label class="flex items-center gap-3 p-4 border-3 border-black cursor-pointer transition-all ${(!data.ukuran_struk || data.ukuran_struk === '58mm') ? 'bg-[var(--neo-primary)]' : 'bg-white'}" id="label58">
                                <input type="radio" name="ukuran_struk" value="58mm" ${(!data.ukuran_struk || data.ukuran_struk === '58mm') ? 'checked' : ''} onchange="updateStrukUI('58mm')" class="accent-black">
                                <span class="text-xs font-black uppercase">58mm (Kecil)</span>
                            </label>
                            <label class="flex items-center gap-3 p-4 border-3 border-black cursor-pointer transition-all ${data.ukuran_struk === '80mm' ? 'bg-[var(--neo-primary)]' : 'bg-white'}" id="label80">
                                <input type="radio" name="ukuran_struk" value="80mm" ${data.ukuran_struk === '80mm' ? 'checked' : ''} onchange="updateStrukUI('80mm')" class="accent-black">
                                <span class="text-xs font-black uppercase">80mm (Standar)</span>
                            </label>
                        </div>
                        <div>
                            <label class="page-label">Pesan Kaki Struk (Footer)</label>
                            <textarea id="setFooter" class="page-input" rows="2" placeholder="Contoh: Barang yang sudah dibeli tidak dapat ditukar">${data.footer_struk || ''}</textarea>
                        </div>
                    </div>
                </div>

                <div class="pg-section">
                    <div class="pg-section-head flex justify-between items-center">
                        <span class="pg-section-title">Daftar Rekening Bank</span>
                        <button onclick="tambahBank()" class="page-btn page-btn-outline !py-1 !px-3 !text-[10px]">
                            <span class="material-symbols-outlined text-xs">add</span> TAMBAH
                        </button>
                    </div>
                    <div class="pg-section-body">
                        <div id="bankList" class="flex flex-col gap-3"></div>
                        ${rekeningBank.length === 0 ? '<div id="bankEmpty" class="py-10 text-center text-[10px] font-black uppercase text-[#a1a1a1]">Belum ada rekening bank yang terdaftar</div>' : ''}
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    renderBank();
}

function updateStrukUI(val) {
    document.getElementById('label58').style.background = val === '58mm' ? 'var(--neo-primary)' : 'white';
    document.getElementById('label80').style.background = val === '80mm' ? 'var(--neo-primary)' : 'white';
}

function renderBank() {
    const el = document.getElementById('bankList');
    if (!el) return;
    const empty = document.getElementById('bankEmpty');
    if (empty) empty.style.display = rekeningBank.length ? 'none' : 'block';
    
    el.innerHTML = rekeningBank.map((b, i) => `
        <div class="flex gap-4 items-end p-4 border-2 border-black bg-[#fdfdfd] animate-up relative">
            <div class="flex-1">
                <label class="page-label text-[9px] mb-1">Bank</label>
                <input type="text" class="page-input !p-2 !text-xs font-black uppercase" value="${b.bank}" onchange="rekeningBank[${i}].bank=this.value" placeholder="BCA / Mandiri / dll" />
            </div>
            <div class="flex-[1.5]">
                <label class="page-label text-[9px] mb-1">Nomor Rekening</label>
                <input type="text" class="page-input !p-2 !text-xs font-black" value="${b.no_rek}" onchange="rekeningBank[${i}].no_rek=this.value" placeholder="000-000-000" />
            </div>
            <div class="flex-[1.5]">
                <label class="page-label text-[9px] mb-1">Nama Pemilik</label>
                <input type="text" class="page-input !p-2 !text-xs font-black uppercase" value="${b.atas_nama}" onchange="rekeningBank[${i}].atas_nama=this.value" placeholder="A.N. NAMA ANDA" />
            </div>
            <button onclick="hapusBank(${i})" class="w-8 h-8 flex items-center justify-center border-2 border-[#FF3B30] text-[#FF3B30] hover:bg-[#FF3B30] hover:text-white transition-all">
                <span class="material-symbols-outlined text-sm">delete</span>
            </button>
        </div>
    `).join('');
}

function tambahBank() {
    rekeningBank.push({bank: '', no_rek: '', atas_nama: ''});
    renderBank();
}

function hapusBank(i) {
    rekeningBank.splice(i, 1);
    renderBank();
}

async function uploadQris() {
    const file = document.getElementById('qrisFile').files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    
    const res = await fetch('/api/upload.php', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) {
        const preview = document.getElementById('qrisPreview');
        preview.src = '/' + data.url;
        preview.classList.remove('hidden');
        if(document.getElementById('qrisPreviewText')) document.getElementById('qrisPreviewText').classList.add('hidden');
        document.getElementById('qrisImageUrl').value = data.url;
    } else {
        alert('Gagal upload: ' + data.message);
    }
}

async function simpanSettings() {
    const btn = document.querySelector('button[onclick="simpanSettings()"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> MENYIMPAN...';
    btn.disabled = true;

    const payload = {
        nama_toko: document.getElementById('setNama').value,
        slogan: document.getElementById('setSlogan').value,
        alamat_toko: document.getElementById('setAlamat').value,
        kontak_toko: document.getElementById('setKontak').value,
        email_toko: document.getElementById('setEmail').value,
        ukuran_struk: document.querySelector('input[name="ukuran_struk"]:checked')?.value || '58mm',
        footer_struk: document.getElementById('setFooter').value,
        qris_image: document.getElementById('qrisImageUrl').value,
        qris_merchant: document.getElementById('setQrisMerchant').value,
        rekening_bank: rekeningBank
    };

    const res = await api.put('/settings', payload);
    if (res?.success) {
        alert('Berhasil! Pengaturan toko telah diperbarui.');
        window.location.reload(); 
    } else {
        alert('Maaf, terjadi kesalahan: ' + res?.message);
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

