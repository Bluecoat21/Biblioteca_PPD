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
            $table->string('codigo_estudiante')->unique()->after('documento_identidad'); // <-- NUEVO CAMPO AÑADIDO
            $table->foreignId('tipo_usuario_id')->after('codigo_estudiante')->constrained('tipos_usuario');
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
            $table->dropUnique(['codigo_estudiante']); // <-- ELIMINAR UNIQUE EN ROLLBACK
            $table->dropColumn(['documento_identidad', 'codigo_estudiante', 'tipo_usuario_id', 'telefono', 'estado', 'fecha_suspension_hasta']);
            $table->dropSoftDeletes();
        });
    }
};