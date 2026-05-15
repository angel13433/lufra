<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Esta tabla vincula al usuario con sus preguntas y guarda las respuestas cifradas.
     */
    public function up(): void
    {
        Schema::create('respuestas_seguridad_usuario', function (Blueprint $table) {
            $table->id();
            
            // Relación con el usuario: Si el usuario se elimina, sus respuestas también (onDelete cascade)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Relación con la pregunta maestra
            $table->foreignId('pregunta_id')->constrained('preguntas_seguridad');
            
            // La respuesta se guardará como un HASH (como las contraseñas)
            // Usamos text o string largo para que quepa el hash de Bcrypt/Argon2
            $table->string('respuesta_hash'); 

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('respuestas_seguridad_usuario');
    }
};