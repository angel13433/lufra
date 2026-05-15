@extends('layouts.app')

@section('content')
<style>
    .recovery-wrapper {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        font-family: 'Segoe UI', sans-serif;
    }

    .recovery-card {
        background: rgba(255, 255, 255, 0.95);
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 450px;
        text-align: center;
    }

    .input-group {
        text-align: left;
        margin-bottom: 20px;
        position: relative;
    }

    .input-group label {
        display: block;
        margin-bottom: 8px;
        color: #2d3436;
        font-weight: 600;
    }

    .password-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    .password-wrapper input {
        width: 100%;
        padding: 12px 45px 12px 15px;
        border: 2px solid #e1e8ef;
        border-radius: 10px;
        outline: none;
        transition: all 0.3s;
    }

    .password-wrapper input:focus { border-color: #00cc18; }

    .toggle-pass {
        position: absolute;
        right: 15px;
        background: none;
        border: none;
        color: #636e72;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
    }

    .toggle-pass svg { width: 20px; height: 20px; }

    .strength-meter {
        height: 4px;
        width: 100%;
        background: #e1e8ef;
        margin-top: 8px;
        border-radius: 2px;
        overflow: hidden;
    }

    .strength-bar {
        height: 100%;
        width: 0;
        transition: all 0.3s;
    }

    .btn-update {
        width: 100%;
        padding: 14px;
        background: #00cc18;
        color: white;
        border: none;
        border-radius: 10px;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 5px 15px rgba(0, 204, 24, 0.3);
        transition: all 0.3s ease;
    }

    .btn-update:hover:not(:disabled) { background: #00a814; transform: translateY(-1px); }
    .btn-update:disabled { background: #a2a2a2; cursor: not-allowed; }

    .message {
        margin-top: 15px;
        padding: 12px;
        border-radius: 8px;
        display: none;
        font-size: 0.9rem;
        animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
    }
</style>

<div class="recovery-wrapper">
    <div class="recovery-card">
        <h2 style="color: #2d3436; margin-bottom: 10px;">Nueva Contraseña</h2>
        <p style="color: #636e72; margin-bottom: 25px;">Establece una clave segura para proteger tu cuenta en <strong>LUFRA2020</strong>.</p>

        <form id="resetPasswordForm">
            @csrf
            <div class="input-group">
                <label for="new_password">Nueva Contraseña</label>
                <div class="password-wrapper">
                    <input type="password" id="new_password" name="password" required placeholder="Mínimo 8 caracteres">
                    <button type="button" class="toggle-pass" onclick="toggleVisibility('new_password', this)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                </div>
                <div class="strength-meter"><div id="strength-bar" class="strength-bar"></div></div>
                <small id="strength-text" style="font-size: 0.75rem; color: #636e72;"></small>
            </div>

            <div class="input-group">
                <label for="confirm_password">Confirmar Contraseña</label>
                <div class="password-wrapper">
                    <input type="password" id="confirm_password" name="password_confirmation" required placeholder="Repite tu contraseña">
                    <button type="button" class="toggle-pass" onclick="toggleVisibility('confirm_password', this)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                </div>
            </div>

            <div id="reset-message" class="message"></div>

            <button type="submit" id="btn-reset-pass" class="btn-update">ACTUALIZAR CONTRASEÑA</button>
        </form>
    </div>
</div>

<script>
    function toggleVisibility(id, btn) {
        const input = document.getElementById(id);
        const isPass = input.type === "password";
        input.type = isPass ? "text" : "password";
        btn.style.color = isPass ? "#00cc18" : "#636e72";
    }

    const passInput = document.getElementById('new_password');
    const bar = document.getElementById('strength-bar');
    const text = document.getElementById('strength-text');

    if(passInput) {
        passInput.addEventListener('input', () => {
            const val = passInput.value;
            let strength = 0;
            if (val.length >= 8) strength++;
            if (/[A-Z]/.test(val)) strength++;
            if (/[0-9]/.test(val)) strength++;
            if (/[^A-Za-z0-9]/.test(val)) strength++;

            const colors = ['#e1e8ef', '#ff4d4d', '#ffa500', '#2ecc71', '#00cc18'];
            const labels = ['', 'Muy débil', 'Débil', 'Media', 'Fuerte'];
            
            bar.style.width = (strength * 25) + '%';
            bar.style.backgroundColor = colors[strength];
            text.textContent = labels[strength];
        });
    }

    document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const password = document.getElementById('new_password').value;
        const password_confirmation = document.getElementById('confirm_password').value;
        const msg = document.getElementById('reset-message');
        const btn = document.getElementById('btn-reset-pass');

        msg.style.display = "none";

        if (password !== password_confirmation) {
            msg.textContent = "¡Las contraseñas no coinciden!";
            msg.style.display = "block";
            msg.style.background = "#ffeaa7";
            msg.style.color = "#856404";
            return;
        }

        btn.disabled = true;
        btn.textContent = "GUARDANDO...";

        try {
            const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            const response = await fetch('/seguridad/actualizar-clave', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token
                },
                body: JSON.stringify({ 
                    password: password, 
                    password_confirmation: password_confirmation 
                })
            });

            const data = await response.json();

            if (response.ok) {
                msg.textContent = "✓ ¡Éxito! Redirigiendo al login...";
                msg.style.display = "block";
                msg.style.background = "#d1f7d6";
                msg.style.color = "#155724";
                setTimeout(() => window.location.href = '/login', 2500);
            } else {
                msg.textContent = data.message || "Error al actualizar la contraseña.";
                msg.style.display = "block";
                msg.style.background = "#f8d7da";
                msg.style.color = "#721c24";
                btn.disabled = false;
                btn.textContent = "ACTUALIZAR CONTRASEÑA";
            }
        } catch (error) {
            console.error("Error detallado:", error);
            alert("No se pudo conectar con el servidor. Revisa tu conexión o intenta de nuevo.");
            btn.disabled = false;
            btn.textContent = "ACTUALIZAR CONTRASEÑA";
        }
    });
</script>
@endsection