<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect('/login');
        }

        /**
         * MAPEO REAL SEGÚN TU BASE DE DATOS LUFRA200
         * ID 1 = administrativo
         * ID 2 = trabajador
         * ID 3 = superusuario
         */
        $rolesMap = [
            1 => 'administrativo',
            2 => 'trabajador',
            3 => 'superusuario',
        ];

        // Obtenemos el nombre del rol según el Id_rol del usuario
        $userRoleName = $rolesMap[$user->Id_rol] ?? 'invitado';

        // Convertimos los roles permitidos a minúsculas para comparar
        $allowedRoles = array_map('strtolower', $roles);

        if (!in_array($userRoleName, $allowedRoles)) {
            // Si el rol no coincide, lanzamos el 403
            abort(403, 'No tienes permiso para acceder a este módulo.');
        }

        return $next($request);
    }
}