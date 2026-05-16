<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\PreguntaSeguridad;
use App\Models\RespuestaSeguridadUsuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SeguridadController extends Controller
{
    /**
     * VISTA: Mostrar el formulario para registrar las preguntas de seguridad.
     */
    public function mostrarConfigurarPreguntas()
    {
        // Obtenemos todas las preguntas maestras de la tabla 'preguntas_seguridad'
        $preguntas = DB::table('preguntas_seguridad')->get();

        return view('auth.configurar-preguntas', compact('preguntas'));
    }

    /**
     * PROCESO: Guardar o actualizar la pregunta de seguridad del usuario en la base de datos.
     */
    public function guardarPreguntas(Request $request)
    {
        $request->validate([
            'pregunta_id' => 'required|exists:preguntas_seguridad,id',
            'respuesta' => 'required|string|max:255',
        ]);

        $usuario = Auth::user();

        if (!$usuario) {
            return redirect()->route('login');
        }

        // Limpiamos y encriptamos la respuesta ya que el validador usa Hash::check
        $respuestaTexto = strtolower(trim($request->respuesta));
        $respuestaHash = Hash::make($respuestaTexto);

        // Actualizamos o insertamos el registro vinculándolo con 'Id_Usuario'
        DB::table('respuestas_seguridad_usuario')->updateOrInsert(
            [
                'user_id' => $usuario->Id_Usuario,
                'pregunta_id' => $request->pregunta_id
            ],
            [
                'respuesta_hash' => $respuestaHash,
                'created_at' => now(),
                'updated_at' => now()
            ]
        );

        // Redirigimos al flujo normal para que pase por el filtro de roles
        return redirect()->route('redirect.after.login')
                         ->with('success', '¡Pregunta de seguridad establecida con éxito!');
    }

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

        $respuestaGuardada = RespuestaSeguridadUsuario::where('user_id', $usuario->Id_Usuario)
            ->where('pregunta_id', $request->pregunta_id)
            ->first();

        if (!$respuestaGuardada) {
            return response()->json(['message' => 'Pregunta no válida para este usuario.'], 422);
        }

        if (Hash::check(strtolower(trim($request->respuesta)), $respuestaGuardada->respuesta_hash)) {
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

        $email = Session::get('reset_email');

        if (!$email) {
            return response()->json(['message' => 'Sesión expirada. Por favor, valide su identidad nuevamente.'], 403);
        }

        $usuario = User::where('Correo', $email)->first();

        if ($usuario) {
            $usuario->Contraseña = Hash::make($request->password);
            $usuario->save();

            Session::forget('reset_email');

            return response()->json(['message' => '¡Éxito! Tu contraseña ha sido actualizada.']);
        }

        return response()->json(['message' => 'Error al procesar la solicitud.'], 500);
    }
}