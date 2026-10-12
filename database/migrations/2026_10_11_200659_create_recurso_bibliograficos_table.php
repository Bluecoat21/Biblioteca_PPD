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
        Schema::create('recursos_bibliograficos', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('isbn')->unique()->nullable();
            $table->string('issn')->unique()->nullable();
            $table->year('anio_publicacion')->nullable();
            $table->string('idioma')->nullable();
            $table->integer('numero_paginas')->nullable();
            $table->text('sinopsis')->nullable();
            $table->enum('tipo', ['libro', 'revista', 'tesis', 'digital'])->default('libro');
            $table->foreignId('editorial_id')->constrained('editoriales')->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recurso_bibliograficos');
    }
};
