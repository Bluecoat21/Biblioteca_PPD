<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ejemplares', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recurso_bibliografico_id')->constrained('recursos_bibliograficos')->cascadeOnDelete();
            $table->string('codigo_barras')->unique();
            $table->string('signatura_topografica')->nullable();
            $table->enum('estado', ['disponible', 'prestado', 'mantenimiento', 'baja'])->default('disponible');
            $table->enum('tipo_adquisicion', ['compra', 'donacion', 'intercambio'])->default('compra');
            // Nota: Si el módulo de ubicaciones lo hace otro compañero, puedes dejarubicacion_id como unsignedBigInteger nullable temporalmente:
            // En tu migración de ejemplares:
            $table->foreignId('ubicacion_id')->nullable()->constrained('ubicaciones')->nullOnDelete();
            $table->date('fecha_adquisicion')->nullable();
            $table->decimal('valor_adquisicion', 10, 2)->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ejemplars');
    }
};
