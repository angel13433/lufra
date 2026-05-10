// --- Autenticación basada en sesión del servidor ---
let sessionUser = null;
async function checkSessionAsync() {
    // Usar los datos proporcionados por Laravel si existen
    if (window.laravelUser) {
        return {
            username: window.laravelUser.name,
            role: window.laravelUser.role,
            logged: true
        };
    }
    return null;
}
function logout() {
    // El logout ahora lo maneja Laravel
    const form = document.querySelector('form[action$="logout"]');
    if (form) {
        form.submit();
    } else {
        window.location.href = '/logout';
    }
}
function setAuth(data) {
    if (data) {
        // En un sistema real esto iría a cookies o token
        sessionUser = data;
    } else {
        sessionUser = null;
    }
}

// Global helper to format date strings as local dates without timezone shifts
function formatLocalDate(dateString) {
    if (!dateString) return '-';
    const s = (dateString || '').toString().split('T')[0];
    const parts = s.split('-');
    if (parts.length !== 3) return dateString;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    try { return date.toLocaleDateString('es-VE'); } catch (e) { return date.toLocaleDateString(); }
}

const VACATION_MODAL_SESSION_KEY = 'vacationModalShownThisSession';
const VACATION_MODULE_VISITED_KEY = 'vacationModuleVisitedThisSession';

const eyeSvg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M1.5 12s4-7 10.5-7S22.5 12 22.5 12s-4 7-10.5 7S1.5 12 1.5 12z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const eyeOffSvg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M3 3l18 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.47 10.47A3 3 0 0113.53 13.53" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.21 12.7C3.67 15.55 7.17 18 12 18c6.5 0 10.5-6 10.5-6s-1.99-2.55-4.58-4.19" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// Modal helpers: showModal returns a Promise that resolves true/false for confirm-style dialogs
// Modal helpers: Modern, icon-based Modal System
function showModal(options) {
    return new Promise((resolve) => {
        const type = options.type || 'info'; // success, error, info, warning
        const title = options.title || (type === 'success' ? '¡Éxito!' : type === 'error' ? 'Error' : 'Atención');
        const message = options.message || '';
        const html = options.html || `<p>${message}</p>`;
        const okText = options.okText || 'Aceptar';
        const cancelText = options.cancelText || null;

        const icons = {
            success: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
            error: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
            info: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
            warning: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`
        };

        const overlay = document.createElement('div');
        overlay.className = `modal-overlay modal-${type}`;

        overlay.innerHTML = `
            <div class="modal-content">
                <button class="modal-close-x">✖</button>
                <div class="modal-header">
                    <div class="modal-icon">${icons[type]}</div>
                    <h3 class="modal-title">${title}</h3>
                </div>
                <div class="modal-body">${html}</div>
                <div class="modal-footer">
                    ${cancelText ? `<button class="modal-btn modal-cancel">${cancelText}</button>` : ''}
                    <button class="modal-btn modal-ok">${okText}</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        // Force reflow for animation
        overlay.offsetWidth;
        overlay.classList.add('modal-show');

        function close(result) {
            overlay.classList.remove('modal-show');
            resolve(result);
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }

        overlay.querySelector('.modal-ok').addEventListener('click', () => close(true));
        if (cancelText) {
            overlay.querySelector('.modal-cancel').addEventListener('click', () => close(false));
        }
        overlay.querySelector('.modal-close-x').addEventListener('click', () => close(false));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close(false);
        });
    });
}

const showSuccess = (msg, title) => showModal({ type: 'success', message: msg, title });
const showError = (msg, title) => showModal({ type: 'error', message: msg, title });
const showInfo = (msg, title) => showModal({ type: 'info', message: msg, title });
const showWarning = (msg, title) => showModal({ type: 'warning', message: msg, title });
const showConfirm = (msg, title = 'Confirmar') => showModal({ type: 'warning', message: msg, title, okText: 'Confirmar', cancelText: 'Cancelar' });
const showAlert = (msg, title) => showInfo(msg, title);

// --- 1. Definición de Módulos por Rol ---
const roleModules = {
    "SuperUsuario": {
        name: "SuperUsuario",
        description: "Acceso total para mantenimiento y configuración del sistema.",
        modules: [
            "Gestión de Usuarios y Roles",
            "Generar Reportes"
        ]
    },
    "Administrativo": {
        name: "Administrativo",
        description: "Módulos principales para el proceso de cálculo y gestión de la nómina.",
        modules: [
            "Registro de Trabajadores",
            "Pago de Nómina",
            "Tipo de Nomina",
            "Gestion de conceptos",
            "Gestion de Cargos",
            "Panel de Vacaciones"
        ]
    },
    "Trabajador": {
        name: "Trabajador",
        description: "Módulos de autoservicio para la consulta de información personal.",
        modules: [
            "Mi Perfil",
            "Historial de Pagos y Recibos",
            "Solicitud de Vacaciones"
        ]
    }
};

// Nota: el mismo script se carga en `login.html` y en `Index.html`.
// Detectamos la página por la presencia de elementos y actuamos en consecuencia.

