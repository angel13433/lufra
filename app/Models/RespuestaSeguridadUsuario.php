<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RespuestaSeguridadUsuario extends Model
{
    use HasFactory;

    protected $table = 'respuestas_seguridad_usuario';

    protected $fillable = [
        'user_id', // Esta es la columna en la tabla de respuestas
        'pregunta_id',
        'respuesta_hash',
    ];

    public function usuario()
    {
        // IMPORTANTE: 'user_id' se conecta con 'id_usuario' de la tabla usuario
        return $this->belongsTo(User::class, 'user_id', 'id_usuario');
    }

    public function pregunta()
    {
        return $this->belongsTo(PreguntaSeguridad::class, 'pregunta_id');
    }
}