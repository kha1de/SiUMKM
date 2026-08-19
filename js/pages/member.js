let members = [];
let editId = null;

async function renderMember() {
    const el = document.getElementById('pageContent');
    el.innerHTML = `
    <div class="animate-up">
        <div class="pg-flex-between pg-mb">
            <div>
                <h1 class="pg-page-title">Data Member</h1>
                <p class="pg-page-sub">Kelola data member setia Anda.</p>
            </div>
            <button onclick="showModalMember()" class="page-btn page-btn-primary">
                <span class="material-symbols-outlined">person_add</span> TAMBAH MEMBER
            </button>
        </div>

        <div class="pg-section">
            <div class="pg-section-head">
                <span class="pg-section-title">Daftar Member</span>
                <div style="position:relative; width:300px">
                    <span class="material-symbols-outlined" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:20px;color:#5e5e5e">search</span>
                    <input type="text" id="searchMember" placeholder="Cari nama atau telepon..." oninput="displayTableMember()" class="page-input" style="padding-left:3rem"/>
                </div>
            </div>
            <div style="overflow-x:auto">
                <table class="page-table">
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Telepon</th>
                            <th>Email</th>
                            <th>Poin</th>
                            <th>Total Transaksi</th>
                            <th>Bergabung</th>
                            <th style="text-align:center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="memberTable">
                        <tr><td colspan="7" class="empty-state" style="padding:4rem;text-align:center;font-weight:700;color:#a1a1a1">Memuat data...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Modal Member -->
    <div class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-6 hidden" id="modalMember">
        <div class="pg-section animate-up" style="width:100%; max-width:500px; margin-bottom:0">
            <div class="pg-section-head">
                <span class="pg-section-title" id="modalMemberTitle">Tambah Member</span>
                <button onclick="closeModalMember()" class="w-8 h-8 flex items-center justify-center border-2 border-black hover:bg-[#eee] transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <div class="pg-section-body">
                <div id="memberError" class="hidden border-2 border-[#FF3B30] bg-[#fee2e2] text-[#FF3B30] p-4 mb-4 text-xs font-black uppercase"></div>
                
                <div class="mb-4">
                    <label class="page-label">Nama Lengkap *</label>
                    <input type="text" id="memNama" placeholder="Nama member" class="page-input"/>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="page-label">No. Telepon *</label>
                        <input type="text" id="memTelp" placeholder="08xx-xxxx" class="page-input"/>
                    </div>
                    <div>
                        <label class="page-label">Email</label>
                        <input type="email" id="memEmail" placeholder="email@..." class="page-input"/>
                    </div>
                </div>
                
                <div class="mb-6">
                    <label class="page-label">Poin Member</label>
                    <input type="number" id="memPoin" placeholder="0" class="page-input"/>
                </div>
                
                <div class="flex gap-4">
                    <button onclick="saveMember()" class="page-btn page-btn-primary flex-1">SIMPAN DATA</button>
                    <button onclick="closeModalMember()" class="page-btn page-btn-outline">BATAL</button>
                </div>
            </div>
        </div>
    </div>`;
    loadDataMember();
}

async function loadDataMember() {
    const res = await api.get('/member');
    if (res.success) {
        members = res.data;
        displayTableMember();
    } else {
        document.getElementById('memberTable').innerHTML = `<tr><td colspan="7" class="empty-state" style="padding:4rem;text-align:center">${res.message}</td></tr>`;
    }
}

function displayTableMember() {
    const tbody = document.getElementById('memberTable');
    if (!tbody) return;
    const s = document.getElementById('searchMember')?.value?.toLowerCase() || '';
    const filtered = members.filter(p => !s || p.nama.toLowerCase().includes(s) || (p.telp && p.telp.includes(s)));
    
    if (!filtered.length) { 
        tbody.innerHTML = '<tr><td colspan="7" style="padding:4rem;text-align:center;font-weight:700;color:#a1a1a1">Member tidak ditemukan</td></tr>'; 
        return; 
    }

    tbody.innerHTML = filtered.map(p => `
    <tr>
        <td style="font-weight:800">${p.nama}</td>
        <td style="font-size:0.875rem">${p.telp || '-'}</td>
        <td style="font-size:0.875rem;color:#5e5e5e">${p.email || '-'}</td>
        <td>
            <span class="page-badge page-badge-yellow">
                <span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle">grade</span> ${p.poin}
            </span>
        </td>
        <td style="font-weight:800; text-align:center">${p.totalTransaksi || 0}x</td>
        <td style="font-size:0.875rem;color:#5e5e5e">${p.bergabung || '-'}</td>
        <td style="text-align:center; white-space:nowrap">
            <button onclick="editMember(${p.id})" class="page-btn page-btn-outline page-btn-sm" style="margin-right:0.25rem">
                <span class="material-symbols-outlined" style="font-size:14px">edit</span>
            </button>
            <button onclick="deleteMember(${p.id})" class="page-btn page-btn-outline page-btn-sm" style="color:#FF3B30; border-color:#FF3B30">
                <span class="material-symbols-outlined" style="font-size:14px">delete</span>
            </button>
        </td>
    </tr>`).join('');
}

function showModalMember() {
    editId = null;
    document.getElementById('modalMemberTitle').textContent = 'Tambah Member Baru';
    document.getElementById('memNama').value = '';
    document.getElementById('memTelp').value = '';
    document.getElementById('memEmail').value = '';
    document.getElementById('memPoin').value = '0';
    document.getElementById('memberError').classList.add('hidden');
    document.getElementById('modalMember').classList.remove('hidden');
}

function closeModalMember() {
    document.getElementById('modalMember').classList.add('hidden');
}

function editMember(id) {
    const m = members.find(x => x.id === id);
    if (!m) return;
    
    editId = id;
    document.getElementById('modalMemberTitle').textContent = 'Edit Data Member';
    document.getElementById('memNama').value = m.nama;
    document.getElementById('memTelp').value = m.telp || '';
    document.getElementById('memEmail').value = m.email || '';
    document.getElementById('memPoin').value = m.poin;
    document.getElementById('memberError').classList.add('hidden');
    document.getElementById('modalMember').classList.remove('hidden');
}

async function saveMember() {
    const nama = document.getElementById('memNama').value.trim();
    const telp = document.getElementById('memTelp').value.trim();
    const email = document.getElementById('memEmail').value.trim();
    const poin = parseInt(document.getElementById('memPoin').value) || 0;
    const errEl = document.getElementById('memberError');
    
    if (!nama || !telp) { 
        errEl.textContent = 'Nama dan nomor telepon wajib diisi!'; 
        errEl.classList.remove('hidden'); 
        return; 
    }

    const payload = { nama, telp, email, poin };
    let res;
    
    if (editId) {
        res = await api.put(`/member/${editId}`, payload);
    } else {
        res = await api.post('/member', payload);
    }

    if (res.success) {
        closeModalMember();
        loadDataMember();
    } else {
        errEl.textContent = res.message;
        errEl.classList.remove('hidden');
    }
}

async function deleteMember(id) {
    showConfirm('Apakah Anda yakin ingin menghapus member ini?', async () => {
        const res = await api.delete(`/member/${id}`);
        if (res.success) {
            loadDataMember();
        } else {
            alert(res.message);
        }
    });
}


