<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Configuracion;
use App\Models\Ubicacion;

class Modulo4Seeder extends Seeder
{
    public function run(): void
    {
        // Configuraciones iniciales
        Configuracion::create(['clave' => 'dias_prestamo', 'valor' => '7', 'descripcion' => 'Días por defecto de préstamo']);
        Configuracion::create(['clave' => 'multa_diaria', 'valor' => '1.50', 'descripcion' => 'Monto de multa por día de retraso']);
        Configuracion::create(['clave' => 'nombre_biblioteca', 'valor' => 'Biblioteca Central', 'descripcion' => 'Nombre de la institución']);

        // Ubicaciones iniciales
        Ubicacion::create(['nombre' => 'Estante A-1', 'edificio' => 'Principal', 'piso' => '1', 'activa' => true]);
        Ubicacion::create(['nombre' => 'Estante B-2', 'edificio' => 'Principal', 'piso' => '2', 'activa' => true]);
        Ubicacion::create(['nombre' => 'Archivo General', 'edificio' => 'Anexo', 'piso' => 'Sótano', 'activa' => true]);
    }
}