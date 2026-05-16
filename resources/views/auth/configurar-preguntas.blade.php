@extends('layouts.app')

@section('content')
<style>
    .setup-wrapper {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        font-family: 'Segoe UI', sans-serif;
        padding: 20px;
    }

    .setup-card {
        background: rgba(255, 255, 255, 0.95);
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 500px;
    }

    .setup-card h2 {
        color: #2d3436;
        margin-bottom: 10px;
        text-align: center;
    }

    .setup-card p {
        color: #636e72;
        margin-bottom: 25px;
        text-align: center;
        font-size: 0.95rem;
    }

    .form-group {
        margin-bottom: 22px;
    }

    .form-group label {
        display: block;
        margin-bottom: 8px;
        color: #2d3436;
        font-weight: 600;
        font-size: 0.9rem;
    }

    .form-group select, .form-group input {
        width: 100%;
        padding: 12px 15px;
        border: 2px solid #e1e8ef;
        border-radius: 10px;
        outline: none;
        font-size: 1rem;
        transition: all 0.3s;
        background-color: #fff;
    }

    .form-group select:focus, .form-group input:focus {
        border-color: #00cc18;
    }

    .btn-save {
        width: 100%;
        padding: 14px;
        background: #00cc18;
        color: white;
        border: none;
        border-radius: 10px;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        box-shadow: 0 5px 15px rgba(0, 204, 24, 0.3);
        transition: all 0.3s ease;
        margin-top: 10px;
    }

    .btn-save:hover {
        background: #00a814;
        transform: translateY(-1px);
    }

    .alert-info-custom {
        background-color: #e3f2fd;
        color: #0d47a1;
        padding: 12px;
        border-radius: 10px;
        margin-bottom: 20px;
        font-size: 0.85rem;
        text-align: left;
        border-left: 5px solid #1e88e5;
    }
</style>

<div class="setup-wrapper">
    <div class="setup-card">
        <h2>Configurar Seguridad</h2>
        <p>Establece tus preguntas de seguridad para poder recuperar tu cuenta de forma autónoma si olvidas tu clave.</p>

        @if(session('info'))
            <div class="alert-info-custom">
                <i class="fas fa-info-circle"></i> {{ session('info') }}
            </div>
        @endif

        <form id="setupQuestionsForm" action="{{ route('seguridad.guardar-preguntas') }}" method="POST">
            @csrf
            
            <div class="form-group">
                <label for="pregunta1">Primera Pregunta de Seguridad</label>
                <select name="pregunta_id" id="pregunta1" required>
                    <option value="" disabled selected>Selecciona una pregunta...</option>
                    @foreach($preguntas as $pregunta)
                        <option value="{{ $pregunta->id }}">{{ $pregunta->pregunta }}</option>
                    @endforeach
                </select>
            </div>

            <div class="form-group">
                <label for="respuesta1">Tu Respuesta</label>
                <input type="text" name="respuesta" id="respuesta1" required placeholder="Escribe tu respuesta aquí" autocomplete="off">
            </div>

            <button type="submit" class="btn-save">GUARDAR CONFIGURACIÓN</button>
        </form>
    </div>
</div>
@endsection