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
        Schema::table('recursos_bibliograficos', function (Blueprint $table) {
            // Campos para soportar repositorio digital y archivos virtuales
            $table->boolean('es_digital')->default(false)->after('tipo');
            $table->string('archivo_url')->nullable()->after('es_digital'); // Ruta del PDF en storage
            $table->string('portada_url')->nullable()->after('archivo_url'); // <-- Añadido
            $table->boolean('permite_descarga')->default(true)->after('portada_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('recursos_bibliograficos', function (Blueprint $table) {
            $table->dropColumn(['es_digital', 'archivo_url', 'portada_url', 'permite_descarga']);
        });
    }
};