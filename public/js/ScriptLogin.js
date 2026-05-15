(function () {
    // Elementos del DOM (Login)
    const loginForm = document.getElementById('loginForm');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const message = document.getElementById('message');

    // Elementos del DOM (Módulo de Seguridad)
    const recoverySection = document.getElementById('recoverySection');
    const showRecoveryBtn = document.getElementById('show-recovery');
    const cancelRecoveryBtn = document.getElementById('btn-cancel-recovery');
    const btnRecoveryMain = document.getElementById('btn-recovery-main');
    const recoveryEmailInput = document.getElementById('recovery-email');
    const stepQuestionDiv = document.getElementById('step-question');
    const displayQuestionLabel = document.getElementById('display-question');
    const recoveryAnswerInput = document.getElementById('recovery-answer');

    let recoveryStep = 1; // 1: Verificar Email, 2: Verificar Respuesta

    // SVGs originales para contraseña
    const eyeSvg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M1.5 12s4-7 10.5-7S22.5 12 22.5 12s-4 7-10.5 7S1.5 12 1.5 12z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const eyeOffSvg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M3 3l18 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.47 10.47A3 3 0 0113.53 13.53" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.21 12.7C3.67 15.55 7.17 18 12 18c6.5 0 10.5-6 10.5-6s-1.99-2.55-4.58-4.19" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    // --- LÓGICA DE INTERCAMBIO DE FORMULARIOS ---

    if (showRecoveryBtn) {
        showRecoveryBtn.addEventListener('click', () => {
            loginForm.style.display = 'none';
            recoverySection.style.display = 'block';
            message.classList.remove('show');
        });
    }

    if (cancelRecoveryBtn) {
        cancelRecoveryBtn.addEventListener('click', () => {
            loginForm.style.display = 'block';
            recoverySection.style.display = 'none';
            resetRecovery();
        });
    }

    function resetRecovery() {
        recoveryStep = 1;
        stepQuestionDiv.style.display = 'none';
        recoveryEmailInput.parentElement.parentElement.style.display = 'block';
        btnRecoveryMain.querySelector('.btn-text').textContent = 'VERIFICAR CORREO';
        recoveryEmailInput.value = '';
        recoveryAnswerInput.value = '';
        message.classList.remove('show');
    }

    // --- PROCESO DE RECUPERACIÓN (FETCH) ---

    btnRecoveryMain.addEventListener('click', async () => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        
        if (recoveryStep === 1) {
            const email = recoveryEmailInput.value.trim();
            if (!email) return alert('Por favor ingresa tu correo.');

            btnRecoveryMain.classList.add('loading');
            
            try {
                const response = await fetch('/seguridad/preguntas-desafio', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify({ email: email })
                });

                const data = await response.json();
                btnRecoveryMain.classList.remove('loading');

                if (response.ok) {
                    recoveryEmailInput.parentElement.parentElement.style.display = 'none';
                    stepQuestionDiv.style.display = 'block';
                    displayQuestionLabel.textContent = data.preguntas[0].pregunta;
                    btnRecoveryMain.querySelector('.btn-text').textContent = 'VALIDAR RESPUESTA';
                    recoveryStep = 2;
                } else {
                    message.textContent = data.message || 'Error al buscar preguntas.';
                    message.className = 'show error';
                }
            } catch (error) {
                btnRecoveryMain.classList.remove('loading');
                console.error(error);
            }

        } else if (recoveryStep === 2) {
            const answer = recoveryAnswerInput.value.trim();
            if (!answer) return alert('Debes escribir una respuesta.');

            btnRecoveryMain.classList.add('loading');

            try {
                const response = await fetch('/seguridad/verificar-respuesta', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify({
                        email: recoveryEmailInput.value.trim(),
                        pregunta_id: 1, 
                        respuesta: answer
                    })
                });

                const data = await response.json();
                btnRecoveryMain.classList.remove('loading');

                if (response.ok) {
                    message.textContent = '¡Identidad verificada! Redirigiendo al cambio de clave...';
                    message.className = 'show success';
                    setTimeout(() => {
                        // REDIRECCIÓN MODIFICADA: Ahora apunta a la nueva ruta en web.php
                        window.location.href = '/seguridad/restablecer-clave'; 
                    }, 2000);
                } else {
                    message.textContent = data.message || 'Respuesta incorrecta.';
                    message.className = 'show error';
                }
            } catch (error) {
                btnRecoveryMain.classList.remove('loading');
                console.error(error);
            }
        }
    });

    // --- TUS FUNCIONES ORIGINALES (MOSTRAR/OCULTAR PASS) ---

    const toggleButtons = document.querySelectorAll('.toggle-pass');
    toggleButtons.forEach(btn => {
        btn.innerHTML = eyeSvg;
        btn.addEventListener('click', () => {
            const row = btn.closest('.input-row');
            if (!row) return;
            const inp = row.querySelector('input[type="password"], input[type="text"]');
            if (!inp) return;
            const isPassword = inp.type === 'password';
            inp.type = isPassword ? 'text' : 'password';
            btn.innerHTML = isPassword ? eyeOffSvg : eyeSvg;
            inp.focus();
        });
    });

    // --- FORMULARIO DE LOGIN ORIGINAL ---

    if (loginForm) {
        loginForm.addEventListener('submit', async (ev) => {
            ev.preventDefault();
            message.classList.remove('show');
            const u = username.value.trim();
            const p = password.value;
            
            if (!u || !p) {
                loginForm.classList.add('shake');
                message.textContent = 'Por favor completa todos los campos.';
                message.className = 'show error';
                setTimeout(() => loginForm.classList.remove('shake'), 500);
                return;
            }

            const btn = loginForm.querySelector('.btn');
            btn.classList.add('loading');

            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                const response = await fetch('login', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify({ username: u, password: p })
                });

                btn.classList.remove('loading');
                const data = await response.json();

                if (!response.ok) {
                    message.textContent = data.message || 'Credenciales incorrectas.';
                    message.className = 'show error';
                } else {
                    window.location.href = '/redirect-after-login';
                }
            } catch (error) {
                btn.classList.remove('loading');
                message.textContent = 'Error de conexión.';
                message.className = 'show error';
            }
        });
    }
})();