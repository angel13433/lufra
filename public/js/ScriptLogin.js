(function () {
    // Elementos del DOM (Login)
    const loginForm = document.getElementById('loginForm');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    
    // NUEVOS CONTENEDORES EXCLUSIVOS INDEPENDIENTES
    const loginMessage = document.getElementById('login-message');
    const recoveryMessage = document.getElementById('recovery-message');

    // Elementos del DOM (Módulo de Seguridad)
    const recoverySection = document.getElementById('recoverySection');
    const showRecoveryBtn = document.getElementById('show-recovery');
    const cancelRecoveryBtn = document.getElementById('btn-cancel-recovery');
    const btnRecoveryMain = document.getElementById('btn-recovery-main');
    
    // Referencias del Nombre de Usuario
    const recoveryUsernameInput = document.getElementById('recovery-username');
    const stepQuestionDiv = document.getElementById('step-question');
    const displayQuestionLabel = document.getElementById('display-question');
    const recoveryAnswerInput = document.getElementById('recovery-answer');

    let recoveryStep = 1; // 1: Verificar Usuario, 2: Verificar Respuesta
    let activePreguntaId = null; // Almacenará el ID dinámico de la pregunta devuelta

    // SVGs originales para contraseña
    const eyeSvg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M1.5 12s4-7 10.5-7S22.5 12 22.5 12s-4 7-10.5 7S1.5 12 1.5 12z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const eyeOffSvg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M3 3l18 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.47 10.47A3 3 0 0113.53 13.53" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.21 12.7C3.67 15.55 7.17 18 12 18c6.5 0 10.5-6 10.5-6s-1.99-2.55-4.58-4.19" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    // --- LÓGICA DE INTERCAMBIO DE FORMULARIOS ---

    if (showRecoveryBtn) {
        showRecoveryBtn.addEventListener('click', () => {
            loginForm.style.display = 'none';
            recoverySection.style.display = 'block';
            hideMessage();
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
        activePreguntaId = null;
        stepQuestionDiv.style.display = 'none';
        recoveryUsernameInput.parentElement.parentElement.style.display = 'block';
        btnRecoveryMain.querySelector('.btn-text').textContent = 'VERIFICAR USUARIO';
        recoveryUsernameInput.value = '';
        recoveryAnswerInput.value = '';
        hideMessage();
    }

    // CONTROL INTELIGENTE DETECTANDO LA PANTALLA ACTIVA
    function showMessage(text, isSuccess = false) {
        // Determinamos qué formulario está en pantalla para saber qué contenedor usar
        const activeMessage = (recoverySection.style.display === 'block') ? recoveryMessage : loginMessage;
        const inactiveMessage = (activeMessage === recoveryMessage) ? loginMessage : recoveryMessage;

        // Ocultamos el contenedor que no se está usando
        inactiveMessage.textContent = '';
        inactiveMessage.style.display = 'none';

        // Activamos y estructuramos el contenedor correspondiente
        activeMessage.textContent = text;
        activeMessage.style.display = 'block';
        
        if (isSuccess) {
            activeMessage.className = 'msg-box-custom msg-success-custom';
        } else {
            activeMessage.className = 'msg-box-custom msg-error-custom';
        }
    }

    function hideMessage() {
        if(loginMessage) {
            loginMessage.textContent = '';
            loginMessage.style.display = 'none';
            loginMessage.className = 'msg-box-custom';
        }
        if(recoveryMessage) {
            recoveryMessage.textContent = '';
            recoveryMessage.style.display = 'none';
            recoveryMessage.className = 'msg-box-custom';
        }
    }

    // --- PROCESO DE RECUPERACIÓN (FETCH VIA AJAX) ---

    btnRecoveryMain.addEventListener('click', async () => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        
        if (recoveryStep === 1) {
            const usernameVal = recoveryUsernameInput.value.trim();
            if (!usernameVal) return showMessage('Por favor ingresa tu nombre de usuario.');

            btnRecoveryMain.classList.add('loading');
            hideMessage();
            
            try {
                const response = await fetch('/seguridad/preguntas-desafio', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify({ username: usernameVal })
                });

                const data = await response.json();
                btnRecoveryMain.classList.remove('loading');

                if (response.ok) {
                    // Guardamos el ID real de la pregunta que tiene este usuario
                    activePreguntaId = data.preguntas[0].id;

                    recoveryUsernameInput.parentElement.parentElement.style.display = 'none';
                    stepQuestionDiv.style.display = 'block';
                    displayQuestionLabel.textContent = data.preguntas[0].pregunta;
                    btnRecoveryMain.querySelector('.btn-text').textContent = 'VALIDAR RESPUESTA';
                    recoveryStep = 2;
                } else {
                    showMessage(data.message || 'El usuario no existe o no tiene preguntas configuradas.');
                }
            } catch (error) {
                btnRecoveryMain.classList.remove('loading');
                showMessage('Error de comunicación con el servidor.');
                console.error(error);
            }

        } else if (recoveryStep === 2) {
            const answer = recoveryAnswerInput.value.trim();
            if (!answer) return showMessage('Debes escribir una respuesta.');

            btnRecoveryMain.classList.add('loading');
            hideMessage();

            try {
                const response = await fetch('/seguridad/verificar-respuesta', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify({
                        username: recoveryUsernameInput.value.trim(),
                        pregunta_id: activePreguntaId,
                        respuesta: answer
                    })
                });

                const data = await response.json();
                btnRecoveryMain.classList.remove('loading');

                if (response.ok) {
                    showMessage('¡Identidad verificada! Redirigiendo al cambio de clave...', true);
                    setTimeout(() => {
                        window.location.href = '/seguridad/restablecer-clave'; 
                    }, 2000);
                } else {
                    showMessage(data.message || 'La respuesta es incorrecta.');
                }
            } catch (error) {
                btnRecoveryMain.classList.remove('loading');
                showMessage('Error de comunicación con el servidor.');
                console.error(error);
            }
        }
    });

    // --- ENLAZADO DE VISIBILIDAD DE CONTRASEÑAS ---

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
            hideMessage();
            const u = username.value.trim();
            const p = password.value;
            
            if (!u || !p) {
                loginForm.classList.add('shake');
                showMessage('Por favor completa todos los campos.');
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
                    showMessage(data.message || 'Credenciales incorrectas.');
                } else {
                    window.location.href = '/redirect-after-login';
                }
            } catch (error) {
                btn.classList.remove('loading');
                showMessage('Error de conexión.');
            }
        });
    }
})();