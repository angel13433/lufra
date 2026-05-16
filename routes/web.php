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

/**
 * RUTAS PROTEGIDAS POR AUTENTICACIÓN
 */
Route::middleware(['auth', 'verified'])->group(function () {
    // Redirección inteligente según el rol después de loguearse
    Route::get('/redirect-after-login', \App\Http\Controllers\RedirectAfterLoginController::class)->name('redirect.after.login');
    
    // VISTA: Formulario para que el usuario registre o edite sus preguntas secretas
    Route::get('/seguridad/configurar-preguntas', [SeguridadController::class, 'mostrarConfigurarPreguntas'])->name('seguridad.configurar.vista');
    
    // PROCESO: Guarda la pregunta elegida en la base de datos (Autogestión)
    Route::post('/seguridad/guardar-preguntas', [SeguridadController::class, 'guardarPreguntas'])->name('seguridad.guardar-preguntas');

    /**
     * ACCIONES EXCLUSIVAS DEL SUPERUSUARIO (ADMINISTRACIÓN DE SEGURIDAD)
     */
    Route::prefix('admin/seguridad')->group(function () {
        // Forzar cambio de contraseña de un trabajador
        Route::post('/reset-password/{id}', [SeguridadController::class, 'adminResetearPassword'])->name('admin.seguridad.reset');
        
        // Limpiar preguntas de seguridad de un trabajador
        Route::delete('/clear-questions/{id}', [SeguridadController::class, 'adminEliminarPregunta'])->name('admin.seguridad.clear');
    });
});

/**
 * RUTAS DEL MÓDULO DE SEGURIDAD (RECUPERACIÓN PÚBLICA POR PREGUNTAS)
 */
Route::prefix('seguridad')->group(function () {
    // 1. Obtener preguntas tras ingresar el nombre de usuario
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