<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * * Esta tabla almacenará el catálogo maestro de preguntas.
     */
    public function up(): void
    {
        Schema::create('preguntas_seguridad', function (Blueprint $table) {
            $table->id();
            // El texto de la pregunta (ej: ¿Cuál es el nombre de tu primera mascota?)
            $table->string('pregunta')->unique(); 
            
            // Permite activar o desactivar preguntas sin borrarlas (Seguridad lógica)
            $table->boolean('activa')->default(true); 
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('preguntas_seguridad');
    }
};