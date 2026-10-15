<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('multas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            // Sin FK: 'prestamos' es del Módulo 2. La FK se agrega al integrar.
            $table->unsignedBigInteger('prestamo_id')->nullable();
            $table->decimal('monto', 10, 2);
            $table->string('motivo');
            $table->unsignedInteger('dias_atraso')->nullable();
            $table->enum('estado', ['pendiente', 'pagada', 'condonada'])->default('pendiente');
            $table->dateTime('fecha_generacion');
            $table->dateTime('fecha_pago')->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('multas');
    }
};