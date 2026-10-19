<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolesPermisosSeeder::class,
            TiposUsuarioSeeder::class,
            UsuarioAdminSeeder::class,
            Modulo4Seeder::class, // <--- Añadido para poblar ubicaciones y configuraciones
        ]);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'documento_identidad' => '87654321', // <--- Asegurado explícitamente aquí también
        ]);
    }
}