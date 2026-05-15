<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PreguntaSeguridad;

class PreguntasSeguridadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Insertamos las preguntas maestras para el módulo de seguridad.
     */
    public function run(): void
    {
        $preguntas = [
            '¿Cuál es el nombre de tu primera mascota?',
            '¿En qué ciudad se conocieron tus padres?',
            '¿Cuál es el nombre de tu escuela primaria?',
            '¿Cuál es tu color favorito de la infancia?',
            '¿Cuál es el segundo nombre de tu abuela materna?',
            '¿Cómo se llamaba tu primer mejor amigo?',
            '¿Cuál fue el primer modelo de carro que tuviste o manejaste?',
        ];

        foreach ($preguntas as $pregunta) {
            PreguntaSeguridad::updateOrCreate(
                ['pregunta' => $pregunta], // Si ya existe, no la duplica
                ['activa' => true]
            );
        }
    }
}