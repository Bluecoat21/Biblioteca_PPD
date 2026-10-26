<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prestamos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ejemplar_id')->constrained('ejemplares')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete(); // Usuario que solicita el préstamo
            $table->foreignId('bibliotecario_id')->constrained('users')->cascadeOnDelete(); // Usuario bibliotecario que registra
            $table->datetime('fecha_prestamo');
            $table->date('fecha_devolucion_esperada');
            $table->datetime('fecha_devolucion_real')->nullable();
            $table->enum('estado', ['activo', 'devuelto', 'atrasado', 'perdido'])->default('activo');
            $table->tinyInteger('renovaciones')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prestamos');
    }
};