async function doLogin(e) {
    e.preventDefault();
    const btn = document.getElementById('loginBtn');
    const err = document.getElementById('loginError');
    btn.textContent = 'Memproses...';
    btn.disabled = true;
    err.classList.add('hidden');

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (data.success) {
            // Login sukses
            localStorage.setItem('siumkm_token', data.token);
            localStorage.setItem('siumkm_user', JSON.stringify(data.user));
            window.location.href = 'index.html';
        } else {
            // Login gagal
            err.textContent = data.message || 'Email atau password salah!';
            err.classList.remove('hidden');
            btn.textContent = 'Masuk';
            btn.disabled = false;
        }
    } catch (error) {
        console.error('Login Error:', error);
        err.textContent = 'Gagal menghubungi server!';
        err.classList.remove('hidden');
        btn.textContent = 'Masuk';
        btn.disabled = false;
    }
}

// Redirect jika sudah login
if (localStorage.getItem('siumkm_token')) window.location.href = 'index.html';