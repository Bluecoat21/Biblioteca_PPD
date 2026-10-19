<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('movimientos_ejemplar', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ejemplar_id')->constrained('ejemplares');
            $table->string('estado_anterior');
            $table->string('estado_nuevo');
            $table->text('motivo')->nullable();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('created_at')->useCurrent(); // Solo created_at según diagrama
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('movimientos_ejemplar');
    }
};