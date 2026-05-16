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
     * VISTA: Mostrar el formulario para registrar o editar las preguntas de seguridad.
     */
    public function mostrarConfigurarPreguntas()
    {
        // Obtenemos todas las preguntas maestras de la tabla 'preguntas_seguridad'
        $preguntas = DB::table('preguntas_seguridad')->get();

        // BÚSQUEDA CLAVE: Verificamos si el usuario actual ya posee una pregunta registrada
        $preguntaActual = DB::table('respuestas_seguridad_usuario')
                            ->where('user_id', Auth::user()->Id_Usuario)
                            ->first();

        return view('auth.configurar-preguntas', compact('preguntas', 'preguntaActual'));
    }

    /**
     * PROCESO: Guardar o actualizar la pregunta de seguridad del usuario en la base de datos.
     */
    public function guardarPreguntas(Request $request)
    {
        $request->validate([
            'pregunta_id' => 'required|exists:preguntas_seguridad,id',
            'respuesta' => 'required|string|max:255',
        ], [
            'pregunta_id.required' => 'Debe seleccionar una pregunta de seguridad.',
            'respuesta.required' => 'Debe ingresar una respuesta.'
        ]);

        $usuario = Auth::user();

        if (!$usuario) {
            return redirect()->route('login');
        }

        // Limpiamos y encriptamos la respuesta ya que el validador usa Hash::check
        $respuestaTexto = strtolower(trim($request->respuesta));
        $respuestaHash = Hash::make($respuestaTexto);

        // ARQUITECTURA CORREGIDA: Buscamos únicamente por 'user_id' para evitar duplicar registros.
        // Si ya existe una fila de este usuario, reemplaza la pregunta y la respuesta limpiamente.
        DB::table('respuestas_seguridad_usuario')->updateOrInsert(
            [
                'user_id' => $usuario->Id_Usuario
            ],
            [
                'pregunta_id' => $request->pregunta_id,
                'respuesta_hash' => $respuestaHash,
                'created_at' => now(),
                'updated_at' => now()
            ]
        );

        // Redirigimos de vuelta a la misma pantalla con el aviso de éxito en verde
        return redirect()->back()->with('success', '¡Configuración de seguridad guardada con éxito!');
    }

    /**
     * Paso 1: Buscar al usuario por NOMBRE DE USUARIO y devolver sus preguntas.
     */
    public function obtenerPreguntas(Request $request)
    {
        $request->validate([
            'username' => 'required|string|exists:usuario,Nombre_usuario'
        ], [
            'username.required' => 'Por favor, introduce tu nombre de usuario.',
            'username.exists' => 'El nombre de usuario ingresado no existe en el sistema.'
        ]);

        // Buscamos por la columna 'Nombre_usuario'
        $usuario = User::where('Nombre_usuario', $request->username)->first();
        
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
     * Paso 2: Verificar si la respuesta es correcta buscando por usuario.
     */
    public function verificarRespuesta(Request $request)
    {
        $request->validate([
            'username' => 'required|string|exists:usuario,Nombre_usuario',
            'pregunta_id' => 'required|exists:preguntas_seguridad,id',
            'respuesta' => 'required|string'
        ], [
            'respuesta.required' => 'Debes escribir una respuesta.'
        ]);

        $usuario = User::where('Nombre_usuario', $request->username)->first();

        // Buscamos la respuesta vinculando con el Id_Usuario correcto de tu tabla
        $respuestaGuardada = RespuestaSeguridadUsuario::where('user_id', $usuario->Id_Usuario)
            ->where('pregunta_id', $request->pregunta_id)
            ->first();

        if (!$respuestaGuardada) {
            return response()->json(['message' => 'Pregunta no válida para este usuario.'], 422);
        }

        if (Hash::check(strtolower(trim($request->respuesta)), $respuestaGuardada->respuesta_hash)) {
            // Guardamos el correo en la sesión para el paso final de restablecer
            Session::put('reset_email', $usuario->Correo);
            return response()->json(['message' => 'Respuesta correcta. Puede proceder.']);
        }

        return response()->json(['message' => 'La respuesta es incorrecta.'], 401);
    }

    /**
     * Paso 3: Guardar la nueva contraseña en la base de datos (Recuperación Autónoma).
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

    /* =========================================================================
       SECCIÓN ADMINISTRATIVA: Métodos exclusivos para el SuperUsuario
       ========================================================================= */

    /**
     * ADMINISTRACIÓN: Forzar cambio de contraseña de un trabajador desde el panel.
     */
    public function adminResetearPassword(Request $request, $id)
    {
        // Seguridad preventiva: Verificamos si es SuperUsuario (rol 1)
        if (Auth::user()->Id_rol != 1) {
            return response()->json(['message' => 'Acción no autorizada.'], 403);
        }

        $request->validate([
            'password' => 'required|string|min:8'
        ], [
            'password.required' => 'La nueva contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.'
        ]);

        $usuario = User::where('Id_Usuario', $id)->first();

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado.'], 404);
        }

        $usuario->Contraseña = Hash::make($request->password);
        $usuario->save();

        return response()->json(['message' => 'Contraseña restablecida con éxito por el Administrador.']);
    }

    /**
     * ADMINISTRACIÓN: Limpiar/Eliminar preguntas para obligar al usuario a reconfigurar.
     */
    public function adminEliminarPregunta($id)
    {
        if (Auth::user()->Id_rol != 1) {
            return response()->json(['message' => 'Acción no autorizada.'], 403);
        }

        // Eliminamos el registro de preguntas para limpiar sus parámetros de seguridad
        DB::table('respuestas_seguridad_usuario')->where('user_id', $id)->delete();

        return response()->json(['message' => 'Parámetros de seguridad blanqueados correctamente.']);
    }
}