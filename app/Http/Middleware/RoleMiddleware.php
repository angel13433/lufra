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
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json(['error' => 'No autenticado.'], 401);
            }
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

        // =========================================================================
        // EXCEPCIÓN SUPREMA: Si es superusuario, tiene acceso a TODO el sistema
        // =========================================================================
        if ($userRoleName === 'superusuario') {
            return $next($request);
        }

        // Convertimos los roles permitidos a minúsculas para comparar
        $allowedRoles = array_map('strtolower', $roles);

        if (!in_array($userRoleName, $allowedRoles)) {
            // Si la petición viene por AJAX (JS / fetch), respondemos en formato JSON 
            // para que no se rompa el diseño del frontend
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json(['error' => 'No tienes permiso para acceder a este módulo.'], 403);
            }

            // Si es una navegación común y corriente, lanzamos el 403 estándar
            abort(403, 'No tienes permiso para acceder a este módulo.');
        }

        return $next($request);
    }
}