function initPayrollPage() {
    const sidebarNav = document.getElementById('module-navigation');
    const contentHeader = document.getElementById('content-header');
    const contentDetails = document.getElementById('content-details');
    const roleTabs = document.querySelectorAll('.role-tab');

    // Event listeners para las pestañas de rol (se ejecutan dentro de initPayrollPage para tener acceso a loadRoleView)
    if (roleTabs && roleTabs.length) {
        roleTabs.forEach(tab => {
            tab.addEventListener('click', function () {
                const role = this.getAttribute('data-role');
                loadRoleView(role);
            });
        });
    }

    function loadRoleView(roleName) {
        // Normalize role name and try to match case-insensitively if exact key is not present
        const desiredRole = (roleName || '').toString().trim();
        let roleData = roleModules[desiredRole] || roleModules[Object.keys(roleModules).find(k => k.toLowerCase() === desiredRole.toLowerCase())];
        if (!roleData) {
            console.warn('Rol no reconocido:', roleName, ' - mostrando vista por defecto (Administrativo)');
            roleData = roleModules['Administrativo'];
        }

        // guardar rol actual (usar la clave real encontrada)
        currentRole = Object.keys(roleModules).find(k => roleModules[k] === roleData) || 'Administrativo';

        // 1. Actualizar la barra lateral (Módulos) y agregar handlers
        if (sidebarNav) sidebarNav.innerHTML = '';
        roleData.modules.forEach((moduleName, index) => {
            const link = document.createElement('a');
            link.href = "#";
            link.className = "nav-link";
            link.dataset.moduleName = moduleName;
            link.textContent = moduleName;

            // Agregar indicador de notificación para "Solicitud de Vacaciones" si ha pasado un año
            if (roleName === 'Trabajador' && moduleName === 'Solicitud de Vacaciones') {
                link.innerHTML = `${moduleName} <span style="display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; border-radius:50%; border:1px solid #ffffff; background:#ffffff; color:#ff6b6b; font-weight:800; margin-left:8px; font-size:0.78rem;">!</span>`;
                // Verificar async y quitar si no cumple
                checkVacationEligibility().then(canRequest => {
                    if (!canRequest) {
                        link.textContent = moduleName;
                    }
                }).catch(err => {
                    console.error('Error checking vacation eligibility:', err);
                    link.textContent = moduleName; // Quitar en caso de error
                });
            }

            if (index === 0) link.classList.add('active');
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // marcar activo
                sidebarNav.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
                link.classList.add('active');
                renderModule(moduleName);
            });
            if (sidebarNav) sidebarNav.appendChild(link);
        });

        // 2. Actualizar el contenido principal resumen
        if (contentHeader) contentHeader.innerHTML = `<h4>Rol Actual: ${roleData.name}</h4>`;
        if (contentDetails) contentDetails.innerHTML = `
            <p>${roleData.description}</p>
            <p><strong>Funcionalidades visibles en el menú:</strong></p>
            <ul class="module-list">
                ${roleData.modules.map(m => `<li>${m}</li>`).join('')}
            </ul>
            <p class="alert-info">
                <strong>Resumen:</strong> El usuario **${roleData.name}** solo tiene acceso a las funcionalidades listadas arriba y no puede ver los módulos de otros roles.
            </p>
        `;

        // 3. Activar la pestaña correcta (visual)
        if (roleTabs) roleTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-role') === roleName) tab.classList.add('active');
        });

        // renderizar primer módulo por defecto
        if (roleData.modules && roleData.modules.length) renderModule(roleData.modules[0]);
    }

    // Exponer la función globalmente para evitar errores si se invoca desde fuera (compatibilidad)
    window.loadRoleView = loadRoleView;

    // --- variables y helpers para módulos ---
    let currentRole = 'Administrativo';

    function renderModule(moduleName) {
        if (currentRole === 'Trabajador' && moduleName === 'Solicitud de Vacaciones') {
            sessionStorage.setItem(VACATION_MODULE_VISITED_KEY, 'true');
            updateVacationBadge();
        }
        const role = currentRole;
        if (contentHeader) contentHeader.innerHTML = `<h4>${role} - ${moduleName}</h4>`;

        if (role === 'Administrativo') return renderAdminModule(moduleName);
        if (role === 'Trabajador') {
            if (typeof window.renderWorkerModuleV2 === 'function') {
                return window.renderWorkerModuleV2(moduleName);
            }
            return renderWorkerModule(moduleName);
        }
        if (role === 'SuperUsuario') return renderSuperModule(moduleName);
        if (contentDetails) contentDetails.innerHTML = `<p>Módulo no implementado.</p>`;
    }

    /* Helpers comunes */
    // Empleados ahora se gestionan en backend (settings.php key: payroll_employees)
    function getEmployees() { return []; }
    function saveEmployees(list) { /* use settings.php via UI */ }

    async function updateVacationBadge() {
        const sidebarNav = document.getElementById('module-navigation');
        if (!sidebarNav) return;
        const link = sidebarNav.querySelector('.nav-link[data-module-name="Solicitud de Vacaciones"]');
        if (!link) return;

        const canRequest = await checkVacationEligibility();
        if (canRequest) {
            link.innerHTML = `Solicitud de Vacaciones <span style="display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; border-radius:50%; border:1px solid #ffffff; background:#ffffff; color:#ff6b6b; font-weight:800; margin-left:8px; font-size:0.78rem;">!</span>`;
        } else {
            link.textContent = 'Solicitud de Vacaciones';
        }
    }
    window.updateVacationBadge = updateVacationBadge;

    // Función para verificar si el trabajador puede solicitar vacaciones (ha pasado un año desde ingreso)
    async function checkVacationEligibility() {
        console.log('Checking vacation eligibility...');
        try {
            const response = await fetch('/trabajador/vacations-data', {
                headers: { 'Accept': 'application/json' }
            });
            console.log('Fetch response ok:', response.ok);
            const data = await response.json();
            console.log('Data received:', data);

            if (!response.ok || !data.fechaIngreso) {
                console.log('Response not ok or no fechaIngreso');
                return false;
            }

            // Reiniciar estado si la fecha de ingreso cambió en el servidor
            const lastDate = localStorage.getItem('vacationLastSeenHireDate');
            if (lastDate && lastDate !== data.fechaIngreso) {
                localStorage.removeItem('vacationNoticeDismissed');
                localStorage.removeItem('vacationRequestSent');
            }
            localStorage.setItem('vacationLastSeenHireDate', data.fechaIngreso);

            // Reset alreadySubmitted if last request was rejected
            if (data.lastRequest && data.lastRequest.Estado === 'Rechazada') {
                localStorage.removeItem('vacationRequestSent');
            }

            const hireDate = new Date(data.fechaIngreso);
            const today = new Date();
            const oneYearAgo = new Date(today);
            oneYearAgo.setFullYear(today.getFullYear() - 1);

            const isOneYearOld = hireDate <= oneYearAgo;
            const hasPendingOrApproved = data.lastRequest && ['Pendiente', 'Aceptada'].includes(data.lastRequest.Estado);
            const alreadySubmitted = localStorage.getItem('vacationRequestSent') === 'true';
            const isDismissed = localStorage.getItem('vacationNoticeDismissed') === 'true';
            const moduleVisited = sessionStorage.getItem(VACATION_MODULE_VISITED_KEY) === 'true';

            console.log('isOneYearOld:', isOneYearOld, 'hasPendingOrApproved:', hasPendingOrApproved, 'alreadySubmitted:', alreadySubmitted, 'isDismissed:', isDismissed, 'moduleVisited:', moduleVisited);

            const eligible = isOneYearOld && !hasPendingOrApproved && !alreadySubmitted && !isDismissed && !moduleVisited;
            console.log('Eligible:', eligible);
            return eligible;
        } catch (error) {
            console.error('Error checking vacation eligibility:', error);
            return false;
        }
    }

    // --- Settings Hub: Floating Gear Instantiation ---
    initSettingsHub();

    function initSettingsHub() {
        if (document.getElementById('settings-fab')) return; // Already exists

        // 1. Inject FAB (Floating Action Button)
        const fab = document.createElement('button');
        fab.id = 'settings-fab';
        fab.className = 'settings-fab fade-in';
        fab.title = 'Configuración del Sistema';
        const svgDataURI = "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='3'%3E%3C/circle%3E%3Cpath d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z'%3E%3C/path%3E%3C/svg%3E";
        fab.innerHTML = '<img src="' + svgDataURI + '" alt="Ajustes" style="width: 20px; height: 20px; display: block;" />';

        const actionsContainer = document.getElementById('user-actions-container');
        if (actionsContainer) {
            actionsContainer.appendChild(fab);
        } else {
            document.body.appendChild(fab);
        }

        // 2. Build the Modal
        const modalHtml = `
            <div class="settings-panel">
                <style>
                    .settings-fab {
                        width: 38px; height: 38px; flex-shrink: 0;
                        border-radius: 6px; background: rgba(255,255,255,0.1); color: #ffffff; border: 1px solid rgba(255,255,255,0.3);
                        cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
                    }
                    .settings-fab:hover { background: rgba(255,255,255,0.25); color: #fff; transform: rotate(90deg); border-color: rgba(255,255,255,0.6); }
                    
                    .settings-modal {
                        position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 10000;
                        display: none; align-items: center; justify-content: center; backdrop-filter: blur(2px);
                    }
                    .settings-modal.active { display: flex; animation: modalFadeIn 0.2s ease-out; }
                    .settings-card {
                        background: var(--card-bg); width: 90%; max-width: 480px; border-radius: 16px;
                        padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); position: relative;
                        border: 1px solid var(--border-color, #e0e6ed); transform: translateY(20px); opacity: 0;
                    }
                    .settings-modal.active .settings-card { animation: cardSlideUp 0.3s ease-out forwards; }
                    
                    @keyframes cardSlideUp { to { transform: translateY(0); opacity: 1; } }
                    
                    .set-group { margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid var(--border-color, #f1f3f5); }
                    .set-group:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
                    .set-title { font-size: 1.1em; font-weight: 700; color: var(--text-main); margin: 0 0 15px 0; display: flex; align-items: center; gap: 8px; }
                    
                    .color-picker { display: flex; gap: 15px; }
                    .c-btn { width: 40px; height: 40px; border-radius: 50%; border: 3px solid transparent; cursor: pointer; transition: 0.2s; }
                    .c-btn:hover { transform: scale(1.1); }
                    .c-btn.active { border-color: var(--text-main); transform: scale(1.1); box-shadow: 0 0 10px rgba(255,255,255,0.2); }
                    
                    .density-btn {
                        flex: 1; padding: 10px; border: 1px solid var(--border-color, #ddd); background: transparent;
                        color: var(--text-main); border-radius: 8px; cursor: pointer; font-weight: 600;
                    }
                    .density-btn.active { background: var(--primary); color: white; border-color: var(--primary); }

                    .theme-switch input:checked + .slider { background-color: #666; }
                    .theme-switch input:checked + .slider .knob { left: 28px !important; }
                </style>
                <div id="settings-modal" class="settings-modal">
                    <div class="settings-card">
                        <button id="close-settings" style="position: absolute; top: 20px; right: 20px; background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.5em;">✖</button>
                        <h3 style="margin: 0 0 25px 0; color: var(--text-main); font-size: 1.5em; border-bottom: 2px solid var(--primary); padding-bottom: 10px; display: inline-block;">⚙️ Configuración Global</h3>
                        
                        <div class="set-group">
                            <h4 class="set-title">🌗 Tema visual</h4>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: var(--text-muted); font-size: 0.95em;">Activar modo nocturno</span>
                                <label class="theme-switch" style="position: relative; display: inline-block; width: 50px; height: 26px;">
                                    <input type="checkbox" id="fab-dark-mode" style="opacity: 0; width: 0; height: 0;">
                                    <span class="slider round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;">
                                        <span class="knob sun" style="position: absolute; height: 18px; width: 18px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px;"></span>
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div class="set-group">
                            <h4 class="set-title">🎨 Color de Acento</h4>
                            <div class="color-picker">
                                <button class="c-btn active" data-color="charcoal" style="background: #333333;" title="Carboncillo"></button>
                                <button class="c-btn" data-color="steel" style="background: #4a5568;" title="Acero"></button>
                                <button class="c-btn" data-color="stone" style="background: #718096;" title="Piedra"></button>
                            </div>
                        </div>

                        <div class="set-group">
                            <h4 class="set-title">📐 Densidad</h4>
                            <div style="display: flex; gap: 10px;">
                                <button class="density-btn active" data-density="normal">Normal</button>
                                <button class="density-btn" data-density="compact">Compacta</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = document.getElementById('settings-modal');
        const btnDark = document.getElementById('fab-dark-mode');
        const knob = modal.querySelector('.knob');

        // Modal toggling
        fab.addEventListener('click', () => modal.classList.add('active'));
        document.getElementById('close-settings').addEventListener('click', () => modal.classList.remove('active'));
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

        // Dark Mode Logic
        const sunIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2"/></svg>`;
        const moonIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="black"/></svg>`;
        if (localStorage.getItem('theme') === 'dark' || document.body.classList.contains('dark-mode')) {
            btnDark.checked = true; knob.classList.add('moon'); knob.classList.remove('sun'); knob.innerHTML = moonIcon;
        } else {
            knob.classList.add('sun'); knob.classList.remove('moon'); knob.innerHTML = sunIcon;
        }
        btnDark.addEventListener('change', function () {
            if (this.checked) {
                document.body.classList.add('dark-mode'); localStorage.setItem('theme', 'dark');
                knob.classList.add('moon'); knob.classList.remove('sun'); knob.innerHTML = moonIcon;
            } else {
                document.body.classList.remove('dark-mode'); localStorage.setItem('theme', 'light');
                knob.classList.add('sun'); knob.classList.remove('moon'); knob.innerHTML = sunIcon;
            }
        });

        window.addEventListener('storage', (e) => {
            if (e.key === 'theme') {
                if (e.newValue === 'dark') {
                    document.body.classList.add('dark-mode');
                    if (btnDark) btnDark.checked = true;
                    if (knob) { knob.classList.add('moon'); knob.classList.remove('sun'); knob.innerHTML = moonIcon; }
                } else {
                    document.body.classList.remove('dark-mode');
                    if (btnDark) btnDark.checked = false;
                    if (knob) { knob.classList.add('sun'); knob.classList.remove('moon'); knob.innerHTML = sunIcon; }
                }
            }
        });

        // Color Logic
        const colorBtns = modal.querySelectorAll('.c-btn');
        const applyColor = (color) => {
            const root = document.documentElement;
            // Map names to specific Hex variables
            const colorMap = {
                'charcoal': { p: '#333333', h: '#000000' },
                'steel': { p: '#4a5568', h: '#2d3748' },
                'stone': { p: '#718096', h: '#4a5568' }
            };
            if (colorMap[color]) {
                root.style.setProperty('--primary', colorMap[color].p);
                root.style.setProperty('--primary-hover', colorMap[color].h);
                // Also override inline styles in blade
                document.body.style.setProperty('--primary', colorMap[color].p);
                document.body.style.setProperty('--primary-hover', colorMap[color].h);
            }
            colorBtns.forEach(b => b.classList.remove('active'));
            const activeBtn = Array.from(colorBtns).find(b => b.dataset.color === color);
            if (activeBtn) activeBtn.classList.add('active');
            localStorage.setItem('primaryColor', color);
        };
        const savedColor = localStorage.getItem('primaryColor') || 'charcoal';
        applyColor(savedColor);
        colorBtns.forEach(btn => btn.addEventListener('click', () => applyColor(btn.dataset.color)));

        // Density Logic
        const densityBtns = modal.querySelectorAll('.density-btn');
        const applyDensity = (density) => {
            if (density === 'compact') document.body.classList.add('compact');
            else document.body.classList.remove('compact');

            densityBtns.forEach(b => b.classList.remove('active'));
            const activeBtn = Array.from(densityBtns).find(b => b.dataset.density === density);
            if (activeBtn) activeBtn.classList.add('active');
            localStorage.setItem('density', density);
        };
        const savedDensity = localStorage.getItem('density') || 'normal';
        applyDensity(savedDensity);
        densityBtns.forEach(btn => btn.addEventListener('click', () => applyDensity(btn.dataset.density)));
    }

    // --- Implementaciones Administrativo ---
    function renderAdminModule(name) {
        // Always try V2 first for administrative modules
        if (typeof window.renderAdminModuleV2 === 'function') {
            return window.renderAdminModuleV2(name);
        }

        if (!contentDetails) return;

        // Registro de Trabajadores
        if (name.toLowerCase().includes('registro') && name.toLowerCase().includes('trabajador')) {
            renderWorkerRegistration();
            return;
        }

        // Pago de Nómina
        if (name.toLowerCase().includes('pago') && name.toLowerCase().includes('nómina')) {
            renderPayrollPayment();
            return;
        }

        // Tipo de Nomina
        if (name.toLowerCase().includes('tipo') && name.toLowerCase().includes('nomina')) {
            renderTipoNominaModule();
            return;
        }

        if (name.toLowerCase().includes('cálcul') || name.toLowerCase().includes('calcul')) {
            contentDetails.innerHTML = `
                <div>
                    <h4>Calculadora de Nómina</h4>
                    <label>Salario bruto: <input id="pay-gross" type="number" value="1000"/></label>
                    <label>Impuesto %: <input id="pay-tax" type="number" value="10"/></label>
                    <button id="calc-pay" class="primary">Calcular</button>
                    <div id="pay-result" style="margin-top:10px"></div>
                </div>`;
            document.getElementById('calc-pay').addEventListener('click', () => {
                const gross = Number(document.getElementById('pay-gross').value) || 0;
                const tax = Number(document.getElementById('pay-tax').value) || 0;
                const net = gross * (1 - tax / 100);
                document.getElementById('pay-result').textContent = `Salario neto: $${net.toFixed(2)}`;
            });
            return;
        }
        if (name.toLowerCase().includes('emplead')) {
            // Gestión simple de empleados guardada en settings.php (key: payroll_employees)
            contentDetails.innerHTML = `<div><h4>Gestión de Empleados</h4><button id="add-emp" class="primary">Agregar</button><div id="emp-list" style="margin-top:12px"></div></div>`;
            const listEl = document.getElementById('emp-list');
            async function loadEmployees() { try { const r = await fetch('./includes/settings.php?key=payroll_employees', { cache: 'no-store' }); if (!r.ok) return []; const txt = await r.text(); try { return JSON.parse(txt) || []; } catch (e) { return []; } } catch (e) { return []; } }
            async function saveEmployeesToServer(list) { try { await fetch('./includes/settings.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'payroll_employees', value: list }) }); } catch (e) { /* ignore */ } }
            async function refresh() { const a = await loadEmployees(); if (!a || a.length === 0) { listEl.innerHTML = '<p>No hay empleados.</p>'; return; } listEl.innerHTML = `<table><thead><tr><th>Nombre</th><th>Cargo</th><th></th></tr></thead><tbody>${a.map((e, i) => `<tr><td>${e.name}</td><td>${e.role || ''}</td><td><button data-i="${i}" class="del-emp">Eliminar</button></td></tr>`).join('')}</tbody></table>`; listEl.querySelectorAll('.del-emp').forEach(b => b.addEventListener('click', async () => { const idx = Number(b.getAttribute('data-i')); const arr = await loadEmployees(); arr.splice(idx, 1); await saveEmployeesToServer(arr); refresh(); })); }
            document.getElementById('add-emp').addEventListener('click', async () => { const name = prompt('Nombre'); if (!name) return; const role = prompt('Cargo') || ''; const arr = await loadEmployees(); arr.push({ name, role }); await saveEmployeesToServer(arr); refresh(); });
            refresh();
            return;
        }
        if (name.toLowerCase().includes('novedad')) {
            contentDetails.innerHTML = `<div><h4>Registro de Novedades</h4><label>Empleado: <input id="n-emp"/></label><label>Tipo: <input id="n-type"/></label><label>Monto: <input id="n-amt" type="number"/></label><button id="n-save" class="primary">Guardar</button><div id="n-list" style="margin-top:12px"></div></div>`;
            // Novedades ahora en backend
            async function loadNovedades() {
                try {
                    const res = await fetch('./includes/reports/novedades.php', { cache: 'no-store' });
                    if (!res.ok) return [];
                    return await res.json();
                } catch (e) { return []; }
            }
            document.getElementById('n-save').addEventListener('click', async () => {
                const emp = document.getElementById('n-emp').value.trim();
                const type = document.getElementById('n-type').value.trim();
                const amt = Number(document.getElementById('n-amt').value) || 0;
                if (!emp || !type) { await showAlert('Empleado y tipo requeridos'); return; }
                try {
                    const r = await fetch('./includes/reports/novedades.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ emp, tipo: type, amt }) });
                    if (!r.ok) throw new Error('Error al guardar');
                    renderNovedades();
                } catch (e) { await showAlert('Error al guardar la novedad'); }
            });
            async function renderNovedades() {
                const arr = await loadNovedades();
                document.getElementById('n-list').innerHTML = arr.length ? arr.map(n => `<div>${n.fecha} - ${n.emp} - ${n.tipo} - $${n.monto}</div>`).join('') : '<p>No hay novedades.</p>';
            }
            renderNovedades();
            return;
        }
        if (name.toLowerCase().includes('reporte')) {
            contentDetails.innerHTML = `<div><h4>Generar Reportes</h4><button id="gen-rep" class="primary">Generar CSV</button></div>`;
            document.getElementById('gen-rep').addEventListener('click', async () => {
                const emps = await loadWorkersFromServer();
                const nov = await loadNovedades();
                let csv = 'id,name,role\n';
                emps.forEach((e, i) => csv += `${i + 1},"${e.Nombre_Completo || (e.name || '')}","${e.Nombre_rol || (e.role || '')}"\n`);
                csv += '\nNOVEDADES\ndate,emp,type,amt\n';
                nov.forEach(n => csv += `${n.fecha},"${n.emp}","${n.tipo}",${n.monto}\n`);
                const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'reporte.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
            });
            return;
        }
        if (name.toLowerCase().includes('concept')) {
            renderConceptosModule();
            return;
        }
        if (name.toLowerCase().includes('cargo')) {
            renderCargosModule();
            return;
        }
        if (name.toLowerCase().includes('panel') && name.toLowerCase().includes('vacaciones')) {
            renderAdminVacations();
            return;
        }
        if (name.toLowerCase().includes('panel') && name.toLowerCase().includes('vacaciones')) {
            renderAdminVacations();
            return;
        }
        contentDetails.innerHTML = `<p>Módulo '${name}' no implementado (Administrativo).</p>`;
    }

    // --- Admin Vacation Panel ---
    async function renderAdminVacations() {
        contentDetails.innerHTML = `
            <div class="vacation-panel">
                <h4>Panel de Vacaciones</h4>
                <p>Gestiona las solicitudes de vacaciones de los trabajadores.</p>
                <div id="vacation-requests-list">Cargando solicitudes...</div>
            </div>
        `;

        try {
            const res = await fetch('./includes/vacations/list_requests.php', { cache: 'no-store', credentials: 'same-origin' });
            if (!res.ok) {
                const txt = await res.text().catch(() => '');
                throw new Error(`Server returned ${res.status}: ${txt || res.statusText}`);
            }
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            const requests = data.requests || [];

            const listEl = document.getElementById('vacation-requests-list');

            if (requests.length === 0) {
                listEl.innerHTML = '<div class="alert-info">No hay solicitudes de vacaciones pendientes.</div>';
                return;
            }

            let html = `
                <table style="width:100%; border-collapse:collapse; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                    <thead>
                        <tr style="background:#3498db; color:#fff;">
                            <th style="padding:12px;">Fecha Solicitud</th>
                            <th style="padding:12px;">Trabajador</th>
                            <th style="padding:12px;">Cédula</th>
                            <th style="padding:12px;">Fecha Ingreso</th>
                            <th style="padding:12px;">Inicio Vacaciones</th>
                            <th style="padding:12px;">Estado</th>
                            <th style="padding:12px;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            requests.forEach(r => {
                const statusColor = r.Estado === 'Aceptada' ? '#2ecc71' : (r.Estado === 'Rechazada' ? '#e74c3c' : '#f39c12');
                html += `
                    <tr style="border-bottom:1px solid #f0f0f0;">
                        <td style="padding:12px;">${formatLocalDate(r.Fecha_Solicitud)}</td>
                        <td style="padding:12px;"><strong>${r.Nombre_Completo} ${r.Apellidos}</strong></td>
                        <td style="padding:12px;">${r.Documento_Identidad}</td>
                        <td style="padding:12px;">${formatLocalDate(r.Fecha_de_Ingreso)}</td>
                        <td style="padding:12px;">${formatLocalDate(r.Fecha_Inicio_Vacaciones)}</td>
                        <td style="padding:12px;"><span style="background:${statusColor}; color:#fff; padding:4px 10px; border-radius:12px; font-size:0.85em;">${r.Estado}</span></td>
                        <td style="padding:12px; text-align:center;">
                            ${r.Estado === 'Pendiente' ? `
                                <button class="btn-vacation-action" data-id="${r.Id_Solicitud}" data-status="Aceptada" style="background:#2ecc71; color:#fff; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; margin-right:5px;">Aceptar</button>
                                <button class="btn-vacation-action" data-id="${r.Id_Solicitud}" data-status="Rechazada" style="background:#e74c3c; color:#fff; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">Rechazar</button>
                            ` : '-'}
                        </td>
                    </tr>
                `;
            });

            html += '</tbody></table>';
            listEl.innerHTML = html;

            listEl.querySelectorAll('.btn-vacation-action').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.id;
                    const status = btn.dataset.status;
                    if (!await showConfirm(`¿Desea ${status === 'Aceptada' ? 'aceptar' : 'rechazar'} esta solicitud?`)) return;

                    try {
                        const r = await fetch('./includes/vacations/update_status.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id, status })
                        });
                        if (r.ok) {
                            renderAdminVacations(); // Refresh
                        } else {
                            await showAlert('Error al actualizar estado');
                        }
                    } catch (e) { await showAlert('Error de conexión'); }
                });
            });

        } catch (e) {
            const listEl = document.getElementById('vacation-requests-list');
            console.error('Error loading vacation requests:', e);
            listEl.innerHTML = `<p style="color:red">Error cargando solicitudes: ${e.message}</p>`;
        }
    }

    // --- Funciones para Trabajadores ---
    function getWorkers() { return []; }

    function saveWorkers(workers) { /* workers are persisted via backend endpoints (add_worker/update_worker) */ }

    // --- Funciones para Registro de Trabajadores ---
    function renderWorkerRegistration() {
        if (!contentDetails) return;

        // New: fetch server-side options and workers
        let cargos = [];
        let niveles = [];
        let tiposNomina = [];

        async function loadOptions() {
            try {
                const [cRes, nRes, tRes] = await Promise.all([
                    fetch('./includes/nomina/list_cargos.php'),
                    fetch('./includes/users/list_niveles.php'),
                    fetch('./includes/nomina/list_tipo_nomina.php')
                ]);
                const [cData, nData, tData] = await Promise.all([cRes.json().catch(() => ({})), nRes.json().catch(() => ({})), tRes.json().catch(() => ({}))]);
                cargos = cData.cargos || [];
                niveles = nData.niveles || [];
                tiposNomina = tData.tipos || [];
            } catch (e) {
                // keep arrays empty as fallback
                cargos = [];
                niveles = [];
                tiposNomina = [];
            }
        }

        async function loadWorkersFromServer() {
            try {
                const res = await fetch('./includes/workers/list_workers.php', { cache: 'no-store' });
                const data = await res.json();
                if (res.ok && data.workers) return data.workers;
                return [];
            } catch (e) {
                return [];
            }
        }

        function buildFormHTML() {
            return `
            <div class="worker-registration">
                <h4>Registro de Trabajadores</h4>
                <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                    <button id="add-worker-btn" class="primary">➕ Registrar Nuevo Trabajador</button>
                    
                    <div style="position: relative;">
                        <button id="filter-toggle-btn" style="background: #3498db; color: #fff; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.95em;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
                            </svg>
                            Filtrar
                        </button>
                        
                        <div id="filter-dropdown" style="display: none; position: absolute; top: 45px; right: 0; background: #fff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 15px; min-width: 300px; z-index: 1000;">
                            <h5 style="margin: 0 0 15px 0; color: #2c3e50; font-size: 1em;">Buscar Trabajador</h5>
                            
                            <div style="margin-bottom: 12px;">
                                <label style="display: block; font-weight: 600; margin-bottom: 5px; color: #34495e; font-size: 0.9em;">Por Cédula:</label>
                                <input type="text" id="filter-cedula" placeholder="Ej: V-12345678" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 0.9em;">
                            </div>
                            
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; font-weight: 600; margin-bottom: 5px; color: #34495e; font-size: 0.9em;">Por Fecha de Ingreso:</label>
                                <input type="date" id="filter-fecha" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 0.9em;">
                            </div>
                            
                            <div style="display: flex; gap: 8px; justify-content: flex-end;">
                                <button id="clear-filters-btn" style="background: #95a5a6; color: #fff; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-size: 0.85em;">✖ Limpiar</button>
                                <button id="apply-filters-btn" style="background: #2ecc71; color: #fff; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-size: 0.85em;">🔍 Buscar</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="worker-form-container" style="display: none; background: linear-gradient(135deg, #2ecc71 0%, #3498db 100%); padding: 30px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.25);">
                    <h5 id="worker-form-title" style="margin: 0 0 25px 0; color: #fff; font-size: 1.2em; display: flex; align-items: center; gap: 10px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Datos del Trabajador
                    </h5>
                    <input type="hidden" id="w-id-trabajador">
                    
                    <!-- Información Personal -->
                    <div style="background: rgba(255,255,255,0.95); padding: 25px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <h6 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 1em; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            Información Personal
                        </h6>
                        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:15px;">
                            <div class="form-row"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Nombres <span class="required" style="color: #e74c3c;">*</span></label><input id="w-nombre" class="form-input" type="text" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;" /></div>
                            <div class="form-row"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Apellidos <span class="required" style="color: #e74c3c;">*</span></label><input id="w-apellidos" class="form-input" type="text" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;" /></div>

                            <div class="form-row"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Documento de identidad <span class="required" style="color: #e74c3c;">*</span></label>
                                <div style="display:flex;gap:8px;align-items:center;">
                                    <select id="w-cedula-prefijo" style="padding:12px;border:1px solid #ddd;border-radius:8px;background:#fff;width:70px;font-size:0.95em;">
                                        <option value="V">V-</option>
                                        <option value="E">E-</option>
                                    </select>
                                    <input id="w-cedula" class="form-input" type="text" placeholder="12345678" style="flex:1;padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.95em;" />
                                </div>
                            </div>
                            <div class="form-row"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Fecha de nacimiento</label><input id="w-fecha-nac" class="form-input" type="date" max="" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;" /></div>

                            <div class="form-row"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Género</label><select id="w-genero" class="form-input" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;"><option value="">Seleccione</option><option value="M">Masculino</option><option value="F">Femenino</option><option value="O">Otro</option></select></div>
                            <div class="form-row"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Estado civil</label>
                                <select id="w-estado-civil" class="form-input" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;">
                                    <option value="">Seleccione</option>
                                    <option value="Soltero">Soltero</option>
                                    <option value="Casado">Casado</option>
                                    <option value="Divorciado">Divorciado</option>
                                    <option value="Viudo">Viudo</option>
                                </select>
                            </div>

                            <div class="form-row"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Correo electrónico</label><input id="w-correo" class="form-input" type="email" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;" /></div>
                            <div class="form-row"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Teléfono móvil</label>
                                <div style="display:flex;gap:8px;align-items:center;">
                                    <select id="w-telefono-prefijo" style="padding:12px;border:1px solid #ddd;border-radius:8px;background:#fff;width:110px;font-size:0.95em;">
                                        <option value="0412">0412</option>
                                        <option value="0414">0414</option>
                                        <option value="0416">0416</option>
                                        <option value="0424">0424</option>
                                        <option value="0426">0426</option>
                                        <option value="0422">0422</option>
                                    </select>
                                    <input id="w-telefono" class="form-input" type="text" placeholder="1234567" style="flex:1;padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;" />
                                </div>
                                <div class="helper" id="w-telefono-helper" style="margin-top:6px;">Prefijo y número separados. Ej: 0412 - 1234567</div>
                            </div>
                            
                            <div class="form-row" style="grid-column:1/3"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Dirección</label><input id="w-direccion" class="form-input" type="text" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;" /></div>
                        </div>
                    </div>

                    <!-- Información Laboral -->
                    <div style="background: rgba(255,255,255,0.95); padding: 25px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <h6 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 1em; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                            </svg>
                            Información Laboral
                        </h6>
                        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:15px;">
                            <div class="form-row"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Cargo <span class="required" style="color: #e74c3c;">*</span></label><select id="w-cargo" class="form-input" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;"><option value="">Cargo (seleccione)</option>${cargos.map(c => `<option value="${c.Id_Cargo}">${c.Nombre_profesión}</option>`).join('')}</select></div>
                            <div class="form-row"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Nivel educativo <span class="required" style="color: #e74c3c;">*</span></label><select id="w-nivel" class="form-input" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;"><option value="">Nivel educativo (seleccione)</option>${niveles.map(n => `<option value="${n.Id_Nivel_Educativo}">${n.Nombre_Nivel}</option>`).join('')}</select></div>
                            <div class="form-row" style="grid-column:1/3"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Fecha de ingreso <span class="required" style="color: #e74c3c;">*</span></label><input id="w-fecha-ingreso" class="form-input" type="date" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;" /></div>
                        </div>
                    </div>

                    <h5 style="margin: 20px 0 0 0; color: #fff; font-size: 1em;">Contrato</h5>
                    <div style="background: var(--card-bg); padding: 25px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid var(--border-color, #eee);">
                        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:15px;">
                            <div class="form-row"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Tipo de nómina <span class="required" style="color: #e74c3c;">*</span></label><select id="w-tipo-nomina" class="form-input" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;"><option value="">Tipo de nómina</option>${tiposNomina.map(t => `<option value="${t.Id_Tipo_Nomina}">${t.Frecuencia}</option>`).join('')}</select></div>
                            <div class="form-row"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Estado</label><select id="w-estado" class="form-input" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;"><option value="Activo">Activo</option><option value="Inactivo">Inactivo</option></select></div>
                            <div class="form-row" style="grid-column:1/3"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Observaciones</label><textarea id="w-observaciones" class="form-input" placeholder="Observaciones" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em; min-height: 80px; resize: vertical;"></textarea></div>
                        </div>
                    </div>

                    <div style="display:flex;gap:15px;margin-top:25px;align-items:center;">
                        <button id="save-worker-btn" class="primary" style="padding: 15px 30px; background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); border: none; border-radius: 10px; color: #fff; font-weight: 700; cursor: pointer; font-size: 1.05em; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.4); display: flex; align-items: center; gap: 10px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                            Guardar Trabajador
                        </button>
                        <button id="cancel-worker-btn" style="padding: 15px 30px; border-radius: 10px; border: 2px solid #fff; background: transparent; color: #fff; cursor: pointer; font-weight: 600; font-size: 1.05em;">Cancelar</button>
                        <div id="worker-msg"></div>
                    </div>
                </div>
                <div id="workers-list"><h5 style="margin-top:20px">Trabajadores Registrados</h5><div id="workers-table"></div></div>
            </div>
            `;
        }

        // Funciones de validación para trabajadores
        function validarSoloLetrasTrabajador(texto) {
            if (!texto) return false;
            const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-\']+$/;
            return regex.test(texto);
        }

        function validarSoloNumerosTrabajador(valor) {
            if (!valor || valor === '') return false;
            // Permite números y guiones (para formato de teléfono)
            const regex = /^[0-9\-\s]+$/;
            return regex.test(valor);
        }

        function validarCedula(cedula) {
            if (!cedula) return false;
            // Solo números, entre 6 y 10 dígitos
            const regex = /^[0-9]{6,10}$/;
            return regex.test(cedula);
        }

        function validarFecha(fecha, tipo) {
            if (!fecha) return { valido: true }; // Fechas opcionales son válidas

            // Parsear fecha input (YYYY-MM-DD) a fecha local para evitar problemas de zona horaria
            const partes = fecha.split('-');
            const fechaObj = new Date(partes[0], partes[1] - 1, partes[2]);

            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            if (tipo === 'nacimiento') {
                // Fecha de nacimiento no puede ser futura
                if (fechaObj > hoy) {
                    return { valido: false, mensaje: 'La fecha de nacimiento no puede ser futura' };
                }
                // Validar rango de edad: entre 18 y 80 años
                const fechaMayorEdad = new Date();
                fechaMayorEdad.setHours(0, 0, 0, 0);
                fechaMayorEdad.setFullYear(hoy.getFullYear() - 18);
                if (fechaObj > fechaMayorEdad) {
                    return { valido: false, mensaje: 'El trabajador debe ser mayor de edad' };
                }

                const fechaMaxEdad = new Date();
                fechaMaxEdad.setHours(0, 0, 0, 0);
                fechaMaxEdad.setFullYear(hoy.getFullYear() - 80);
                if (fechaObj < fechaMaxEdad) {
                    return { valido: false, mensaje: 'La edad no puede ser mayor a 80 años' };
                }
            } else if (tipo === 'ingreso') {
                // Fecha de ingreso no puede ser futura (o puede ser hoy)
                if (fechaObj > hoy) {
                    return { valido: false, mensaje: 'La fecha de ingreso no puede ser futura' };
                }
            }

            return { valido: true };
        }

        function setupWorkerFormValidations() {
            // helper to show inline errors
            function showFieldError(el, msg) {
                if (!el) return;
                el.classList.add('input-error');
                let helper = el.nextElementSibling;
                // if the next sibling is a wrapper (for selects with parent div), try to find helper by id
                if (!helper || !helper.classList || !helper.classList.contains('helper')) {
                    // try find .helper within parent
                    const parent = el.parentElement;
                    if (parent) helper = parent.querySelector('.helper');
                }
                if (helper) {
                    helper.textContent = msg;
                    helper.style.color = '#e74c3c';
                } else {
                    const span = document.createElement('div');
                    span.className = 'helper';
                    span.style.color = '#e74c3c';
                    span.textContent = msg;
                    el.insertAdjacentElement('afterend', span);
                }
            }

            function clearFieldError(el) {
                if (!el) return;
                el.classList.remove('input-error');
                let helper = el.nextElementSibling;
                if (!helper || !helper.classList || !helper.classList.contains('helper')) {
                    const parent = el.parentElement;
                    if (parent) helper = parent.querySelector('.helper');
                }
                if (helper) {
                    helper.textContent = '';
                    helper.style.color = '#7f8c8d';
                }
            }
            // Validación en tiempo real para nombres (solo letras)
            const nombreInput = document.getElementById('w-nombre');
            if (nombreInput && !nombreInput.dataset.validacionConfigurada) {
                nombreInput.dataset.validacionConfigurada = 'true';
                nombreInput.addEventListener('keypress', function (e) {
                    const char = String.fromCharCode(e.which);
                    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-\']/.test(char) && !e.ctrlKey && !e.metaKey && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                        e.preventDefault();
                        showFieldError(nombreInput, 'El nombre solo puede contener letras');
                    }
                });
                nombreInput.addEventListener('input', function () {
                    const v = nombreInput.value.trim();
                    if (!v) { showFieldError(nombreInput, 'Campo obligatorio'); return; }
                    if (!validarSoloLetrasTrabajador(v)) { showFieldError(nombreInput, 'El nombre solo puede contener letras'); return; }
                    clearFieldError(nombreInput);
                });
            }

            const apellidosInput = document.getElementById('w-apellidos');
            if (apellidosInput && !apellidosInput.dataset.validacionConfigurada) {
                apellidosInput.dataset.validacionConfigurada = 'true';
                apellidosInput.addEventListener('keypress', function (e) {
                    const char = String.fromCharCode(e.which);
                    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-\']/.test(char) && !e.ctrlKey && !e.metaKey && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                        e.preventDefault();
                        showFieldError(apellidosInput, 'El apellido solo puede contener letras');
                    }
                });
                apellidosInput.addEventListener('input', function () {
                    const v = apellidosInput.value.trim();
                    if (!v) { showFieldError(apellidosInput, 'Campo obligatorio'); return; }
                    if (!validarSoloLetrasTrabajador(v)) { showFieldError(apellidosInput, 'El apellido solo puede contener letras'); return; }
                    clearFieldError(apellidosInput);
                });
            }

            // Validación para cédula (solo números)
            const cedulaInput = document.getElementById('w-cedula');
            if (cedulaInput && !cedulaInput.dataset.validacionConfigurada) {
                cedulaInput.dataset.validacionConfigurada = 'true';
                cedulaInput.addEventListener('keypress', function (e) {
                    const char = String.fromCharCode(e.which);
                    if (!/[0-9]/.test(char) && !e.ctrlKey && !e.metaKey && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                        e.preventDefault();
                        showFieldError(cedulaInput, 'El documento solo puede contener números');
                    }
                });
                cedulaInput.addEventListener('input', function () {
                    const v = cedulaInput.value.trim();
                    if (!v) { showFieldError(cedulaInput, 'La cédula es obligatoria'); return; }
                    if (!validarCedula(v)) { showFieldError(cedulaInput, 'El documento solo puede contener números'); return; }
                    clearFieldError(cedulaInput);
                });
            }

            // Validación para teléfono (números, guiones y espacios)
            const telefonoInput = document.getElementById('w-telefono');
            if (telefonoInput && !telefonoInput.dataset.validacionConfigurada) {
                telefonoInput.dataset.validacionConfigurada = 'true';
                telefonoInput.addEventListener('keypress', function (e) {
                    const char = String.fromCharCode(e.which);
                    if (!/[0-9\-\s]/.test(char) && !e.ctrlKey && !e.metaKey && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                        e.preventDefault();
                    }
                });
                telefonoInput.addEventListener('input', function () {
                    const v = telefonoInput.value.trim();
                    // allow user to type separators, but validate that the numeric part is exactly 7 digits
                    const digits = v.replace(/\D/g, '');
                    if (digits && !/^\d{7}$/.test(digits)) { showFieldError(telefonoInput, 'El número debe tener 7 dígitos'); return; }
                    clearFieldError(telefonoInput);
                });
                // also validate prefix select exists
                const telPref = document.getElementById('w-telefono-prefijo');
                if (telPref && !telPref.dataset.validacionConfigurada) {
                    telPref.dataset.validacionConfigurada = 'true';
                    telPref.addEventListener('change', () => { clearFieldError(telefonoInput); });
                }
            }

            // Elementos extra de validación
            const dateToday = new Date().toISOString().split('T')[0];
            const correoInput = document.getElementById('w-correo');
            if (correoInput && !correoInput.dataset.validacionConfigurada) {
                correoInput.dataset.validacionConfigurada = 'true';
                correoInput.addEventListener('input', function () {
                    const v = correoInput.value.trim();
                    if (v && !v.includes('@')) { showFieldError(correoInput, 'Tu dirección de correo electrónico debe contener @'); return; }
                    clearFieldError(correoInput);
                });
                correoInput.addEventListener('blur', function () {
                    const v = correoInput.value.trim();
                    if (v && !v.includes('@')) { showFieldError(correoInput, 'Tu dirección de correo electrónico debe contener @'); }
                });
            }

            // Date inputs realtime validation
            const fechaNacInput = document.getElementById('w-fecha-nac');
            if (fechaNacInput && !fechaNacInput.dataset.validacionConfigurada) {
                fechaNacInput.dataset.validacionConfigurada = 'true';
                fechaNacInput.max = dateToday;
                fechaNacInput.addEventListener('change', () => {
                    const v = fechaNacInput.value;
                    const res = validarFecha(v, 'nacimiento');
                    if (!res.valido) showFieldError(fechaNacInput, res.mensaje); else clearFieldError(fechaNacInput);
                });
            }

            const fechaIngresoInput = document.getElementById('w-fecha-ingreso');
            if (fechaIngresoInput && !fechaIngresoInput.dataset.validacionConfigurada) {
                fechaIngresoInput.dataset.validacionConfigurada = 'true';
                fechaIngresoInput.max = dateToday;
                fechaIngresoInput.addEventListener('change', () => {
                    const v = fechaIngresoInput.value;
                    const res = validarFecha(v, 'ingreso');
                    if (!res.valido) showFieldError(fechaIngresoInput, res.mensaje); else clearFieldError(fechaIngresoInput);
                });
            }
        }

        // Source of truth for all workers in this module
        let allWorkersSource = [];
        // Cache of currently rendered workers for button listeners
        let workersCache = [];
        // Sort state tracking
        let sortState = {
            nombre: null, // null, 'asc', 'desc'
            ingreso: null // null, 'asc', 'desc'
        };

        function renderWorkersTable(workers) {
            workersCache = workers || [];
            const el = document.getElementById('workers-table');
            if (!el) return;
            if (!workers.length) { el.innerHTML = '<p style="color:#7f8c8d;padding:12px">No hay trabajadores registrados.</p>'; return; }

            // Sort icons based on current state
            const nombreIcon = sortState.nombre === 'asc' ? '▲' : sortState.nombre === 'desc' ? '▼' : '⇅';
            const ingresoIcon = sortState.ingreso === 'asc' ? '▲' : sortState.ingreso === 'desc' ? '▼' : '⇅';

            el.innerHTML = `<table style="width:100%;border-collapse:collapse"><thead><tr style="background:#3498db;color:#fff"><th style="padding:8px;text-align:center">Nombre <button id="sort-nombre-btn" style="background:transparent;border:none;color:#fff;cursor:pointer;font-size:1.1em;margin-left:5px;">${nombreIcon}</button></th><th style="padding:8px;text-align:center">Cédula</th><th style="padding:8px;text-align:center">Cargo</th><th style="padding:8px;text-align:center">Nivel</th><th style="padding:8px;text-align:center">Ingreso <button id="sort-ingreso-btn" style="background:transparent;border:none;color:#fff;cursor:pointer;font-size:1.1em;margin-left:5px;">${ingresoIcon}</button></th><th style="padding:8px;text-align:center">Estado</th><th style="padding:8px;text-align:center">Acciones</th></tr></thead><tbody>${workers.map(w => `<tr><td style="padding:8px;text-align:center">${w.Nombre_Completo} ${w.Apellidos}</td><td style="padding:8px;text-align:center">${w.Documento_Identidad}</td><td style="padding:8px;text-align:center">${w.Cargo || ''}</td><td style="padding:8px;text-align:center">${w.Nivel_Educativo || ''}</td><td style="padding:8px;text-align:center">${formatLocalDate(w.Fecha_de_Ingreso)}</td><td style="padding:8px;text-align:center"><span style="background:${w.Contrato_Estado === 'Activo' ? '#2ecc71' : '#e74c3c'};color:#fff;padding:2px 8px;border-radius:10px;font-size:0.85em;">${w.Contrato_Estado || ''}</span></td><td style="padding:8px;text-align:center"><div style="display:flex;gap:4px;align-items:center;justify-content:center;"><button class="view-worker-btn" data-id="${w.Id_Trabajador}" style="background:#3498db;color:#fff;border:none;padding:6px 8px;border-radius:4px;cursor:pointer">Ver</button>
                             <button class="edit-worker-btn" data-id="${w.Id_Trabajador}" style="background:#2980b9;color:#fff;border:none;padding:6px 8px;border-radius:4px;cursor:pointer">Editar</button>
                            ${w.Contrato_Estado === 'Activo'
                    ? `<button class="deactivate-worker-btn" data-id="${w.Id_Trabajador}" data-name="${w.Nombre_Completo} ${w.Apellidos}" style="background:#f39c12;color:#fff;border:none;padding:6px 8px;border-radius:4px;cursor:pointer">Desactivar</button>`
                    : `<button class="activate-worker-btn" data-id="${w.Id_Trabajador}" data-name="${w.Nombre_Completo} ${w.Apellidos}" style="background:#2ecc71;color:#fff;border:none;padding:6px 8px;border-radius:4px;cursor:pointer">Activar</button>`
                }</div></td></tr>`).join('')}</tbody></table>`;
            attachWorkerTableListeners();
            attachSortListeners();
        }

        function attachSortListeners() {
            const sortNombreBtn = document.getElementById('sort-nombre-btn');
            const sortIngresoBtn = document.getElementById('sort-ingreso-btn');

            if (sortNombreBtn) {
                sortNombreBtn.addEventListener('click', () => {
                    // Toggle: null -> asc -> desc -> asc ...
                    if (sortState.nombre === null || sortState.nombre === 'desc') {
                        sortState.nombre = 'asc';
                    } else {
                        sortState.nombre = 'desc';
                    }
                    sortState.ingreso = null; // Reset other sort

                    const sorted = [...allWorkersSource].sort((a, b) => {
                        const nameA = `${a.Nombre_Completo} ${a.Apellidos}`.toLowerCase();
                        const nameB = `${b.Nombre_Completo} ${b.Apellidos}`.toLowerCase();
                        return sortState.nombre === 'asc'
                            ? nameA.localeCompare(nameB)
                            : nameB.localeCompare(nameA);
                    });
                    allWorkersSource = sorted;
                    renderWorkersTable(sorted);
                });
            }

            if (sortIngresoBtn) {
                sortIngresoBtn.addEventListener('click', () => {
                    // Toggle: null -> desc (most recent) -> asc (oldest) -> desc ...
                    if (sortState.ingreso === null || sortState.ingreso === 'asc') {
                        sortState.ingreso = 'desc'; // Most recent first
                    } else {
                        sortState.ingreso = 'asc'; // Oldest first
                    }
                    sortState.nombre = null; // Reset other sort

                    const sorted = [...allWorkersSource].sort((a, b) => {
                        const dateA = new Date(a.Fecha_de_Ingreso || '1900-01-01');
                        const dateB = new Date(b.Fecha_de_Ingreso || '1900-01-01');
                        return sortState.ingreso === 'desc'
                            ? dateB - dateA // Most recent first
                            : dateA - dateB; // Oldest first
                    });
                    allWorkersSource = sorted;
                    renderWorkersTable(sorted);
                });
            }
        }

        function attachWorkerTableListeners() {
            document.querySelectorAll('.deactivate-worker-btn').forEach(b => {
                b.addEventListener('click', async () => {
                    const id = b.getAttribute('data-id');
                    const nombre = b.getAttribute('data-name');
                    if (!await showConfirm(`¿Está seguro de desactivar al trabajador "${nombre}"?\n\nEl trabajador será marcado como inactivo pero no se eliminará de la base de datos.`)) return;
                    try {
                        const res = await fetch('./includes/workers/deactivate_worker.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
                        const data = await res.json();
                        if (res.ok) { document.getElementById('worker-msg').textContent = 'Trabajador desactivado exitosamente'; document.getElementById('worker-msg').style.color = '#27ae60'; loadAndRender(); if (window.loadWorkersForUsers) window.loadWorkersForUsers(); } else { document.getElementById('worker-msg').textContent = data.error || 'Error al desactivar'; document.getElementById('worker-msg').style.color = '#e74c3c'; }
                    } catch (e) { document.getElementById('worker-msg').textContent = 'Error de conexión'; document.getElementById('worker-msg').style.color = '#e74c3c'; }
                });
            });

            document.querySelectorAll('.activate-worker-btn').forEach(b => {
                b.addEventListener('click', async () => {
                    const id = b.getAttribute('data-id');
                    const nombre = b.getAttribute('data-name');
                    if (!await showConfirm(`¿Está seguro de activar al trabajador "${nombre}"?`)) return;
                    try {
                        const res = await fetch('./includes/workers/activate_worker.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
                        const data = await res.json();
                        if (res.ok) { document.getElementById('worker-msg').textContent = 'Trabajador activado exitosamente'; document.getElementById('worker-msg').style.color = '#27ae60'; loadAndRender(); if (window.loadWorkersForUsers) window.loadWorkersForUsers(); } else { document.getElementById('worker-msg').textContent = data.error || 'Error al activar'; document.getElementById('worker-msg').style.color = '#e74c3c'; }
                    } catch (e) { document.getElementById('worker-msg').textContent = 'Error de conexión'; document.getElementById('worker-msg').style.color = '#e74c3c'; }
                });
            });

            document.querySelectorAll('.view-worker-btn').forEach(b => {
                b.addEventListener('click', () => {
                    const id = b.getAttribute('data-id');
                    const worker = workersCache.find(w => String(w.Id_Trabajador) === String(id));
                    if (worker) showWorkerDetails(worker);
                });
            });

            document.querySelectorAll('.edit-worker-btn').forEach(b => {
                b.addEventListener('click', () => {
                    const id = b.getAttribute('data-id');
                    const worker = workersCache.find(w => String(w.Id_Trabajador) === String(id));
                    if (worker) populateWorkerForm(worker);
                });
            });
        }

        function populateWorkerForm(worker) {
            const formContainer = document.getElementById('worker-form-container');
            const titleEl = document.getElementById('worker-form-title');

            // Show form and change title
            formContainer.style.display = 'block';
            titleEl.textContent = 'Editar Trabajador: ' + worker.Nombre_Completo + ' ' + worker.Apellidos;
            formContainer.scrollIntoView({ behavior: 'smooth' });

            // Set ID and personal data
            document.getElementById('w-id-trabajador').value = worker.Id_Trabajador;
            document.getElementById('w-nombre').value = worker.Nombre_Completo || '';
            document.getElementById('w-apellidos').value = worker.Apellidos || '';

            const cedulaParts = (worker.Documento_Identidad || '').split('-');
            if (cedulaParts.length === 2) {
                document.getElementById('w-cedula-prefijo').value = cedulaParts[0];
                document.getElementById('w-cedula').value = cedulaParts[1];
            } else {
                document.getElementById('w-cedula').value = worker.Documento_Identidad || '';
            }

            document.getElementById('w-fecha-nac').value = worker.Fecha_Nacimiento || '';
            document.getElementById('w-genero').value = worker.Genero || '';
            document.getElementById('w-cargo').value = worker.Id_Cargo || '';
            document.getElementById('w-nivel').value = worker.Id_Nivel_Educativo || '';
            document.getElementById('w-correo').value = worker.Correo || '';
            // Populate phone prefix and number if available
            const telefonoRaw = worker.Telefono_Movil || '';
            let telPref = '0412';
            let telNum = '';
            if (telefonoRaw.indexOf('-') !== -1) {
                const parts = telefonoRaw.split('-');
                telPref = parts[0] || telPref;
                telNum = parts.slice(1).join('-') || '';
            } else if (telefonoRaw.startsWith('04') && telefonoRaw.length > 4) {
                telPref = telefonoRaw.slice(0, 4);
                telNum = telefonoRaw.slice(4);
            } else {
                telNum = telefonoRaw;
            }
            const telPrefEl = document.getElementById('w-telefono-prefijo');
            if (telPrefEl) {
                // set if option exists, otherwise leave default
                const opt = Array.from(telPrefEl.options).find(o => o.value === telPref);
                if (opt) telPrefEl.value = telPref; else telPrefEl.value = telPrefEl.options[0].value;
            }
            document.getElementById('w-telefono').value = telNum || '';
            document.getElementById('w-direccion').value = worker.Direccion || '';
            document.getElementById('w-estado-civil').value = worker.Estado_Civil || '';
            document.getElementById('w-fecha-ingreso').value = worker.Fecha_de_Ingreso || '';

            // Set contract data
            document.getElementById('w-tipo-nomina').value = worker.Id_Tipo_Nomina || '';
            document.getElementById('w-estado').value = worker.Contrato_Estado || 'Activo';
            document.getElementById('w-observaciones').value = worker.Observaciones || '';

            // Set min/max dates for birth (18-80) and max for ingreso (today)
            const hoy = new Date();
            const maxEdad = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
            const minEdad = new Date(hoy.getFullYear() - 80, hoy.getMonth(), hoy.getDate());
            document.getElementById('w-fecha-nac').setAttribute('max', `${maxEdad.getFullYear()}-${String(maxEdad.getMonth() + 1).padStart(2, '0')}-${String(maxEdad.getDate()).padStart(2, '0')}`);
            document.getElementById('w-fecha-nac').setAttribute('min', `${minEdad.getFullYear()}-${String(minEdad.getMonth() + 1).padStart(2, '0')}-${String(minEdad.getDate()).padStart(2, '0')}`);
            document.getElementById('w-fecha-ingreso').setAttribute('max', `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`);

            setupWorkerFormValidations();
        }

        function genderLabel(g) {
            if (!g) return '-';
            if (g === 'M') return 'Masculino';
            if (g === 'F') return 'Femenino';
            if (g === 'O') return 'Otro';
            return g;
        }



        function showWorkerDetails(worker) {
            // create overlay
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.innerHTML = `
                <div class="modal-content">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                        <h4 style="margin:0">Detalle Trabajador</h4>
                        <button class="modal-close" aria-label="Cerrar">✖</button>
                    </div>
                    <div class="detail-list">
                        <!-- Worker ID hidden intentionally -->
                        <div class="detail-row"><strong>Nombre:</strong> ${worker.Nombre_Completo} ${worker.Apellidos}</div>
                        <div class="detail-row"><strong>Documento:</strong> ${worker.Documento_Identidad}</div>
                        <div class="detail-row"><strong>Correo:</strong> ${worker.Correo || '-'}</div>
                        <div class="detail-row"><strong>Teléfono:</strong> ${worker.Telefono_Movil || '-'}</div>
                        <div class="detail-row"><strong>Dirección:</strong> ${worker.Direccion || '-'}</div>
                        <div class="detail-row"><strong>Fecha Nacimiento:</strong> ${worker.Fecha_Nacimiento ? formatLocalDate(worker.Fecha_Nacimiento) : '-'}</div>
                        <div class="detail-row"><strong>Género:</strong> ${genderLabel(worker.Genero)}</div>
                        <div class="detail-row"><strong>Estado Civil:</strong> ${worker.Estado_Civil || '-'}</div>
                        <div class="detail-row"><strong>Fecha Ingreso:</strong> ${worker.Fecha_de_Ingreso ? formatLocalDate(worker.Fecha_de_Ingreso) : '-'}</div>
                        <div class="detail-row"><strong>Cargo:</strong> ${worker.Cargo || '-'}</div>
                        <div class="detail-row"><strong>Nivel Educativo:</strong> ${worker.Nivel_Educativo || '-'}</div>
                        <hr />
                        <!-- Contrato ID hidden intentionally -->
                        <div class="detail-row"><strong>Tipo Nómina:</strong> ${worker.Frecuencia || '-'}</div>
                        <div class="detail-row"><strong>Fecha Registro Contrato:</strong> ${worker.Fecha_registro ? new Date(worker.Fecha_registro).toLocaleString('es-VE') : '-'}</div>
                        <div class="detail-row"><strong>Estado Contrato:</strong> ${worker.Contrato_Estado || '-'}</div>
                        <div class="detail-row"><strong>Observaciones:</strong> ${worker.Observaciones || '-'}</div>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);

            const closeBtn = overlay.querySelector('.modal-close');
            function removeModal() { overlay.remove(); }
            closeBtn.addEventListener('click', removeModal);
            overlay.addEventListener('click', (e) => { if (e.target === overlay) removeModal(); });
        }

        function setWorkerMsg(m, type = 'info') { const el = document.getElementById('worker-msg'); if (!el) return; el.textContent = m; el.style.color = type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#7f8c8d'; }
        async function loadAndRender() {
            await loadOptions();
            contentDetails.innerHTML = buildFormHTML();

            setupWorkerFormValidations();

            // hookup buttons
            const addBtn = document.getElementById('add-worker-btn');
            const formContainer = document.getElementById('worker-form-container');
            const saveBtn = document.getElementById('save-worker-btn');
            const cancelBtn = document.getElementById('cancel-worker-btn');

            addBtn.addEventListener('click', () => {
                formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
                document.getElementById('worker-form-title').textContent = 'Datos del Trabajador';
                document.getElementById('w-id-trabajador').value = '';

                // Clear form
                ['w-nombre', 'w-apellidos', 'w-cedula', 'w-correo', 'w-telefono', 'w-telefono-prefijo', 'w-direccion', 'w-fecha-nac', 'w-fecha-ingreso', 'w-observaciones'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.value = '';
                });
                ['w-cargo', 'w-nivel', 'w-tipo-nomina', 'w-genero', 'w-estado-civil'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.value = '';
                });
                document.getElementById('w-estado').value = 'Activo';

                setWorkerMsg('');
                // remove validation highlights on open
                ['w-nombre', 'w-apellidos', 'w-cedula', 'w-fecha-ingreso', 'w-cargo', 'w-nivel', 'w-tipo-nomina', 'w-telefono', 'w-telefono-prefijo', 'w-fecha-nac'].forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('input-error'); });

                // Configurar fecha máxima para fecha de nacimiento (18 años atrás)
                const fechaNacInput = document.getElementById('w-fecha-nac');
                if (fechaNacInput) {
                    const hoy = new Date();
                    const maxEdad = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
                    const minEdad = new Date(hoy.getFullYear() - 80, hoy.getMonth(), hoy.getDate());
                    const mMax = String(maxEdad.getMonth() + 1).padStart(2, '0');
                    const dMax = String(maxEdad.getDate()).padStart(2, '0');
                    const mMin = String(minEdad.getMonth() + 1).padStart(2, '0');
                    const dMin = String(minEdad.getDate()).padStart(2, '0');
                    fechaNacInput.setAttribute('max', `${maxEdad.getFullYear()}-${mMax}-${dMax}`);
                    fechaNacInput.setAttribute('min', `${minEdad.getFullYear()}-${mMin}-${dMin}`);
                }

                // Configurar fecha máxima para fecha de ingreso (hoy)
                const fechaIngresoInput = document.getElementById('w-fecha-ingreso');
                if (fechaIngresoInput) {
                    const hoy = new Date();
                    const m = String(hoy.getMonth() + 1).padStart(2, '0');
                    const d = String(hoy.getDate()).padStart(2, '0');
                    fechaIngresoInput.setAttribute('max', `${hoy.getFullYear()}-${m}-${d}`);
                }

                // Configurar validaciones en tiempo real
                setupWorkerFormValidations();
            });
            cancelBtn.addEventListener('click', () => { formContainer.style.display = 'none'; setWorkerMsg(''); });

            // Setup Filter Dropdown
            const filterToggleBtn = document.getElementById('filter-toggle-btn');
            const filterDropdown = document.getElementById('filter-dropdown');
            const filterCedula = document.getElementById('filter-cedula');
            const filterFecha = document.getElementById('filter-fecha');
            const applyFiltersBtn = document.getElementById('apply-filters-btn');
            const clearFiltersBtn = document.getElementById('clear-filters-btn');

            // Toggle dropdown visibility
            filterToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                filterDropdown.style.display = filterDropdown.style.display === 'none' ? 'block' : 'none';
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!filterDropdown.contains(e.target) && e.target !== filterToggleBtn) {
                    filterDropdown.style.display = 'none';
                }
            });

            // Apply filters
            function applyFilters() {
                const cedulaValue = filterCedula.value.toLowerCase().trim();
                const fechaValue = filterFecha.value;

                let filteredWorkers = allWorkersSource;

                if (cedulaValue) {
                    filteredWorkers = filteredWorkers.filter(w => (w.Documento_Identidad || '').toLowerCase().includes(cedulaValue));
                }

                if (fechaValue) {
                    filteredWorkers = filteredWorkers.filter(w => (w.Fecha_de_Ingreso || '') === fechaValue);
                }

                renderWorkersTable(filteredWorkers);
                filterDropdown.style.display = 'none';
            }

            applyFiltersBtn.addEventListener('click', applyFilters);

            // Allow Enter key to trigger search
            filterCedula.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') applyFilters();
            });
            filterFecha.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') applyFilters();
            });

            // Clear filters
            clearFiltersBtn.addEventListener('click', () => {
                filterCedula.value = '';
                filterFecha.value = '';
                renderWorkersTable(allWorkersSource);
                filterDropdown.style.display = 'none';
            });

            saveBtn.addEventListener('click', async () => {
                setWorkerMsg('Guardando...');
                const _wm = document.getElementById('worker-msg');
                if (_wm) {
                    _wm.style.color = '#ffffff';
                    _wm.style.fontSize = '1.15em';
                    _wm.style.fontWeight = '700';
                }

                // clear previous errors
                ['w-nombre', 'w-apellidos', 'w-cedula', 'w-fecha-ingreso', 'w-cargo', 'w-nivel', 'w-tipo-nomina', 'w-telefono', 'w-fecha-nac'].forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('input-error'); });

                // Obtener valores
                const nombre = document.getElementById('w-nombre').value.trim();
                const apellidos = document.getElementById('w-apellidos').value.trim();
                const cedulaPrefijo = document.getElementById('w-cedula-prefijo').value;
                const cedula = document.getElementById('w-cedula').value.trim();
                const fechaNac = document.getElementById('w-fecha-nac').value;
                const fechaIngreso = document.getElementById('w-fecha-ingreso').value;
                const telefonoPref = document.getElementById('w-telefono-prefijo') ? document.getElementById('w-telefono-prefijo').value : '';
                const telefonoNumber = document.getElementById('w-telefono').value.trim();
                const telefono = telefonoNumber ? (telefonoPref ? `${telefonoPref}-${telefonoNumber}` : telefonoNumber) : '';

                // Validaciones
                let errores = [];

                // Validar nombres (solo letras)
                if (!nombre) {
                    errores.push({ campo: 'w-nombre', mensaje: 'El nombre es obligatorio' });
                } else if (!validarSoloLetrasTrabajador(nombre)) {
                    errores.push({ campo: 'w-nombre', mensaje: 'El nombre solo puede contener letras, espacios y acentos' });
                } else if (nombre.length < 2) {
                    errores.push({ campo: 'w-nombre', mensaje: 'El nombre debe tener al menos 2 caracteres' });
                }

                // Validar apellidos (solo letras)
                if (!apellidos) {
                    errores.push({ campo: 'w-apellidos', mensaje: 'Los apellidos son obligatorios' });
                } else if (!validarSoloLetrasTrabajador(apellidos)) {
                    errores.push({ campo: 'w-apellidos', mensaje: 'Los apellidos solo pueden contener letras, espacios y acentos' });
                } else if (apellidos.length < 2) {
                    errores.push({ campo: 'w-apellidos', mensaje: 'Los apellidos deben tener al menos 2 caracteres' });
                }

                // Validar cédula (solo números)
                if (!cedula) {
                    errores.push({ campo: 'w-cedula', mensaje: 'La cédula es obligatoria' });
                } else if (!validarCedula(cedula)) {
                    errores.push({ campo: 'w-cedula', mensaje: 'La cédula debe contener solo números (entre 6 y 10 dígitos)' });
                }

                // Validar teléfono (si se proporciona): debe tener 7 dígitos después del prefijo
                if (telefonoNumber) {
                    const digits = telefonoNumber.replace(/\D/g, '');
                    if (!/^\d{7}$/.test(digits)) {
                        errores.push({ campo: 'w-telefono', mensaje: 'El número debe tener 7 dígitos después del prefijo' });
                    }
                }

                // Validar fechas
                if (fechaNac) {
                    const validacionNac = validarFecha(fechaNac, 'nacimiento');
                    if (!validacionNac.valido) {
                        errores.push({ campo: 'w-fecha-nac', mensaje: validacionNac.mensaje });
                    }
                }

                if (!fechaIngreso) {
                    errores.push({ campo: 'w-fecha-ingreso', mensaje: 'La fecha de ingreso es obligatoria' });
                } else {
                    const validacionIngreso = validarFecha(fechaIngreso, 'ingreso');
                    if (!validacionIngreso.valido) {
                        errores.push({ campo: 'w-fecha-ingreso', mensaje: validacionIngreso.mensaje });
                    }
                }

                // Validar campos select obligatorios
                const cargo = parseInt(document.getElementById('w-cargo').value) || null;
                const nivel = parseInt(document.getElementById('w-nivel').value) || null;
                const tipoNomina = parseInt(document.getElementById('w-tipo-nomina').value) || null;

                if (!cargo) errores.push({ campo: 'w-cargo', mensaje: 'Debe seleccionar un cargo' });
                if (!nivel) errores.push({ campo: 'w-nivel', mensaje: 'Debe seleccionar un nivel educativo' });
                if (!tipoNomina) errores.push({ campo: 'w-tipo-nomina', mensaje: 'Debe seleccionar un tipo de nómina' });

                // Mostrar errores
                if (errores.length > 0) {
                    errores.forEach(err => {
                        const el = document.getElementById(err.campo);
                        if (el) el.classList.add('input-error');
                        // try show inline helper
                        const eEl = document.getElementById(err.campo);
                        if (eEl) {
                            const parent = eEl.parentElement;
                            const helper = parent ? parent.querySelector('.helper') : null;
                            if (helper) { helper.textContent = err.mensaje; helper.style.color = '#e74c3c'; }
                        }
                    });
                    setWorkerMsg(errores[0].mensaje, 'error');
                    return;
                }

                // Construir payload con cédula completa (prefijo + número)
                const documentoCompleto = `${cedulaPrefijo}-${cedula}`;

                const payload = {
                    Id_Trabajador: document.getElementById('w-id-trabajador').value || null,
                    Id_Cargo: cargo,
                    Id_Nivel_Educativo: nivel,
                    Nombre_Completo: nombre,
                    Apellidos: apellidos,
                    Fecha_Nacimiento: fechaNac || null,
                    Genero: document.getElementById('w-genero').value || null,
                    Documento_Identidad: documentoCompleto,
                    Correo: document.getElementById('w-correo').value.trim() || null,
                    Telefono_Movil: telefono || null,
                    Direccion: document.getElementById('w-direccion').value.trim() || null,
                    Estado_Civil: document.getElementById('w-estado-civil').value || null,
                    Fecha_de_Ingreso: fechaIngreso,
                    Id_Tipo_Nomina: tipoNomina,
                    Observaciones: document.getElementById('w-observaciones').value.trim() || null,
                    Estado: document.getElementById('w-estado').value || 'Activo'
                };

                try {
                    const endpoint = payload.Id_Trabajador ? './includes/workers/update_worker.php' : './includes/workers/add_worker.php';
                    const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                    const data = await res.json();
                    if (res.ok) {
                        setWorkerMsg(payload.Id_Trabajador ? 'Trabajador actualizado' : 'Trabajador registrado', 'success');
                        formContainer.style.display = 'none';
                        // Ensure we fetch the updated list and clear filters so user can see it
                        filterCedula.value = '';
                        filterFecha.value = '';
                        loadAndRender();
                        if (window.loadWorkersForUsers) window.loadWorkersForUsers();
                    } else {
                        setWorkerMsg(data.error || 'Error al guardar', 'error');
                    }
                } catch (e) { setWorkerMsg('Error de conexión', 'error'); }
            });

            // initial workers load
            const workers = await loadWorkersFromServer();
            allWorkersSource = workers;
            renderWorkersTable(workers);

            // remove error highlight when user edits fields
            ['w-nombre', 'w-apellidos', 'w-cedula', 'w-fecha-ingreso', 'w-cargo', 'w-nivel', 'w-tipo-nomina', 'w-correo', 'w-telefono', 'w-telefono-prefijo', 'w-direccion'].forEach(id => { const el = document.getElementById(id); if (el) el.addEventListener('input', () => el.classList.remove('input-error')); });
        }

        loadAndRender();
    }

    // --- Funciones para Pago de Nómina ---
    async function renderPayrollPayment() {
        if (!contentDetails) return;

        // State for the module
        let workers = [];
        let allConcepts = [];
        let addedConcepts = [];

        // --- Helper function to fetch concepts ---
        async function fetchConceptos() {
            try {
                const res = await fetch('./includes/nomina/list_conceptos.php', { cache: 'no-store' });
                if (!res.ok) return [];
                const data = await res.json();
                return data.conceptos || [];
            } catch (e) {
                console.error("Error fetching conceptos:", e);
                return [];
            }
        }

        // --- Load initial data (workers, users, and concepts) ---
        try {
            const [workersRes, usersRes] = await Promise.all([
                fetch('./includes/workers/list_workers.php', { cache: 'no-store' }),
                fetch('./includes/users/list_users.php', { cache: 'no-store' })
            ]);

            let linkedWorkerIds = [];
            if (usersRes.ok) {
                const userData = await usersRes.json();
                linkedWorkerIds = (userData.users || [])
                    .filter(u => u.Id_Trabajador)
                    .map(u => parseInt(u.Id_Trabajador));
            }

            if (workersRes.ok) {
                const data = await workersRes.json();
                if (data.workers && data.workers.length) {
                    // Solo incluir trabajadores que tengan un usuario vinculado
                    workers = data.workers
                        .filter(w => linkedWorkerIds.includes(parseInt(w.Id_Trabajador)))
                        .map(w => ({
                            id: w.Id_Trabajador,
                            nombres: w.Nombre_Completo,
                            apellidos: w.Apellidos || '',
                            cedula: w.Documento_Identidad
                        }));
                }
            }
        } catch (e) { console.error("Error loading data for payroll:", e); }

        allConcepts = await fetchConceptos();

        // --- Main HTML structure ---
        if (workers.length === 0) {
            contentDetails.innerHTML = `
                <div class="payroll-payment">
                    <h4>Pago de Nómina</h4>
                    <div class="alert-info">
                        <p>⚠️ No hay trabajadores con usuarios vinculados o no hay trabajadores registrados. Por favor, asegúrese de que los trabajadores tengan una cuenta de usuario.</p>
                    </div>
                </div>
            `;
            return;
        }

        let html = `
            <div class="payroll-payment">
                <h4 style="color: #2c3e50; margin-bottom: 25px; font-size: 1.5em;">💰 Pago de Nómina</h4>
                
                <!-- Datos del Pago Section -->
                <div style="background: linear-gradient(135deg, #2ecc71 0%, #3498db 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.25);">
                    <h5 style="margin: 0 0 20px 0; color: #fff; font-size: 1.1em; display: flex; align-items: center; gap: 10px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Datos del Pago
                    </h5>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #fff; font-size: 0.9em;">Trabajador <span style="color: #ffd700;">*</span></label>
                            <select id="payment-worker" style="width: 100%; padding: 12px; border: none; border-radius: 8px; font-size: 0.95em; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" required>
                                <option value="">Seleccione un trabajador</option>
                                ${workers.map(w => `<option value="${w.id}" data-cedula="${w.cedula}" data-nombres="${w.nombres}" data-apellidos="${w.apellidos}">${w.cedula} - ${w.nombres} ${w.apellidos}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #fff; font-size: 0.9em;">Período (Quincena 1-24) <span style="color: #ffd700;">*</span></label>
                            <select id="payment-periodo" style="width: 100%; padding: 12px; border: none; border-radius: 8px; font-size: 0.95em; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" required>
                                <option value="">Seleccione quincena</option>
                                ${Array.from({ length: 24 }, (_, i) => `<option value="${i + 1}">Quincena ${i + 1}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #fff; font-size: 0.9em;">Fecha de Pago <span style="color: #ffd700;">*</span></label>
                            <input type="date" id="payment-fecha-pago" style="width: 100%; padding: 12px; border: none; border-radius: 8px; font-size: 0.95em; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" required readonly>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #fff; font-size: 0.9em;">Fecha Inicio Período</label>
                            <input type="date" id="payment-fecha-inicio" style="width: 100%; padding: 12px; border: none; border-radius: 8px; font-size: 0.95em; background: #f0f0f0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" readonly>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #fff; font-size: 0.9em;">Fecha Fin Período</label>
                            <input type="date" id="payment-fecha-fin" style="width: 100%; padding: 12px; border: none; border-radius: 8px; font-size: 0.95em; background: #f0f0f0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" readonly>
                        </div>
                    </div>
                    
                    <div style="background: rgba(255,255,255,0.95); padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <label style="display: block; margin-bottom: 12px; font-weight: 700; color: #2c3e50; font-size: 1em; display: flex; align-items: center; gap: 8px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="1" x2="12" y2="23"></line>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                            </svg>
                            Salario Base (Bs.)
                        </label>
                        <input type="number" id="payment-salario-base" value="130" step="0.01" style="width: 100%; padding: 14px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1.1em; font-weight: 600; color: #2c3e50;" required>
                    </div>
                </div>

                <!-- Conceptos del Recibo Section -->
                <div id="conceptos-section" style="background: #fff; padding: 25px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); border: 1px solid #e8e8e8;">
                    <h5 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 1.1em; display: flex; align-items: center; gap: 10px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        Conceptos del Recibo
                    </h5>
                    
                    <div style="display: flex; gap: 12px; margin-bottom: 20px; align-items: center; background: #f8f9fa; padding: 15px; border-radius: 10px; border: 2px dashed #dee2e6;">
                        <select id="add-concepto-select" style="flex-grow: 1; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.95em;">
                            <option value="">Seleccionar concepto...</option>
                            ${allConcepts.map(c => `<option value="${c.Id_Concepto}">${c.Nombre_Concepto} (${c.Tipo})</option>`).join('')}
                        </select>
                        <input type="text" id="add-concepto-aux" placeholder="Aux (Ej: 15 días)" style="width: 140px; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.95em;">
                        <button id="add-concepto-btn" class="primary" style="padding: 12px 20px; background: #2ecc71; border: none; border-radius: 8px; color: #fff; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Agregar
                        </button>
                    </div>

                    <div id="conceptos-list-container" style="background: #fafafa; padding: 20px; border-radius: 10px; min-height: 80px; border: 1px solid #e8e8e8;">
                        <p id="no-concepts-msg" style="color: #95a5a6; text-align: center; margin: 20px 0; font-style: italic;">No hay conceptos agregados aún</p>
                        <div id="added-concepts-list"></div>
                    </div>

                    <div id="payslip-totals" style="margin-top: 25px; padding: 20px; border-radius: 10px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 1.05em;">
                            <div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.7); border-radius: 6px;">
                                <span style="color: #34495e; font-weight: 600;">Salario Base:</span>
                                <strong id="total-base" style="color: #2c3e50;">Bs. 0,00</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(39, 174, 96, 0.1); border-radius: 6px;">
                                <span style="color: #27ae60; font-weight: 600;">Total Asignaciones:</span>
                                <strong id="total-asignaciones" style="color: #27ae60;">+ Bs. 0,00</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(231, 76, 60, 0.1); border-radius: 6px;">
                                <span style="color: #e74c3c; font-weight: 600;">Total Deducciones:</span>
                                <strong id="total-deducciones" style="color: #e74c3c;">- Bs. 0,00</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(52, 152, 219, 0.15); border-radius: 6px;">
                                <span style="color: #2980b9; font-weight: 700; font-size: 1.1em;">Neto a Pagar:</span>
                                <strong id="total-neto" style="color: #2980b9; font-size: 1.2em;">Bs. 0,00</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 25px; display: flex; gap: 15px;">
                    <button id="generate-payslip-btn" class="primary" style="padding: 15px 30px; background: linear-gradient(135deg, #2ecc71 0%, #3498db 100%); border: none; border-radius: 10px; color: #fff; font-weight: 700; cursor: pointer; font-size: 1.05em; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.38); display: flex; align-items: center; gap: 10px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                        Generar Recibo de Pago
                    </button>
                </div>
            </div>
        `;
        contentDetails.innerHTML = html;

        // --- DOM Elements ---
        const salarioBaseInput = document.getElementById('payment-salario-base');
        const addConceptoBtn = document.getElementById('add-concepto-btn');
        const addConceptoSelect = document.getElementById('add-concepto-select');
        const addConceptoAux = document.getElementById('add-concepto-aux');
        const periodoSelect = document.getElementById('payment-periodo');
        const fechaPagoInput = document.getElementById('payment-fecha-pago');
        const fechaInicioInput = document.getElementById('payment-fecha-inicio');
        const fechaFinInput = document.getElementById('payment-fecha-fin');
        const workerSelect = document.getElementById('payment-worker');
        const generateBtn = document.getElementById('generate-payslip-btn');

        // create and insert salary warning element
        let salaryWarning = document.getElementById('salary-warning');
        if (!salaryWarning) {
            salaryWarning = document.createElement('div');
            salaryWarning.id = 'salary-warning';
            salaryWarning.style.marginTop = '8px';
            salaryWarning.style.fontWeight = '600';
            salarioBaseInput.insertAdjacentElement('afterend', salaryWarning);
        }

        // Fijar fecha de pago a hoy (solo vista)
        // Usar fecha local para evitar desajustes por UTC (toISOString da día distinto en algunas zonas)
        const now = new Date();
        const pad = (n) => String(n).padStart(2, '0');
        const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        fechaPagoInput.value = today;

        // --- Rendering and Update functions ---
        const formatCurrencyLocal = (amount) => `Bs. ${parseFloat(amount || 0).toFixed(2).replace('.', ',')}`;

        // Constantes Legales (Venezuela)
        const SALARIO_MINIMO_LEGAL = 130.00;

        // Disable/enable controls when salary is below legal minimum
        function checkSalaryMin() {
            const val = parseFloat(salarioBaseInput.value) || 0;
            const tooLow = val < SALARIO_MINIMO_LEGAL;
            [periodoSelect, fechaPagoInput, fechaInicioInput, fechaFinInput, addConceptoSelect, addConceptoBtn, workerSelect].forEach(el => { if (el) el.disabled = tooLow; });
            if (generateBtn) generateBtn.disabled = tooLow;
            if (tooLow) {
                salaryWarning.textContent = 'No se puede colocar un salario base menor a 130 Bs.';
                salaryWarning.style.color = '#e74c3c';
            } else {
                salaryWarning.textContent = '';
            }
        }

        function countMondaysJS(startStr, endStr) {
            if (!startStr || !endStr) return 2;
            const start = new Date(startStr + 'T00:00:00');
            const end = new Date(endStr + 'T00:00:00');
            let count = 0;
            let cur = new Date(start);
            while (cur <= end) {
                if (cur.getDay() === 1) count++;
                cur.setDate(cur.getDate() + 1);
            }
            return count || 2;
        }

        // Extrae el primer número encontrado en un string (ej: "15 días" -> 15)
        function extractNumericJS(str) {
            if (!str) return 1;
            const match = str.match(/(\d+(\.\d+)?)/);
            return match ? parseFloat(match[0]) : 1;
        }

        function renderAddedConcepts() {
            const container = document.getElementById('added-concepts-list');
            const noConceptsMsg = document.getElementById('no-concepts-msg');
            if (addedConcepts.length === 0) {
                container.innerHTML = '';
                noConceptsMsg.style.display = 'block';
            } else {
                noConceptsMsg.style.display = 'none';
                container.innerHTML = addedConcepts.map((c, index) => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #f0f0f0;">
                        <div>
                            <strong>${c.Nombre_Concepto}</strong>
                            <span style="font-size: 0.9em; color: #777; margin-left: 10px;">(${c.Tipo})</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <span style="font-size: 0.9em; color: #555;">${c.aux || ''}</span>
                            <strong style="color: ${c.Tipo === 'Deducción' ? '#e74c3c' : '#27ae60'};">
                                ${(() => {
                        const units = extractNumericJS(c.aux);
                        let rate = parseFloat(c.Monto) || 0;
                        const name = (c.Nombre_Concepto || '').toLowerCase();
                        const dailyKws = ['dias laborables', 'días laborables', 'dias no laborados', 'días no laborados', 'faltas', 'inasistencias', 'vacaciones', 'bono vacacional', 'permiso no remunerado', 'utilidades', 'bono de produccion', 'bono de asistencia'];

                        const isDaily = dailyKws.some(kw => name.includes(kw));

                        // If concept is daily-based (calculated as Salario/30) hide the displayed price in the list.
                        if (isDaily) {
                            return '<span style="color: #95a5a6; font-weight:600;">-</span>';
                        }

                        if (isDaily) {
                            rate = (parseFloat(salarioBaseInput.value) || 0) / 30;
                        }
                        return formatCurrencyLocal(rate * units);
                    })()}
                            </strong>
                            <button class="remove-concepto-btn" data-index="${index}" style="background: #e74c3c; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">X</button>
                        </div>
                    </div>
                `).join('');
            }
            updateTotals();
            attachRemoveConceptListeners();
        }

        function updateTotals() {
            const salarioBase = parseFloat(salarioBaseInput.value) || 0;

            // Determinar base de cálculo (salarioBase + conceptos de sueldo)
            let baseCalculo = salarioBase;
            let totalIngresos = 0; // Para FAOV legal

            addedConcepts.forEach(c => {
                const unidades = extractNumericJS(c.aux);
                let montoUnitario = parseFloat(c.Monto) || 0;

                // LÓGICA ESPECIAL: Conceptos basados en Salario Diario (Sueldo / 30)
                const nombre = (c.Nombre_Concepto || '').toLowerCase();
                const dailyKws = ['dias laborables', 'días laborables', 'dias no laborados', 'días no laborados', 'faltas', 'inasistencias', 'vacaciones', 'bono vacacional', 'permiso no remunerado', 'utilidades', 'bono de produccion', 'bono de asistencia'];

                if (dailyKws.some(kw => nombre.includes(kw))) {
                    montoUnitario = salarioBase / 30;
                }

                const montoTotal = montoUnitario * unidades;

                if (nombre.includes('sueldo') || nombre.includes('salario') || dailyKws.some(kw => nombre.includes(kw))) {
                    baseCalculo += montoTotal;
                }

                if (c.Tipo === 'Asignación' || c.Tipo === 'Bonificación' || nombre.includes('sueldo') || dailyKws.some(kw => nombre.includes(kw))) {
                    totalIngresos += montoTotal;
                }
            });

            // Si el salario base es 0, usamos totalIngresos como base para SSO/RPE
            if (baseCalculo <= 0) baseCalculo = totalIngresos;

            let totalAsignaciones = 0;
            let totalDeducciones = 0;

            addedConcepts.forEach(c => {
                const unidades = extractNumericJS(c.aux);
                let montoUnitario = parseFloat(c.Monto) || 0;

                const nombre = (c.Nombre_Concepto || '').toLowerCase();
                const dailyKws = ['dias laborables', 'días laborables', 'dias no laborados', 'días no laborados', 'faltas', 'inasistencias', 'vacaciones', 'bono vacacional', 'permiso no remunerado', 'utilidades', 'bono de produccion', 'bono de asistencia'];

                if (dailyKws.some(kw => nombre.includes(kw))) {
                    montoUnitario = salarioBase / 30;
                }

                const montoTotal = montoUnitario * unidades;

                if (c.Tipo === 'Asignación' || c.Tipo === 'Bonificación') {
                    totalAsignaciones += montoTotal;
                } else if (c.Tipo === 'Deducción') {
                    totalDeducciones += montoTotal;
                }
            });

            // Cálculos automáticos de ley para el preview
            let autoDeduc = 0;
            if (baseCalculo > 0) {
                const hasSSO = addedConcepts.some(c => (c.Nombre_Concepto || '').includes('SSO') || (c.Nombre_Concepto || '').includes('Social') || c.Codigo === 'IVSS');
                const hasRPE = addedConcepts.some(c => (c.Nombre_Concepto || '').includes('RPE') || (c.Nombre_Concepto || '').includes('Empleo') || c.Codigo === 'SPF');
                const hasFAOV = addedConcepts.some(c => (c.Nombre_Concepto || '').includes('FAOV') || (c.Nombre_Concepto || '').includes('Vivienda') || c.Codigo === 'FAOV');

                const mondays = countMondaysJS(fechaInicioInput.value, fechaFinInput.value);

                // Aplicar tope de 5 salarios mínimos
                const topeMensual = SALARIO_MINIMO_LEGAL * 5;
                const baseDeduccion = Math.min(baseCalculo, topeMensual);
                const sueldoSemanal = (baseDeduccion * 12) / 52;

                if (!hasSSO) autoDeduc += sueldoSemanal * 0.04 * mondays;
                if (!hasRPE) autoDeduc += sueldoSemanal * 0.005 * mondays;

                // FAOV legal es sobre el total de ingresos (integral)
                if (!hasFAOV) autoDeduc += totalIngresos * 0.01;
            }

            const neto = salarioBase + totalAsignaciones - totalDeducciones - autoDeduc;

            document.getElementById('total-base').textContent = formatCurrencyLocal(salarioBase);
            document.getElementById('total-asignaciones').textContent = `+ ${formatCurrencyLocal(totalAsignaciones)}`;
            document.getElementById('total-deducciones').textContent = `- ${formatCurrencyLocal(totalDeducciones + autoDeduc)}`;
            document.getElementById('total-neto').textContent = formatCurrencyLocal(neto);
        }

        // --- Event Listeners ---
        function attachRemoveConceptListeners() {
            document.querySelectorAll('.remove-concepto-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.getAttribute('data-index'));
                    addedConcepts.splice(index, 1);
                    renderAddedConcepts();
                });
            });
        }

        salarioBaseInput.addEventListener('input', () => { updateTotals(); checkSalaryMin(); });

        // run check on load
        checkSalaryMin();

        periodoSelect.addEventListener('change', (e) => {
            const quincena = parseInt(e.target.value);
            if (!quincena) return;

            const year = new Date().getFullYear();
            const month = Math.floor((quincena - 1) / 2); // 0-11
            const half = (quincena - 1) % 2; // 0 or 1

            let startDay, endDay;
            if (half === 0) {
                startDay = 1;
                endDay = 15;
            } else {
                startDay = 16;
                endDay = new Date(year, month + 1, 0).getDate();
            }

            const pad = (n) => String(n).padStart(2, '0');
            fechaInicioInput.value = `${year}-${pad(month + 1)}-${pad(startDay)}`;
            fechaFinInput.value = `${year}-${pad(month + 1)}-${pad(endDay)}`;
        });

        addConceptoBtn.addEventListener('click', () => {
            const conceptId = addConceptoSelect.value;
            if (!conceptId) return;

            const alreadyAdded = addedConcepts.some(c => c.Id_Concepto == conceptId);
            if (alreadyAdded) {
                showAlert('Este concepto ya ha sido agregado.');
                return;
            }

            const conceptToAdd = allConcepts.find(c => c.Id_Concepto == conceptId);
            if (conceptToAdd) {
                const auxValue = addConceptoAux.value.trim();
                addedConcepts.push({ ...conceptToAdd, aux: auxValue });
                addConceptoAux.value = ''; // Reset aux field
                renderAddedConcepts();
            }
        });

        document.getElementById('generate-payslip-btn').addEventListener('click', async () => {
            const workerSelect = document.getElementById('payment-worker');
            if (!workerSelect.value) { await showAlert('Por favor, seleccione un trabajador.'); return; }
            const periodo = document.getElementById('payment-periodo').value.trim();
            const fechaPago = document.getElementById('payment-fecha-pago').value;
            if (!periodo || !fechaPago) { await showAlert('Por favor, complete los campos requeridos (Período y Fecha de Pago).'); return; }

            // Validar fechas: fecha inicio no puede ser posterior a fecha fin
            const fechaInicio = fechaInicioInput.value;
            const fechaFin = fechaFinInput.value;
            if (fechaInicio && fechaFin && new Date(fechaInicio) > new Date(fechaFin)) {
                await showAlert('La fecha de inicio no puede ser posterior a la fecha de fin.');
                return;
            }

            const salarioBase = parseFloat(salarioBaseInput.value) || 0;
            if (salarioBase < 130) {
                await showAlert('El salario base no puede ser menor a 130 Bs.');
                return;
            }
            let totalAsignaciones = 0;
            let totalBonificaciones = 0;
            let totalDeducciones = 0;

            addedConcepts.forEach(c => {
                const monto = parseFloat(c.Monto) || 0;
                if (c.Tipo === 'Asignación') totalAsignaciones += monto;
                if (c.Tipo === 'Bonificación') totalBonificaciones += monto;
                if (c.Tipo === 'Deducción') totalDeducciones += monto;
            });
            const neto = salarioBase + totalAsignaciones + totalBonificaciones - totalDeducciones;
            const workerId = parseInt(workerSelect.value);
            const worker = workers.find(w => w.id === workerId);

            const newPayslip = {
                periodo: periodo,
                fechaPago: fechaPago,
                fechaInicio: document.getElementById('payment-fecha-inicio').value || fechaPago,
                fechaFin: document.getElementById('payment-fecha-fin').value || fechaPago,
                salarioBase: salarioBase,
                asignaciones: totalAsignaciones,
                bonificaciones: totalBonificaciones,
                deducciones: totalDeducciones,
                neto: neto,
                tipoNomina: 'Quincenal', // This might need to be dynamic
                trabajadorId: worker.id || null,
                trabajador: `${worker.nombres} ${worker.apellidos}`,
                cedula: worker.cedula,
                numeroRecibo: null,
                conceptos: addedConcepts
            };

            try {
                const r = await fetch('./includes/reports/payslips.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    body: JSON.stringify({ data: newPayslip })
                });
                if (!r.ok) {
                    const errorText = await r.text();
                    throw new Error(`Error al crear recibo: ${errorText}`);
                }
                const res = await r.json();

                await showAlert(`Recibo de pago generado exitosamente para ${worker.nombres} ${worker.apellidos}.\nID del Recibo: ${res.id}`);

                workerSelect.value = '';
                document.getElementById('payment-periodo').value = '';
                document.getElementById('payment-fecha-pago').value = '';
                fechaInicioInput.value = '';
                fechaFinInput.value = '';
                salarioBaseInput.value = '0';
                addedConcepts = [];
                renderAddedConcepts();

            } catch (err) {
                console.error(err);
                await showAlert(err.message || 'Error al generar el recibo');
            }
        });

        renderAddedConcepts();
    }

    // --- Funciones para Tipo de Nómina ---
    function renderTipoNominaModule() {
        if (!contentDetails) return;

        contentDetails.innerHTML = `
            <div class="tipo-nomina-module">
                <h4>Gestión de Tipos de Nómina</h4>
                <div style="margin-bottom: 20px;">
                    <button id="btn-add-nomina" class="primary">➕ Nuevo Tipo de Nómina</button>
                </div>

                <div id="form-nomina-container" style="display:none; background: linear-gradient(135deg, #2ecc71 0%, #3498db 100%); padding: 30px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.25);">
                    <h5 style="margin: 0 0 25px 0; color: #fff; font-size: 1.2em; display: flex; align-items: center; gap: 10px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Nuevo Tipo de Nómina
                    </h5>
                    
                    <div style="background: rgba(255,255,255,0.95); padding: 25px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div class="form-row">
                                <label style="display:block; font-weight:600; margin-bottom:10px; color:#34495e; font-size: 0.95em;">Frecuencia <span style="color:#e74c3c;">*</span></label>
                                <input type="text" id="tn-frecuencia" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size: 0.95em;" placeholder="Ej: Semanal, Quincenal, Mensual">
                            </div>
                            <div class="form-row">
                                <label style="display:block; font-weight:600; margin-bottom:10px; color:#34495e; font-size: 0.95em;">Fecha Inicio (Referencia)</label>
                                <input type="date" id="tn-inicio" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size: 0.95em;">
                            </div>
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div class="form-row">
                                <label style="display:block; font-weight:600; margin-bottom:10px; color:#34495e; font-size: 0.95em;">Fecha Fin (Referencia)</label>
                                <input type="date" id="tn-fin" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size: 0.95em;">
                            </div>
                        </div>
                    </div>
                    
                    <div style="display:flex; gap:15px; margin-top:25px;">
                        <button id="btn-save-nomina" class="primary" style="padding: 15px 30px; background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); border: none; border-radius: 10px; color: #fff; font-weight: 700; cursor: pointer; font-size: 1.05em; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.4); display: flex; align-items: center; gap: 10px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                            Guardar
                        </button>
                        <button id="btn-cancel-nomina" style="padding: 15px 30px; border-radius: 10px; border: 2px solid #fff; background: transparent; color: #fff; cursor: pointer; font-weight: 600; font-size: 1.05em;">Cancelar</button>
                    </div>
                </div>

                <!-- Lista de Tipos de Nómina -->
                <div id="lista-nominas-container">
                    <p>Cargando tipos de nómina...</p>
                </div>

                <!-- Vista de Trabajadores por Nómina -->
                <div id="workers-nomina-view" style="display:none; margin-top:30px; border-top:2px solid #eee; padding-top:20px;">
                    <h4 id="workers-nomina-title" style="color:#2c3e50;">Trabajadores</h4>
                    <div id="workers-nomina-list"></div>
                </div>
            </div>
        `;

        // Event Listeners
        document.getElementById('btn-add-nomina').addEventListener('click', () => {
            document.getElementById('form-nomina-container').style.display = 'block';
            document.getElementById('tn-frecuencia').focus();
        });

        document.getElementById('btn-cancel-nomina').addEventListener('click', () => {
            document.getElementById('form-nomina-container').style.display = 'none';
            document.getElementById('tn-frecuencia').value = '';
            document.getElementById('tn-inicio').value = '';
            document.getElementById('tn-fin').value = '';
        });

        document.getElementById('btn-save-nomina').addEventListener('click', async () => {
            const freq = document.getElementById('tn-frecuencia').value.trim();
            const ini = document.getElementById('tn-inicio').value;
            const fin = document.getElementById('tn-fin').value;

            if (!freq) {
                await showAlert('La frecuencia es obligatoria');
                return;
            }

            // Validar que la frecuencia solo contenga letras
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(freq)) {
                await showAlert('La frecuencia solo puede contener letras y espacios');
                return;
            }

            // Validar fechas si se proporcionan
            if (ini && fin) {
                const fechaInicio = new Date(ini);
                const fechaFin = new Date(fin);

                if (fechaFin < fechaInicio) {
                    await showAlert('La fecha de fin no puede ser anterior a la fecha de inicio');
                    return;
                }
            }

            try {
                const res = await fetch('./includes/reports/create_tipo_nomina.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Frecuencia: freq, Fecha_Inicio: ini, Fecha_Fin: fin })
                });
                const data = await res.json();
                if (res.ok) {
                    await showAlert('Tipo de nómina creado exitosamente');
                    document.getElementById('form-nomina-container').style.display = 'none';
                    document.getElementById('tn-frecuencia').value = '';
                    loadNominas(); // Recargar lista
                } else {
                    await showAlert(data.error || 'Error al crear el tipo de nómina');
                }
            } catch (e) { await showAlert('Error de conexión al guardar'); }
        });

        // Cargar datos iniciales
        loadNominas();
    }

    async function loadNominas() {
        const container = document.getElementById('lista-nominas-container');
        try {
            const res = await fetch('./includes/nomina/list_tipo_nomina.php');
            const data = await res.json();
            const tipos = data.tipos || [];

            if (tipos.length === 0) {
                container.innerHTML = '<div class="alert-info">No hay tipos de nómina registrados.</div>';
                return;
            }

            let html = `
                <table style="width:100%; border-collapse:collapse; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                    <thead>
                        <tr style="background:#3498db; color:#fff;">
                            <th style="padding:12px; text-align:left;">Frecuencia</th>
                            <th style="padding:12px; text-align:left;">Vigencia</th>
                            <th style="padding:12px; text-align:left;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            tipos.forEach(t => {
                const hasInicio = t.Fecha_Inicio && t.Fecha_Inicio !== '0000-00-00';
                const hasFin = t.Fecha_Fin && t.Fecha_Fin !== '0000-00-00';
                const vigencia = (hasInicio && hasFin)
                    ? `${formatLocalDate(t.Fecha_Inicio)} - ${formatLocalDate(t.Fecha_Fin)}`
                    : (hasInicio ? `${formatLocalDate(t.Fecha_Inicio)} - Indefinida` : 'Indefinida');
                html += `
                    <tr style="border-bottom:1px solid #f0f0f0;">
                        <td style="padding:12px;"><strong>${t.Frecuencia}</strong></td>
                        <td style="padding:12px; color:#7f8c8d;">${vigencia}</td>
                        <td style="padding:12px;">
                            <button class="btn-view-workers-nomina" data-id="${t.Id_Tipo_Nomina}" data-name="${t.Frecuencia}" style="background:#2ecc71; color:#fff; border:none; padding:8px 12px; border-radius:4px; cursor:pointer; font-weight:600;">
                                👥 Ver Trabajadores
                            </button>
                        </td>
                    </tr>
                `;
            });

            html += '</tbody></table>';
            container.innerHTML = html;

            // Listeners para botones de ver trabajadores
            container.querySelectorAll('.btn-view-workers-nomina').forEach(btn => {
                btn.addEventListener('click', () => {
                    showWorkersForNomina(btn.getAttribute('data-id'), btn.getAttribute('data-name'));
                });
            });

        } catch (e) {
            container.innerHTML = '<p style="color:red">Error cargando la lista de nóminas.</p>';
        }
    }

    async function showWorkersForNomina(id, name) {
        const view = document.getElementById('workers-nomina-view');
        const title = document.getElementById('workers-nomina-title');
        const list = document.getElementById('workers-nomina-list');

        view.style.display = 'block';
        title.textContent = `Trabajadores asignados a Nómina: ${name}`;
        list.innerHTML = '<p>Cargando trabajadores...</p>';
        view.scrollIntoView({ behavior: 'smooth' });

        try {
            // Reutilizamos list_workers.php que devuelve todos los trabajadores y filtramos en cliente
            const res = await fetch('./includes/workers/list_workers.php');
            const data = await res.json();
            const workers = data.workers || [];
            // Filtrar por Id_Tipo_Nomina
            const filtered = workers.filter(w => String(w.Id_Tipo_Nomina) === String(id));

            if (filtered.length === 0) {
                list.innerHTML = '<div class="alert-info">No hay trabajadores asignados a este tipo de nómina actualmente.</div>';
                return;
            }

            let html = `<table style="width:100%; border-collapse:collapse; margin-top:10px; background:#fff; border-radius:6px; overflow:hidden;">
                <thead>
                    <tr style="background:#ecf0f1; color:#2c3e50;">
                        <th style="padding:10px; text-align:left;">Nombre Completo</th>
                        <th style="padding:10px; text-align:left;">Cédula</th>
                        <th style="padding:10px; text-align:left;">Cargo</th>
                        <th style="padding:10px; text-align:left;">Estado</th>
                    </tr>
                </thead>
                <tbody>`;

            filtered.forEach(w => {
                html += `
                    <tr style="border-bottom:1px solid #eee;">
                        <td style="padding:10px;">${w.Nombre_Completo} ${w.Apellidos}</td>
                        <td style="padding:10px;">${w.Documento_Identidad}</td>
                        <td style="padding:10px;">${w.Cargo || '-'}</td>
                        <td style="padding:10px;"><span style="background:${w.Contrato_Estado === 'Activo' ? '#d4edda' : '#f8d7da'}; color:${w.Contrato_Estado === 'Activo' ? '#155724' : '#721c24'}; padding:2px 8px; border-radius:10px; font-size:0.85em;">${w.Contrato_Estado || 'N/A'}</span></td>
                    </tr>
                `;
            });
            html += '</tbody></table>';
            list.innerHTML = html;

        } catch (e) {
            list.innerHTML = '<p style="color:red">Error al cargar los trabajadores.</p>';
        }
    }

    // --- Funciones para Gestión de Conceptos ---
    function renderConceptosModule() {
        if (!contentDetails) return;

        contentDetails.innerHTML = `
            <div class="conceptos-module">
                <h4>Gestión de Conceptos de Nómina</h4>
                <div style="margin-bottom: 20px;">
                    <button id="btn-add-concepto" class="primary">➕ Nuevo Concepto</button>
                </div>

                <div id="form-concepto-container" style="display:none; background: linear-gradient(135deg, #2ecc71 0%, #3498db 100%); padding: 30px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.25);">
                    <h5 style="margin: 0 0 25px 0; color: #fff; font-size: 1.2em; display: flex; align-items: center; gap: 10px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        Nuevo Concepto de Nómina
                    </h5>
                    
                    <div style="background: rgba(255,255,255,0.95); padding: 25px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 20px;">
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div style="grid-column: 1 / 3;">
                                <label style="display:block; font-weight:600; margin-bottom:10px; color:#34495e; font-size: 0.95em;">Nombre del Concepto <span style="color:#e74c3c;">*</span></label>
                                <input type="text" id="c-nombre" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size: 0.95em;" placeholder="Ej: Salario Base, Bono de Alimentación, Seguro Social">
                            </div>
                            <div class="form-row">
                                <label style="display:block; font-weight:600; margin-bottom:10px; color:#34495e; font-size: 0.95em;">Código (ID Personalizado)</label>
                                <input type="text" id="c-codigo" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size: 0.95em;" placeholder="Ej: C001, SSO, FAOV">
                            </div>
                            <div class="form-row">
                                <label style="display:block; font-weight:600; margin-bottom:10px; color:#34495e; font-size: 0.95em;">Tipo de Concepto <span style="color:#e74c3c;">*</span></label>
                                <select id="c-tipo" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size: 0.95em; background: #fff;">
                                    <option value="">Seleccione un tipo</option>
                                    <option value="Asignación">Asignación</option>
                                    <option value="Deducción">Deducción</option>
                                    <option value="Bonificación">Bonificación</option>
                                    <option value="Sin tipo">Sin tipo (solo concepto base)</option>
                                </select>
                            </div>
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div style="grid-column: 1 / 3;">
                                <label style="display:block; font-weight:600; margin-bottom:10px; color:#34495e; font-size: 0.95em;">Descripción</label>
                                <textarea id="c-descripcion" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size: 0.95em; min-height: 80px;" placeholder="Descripción detallada del concepto"></textarea>
                            </div>
                            <div class="form-row">
                                <label style="display:block; font-weight:600; margin-bottom:10px; color:#34495e; font-size: 0.95em;">Monto (Bs.)</label>
                                <input type="number" id="c-monto" step="0.01" min="0" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size: 0.95em;" placeholder="0.00">
                            </div>
                            <div class="form-row">
                                <label style="display:block; font-weight:600; margin-bottom:10px; color:#34495e; font-size: 0.95em;">Observaciones (para Bonificaciones)</label>
                                <textarea id="c-observaciones" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size: 0.95em; min-height: 50px;" placeholder="Observaciones adicionales (opcional)"></textarea>
                            </div>
                        </div>
                        <div style="margin-top:15px; padding:15px; background:rgba(52, 152, 219, 0.1); border-left:4px solid #3498db; border-radius:8px; font-size:0.9em; color:#2c3e50; line-height: 1.5;">
                            <strong style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                Tip de Sueldo:
                            </strong>
                            Los conceptos que incluyan <strong>"Días Laborables", "Días no laborados", "Faltas", "Inasistencias", "Vacaciones" o "Permiso no remunerado"</strong> calcularán su valor automáticamente como <strong>(Salario Base / 30)</strong>.
                        </div>
                    </div>
                    
                    <div style="display:flex; gap:15px; margin-top:25px;">
                        <button id="btn-save-concepto" class="primary" style="padding: 15px 30px; background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); border: none; border-radius: 10px; color: #fff; font-weight: 700; cursor: pointer; font-size: 1.05em; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.4); display: flex; align-items: center; gap: 10px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                            Guardar Concepto
                        </button>
                        <button id="btn-cancel-concepto" style="padding: 15px 30px; border-radius: 10px; border: 2px solid #fff; background: transparent; color: #fff; cursor: pointer; font-weight: 600; font-size: 1.05em;">Cancelar</button>
                        <div id="concepto-msg" style="color: #fff; font-weight: 600; align-self: center;"></div>
                    </div>
                </div>

                <!-- Lista de Conceptos -->
                <div id="lista-conceptos-container">
                    <p>Cargando conceptos...</p>
                </div>
            </div>
        `;

        // Funciones de validación (definidas antes de usarse)
        function validarSoloLetras(texto) {
            // Permite letras, espacios, acentos, ñ, guiones y apóstrofes
            const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-\']+$/;
            return regex.test(texto);
        }

        function validarSoloNumeros(valor) {
            if (!valor || valor === '') {
                return false;
            }
            // Permite números enteros y decimales (con punto o coma)
            const regex = /^[0-9]+([.,][0-9]+)?$/;
            return regex.test(valor.toString().replace('.', ','));
        }

        // Configurar validación en tiempo real (una sola vez)
        function setupValidacionTiempoReal() {
            // Validación en tiempo real para el campo nombre (solo letras)
            const nombreInput = document.getElementById('c-nombre');
            if (nombreInput && !nombreInput.dataset.validacionConfigurada) {
                nombreInput.dataset.validacionConfigurada = 'true';

                nombreInput.addEventListener('input', function (e) {
                    const valor = e.target.value;
                    // Si contiene números o caracteres especiales no permitidos, mostrar advertencia
                    if (valor && !validarSoloLetras(valor)) {
                        e.target.style.borderColor = '#f39c12'; // Amarillo para advertencia
                    } else {
                        e.target.style.borderColor = '#ddd'; // Normal
                    }
                });

                // Prevenir entrada de números y caracteres especiales
                nombreInput.addEventListener('keypress', function (e) {
                    const char = String.fromCharCode(e.which);
                    // Permitir letras, espacios, acentos, guiones, apóstrofes y teclas de control
                    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-\']/.test(char) && !e.ctrlKey && !e.metaKey && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                        e.preventDefault();
                        const msgEl = document.getElementById('concepto-msg');
                        msgEl.textContent = 'El nombre solo puede contener letras, espacios y acentos';
                        msgEl.style.color = '#f39c12';
                        setTimeout(() => {
                            if (msgEl.textContent.includes('solo puede contener letras')) {
                                msgEl.textContent = '';
                            }
                        }, 3000);
                    }
                });
            }

            // Validación en tiempo real para el campo monto (solo números)
            const montoInput = document.getElementById('c-monto');
            if (montoInput && !montoInput.dataset.validacionConfigurada) {
                montoInput.dataset.validacionConfigurada = 'true';

                montoInput.addEventListener('input', function (e) {
                    const valor = e.target.value;
                    // Si contiene letras o caracteres especiales no permitidos, mostrar advertencia
                    if (valor && !validarSoloNumeros(valor)) {
                        e.target.style.borderColor = '#f39c12'; // Amarillo para advertencia
                    } else {
                        e.target.style.borderColor = '#ddd'; // Normal
                    }
                });

                // Prevenir entrada de letras y caracteres especiales (excepto punto y coma para decimales)
                montoInput.addEventListener('keypress', function (e) {
                    const char = String.fromCharCode(e.which);
                    const valorActual = e.target.value;
                    // Permitir números, un solo punto o coma decimal, y teclas de control
                    if (!/[0-9.,]/.test(char) && !e.ctrlKey && !e.metaKey && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                        e.preventDefault();
                        const msgEl = document.getElementById('concepto-msg');
                        msgEl.textContent = 'El monto solo puede contener números y un punto o coma decimal';
                        msgEl.style.color = '#f39c12';
                        setTimeout(() => {
                            if (msgEl.textContent.includes('solo puede contener números')) {
                                msgEl.textContent = '';
                            }
                        }, 3000);
                    }

                    // Prevenir múltiples puntos o comas
                    if ((char === '.' || char === ',') && (valorActual.includes('.') || valorActual.includes(','))) {
                        e.preventDefault();
                    }
                });
            }
        }

        // Event Listeners
        document.getElementById('btn-add-concepto').addEventListener('click', () => {
            document.getElementById('form-concepto-container').style.display = 'block';
            document.getElementById('c-nombre').focus();
            document.getElementById('concepto-msg').textContent = '';
            // Limpiar formulario
            document.getElementById('c-nombre').value = '';
            document.getElementById('c-codigo').value = '';
            document.getElementById('c-descripcion').value = '';
            document.getElementById('c-tipo').value = '';
            document.getElementById('c-monto').value = '';
            document.getElementById('c-observaciones').value = '';

            // Limpiar estilos de error
            ['c-nombre', 'c-monto', 'c-tipo'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.borderColor = '#ddd';
            });

            // Configurar validación en tiempo real después de mostrar el formulario
            setTimeout(() => {
                setupValidacionTiempoReal();
            }, 100);
        });

        document.getElementById('btn-cancel-concepto').addEventListener('click', () => {
            document.getElementById('form-concepto-container').style.display = 'none';
            document.getElementById('concepto-msg').textContent = '';
        });

        document.getElementById('btn-save-concepto').addEventListener('click', async () => {
            const nombre = document.getElementById('c-nombre').value.trim();
            const codigo = document.getElementById('c-codigo').value.trim();
            const descripcion = document.getElementById('c-descripcion').value.trim();
            const tipo = document.getElementById('c-tipo').value;
            const montoInput = document.getElementById('c-monto').value.trim();
            const observaciones = document.getElementById('c-observaciones').value.trim();

            const msgEl = document.getElementById('concepto-msg');

            // Limpiar errores visuales previos
            ['c-nombre', 'c-monto', 'c-tipo'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.borderColor = '#ddd';
            });

            // Validación: Nombre obligatorio
            if (!nombre) {
                msgEl.textContent = 'El nombre del concepto es obligatorio';
                msgEl.style.color = '#e74c3c';
                document.getElementById('c-nombre').style.borderColor = '#e74c3c';
                return;
            }

            // Validación: Si hay monto, se requiere un tipo
            if (montoInput && (tipo === '' || tipo === 'Sin tipo')) {
                msgEl.textContent = 'Debe seleccionar un Tipo (Asignación, Deducción o Bonificación) si ingresa un Monto.';
                msgEl.style.color = '#e74c3c';
                document.getElementById('c-tipo').style.borderColor = '#e74c3c';
                return;
            }

            // Validación: Nombre solo letras
            if (!validarSoloLetras(nombre)) {
                msgEl.textContent = 'El nombre del concepto solo puede contener letras, espacios y acentos. No se permiten números ni caracteres especiales.';
                msgEl.style.color = '#e74c3c';
                document.getElementById('c-nombre').style.borderColor = '#e74c3c';
                return;
            }

            // Validación: Longitud del nombre
            if (nombre.length < 3) {
                msgEl.textContent = 'El nombre del concepto debe tener al menos 3 caracteres';
                msgEl.style.color = '#e74c3c';
                document.getElementById('c-nombre').style.borderColor = '#e74c3c';
                return;
            }

            if (nombre.length > 100) {
                msgEl.textContent = 'El nombre del concepto no puede exceder 100 caracteres';
                msgEl.style.color = '#e74c3c';
                document.getElementById('c-nombre').style.borderColor = '#e74c3c';
                return;
            }

            // Validación: Monto requerido si hay tipo
            if (tipo && tipo !== 'Sin tipo' && !montoInput) {
                msgEl.textContent = 'El monto es requerido cuando se especifica un tipo';
                msgEl.style.color = '#e74c3c';
                document.getElementById('c-monto').style.borderColor = '#e74c3c';
                return;
            }

            // Validación: Monto solo números (si se proporciona)
            let monto = null;
            if (montoInput) {
                if (!validarSoloNumeros(montoInput)) {
                    msgEl.textContent = 'El monto solo puede contener números y un punto o coma decimal. No se permiten letras ni otros caracteres especiales.';
                    msgEl.style.color = '#e74c3c';
                    document.getElementById('c-monto').style.borderColor = '#e74c3c';
                    return;
                }

                // Convertir a número (acepta punto o coma como separador decimal)
                monto = parseFloat(montoInput.replace(',', '.'));

                // Validar que el monto sea positivo
                if (monto < 0) {
                    msgEl.textContent = 'El monto no puede ser negativo';
                    msgEl.style.color = '#e74c3c';
                    document.getElementById('c-monto').style.borderColor = '#e74c3c';
                    return;
                }
            }

            msgEl.textContent = 'Guardando...';
            msgEl.style.color = '#7f8c8d';

            try {
                const res = await fetch('./includes/nomina/create_concepto.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    body: JSON.stringify({
                        Nombre_Concepto: nombre,
                        Codigo: codigo || null,
                        Descripcion: descripcion || null,
                        Tipo: tipo || null,
                        Monto: monto,
                        Observaciones: observaciones || null
                    })
                });

                const responseText = await res.text();
                let data;
                try {
                    data = JSON.parse(responseText);
                } catch (jsonError) {
                    // The response is not JSON. It could be a simple success message or a PHP error.
                    if (res.ok) {
                        // Assume success because status is OK. The user report suggests this is the case.
                        msgEl.textContent = 'Concepto creado exitosamente';
                        msgEl.style.color = '#27ae60';
                        document.getElementById('form-concepto-container').style.display = 'none';
                        loadConceptos(); // Recargar lista
                        console.log('Server returned non-JSON response on success:', responseText);
                    } else {
                        // It's an error and not JSON. Display the text.
                        msgEl.textContent = `Error del servidor: ${responseText || 'Respuesta inválida'}`;
                        msgEl.style.color = '#e74c3c';
                        console.error('Error response (not JSON):', responseText);
                    }
                    return;
                }

                if (res.ok) {
                    msgEl.textContent = 'Concepto creado exitosamente';
                    msgEl.style.color = '#27ae60';
                    document.getElementById('form-concepto-container').style.display = 'none';
                    loadConceptos(); // Recargar lista
                } else {
                    msgEl.textContent = data.error || `Error al crear el concepto (${res.status})`;
                    msgEl.style.color = '#e74c3c';
                    console.error('Error response:', data);
                }
            } catch (e) {
                msgEl.textContent = `Error de conexión: ${e.message || 'No se pudo conectar con el servidor'}`;
                msgEl.style.color = '#e74c3c';
                console.error('Network error:', e);
            }
        });

        // Cargar datos iniciales
        loadConceptos();
    }

    async function loadConceptos() {
        const container = document.getElementById('lista-conceptos-container');
        if (!container) return;

        try {
            const res = await fetch('./includes/nomina/list_conceptos.php');
            const data = await res.json();
            const conceptos = data.conceptos || [];

            if (conceptos.length === 0) {
                container.innerHTML = '<div class="alert-info" style="padding:15px; background:#e8f4f8; border-radius:6px; color:#2c3e50;">No hay conceptos registrados. Crea uno nuevo usando el botón "➕ Nuevo Concepto".</div>';
                return;
            }

            let html = `
                <table style="width:100%; border-collapse:collapse; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                    <thead>
                        <tr style="background:#3498db; color:#fff;">
                            <th style="padding:12px; text-align:left;">Código</th>
                            <th style="padding:12px; text-align:left;">Nombre</th>
                            <th style="padding:12px; text-align:left;">Descripción</th>
                            <th style="padding:12px; text-align:left;">Tipo</th>
                            <th style="padding:12px; text-align:right;">Monto (Bs.)</th>
                            <th style="padding:12px; text-align:center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            conceptos.forEach(c => {
                const tipoColor = c.Tipo === 'Asignación' ? '#2ecc71' :
                    c.Tipo === 'Deducción' ? '#e74c3c' :
                        c.Tipo === 'Bonificación' ? '#f39c12' : '#95a5a6';
                const montoDisplay = c.Monto !== null ? parseFloat(c.Monto).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '-';

                html += `
                    <tr style="border-bottom:1px solid #f0f0f0;">
                        <td style="padding:12px;"><span style="color:#3498db; font-weight:bold;">${c.Codigo || '-'}</span></td>
                        <td style="padding:12px;"><strong>${c.Nombre_Concepto}</strong></td>
                        <td style="padding:12px; color:#7f8c8d;">${c.Descripcion || '-'}</td>
                        <td style="padding:12px;">
                            <span style="background:${tipoColor}; color:#fff; padding:4px 10px; border-radius:12px; font-size:0.85em; font-weight:600;">
                                ${c.Tipo || 'Sin tipo'}
                            </span>
                        </td>
                        <td style="padding:12px; text-align:right; font-weight:600; color:#2c3e50;">
                            ${montoDisplay !== '-' ? 'Bs. ' + montoDisplay : '-'}
                        </td>
                        <td style="padding:12px; text-align:center; display:flex; gap:5px; justify-content:center;">
                            <button class="btn-edit-concepto" data-id="${c.Id_Concepto}" style="background:#f39c12; color:#fff; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; font-weight:600; font-size:0.9em;">
                                ✏️ Editar
                            </button>
                            <button class="btn-delete-concepto" data-id="${c.Id_Concepto}" data-name="${c.Nombre_Concepto}" style="background:#e74c3c; color:#fff; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; font-weight:600; font-size:0.9em;">
                                🗑️ Eliminar
                            </button>
                        </td>
                    </tr>
                `;
            });

            html += '</tbody></table>';
            container.innerHTML = html;

            // Event listeners para los botones de editar
            container.querySelectorAll('.btn-edit-concepto').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    const concepto = conceptos.find(x => String(x.Id_Concepto) === String(id));
                    if (concepto) openEditConceptoModal(concepto);
                });
            });

            // Agregar event listeners para los botones de eliminar
            container.querySelectorAll('.btn-delete-concepto').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id');
                    const nombre = btn.getAttribute('data-name');

                    if (!await showConfirm(`¿Está seguro de que desea eliminar el concepto "${nombre}"?\n\nEsta acción no se puede deshacer.`)) {
                        return;
                    }

                    try {
                        const res = await fetch('./includes/nomina/delete_concepto.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: parseInt(id) })
                        });
                        const data = await res.json();

                        if (res.ok) {
                            await showAlert('Concepto eliminado exitosamente');
                            loadConceptos(); // Recargar la lista
                        } else {
                            await showAlert(data.error || 'Error al eliminar el concepto');
                        }
                    } catch (e) {
                        await showAlert('Error de conexión al eliminar el concepto');
                    }
                });
            });

        } catch (e) {
            container.innerHTML = '<p style="color:#e74c3c; padding:15px;">Error cargando la lista de conceptos. Por favor, recarga la página.</p>';
        }
    }

    // Modal para editar concepto
    function openEditConceptoModal(concepto) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal-content" style="max-width:500px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px">
                    <h4 style="margin:0">Editar Concepto</h4>
                    <button class="modal-close">✖</button>
                </div>
                <div class="form-group" style="margin-bottom:10px;">
                    <label style="display:block; font-weight:bold; margin-bottom:5px;">Nombre <span style="color:red">*</span></label>
                    <input type="text" id="edit-c-nombre" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px;" value="${concepto.Nombre_Concepto}">
                </div>
                <div class="form-group" style="margin-bottom:10px;">
                    <label style="display:block; font-weight:bold; margin-bottom:5px;">Código (ID Personalizado)</label>
                    <input type="text" id="edit-c-codigo" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px;" value="${concepto.Codigo || ''}">
                </div>
                <div class="form-group" style="margin-bottom:15px;">
                    <label style="display:block; font-weight:bold; margin-bottom:5px;">Descripción</label>
                    <textarea id="edit-c-descripcion" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px; min-height:80px;">${concepto.Descripcion || ''}</textarea>
                </div>
                <div style="display:flex; gap:10px; justify-content:flex-end;">
                    <button id="btn-update-concepto" class="primary">Actualizar</button>
                    <button class="modal-close" style="background:#fff; border:1px solid #ccc; padding:8px 15px; border-radius:5px; cursor:pointer;">Cancelar</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const close = () => overlay.remove();
        overlay.querySelectorAll('.modal-close').forEach(b => b.addEventListener('click', close));

        document.getElementById('btn-update-concepto').addEventListener('click', async () => {
            const nombre = document.getElementById('edit-c-nombre').value.trim();
            const codigo = document.getElementById('edit-c-codigo').value.trim();
            const descripcion = document.getElementById('edit-c-descripcion').value.trim();

            if (!nombre) { await showAlert('El nombre es obligatorio'); return; }

            try {
                const res = await fetch('./includes/nomina/update_concepto.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        Id_Concepto: concepto.Id_Concepto,
                        Nombre_Concepto: nombre,
                        Codigo: codigo,
                        Descripcion: descripcion
                    })
                });
                const data = await res.json();
                if (res.ok) {
                    await showAlert('Concepto actualizado');
                    close();
                    loadConceptos();
                } else {
                    await showAlert(data.error || 'Error al actualizar');
                }
            } catch (e) { await showAlert('Error de conexión'); }
        });
    }

    // --- Funciones para Gestión de Cargos ---
    function renderCargosModule() {
        if (!contentDetails) return;

        // --- HTML Structure ---
        contentDetails.innerHTML = `
            <div class="cargos-module">
                <h4>Gestión de Cargos</h4>
                <div style="margin-bottom: 20px;">
                    <button id="btn-add-cargo" class="primary">➕ Nuevo Cargo</button>
                </div>

                <!-- Formulario de creación (oculto por defecto) -->
                <div id="form-cargo-container" style="display:none; background: linear-gradient(135deg, #2ecc71 0%, #3498db 100%); padding: 30px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.25);">
                    <h5 style="margin: 0 0 25px 0; color: #fff; font-size: 1.2em; display: flex; align-items: center; gap: 10px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                        Nuevo Cargo
                    </h5>
                    
                    <div style="background: rgba(255,255,255,0.95); padding: 25px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 20px;">
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div class="form-row">
                                <label style="display:block; font-weight:600; margin-bottom:10px; color:#34495e; font-size: 0.95em;">Nombre del Cargo <span style="color:#e74c3c;">*</span></label>
                                <input type="text" id="cargo-nombre" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size: 0.95em;" placeholder="Ej: Gerente">
                            </div>
                            <div class="form-row">
                                <label style="display:block; font-weight:600; margin-bottom:10px; color:#34495e; font-size: 0.95em;">Área</label>
                                <input type="text" id="cargo-area" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size: 0.95em;" placeholder="Ej: Tecnología (Opcional)">
                            </div>
                        </div>
                    </div>
                    
                    <div style="display:flex; gap:15px; margin-top:25px;">
                        <button id="btn-save-cargo" class="primary" style="padding: 15px 30px; background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); border: none; border-radius: 10px; color: #fff; font-weight: 700; cursor: pointer; font-size: 1.05em; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.4); display: flex; align-items: center; gap: 10px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                            Guardar
                        </button>
                        <button id="btn-cancel-cargo" style="padding: 15px 30px; border-radius: 10px; border: 2px solid #fff; background: transparent; color: #fff; cursor: pointer; font-weight: 600; font-size: 1.05em;">Cancelar</button>
                    </div>
                    <div id="cargo-msg" style="color: #fff; font-weight: 600; margin-top: 15px;"></div>
                </div>

                <!-- Lista de Cargos -->
                <div id="lista-cargos-container">
                    <p>Cargando cargos...</p>
                </div>

                <!-- Vista de Trabajadores por Cargo -->
                <div id="workers-cargo-view" style="display:none; margin-top:30px; border-top:2px solid #eee; padding-top:20px;">
                    <h4 id="workers-cargo-title" style="color:#2c3e50;">Trabajadores</h4>
                    <div id="workers-cargo-list"></div>
                </div>
            </div>
        `;

        // --- Data fetching and rendering ---
        async function fetchCargos() {
            try {
                const res = await fetch('./includes/nomina/list_cargos.php', { cache: 'no-store' });
                const data = await res.json();
                return res.ok ? (data.cargos || []) : [];
            } catch (e) { return []; }
        }

        async function loadCargos() {
            const container = document.getElementById('lista-cargos-container');
            const cargos = await fetchCargos();

            if (cargos.length === 0) {
                container.innerHTML = '<div class="alert-info">No hay cargos registrados.</div>';
                return;
            }

            container.innerHTML = `
                <table style="width:100%; border-collapse:collapse; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                    <thead>
                        <tr style="background:#3498db; color:#fff;">
                            <th style="padding:12px; text-align:left;">Cargo</th>
                            <th style="padding:12px; text-align:left;">Área</th>
                            <th style="padding:12px; text-align:center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cargos.map(cargo => `
                            <tr style="border-bottom:1px solid #f0f0f0;">
                                <td style="padding:12px;"><strong>${cargo.Nombre_profesión}</strong></td>
                                <td style="padding:12px; color:#7f8c8d;">${cargo.Area || '-'}</td>
                                <td style="padding:12px; text-align:center; display:flex; gap:8px; justify-content:center;">
                                    <button class="btn-view-workers-cargo" data-id="${cargo.Id_Cargo}" data-name="${cargo.Nombre_profesión}" style="background:#2ecc71; color:#fff; border:none; padding:8px 12px; border-radius:4px; cursor:pointer;">
                                        👥 Ver Trabajadores
                                    </button>
                                    <button class="btn-delete-cargo" data-id="${cargo.Id_Cargo}" data-name="${cargo.Nombre_profesión}" style="background:#e74c3c; color:#fff; border:none; padding:8px 12px; border-radius:4px; cursor:pointer;">
                                        🗑️ Eliminar
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;

            // Attach listeners for new buttons
            container.querySelectorAll('.btn-view-workers-cargo').forEach(btn => {
                btn.addEventListener('click', () => {
                    showWorkersForCargo(btn.dataset.id, btn.dataset.name);
                });
            });
            container.querySelectorAll('.btn-delete-cargo').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.id;
                    const name = btn.dataset.name;
                    if (!await showConfirm(`¿Está seguro de que desea eliminar el cargo "${name}"?\n\nEsta acción no se puede deshacer.`)) return;

                    try {
                        const res = await fetch('./includes/nomina/delete_cargo.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: parseInt(id) })
                        });
                        const data = await res.json();
                        if (res.ok) {
                            loadCargos(); // Refresh list
                        } else {
                            await showAlert(data.error || 'Error al eliminar el cargo.');
                        }
                    } catch (e) {
                        await showAlert('Error de conexión al eliminar el cargo.');
                    }
                });
            });
        }

        async function showWorkersForCargo(cargoId, cargoName) {
            const view = document.getElementById('workers-cargo-view');
            const title = document.getElementById('workers-cargo-title');
            const list = document.getElementById('workers-cargo-list');

            view.style.display = 'block';
            title.textContent = `Trabajadores con el cargo: ${cargoName}`;
            list.innerHTML = '<p>Cargando trabajadores...</p>';
            view.scrollIntoView({ behavior: 'smooth' });

            try {
                const res = await fetch('./includes/workers/list_workers.php', { cache: 'no-store' });
                const data = await res.json();
                const workers = res.ok ? (data.workers || []) : [];

                const filteredWorkers = workers.filter(w => String(w.Id_Cargo) === String(cargoId));

                if (filteredWorkers.length === 0) {
                    list.innerHTML = '<div class="alert-info">No hay trabajadores asignados a este cargo actualmente.</div>';
                    return;
                }

                list.innerHTML = `<table style="width:100%; border-collapse:collapse; margin-top:10px; background:#fff; border-radius:6px; overflow:hidden;">
                <thead>
                    <tr style="background:#ecf0f1; color:#2c3e50;">
                        <th style="padding:10px; text-align:left;">Nombre Completo</th>
                        <th style="padding:10px; text-align:left;">Cédula</th>
                        <th style="padding:10px; text-align:left;">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredWorkers.map(w => `
                        <tr style="border-bottom:1px solid #eee;">
                            <td style="padding:10px;">${w.Nombre_Completo} ${w.Apellidos}</td>
                            <td style="padding:10px;">${w.Documento_Identidad}</td>
                            <td style="padding:10px;"><span style="background:${w.Contrato_Estado === 'Activo' ? '#d4edda' : '#f8d7da'}; color:${w.Contrato_Estado === 'Activo' ? '#155724' : '#721c24'}; padding:2px 8px; border-radius:10px;">${w.Contrato_Estado}</span></td>
                        </tr>
                    `).join('')}
                </tbody></table>`;
            } catch (e) {
                list.innerHTML = '<p style="color:red">Error al cargar los trabajadores.</p>';
            }
        }

        // --- Attach main event listeners ---
        document.getElementById('btn-add-cargo').addEventListener('click', () => {
            document.getElementById('form-cargo-container').style.display = 'block';
            document.getElementById('cargo-nombre').focus();
        });

        document.getElementById('btn-cancel-cargo').addEventListener('click', () => {
            document.getElementById('form-cargo-container').style.display = 'none';
            document.getElementById('cargo-nombre').value = '';
            document.getElementById('cargo-area').value = '';
        });

        document.getElementById('btn-save-cargo').addEventListener('click', async () => {
            const nombre = document.getElementById('cargo-nombre').value.trim();
            const area = document.getElementById('cargo-area').value.trim();
            const msgEl = document.getElementById('cargo-msg');

            if (!nombre) {
                msgEl.textContent = 'El nombre del cargo es obligatorio.';
                msgEl.style.color = '#e74c3c';
                return;
            }

            msgEl.textContent = 'Guardando...';
            msgEl.style.color = '#7f8c8d';

            try {
                const res = await fetch('./includes/nomina/create_cargo.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre: nombre, area: area || null })
                });
                const data = await res.json();
                if (res.ok) {
                    msgEl.textContent = '';
                    document.getElementById('cargo-nombre').value = '';
                    document.getElementById('cargo-area').value = '';
                    document.getElementById('form-cargo-container').style.display = 'none';
                    loadCargos(); // Refresh list
                    await showAlert('Cargo creado exitosamente');
                } else {
                    msgEl.textContent = data.error || 'Error al guardar el cargo.';
                    msgEl.style.color = '#e74c3c';
                }
            } catch (e) {
                msgEl.textContent = 'Error de conexión.';
                msgEl.style.color = '#e74c3c';
            }
        });

        // --- Initial Load ---
        loadCargos();
    }

    // --- Funciones para Recibos de Pago (ahora servidas desde backend) ---
    let serverPayslips = [];
    async function initializePayslipData() {
        try {
            console.log('Fetching payslips from API...');
            const res = await fetch('./includes/reports/payslips.php', { credentials: 'same-origin', cache: 'no-store' });
            console.log('API response status:', res.status, res.ok);
            if (!res.ok) {
                console.log('API response not ok, setting empty array');
                serverPayslips = [];
                return;
            }
            const rows = await res.json();
            console.log('Raw API response:', rows);
            serverPayslips = rows.map(r => ({
                id: r.Id_Payslip || (r.Data && r.Data.id) || null,
                fechaPago: (r.Data && r.Data.fechaPago) ? r.Data.fechaPago : (r.Fecha_Pago || null),
                periodo: (r.Data && r.Data.periodo) ? r.Data.periodo : (r.Data && r.Data.periodo) || '',
                trabajador: (r.Data && r.Data.trabajador) ? r.Data.trabajador : '',
                trabajadorId: (r.Data && r.Data.trabajadorId) ? r.Data.trabajadorId : (r.Id_Trabajador || null),
                cedula: (r.Data && r.Data.cedula) ? r.Data.cedula : null,
                salarioBase: (r.Data && r.Data.salarioBase) ? r.Data.salarioBase : (r.Salario_Base || 0),
                asignaciones: (r.Data && r.Data.asignaciones) ? r.Data.asignaciones : 0,
                bonificaciones: (r.Data && r.Data.bonificaciones) ? r.Data.bonificaciones : 0,
                deducciones: (r.Data && r.Data.deducciones) ? r.Data.deducciones : 0,
                neto: (r.Data && r.Data.neto) ? r.Data.neto : (r.Neto || 0),
                numeroRecibo: (r.Data && r.Data.numeroRecibo) ? r.Data.numeroRecibo : null,
                fechaInicio: (r.Data && r.Data.fechaInicio) ? r.Data.fechaInicio : null,
                fechaFin: (r.Data && r.Data.fechaFin) ? r.Data.fechaFin : null,
                conceptos: (r.Data && r.Data.conceptos) ? r.Data.conceptos : []
            }));
            console.log('Processed payslips:', serverPayslips);
        } catch (e) {
            console.log('Error in initializePayslipData:', e);
            serverPayslips = [];
        }
    }

    function getPayslips() {
        try {
            return serverPayslips || [];
        } catch (e) {
            return [];
        }
    }

    function groupPayslipsByPeriod(payslips) {
        const grouped = {};
        payslips.forEach(payslip => {
            if (!grouped[payslip.periodo]) {
                grouped[payslip.periodo] = [];
            }
            grouped[payslip.periodo].push(payslip);
        });
        return grouped;
    }
    function formatCurrency(amount) {
        // Formato en bolívares venezolanos
        if (amount === null || amount === undefined || isNaN(amount)) {
            return 'Bs. 0,00';
        }
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) {
            return 'Bs. 0,00';
        }
        // Formato: Bs. 1.234,56
        const parts = numAmount.toFixed(2).split('.');
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return 'Bs. ' + integerPart + ',' + parts[1];
    }

    function formatDate(dateString) {
        if (!dateString) return '-';
        const s = (dateString || '').toString().split('T')[0];
        const parts = s.split('-');
        if (parts.length !== 3) return dateString;
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const date = new Date(year, month, day);
        try {
            return date.toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) {
            return date.toLocaleDateString();
        }
    }

    function formatCurrencyVenezuela(amount) {
        // Formato venezolano: 1.234,56 (sin símbolo, para usar en PDF)
        if (amount === null || amount === undefined || isNaN(amount) || amount === '') {
            return '0,00';
        }
        try {
            const numAmount = parseFloat(amount);
            if (isNaN(numAmount)) {
                return '0,00';
            }
            // Formato simple: separar miles con punto y decimales con coma
            const parts = numAmount.toFixed(2).split('.');
            const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return integerPart + ',' + parts[1];
        } catch (e) {
            console.warn('Error formateando moneda:', e, 'Valor:', amount);
            // Fallback simple
            const numAmount = parseFloat(amount) || 0;
            return numAmount.toFixed(2).replace('.', ',');
        }
    }

    function formatDateShort(dateString) {
        if (!dateString) return 'N/A';
        try {
            // Prefer parsing YYYY-MM-DD or YYYY-MM-DD HH:MM:SS/T variants to avoid UTC shifts.
            const s = (dateString || '').toString().split('T')[0].split(' ')[0];
            const parts = s.split('-');
            if (parts.length === 3) {
                const year = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10);
                const day = parseInt(parts[2], 10);
                if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                    return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
                }
            }
            // Fallback: try creating Date and format as local date
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'N/A';
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } catch (e) {
            return 'N/A';
        }
    }

    /**
     * Legacy renderPayslipHistory - Delegated to Worker.js V2
     */
    async function renderPayslipHistory() {
        if (typeof window.renderWorkerModuleV2 === 'function') {
            return window.renderWorkerModuleV2('Historial de Recibos');
        }
        if (contentDetails) contentDetails.innerHTML = '<p class="error">Módulo de recibos no disponible.</p>';
    }

    // --- Implementaciones Trabajador ---
    function renderWorkerModule(name) {
        if (!contentDetails) return;

        // Always try V2 first
        if (typeof window.renderWorkerModuleV2 === 'function') {
            return window.renderWorkerModuleV2(name);
        }

        // Fallback for non-migrated segments if any
        if (name.toLowerCase().includes('vacaciones')) {
            return renderWorkerVacationRequest();
        }

        contentDetails.innerHTML = `<p>El módulo '${name}' está siendo migrado.</p>`;
    }

    async function renderWorkerVacationRequest() {
        if (typeof window.renderWorkerModuleV2 === 'function') {
            return window.renderWorkerModuleV2('Vacaciones');
        }
        if (contentDetails) contentDetails.innerHTML = '<p class="error">Módulo de vacaciones no disponible.</p>';
    }

    // Helper para renderizar pagos en el perfil (reutilizable)
    async function renderProfilePays(workerId, workerCedula) {
        const listEl = document.getElementById('perfil-pagos-list');
        if (!listEl) return;
        try {
            await initializePayslipData();
            const pays = getPayslips();
            const myPays = pays.filter(p => (p.trabajadorId && String(p.trabajadorId) === String(workerId)) || (!p.trabajadorId && String(p.cedula) === String(workerCedula)));
            if (!myPays.length) { listEl.innerHTML = '<p style="color:#7f8c8d">No tiene recibos registrados.</p>'; return; }
            listEl.innerHTML = `<table style="width:100%;border-collapse:collapse"><thead><tr style="background:#ecf0f1"><th style="padding:6px">Fecha</th><th style="padding:6px">Período</th><th style="padding:6px">Neto</th><th style="padding:6px"></th></tr></thead><tbody>${myPays.map(p => `<tr><td style="padding:6px">${formatDate(p.fechaPago)}</td><td style="padding:6px">${p.periodo}</td><td style="padding:6px">${formatCurrency(p.neto)}</td><td style="padding:6px"><button class="perfil-download" data-pid="${p.id}" style="background:#3498db;color:#fff;border:none;padding:6px 8px;border-radius:4px;cursor:pointer">📄 Descargar</button></td></tr>`).join('')}</tbody></table>`;
            listEl.querySelectorAll('.perfil-download').forEach(b => b.addEventListener('click', () => {
                const pid = b.getAttribute('data-pid');
                if (pid) window.open(`./includes/reports/recibo_de_pago.php?id=${pid}`, '_blank');
            }));
        } catch (e) { console.warn('Error renderProfilePays', e); listEl.innerHTML = '<p style="color:#e74c3c">Error al cargar historial.</p>'; }
    }

    // --- Implementaciones SuperUsuario ---
    function renderSuperModule(name) {
        if (!contentDetails) return;
        if (name.toLowerCase().includes('usuarios')) { renderSuperUserView(); return; }
        if (name.toLowerCase().includes('reportes')) { renderSuperReports(); return; }
        if (name.toLowerCase().includes('configur')) {
            const key = 'payroll_global_config';
            function loadGlobalCfg() { return fetch('./includes/settings.php?key=' + encodeURIComponent(key)).then(r => r.ok ? r.text().then(t => { try { return JSON.parse(t); } catch (e) { return {}; } }) : {}).catch(() => ({})); }
            loadGlobalCfg().then(cfg => {
                contentDetails.innerHTML = `<div><h4>Configuración Global</h4><textarea id="global-cfg" style="width:100%;height:220px">${JSON.stringify(cfg, null, 2)}</textarea><div style="margin-top:8px"><button id="save-global" class="primary">Guardar</button></div></div>`;
                fetch('./includes/settings.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: key, value: v }) })
                    .then(async r => { if (r.ok) await showAlert('Guardado'); else await showAlert('Error al guardar'); })
                    .catch(async () => await showAlert('Error al guardar'));
            });
            return;
        }
        if (name.toLowerCase().includes('logs')) {
            const key = 'payroll_logs';
            fetch('./includes/settings.php?key=' + encodeURIComponent(key)).then(r => r.ok ? r.text() : Promise.resolve('[]')).then(text => {
                let logs = [];
                try { logs = JSON.parse(text) || []; } catch (e) { logs = []; }
                contentDetails.innerHTML = `<div><h4>Logs</h4>${logs.length ? logs.map(l => `<div>${l}</div>`).join('') : '<p>No hay logs.</p>'}<div style="margin-top:10px"><button id="download-logs" class="primary">Descargar</button></div></div>`;
                document.getElementById('download-logs').addEventListener('click', () => { const arr = logs; const blob = new Blob([arr.join('\n')], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'logs.txt'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); });
            }).catch(() => { contentDetails.innerHTML = `<div><h4>Logs</h4><p>No hay logs.</p></div>`; });
            return;
        }
        if (name.toLowerCase().includes('respaldo') || name.toLowerCase().includes('respaldo')) {
            contentDetails.innerHTML = `<div><h4>Respaldo de Base de Datos (simulado)</h4><button id="export-db" class="primary">Exportar JSON</button></div>`;
            document.getElementById('export-db').addEventListener('click', async () => {
                try {
                    const [usersRes, workersRes, novRes] = await Promise.all([
                        fetch('./includes/users/list_users.php'),
                        fetch('./includes/workers/list_workers.php'),
                        fetch('./includes/reports/novedades.php')
                    ]);
                    const users = usersRes.ok ? await usersRes.json() : {};
                    const workers = workersRes.ok ? (await workersRes.json()).workers : [];
                    const novedades = novRes.ok ? await novRes.json() : [];
                    const dump = { users, employees: workers, novedades };
                    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'backup.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
                } catch (e) { await showAlert('Error generando respaldo'); }
            });
            return;
        }

        // Gestión de Usuarios - vista y CRUD simple (con edición)
        function renderSuperUserView() {
            if (!contentDetails) return;
            let allUsers = []; // Cache local para filtrado
            if (contentHeader) contentHeader.innerHTML = `<h4>Gestión de Usuarios y Roles</h4>`;
            contentDetails.innerHTML = `
                <div id="users-app">
                    <div style="display:flex;justify-content:space-between;align-items:center; margin-bottom: 25px;">
                        <div style="display:flex; gap:10px;">
                            <button id="new-user-btn" class="primary" style="padding: 10px 20px; background: #3498db; border: none; border-radius: 8px; color: #fff; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Nuevo Usuario
                            </button>
                            <button id="refresh-users" style="padding: 10px 20px; background: #95a5a6; border: none; border-radius: 8px; color: #fff; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M23 4v6h-6"></path>
                                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                                </svg>
                                Refrescar
                            </button>
                            <button id="create-default-su" style="background:#8e44ad; color:#fff; border:none; padding:10px 15px; border-radius:8px; cursor:pointer; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                    <path d="M2 17l10 5 10-5"></path>
                                    <path d="M2 12l10 5 10-5"></path>
                                </svg>
                                Crear SU
                            </button>
                        </div>
                        <div id="users-message" style="color:var(--text-muted); font-weight: 600;"></div>
                    </div>
                    
                    <!-- Filtros de Usuario -->
                    <div id="users-filters" style="margin-bottom:20px; background:var(--card-bg); padding:15px; border-radius:12px; display:flex; gap:35px; align-items:flex-end; border:1px solid var(--border-color); flex-wrap: wrap;">
                        <div style="width:180px;">
                            <label style="display:block; font-size:10px; color:var(--text-muted); margin-bottom:5px; font-weight:700; text-transform:uppercase;">Usuario / Correo</label>
                            <input id="f-usr-query" type="text" readonly onfocus="this.removeAttribute('readonly');" onblur="this.setAttribute('readonly',true);" autocomplete="new-password" placeholder="Nombre..." style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-color); color:var(--text-main); font-size:12px;">
                        </div>
                        <div style="width:180px;">
                            <label style="display:block; font-size:10px; color:var(--text-muted); margin-bottom:5px; font-weight:700; text-transform:uppercase;">Trabajador</label>
                            <input id="f-usr-work" type="text" readonly onfocus="this.removeAttribute('readonly');" onblur="this.setAttribute('readonly',true);" autocomplete="new-password" placeholder="Nombre..." style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-color); color:var(--text-main); font-size:12px;">
                        </div>
                        <div style="width:130px;">
                            <label style="display:block; font-size:10px; color:var(--text-muted); margin-bottom:5px; font-weight:700; text-transform:uppercase;">Rol</label>
                            <select id="u-filter-role" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-color); color:var(--text-main); font-size:12px;">
                                <option value="">Todos</option>
                                <option value="SuperUsuario">SuperUsuario</option>
                                <option value="Administrativo">Administrativo</option>
                                <option value="Trabajador">Trabajador</option>
                            </select>
                        </div>
                        <div style="width:130px;">
                            <label style="display:block; font-size:10px; color:var(--text-muted); margin-bottom:5px; font-weight:700; text-transform:uppercase;">Estado</label>
                            <select id="u-filter-status" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-color); color:var(--text-main); font-size:12px;">
                                <option value="">Todos</option>
                                <option value="Activo">Activos</option>
                                <option value="Inactivo">Inactivos</option>
                            </select>
                        </div>
                    </div>

                    <div id="user-form" style="display:none; background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%); padding: 30px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                        <h5 id="user-form-title" style="margin: 0 0 25px 0; color: #fff; font-size: 1.25em; display: flex; align-items: center; gap: 10px; font-weight: 700;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            Datos de Usuario
                        </h5>
                        
                        <div style="background: var(--card-bg); padding: 25px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid var(--border-color, #eee);">
                            <h6 style="margin: 0 0 20px 0; color: var(--text-main); font-size: 1em; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                Información de Identidad
                            </h6>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                <div class="form-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color:var(--text-main); font-size:0.9em;">Usuario <span style="color:#e74c3c;">*</span></label>
                                    <input id="u-username" style="width:100%; padding:12px; border:1px solid var(--border-color, #ddd); border-radius:8px; font-size:0.95em; background:var(--bg-color); color:var(--text-main);" placeholder="ejemplo_123"/>
                                    <div id="u-username-msg" style="display:none; color:#e74c3c; font-size:11px; margin-top:4px;"></div>
                                </div>
                                <div class="form-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color:var(--text-main); font-size:0.9em;">Nombre Completo <span style="color:#e74c3c;">*</span></label>
                                    <input id="u-name" style="width:100%; padding:12px; border:1px solid var(--border-color, #ddd); border-radius:8px; font-size:0.95em; background:var(--bg-color); color:var(--text-main);" placeholder="Nombre real"/>
                                    <div id="u-name-msg" style="display:none; color:#e74c3c; font-size:11px; margin-top:4px;"></div>
                                </div>
                                <div class="form-row" style="grid-column: 1/3;">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color:var(--text-main); font-size:0.9em;">Correo Electrónico <span style="color:#e74c3c;">*</span></label>
                                    <input id="u-email" style="width:100%; padding:12px; border:1px solid var(--border-color, #ddd); border-radius:8px; font-size:0.95em; background:var(--bg-color); color:var(--text-main);" placeholder="correo@ejemplo.com"/>
                                    <div id="u-email-msg" style="display:none; color:#e74c3c; font-size:11px; margin-top:4px;"></div>
                                </div>
                            </div>
                        </div>

                        <div style="background: var(--card-bg); padding: 25px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid var(--border-color, #eee);">
                            <h6 style="margin: 0 0 20px 0; color: var(--text-main); font-size: 1em; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                Rol y Vinculación
                            </h6>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                <div class="form-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color:var(--text-main); font-size:0.9em;">Rol <span style="color:#e74c3c;">*</span></label>
                                    <select id="u-role" style="width:100%; padding:12px; border:1px solid var(--border-color, #ddd); border-radius:8px; font-size:0.95em; background:var(--bg-color); color:var(--text-main);">
                                        <option value="Trabajador">Trabajador</option>
                                        <option value="Administrativo">Administrativo</option>
                                        <option value="SuperUsuario">SuperUsuario</option>
                                    </select>
                                </div>
                                <div class="form-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color:var(--text-main); font-size:0.9em;">Trabajador Vinculado</label>
                                    <select id="u-worker" style="width:100%; padding:12px; border:1px solid var(--border-color, #ddd); border-radius:8px; font-size:0.95em; background:var(--bg-color); color:var(--text-main);">
                                        <option value="">— Sin vincular —</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div style="background: var(--card-bg); padding: 25px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid var(--border-color, #eee);">
                            <h6 style="margin: 0 0 20px 0; color: var(--text-main); font-size: 1em; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                Seguridad
                            </h6>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                <div class="form-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color:var(--text-main); font-size:0.9em;">Contraseña <span id="u-pass-req-star" style="color:#e74c3c; display:none;">*</span></label>
                                    <div class="input-row" style="position:relative;">
                                        <input id="u-password" type="password" autocomplete="new-password" style="width:100%; padding:12px; border:1px solid var(--border-color, #ddd); border-radius:8px; font-size:0.95em; background:var(--bg-color); color:var(--text-main);" placeholder="Mínimo 8 caracteres"/>
                                        <button type="button" class="toggle-pass" style="position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; color:var(--text-muted); cursor:pointer;">${eyeSvg}</button>
                                    </div>
                                    <div id="u-password-msg" style="display:none; color:#e74c3c; font-size:11px; margin-top:4px;"></div>
                                    <div id="u-password-rules" style="margin-top:10px; font-size:11px; color:var(--text-muted); line-height:1.6; background: rgba(0,0,0,0.03); padding: 10px; border-radius: 6px;">
                                        <div style="font-weight:700; margin-bottom:5px; color:var(--text-main);">Requisitos de seguridad:</div>
                                        <div id="rule-length" style="display:flex; align-items:center; gap:6px;"><span class="dot" style="font-size:14px;">○</span> Al menos 8 caracteres</div>
                                        <div id="rule-upper" style="display:flex; align-items:center; gap:6px;"><span class="dot" style="font-size:14px;">○</span> Al menos una mayúscula</div>
                                        <div id="rule-lower" style="display:flex; align-items:center; gap:6px;"><span class="dot" style="font-size:14px;">○</span> Al menos una minúscula</div>
                                        <div id="rule-number" style="display:flex; align-items:center; gap:6px;"><span class="dot" style="font-size:14px;">○</span> Al menos un número</div>
                                        <div id="rule-special" style="display:flex; align-items:center; gap:6px;"><span class="dot" style="font-size:14px;">○</span> Al menos un caracter especial</div>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color:var(--text-main); font-size:0.9em;">Repetir Contraseña <span id="u-passconf-req-star" style="color:#e74c3c; display:none;">*</span></label>
                                    <div class="input-row" style="position:relative;">
                                        <input id="u-password-confirm" type="password" autocomplete="new-password" style="width:100%; padding:12px; border:1px solid var(--border-color, #ddd); border-radius:8px; font-size:0.95em; background:var(--bg-color); color:var(--text-main);" placeholder="Confirme contraseña"/>
                                        <button type="button" class="toggle-pass" style="position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; color:var(--text-muted); cursor:pointer;">${eyeSvg}</button>
                                    </div>
                                    <div id="u-password-confirm-msg" style="display:none; color:#e74c3c; font-size:11px; margin-top:4px;"></div>
                                </div>
                            </div>
                        </div>

                        <div style="display:flex; gap:15px; margin-top:30px; align-items: center;">
                            <button id="save-user" style="padding: 15px 35px; background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); border: none; border-radius: 10px; color: #fff; font-weight: 700; cursor: pointer; font-size: 1.1em; display: flex; align-items: center; gap: 10px; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                                Guardar Datos
                            </button>
                            <button id="cancel-user" style="padding: 15px 30px; border-radius: 10px; border: 2px solid #fff; background: transparent; color: #fff; cursor: pointer; font-weight: 700;">Cancelar</button>
                            <div id="u-form-msg"></div>
                        </div>
                    </div>
                    <div id="users-list" style="margin-top:16px;"></div>
                </div>
            `;

            const usersMessage = document.getElementById('users-message');
            const newUserBtn = document.getElementById('new-user-btn');
            const userForm = document.getElementById('user-form');
            const saveBtn = document.getElementById('save-user');
            const cancelBtn = document.getElementById('cancel-user');
            const refreshBtn = document.getElementById('refresh-users');
            const formTitle = document.getElementById('user-form-title');



            // --- Password Toggle Logic ---
            function setupPasswordToggles(container) {
                const toggles = container.querySelectorAll('.toggle-pass');
                toggles.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const row = btn.closest('.input-row');
                        if (!row) return;
                        const inp = row.querySelector('input');
                        if (!inp) return;
                        const isPass = inp.type === 'password';
                        inp.type = isPass ? 'text' : 'password';
                        btn.innerHTML = isPass ? eyeOffSvg : eyeSvg;
                        btn.setAttribute('aria-label', isPass ? 'Ocultar contraseña' : 'Mostrar contraseña');
                        inp.focus();
                    });
                });
            }
            if (userForm) setupPasswordToggles(userForm);

            let editUserId = null; // si no es null, estamos en modo edición

            function showUsersMsg(msg, type = 'info') { if (usersMessage) { usersMessage.textContent = msg; usersMessage.style.color = type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#7f8c8d'; } }

            newUserBtn.addEventListener('click', () => {
                editUserId = null;
                formTitle.textContent = 'Crear Usuario';
                if (!userForm) return;
                if (userForm.classList.contains('open')) closeSmooth(userForm);
                else openSmooth(userForm);
                clearForm();
            });

            cancelBtn.addEventListener('click', () => { editUserId = null; if (userForm) closeSmooth(userForm); clearForm(); });

            refreshBtn.addEventListener('click', () => { loadAndRenderUsers(); });

            // --- Lógica de Filtrado ---
            function applyFilters() {
                const qSearch = document.getElementById('f-usr-query').value.toLowerCase().trim();
                const qWorker = document.getElementById('f-usr-work').value.toLowerCase().trim();
                const qRole = document.getElementById('u-filter-role').value;
                const qStatus = document.getElementById('u-filter-status').value;

                const filtered = allUsers.filter(u => {
                    const matchesSearch = !qSearch || (u.Nombre_usuario || '').toLowerCase().includes(qSearch) || (u.Correo || '').toLowerCase().includes(qSearch);
                    const matchesWorker = !qWorker || (u.Trabajador_Nombre || '').toLowerCase().includes(qWorker);
                    const matchesRole = !qRole || u.Nombre_rol === qRole;
                    const matchesStatus = !qStatus || (u.Estado || 'Activo') === qStatus;
                    return matchesSearch && matchesWorker && matchesRole && matchesStatus;
                });

                renderUsersTable(filtered);
            }

            ['f-usr-query', 'f-usr-work', 'u-filter-role', 'u-filter-status'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.addEventListener('input', applyFilters);
                    // Forzar limpieza extrema (proteger contra autofill agresivo)
                    const clear = () => {
                        // Si el elemento no tiene foco, forzamos que esté vacío si no se ha inicializado
                        if (document.activeElement !== el && !window.filterInitialized) {
                            if (el.tagName === 'INPUT') el.value = '';
                            else if (el.tagName === 'SELECT') el.selectedIndex = 0;
                        }
                    };
                    clear();
                    for(let t of [50, 150, 300, 500, 1000, 2000, 3000, 5000]) setTimeout(clear, t);
                }
            });
            window.filterInitialized = true;

            // Asegurar que el formulario de usuario esté limpio al iniciar (Nuclear - Solo búsqueda)
            const forceClearForm = () => {
                // No limpiamos contraseñas aquí si el usuario quiere que persistan/autocompleten
            };
            forceClearForm();
            setTimeout(forceClearForm, 250);

            // (Logic integrated into validateUserForm)

            // --- Validaciones en tiempo real para el formulario de usuario ---
            window.allowedEmailDomains = new Set(['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com']);

            function extractDomain(email) {
                if (!email || typeof email !== 'string') return '';
                const parts = email.split('@');
                return parts.length === 2 ? parts[1].toLowerCase() : '';
            }

            function validateEmailFormat(email) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            }

            function validateEmailDomain(email) {
                const d = extractDomain(email);
                if (!d) return false;
                if (window.allowedEmailDomains && window.allowedEmailDomains.size) return window.allowedEmailDomains.has(d);
                return true;
            }

            function validateUserForm() {
                let ok = true;
                const emailEl = document.getElementById('u-email');
                const usernameEl = document.getElementById('u-username');
                const nameEl = document.getElementById('u-name');
                const passEl = document.getElementById('u-password');
                const passConfEl = document.getElementById('u-password-confirm');

                const emailMsg = document.getElementById('u-email-msg');
                const unameMsg = document.getElementById('u-username-msg');
                const nameMsg = document.getElementById('u-name-msg');

                const email = emailEl ? emailEl.value.trim() : '';
                const username = usernameEl ? usernameEl.value.trim() : '';
                const name = nameEl ? nameEl.value.trim() : '';
                const pass = passEl ? passEl.value : '';
                const passConf = passConfEl ? passConfEl.value : '';

                // Reset styles
                const resetStyle = (el, msg) => {
                    if (el) el.style.borderColor = 'var(--border-color)';
                    if (msg) { msg.style.display = 'none'; msg.textContent = ''; }
                };
                const setErr = (el, msg, text) => {
                    if (el) el.style.borderColor = '#e74c3c';
                    if (msg) { msg.style.display = 'block'; msg.textContent = text; msg.style.color = '#e74c3c'; msg.style.fontSize = '11px'; msg.style.marginTop = '4px'; }
                    ok = false;
                };

                resetStyle(emailEl, emailMsg);
                resetStyle(usernameEl, unameMsg);
                resetStyle(nameEl, nameMsg);
                if (passEl) passEl.style.borderColor = 'var(--border-color)';
                if (passConfEl) passConfEl.style.borderColor = 'var(--border-color)';

                // 1. Correo
                if (!email) {
                    ok = false;
                } else if (!email.includes('@')) {
                    setErr(emailEl, emailMsg, 'Tu dirección de correo electrónico debe contener @.');
                } else if (!validateEmailFormat(email)) {
                    setErr(emailEl, emailMsg, 'Formato de correo inválido');
                } else if (!validateEmailDomain(email)) {
                    setErr(emailEl, emailMsg, 'Dominio no permitido (ej: gmail.com)');
                } else {
                    if (emailEl) emailEl.style.borderColor = '#2ecc71';
                }

                // 2. Usuario
                const usernameRegex = /^[a-zA-Z0-9._]+$/;
                if (!username) {
                    ok = false;
                } else if (username.length < 3) {
                    setErr(usernameEl, unameMsg, 'Mínimo 3 caracteres');
                } else if (!usernameRegex.test(username)) {
                    setErr(usernameEl, unameMsg, 'Solo letras, números, puntos y guiones bajos');
                } else {
                    if (usernameEl) usernameEl.style.borderColor = '#2ecc71';
                }

                // 3. Nombre Completo
                const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
                if (!name) {
                    ok = false;
                } else if (name.length < 3) {
                    // Solo activar ok=false sin mensaje si es muy corto? 
                    // El usuario dijo solo si viola restricciones. Dejaremos que ok sea true si solo es corto por ahora?
                    // No, length < 3 es una restricción.
                    setErr(nameEl, nameMsg, 'Nombre muy corto');
                } else if (!nameRegex.test(name)) {
                    setErr(nameEl, nameMsg, 'Tu nombre solo puede contener letras.');
                } else {
                    if (nameEl) nameEl.style.borderColor = '#2ecc71';
                }

                // 4. Contraseñas
                const updateRule = (id, valid) => {
                    const el = document.getElementById(id);
                    if (!el) return;
                    el.style.color = valid ? '#27ae60' : (pass.length > 0 ? '#e74c3c' : 'var(--text-muted)');
                    const d = el.querySelector('.dot'); if (d) d.textContent = valid ? '●' : '○';
                };
                const passRules = [
                    { test: (pw) => pw.length >= 8, id: 'rule-length' },
                    { test: (pw) => /[A-Z]/.test(pw), id: 'rule-upper' },
                    { test: (pw) => /[a-z]/.test(pw), id: 'rule-lower' },
                    { test: (pw) => /[0-9]/.test(pw), id: 'rule-number' },
                    { test: (pw) => /[^a-zA-Z0-9]/.test(pw), id: 'rule-special' }
                ];
                passRules.forEach(r => updateRule(r.id, r.test(pass)));

                if (!editUserId || pass.length > 0 || passConf.length > 0) {
                    const passValid = passRules.every(r => r.test(pass));
                    const pwMsg = document.getElementById('u-password-msg');
                    const passConfEl = document.getElementById('u-password-confirm');
                    const passConfMsg = document.getElementById('u-password-confirm-msg');

                    if (!pass) {
                        if (!editUserId) ok = false; 
                    } else if (!passValid) {
                        setErr(passEl, pwMsg, 'La contraseña no cumple los requisitos.');
                        ok = false;
                    } else {
                        if (passEl) passEl.style.borderColor = '#2ecc71';
                        if (pwMsg) pwMsg.style.display = 'none';
                    }

                    if (pass !== passConf && passConf.length > 0) {
                        setErr(passConfEl, passConfMsg, 'Las contraseñas no coinciden.');
                        ok = false;
                    } else if (passConf && pass === passConf) {
                        if (passConfEl) {
                            passConfEl.style.borderColor = '#2ecc71';
                            if (passConfMsg) { passConfMsg.style.display = 'none'; }
                        }
                    } else {
                        // Reset if empty
                        resetStyle(passConfEl, passConfMsg);
                    }
                }

                return ok;
            }

            // Attach listeners for realtime validation
            ['u-email', 'u-username', 'u-name', 'u-password', 'u-password-confirm', 'u-role', 'u-worker'].forEach(id => {
                const el = document.getElementById(id);
                if (!el) return;
                el.addEventListener('input', () => validateUserForm());
                el.addEventListener('change', () => validateUserForm());

                // Bloqueo de caracteres en tiempo real para Nombre Real (igual que trabajadores)
                if (id === 'u-name') {
                    el.addEventListener('keypress', (e) => {
                        const char = String.fromCharCode(e.which);
                        if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/.test(char) && !e.ctrlKey && !e.metaKey && e.key !== 'Backspace' && e.key !== 'Delete') {
                            e.preventDefault();
                            // Mostrar mensaje de error al intentar ingresar algo inválido
                            const nameMsg = document.getElementById('u-name-msg');
                            if (nameMsg) {
                                nameMsg.style.display = 'block';
                                nameMsg.textContent = 'Tu nombre solo puede contener letras.';
                                el.style.borderColor = '#e74c3c';
                                // Limpiar después de 2 segundos para no ser intrusivo
                                setTimeout(() => { if (!/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/.test(el.value)) { nameMsg.style.display = 'none'; el.style.borderColor = (el.value ? '#2ecc71' : 'var(--border-color)'); } }, 2000);
                            }
                        }
                    });
                    el.addEventListener('input', (e) => {
                        const v = e.target.value;
                        if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/.test(v)) {
                            e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
                            validateUserForm();
                        }
                    });
                }
            });

            // Helper para abrir/cerrar elementos con animación suave
            function openSmooth(el) {
                if (!el) return;
                el.classList.add('open');
                // ensure display block for accessibility (some forms rely on display)
                el.style.display = 'block';
                // remove explicit max-height after transition to allow natural height growth
                setTimeout(() => { try { el.style.maxHeight = ''; } catch (e) { } }, 300);
            }

            function closeSmooth(el) {
                if (!el) return;
                // set a max-height equal to current height to enable transition to 0
                try { el.style.maxHeight = el.scrollHeight + 'px'; } catch (e) { }
                // force reflow then start collapse
                requestAnimationFrame(() => {
                    el.classList.remove('open');
                    el.style.maxHeight = '0';
                    el.style.opacity = '0';
                });
                // after animation, hide the element to keep previous behaviour
                setTimeout(() => { try { el.style.display = 'none'; el.style.maxHeight = ''; el.style.opacity = ''; } catch (e) { } }, 320);
            }

            // Load workers to populate the worker select in user form
            window.loadWorkersForUsers = async function loadWorkersForUsers() {
                try {
                    const res = await fetch('/superusuario/workers-list', { cache: 'no-store', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content } });
                    const data = await res.json();
                    const sel = document.getElementById('u-worker');
                    if (!sel) return;
                    // clear except default
                    sel.innerHTML = '<option value="">— Sin trabajador —</option>';
                    if (res.ok && data.workers && data.workers.length) {
                        // Determine which workers are already linked to users so we can hide them
                        const usersList = await loadUsers().catch(() => []);
                        // Enriquecer la lista de dominios permitidos con los dominios ya usados por usuarios existentes
                        try {
                            if (!window.allowedEmailDomains) window.allowedEmailDomains = new Set(['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com']);
                            usersList.forEach(u => {
                                const c = (u.Correo || '').trim().toLowerCase();
                                const d = extractDomain(c);
                                if (d) window.allowedEmailDomains.add(d);
                            });
                        } catch (e) { /* no bloquear si falla */ }
                        // If editing a user, allow that user's linked worker to remain in the list
                        const currentAssigned = editUserId ? String((usersList.find(u => String(u.Id_Usuario) === String(editUserId)) || {}).Id_Trabajador || '') : '';
                        const assigned = new Set();
                        usersList.forEach(u => { if (u.Id_Trabajador && String(u.Id_Trabajador) !== currentAssigned) assigned.add(String(u.Id_Trabajador)); });

                        data.workers.forEach(w => {
                            const wid = String(w.Id_Trabajador || '');
                            if (assigned.has(wid)) return; // skip workers already with a user (unless it's the one we're editing)
                            const opt = document.createElement('option');
                            opt.value = w.Id_Trabajador;
                            opt.textContent = `${w.Nombre_Completo || w.Nombre} ${w.Apellidos || ''} ${w.Documento_Identidad ? '· ' + w.Documento_Identidad : ''}`;
                            sel.appendChild(opt);
                        });
                    }
                } catch (e) { /* ignore */ }
            }

            // Create default SuperUsuario button
            const createSuBtn = document.getElementById('create-default-su');
            if (createSuBtn) {
                createSuBtn.addEventListener('click', async () => {
                    if (!await showConfirm('Crear un usuario SuperUsuario por defecto? Se generará un usuario con contraseña temporal.')) return;
                    showUsersMsg('Creando SuperUsuario...');
                    try {
                        const res = await fetch('/superusuario/create-superuser', { method: 'POST', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content } });
                        const data = await res.json();
                        if (res.ok) {
                            if (data.password) {
                                showUsersMsg(`Creado: ${data.username} · contraseña: ${data.password}`, 'success');
                            } else if (data.message && data.username) {
                                showUsersMsg(`${data.message}: ${data.username}`, 'info');
                            } else if (data.message) {
                                showUsersMsg(data.message, 'info');
                            }
                            loadAndRenderUsers();
                        } else {
                            showUsersMsg(data.error || 'Error creando SuperUsuario', 'error');
                        }
                    } catch (e) { showUsersMsg('Error de conexión', 'error'); }
                });
            }

            // Ocultar el botón "Crear SU" si ya existe al menos un SuperUsuario
            (async function hideCreateSuIfExists() {
                try {
                    if (!createSuBtn) return;
                    const users = await loadUsers();
                    const hasSu = Array.isArray(users) && users.some(u => (u.Nombre_rol || '').toLowerCase() === 'superusuario');
                    if (hasSu) createSuBtn.style.display = 'none';
                } catch (e) {
                    // no bloquear la UI por este chequeo
                }
            })();

            async function loadUsers() {
                try {
                    const res = await fetch('/superusuario/users-data', { cache: 'no-store', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content } });
                    const data = await res.json();
                    if (res.ok && data.users) return data.users;
                    return data.users || [];
                } catch (e) {
                    // No fallback to localStorage: return empty list on error
                    return [];
                }
            }

            function renderUsersTable(users) {
                const el = document.getElementById('users-list');
                if (!el) return;
                if (!users || !users.length) { el.innerHTML = '<p>No hay usuarios registrados.</p>'; return; }

                const activeUsers = users.filter(u => u.Estado !== 'Inactivo');
                const inactiveUsers = users.filter(u => u.Estado === 'Inactivo');

                const buildTable = (list, title, titleColor) => {
                    if (!list.length) return '';
                    return `
                        <h5 style="margin-top:20px; color:${titleColor}; border-bottom: 2px solid ${titleColor}; padding-bottom: 5px;">${title}</h5>
                        <table style="width:100%;border-collapse:collapse; margin-bottom: 20px; background: var(--card-bg); border: 1px solid var(--border-color);">
                        <thead>
                            <tr style="background:#3498db;color:#fff;">
                                <th style="padding:8px">USUARIO</th>
                                <th style="padding:8px">CORREO</th>
                                <th style="padding:8px">ROL</th>
                                <th style="padding:8px">ESTADO</th>
                                <th style="padding:8px">TRABAJADOR</th>
                                <th style="padding:8px">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>${list.map(u => {
                        const isInactive = u.Estado === 'Inactivo';
                        const statusColor = isInactive ? '#e74c3c' : '#27ae60';
                        const statusLabel = u.Estado || 'Activo';

                        // Prevent editing or deactivation for SuperUsuario accounts
                        const isSuper = ((u.Nombre_rol || '').toLowerCase() === 'superusuario');
                        let actionsHtml = '';
                        if (isSuper) {
                            actionsHtml = `<span style="color:var(--primary);font-weight:bold">Cuenta de Sistema</span>`;
                        } else {
                            actionsHtml += `<button class="edit-user-btn" data-id="${u.Id_Usuario}" data-username="${u.raw_username || ''}" data-name="${u.Nombre_completo || ''}" data-email="${u.Correo}" data-role="${u.Nombre_rol || ''}" data-worker-id="${u.Id_Trabajador || ''}" style="background:#3498db;color:#fff;border:none;padding:6px 8px;border-radius:4px;cursor:pointer;margin-right:6px;">Editar</button>`;
                            actionsHtml += isInactive
                                ? `<button class="activate-user-btn" data-id="${u.Id_Usuario}" style="background:#27ae60;color:#fff;border:none;padding:6px 8px;border-radius:4px;cursor:pointer;">Activar</button>`
                                : `<button class="del-user-btn" data-id="${u.Id_Usuario}" style="background:#e74c3c;color:#fff;border:none;padding:6px 8px;border-radius:4px;cursor:pointer;">Desactivar</button>`;
                        }

                        return `<tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding:8px; color: var(--text-main);">${u.Nombre_usuario}</td>
                            <td style="padding:8px; color: var(--text-main);">${u.Correo}</td>
                            <td style="padding:8px; color: var(--text-main);">${u.Nombre_rol || ''}</td>
                            <td style="padding:8px;"><span style="color:${statusColor};font-weight:bold">${statusLabel}</span></td>
                            <td style="padding:8px; color: var(--text-main);">${u.Trabajador_Nombre || '—'}</td>
                            <td style="padding:8px;">${actionsHtml}</td>
                            </tr>`;
                    }).join('')}</tbody></table>`;
                };

                let html = '';
                if (activeUsers.length) html += buildTable(activeUsers, 'Usuarios Activos', 'var(--text-main)');
                else html += '<p>No hay usuarios activos.</p>';

                if (inactiveUsers.length) html += buildTable(inactiveUsers, 'Usuarios Inactivos', '#e74c3c');

                el.innerHTML = html;
                attachUserListeners();
            }

            function attachUserListeners() {
                document.querySelectorAll('.del-user-btn').forEach(b => {
                    b.addEventListener('click', async () => {
                        if (!await showConfirm('¿Desactivar usuario?')) return;
                        const id = b.getAttribute('data-id');
                        // disable button to avoid double clicks
                        b.disabled = true;
                        try {
                            const res = await fetch(`/superusuario/users/${id}/deactivate`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content } });
                            const text = await res.text();
                            let data;
                            try { data = JSON.parse(text); } catch (e) { data = { error: text }; }
                            if (res.ok) {
                                showUsersMsg('Usuario desactivado', 'success');
                                if (window.loadWorkersForUsers) window.loadWorkersForUsers();
                                loadAndRenderUsers();
                            } else {
                                showUsersMsg(data.error || 'Error al desactivar', 'error');
                            }
                        } catch (e) { showUsersMsg('Error de conexión', 'error'); console.error('Deactivate user error', e); }
                        finally { b.disabled = false; }
                    });
                });

                document.querySelectorAll('.activate-user-btn').forEach(b => {
                    b.addEventListener('click', async () => {
                        if (!await showConfirm('¿Reactivar usuario?')) return;
                        const id = b.getAttribute('data-id');
                        b.disabled = true;
                        try {
                            const res = await fetch(`/superusuario/users/${id}/activate`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content } });
                            const text = await res.text();
                            let data;
                            try { data = JSON.parse(text); } catch (e) { data = { error: text }; }
                            if (res.ok) {
                                showUsersMsg('Usuario activado', 'success');
                                if (window.loadWorkersForUsers) window.loadWorkersForUsers();
                                loadAndRenderUsers();
                            } else {
                                showUsersMsg(data.error || 'Error al activar', 'error');
                            }
                        } catch (e) { showUsersMsg('Error de conexión', 'error'); console.error('Activate user error', e); }
                        finally { b.disabled = false; }
                    });
                });

                document.querySelectorAll('.edit-user-btn').forEach(b => {
                    b.addEventListener('click', async () => {
                        editUserId = b.getAttribute('data-id');
                        
                        // Recargar trabajadores asegurando que el trabajador actual NO sea filtrado
                        if (window.loadWorkersForUsers) await window.loadWorkersForUsers();

                        // prefills: name and username (strictly separated)
                        document.getElementById('u-name').value = b.getAttribute('data-name') || '';
                        document.getElementById('u-email').value = b.getAttribute('data-email') || '';
                        document.getElementById('u-username').value = b.getAttribute('data-username') || '';
                        // seleccionar el rol
                        const roleVal = b.getAttribute('data-role') || 'Trabajador';
                        document.getElementById('u-role').value = roleVal;
                        // seleccionar trabajador vinculado
                        const workerId = b.getAttribute('data-worker-id') || '';
                        if (document.getElementById('u-worker')) document.getElementById('u-worker').value = workerId;
                        
                        document.getElementById('u-password').value = '';
                        document.getElementById('u-password-confirm').value = '';
                        
                        formTitle.textContent = 'Editar Usuario';
                        document.getElementById('u-pass-req-star').style.display = 'none';
                        document.getElementById('u-passconf-req-star').style.display = 'none';
                        if (userForm) openSmooth(userForm);
                        validateUserForm(); // Trigger validation to clear/set borders
                    });
                });
            }

            function clearForm() {
                document.getElementById('u-name').value = '';
                document.getElementById('u-email').value = '';
                document.getElementById('u-username').value = '';
                document.getElementById('u-role').value = 'Trabajador';
                document.getElementById('u-password').value = '';
                document.getElementById('u-password-confirm').value = '';
                editUserId = null;
                formTitle.textContent = 'Crear Usuario';
            }

            async function loadAndRenderUsers() {
                showUsersMsg('Cargando...');
                try {
                    const users = await loadUsers();
                    allUsers = users; // Actualizar cache
                    applyFilters(); // Renderizar aplicando filtros actuales
                } catch (e) {
                    console.error('Error loading users', e);
                    showUsersMsg('Error de conexión', 'error');
                } finally {
                    setTimeout(() => showUsersMsg(''), 3000);
                }
            }

            saveBtn.addEventListener('click', async () => {
                const name = document.getElementById('u-name').value.trim();
                const email = document.getElementById('u-email').value.trim();
                const username = document.getElementById('u-username').value.trim();
                const password = document.getElementById('u-password').value;
                const passwordConfirm = document.getElementById('u-password-confirm').value;
                const role = document.getElementById('u-role').value;

                // Validación en tiempo real: impedir envío si hay errores
                if (typeof validateUserForm === 'function' && !validateUserForm()) { showUsersMsg('Corrige los errores del formulario', 'error'); return; }

                // Require username even when editing (backend expects it)
                if (!name || !email || !username || !role) { showUsersMsg('Completa los campos requeridos', 'error'); return; }
                // For creation, password confirmation is required
                if (!editUserId && (!password || !passwordConfirm)) { showUsersMsg('Completa los campos requeridos (contraseña)', 'error'); return; }

                const emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                if (!emailOK) { showUsersMsg('Correo inválido', 'error'); return; }
                if (password || passwordConfirm) { if (password !== passwordConfirm) { showUsersMsg('Las contraseñas no coinciden', 'error'); return; } }
                if (password) { const failed = [(pw) => pw.length >= 8, (pw) => /[a-z]/.test(pw), (pw) => /[A-Z]/.test(pw), (pw) => /[0-9]/.test(pw), (pw) => /[^a-zA-Z0-9]/.test(pw)].filter(fn => !fn(password)); if (failed.length) { showUsersMsg('Contraseña no cumple requisitos', 'error'); return; } }

                try {
                    const workerVal = document.getElementById('u-worker') ? document.getElementById('u-worker').value : '';

                    // Build payload consistently
                    const payload = { name, email, username, role, Id_Trabajador: workerVal || '' };
                    if (password) payload.password = password;

                    console.log('Saving user', { editUserId, payload });

                    if (editUserId) {
                        // actualizar
                        payload.id = editUserId;
                        const res = await fetch(`/superusuario/users/${editUserId}/update`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content }, body: JSON.stringify(payload) });
                        const text = await res.text();
                        let data;
                        try { data = JSON.parse(text); } catch (parseErr) { data = { error: text } }

                        if (res.ok) { showUsersMsg('Usuario actualizado', 'success'); clearForm(); if (userForm) closeSmooth(userForm); loadWorkersForUsers(); loadAndRenderUsers(); } else { console.error('Update failed', res.status, data); showUsersMsg(data.error || `Error al actualizar (${res.status})`, 'error'); }
                    } else {
                        // crear
                        document.getElementById('u-pass-req-star').style.display = 'inline';
                        document.getElementById('u-passconf-req-star').style.display = 'inline';
                        const res = await fetch('/superusuario/users/store', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content }, body: JSON.stringify(payload) });
                        const text = await res.text();
                        let data;
                        try { data = JSON.parse(text); } catch (parseErr) { data = { error: text } }

                        if (res.ok) { showUsersMsg('Usuario creado', 'success'); clearForm(); if (userForm) closeSmooth(userForm); loadWorkersForUsers(); loadAndRenderUsers(); } else { console.error('Create failed', res.status, data); showUsersMsg(data.error || `Error al crear (${res.status})`, 'error'); }
                    }
                } catch (e) { console.error('Connection error', e); showUsersMsg('Error de conexión: ' + (e && e.message ? e.message : ''), 'error'); }
            });

            loadWorkersForUsers();
            loadAndRenderUsers();
        }

        contentDetails.innerHTML = `<p>Módulo '${name}' no implementado (SuperUsuario).</p>`;
    }

    // --- Módulo de Reportes (SuperUsuario) ---
    async function renderSuperReports() {
        if (!contentDetails) return;
        contentDetails.innerHTML = '<p>Cargando reporte...</p>';

        try {
            const res = await fetch('/superusuario/reports/users', { cache: 'no-store', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content } });
            if (!res.ok) throw new Error('Error al cargar datos');
            const data = await res.json();
            const users = data.users || [];

            // Estadísticas
            const admins = users.filter(u => u.Nombre_rol === 'Administrativo' || u.Nombre_rol === 'SuperUsuario').length; // Asumiendo Super también cuenta o ajustar según lógica
            const workers = users.filter(u => u.Nombre_rol === 'Trabajador').length;
            const total = users.length;
            const fechaEmision = new Date().toLocaleString('es-VE');

            // Calcular porcentajes para gráfica simple
            const totalForCalc = admins + workers || 1;
            const pctAdmin = Math.round((admins / totalForCalc) * 100);
            const pctWorker = Math.round((workers / totalForCalc) * 100);

            // Renderizado inicial
            function renderReportView(filteredUsers, filters = {}) {
                const searchVal = filters.q || '';
                const roleVal = filters.rol || '';
                const statusVal = filters.estado || '';
                const savedColor = localStorage.getItem('primaryColor') || 'charcoal';

                let html = `
                <div class="report-module" style="background:var(--bg-color); min-height:100%; padding: 10px;">
                    <!-- Navbar simulado (parte superior del reporte) -->
                    <div style="display:flex; justify-content:space-between; background:var(--card-bg); padding:15px 25px; border-bottom:3px solid var(--primary); border-radius:8px; margin-bottom:20px; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                        <div>
                            <h2 style="margin:0; color:var(--primary); font-size:24px;">LUFRA2020</h2>
                            <p style="margin:0; font-size:12px; color:var(--text-muted);">RIF: J-50032437-5 | Gestión de Nómina</p>
                        </div>
                        <div style="text-align:right;">
                            <h3 style="margin:0; color:var(--text-main); font-size:16px;">REPORTE DE USUARIOS</h3>
                            <p style="margin:0; font-size:11px; color:var(--text-muted);">Emisión: ${fechaEmision}</p>
                        </div>
                    </div>

                    <!-- Stats Grid -->
                    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:20px; margin-bottom:20px;">
                        <div style="background:var(--card-bg); padding:20px; border-radius:12px; border:1px solid var(--border-color); box-shadow:0 2px 5px rgba(0,0,0,0.02);">
                            <h4 style="margin:0 0 10px 0; font-size:11px; text-transform:uppercase; color:var(--text-muted); letter-spacing:1px;">Distribución de Personal</h4>
                            <div style="font-size:13px; margin-bottom:5px; color:var(--text-main);">Admins: <strong>${admins}</strong> | Trabajadores: <strong>${workers}</strong></div>
                            <div style="background:var(--bg-color); height:12px; border-radius:6px; overflow:hidden; display:flex;">
                                <div style="background:var(--primary); width:${pctAdmin}%;"></div>
                                <div style="background:#27ae60; width:${pctWorker}%;"></div>
                            </div>
                            <p style="font-size:9px; color:var(--text-muted); margin-top:5px;">${savedColor === 'charcoal' ? 'Gris' : 'Azul'}: Admins (${pctAdmin}%) | Verde: Trabajadores (${pctWorker}%)</p>
                        </div>
                        <div style="background:var(--card-bg); padding:20px; border-radius:12px; border:1px solid var(--border-color); box-shadow:0 2px 5px rgba(0,0,0,0.02);">
                            <h4 style="margin:0 0 10px 0; font-size:11px; text-transform:uppercase; color:var(--text-muted); letter-spacing:1px;">Estado de Seguridad</h4>
                            <div style="font-size:14px; color:#27ae60; font-weight:bold;">● Sistema Protegido</div>
                            <div style="font-size:12px; color:var(--text-muted); margin-top:5px;">Cuentas Activas: ${filteredUsers.filter(u => u.Estado !== 'Inactivo').length}</div>
                        </div>
                        <div style="background:var(--card-bg); padding:20px; border-radius:12px; border:1px solid var(--border-color); box-shadow:0 2px 5px rgba(0,0,0,0.02);">
                            <h4 style="margin:0 0 10px 0; font-size:11px; text-transform:uppercase; color:var(--text-muted); letter-spacing:1px;">Total Usuarios Registrados</h4>
                            <div style="font-size:32px; font-weight:bold; color:var(--text-main);">${total}</div>
                        </div>
                    </div>

                    <!-- Toolbar -->
                    <div class="no-print" style="margin-bottom:20px; background:var(--card-bg); padding:15px 25px; border-radius:10px; display:flex; align-items:center; justify-content:space-between; border:1px solid var(--border-color);">
                        <div style="display:flex; gap:10px;">
                            <input id="rep-search" type="text" value="${searchVal}" placeholder="Buscar usuario..." style="padding:8px; border-radius:5px; border:1px solid var(--border-color); background:var(--bg-color); color:var(--text-main);">
                            <select id="rep-role" style="padding:8px; border-radius:5px; border:1px solid var(--border-color); background:var(--bg-color); color:var(--text-main);">
                                <option value="">Todos los roles</option>
                                <option value="SuperUsuario" ${roleVal === 'SuperUsuario' ? 'selected' : ''}>SuperUsuario</option>
                                <option value="Administrativo" ${roleVal === 'Administrativo' ? 'selected' : ''}>Administrativo</option>
                                <option value="Trabajador" ${roleVal === 'Trabajador' ? 'selected' : ''}>Trabajador</option>
                            </select>
                            <select id="rep-status" style="padding:8px; border-radius:5px; border:1px solid var(--border-color); background:var(--bg-color); color:var(--text-main);">
                                <option value="">Todos los estados</option>
                                <option value="Activo" ${statusVal === 'Activo' ? 'selected' : ''}>Activo</option>
                                <option value="Inactivo" ${statusVal === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
                            </select>
                            <button id="rep-filter-btn" style="background:var(--primary); color:white; padding:8px 18px; border-radius:6px; border:none; cursor:pointer;">Filtrar</button>
                        </div>
                        <div>
                            <button id="rep-print-btn" style="background:var(--primary); color:white; padding:8px 18px; border-radius:6px; border:none; cursor:pointer; font-weight:600;">🖨️ Imprimir PDF</button>
                        </div>
                    </div>

                    <!-- Tabla -->
                    <div style="background:var(--card-bg); border-radius:12px; overflow:hidden; border:1px solid var(--border-color);">
                        <table style="width:100%; border-collapse:collapse;">
                            <thead>
                                <tr style="background:var(--primary); color:white;">
                                    <th style="padding:15px; text-align:left; font-size:11px; text-transform:uppercase;">Usuario</th>
                                    <th style="padding:15px; text-align:left; font-size:11px; text-transform:uppercase;">Rol</th>
                                    <th style="padding:15px; text-align:left; font-size:11px; text-transform:uppercase;">Estado</th>
                                    <th style="padding:15px; text-align:left; font-size:11px; text-transform:uppercase;">Permisos de Acceso</th>
                                    <th style="padding:15px; text-align:left; font-size:11px; text-transform:uppercase;">Última Conexión (Simulada)</th>
                                </tr>
                            </thead>
                            <tbody>
                `;

                if (filteredUsers.length === 0) {
                    html += `<tr><td colspan="5" style="padding:20px; text-align:center; color: var(--text-main);">No se encontraron resultados</td></tr>`;
                } else {
                    filteredUsers.forEach(u => {
                        const r = u.Nombre_rol || '';
                        let roleClass = 'background:#27ae60'; // default worker
                        if (r === 'SuperUsuario') roleClass = 'background:var(--primary)';
                        if (r === 'Administrativo') roleClass = 'background:#34495e';

                        let permisos = '<span style="background:var(--bg-color); border:1px solid var(--border-color); padding:3px 8px; border-radius:4px; font-size:10px; color:var(--text-main); margin-right:4px;">Solo Lectura</span>';
                        if (r === 'SuperUsuario') permisos = '<span style="background:var(--bg-color); border:1px solid var(--border-color); padding:3px 8px; border-radius:4px; font-size:10px; color:var(--text-main); margin-right:4px;">Total</span><span style="background:var(--bg-color); border:1px solid var(--border-color); padding:3px 8px; border-radius:4px; font-size:10px; color:var(--text-main); margin-right:4px;">Nómina</span><span style="background:var(--bg-color); border:1px solid var(--border-color); padding:3px 8px; border-radius:4px; font-size:10px; color:var(--text-main); margin-right:4px;">Auditoría</span>';
                        if (r === 'Administrativo') permisos = '<span style="background:var(--bg-color); border:1px solid var(--border-color); padding:3px 8px; border-radius:4px; font-size:10px; color:var(--text-main); margin-right:4px;">Lectura</span><span style="background:var(--bg-color); border:1px solid var(--border-color); padding:3px 8px; border-radius:4px; font-size:10px; color:var(--text-main); margin-right:4px;">Escritura</span>';

                        const estado = u.Estado || 'Activo';
                        const estadoColor = estado === 'Inactivo' ? '#e74c3c' : '#27ae60';
                        const lastLogin = new Date();
                        lastLogin.setHours(lastLogin.getHours() - Math.floor(Math.random() * 48));

                        html += `
                            <tr style="border-bottom:1px solid var(--border-color); background: var(--card-bg);">
                                <td style="padding:15px; font-size:13px; color: var(--text-main);">
                                    <strong>${u.Nombre_usuario}</strong>
                                </td>
                                <td style="padding:15px;">
                                    <span style="${roleClass}; padding:5px 12px; border-radius:5px; font-weight:bold; font-size:10px; color:white; text-transform:uppercase;">${r}</span>
                                </td>
                                <td style="padding:15px; font-size:13px; color:${estadoColor}; font-weight:bold;">● ${estado}</td>
                                <td style="padding:15px;">${permisos}</td>
                                <td style="padding:15px; font-size:11px; color:var(--text-muted); font-style:italic;">${lastLogin.toLocaleString('es-VE')}</td>
                            </tr>`;
                    });
                }

                html += `
                            </tbody>
                        </table>
                    </div>
                </div>
                `;

                contentDetails.innerHTML = html;

                // Bind events
                document.getElementById('rep-filter-btn').addEventListener('click', () => {
                    const q = document.getElementById('rep-search').value.toLowerCase();
                    const r = document.getElementById('rep-role').value;
                    const s = document.getElementById('rep-status').value;

                    const filtered = users.filter(user => {
                        const matchesSearch = (user.Nombre_usuario || '').toLowerCase().includes(q);
                        const matchesRole = r ? (user.Nombre_rol === r) : true;
                        const matchesStatus = s ? (user.Estado === s) : true;
                        return matchesSearch && matchesRole && matchesStatus;
                    });

                    renderReportView(filtered, { q, rol: r, estado: s });
                });

                // Allow enter key in search
                document.getElementById('rep-search').addEventListener('keyup', (e) => {
                    if (e.key === 'Enter') document.getElementById('rep-filter-btn').click();
                });

                document.getElementById('rep-print-btn').addEventListener('click', () => {
                    const q = document.getElementById('rep-search').value;
                    const rol = document.getElementById('rep-role').value;
                    const estado = document.getElementById('rep-status').value;
                    window.open(`/superusuario/admin/users?print=true&q=${encodeURIComponent(q)}&rol=${encodeURIComponent(rol)}&estado=${encodeURIComponent(estado)}`, '_blank');
                });
            }

            // Initial render
            renderReportView(users);

        } catch (e) {
            contentDetails.innerHTML = `<p style="color:red">Error cargando reporte: ${e.message}</p>`;
        }
    }

    // Mostrar usuario y logout
    const auth = sessionUser || {};
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay && auth) usernameDisplay.textContent = auth.username || auth.role || '';
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    // Cargar vista según rol autenticado (fallback administrativo)
    if (typeof loadRoleView === 'function') {
        loadRoleView((auth && auth.role) ? auth.role : 'Administrativo');
    } else {
        // Si la función aún no está disponible, será invocada cuando se inicialice la interfaz (initPayrollPage)
        console.warn('loadRoleView no está disponible todavía; se inicializará con initPayrollPage');
    }
}

