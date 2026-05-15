<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PreguntaSeguridad extends Model
{
    use HasFactory;

    // Buena práctica: Especificamos el nombre real de la tabla en la BD
    protected $table = 'preguntas_seguridad';

    // Seguridad: Definimos qué campos se pueden llenar masivamente
    protected $fillable = [
        'pregunta',
        'activa',
    ];

    /**
     * Relación: Una pregunta puede ser elegida por muchos usuarios.
     */
    public function respuestas()
    {
        return $this->hasMany(RespuestaSeguridadUsuario::class, 'pregunta_id');
    }
}