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
        Schema::create('recurso_autor', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recurso_bibliografico_id')->constrained('recursos_bibliograficos')->cascadeOnDelete();
            $table->foreignId('autor_id')->constrained('autores')->cascadeOnDelete();
            $table->tinyInteger('orden')->default(1);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recurso_autors');
    }
};