// Función para mostrar modal de vacaciones al iniciar sesión
async function showVacationModal() {
    try {
        const response = await fetch('/trabajador/vacations-data', {
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok || !data.fechaIngreso) return;

        // Reiniciar estado si la fecha de ingreso cambió (Login Global)
        const lastDate = localStorage.getItem('vacationLastSeenHireDate');
        if (lastDate && lastDate !== data.fechaIngreso) {
            localStorage.removeItem('vacationNoticeDismissed');
            localStorage.removeItem('vacationRequestSent');
        }
        localStorage.setItem('vacationLastSeenHireDate', data.fechaIngreso);

        // Reset alreadySubmitted if last request was rejected
        if (data.lastRequest && data.lastRequest.Estado === 'Rechazada') {
            localStorage.removeItem('vacationRequestSent');
        }

        const hireDate = new Date(data.fechaIngreso);
        const today = new Date();
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        const isOneYearOld = hireDate <= oneYearAgo;
        const hasPendingOrApproved = data.lastRequest && ['Pendiente', 'Aceptada'].includes(data.lastRequest.Estado);
        const alreadySubmitted = localStorage.getItem('vacationRequestSent') === 'true';
        const isDismissed = localStorage.getItem('vacationNoticeDismissed') === 'true';

        if (isOneYearOld && !hasPendingOrApproved && !alreadySubmitted && !isDismissed) {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;';
            modal.innerHTML = `
                <div class="modal-content" style="background: var(--bg-color); color: var(--text-main); padding: 20px; border-radius: 8px; max-width: 400px; width: 90%; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                    <h3 style="margin-top: 0; color: var(--text-main);">¡Atención!</h3>
                    <p>Ya ha pasado 1 año desde tu fecha de ingreso. Puedes realizar una solicitud de vacaciones.</p>
                    <label style="display: block; margin: 10px 0;">
                        <input type="checkbox" id="dismiss-checkbox" style="margin-right: 8px;"> No mostrar de nuevo
                    </label>
                    <button id="accept-btn" class="primary" style="width: 100%; padding: 10px; margin-top: 15px;">Aceptar</button>
                </div>
            `;
            document.body.appendChild(modal);

            document.getElementById('accept-btn').addEventListener('click', () => {
                const checked = document.getElementById('dismiss-checkbox').checked;
                if (checked) {
                    localStorage.setItem('vacationNoticeDismissed', 'true');
                }
                modal.remove();
            });
        }
    } catch (error) {
        console.error('Error showing vacation modal:', error);
    }
}

function initLoginPage() {
    // Corregir enlace de estilos si es necesario (login.html may use styles.css)
    const form = document.getElementById('loginForm') || document.getElementById('login-form') || document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const userInput = document.getElementById('username');
        const passInput = document.getElementById('password');
        const username = userInput ? userInput.value.trim() : 'demo';
        const password = passInput ? passInput.value : '';

        // Cuenta demo: admin/admin -> rol Administrativo
        if ((username === 'admin' && password === 'admin') || (username === 'demo' && password === 'demo')) {
            setAuth({ username: username, role: 'Administrativo', logged: true });
            // mostrar éxito si existe
            const successCard = document.getElementById('successCard');
            if (successCard) { successCard.style.display = ''; }
            // redirigir
            window.location.href = 'index.php';
            return;
        }

        // Autenticación simple local: cualquier usuario con contraseña no vacía será trabajador
        if (username && password.length > 0) {
            setAuth({ username: username, role: 'Trabajador', logged: true });
            window.location.href = 'index.php';
            return;
        }

        const message = document.getElementById('message') || document.getElementById('regMessage');
        if (message) message.textContent = 'Usuario o contraseña inválidos.';
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const pathname = window.location.pathname.toLowerCase();

    // Si estamos en login page -> inicializar login
    if (document.getElementById('loginForm') || pathname.endsWith('login.php')) {
        initLoginPage();
        return;
    }

    // Comprobar sesión en el backend
    const auth = await checkSessionAsync();
    sessionUser = auth;
    // Depuración ligera: muestra lo que devolvió el servidor
    console.debug('checkSession:', auth);

    // Si estamos en Index (o en cualquier otra página del sistema) -> verificar auth
    if (document.getElementById('content-header') || pathname.endsWith('index.php')) {
        if (!auth) {
            // No autenticado -> dejar que Laravel maneje el redirect si el middleware falla
            console.warn('Usuario no autenticado detectado por JS');
            return;
        }
        // inicializar interfaz administrativa
        initPayrollPage();

        // Solo una llamada al modal al cargar la página
        if (auth && auth.role === 'Trabajador') {
            showVacationModal();
        }
    }
});

// Asegurar que al usar el botón "Atrás" o al restaurar desde bfcache también se verifique la sesión
async function ensureAuthOnShow(event) {
    // Evitar verificación si ya estamos en el login (previene bucle de redirección)
    if (document.getElementById('loginForm') || window.location.pathname.toLowerCase().includes('login.php')) return;

    const a = await checkSessionAsync();
    if (!a) {
        // En Laravel, si la sesión expira, la siguiente recarga o fetch fallará y el middleware redirigirá.
        // Desactivamos la redirección manual a Login.php para evitar 404.
        console.warn('Sesión expirada detectada en popstate/pageshow');
    }
}
window.addEventListener('pageshow', ensureAuthOnShow);
window.addEventListener('popstate', ensureAuthOnShow);