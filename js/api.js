// Global Custom Notification System (Neobrutalism Design)
if (typeof window !== 'undefined') {
    if (!document.getElementById('custom-alert-styles')) {
        const style = document.createElement('style');
        style.id = 'custom-alert-styles';
        style.textContent = `
            .custom-alert-btn {
                background: #FFE500 !important;
                color: black !important;
                border: 3px solid black !important;
                box-shadow: 3px 3px 0px black !important;
                font-weight: 900 !important;
                padding: 8px 24px !important;
                text-transform: uppercase !important;
                cursor: pointer !important;
                font-family: 'Space Grotesk', sans-serif !important;
                transition: all 0.1s !important;
                outline: none !important;
            }
            .custom-alert-btn:hover {
                transform: translate(-2px, -2px) !important;
                box-shadow: 5px 5px 0px black !important;
            }
            .custom-alert-btn:active {
                transform: translate(1px, 1px) !important;
                box-shadow: 1px 1px 0px black !important;
            }
            .custom-confirm-btn-cancel {
                background: white !important;
                color: black !important;
                border: 3px solid black !important;
                box-shadow: 3px 3px 0px black !important;
                font-weight: 900 !important;
                padding: 8px 24px !important;
                text-transform: uppercase !important;
                cursor: pointer !important;
                font-family: 'Space Grotesk', sans-serif !important;
                transition: all 0.1s !important;
                outline: none !important;
            }
            .custom-confirm-btn-cancel:hover {
                transform: translate(-2px, -2px) !important;
                box-shadow: 5px 5px 0px black !important;
            }
            .custom-confirm-btn-cancel:active {
                transform: translate(1px, 1px) !important;
                box-shadow: 1px 1px 0px black !important;
            }
        `;
        document.head.appendChild(style);
    }

    window.alert = function(message) {
        const overlay = document.createElement('div');
        overlay.className = 'custom-alert-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:999999;backdrop-filter:blur(4px);opacity:0;transition:opacity 0.2s ease-out;';
        
        overlay.innerHTML = `
            <div class="custom-alert-box" style="background:white;border:4px solid black;box-shadow:8px 8px 0px black;width:90%;max-width:400px;transform:scale(0.85);transition:transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);display:flex;flex-direction:column;font-family:\'Space Grotesk\', sans-serif">
                <div style="background:#FFE500;border-bottom:4px solid black;padding:12px 16px;display:flex;align-items:center;gap:8px">
                    <span class="material-symbols-outlined" style="font-weight:900;color:black">info</span>
                    <span style="font-weight:900;text-transform:uppercase;letter-spacing:1px;font-size:12px;color:black">Notifikasi</span>
                </div>
                <div style="padding:24px 20px;font-weight:800;font-size:14px;color:black;line-height:1.5;text-align:center">
                    ${message}
                </div>
                <div style="padding:12px 16px;border-top:2px solid #eee;display:flex;justify-content:center">
                    <button class="custom-alert-btn" id="custom-alert-ok-btn">OK</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '1';
            overlay.querySelector('.custom-alert-box').style.transform = 'scale(1)';
        }, 10);
        
        const closeAlert = () => {
            overlay.style.opacity = '0';
            overlay.querySelector('.custom-alert-box').style.transform = 'scale(0.85)';
            setTimeout(() => {
                overlay.remove();
            }, 200);
        };
        
        overlay.querySelector('#custom-alert-ok-btn').addEventListener('click', closeAlert);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeAlert();
        });
    };

    window.showConfirm = function(message, onConfirm, onCancel) {
        const overlay = document.createElement('div');
        overlay.className = 'custom-alert-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:999999;backdrop-filter:blur(4px);opacity:0;transition:opacity 0.2s ease-out;';
        
        overlay.innerHTML = `
            <div class="custom-alert-box" style="background:white;border:4px solid black;box-shadow:8px 8px 0px black;width:90%;max-width:400px;transform:scale(0.85);transition:transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);display:flex;flex-direction:column;font-family:\'Space Grotesk\', sans-serif">
                <div style="background:#FF3B30;color:white;border-bottom:4px solid black;padding:12px 16px;display:flex;align-items:center;gap:8px">
                    <span class="material-symbols-outlined" style="font-weight:900;color:white">help</span>
                    <span style="font-weight:900;text-transform:uppercase;letter-spacing:1px;font-size:12px;color:white">Konfirmasi</span>
                </div>
                <div style="padding:24px 20px;font-weight:800;font-size:14px;color:black;line-height:1.5;text-align:center">
                    ${message}
                </div>
                <div style="padding:12px 16px;border-top:2px solid #eee;display:flex;justify-content:center;gap:12px">
                    <button class="custom-confirm-btn-cancel" id="custom-confirm-cancel-btn">Batal</button>
                    <button class="custom-alert-btn" id="custom-confirm-ok-btn" style="background:#FF3B30 !important;color:white !important">Ya, Hapus</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '1';
            overlay.querySelector('.custom-alert-box').style.transform = 'scale(1)';
        }, 10);
        
        const closeConfirm = (confirmed) => {
            overlay.style.opacity = '0';
            overlay.querySelector('.custom-alert-box').style.transform = 'scale(0.85)';
            setTimeout(() => {
                overlay.remove();
                if (confirmed) {
                    if (typeof onConfirm === 'function') onConfirm();
                } else {
                    if (typeof onCancel === 'function') onCancel();
                }
            }, 200);
        };
        
        overlay.querySelector('#custom-confirm-ok-btn').addEventListener('click', () => closeConfirm(true));
        overlay.querySelector('#custom-confirm-cancel-btn').addEventListener('click', () => closeConfirm(false));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeConfirm(false);
        });
    };
}

