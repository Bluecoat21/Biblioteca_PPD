<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ubicaciones', function (Blueprint $table) {
            $table->id(); // bigint PK
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->string('edificio')->nullable();
            $table->string('piso')->nullable();
            $table->boolean('activa')->default(true);
            $table->timestamps();
            $table->softDeletes(); // deleted_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ubicaciones');
    }
};