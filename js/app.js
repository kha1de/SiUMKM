// Cek auth
if (!localStorage.getItem('siumkm_token')) window.location.href = 'login.html';

const user = getUser();
document.getElementById('userName').textContent = user.nama || 'Admin';
document.getElementById('userRole').textContent = user.role || 'admin';
document.getElementById('userAvatar').textContent = (user.nama || 'A')[0].toUpperCase();

// Tidak ada server Socket.IO, notifikasi stok dinonaktifkan
const notifs = [];

function updateNotifUI() {
    const count = document.getElementById('notifCount');
    const list = document.getElementById('notifList');
    if (!count || !list) return;
    count.textContent = notifs.length;
    count.classList.toggle('hidden', notifs.length === 0);
    list.innerHTML = notifs.length
        ? notifs.slice(0, 5).map(n => `<div class="p-3 border-b border-black/10 text-sm font-medium">${n.pesan}</div>`).join('')
        : '<p class="p-4 text-sm text-[#5e5e5e] font-medium">Tidak ada notifikasi</p>';
}

function toggleNotif() {
    document.getElementById('notifDropdown').classList.toggle('hidden');
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('-translate-x-full');
}

function logout() {
    localStorage.removeItem('siumkm_token');
    localStorage.removeItem('siumkm_user');
    window.location.href = 'login.html';
}

// Router
const pages = {
    dashboard: { title: 'Dasbor', render: typeof renderDashboard !== 'undefined' ? renderDashboard : null },
    pos:       { title: 'Kasir (POS)', render: typeof renderPOS !== 'undefined' ? renderPOS : null },
    produk:    { title: 'Inventaris Produk', render: typeof renderProduk !== 'undefined' ? renderProduk : null },
    transaksi: { title: 'Riwayat Transaksi', render: typeof renderTransaksi !== 'undefined' ? renderTransaksi : null },
    member:    { title: 'Data Member', render: typeof renderMember !== 'undefined' ? renderMember : null },
    laporan:   { title: 'Laporan Keuangan', render: typeof renderLaporan !== 'undefined' ? renderLaporan : null },
    ai:        { title: '✨ AI Rekomendasi', render: typeof renderAI !== 'undefined' ? renderAI : null },
    settings:  { title: '⚙️ Pengaturan', render: typeof renderSettings !== 'undefined' ? renderSettings : null },
};

function navigate(page) {
    // Update active nav
    document.querySelectorAll('.nav-item').forEach(el => {
        if (el.dataset.page === page) {
            el.classList.remove('nav-inactive');
            el.classList.add('nav-active');
        } else {
            el.classList.remove('nav-active');
            el.classList.add('nav-inactive');
        }
    });

    const pageObj = pages[page];
    const titleEl = document.getElementById('pageTitle');
    const breadEl = document.getElementById('breadcrumb');
    if(titleEl) titleEl.textContent = pageObj?.title || page;
    if(breadEl) breadEl.textContent = pageObj?.title || page;

    // RESET pageContent styles & contents
    const content = document.getElementById('pageContent');
    if (!content) return;
    
    content.style.cssText = 'margin-left:280px;margin-top:96px;min-height:calc(100vh - 96px);padding:40px;background:#f9f9f9;display:block;';
    content.innerHTML = `
        <div class="flex flex-col items-center justify-center py-20 opacity-20">
            <div class="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="font-black uppercase tracking-[0.3em] text-[10px]">Memuat Modul...</p>
        </div>`;

    document.getElementById('notifDropdown')?.classList.add('hidden');

    // Small delay to show "loading" feel and ensure clean transition
    setTimeout(() => {
        const render = pages[page]?.render;
        if (render) {
            render();
        } else {
            content.innerHTML = `
                <div class="flex flex-col items-center justify-center py-20">
                    <span class="material-symbols-outlined text-6xl mb-4 text-[#a1a1a1]">construction</span>
                    <p class="font-black uppercase tracking-widest text-sm text-[#a1a1a1]">Halaman Sedang Dalam Pengembangan</p>
                    <button onclick="navigate('dashboard')" class="page-btn page-btn-outline mt-6">Kembali ke Beranda</button>
                </div>`;
        }
    }, 150);
}


document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', (e) => { e.preventDefault(); navigate(el.dataset.page); });
});

navigate('dashboard');