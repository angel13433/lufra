<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    // --- CONFIGURACIÓN DE BASE DE DATOS PERSONALIZADA ---
    protected $table = 'usuario'; 
    protected $primaryKey = 'Id_Usuario'; 

    /**
     * DESACTIVAR TIMESTAMPS
     * Se desactiva porque la tabla 'usuario' no tiene las columnas 
     * created_at y updated_at, lo que causaba el error SQL 1054.
     */
    public $timestamps = false; 
    // ----------------------------------------------------

    protected $fillable = [
        'Nombre_usuario', 
        'Correo',         
        'Contraseña',     
        'Id_rol',
        'Id_Trabajador',
        'Estado',
    ];

    public function trabajador()
    {
        return $this->belongsTo(Trabajador::class, 'Id_Trabajador', 'Id_Trabajador');
    }

    protected $hidden = [
        'Contraseña',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'Contraseña' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function getAuthPassword()
    {
        return $this->Contraseña;
    }

    public function roleModel()
    {
        return $this->belongsTo(Role::class, 'Id_rol', 'Id_rol');
    }

    /**
     * RELACIÓN DEL MÓDULO DE SEGURIDAD
     */
    public function respuestasSeguridad()
    {
        return $this->hasMany(RespuestaSeguridadUsuario::class, 'user_id', 'Id_Usuario');
    }
}