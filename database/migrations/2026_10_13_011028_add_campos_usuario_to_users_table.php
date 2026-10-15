<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('documento_identidad')->unique()->after('email');
            $table->foreignId('tipo_usuario_id')->after('documento_identidad')->constrained('tipos_usuario');
            $table->string('telefono')->nullable()->after('tipo_usuario_id');
            $table->enum('estado', ['activo', 'suspendido', 'inactivo'])->default('activo')->after('telefono');
            $table->date('fecha_suspension_hasta')->nullable()->after('estado');
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['tipo_usuario_id']);
            $table->dropUnique(['documento_identidad']);
            $table->dropColumn(['documento_identidad', 'tipo_usuario_id', 'telefono', 'estado', 'fecha_suspension_hasta']);
            $table->dropSoftDeletes();
        });
    }
};