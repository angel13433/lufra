@extends('layouts.app')

@section('title', 'Lista de Usuarios')

@section('content')
<div class="container mt-4" style="font-family: 'Segoe UI', sans-serif;">
    <h1 class="mb-4" style="color: #2d3436; font-weight: 700;">Usuarios Registrados</h1>
    
    <table class="table table-striped table-hover align-middle" border="1" cellpadding="6" style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
        <thead style="background-color: #2d3436; color: white; text-align: left;">
            <tr>
                <th style="padding: 12px;">ID</th>
                <th style="padding: 12px;">Nombre</th>
                <th style="padding: 12px;">Username</th>
                <th style="padding: 12px;">Email</th>
                <th style="padding: 12px;">Rol</th>
                <th style="padding: 12px; text-align: center;">Acciones</th>
            </tr>
        </thead>
        <tbody>
            @foreach($users as $user)
            <tr>
                <td style="padding: 12px;">{{ $user->Id_Usuario ?? $user->id }}</td>
                <td style="padding: 12px; font-weight: 500;">{{ $user->Nombre ?? $user->name }}</td>
                <td style="padding: 12px;">{{ $user->Nombre_usuario ?? $user->username ?? '-' }}</td>
                <td style="padding: 12px;">{{ $user->Correo ?? $user->email }}</td>
                <td style="padding: 12px;"><span class="badge bg-secondary">{{ $user->role ?? $user->Id_rol }}</span></td>
                <td style="padding: 12px; text-align: center;">
                    <button type="button" class="btn btn-sm btn-warning btn-security-modal" 
                            data-id="{{ $user->Id_Usuario ?? $user->id }}" 
                            data-name="{{ $user->Nombre ?? $user->name }}"
                            style="background-color: #f1c40f; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-weight: bold;"
                            title="Gestionar Seguridad">
                        🔑 Seguridad
                    </button>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>

