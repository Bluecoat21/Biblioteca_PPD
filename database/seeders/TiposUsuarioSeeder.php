<?php

namespace Database\Seeders;

use App\Models\TipoUsuario;
use Illuminate\Database\Seeder;

class TiposUsuarioSeeder extends Seeder
{
    public function run(): void
    {
        $tipos = [
            ['nombre' => 'Estudiante', 'max_prestamos' => 3, 'dias_prestamo_default' => 7],
            ['nombre' => 'Docente', 'max_prestamos' => 5, 'dias_prestamo_default' => 15],
            ['nombre' => 'Administrativo', 'max_prestamos' => 4, 'dias_prestamo_default' => 10],
            ['nombre' => 'Externo', 'max_prestamos' => 1, 'dias_prestamo_default' => 3],
        ];

        foreach ($tipos as $tipo) {
            TipoUsuario::firstOrCreate(['nombre' => $tipo['nombre']], $tipo);
        }
    }
}