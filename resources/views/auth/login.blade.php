@extends('layouts.app')

@section('title', 'Iniciar Sesión')

@section('content')

<button id="theme-toggle" class="theme-btn" aria-label="Cambiar tema">
    <svg id="moon-icon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
    <svg id="sun-icon" viewBox="0 0 24 24" style="display:none;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
</button>

<a href="/" class="btn primary" style="position: absolute; top: 10px; left: 10px; z-index: 10; padding: 4px 8px; font-size: 0.8em; display: inline-block; width: auto;">Regresar</a>

<main class="login-wrapper" role="main">
    <div class="login-card-container">
        
        <div class="bg-slant"></div>

        <aside class="hero" aria-hidden="false" role="img" aria-label="Branding area">
            <div class="brand-content">
                <h1 class="brand-title">LUFRA2020</h1>
                <p class="brand-subtitle">SISTEMA PARA EL CONTROL DE NOMINAS</p>
                <img src="{{ asset('img/logo-exacto.png') }}" alt="Logo Lufra" style="max-width: 330px; width: 100%; margin-top: 25px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            </div>
        </aside>

        <div class="form-column">
            
            <form id="loginForm" class="form" novalidate>
                @if(session('logout_msg'))
                    <div style="background-color: rgba(239, 68, 68, 0.2); color: #fca5a5; padding: 10px; border-radius: 5px; margin-bottom: 20px; text-align: center; border: 1px solid rgba(239, 68, 68, 0.3); font-size: 0.9em;">
                        {{ session('logout_msg') }}
                    </div>
                @endif
                
                <div class="field">
                    <label for="username">Nombre de usuario</label>
                    <div class="input-row">
                        <input type="text" id="username" name="username" placeholder="Introduce tu nombre de usuario" required autocomplete="username" />
                    </div>
                </div>
                
                <div class="field">
                    <label for="password">Contraseña</label>
                    <div class="input-row">
                        <input type="password" id="password" name="password" placeholder="Introduce tu contraseña" required autocomplete="current-password" />
                        <button type="button" class="toggle-pass" aria-label="Mostrar contraseña">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                    </div>
                </div>
                
                <div class="form-options">
                    <label class="checkbox-container">
                        <input type="checkbox" id="remember" name="remember">
                        <span class="checkmark"></span>
                        Recuérdame
                    </label>
                    <a href="javascript:void(0)" id="show-recovery" class="forgot-link">Recuperar contraseña</a>
                </div>

                <div class="actions">
                    <button class="btn primary" type="submit">
                        <span class="btn-text">INICIAR SESIÓN</span>
                        <span class="spinner" aria-hidden="true"></span>
                    </button>
                </div>
            </form>

            <div id="recoverySection" class="form" style="display: none;">
                <h2 style="color: var(--text-color); margin-bottom: 10px; font-size: 1.5em;">Recuperar Acceso</h2>
                <p style="color: var(--text-color); opacity: 0.8; margin-bottom: 20px; font-size: 0.9em;">Sigue los pasos para verificar tu identidad.</p>

                <div id="step-email" class="field">
                    <label for="recovery-email">Correo electrónico</label>
                    <div class="input-row">
                        <input type="email" id="recovery-email" placeholder="Introduce tu correo registrado">
                    </div>
                </div>

                <div id="step-question" class="field" style="display: none; margin-top: 20px;">
                    <label id="display-question" style="font-weight: bold; color: var(--primary-color); display: block; margin-bottom: 10px;"></label>
                    <div class="input-row">
                        <input type="text" id="recovery-answer" placeholder="Tu respuesta">
                    </div>
                </div>

                <div class="actions" style="margin-top: 25px;">
                    <button id="btn-recovery-main" class="btn primary" type="button">
                        <span class="btn-text">VERIFICAR CORREO</span>
                    </button>
                    <button id="btn-cancel-recovery" class="btn" type="button" style="background: transparent; color: var(--text-color); margin-top: 10px; border: 1px solid rgba(255,255,255,0.1);">
                        CANCELAR
                    </button>
                </div>
            </div>

            <div id="message" role="status" aria-live="polite"></div>
        </div>
    </div>
</main>

<link rel="stylesheet" href="{{ asset('css/styleLogin.css') }}">
<script src="{{ asset('js/ScriptLogin.js') }}" defer></script>

<script>
    // Tu lógica de cambio de tema se mantiene intacta aquí abajo...
    document.addEventListener('DOMContentLoaded', () => {
        const themeBtn = document.getElementById('theme-toggle');
        const moonIcon = document.getElementById('moon-icon');
        const sunIcon = document.getElementById('sun-icon');
        
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        }

        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                moonIcon.style.display = 'none';
                sunIcon.style.display = 'block';
            } else {
                localStorage.setItem('theme', 'light');
                moonIcon.style.display = 'block';
                sunIcon.style.display = 'none';
            }
        });
    });
</script>
@endsection