<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'codigo_acceso_web')) {
                $table->string('codigo_acceso_web')->nullable()->after('codigo_estudiante');
            }
            if (!Schema::hasColumn('users', 'cuenta_web_activa')) {
                $table->boolean('cuenta_web_activa')->default(false)->after('codigo_acceso_web');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['codigo_acceso_web', 'cuenta_web_activa']);
        });
    }
};