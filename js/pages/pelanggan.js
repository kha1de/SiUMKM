const mockPelanggan = [
    { id: 1, nama: 'Budi Santoso', telp: '0812-3456-7890', email: 'budi@email.com', poin: 150, totalTransaksi: 5, bergabung: '2026-01-15' },
    { id: 2, nama: 'Siti Aminah', telp: '0856-7890-1234', email: '-', poin: 45, totalTransaksi: 2, bergabung: '2026-03-22' },
    { id: 3, nama: 'Rizki Pratama', telp: '0898-0011-2233', email: 'rizki@email.com', poin: 320, totalTransaksi: 12, bergabung: '2025-11-01' },
];

async function renderPelanggan() {
    const el = document.getElementById('pageContent');
    el.innerHTML = `
    <div class="animate-up">
        <div class="pg-flex-between pg-mb">
            <div>
                <h1 class="pg-page-title">Database Pelanggan</h1>
                <p class="pg-page-sub">Kelola profil dan loyalitas pelanggan setia Anda.</p>
            </div>
            <button onclick="showModalPelanggan()" class="page-btn page-btn-primary">
                <span class="material-symbols-outlined">person_add</span> TAMBAH PELANGGAN
            </button>
        </div>

        <div class="pg-section">
            <div class="pg-section-head">
                <span class="pg-section-title">Daftar Pelanggan Aktif</span>
                <div style="position:relative; width: 300px">
                    <span class="material-symbols-outlined" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:20px;color:#5e5e5e">search</span>
                    <input type="text" id="searchPelanggan" placeholder="Cari nama atau telepon..." oninput="loadTablePelanggan()" class="page-input" style="padding-left: 3rem"/>
                </div>
            </div>
            <div style="overflow-x:auto">
                <table class="page-table">
                    <thead>
                        <tr>
                            <th>Identitas Pelanggan</th>
                            <th>Info Kontak</th>
                            <th>Poin Loyalitas</th>
                            <th>Total Belanja</th>
                            <th>Tgl Bergabung</th>
                            <th style="text-align:center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="pelangganTable">
                        <tr><td colspan="6" class="empty-state" style="padding:4rem; text-align:center; font-weight:700; color:#a1a1a1">Memuat data...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Modal Pelanggan -->
    <div class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-6 hidden" id="modalPelanggan">
        <div class="pg-section animate-up" style="width:100%; max-width:450px; margin-bottom:0">
            <div class="pg-section-head">
                <span class="pg-section-title">Registrasi Pelanggan</span>
                <button onclick="document.getElementById('modalPelanggan').classList.add('hidden')" class="w-8 h-8 flex items-center justify-center border-2 border-black hover:bg-[#eee] transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <div class="pg-section-body">
                <div id="pelangganError" class="hidden border-2 border-[#FF3B30] bg-[#fee2e2] text-[#FF3B30] p-4 mb-4 text-xs font-black uppercase"></div>
                
                <div class="mb-4">
                    <label class="page-label">Nama Lengkap *</label>
                    <input type="text" id="pelNama" placeholder="Contoh: Andi Wijaya" class="page-input"/>
                </div>

                <div class="mb-4">
                    <label class="page-label">Nomor WhatsApp *</label>
                    <input type="text" id="pelTelp" placeholder="08xxxxxxxxx" class="page-input"/>
                </div>

                <div class="mb-6">
                    <label class="page-label">Email (Opsional)</label>
                    <input type="email" id="pelEmail" placeholder="pelanggan@email.com" class="page-input"/>
                </div>

                <div class="flex gap-4">
                    <button onclick="savePelanggan()" class="page-btn page-btn-primary flex-1">DAFTARKAN</button>
                    <button onclick="document.getElementById('modalPelanggan').classList.add('hidden')" class="page-btn page-btn-outline">BATAL</button>
                </div>
            </div>
        </div>
    </div>`;
    loadTablePelanggan();
}

async function loadTablePelanggan() {
    const tbody = document.getElementById('pelangganTable');
    if (!tbody) return;
    const s = document.getElementById('searchPelanggan')?.value?.toLowerCase() || '';
    const filtered = mockPelanggan.filter(p => !s || p.nama.toLowerCase().includes(s) || p.telp.includes(s));
    
    if (!filtered.length) { 
        tbody.innerHTML = '<tr><td colspan="6" style="padding:4rem; text-align:center; font-weight:700; color:#a1a1a1">Pelanggan tidak ditemukan</td></tr>'; 
        return; 
    }

    tbody.innerHTML = filtered.map(p => `
    <tr class="hover:bg-[#f9f9f9] transition-colors">
        <td>
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-black">
                    ${p.nama.charAt(0).toUpperCase()}
                </div>
                <span class="font-black text-sm uppercase">${p.nama}</span>
            </div>
        </td>
        <td>
            <p class="text-xs font-bold">${p.telp}</p>
            <p class="text-[10px] text-[#a1a1a1]">${p.email}</p>
        </td>
        <td>
            <span class="page-badge page-badge-yellow flex items-center gap-1 w-max">
                <span class="material-symbols-outlined text-[10px]">stars</span>
                ${p.poin} Poin
            </span>
        </td>
        <td>
            <span class="font-black text-xs text-[#16a34a]">${p.totalTransaksi} Transaksi</span>
        </td>
        <td class="text-xs font-medium text-[#5e5e5e]">${p.bergabung}</td>
        <td>
            <div class="flex justify-center">
                <button onclick="alert('Fitur edit segera hadir!')" class="page-btn page-btn-outline page-btn-sm">
                    <span class="material-symbols-outlined text-xs">edit</span>
                </button>
            </div>
        </td>
    </tr>`).join('');
}

function showModalPelanggan() { document.getElementById('modalPelanggan').classList.remove('hidden'); }

async function savePelanggan() {
    const nama = document.getElementById('pelNama').value.trim();
    const telp = document.getElementById('pelTelp').value.trim();
    const errEl = document.getElementById('pelangganError');
    if (!nama || !telp) { 
        errEl.textContent = 'Nama dan nomor telepon wajib diisi!'; 
        errEl.classList.remove('hidden'); 
        return; 
    }
    mockPelanggan.push({ 
        id: Date.now(), 
        nama, 
        telp, 
        email: document.getElementById('pelEmail').value || '-', 
        poin: 0, 
        totalTransaksi: 0, 
        bergabung: new Date().toISOString().slice(0, 10) 
    });
    document.getElementById('modalPelanggan').classList.add('hidden');
    loadTablePelanggan();
}

