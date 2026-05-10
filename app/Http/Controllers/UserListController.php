<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserListController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('trabajador');

        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function($b) use ($q) {
                $b->where('name', 'like', "%$q%")
                  ->orWhere('username', 'like', "%$q%")
                  ->orWhere('email', 'like', "%$q%");
            });
        }

        if ($request->filled('rol')) {
            $query->where('role', $request->rol);
        }

        if ($request->filled('estado')) {
            $query->where('Estado', $request->estado);
        }

        $users = $query->get();

        if ($request->ajax() || $request->wantsJson()) {
            return response()->json(['users' => $this->formatUsers($users)]);
        }

        if ($request->has('print')) {
            return view('superusuario.report', compact('users'));
        }

        return view('admin.users', compact('users'));
    }

    public function getUsers()
    {
        $users = User::with('trabajador')->get();
        return response()->json(['users' => $this->formatUsers($users)]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'username' => 'required|string|unique:users,username',
            'password' => 'required|string|min:8',
            'role' => 'required|string',
            'Id_Trabajador' => 'nullable|exists:trabajador,Id_Trabajador',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'username' => $validated['username'],
            'password' => bcrypt($validated['password']),
            'role' => $validated['role'],
            'Id_Trabajador' => $validated['Id_Trabajador'] ?? null,
            'Estado' => 'Activo',
        ]);

        return response()->json(['message' => 'Usuario creado exitosamente', 'user' => $user]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'username' => 'required|string|unique:users,username,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'required|string',
            'Id_Trabajador' => 'nullable|exists:trabajador,Id_Trabajador',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->username = $validated['username'];
        if ($request->filled('password')) {
            $user->password = bcrypt($validated['password']);
        }
        $user->role = $validated['role'];
        $user->Id_Trabajador = $validated['Id_Trabajador'] ?? null;
        $user->save();

        return response()->json(['message' => 'Usuario actualizado exitosamente']);
    }

    public function activate($id)
    {
        $user = User::findOrFail($id);
        $user->Estado = 'Activo';
        $user->save();
        return response()->json(['message' => 'Usuario activado']);
    }

    public function deactivate($id)
    {
        $user = User::findOrFail($id);
        // Don't deactivate the current user or superadmins for safety? 
        // For now, follow the requirement
        $user->Estado = 'Inactivo';
        $user->save();
        return response()->json(['message' => 'Usuario desactivado']);
    }

    public function createDefault()
    {
        // For security, only allow if no superuser exists (or just follow the pattern)
        $hasSu = User::where('role', 'SuperUsuario')->exists();
        if ($hasSu) {
            return response()->json(['message' => 'Ya existe un SuperUsuario', 'username' => User::where('role', 'SuperUsuario')->first()->username]);
        }

        $tempPass = 'Admin123*'; // Example temp pass
        $user = User::create([
            'name' => 'Super Administrador',
            'email' => 'admin@lufra2020.com',
            'username' => 'superadmin',
            'password' => bcrypt($tempPass),
            'role' => 'SuperUsuario',
            'Estado' => 'Activo',
        ]);

        return response()->json(['message' => 'SuperUsuario creado', 'username' => 'superadmin', 'password' => $tempPass]);
    }

    private function formatUsers($users)
    {
        return $users->map(function($user) {
            return [
                'Id_Usuario' => $user->id,
                'Nombre_usuario' => $user->username ?? $user->name,
                'raw_username' => $user->username,
                'Nombre_completo' => $user->name,
                'Correo' => $user->email,
                'Nombre_rol' => $user->role,
                'Estado' => $user->Estado ?? 'Activo',
                'Id_Trabajador' => $user->Id_Trabajador,
                'Trabajador_Nombre' => $user->trabajador ? ($user->trabajador->Nombres . ' ' . $user->trabajador->Apellidos) : null,
            ];
        });
    }
}
