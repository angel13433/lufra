<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\PreguntaSeguridad;
use App\Models\RespuestaSeguridadUsuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;

class SeguridadController extends Controller
{
    /**
     * Paso 1: Buscar al usuario por correo y devolver sus preguntas.
     */
    public function obtenerPreguntas(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:usuario,Correo'
        ]);

        $usuario = User::where('Correo', $request->email)->first();
        
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado.'], 404);
        }

        $preguntas = $usuario->respuestasSeguridad()->with('pregunta')->get();

        if ($preguntas->isEmpty()) {
            return response()->json(['message' => 'El usuario no tiene preguntas configuradas.'], 404);
        }

        return response()->json([
            'preguntas' => $preguntas->map(function ($item) {
                return [
                    'id' => $item->pregunta->id,
                    'pregunta' => $item->pregunta->pregunta
                ];
            })
        ]);
    }

    /**
     * Paso 2: Verificar si la respuesta es correcta.
     */
    public function verificarRespuesta(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:usuario,Correo',
            'pregunta_id' => 'required|exists:preguntas_seguridad,id',
            'respuesta' => 'required|string'
        ]);

        $usuario = User::where('Correo', $request->email)->first();

        // Usamos Id_Usuario con las mayúsculas correctas de tu SQL
        $respuestaGuardada = RespuestaSeguridadUsuario::where('user_id', $usuario->Id_Usuario)
            ->where('pregunta_id', $request->pregunta_id)
            ->first();

        if (!$respuestaGuardada) {
            return response()->json(['message' => 'Pregunta no válida para este usuario.'], 422);
        }

        if (Hash::check(strtolower(trim($request->respuesta)), $respuestaGuardada->respuesta_hash)) {
            // Aseguramos el guardado del email en la sesión
            Session::put('reset_email', $request->email);
            return response()->json(['message' => 'Respuesta correcta. Puede proceder.']);
        }

        return response()->json(['message' => 'La respuesta es incorrecta.'], 401);
    }

    /**
     * Paso 3: Guardar la nueva contraseña en la base de datos.
     */
    public function restablecerPassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Recuperamos el correo de la sesión
        $email = Session::get('reset_email');

        if (!$email) {
            return response()->json(['message' => 'Sesión expirada. Por favor, valide su identidad nuevamente.'], 403);
        }

        $usuario = User::where('Correo', $email)->first();

        if ($usuario) {
            // CORRECCIÓN: En tu tabla 'usuario', la columna es 'Contraseña'
            $usuario->Contraseña = Hash::make($request->password);
            $usuario->save();

            // Limpiamos la sesión de seguridad
            Session::forget('reset_email');

            return response()->json(['message' => '¡Éxito! Tu contraseña ha sido actualizada.']);
        }

        return response()->json(['message' => 'Error al procesar la solicitud.'], 500);
    }
}