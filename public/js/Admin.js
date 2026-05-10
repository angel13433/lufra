/**
 * Admin.js - Módulo Administrativo Refactorizado para Laravel
 */

(function () {
    // Cache de elementos del DOM comunes
    let contentHeader, contentDetails;

    function init() {
        contentHeader = document.getElementById('content-header');
        contentDetails = document.getElementById('content-details');
    }

    // --- Email Validation Helpers ---
    if (!window.allowedEmailDomains) window.allowedEmailDomains = new Set(['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com']);

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

    // --- Global UI Helpers ---
    function showInlineError(el, msg) {
        if (!el) return;
        el.style.borderColor = '#e74c3c';

        let tParent = el.parentElement;
        if (tParent.style.display === 'flex') tParent = tParent.parentElement;

        let helper = tParent.querySelector('.inline-helper');
        if (helper) {
            helper.textContent = msg;
            helper.style.display = 'block';
        } else {
            const span = document.createElement('div');
            span.className = 'inline-helper';
            span.style.color = '#e74c3c';
            span.style.fontSize = '0.8em';
            span.style.marginTop = '4px';
            span.style.fontWeight = '500';
            span.textContent = msg;
            tParent.appendChild(span);
        }

        const smallTag = tParent.querySelector('small');
        if (smallTag) smallTag.style.display = 'none';
    }

    function clearInlineError(el) {
        if (!el) return;
        el.style.borderColor = 'var(--border-color)';

        let tParent = el.parentElement;
        if (tParent.style.display === 'flex') tParent = tParent.parentElement;

        let helper = tParent.querySelector('.inline-helper');
        if (helper) {
            helper.style.display = 'none';
        }

        const smallTag = tParent.querySelector('small');
        if (smallTag) smallTag.style.display = 'block';
    }

    /**
     * Punto de entrada principal para renderizar módulos administrativos
     */
    async function renderAdminModuleV2(moduleName) {
        if (!contentDetails) init();

        const name = moduleName.toLowerCase();

        // 1. Registro de Trabajadores
        if (name.includes('registro') && name.includes('trabajador')) {
            return renderWorkerRegistration();
        }

        // 2. Pago de Nómina
        if (name.includes('pago') && name.includes('nómina')) {
            return renderPayrollPayment();
        }

        // 3. Tipos de Nómina
        if (name.includes('tipo') && name.includes('nomina')) {
            return renderTipoNominaModule();
        }

        // 4. Gestión de Conceptos
        if (name.includes('concept')) {
            return renderConceptosModule();
        }

        // 5. Gestión de Cargos
        if (name.includes('cargo')) {
            return renderCargosModule();
        }

        // 6. Panel de Vacaciones
        if (name.includes('panel') && name.includes('vacaciones')) {
            return renderAdminVacations();
        }

        contentDetails.innerHTML = `<div class="alert-info">Módulo "${moduleName}" en proceso de migración v2.</div>`;
    }

    const keywordsDiarios = ['dias laborables', 'días laborables', 'dias no laborados', 'días no laborados', 'faltas', 'inasistencias', 'vacaciones', 'bono vacacional', 'permiso no remunerado', 'utilidades', 'bono de produccion', 'bono de asistencia', 'sueldo', 'salario', 'dias de descanso', 'días de descanso', 'dia de descanso', 'día de descanso'];

    function getConceptAmount(c, salario, totalAsig = 0) {
        const nombre = (c.Nombre_Concepto || '').toLowerCase();
        const codigo = (c.Codigo || '').toUpperCase();

        const isDaily = keywordsDiarios.some(kw => nombre.includes(kw.toLowerCase()));
        if (isDaily && salario > 0) return salario / 30;

        // Retenciones Legales dinámicas basas en Ingresos Totales (totalAsig)
        // El usuario requiere que si no hay conceptos de ingreso agregados (totalAsig = 0),
        // las retenciones sean 0, sin usar el salario base como fallback.
        const baseMensualCalculo = totalAsig * 2; 

        if (codigo === 'IVSS' || nombre.includes('seguro social')) {
            const sueldoSemanal = (Math.min(baseMensualCalculo, 650) * 12) / 52;
            return sueldoSemanal * 0.04;
        }
        if (codigo === 'SPF' || nombre.includes('prest. de empleo')) {
            const sueldoSemanal = (Math.min(baseMensualCalculo, 650) * 12) / 52;
            return sueldoSemanal * 0.005;
        }
        if (codigo === 'FAOV' || nombre.includes('ahorro habitacional')) {
            // FAOV es 1% de los ingresos totales del periodo
            return totalAsig * 0.01;
        }

        return parseFloat(c.Monto) || 0;
    }

    // --- Helpers de API ---
    async function apiFetch(endpoint, options = {}) {
        const url = `/administrativo${endpoint}`;
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json'
        };

        // Agregar token CSRF si está disponible
        const token = document.querySelector('meta[name="csrf-token"]');
        if (token) {
            defaultHeaders['X-CSRF-TOKEN'] = token.content;
        }

        try {
            const res = await fetch(url, {
                ...options,
                headers: { ...defaultHeaders, ...options.headers }
            });

            if (res.status === 401 || res.status === 419) {
                window.location.href = '/login';
                return;
            }

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || data.error || 'Error en la petición');
            return data;
        } catch (e) {
            console.error(`API Error (${endpoint}):`, e);
            throw e;
        }
    }

    // --- Módulo: Registro de Trabajadores ---
    async function renderWorkerRegistration() {
        contentDetails.innerHTML = '<div class="loader">Cargando módulo de trabajadores...</div>';

        try {
            // Cargar datos necesarios en paralelo
            const [cData, nData, tData, wData] = await Promise.all([
                apiFetch('/cargos'),
                apiFetch('/education-levels'),
                apiFetch('/types-nomina'),
                apiFetch('/workers')
            ]);

            const cargos = cData.cargos || [];
            const niveles = nData.niveles || [];
            const tiposNomina = tData.tipos || [];
            let allWorkersSource = wData.workers || [];

            contentDetails.innerHTML = `
                <div class="worker-registration">
                    <div class="content-box">
                        <h4 style="margin-top: 0; color: var(--text-main); border-bottom: 2px solid var(--primary); padding-bottom: 10px;">Gestión de Trabajadores</h4>
                        
                        <!-- Mini Analytics Row -->
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
                            <div class="chart-container" style="margin-bottom:0; display:flex; align-items:center; justify-content:space-between;">
                                <div><h6 style="margin:0; color:var(--text-muted);">Total Personal</h6><span style="font-size:1.5em; font-weight:bold; color: var(--text-main);">${allWorkersSource.length}</span></div>
                                <div style="width:60px; height:60px;"><canvas id="worker-mini-chart"></canvas></div>
                            </div>
                        </div>

                        <div id="workers-table-container" style="margin-top:20px;">
                            ${renderWorkersTableHTML(allWorkersSource)}
                        </div>

                        <div style="margin-top: 25px; border-top: 1px solid var(--border-color); padding-top: 20px; text-align: center;">
                            <button id="add-worker-btn" class="primary">➕ Registrar Nuevo Trabajador</button>
                            <div id="worker-msg" style="font-weight: bold; font-family: sans-serif; margin-top: 10px;"></div>
                        </div>
                    </div>

                    <!-- Formulario (Oculto inicialmente, debajo de la tabla) -->
                    <div id="worker-form-container" style="display: none; background: var(--card-bg); padding: 25px; border-radius: 12px; border: 1px solid var(--border-color); margin-top: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.15);">
                        <h5 id="worker-form-title" style="margin-top:0; color: var(--text-main); font-size: 1.25em; border-bottom: 2px solid var(--primary); padding-bottom:10px; margin-bottom:20px;">Datos del Trabajador</h5>
                        <form id="worker-form">
                            <input type="hidden" id="w-id-trabajador">
                            
                            <!-- Sección 1: Información Personal -->
                            <div class="form-section" style="margin-bottom: 30px; padding: 20px; border: 1px solid var(--border-color); border-radius: 10px; background: rgba(0,0,0,0.02);">
                                <h6 style="margin-top:0; margin-bottom:20px; color: var(--primary); display:flex; align-items:center; gap:8px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> Información Personal</h6>
                                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                                    <div><label class="form-label">Nombres <span class="required">*</span></label><input type="text" id="w-nombres" required class="only-letters"></div>
                                    <div><label class="form-label">Apellidos <span class="required">*</span></label><input type="text" id="w-apellidos" required class="only-letters"></div>
                                    
                                    <div>
                                        <label class="form-label">Documento de identidad <span class="required">*</span></label>
                                        <div style="display:flex; gap:5px;">
                                            <select id="w-cedula-prefix" style="width:70px;"><option value="V-">V-</option><option value="E-">E-</option><option value="P-">P-</option><option value="G-">G-</option><option value="J-">J-</option></select>
                                            <input type="text" id="w-cedula-num" required class="only-numbers" placeholder="12345678" maxlength="8" style="flex:1;">
                                        </div>
                                        <small style="color:var(--text-muted); font-size:0.75em;">7 a 8 dígitos.</small>
                                    </div>
                                    <div><label class="form-label">Fecha de nacimiento</label><input type="date" id="w-fecha-nac"></div>
                                    
                                    <div><label class="form-label">Género</label><select id="w-genero"><option value="">Seleccione...</option><option value="M">Masculino</option><option value="F">Femenino</option></select></div>
                                    <div><label class="form-label">Estado civil</label><select id="w-estado-civil"><option value="">Seleccione...</option><option value="Soltero/a">Soltero/a</option><option value="Casado/a">Casado/a</option><option value="Divorciado/a">Divorciado/a</option><option value="Viudo/a">Viudo/a</option></select></div>
                                    
                                    <div><label class="form-label">Correo electrónico</label><input type="email" id="w-correo"></div>
                                    <div>
                                        <label class="form-label">Teléfono móvil</label>
                                        <div style="display:flex; gap:5px;">
                                            <select id="w-telef-prefix" style="width:90px;"><option value="">---</option><option value="0412">0412</option><option value="0414">0414</option><option value="0416">0416</option><option value="0424">0424</option><option value="0426">0426</option></select>
                                            <input type="text" id="w-telef-num" class="only-numbers" placeholder="1234567" maxlength="7" style="flex:1;">
                                        </div>
                                        <small style="color:var(--text-muted); font-size:0.75em;">Exactamente 7 dígitos después del prefijo.</small>
                                    </div>
                                    <div style="grid-column: 1 / -1;"><label class="form-label">Dirección</label><input type="text" id="w-direccion" maxlength="255" style="width:100%;"></div>
                                </div>
                            </div>

                            <!-- Sección 2: Información Laboral -->
                            <div class="form-section" style="margin-bottom: 30px; padding: 20px; border: 1px solid var(--border-color); border-radius: 10px; background: rgba(0,0,0,0.02);">
                                <h6 style="margin-top:0; margin-bottom:20px; color: var(--primary); display:flex; align-items:center; gap:8px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg> Información Laboral</h6>
                                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                                    <div><label class="form-label">Cargo <span class="required">*</span></label><select id="w-cargo" required><option value="">Seleccione...</option>${cargos.map(c => `<option value="${c.Id_Cargo}">${c.Nombre_profesión}</option>`).join('')}</select></div>
                                    <div><label class="form-label">Nivel educativo <span class="required">*</span></label><select id="w-nivel" required><option value="">Seleccione...</option>${niveles.map(n => `<option value="${n.Id_Nivel_Educativo}">${n.Nombre_Nivel}</option>`).join('')}</select></div>
                                    <div style="grid-column: 1 / -1;"><label class="form-label">Fecha de ingreso <span class="required">*</span></label><input type="date" id="w-fecha-ingreso" required></div>
                                </div>
                            </div>

                             <!-- Sección 3: Contrato -->
                             <div class="form-section" style="margin-bottom: 30px; padding: 20px; border: 1px solid var(--border-color); border-radius: 10px; background: rgba(0,0,0,0.02);">
                                <h6 style="margin-top:0; margin-bottom:20px; color: var(--primary); display:flex; align-items:center; gap:8px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> Contrato</h6>
                                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                                    <div><label class="form-label">Tipo de nómina <span class="required">*</span></label><select id="w-tipo-nomina" required><option value="">Seleccione...</option>${tiposNomina.map(t => `<option value="${t.Id_TipoNomina || t.Id_Tipo_Nomina}">${t.Frecuencia}</option>`).join('')}</select></div>
                                    <div><label class="form-label">Estado</label><select id="w-estado"><option value="Activo">Activo</option><option value="Inactivo">Inactivo</option></select></div>
                                    <div style="grid-column: 1 / -1;"><label class="form-label">Observaciones</label><textarea id="w-observaciones" style="width:100%; height:80px; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);"></textarea></div>
                                </div>
                            </div>

                            <div style="margin-top:25px; display:flex; gap:15px; justify-content: flex-end;">
                                <button type="button" id="cancel-worker-btn" class="secondary" style="height: 45px; padding: 0 30px;">Cancelar</button>
                                <button type="submit" class="primary" style="min-width: 180px; height: 45px; font-weight: bold; background: #10a87a;">💾 Guardar Trabajador</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;

            setupWorkerListeners(allWorkersSource, cargos, niveles, tiposNomina);

        } catch (e) {
            contentDetails.innerHTML = `<div class="error">Error cargando trabajadores: ${e.message}</div>`;
        }
    }

    function renderWorkersTableHTML(workers) {
        if (!workers.length) return '<p class="center" style="color: var(--text-muted); padding:30px;">No hay trabajadores registrados.</p>';
        return `
            <div class="content-box" style="border:none; padding:0; background:transparent;">
                <table class="data-table" style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: var(--primary); color: white;">
                            <th style="padding: 12px; border: 1px solid var(--border-color);">Nombre</th>
                            <th style="padding: 12px; border: 1px solid var(--border-color);">Cédula</th>
                            <th style="padding: 12px; border: 1px solid var(--border-color);">Cargo</th>
                            <th style="padding: 12px; border: 1px solid var(--border-color);">Estado</th>
                            <th style="padding: 12px; border: 1px solid var(--border-color);">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${workers.map(w => `
                            <tr style="border-bottom: 1px solid var(--border-color);">
                                <td style="padding: 10px; border: 1px solid var(--border-color); color: var(--text-main);">${w.Nombre_Completo} ${w.Apellidos}</td>
                                <td style="padding: 10px; border: 1px solid var(--border-color); font-weight: 600; color: var(--text-main);">${w.Documento_Identidad}</td>
                                <td style="padding: 10px; border: 1px solid var(--border-color); color: var(--text-main);">${w.Cargo || '-'}</td>
                                <td style="padding: 10px; border: 1px solid var(--border-color);">
                                    <span style="padding: 6px 14px; border-radius: 20px; font-size: 0.8em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
                                        background-color: ${w.Contrato_Estado === 'Activo' ? 'var(--success-color)' : 'var(--error-color)'}; color: white;">
                                        ${w.Contrato_Estado || 'Sin contrato'}
                                    </span>
                                </td>
                                <td style="padding: 10px; border: 1px solid var(--border-color);">
                                    <button class="btn-edit-worker primary small" data-id="${w.Id_Trabajador}">Editar</button>
                                    <button class="btn-toggle-worker secondary small" data-id="${w.Id_Trabajador}" data-estado="${w.Contrato_Estado}">
                                        ${w.Contrato_Estado === 'Activo' ? 'Desactivar' : 'Activar'}
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    function setupWorkerListeners(workers, cargos, niveles, tiposNomina) {
        const formContainer = document.getElementById('worker-form-container');
        const addBtn = document.getElementById('add-worker-btn');
        const cancelBtn = document.getElementById('cancel-worker-btn');
        const form = document.getElementById('worker-form');

        let oldFechaIngreso = null;

        // Input restrictions and error displays
        form.querySelectorAll('.only-numbers').forEach(input => {
            input.addEventListener('keypress', (e) => {
                const char = String.fromCharCode(e.which);
                if (!/[0-9]/.test(char) && !e.ctrlKey && !e.metaKey && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                    e.preventDefault();
                    let msg = '';
                    if (input.id === 'w-cedula-num') msg = 'El documento solo puede contener números.';
                    if (input.id === 'w-telef-num') msg = 'Este campo solo puede contener números.';
                    if (msg) {
                        showInlineError(input, msg);
                        setTimeout(() => clearInlineError(input), 2000);
                    }
                }
            });
            input.addEventListener('input', (e) => {
                const v = e.target.value;
                if (/[^0-9]/.test(v)) {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    let msg = '';
                    if (input.id === 'w-cedula-num') msg = 'El documento solo puede contener números.';
                    if (input.id === 'w-telef-num') msg = 'Este campo solo puede contener números.';
                    if (msg) {
                        showInlineError(input, msg);
                        setTimeout(() => clearInlineError(input), 2000);
                    }
                } else {
                    if (input.id === 'w-cedula-num' || input.id === 'w-telef-num') clearInlineError(input);
                }
            });
        });
        form.querySelectorAll('.only-letters').forEach(input => {
            input.addEventListener('keypress', (e) => {
                const char = String.fromCharCode(e.which);
                if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(char) && !e.ctrlKey && !e.metaKey && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                    e.preventDefault();
                    const msg = input.id === 'w-nombres' ? 'El nombre solo puede contener letras.' : (input.id === 'w-apellidos' ? 'El apellido solo puede contener letras.' : '');
                    if (msg) {
                        showInlineError(input, msg);
                        setTimeout(() => clearInlineError(input), 2000);
                    }
                }
            });
            input.addEventListener('input', (e) => {
                const v = e.target.value;
                if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(v)) {
                    e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                    const msg = input.id === 'w-nombres' ? 'El nombre solo puede contener letras.' : (input.id === 'w-apellidos' ? 'El apellido solo puede contener letras.' : '');
                    if (msg) {
                        showInlineError(input, msg);
                        setTimeout(() => clearInlineError(input), 2000);
                    }
                } else {
                    if (input.id === 'w-nombres' || input.id === 'w-apellidos') clearInlineError(input);
                }
            });
        });

        const iCorreo = document.getElementById('w-correo');
        if (iCorreo) {
            const checkCorreo = () => {
                const v = iCorreo.value.trim();
                if (!v) {
                    clearInlineError(iCorreo);
                } else if (!v.includes('@')) {
                    showInlineError(iCorreo, 'Tu dirección de correo electrónico debe contener @.');
                } else if (!validateEmailFormat(v)) {
                    showInlineError(iCorreo, 'Formato de correo inválido');
                } else if (!validateEmailDomain(v)) {
                    showInlineError(iCorreo, 'Dominio no permitido (ej: gmail.com)');
                } else {
                    clearInlineError(iCorreo);
                    iCorreo.style.borderColor = '#2ecc71';
                }
            };
            iCorreo.addEventListener('input', checkCorreo);
            iCorreo.addEventListener('blur', checkCorreo);
        }

        const iNac = document.getElementById('w-fecha-nac');
        const iIngreso = document.getElementById('w-fecha-ingreso');
        const todayStr = new Date().toISOString().split('T')[0];

        if (iNac) {
            iNac.max = todayStr;
            iNac.addEventListener('change', () => {
                const v = iNac.value;
                if (!v) { clearInlineError(iNac); return; }
                const vParts = v.split('-');
                const date = new Date(vParts[0], vParts[1] - 1, vParts[2]);
                const today = new Date();
                today.setHours(23, 59, 59, 999);
                if (date > today) {
                    showInlineError(iNac, 'La fecha de nacimiento no puede ser futura.');
                } else {
                    let age = today.getFullYear() - date.getFullYear();
                    const m = today.getMonth() - date.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;
                    if (age < 18) {
                        showInlineError(iNac, 'El trabajador debe ser mayor de edad.');
                    } else {
                        clearInlineError(iNac);
                    }
                }
            });
        }
        if (iIngreso) {
            iIngreso.max = todayStr;
            iIngreso.addEventListener('change', () => {
                const v = iIngreso.value;
                if (!v) { clearInlineError(iIngreso); return; }
                const vParts = v.split('-');
                const date = new Date(vParts[0], vParts[1] - 1, vParts[2]);
                const today = new Date();
                today.setHours(23, 59, 59, 999);
                if (date > today) {
                    showInlineError(iIngreso, 'La fecha de ingreso no puede ser futura.');
                } else {
                    clearInlineError(iIngreso);
                }
            });
        }

        addBtn.addEventListener('click', () => {
            const isVisible = formContainer.style.display === 'block';
            formContainer.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) formContainer.scrollIntoView({ behavior: 'smooth' });
            form.reset();
            document.getElementById('w-id-trabajador').value = '';
            document.getElementById('worker-form-title').innerText = 'Datos del Trabajador (Registro)';
        });

        cancelBtn.addEventListener('click', () => {
            formContainer.style.display = 'none';
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('w-id-trabajador').value;

            // --- VALIDACIONES ---
            const ciNum = document.getElementById('w-cedula-num').value;
            if (ciNum.length < 7 || ciNum.length > 8) {
                return showError('La cédula debe tener entre 7 y 8 dígitos.');
            }

            const tPrefix = document.getElementById('w-telef-prefix').value;
            const tNum = document.getElementById('w-telef-num').value;
            if (tNum && tNum.length !== 7) {
                return showError('El número de teléfono debe tener exactamente 7 dígitos después del prefijo.');
            }

            // Validación de Correo (Whitelist de Dominios y Formato)
            const emailValue = document.getElementById('w-correo').value.trim();
            if (emailValue) {
                if (!emailValue.includes('@')) {
                    return showError('Tu dirección de correo electrónico debe contener @.');
                }
                if (!validateEmailFormat(emailValue)) {
                    return showError('Formato de correo inválido');
                }
                if (!validateEmailDomain(emailValue)) {
                    return showError('Dominio no permitido (ej: gmail.com)');
                }
            }

            // Validación de Edad (18+)
            const birthValue = document.getElementById('w-fecha-nac').value;
            if (birthValue) {
                const bParts = birthValue.split('-');
                const birthDate = new Date(bParts[0], bParts[1] - 1, bParts[2]);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

                if (age < 18) {
                    return showError('El trabajador debe ser mayor de 18 años.');
                }
            }

            // Validación de Fecha de Ingreso (No futura)
            const hireValue = document.getElementById('w-fecha-ingreso').value;
            const hParts = hireValue.split('-');
            const hireDate = new Date(hParts[0], hParts[1] - 1, hParts[2]);
            const now = new Date();
            now.setHours(23, 59, 59, 999); // Permitir hasta el fin del día de hoy
            if (hireDate > now) {
                return showError('La fecha de ingreso no puede ser futura.');
            }

            // Reconstruir CI y Teléfono
            const ci = document.getElementById('w-cedula-prefix').value + ciNum;
            let tel = tPrefix ? (tPrefix + '-' + tNum) : tNum;

            const payload = {
                Nombre_Completo: document.getElementById('w-nombres').value,
                Apellidos: document.getElementById('w-apellidos').value,
                Documento_Identidad: ci,
                Fecha_Nacimiento: birthValue,
                Genero: document.getElementById('w-genero').value,
                Estado_Civil: document.getElementById('w-estado-civil').value,
                Correo: document.getElementById('w-correo').value,
                Telefono_Movil: tel,
                Direccion: document.getElementById('w-direccion').value,
                Id_Cargo: parseInt(document.getElementById('w-cargo').value),
                Id_Nivel_Educativo: parseInt(document.getElementById('w-nivel').value),
                Id_Tipo_Nomina: parseInt(document.getElementById('w-tipo-nomina').value),
                Fecha_de_Ingreso: hireValue,
                Estado: document.getElementById('w-estado').value,
                Observaciones: document.getElementById('w-observaciones').value
            };

            try {
                const endpoint = id ? `/workers/${id}` : '/workers';
                await apiFetch(endpoint, { method: 'POST', body: JSON.stringify(payload) });
                showSuccess(id ? 'Trabajador actualizado con éxito' : 'Trabajador registrado con éxito');
                renderWorkerRegistration();
            } catch (e) {
                showError(e.message);
            }
        });

        document.querySelectorAll('.btn-edit-worker').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const w = workers.find(x => String(x.Id_Trabajador) === String(id));
                if (w) {
                    const setFieldValue = (fieldId, value) => {
                        const field = document.getElementById(fieldId);
                        if (!field) return;
                        field.value = value ?? '';
                    };

                    document.getElementById('w-id-trabajador').value = w.Id_Trabajador ?? '';
                    setFieldValue('w-nombres', w.Nombre_Completo);
                    setFieldValue('w-apellidos', w.Apellidos);

                    // Parse CI
                    const ciParts = (w.Documento_Identidad || '').split('-');
                    if (ciParts.length === 2) {
                        setFieldValue('w-cedula-prefix', ciParts[0] + '-');
                        setFieldValue('w-cedula-num', ciParts[1]);
                    } else {
                        setFieldValue('w-cedula-prefix', '');
                        setFieldValue('w-cedula-num', w.Documento_Identidad || '');
                    }

                    setFieldValue('w-fecha-nac', w.Fecha_Nacimiento);
                    setFieldValue('w-genero', w.Genero);
                    setFieldValue('w-estado-civil', w.Estado_Civil);
                    setFieldValue('w-correo', w.Correo);

                    if (w.Telefono_Movil) {
                        if (w.Telefono_Movil.includes('-')) {
                            const tParts = w.Telefono_Movil.split('-');
                            setFieldValue('w-telef-prefix', tParts[0]);
                            setFieldValue('w-telef-num', tParts[1]);
                        } else {
                            setFieldValue('w-telef-prefix', '');
                            setFieldValue('w-telef-num', w.Telefono_Movil);
                        }
                    } else {
                        setFieldValue('w-telef-prefix', '');
                        setFieldValue('w-telef-num', '');
                    }

                    setFieldValue('w-direccion', w.Direccion);
                    setFieldValue('w-cargo', w.Id_Cargo);
                    setFieldValue('w-nivel', w.Id_Nivel_Educativo);
                    setFieldValue('w-tipo-nomina', w.Id_Tipo_Nomina);
                    setFieldValue('w-fecha-ingreso', w.Fecha_de_Ingreso);
                    setFieldValue('w-estado', w.Contrato_Estado);
                    setFieldValue('w-observaciones', w.Observaciones);

                    document.getElementById('worker-form-title').textContent = 'Editar Trabajador';
                    formContainer.style.display = 'block';
                    formContainer.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        document.querySelectorAll('.btn-toggle-worker').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const estado = btn.dataset.estado;
                const action = estado === 'Activo' ? 'deactivate' : 'activate';

                const confirmed = await showConfirm(`¿Desea ${action === 'activate' ? 'activar' : 'desactivar'} este trabajador?`);
                if (!confirmed) return;

                try {
                    await apiFetch(`/workers/${id}/${action}`, { method: 'POST' });
                    showSuccess(`Trabajador ${action === 'activate' ? 'activado' : 'desactivado'} correctamente`);
                    renderWorkerRegistration();
                } catch (e) {
                    showError(e.message);
                }
            });
        });

        // Initialize Mini Chart
        setTimeout(() => {
            const ctx = document.getElementById('worker-mini-chart');
            if (ctx && typeof Chart !== 'undefined') {
                new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: [workers.filter(w => w.Contrato_Estado === 'Activo').length, workers.filter(w => w.Contrato_Estado !== 'Activo').length],
                            backgroundColor: ['#10a87a', '#6b7280'],
                            borderWidth: 0
                        }]
                    },
                    options: { cutout: '70%', plugins: { tooltip: { enabled: false } } }
                });
            }
        }, 100);
    }

    // --- Módulo: Panel de Vacaciones ---
    async function renderAdminVacations() {
        contentDetails.innerHTML = '<div class="loader">Cargando solicitudes de vacaciones...</div>';
        try {
            const data = await apiFetch('/vacations');
            let requests = data.requests || [];

            contentDetails.innerHTML = `
                <div class="vacation-panel">
                    <h4 style="color: var(--text-main); border-bottom: 2px solid var(--primary); padding-bottom: 10px;">Panel de Gestión de Vacaciones</h4>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin: 20px 0;">
                        <div class="chart-container" style="margin-bottom:0; display:flex; flex-direction:column; align-items:center; padding: 15px;">
                            <h5 style="margin:0 0 0 0; color:var(--text-muted); font-size: 1.3em;">Distribución de Solicitudes</h5>
                            <div style="width:100%; height:10px;"><canvas id="vacation-main-chart"></canvas></div>
                        </div>
                    </div>

                    <div class="filters" style="margin: 20px 0; display: flex; gap: 15px; align-items: center; flex-wrap: wrap;">
                        <label style="color: var(--text-main); font-weight: 600;">Ordenar por:</label>
                        <select id="sort-field" style="padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-color); color: var(--text-main);">
                            <option value="Fecha_Solicitud">Fecha de Solicitud</option>
                            <option value="Fecha_Inicio_Vacaciones">Fecha de Inicio</option>
                            <option value="Estado">Estado</option>
                        </select>
                        <select id="sort-direction" style="padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-color); color: var(--text-main);">
                            <option value="desc">Más reciente primero</option>
                            <option value="asc">Más antiguo primero</option>
                        </select>
                        <input type="text" id="search-worker" placeholder="Buscar trabajador..." style="padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-color); color: var(--text-main); flex: 1; min-width: 200px;">
                    </div>

                    <div id="vacation-list">
                        ${renderVacationsTableHTML(requests, false)}
                    </div>
                </div>
            `;

            setupVacationListeners(requests); // Pass requests to setupVacationListeners
        } catch (e) {
            contentDetails.innerHTML = `<div class="error">Error: ${e.message}</div>`;
        }
    }

    function renderVacationsTableHTML(requests, isFiltered = false) {
        if (!requests.length) {
            const message = isFiltered
                ? '<p class="center" style="color: var(--text-muted); padding: 40px;">Este trabajador no tiene una solicitud registrada.</p>'
                : '<p class="center" style="color: var(--text-muted); padding: 40px;">No hay solicitudes de vacaciones registradas en el sistema.</p>';
            return message;
        }
        return `
            <div class="content-box" style="margin-top: 10px; border:none; padding:0; background:transparent;">
                <table class="data-table" style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: var(--primary); color: white;">
                            <th style="padding: 12px; border: 1px solid var(--border-color);">Fecha</th>
                            <th style="padding: 12px; border: 1px solid var(--border-color);">Trabajador</th>
                            <th style="padding: 12px; border: 1px solid var(--border-color);">Inicio</th>
                            <th style="padding: 12px; border: 1px solid var(--border-color);">Estado</th>
                            <th style="padding: 12px; border: 1px solid var(--border-color);">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${requests.map(r => `
                            <tr style="border-bottom: 1px solid var(--border-color);">
                                <td style="padding: 10px; border: 1px solid var(--border-color); color: var(--text-main);">${formatLocalDate(r.Fecha_Solicitud)}</td>
                                <td style="padding: 10px; border: 1px solid var(--border-color); font-weight: 600; color: var(--text-main);">${r.Nombre_Completo} ${r.Apellidos}</td>
                                <td style="padding: 10px; border: 1px solid var(--border-color); color: var(--text-main);">${formatLocalDate(r.Fecha_Inicio_Vacaciones)}</td>
                                <td style="padding: 10px; border: 1px solid var(--border-color);">
                                    <span style="padding: 6px 14px; border-radius: 20px; font-size: 0.8em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
                                        color: white; background-color: ${r.Estado === 'Aceptada' ? 'var(--success-color)' : r.Estado === 'Rechazada' ? 'var(--error-color)' : 'var(--text-muted)'};">
                                        ${r.Estado}
                                    </span>
                                </td>
                                <td style="padding: 10px; border: 1px solid var(--border-color);">
                                    ${r.Estado === 'Pendiente' ? `
                                        <button class="btn-vac-status primary small" data-id="${r.Id_Solicitud}" data-status="Aceptada">Aprobar</button>
                                        <button class="btn-vac-status primary small" data-id="${r.Id_Solicitud}" data-status="Rechazada" style="background-color: var(--error-color);">Rechazar</button>
                                    ` : (r.Estado === 'Aceptada' ? `
                                        <button class="btn-vac-status secondary small" data-id="${r.Id_Solicitud}" data-status="Pendiente">Revertir</button>
                                    ` : '-')}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    function setupVacationListeners(requests) {
        // Initialize Chart
        setTimeout(() => {
            const ctx = document.getElementById('vacation-main-chart');
            if (ctx && typeof Chart !== 'undefined') {
                const isDark = document.body.classList.contains('dark-mode');
                const textColor = isDark ? '#ffffff' : '#333333';

                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Pendientes', 'Aceptadas', 'Rechazadas'],
                        datasets: [{
                            label: 'Solicitudes',
                            data: [
                                requests.filter(r => r.Estado === 'Pendiente').length,
                                requests.filter(r => r.Estado === 'Aceptada').length,
                                requests.filter(r => r.Estado === 'Rechazada').length
                            ],
                            backgroundColor: [
                                isDark ? '#444' : '#999',
                                isDark ? '#666' : '#444',
                                isDark ? '#222' : '#111'
                            ],
                            borderRadius: 6
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        plugins: { legend: { display: false } },
                        scales: {
                            x: { display: false },
                            y: {
                                grid: { display: false },
                                ticks: { color: textColor, font: { weight: '600' } }
                            }
                        }
                    }
                });
            }
        }, 100);

        // Sorting and filtering functionality
        const sortField = document.getElementById('sort-field');
        const sortDirection = document.getElementById('sort-direction');
        const searchWorker = document.getElementById('search-worker');

        // Function to update sort-direction options based on sort-field
        function updateSortDirectionOptions() {
            const field = sortField.value;
            const currentValue = sortDirection.value;
            if (field === 'Estado') {
                sortDirection.innerHTML = `
                    <option value="Todas">Todas</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Rechazado">Rechazado</option>
                `;
                // Set default if current is not valid
                if (!['Todas', 'Pendiente', 'Aprobado', 'Rechazado'].includes(currentValue)) {
                    sortDirection.value = 'Todas';
                } else {
                    sortDirection.value = currentValue;
                }
            } else {
                sortDirection.innerHTML = `
                    <option value="desc">Más reciente primero</option>
                    <option value="asc">Más antiguo primero</option>
                `;
                // Set default if current is not valid
                if (!['desc', 'asc'].includes(currentValue)) {
                    sortDirection.value = 'desc';
                } else {
                    sortDirection.value = currentValue;
                }
            }
        }

        // Initial update
        updateSortDirectionOptions();

        function updateTable() {
            const field = sortField.value;
            const dir = sortDirection.value;
            const searchTerm = searchWorker.value.toLowerCase().trim();

            let filtered = requests.filter(r => {
                const fullName = `${r.Nombre_Completo} ${r.Apellidos}`.toLowerCase();
                const matchesSearch = searchTerm === '' || fullName.includes(searchTerm) || r.Documento_Identidad.toLowerCase().includes(searchTerm);
                let matches = matchesSearch;
                if (field === 'Estado' && dir !== 'Todas') {
                    const statusMap = { 'Pendiente': 'Pendiente', 'Aprobado': 'Aceptada', 'Rechazado': 'Rechazada' };
                    matches = matches && r.Estado === statusMap[dir];
                }
                return matches;
            });

            let sorted;
            if (field === 'Estado') {
                // When filtering by status, sort by date desc by default
                sorted = [...filtered].sort((a, b) => new Date(b.Fecha_Solicitud) - new Date(a.Fecha_Solicitud));
            } else {
                sorted = [...filtered].sort((a, b) => {
                    let valA, valB;
                    if (field === 'Fecha_Solicitud' || field === 'Fecha_Inicio_Vacaciones') {
                        valA = new Date(a[field]);
                        valB = new Date(b[field]);
                    } else {
                        valA = a[field];
                        valB = b[field];
                    }
                    if (valA < valB) return dir === 'asc' ? -1 : 1;
                    if (valA > valB) return dir === 'asc' ? 1 : -1;
                    return 0;
                });
            }
            document.getElementById('vacation-list').innerHTML = renderVacationsTableHTML(sorted, searchTerm !== '');
            // Re-attach listeners for status buttons
            document.querySelectorAll('.btn-vac-status').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.id;
                    const status = btn.dataset.status;
                    if (status === 'Rechazada') {
                        // Mostrar modal para motivo
                        showModal({
                            type: 'warning',
                            title: 'Motivo del Rechazo',
                            message: 'Por favor, indique el motivo del rechazo de la solicitud.',
                            html: '<textarea id="rejection-reason" placeholder="Escriba el motivo..." style="width:100%; height:80px; padding:8px; border:1px solid #ccc; border-radius:4px; resize: vertical;"></textarea>',
                            okText: 'Rechazar',
                            cancelText: 'Cancelar'
                        }).then(async (result) => {
                            if (result) {
                                const reason = document.getElementById('rejection-reason')?.value || '';
                                try {
                                    await apiFetch(`/vacations/${id}/status`, {
                                        method: 'POST',
                                        body: JSON.stringify({ status, reason })
                                    });
                                    showSuccess('Solicitud rechazada con éxito');
                                    renderAdminVacations();
                                } catch (e) {
                                    showError(e.message);
                                }
                            }
                        });
                    } else {
                        try {
                            await apiFetch(`/vacations/${id}/status`, {
                                method: 'POST',
                                body: JSON.stringify({ status })
                            });
                            showSuccess(status === 'Pendiente' ? 'Acción revertida exitosamente' : `Solicitud ${status.toLowerCase()} con éxito`);
                            renderAdminVacations();
                        } catch (e) {
                            showError(e.message);
                        }
                    }
                });
            });
        }

        sortField.addEventListener('change', () => {
            updateSortDirectionOptions();
            updateTable();
        });
        sortDirection.addEventListener('change', updateTable);
        searchWorker.addEventListener('input', updateTable);
        // Initial update
        updateTable();

        // Status buttons are re-attached inside updateTable() whenever the content changes
    }

    // --- Módulo: Pago de Nómina ---
    async function renderPayrollPayment() {
        contentDetails.innerHTML = '<div class="loader">Iniciando módulo de pago...</div>';
        try {
            const [wData, cData] = await Promise.all([
                apiFetch('/workers'),
                apiFetch('/concepts')
            ]);

            // Solo trabajadores activos
            const workers = (wData.workers || []).filter(w => w.Contrato_Estado === 'Activo');
            const concepts = cData.conceptos || [];
            let addedConcepts = [];

            contentDetails.innerHTML = `
                <div class="payroll-payment">
                    <div class="content-box">
                        <h4 style="margin-top: 0; color: var(--text-main); border-bottom: 2px solid var(--primary); padding-bottom: 10px;">Procesar Pago de Nómina</h4>
                        
                        <div class="payroll-form" style="background: var(--card-bg); padding:25px; border-radius:12px; border: 1px solid var(--border-color); box-shadow:0 10px 30px rgba(0,0,0,0.1);">
                            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:25px; margin-bottom:30px;">
                                <div class="form-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color: var(--text-main);">Seleccionar Trabajador</label>
                                    <select id="p-worker" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                        <option value="">Seleccione trabajador...</option>
                                        ${workers.map(w => `<option value="${w.Id_Trabajador}">${w.Documento_Identidad} - ${w.Nombre_Completo} ${w.Apellidos}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="form-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color: var(--text-main);">Año de Nómina</label>
                                    <select id="p-year" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                        ${(() => {
                                            const currentYear = new Date().getFullYear();
                                            let opts = "";
                                            for(let y = currentYear - 5; y <= currentYear + 5; y++) {
                                                opts += `<option value="${y}" ${y === currentYear ? 'selected' : ''}>${y}</option>`;
                                            }
                                            return opts;
                                        })()}
                                    </select>
                                </div>
                                <div class="form-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color: var(--text-main);">Salario Base (Bs.)</label>
                                    <input type="number" id="p-salario" value="130" min="0" step="0.01" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                </div>
                                <div class="form-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color: var(--text-main);">Fecha de Pago</label>
                                    <input type="date" id="p-fecha" value="${new Date().toISOString().split('T')[0]}" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                </div>
                                <div class="form-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color: var(--text-main);">Período de Nómina</label>
                                    <select id="p-periodo" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                        <option value="">Seleccione periodo...</option>
                                        ${(() => {
                    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                    let opts = "";
                    months.forEach(m => {
                        opts += `<option value="1ra Quincena ${m}">1ra Quincena ${m}</option>`;
                        opts += `<option value="2da Quincena ${m}">2da Quincena ${m}</option>`;
                    });
                    return opts;
                })()}
                                    </select>
                                </div>
                                <div class="form-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color: var(--text-muted); font-size:0.9em;">Desde:</label>
                                    <input type="date" id="p-fecha-desde" readonly style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: rgba(0,0,0,0.05); color: var(--text-main); cursor: not-allowed;">
                                </div>
                                <div class="form-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color: var(--text-muted); font-size:0.9em;">Hasta:</label>
                                    <input type="date" id="p-fecha-hasta" readonly style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: rgba(0,0,0,0.05); color: var(--text-main); cursor: not-allowed;">
                                </div>
                            </div>

                            <h5 style="color: var(--text-main); border-top: 1px solid var(--border-color); padding-top:20px; margin-bottom:15px;">Conceptos Adicionales</h5>
                            <div style="display:flex; gap:15px; margin-bottom:25px; align-items: flex-end;">
                                <div style="flex:2;">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color: var(--text-muted); font-size:0.9em;">Seleccionar Concepto</label>
                                    <select id="p-add-concept" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                        <option value="">Seleccionar...</option>
                                        ${concepts.map(c => `<option value="${c.Id_Concepto}">${c.Nombre_Concepto} (${c.Tipo})</option>`).join('')}
                                    </select>
                                </div>
                                <div style="flex:1;">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color: var(--text-muted); font-size:0.9em;">Cantidad</label>
                                    <input type="number" id="p-concept-qty" value="1" min="1" step="0.5" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                </div>
                                <button id="btn-add-concept-to-list" class="primary" style="height:42px;">Agregar</button>
                            </div>

                            <div id="added-concepts-container" style="min-height:100px; border:1px solid var(--border-color); border-radius:12px; padding:15px; margin-bottom:25px; background: var(--card-bg);">
                                <p class="text-muted center" style="margin-top:25px;">No hay conceptos adicionales agregados.</p>
                            </div>

                            <div class="totals" style="background: var(--primary); color: white; padding:25px; border-radius:12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                                <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:0.95em; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:8px;">
                                    <span>Salario Base:</span>
                                    <span id="t-base">Bs. 130,00</span>
                                </div>
                                <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:0.95em;">
                                    <span>Asignaciones:</span>
                                    <span id="t-asignaciones">Bs. 0,00</span>
                                </div>
                                <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-size:0.95em;">
                                    <span>Deducciones:</span>
                                    <span id="t-deducciones" style="color: #ffb8b8;">Bs. 0,00</span>
                                </div>
                                <div style="display:flex; justify-content:space-between; font-size:1.5em; font-weight:bold; border-top:1px solid rgba(255,255,255,0.2); padding-top:15px;">
                                    <span>NETO A PAGAR:</span>
                                    <span id="t-neto" style="color: #ffffff;">Bs. 0,00</span>
                                </div>
                            </div>

                            <div style="margin-top:30px;">
                                <button id="btn-generate-pay" class="primary" style="width:100%; padding:18px; font-size:1.1em; text-transform:uppercase; letter-spacing:1px;">
                                    Confirmar y Procesar Pago
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            setupPayrollListeners(workers, concepts, addedConcepts);

        } catch (e) {
            contentDetails.innerHTML = `<div class="error">Error: ${e.message}</div>`;
        }
    }

    function setupPayrollListeners(workers, allConcepts, addedConcepts) {
        const addBtn = document.getElementById('btn-add-concept-to-list');
        const conceptSelect = document.getElementById('p-add-concept');
        const salaryInput = document.getElementById('p-salario');
        const yearSelect = document.getElementById('p-year');
        const periodSelect = document.getElementById('p-periodo');
        const dateFromInput = document.getElementById('p-fecha-desde');
        const dateToInput = document.getElementById('p-fecha-hasta');
        const paymentDateInput = document.getElementById('p-fecha');
        const generateBtn = document.getElementById('btn-generate-pay');

        // Lógica de Periodos Automáticos
        const updatePeriodDates = () => {
            const v = periodSelect.value;
            if (!v) {
                dateFromInput.value = '';
                dateToInput.value = '';
                return;
            }

            const year = parseInt(yearSelect.value) || new Date().getFullYear();
            const monthsMap = {
                "Enero": 0, "Febrero": 1, "Marzo": 2, "Abril": 3, "Mayo": 4, "Junio": 5,
                "Julio": 6, "Agosto": 7, "Septiembre": 8, "Octubre": 9, "Noviembre": 10, "Diciembre": 11
            };

            let monthName = "";
            let isFirstHalf = v.startsWith("1ra");

            for (let m in monthsMap) {
                if (v.includes(m)) {
                    monthName = m;
                    break;
                }
            }

            if (monthName) {
                const monthIdx = monthsMap[monthName];
                let dFrom, dTo;
                if (isFirstHalf) {
                    dFrom = new Date(year, monthIdx, 1);
                    dTo = new Date(year, monthIdx, 15);
                } else {
                    dFrom = new Date(year, monthIdx, 16);
                    dTo = new Date(year, monthIdx + 1, 0); // Last day of month
                }

                const factor = (n) => String(n).padStart(2, '0');
                dateFromInput.value = `${year}-${factor(monthIdx + 1)}-${factor(dFrom.getDate())}`;
                dateToInput.value = `${year}-${factor(monthIdx + 1)}-${factor(dTo.getDate())}`;

                // Trigger validation for payment date after period update
                validatePaymentDate();
            }
        };

        periodSelect.addEventListener('change', updatePeriodDates);
        yearSelect.addEventListener('change', updatePeriodDates);

        // Validaciones en Tiempo Real
        function validateSalary() {
            const val = parseFloat(salaryInput.value) || 0;
            if (val < 130) {
                showInlineError(salaryInput, 'El salario base no puede ser menor a 130 bs.');
                return false;
            } else {
                clearInlineError(salaryInput);
                return true;
            }
        }

        function validatePaymentDate() {
            if (!paymentDateInput.value || !dateToInput.value) return true;

            const pParts = paymentDateInput.value.split('-');
            const payDate = new Date(pParts[0], pParts[1] - 1, pParts[2]);

            const tParts = dateToInput.value.split('-');
            const toDate = new Date(tParts[0], tParts[1] - 1, tParts[2]);

            if (payDate <= toDate) {
                showInlineError(paymentDateInput, 'La fecha de pago debe ser futura a la fecha del periodo seleccionado.');
                return false;
            } else {
                clearInlineError(paymentDateInput);
                return true;
            }
        }

        function validateWorkerHireDate() {
            const workerId = document.getElementById('p-worker').value;
            const period = document.getElementById('p-periodo').value;
            const workerSelect = document.getElementById('p-worker');

            if (!workerId || !period) {
                clearInlineError(workerSelect);
                return true;
            }

            const w = workers.find(x => String(x.Id_Trabajador) === String(workerId));
            if (!w || !w.Fecha_de_Ingreso) {
                clearInlineError(workerSelect);
                return true;
            }

            const dates = getPeriodDates(period);
            if (!dates.end) {
                clearInlineError(workerSelect);
                return true;
            }

            const hireParts = w.Fecha_de_Ingreso.split('-');
            const hireDate = new Date(hireParts[0], hireParts[1] - 1, hireParts[2]);

            const periodEndParts = dates.end.split('-');
            const periodEnd = new Date(periodEndParts[0], periodEndParts[1] - 1, periodEndParts[2]);

            if (hireDate > periodEnd) {
                showInlineError(workerSelect, `El trabajador ingresó el ${w.Fecha_de_Ingreso}. No se puede pagar un período que terminó antes de su fecha de ingreso.`);
                return false;
            } else {
                clearInlineError(workerSelect);
                return true;
            }
        }

        salaryInput.addEventListener('input', () => {
            validateSalary();
            updateTotals();
        });

        paymentDateInput.addEventListener('change', validatePaymentDate);

        // Pre-validate if initial values exist (e.g. reload)
        setTimeout(() => validateSalary(), 100);

        // Pre-validate if initial values exist (e.g. reload)
        setTimeout(() => validateSalary(), 100);

        function updateTotals() {
            const salario = parseFloat(salaryInput.value) || 0;
            let asig = 0;
            let dedu = 0;

            // Paso 1: Calcular Asignaciones (Ingreso Bruto)
            addedConcepts.forEach(c => {
                if (c.Tipo !== 'Deducción') {
                    const montoUnitario = getConceptAmount(c, salario); // Pasa 0 en totalAsig para el primer pase
                    let qty = 1;
                    if (c.aux) {
                        const match = String(c.aux).match(/(\d+(\.\d+)?)/);
                        if (match) qty = parseFloat(match[0]);
                    }
                    asig += (montoUnitario * qty);
                }
            });

            // Paso 2: Calcular Deducciones (Usando el total de asignaciones para retenciones de ley)
            addedConcepts.forEach(c => {
                if (c.Tipo === 'Deducción') {
                    const montoUnitario = getConceptAmount(c, salario, asig);
                    let qty = 1;
                    if (c.aux) {
                        const match = String(c.aux).match(/(\d+(\.\d+)?)/);
                        if (match) qty = parseFloat(match[0]);
                    }
                    dedu += (montoUnitario * qty);
                }
            });

            const neto = asig - dedu;

            document.getElementById('t-base').textContent = `Bs. ${salario.toFixed(2)}`;
            document.getElementById('t-asignaciones').textContent = `Bs. ${asig.toFixed(2)}`;
            document.getElementById('t-deducciones').textContent = `Bs. ${dedu.toFixed(2)}`;
            document.getElementById('t-neto').textContent = `Bs. ${neto.toFixed(2)}`;

            // Re-re-renderizar conceptos para actualizar montos mostrados si el ingreso bruto (asig) o salario cambió
            renderAddedConcepts(addedConcepts, updateTotals, asig);
        }

        // Helper: Get dates from period
        function getPeriodDates(period) {
            if (!period || typeof period !== 'string') return { start: '', end: '' };
            const year = parseInt(yearSelect.value) || new Date().getFullYear();
            const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

            for (let i = 0; i < 12; i++) {
                if (period.includes(months[i])) {
                    if (period.includes("1ra")) {
                        return { start: `${year}-${String(i + 1).padStart(2, '0')}-01`, end: `${year}-${String(i + 1).padStart(2, '0')}-15` };
                    } else {
                        const lastDay = new Date(year, i + 1, 0).getDate();
                        return { start: `${year}-${String(i + 1).padStart(2, '0')}-16`, end: `${year}-${String(i + 1).padStart(2, '0')}-${lastDay}` };
                    }
                }
            }
            return { start: '', end: '' };
        }

        // Automatic Mandatory Concepts
        async function triggerMandatoryConcepts() {
            const workerId = document.getElementById('p-worker').value;
            const period = document.getElementById('p-periodo').value;
            if (!workerId || !period) return;

            // Validate worker hire date before proceeding
            if (!validateWorkerHireDate()) {
                return;
            }

            const w = workers.find(x => String(x.Id_Trabajador) === String(workerId));
            if (!w) return;

            const dates = getPeriodDates(period);
            const salario = parseFloat(salaryInput.value) || 0;

            // Simple logic: add IVSS, SPF, FAOV if missing
            const mandatoryCodigos = ['IVSS', 'SPF', 'FAOV'];

            // Calculate Mondays
            let lunes = 4;
            if (dates.start && dates.end) {
                let start = new Date(dates.start + 'T00:00:00');
                let end = new Date(dates.end + 'T23:59:59');
                lunes = 0;
                while (start <= end) {
                    if (start.getDay() === 1) lunes++;
                    start.setDate(start.getDate() + 1);
                }
                if (lunes === 0) lunes = 2; // Failover
            }

            const sueldoSemanal = (Math.min(salario, 650) * 12) / 52;

            mandatoryCodigos.forEach(cod => {
                if (!addedConcepts.some(c => c.Codigo === cod)) {
                    let c = { Codigo: cod, Tipo: 'Deducción' };
                    if (cod === 'IVSS') {
                        c.Nombre_Concepto = 'Seguro Social Obligatorio (4%)';
                        c.Monto = sueldoSemanal * 0.04;
                        c.aux = `${lunes} Lunes`;
                    } else if (cod === 'SPF') {
                        c.Nombre_Concepto = 'Régimen Prest. de Empleo (0.5%)';
                        c.Monto = sueldoSemanal * 0.005;
                        c.aux = `${lunes} Lunes`;
                    } else if (cod === 'FAOV') {
                        c.Nombre_Concepto = 'Ahorro Habitacional (1%)';
                        c.Monto = salario * 0.01;
                        c.aux = '1%';
                    }
                    addedConcepts.push(c);
                }
            });
            renderAddedConcepts(addedConcepts, updateTotals);
            updateTotals();
        }

        document.getElementById('p-worker').addEventListener('change', (e) => {
            addedConcepts.length = 0; // Limpiar lista al cambiar trabajador
            const w = workers.find(x => String(x.Id_Trabajador) === String(e.target.value));
            if (w) salaryInput.value = w.Sueldo_Mensual || 130;
            validateWorkerHireDate();
            triggerMandatoryConcepts();
        });
        document.getElementById('p-periodo').addEventListener('change', () => {
            validateWorkerHireDate();
            triggerMandatoryConcepts();
        });

        addBtn.addEventListener('click', () => {
            const cid = conceptSelect.value;
            const qty = parseFloat(document.getElementById('p-concept-qty').value) || 1;
            if (!cid) return;
            const concept = JSON.parse(JSON.stringify(allConcepts.find(c => String(c.Id_Concepto) === String(cid))));
            if (concept) {
                if (addedConcepts.some(c => String(c.Id_Concepto) == String(cid))) return;
                concept.aux = `${qty} Unid.`;
                addedConcepts.push(concept);
                renderAddedConcepts(addedConcepts, updateTotals);
                updateTotals();
            }
        });

        salaryInput.addEventListener('input', updateTotals);

        generateBtn.addEventListener('click', async () => {
            const workerId = document.getElementById('p-worker').value;
            if (!workerId) return showError('Seleccione un trabajador');
            const w = workers.find(x => String(x.Id_Trabajador) === String(workerId));

            const salario = parseFloat(salaryInput.value) || 0;
            const fecha = document.getElementById('p-fecha').value;
            const periodo = document.getElementById('p-periodo').value;
            const dates = getPeriodDates(periodo);

            if (!fecha) return showError('Indique la fecha de pago');

            // Validación: Salario Base mínimo 130
            if (!validateSalary()) {
                return showError('El salario base no puede ser menor a 130 bs.');
            }

            // Validación: Fecha de Pago > Periodo Fin
            if (!validatePaymentDate()) {
                return showError('La fecha de pago debe ser futura al periodo a pagar');
            }

            // Validación: Fecha de ingreso del trabajador
            if (!validateWorkerHireDate()) {
                return showError('No se puede procesar el pago porque la fecha de ingreso del trabajador es posterior al período seleccionado');
            }

            // Calcular neto final (Asignaciones - Deducciones) con lógica de dos pasos
            let asig = 0, dedu = 0;
            addedConcepts.forEach(c => {
                if (c.Tipo !== 'Deducción') {
                    const mu = getConceptAmount(c, salario);
                    let q = 1;
                    if (c.aux && String(c.aux).match(/(\d+(\.\d+)?)/)) q = parseFloat(String(c.aux).match(/(\d+(\.\d+)?)/)[0]);
                    asig += (mu * q);
                }
            });
            addedConcepts.forEach(c => {
                if (c.Tipo === 'Deducción') {
                    const mu = getConceptAmount(c, salario, asig);
                    let q = 1;
                    if (c.aux && String(c.aux).match(/(\d+(\.\d+)?)/)) q = parseFloat(String(c.aux).match(/(\d+(\.\d+)?)/)[0]);
                    dedu += (mu * q);
                }
            });
            const netoFinal = asig - dedu;

            const confirmed = await showConfirm(`¿Está seguro de procesar el pago para este trabajador?`);
            if (!confirmed) return;

            const payload = {
                data: {
                    trabajadorId: workerId,
                    trabajador: w.Nombre_Completo + ' ' + w.Apellidos,
                    cedula: w.Documento_Identidad,
                    fechaPago: fecha,
                    periodo: `${periodo} ${yearSelect.value}`,
                    fechaInicio: dates.start,
                    fechaFin: dates.end,
                    salarioBase: salario,
                    neto: netoFinal,
                    conceptos: addedConcepts.map(c => {
                        const mu = getConceptAmount(c, salario, asig); // Usar el asig calculado arriba
                        let q = 1;
                        if (c.aux) {
                            const match = String(c.aux).match(/(\d+(\.\d+)?)/);
                            if (match) q = parseFloat(match[0]);
                        }
                        return {
                            ...c,
                            Monto: mu,
                            Monto_Unitario: mu,
                            Cantidad: q
                        };
                    })
                }
            };

            try {
                await apiFetch('/payroll/pay', { method: 'POST', body: JSON.stringify(payload) });
                showSuccess('Recibo generado con éxito');
                renderPayrollPayment();
            } catch (e) {
                showError(e.message);
            }
        });
    }

    function renderConceptsTableHTML(concepts) {
        if (!concepts.length) return '<p class="center" style="color: var(--text-muted); padding:30px;">No hay conceptos registrados.</p>';
        return `
            <table class="data-table" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: var(--primary); color: white;">
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Nombre</th>
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Tipo</th>
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Monto</th>
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Estado</th>
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${concepts.map(c => `
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 10px; border: 1px solid var(--border-color); font-weight: 600; color: var(--text-main);">${c.Nombre_Concepto}</td>
                            <td style="padding: 10px; border: 1px solid var(--border-color); color: var(--text-main);">${c.Tipo}</td>
                            <td style="padding: 10px; border: 1px solid var(--border-color); color: var(--text-main);">Bs. ${parseFloat(c.Monto || 0).toFixed(2)}</td>
                            <td style="padding: 10px; border: 1px solid var(--border-color);">
                                <span style="padding: 4px 10px; border-radius: 12px; font-size: 0.8em; font-weight: 700; 
                                    background: ${c.Estado === 'Activo' ? 'var(--success-color)' : 'var(--error-color)'}; color: white;">
                                    ${c.Estado || 'Activo'}
                                </span>
                            </td>
                            <td style="padding: 10px; border: 1px solid var(--border-color);">
                                <button class="btn-edit-concept primary small" data-id="${c.Id_Concepto}">Editar</button>
                                <button class="btn-toggle-concept secondary small" data-id="${c.Id_Concepto}" data-status="${c.Estado}">
                                    ${c.Estado === 'Activo' ? 'Desactivar' : 'Activar'}
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    function renderAddedConcepts(list, onRemove, totalAsig = 0) {
        const container = document.getElementById('added-concepts-container');
        const salario = parseFloat(document.getElementById('p-salario')?.value || 0);

        if (!list.length) {
            container.innerHTML = '<p class="text-muted" style="text-align:center; margin-top:35px;">No hay conceptos adicionales agregados.</p>';
            if (onRemove && totalAsig === 0) {
                // Si no hay lista y venimos de un evento que requiere actualizar totales (como al seleccionar un trabajador)
                // Pero evitamos recursión infinita solo llamando si realmente hay algo que limpiar y no estamos ya en asig=0
                // En la práctica, updateTotals llama a renderAddedConcepts, por lo que debemos tener cuidado.
            }
            return;
        }

        container.innerHTML = list.map((c, i) => {
            const montoUnitario = getConceptAmount(c, salario, totalAsig);

            let qty = 1;
            if (c.aux) {
                const match = String(c.aux).match(/(\d+(\.\d+)?)/);
                if (match) qty = parseFloat(match[0]);
            }
            const totalRow = montoUnitario * qty;

            return `
                <div style="display:flex; justify-content:space-between; padding:12px 8px; border-bottom:1px solid rgba(255,255,255,0.05); align-items:center; transition: background 0.2s;">
                    <div style="flex:1;">
                        <span style="font-weight:600; color:var(--text-main); font-size:1.05em;">${c.Nombre_Concepto}</span>
                        ${c.aux ? `<span style="font-size:0.9em; color:var(--text-muted); margin-left:12px; font-style:italic;">(${c.aux})</span>` : ''}
                    </div>
                    <div style="text-align:right; display:flex; align-items:center; gap:20px;">
                        <span style="font-family:'Courier New', monospace; font-weight:800; font-size:1.25em; color:${c.Tipo === 'Deducción' ? '#ff8080' : '#80ff80'}; text-shadow: 0 0 10px rgba(0,0,0,0.2);">
                            ${c.Tipo === 'Deducción' ? '-' : '+'} Bs. ${totalRow.toFixed(2)}
                        </span>
                        <button class="btn-remove-concept" data-index="${i}" style="color:#ff4d4d; border:none; background:none; cursor:pointer; font-weight:bold; font-size:1.5em; padding:0 5px; line-height:1;">&times;</button>
                    </div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.btn-remove-concept').forEach(btn => {
            btn.addEventListener('click', () => {
                list.splice(btn.dataset.index, 1);
                renderAddedConcepts(list, onRemove, totalAsig);
                if (onRemove) onRemove();
            });
        });
    }

    // --- Módulo: Gestión de Conceptos ---
    async function renderConceptosModule() {
        contentDetails.innerHTML = '<div class="loader">Cargando conceptos...</div>';
        try {
            const data = await apiFetch('/concepts');
            const concepts = data.conceptos || [];

            contentDetails.innerHTML = `
                <div class="conceptos-module">
                    <div class="content-box">
                        <h4 style="margin-top: 0; color: var(--text-main); border-bottom: 2px solid var(--primary); padding-bottom: 10px;">Gestión de Conceptos de Nómina</h4>
                        
                        <div id="concepts-list" style="margin-top: 20px;">
                            ${renderConceptsTableHTML(concepts)}
                        </div>
 
                        <div style="margin-top:25px; text-align:center; padding-top:20px; border-top:1px solid var(--border-color);">
                            <button id="add-concept-btn" class="primary">➕ Nuevo Concepto</button>
                        </div>
                        
                        <div id="concept-form-container" style="display:none; background: var(--card-bg); padding:25px; border-radius:12px; margin-top:25px; border:1px solid var(--border-color); box-shadow:0 8px 30px rgba(0,0,0,0.1);">
                            <h5 id="concept-form-title" style="margin-top:0; color: var(--text-main); border-bottom: 1px solid var(--border-color); padding-bottom:10px; margin-bottom:20px;">Configurar Concepto</h5>
                            <form id="concept-form">
                                <input type="hidden" id="c-id">
                                <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                                    <div><label style="display:block; font-weight:600; margin-bottom:6px; color: var(--text-main);">Nombre del Concepto</label><input type="text" id="c-nombre" required style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);"></div>
                                    <div><label style="display:block; font-weight:600; margin-bottom:6px; color: var(--text-main);">Tipo</label><select id="c-tipo" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);"><option value="Asignación">Asignación</option><option value="Deducción">Deducción</option><option value="Bonificación">Bonificación</option></select></div>
                                    <div><label style="display:block; font-weight:600; margin-bottom:6px; color: var(--text-main);">Monto sugerido (Bs.)</label><input type="number" id="c-monto" step="0.01" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);"></div>
                                    <div><label style="display:block; font-weight:600; margin-bottom:6px; color: var(--text-main);">Código de Referencia</label><input type="text" id="c-codigo" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);"></div>
                                </div>
                                <div style="margin-top:20px; display:flex; gap:10px; justify-content: flex-end;">
                                    <button type="button" id="cancel-concept-btn" class="secondary">Cancelar</button>
                                    <button type="submit" class="primary" style="min-width:120px;">Guardar Concepto</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;

            setupConceptListeners(concepts);
        } catch (e) {
            contentDetails.innerHTML = `<div class="error">Error: ${e.message}</div>`;
        }
    }

    function setupConceptListeners(concepts) {
        const addBtn = document.getElementById('add-concept-btn');
        const cancelBtn = document.getElementById('cancel-concept-btn');
        const formContainer = document.getElementById('concept-form-container');
        const form = document.getElementById('concept-form');

        addBtn.addEventListener('click', () => {
            const isVisible = formContainer.style.display === 'block';
            formContainer.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) formContainer.scrollIntoView({ behavior: 'smooth' });
            form.reset();
            document.getElementById('c-id').value = '';
            document.getElementById('concept-form-title').innerText = 'Registrar Nuevo Concepto';
        });

        cancelBtn.addEventListener('click', () => { formContainer.style.display = 'none'; });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('c-id').value;
            const payload = {
                Nombre_Concepto: document.getElementById('c-nombre').value,
                Tipo: document.getElementById('c-tipo').value,
                Monto: parseFloat(document.getElementById('c-monto').value) || 0,
                Codigo: document.getElementById('c-codigo').value
            };
            try {
                const endpoint = id ? `/concepts/${id}` : '/concepts';
                await apiFetch(endpoint, { method: 'POST', body: JSON.stringify(payload) });
                showSuccess(id ? 'Concepto actualizado' : 'Concepto registrado');
                renderConceptosModule();
            } catch (e) { showError(e.message); }
        });

        document.querySelectorAll('.btn-edit-concept').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const c = concepts.find(x => String(x.Id_Concepto) === String(id));
                if (c) {
                    document.getElementById('c-id').value = c.Id_Concepto;
                    document.getElementById('c-nombre').value = c.Nombre_Concepto;
                    document.getElementById('c-tipo').value = c.Tipo;
                    document.getElementById('c-monto').value = c.Monto;
                    document.getElementById('c-codigo').value = c.Codigo || '';
                    document.getElementById('concept-form-title').innerText = 'Editar Concepto';
                    formContainer.style.display = 'block';
                    formContainer.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        document.querySelectorAll('.btn-toggle-concept').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const status = btn.dataset.status;
                const action = status === 'Activo' ? 'desactivar' : 'activar';

                const confirmed = await showConfirm(`¿Desea ${action} este concepto?`);
                if (!confirmed) return;

                try {
                    await apiFetch(`/concepts/${id}/toggle`, { method: 'POST' });
                    showSuccess(`Concepto ${action}ado correctamente`);
                    renderConceptosModule();
                } catch (e) { showError(e.message); }
            });
        });
    }

    function renderNominaTableHTML(tipos) {
        if (!tipos.length) return '<p class="center" style="color: var(--text-muted); padding:30px;">No hay tipos de nómina registrados.</p>';
        return `
            <table class="data-table" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: var(--primary); color: white;">
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Nombre / Frecuencia</th>
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Estado</th>
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${tipos.map(t => `
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 10px; border: 1px solid var(--border-color); font-weight: 600; color: var(--text-main);">${t.Frecuencia}</td>
                            <td style="padding: 10px; border: 1px solid var(--border-color);">
                                <span style="padding: 4px 10px; border-radius: 12px; font-size: 0.8em; font-weight: 700; 
                                    background: ${t.Estado === 'Activo' ? 'var(--success-color)' : 'var(--error-color)'}; color: white;">
                                    ${t.Estado || 'Activo'}
                                </span>
                            </td>
                            <td style="padding: 10px; border: 1px solid var(--border-color);">
                                <button class="btn-edit-nomina primary small" data-id="${t.Id_Tipo_Nomina}">Editar</button>
                                <button class="btn-toggle-nomina secondary small" data-id="${t.Id_Tipo_Nomina}" data-status="${t.Estado}">
                                    ${t.Estado === 'Activo' ? 'Desactivar' : 'Activar'}
                                </button>
                                <button class="btn-delete-nomina" data-id="${t.Id_Tipo_Nomina}" style="background-color: var(--error-color); color: white; padding: 6px 10px; border-radius: 8px; margin-left: 5px; cursor: pointer; border:none;" title="Eliminar permanentemente">🗑️</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // --- Módulo: Tipos de Nómina ---
    async function renderTipoNominaModule() {
        contentDetails.innerHTML = '<div class="loader">Cargando tipos de nómina...</div>';
        try {
            const data = await apiFetch('/types-nomina');
            let tipos = data.tipos || [];

            contentDetails.innerHTML = `
                <div class="tipos-nomina">
                    <div class="content-box">
                        <h4 style="margin-top: 0; color: var(--text-main); border-bottom: 2px solid var(--primary); padding-bottom: 10px;">Gestión de Tipos de Nómina</h4>
                        
                        <div id="nomina-list" style="margin-top:20px;">
                            ${renderNominaTableHTML(tipos)}
                        </div>

                        <div style="margin-top:25px; text-align:center; padding-top:20px; border-top:1px solid var(--border-color);">
                            <button id="add-tn-btn" class="primary">➕ Crear Nuevo Tipo</button>
                        </div>
                        
                        <div id="tn-form-container" style="display:none; background: var(--card-bg); padding:25px; border-radius:12px; margin-top:25px; border:1px solid var(--border-color); box-shadow:0 8px 30px rgba(0,0,0,0.1);">
                            <h5 id="tn-form-title" style="margin-top:0; color: var(--text-main); border-bottom: 1px solid var(--border-color); padding-bottom:10px; margin-bottom:20px;">Detalle de Nómina</h5>
                            <form id="tn-form">
                                <input type="hidden" id="tn-id">
                                
                                <div style="margin-bottom:15px;">
                                    <label style="display:block; font-weight:600; margin-bottom:6px; color: var(--text-main);">Tipo / Frecuencia</label>
                                    <select id="tn-freq-select" required style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                        <option value="Semanal">Semanal</option>
                                        <option value="Quincenal" selected>Quincenal</option>
                                        <option value="Mensual">Mensual</option>
                                        <option value="Mixta">Mixta</option>
                                        <option value="Bonificación">Bonificación</option>
                                    </select>
                                </div>

                                <div id="tn-bono-name-container" style="display:none; margin-bottom:15px;">
                                    <label style="display:block; font-weight:600; margin-bottom:6px; color: var(--text-main);">Nombre de la Bonificación</label>
                                    <input type="text" id="tn-bono-name" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);" placeholder="Ej: Bono de Productividad">
                                </div>

                                <div style="margin-top:20px; display:flex; gap:10px; justify-content: flex-end;">
                                    <button type="button" id="cancel-tn-btn" class="secondary">Cancelar</button>
                                    <button type="submit" class="primary">Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;

            const addBtn = document.getElementById('add-tn-btn');
            const formContainer = document.getElementById('tn-form-container');
            const form = document.getElementById('tn-form');

            addBtn.addEventListener('click', () => {
                const isVisible = formContainer.style.display === 'block';
                formContainer.style.display = isVisible ? 'none' : 'block';
                if (!isVisible) formContainer.scrollIntoView({ behavior: 'smooth' });
                form.reset();
                document.getElementById('tn-id').value = '';
                document.getElementById('tn-form-title').innerText = 'Registrar Nuevo Tipo de Nómina';
                document.getElementById('tn-bono-name-container').style.display = 'none';
            });

            document.getElementById('cancel-tn-btn').addEventListener('click', () => { formContainer.style.display = 'none'; });

            const freqSelect = document.getElementById('tn-freq-select');
            const bonoContainer = document.getElementById('tn-bono-name-container');
            const bonoInput = document.getElementById('tn-bono-name');

            freqSelect.addEventListener('change', () => {
                bonoContainer.style.display = freqSelect.value === 'Bonificación' ? 'block' : 'none';
                if (freqSelect.value !== 'Bonificación') bonoInput.value = '';
            });

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const id = document.getElementById('tn-id').value;
                let frecuencia = freqSelect.value;

                if (frecuencia === 'Bonificación') {
                    frecuencia = bonoInput.value.trim();
                    if (!frecuencia) return showError('Debe indicar el nombre de la bonificación');
                }

                // Restricción: No permitir crear dos tipos de nómina con el mismo nombre
                const isDuplicate = tipos.some(t => t.Frecuencia.toLowerCase() === frecuencia.toLowerCase() && String(t.Id_Tipo_Nomina) !== String(id));
                if (isDuplicate) {
                    return showError('Ya existe un tipo de nómina con ese nombre.');
                }

                const payload = {
                    Frecuencia: frecuencia
                };

                try {
                    const endpoint = id ? `/types-nomina/${id}` : '/types-nomina';
                    await apiFetch(endpoint, { method: 'POST', body: JSON.stringify(payload) });
                    showSuccess(id ? 'Tipo de nómina actualizado' : 'Tipo de nómina registrado');
                    renderTipoNominaModule();
                } catch (e) { showError(e.message); }
            });

            document.querySelectorAll('.btn-edit-nomina').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.id;
                    const t = tipos.find(x => String(x.Id_Tipo_Nomina) === String(id));
                    if (t) {
                        document.getElementById('tn-id').value = t.Id_Tipo_Nomina;
                        const standard = ["Semanal", "Quincenal", "Mensual", "Mixta"];
                        if (standard.includes(t.Frecuencia)) {
                            document.getElementById('tn-freq-select').value = t.Frecuencia;
                            document.getElementById('tn-bono-name-container').style.display = 'none';
                        } else {
                            document.getElementById('tn-freq-select').value = 'Bonificación';
                            document.getElementById('tn-bono-name').value = t.Frecuencia;
                            document.getElementById('tn-bono-name-container').style.display = 'block';
                        }
                        document.getElementById('tn-form-title').innerText = 'Editar Tipo de Nómina';
                        formContainer.style.display = 'block';
                        formContainer.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });

            document.querySelectorAll('.btn-toggle-nomina').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.id;
                    const status = btn.dataset.status;
                    const action = status === 'Activo' ? 'desactivar' : 'activar';

                    const confirmed = await showConfirm(`¿Desea ${action} este tipo de nómina?`);
                    if (!confirmed) return;

                    try {
                        await apiFetch(`/types-nomina/${id}/toggle`, { method: 'POST' });
                        showSuccess(`Tipo de nómina ${action}ado correctamente`);
                        renderTipoNominaModule();
                    } catch (e) { showError(e.message); }
                });
            });

            document.querySelectorAll('.btn-delete-nomina').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.id;
                    const confirmed = await showConfirm(`¿Está seguro de ELIMINAR PERMANENTEMENTE este tipo de nómina?\nEsta acción no se puede deshacer y el registro desaparecerá de la base de datos.`);
                    if (!confirmed) return;

                    try {
                        await apiFetch(`/types-nomina/${id}/delete`, { method: 'POST' });
                        showSuccess(`Registro eliminado de la base de datos`);
                        renderTipoNominaModule();
                    } catch (e) { showError(e.message); }
                });
            });
        } catch (e) { contentDetails.innerHTML = `<div class="error">Error: ${e.message}</div>`; }
    }

    function renderCargosTableHTML(cargos) {
        if (!cargos.length) return '<p class="center" style="color: var(--text-muted); padding:30px;">No hay cargos registrados.</p>';
        return `
            <table class="data-table" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: var(--primary); color: white;">
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Cargo / Profesión</th>
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Área</th>
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Estado</th>
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${cargos.map(c => `
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 10px; border: 1px solid var(--border-color); font-weight: 600; color: var(--text-main);">${c.Nombre_profesión}</td>
                            <td style="padding: 10px; border: 1px solid var(--border-color); color: var(--text-main);">${c.Area || 'N/A'}</td>
                            <td style="padding: 10px; border: 1px solid var(--border-color);">
                                <span style="padding: 4px 10px; border-radius: 12px; font-size: 0.8em; font-weight: 700; 
                                    background: ${c.Estado === 'Activo' ? 'var(--success-color)' : 'var(--error-color)'}; color: white;">
                                    ${c.Estado || 'Activo'}
                                </span>
                            </td>
                            <td style="padding: 10px; border: 1px solid var(--border-color);">
                                <button class="btn-edit-cargo primary small" data-id="${c.Id_Cargo}">Editar</button>
                                <button class="btn-toggle-cargo secondary small" data-id="${c.Id_Cargo}" data-status="${c.Estado}">
                                    ${c.Estado === 'Activo' ? 'Desactivar' : 'Activar'}
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // --- Módulo: Gestión de Cargos ---
    async function renderCargosModule() {
        contentDetails.innerHTML = '<div class="loader">Cargando cargos...</div>';

        try {
            const data = await apiFetch('/cargos');
            const cargos = data.cargos || [];

            contentDetails.innerHTML = `
                <div class="cargos-module">
                    <div class="content-box">
                        <h4 style="margin-top: 0; color: var(--text-main); border-bottom: 2px solid var(--primary); padding-bottom: 10px;">Gestión de Cargos y Áreas</h4>
                        
                        <div id="cargos-list" style="margin-top:20px;">
                            ${renderCargosTableHTML(cargos)}
                        </div>
 
                        <div style="margin-top:25px; text-align:center; padding-top:20px; border-top:1px solid var(--border-color);">
                            <button id="add-cargo-btn" class="primary">➕ Nuevo Cargo</button>
                        </div>
                        
                        <div id="cargo-form-container" style="display:none; background: var(--card-bg); padding:25px; border-radius:12px; margin-top:25px; border:1px solid var(--border-color); box-shadow:0 8px 30px rgba(0,0,0,0.1);">
                            <h5 id="cargo-form-title" style="margin-top:0; color: var(--text-main); border-bottom: 1px solid var(--border-color); padding-bottom:10px; margin-bottom:20px;">Configurar Cargo</h5>
                            <form id="cargo-form">
                                <input type="hidden" id="car-id">
                                <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                                    <div>
                                        <label style="display:block; font-weight:600; margin-bottom:6px; color: var(--text-main);">Nombre del Cargo</label>
                                        <input type="text" id="car-nombre" required style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                    </div>
                                    <div>
                                        <label style="display:block; font-weight:600; margin-bottom:6px; color: var(--text-main);">Área Administrativa</label>
                                        <input type="text" id="car-area" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                    </div>
                                </div>
                                <div style="margin-top:20px; display:flex; gap:10px; justify-content: flex-end;">
                                    <button type="button" id="cancel-cargo-btn" class="secondary">Cancelar</button>
                                    <button type="submit" class="primary" style="min-width:120px;">Guardar Cargo</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;

            setupCargoListeners(cargos);
        } catch (e) { 
            contentDetails.innerHTML = `<div class="error">Error: ${e.message}</div>`; 
        }
    }

    function setupCargoListeners(cargos) {
        const addBtn = document.getElementById('add-cargo-btn');
        const formContainer = document.getElementById('cargo-form-container');
        const form = document.getElementById('cargo-form');

        if (addBtn) {
            addBtn.addEventListener('click', () => {
                const isVisible = formContainer.style.display === 'block';
                formContainer.style.display = isVisible ? 'none' : 'block';
                if (!isVisible) formContainer.scrollIntoView({ behavior: 'smooth' });
                form.reset();
                document.getElementById('car-id').value = '';
                document.getElementById('cargo-form-title').innerText = 'Registrar Nuevo Cargo';
            });
        }

        const cancelBtn = document.getElementById('cancel-cargo-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => { formContainer.style.display = 'none'; });
        }

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const id = document.getElementById('car-id').value;
                const payload = {
                    Nombre_profesión: document.getElementById('car-nombre').value,
                    Area: document.getElementById('car-area').value
                };
                try {
                    const endpoint = id ? `/cargos/${id}` : '/cargos';
                    await apiFetch(endpoint, { method: 'POST', body: JSON.stringify(payload) });
                    showSuccess(id ? 'Cargo actualizado' : 'Cargo registrado');
                    renderCargosModule();
                } catch (e) { showError(e.message); }
            });
        }

        document.querySelectorAll('.btn-edit-cargo').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const c = cargos.find(x => String(x.Id_Cargo) === String(id));
                if (c) {
                    document.getElementById('car-id').value = c.Id_Cargo;
                    document.getElementById('car-nombre').value = c.Nombre_profesión;
                    document.getElementById('car-area').value = c.Area || '';
                    document.getElementById('cargo-form-title').innerText = 'Editar Cargo';
                    formContainer.style.display = 'block';
                    formContainer.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        document.querySelectorAll('.btn-toggle-cargo').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const status = btn.dataset.status;
                const action = status === 'Activo' ? 'desactivar' : 'activar';

                const confirmed = await showConfirm(`¿Desea ${action} este cargo?`);
                if (!confirmed) return;

                try {
                    await apiFetch(`/cargos/${id}/toggle`, { method: 'POST' });
                    showSuccess(`Cargo ${action}ado correctamente`);
                    renderCargosModule();
                } catch (e) { showError(e.message); }
            });
        });
    }

    // Exponer globalmente
    window.renderAdminModuleV2 = renderAdminModuleV2;

})();