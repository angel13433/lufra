@extends('layouts.app')

@section('title', 'Centro de Seguridad - Lufra 2020')

@section('content')
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<style>
    body {
        background-color: var(--bg-color, #f4f6f9);
        margin: 0;
        padding: 0;
        display: flex;
    }

    /* BARRA LATERAL */
    .sidebar {
        width: 280px;
        background: linear-gradient(180deg, var(--sidebar-bg, #111827) 0%, #10a87a 100%);
        color: #ffffff;
        display: flex;
        flex-direction: column;
        box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
        position: fixed;
        height: 100vh;
        overflow-y: auto;
        z-index: 100;
    }

    .sidebar h3 {
        text-align: center;
        font-size: 1.25rem;
        font-weight: 700;
        letter-spacing: 0.5px;
        margin: 0;
        padding: 30px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0,0,0,0.15);
    }

    #user-info-panel {
        padding: 25px 20px;
        text-align: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    #user-info-panel p {
        font-size: 1.1rem;
        font-weight: 600;
        margin: 0 0 12px 0;
        background: linear-gradient(90deg, #e0e7ff, #ffffff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .btn-back-sidebar {
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #ffffff;
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        text-decoration: none;
        box-sizing: border-box;
    }

    .btn-back-sidebar:hover {
        background-color: rgba(255, 255, 255, 0.2);
        box-shadow: 0 4px 12px rgba(255, 255, 255, 0.15);
        transform: translateY(-1px);
    }

    /* CONTENIDO PRINCIPAL DISTRIBUIDO EN DOS COLUMNAS */
    .main-security-content {
        flex: 1;
        margin-left: 280px;
        padding: 40px;
        display: flex;
        flex-direction: column;
        gap: 25px;
        box-sizing: border-box;
        min-height: 100vh;
    }

    .security-header-area {
        display: flex;
        align-items: center;
        gap: 15px;
        border-bottom: 2px solid #e5e7eb;
        padding-bottom: 15px;
    }

    .security-header-area h1 {
        margin: 0;
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--text-main, #1f2937);
    }

    .security-grid {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: 30px;
        align-items: start;
    }

    /* COLUMNA IZQUIERDA: TARJETA DEL FORMULARIO */
    .setup-card-modern {
        background-color: var(--card-bg, #ffffff);
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02), 0 1px 3px rgba(0,0,0,0.05);
        padding: 35px;
        border: 1px solid rgba(229, 231, 235, 0.7);
    }

    .form-group-modern {
        margin-bottom: 24px;
    }

    .form-group-modern label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        font-size: 0.95rem;
        margin-bottom: 10px;
        color: var(--text-main, #374151);
    }

    .input-wrapper-icon {
        position: relative;
        display: flex;
        align-items: center;
    }

    .input-wrapper-icon i.field-icon {
        position: absolute;
        left: 15px;
        color: #9ca3af;
        font-size: 1rem;
    }

    .form-control-modern {
        width: 100%;
        padding: 14px 16px 14px 45px;
        border: 2px solid #e5e7eb;
        border-radius: 10px;
        font-size: 0.95rem;
        font-family: 'Inter', sans-serif;
        outline: none;
        box-sizing: border-box;
        transition: all 0.2s ease;
        background-color: #ffffff;
        color: #111827;
    }

    .form-control-modern:focus {
        border-color: #10a87a;
        box-shadow: 0 0 0 4px rgba(16, 168, 122, 0.1);
    }

    /* Ojo de visibilidad interactivo */
    .toggle-password-btn {
        position: absolute;
        right: 15px;
        background: none;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        padding: 0;
        font-size: 1rem;
    }
    .toggle-password-btn:hover {
        color: #10a87a;
    }

    .btn-save-modern {
        width: 100%;
        padding: 15px;
        background: #00cc18;
        color: white;
        border: none;
        border-radius: 10px;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(0, 204, 24, 0.3);
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    .btn-save-modern:hover {
        background: #00a814;
        box-shadow: 0 6px 20px rgba(0, 204, 24, 0.4);
        transform: translateY(-2px);
    }

    /* COLUMNA DERECHA: TARJETAS COMPLEMENTARIAS */
    .info-side-panel {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .status-card {
        background: #ffffff;
        border-radius: 16px;
        padding: 25px;
        border: 1px solid rgba(229, 231, 235, 0.7);
        display: flex;
        align-items: center;
        gap: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
    }

    .status-icon-box {
        width: 55px;
        height: 55px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
    }

    /* Clases de estado dinámicas basadas en si tiene pregunta */
    .status-protected { background-color: #e8f5e9; color: #1b5e20; border: 1px solid #c8e6c9; }
    .status-warning { background-color: #fff3e0; color: #e65100; border: 1px solid #ffe0b2; }

    .status-info h5 { margin: 0 0 5px 0; font-size: 1.05rem; font-weight: 700; }
    .status-info p { margin: 0; font-size: 0.88rem; color: #6b7280; }

    .utility-card {
        background: #ffffff;
        border-radius: 16px;
        padding: 25px;
        border: 1px solid rgba(229, 231, 235, 0.7);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
    }

    .utility-card h4 {
        margin: 0 0 15px 0;
        font-size: 1.1rem;
        font-weight: 700;
        color: #1f2937;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .tips-list {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .tips-list li {
        font-size: 0.88rem;
        color: #4b5563;
        margin-bottom: 12px;
        display: flex;
        align-items: flex-start;
        gap: 10px;
        line-height: 1.4;
    }

    .tips-list li i {
        color: #10a87a;
        margin-top: 3px;
        font-size: 0.85rem;
    }

    /* Alertas de Mensajes */
    .custom-alert {
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 22px;
        font-size: 0.9rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .alert-info { background-color: #eff6ff; color: #1e40af; border-left: 5px solid #3b82f6; }
    .alert-success { background-color: #f0fdf4; color: #166534; border-left: 5px solid #22c55e; }
</style>

<div class="sidebar">
    <h3>Sistema de Nóminas</h3>
    <div id="user-info-panel">
        <p id="username-display">{{ auth()->user()->name }}</p>
        
        @if(auth()->user()->Id_rol == 3)
            <a href="/superusuario" class="btn-back-sidebar">
                <i class="fas fa-arrow-left"></i> Volver al Panel
            </a>
        @elseif(auth()->user()->Id_rol == 1)
            <a href="/administrativo" class="btn-back-sidebar">
                <i class="fas fa-arrow-left"></i> Volver al Panel
            </a>
        @else
            <a href="/trabajador" class="btn-back-sidebar">
                <i class="fas fa-arrow-left"></i> Volver al Panel
            </a>
        @endif
    </div>
    
    <div style="margin-top: auto; padding: 20px; text-align: center; padding-bottom: 25px;">
        <img src="{{ asset('img/logo-exacto.png') }}" alt="Logo Lufra" style="width: 230px; max-width: 100%; height: auto; border-radius: 8px;" />
    </div>
</div>

<div class="main-security-content">
    
    <div class="security-header-area">
        <div style="background: #10a87a; width: 8px; height: 30px; border-radius: 4px;"></div>
        <h1>Centro de Seguridad Avanzada</h1>
    </div>

    <div class="security-grid">
        
        <div class="setup-card-modern">
            
            @if(session('info'))
                <div class="custom-alert alert-info">
                    <i class="fas fa-info-circle"></i> {{ session('info') }}
                </div>
            @endif

            @if(session('success'))
                <div class="custom-alert alert-success">
                    <i class="fas fa-check-circle"></i> {{ session('success') }}
                </div>
            @endif

            <form id="setupQuestionsForm" action="{{ route('seguridad.guardar-preguntas') }}" method="POST">
                @csrf
                
                <div class="form-group-modern">
                    <label for="pregunta1">
                        <i class="fas fa-question-circle" style="color: #10a87a;"></i>
                        Selecciona tu Pregunta Secreta
                    </label>
                    <div class="input-wrapper-icon">
                        <i class="fas fa-list field-icon"></i>
                        <select name="pregunta_id" id="pregunta1" class="form-control-modern" required style="padding-left: 45px;">
                            <option value="" disabled {{ !isset($preguntaActual) ? 'selected' : '' }}>Elige una pregunta clave...</option>
                            @foreach($preguntas as $pregunta)
                                <option value="{{ $pregunta->id }}" 
                                    {{ (isset($preguntaActual) && $preguntaActual->pregunta_id == $pregunta->id) ? 'selected' : '' }}>
                                    {{ $pregunta->pregunta }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>

                <div class="form-group-modern">
                    <label for="respuesta1">
                        <i class="fas fa-key" style="color: #10a87a;"></i>
                        Tu Respuesta de Seguridad
                    </label>
                    <div class="input-wrapper-icon">
                        <i class="fas fa-lock field-icon"></i>
                        <input type="password" name="respuesta" id="respuesta1" class="form-control-modern" required 
                            placeholder="{{ isset($preguntaActual) ? 'Escribe una nueva respuesta si deseas cambiarla' : 'Escribe tu respuesta secreta aquí' }}" 
                            autocomplete="off">
                        <button type="button" class="toggle-password-btn" onclick="toggleResponseVisibility()">
                            <i id="eye-icon" class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>

                <button type="submit" class="btn-save-modern">
                    <i class="fas fa-shield-alt"></i>
                    {{ isset($preguntaActual) ? 'ACTUALIZAR PARÁMETROS DE SEGURIDAD' : 'ACTIVAR PROTECCIÓN DE CUENTA' }}
                </button>
            </form>
        </div>

        <div class="info-side-panel">
            
            <div class="status-card">
                @if(isset($preguntaActual))
                    <div class="status-icon-box status-protected">
                        <i class="fas fa-user-shield"></i>
                    </div>
                    <div class="status-info">
                        <h5 style="color: #1b5e20;">Cuenta Protegida</h5>
                        <p>Ya tienes un parámetro de recuperación configurado correctamente.</p>
                    </div>
                @else
                    <div class="status-icon-box status-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="status-info">
                        <h5 style="color: #e65100;">Acceso Vulnerable</h5>
                        <p>Por favor, configura tu pregunta para evitar perder el acceso a tus nóminas.</p>
                    </div>
                @endif
            </div>

            <div class="utility-card">
                <h4><i class="fas fa-lightbulb" style="color: #ffb300;"></i> Consejos Prácticos</h4>
                <ul class="tips-list">
                    <li>
                        <i class="fas fa-shield-halved"></i>
                        <span>Elige una respuesta que sea fácil de recordar para ti, pero imposible de adivinar para otros.</span>
                    </li>
                    <li>
                        <i class="fas fa-shield-halved"></i>
                        <span>El campo distingue entre mayúsculas, minúsculas y acentos al momento de recuperar.</span>
                    </li>
                    <li>
                        <i class="fas fa-shield-halved"></i>
                        <span>Nunca compartas la respuesta secreta de tu ficha de empleado con el resto del personal.</span>
                    </li>
                </ul>
            </div>

            <div class="utility-card" style="background: rgba(249, 250, 251, 0.5);">
                <h4 style="font-size: 0.95rem; color: #6b7280; margin-bottom: 5px;"><i class="fas fa-info-circle"></i> Soporte de Cuenta</h4>
                <p style="margin: 0; font-size: 0.85rem; color: #6b7280; line-height: 1.4;">
                    Si presentas problemas persistentes con tus credenciales de Lufra 2020, comunícate directamente con el departamento administrativo de sistemas.
                </p>
            </div>

        </div>

    </div>
</div>

<script>
    // Función interactiva para ocultar/mostrar la respuesta haciendo clic en el ojo
    function toggleResponseVisibility() {
        const responseInput = document.getElementById('respuesta1');
        const eyeIcon = document.getElementById('eye-icon');
        
        if (responseInput.type === 'password') {
            responseInput.type = 'text';
            eyeIcon.classList.remove('fa-eye');
            eyeIcon.classList.add('fa-eye-slash');
        } else {
            responseInput.type = 'password';
            eyeIcon.classList.remove('fa-eye-slash');
            eyeIcon.classList.add('fa-eye');
        }
    }

    // Mantener consistencia con el Modo Oscuro si está guardado en localStorage
    if(localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
</script>
@endsection