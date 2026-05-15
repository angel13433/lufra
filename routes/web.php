<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\Auth\SeguridadController;

Route::get('/', function () {
    return view('homepage');
})->name('home');

Route::get('/login', function () {
    return view('auth.login');
})->middleware('guest')->name('login');

Route::middleware(['auth', 'verified'])->group(function () {
    // CORREGIDO: Eliminado el doble \App\App\
    Route::get('/redirect-after-login', \App\Http\Controllers\RedirectAfterLoginController::class)->name('redirect.after.login');
});

/**
 * RUTAS DEL MÓDULO DE SEGURIDAD (RECUPERACIÓN POR PREGUNTAS)
 */
Route::prefix('seguridad')->group(function () {
    // 1. Obtener preguntas tras ingresar el correo
    Route::post('/preguntas-desafio', [SeguridadController::class, 'obtenerPreguntas'])->name('seguridad.preguntas');
    
    // 2. Validar la respuesta escrita por el usuario
    Route::post('/verificar-respuesta', [SeguridadController::class, 'verificarRespuesta'])->name('seguridad.verificar');

    // 3. Mostrar el formulario para escribir la nueva clave
    Route::get('/restablecer-clave', function () {
        return view('auth.restablecer-password');
    })->name('seguridad.reset.vista');

    // 4. Procesar el cambio de contraseña (hace el UPDATE en la tabla usuario)
    Route::post('/actualizar-clave', [SeguridadController::class, 'restablecerPassword'])->name('seguridad.update');
});

require __DIR__.'/modules.php';