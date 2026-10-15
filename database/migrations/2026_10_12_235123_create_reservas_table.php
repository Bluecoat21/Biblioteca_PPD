<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recurso_bibliografico_id')->constrained('recursos_bibliograficos')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->datetime('fecha_reserva');
            $table->datetime('fecha_expiracion');
            $table->enum('estado', ['pendiente', 'completada', 'cancelada', 'expirada'])->default('pendiente');
            $table->integer('posicion_cola')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservas');
    }
};