const API_BASE = '/api';

function getToken() { return localStorage.getItem('siumkm_token'); }
function getUser() { return JSON.parse(localStorage.getItem('siumkm_user') || '{}'); }

async function apiFetch(path, options = {}) {
    console.log(`[API] ${options.method || 'GET'} ${path}`);
    
    let url = path;

    const queryStart = path.indexOf('?');
    const queryString = queryStart !== -1 ? path.substring(queryStart) : '';
    const cleanPath = queryStart !== -1 ? path.substring(0, queryStart) : path;

    // Mapping endpoint REST ke file PHP
    if (cleanPath.includes('/laporan/dashboard')) {
        url = '/api/dashboard.php' + queryString;
    } else if (cleanPath.includes('/laporan')) {
        url = '/api/laporan.php' + queryString;
    } else if (cleanPath.includes('/produk')) {
        url = '/api/produk.php';
        if (options.method === 'DELETE' || options.method === 'PUT') {
            const idMatch = cleanPath.match(/\/produk\/(\d+)/);
            if (idMatch) url = `/api/produk.php?id=${idMatch[1]}`;
        } else {
            url = '/api/produk.php' + queryString;
        }
    } else if (cleanPath.includes('/member')) {
        url = '/api/member.php';
        if (options.method === 'DELETE' || options.method === 'PUT') {
            const idMatch = cleanPath.match(/\/member\/(\d+)/);
            if (idMatch) url = `/api/member.php?id=${idMatch[1]}`;
        } else {
            url = '/api/member.php' + queryString;
        }
    } else if (cleanPath.includes('/transaksi')) {
        url = '/api/transaksi.php' + queryString;
    } else if (cleanPath.includes('/settings')) {
        url = '/api/settings.php' + queryString;
    } else {
        return { success: false, message: 'Endpoint tidak valid' };
    }

    try {
        const response = await fetch(url, {
            method: options.method || 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: options.body ? JSON.stringify(options.body) : undefined
        });
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, message: 'Gagal menghubungi server database' };
    }
}

const api = {
    get: (path) => apiFetch(path),
    post: (path, body) => apiFetch(path, { method: 'POST', body }),
    put: (path, body) => apiFetch(path, { method: 'PUT', body }),
    patch: (path, body) => apiFetch(path, { method: 'PATCH', body }),
    delete: (path) => apiFetch(path, { method: 'DELETE' }),
};

function fmt(n) {
    return 'Rp ' + parseFloat(n || 0).toLocaleString('id-ID');
}

function fmtTanggal(d) {
    return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}