<div class="modal fade" id="securityAdminModal" tabindex="-1" aria-labelledby="securityModalLabel" aria-hidden="true" style="display: none; position: fixed; z-index: 1050; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; outline: 0; background: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-dialog-centered" style="max-width: 450px; margin: 1.75rem auto; display: flex; align-items: center; min-height: calc(100% - 3.5rem);">
        <div class="modal-content" style="background: white; border-radius: 15px; padding: 25px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.15); border: none;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h5 class="modal-title" id="securityModalLabel" style="font-size: 1.25rem; font-weight: 700; color: #2d3436;">Seguridad del Trabajador</h5>
                <button type="button" class="btn-close close-modal-btn" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
            </div>
            <div class="modal-body">
                <p style="color: #636e72; font-size: 0.95rem;">Gestionando accesos para: <strong id="modal-worker-name" style="color: #2d3436;">-</strong></p>
                
                <div id="modal-alert" style="display: none; padding: 10px; border-radius: 6px; font-size: 0.85rem; margin-bottom: 15px; text-align: center;"></div>

                <div style="border: 1px solid #e1e8ef; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                    <label style="display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 8px; color: #2d3436;">Nueva Contraseña Temporal</label>
                    <div style="display: flex; gap: 8px;">
                        <input type="text" id="admin-new-password" class="form-control" placeholder="Ej: Lufra2026*" style="flex: 1; padding: 8px 12px; border: 2px solid #e1e8ef; border-radius: 8px; outline: none;">
                        <button type="button" id="btn-submit-password" class="btn" style="background: #00cc18; color: white; border: none; padding: 8px 15px; border-radius: 8px; font-weight: 600; cursor: pointer;">Aplicar</button>
                    </div>
                </div>

                <div style="border: 1px solid rgba(231, 76, 60, 0.2); background-color: rgba(231, 76, 60, 0.02); padding: 15px; border-radius: 10px;">
                    <label style="display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 4px; color: #c0392b;">Preguntas de Seguridad</label>
                    <p style="font-size: 0.8rem; color: #7f8c8d; margin-bottom: 10px;">Elimina la pregunta actual para obligar al empleado a configurar una nueva en su próximo ingreso.</p>
                    <button type="button" id="btn-clear-questions" class="btn" style="background: #e74c3c; color: white; border: none; width: 100%; padding: 10px; border-radius: 8px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 10px rgba(231,76,60,0.2);">Blanquear Parámetros</button>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('securityAdminModal');
    const modalName = document.getElementById('modal-worker-name');
    const modalAlert = document.getElementById('modal-alert');
    const passwordInput = document.getElementById('admin-new-password');
    
    const btnSubmitPassword = document.getElementById('btn-submit-password');
    const btnClearQuestions = document.getElementById('btn-clear-questions');
    
    let activeUserId = null;
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    // Función para mostrar alertas dentro del modal
    function showModalAlert(text, isSuccess = false) {
        modalAlert.textContent = text;
        modalAlert.style.display = 'block';
        if (isSuccess) {
            modalAlert.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
            modalAlert.style.color = '#10b981';
            modalAlert.style.border = '1px solid rgba(16, 185, 129, 0.3)';
        } else {
            modalAlert.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
            modalAlert.style.color = '#ef4444';
            modalAlert.style.border = '1px solid rgba(239, 68, 68, 0.3)';
        }
    }

    // Abrir Modal de forma limpia al presionar la Llave
    document.querySelectorAll('.btn-security-modal').forEach(button => {
        button.addEventListener('click', () => {
            activeUserId = button.getAttribute('data-id');
            modalName.textContent = button.getAttribute('data-name');
            passwordInput.value = '';
            modalAlert.style.display = 'none';
            modal.style.display = 'block';
        });
    });

    // Cerrar el Modal
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    });

    // Petición AJAX 1: Restablecer Contraseña por Administrador
    btnSubmitPassword.addEventListener('click', async () => {
        const passValue = passwordInput.value.trim();
        if (passValue.length < 8) {
            return showModalAlert('La contraseña debe tener al menos 8 caracteres.');
        }

        btnSubmitPassword.disabled = true;
        btnSubmitPassword.textContent = '...';

        try {
            const response = await fetch(`/admin/seguridad/reset-password/${activeUserId}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify({ password: passValue })
            });

            const data = await response.json();
            btnSubmitPassword.disabled = false;
            btnSubmitPassword.textContent = 'Aplicar';

            if (response.ok) {
                showModalAlert('¡Contraseña actualizada con éxito!', true);
                passwordInput.value = '';
            } else {
                showModalAlert(data.message || 'Error al procesar la actualización.');
            }
        } catch (error) {
            btnSubmitPassword.disabled = false;
            btnSubmitPassword.textContent = 'Aplicar';
            showModalAlert('Error de conexión con el servidor.');
        }
    });

    // Petición AJAX 2: Blanquear Preguntas de Seguridad
    btnClearQuestions.addEventListener('click', async () => {
        if (!confirm('¿Estás seguro de que deseas eliminar las preguntas de seguridad de este trabajador?')) return;

        btnClearQuestions.disabled = true;
        btnClearQuestions.textContent = 'Blanqueando...';

        try {
            const response = await fetch(`/admin/seguridad/clear-questions/${activeUserId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                }
            });

            const data = await response.json();
            btnClearQuestions.disabled = false;
            btnClearQuestions.textContent = 'Blanquean Parámetros';

            if (response.ok) {
                showModalAlert('¡Parámetros de seguridad blanqueados! El usuario deberá reconfigurarlos.', true);
            } else {
                showModalAlert(data.message || 'Error al limpiar las preguntas.');
            }
        } catch (error) {
            btnClearQuestions.disabled = false;
            btnClearQuestions.textContent = 'Blonquear Parámetros';
            showModalAlert('Error de conexión con el servidor.');
        }
    });
});
</script>
@endsection