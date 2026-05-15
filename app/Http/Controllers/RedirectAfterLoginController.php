<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectAfterLoginController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect('/');
        }

        /**
         * REDIRECCIÓN SINCRONIZADA CON LA BASE DE DATOS LUFRA200
         * ID 1 = Administrativo
         * ID 2 = Trabajador
         * ID 3 = SuperUsuario
         */
        switch ($user->Id_rol) {
            case 3: // ID 3 de tu tabla 'roles' -> SuperUsuario
                return redirect()->route('superusuario.dashboard');
            
            case 1: // ID 1 de tu tabla 'roles' -> Administrativo
                return redirect()->route('administrativo.dashboard');

            case 2: // ID 2 de tu tabla 'roles' -> Trabajador
            default:
                return redirect()->route('trabajador.dashboard');
        }
    }
}