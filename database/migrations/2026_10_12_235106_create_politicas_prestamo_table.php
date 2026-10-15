<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('politicas_prestamo', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tipo_usuario_id')->constrained('tipos_usuario')->cascadeOnDelete();
            $table->enum('tipo_recurso', ['libro', 'revista', 'tesis', 'digital']);
            $table->tinyInteger('dias_prestamo');
            $table->boolean('permite_renovacion')->default(true);
            $table->tinyInteger('max_renovaciones')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('politicas_prestamo');
    }
};