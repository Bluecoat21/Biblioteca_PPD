<?php

namespace Database\Seeders;

use App\Models\TipoUsuario;
use App\Models\User;
use Illuminate\Database\Seeder;

class UsuarioAdminSeeder extends Seeder
{
    public function run(): void
    {
        $tipo = TipoUsuario::where('nombre', 'Administrativo')->firstOrFail();

        $admin = User::firstOrCreate(
            ['email' => '12345@1.test'],
            [
                'name' => 'Administrador',
                'password' => '123',
                'documento_identidad' => '00000000',
                'tipo_usuario_id' => $tipo->id,
                'estado' => 'activo',
                'email_verified_at' => now(),
            ]
        );

        $admin->assignRole('Administrador');
    }
}