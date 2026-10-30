<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\TipoUsuario;
use App\Models\Configuracion;
use App\Models\Ubicacion;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Limpiar caché de permisos de Spatie
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // 2. Crear Permisos y Roles
        $permisos = [
            'usuarios.ver', 'usuarios.gestionar',
            'tipos-usuario.ver', 'tipos-usuario.gestionar',
            'multas.ver', 'multas.gestionar',
            'suspensiones.ver', 'suspensiones.gestionar',
        ];

        foreach ($permisos as $permiso) {
            Permission::firstOrCreate(['name' => $permiso, 'guard_name' => 'web']);
        }

        $adminRole = Role::firstOrCreate(['name' => 'Administrador', 'guard_name' => 'web']);
        $adminRole->syncPermissions($permisos);

        $bibliotecarioRole = Role::firstOrCreate(['name' => 'Bibliotecario', 'guard_name' => 'web']);
        $bibliotecarioRole->syncPermissions([
            'usuarios.ver', 'tipos-usuario.ver', 'multas.ver', 'multas.gestionar', 'suspensiones.ver', 'suspensiones.gestionar',
        ]);

        $estudianteRole = Role::firstOrCreate(['name' => 'Estudiante', 'guard_name' => 'web']);

        // 3. Crear Tipos de Usuario
        $tipoAdmin = TipoUsuario::firstOrCreate(['nombre' => 'Administrativo'], ['max_prestamos' => 4, 'dias_prestamo_default' => 10]);
        $tipoEstudiante = TipoUsuario::firstOrCreate(['nombre' => 'Estudiante'], ['max_prestamos' => 3, 'dias_prestamo_default' => 7]);
        TipoUsuario::firstOrCreate(['nombre' => 'Docente'], ['max_prestamos' => 5, 'dias_prestamo_default' => 15]);

        // 4. Crear Usuario Administrador Oficial
        $admin = User::firstOrCreate(
            ['email' => '12345@1.test'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('123'),
                'documento_identidad' => '00000000',
                'tipo_usuario_id' => $tipoAdmin->id,
                'estado' => 'activo',
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole('Administrador');

        // 5. Configuraciones y Ubicaciones
        Configuracion::firstOrCreate(['clave' => 'dias_prestamo'], ['valor' => '7', 'descripcion' => 'Días por defecto de préstamo']);
        Configuracion::firstOrCreate(['clave' => 'multa_diaria'], ['valor' => '1.50', 'descripcion' => 'Monto de multa por día de retraso']);
        Configuracion::firstOrCreate(['clave' => 'monto_multa_dia'], ['valor' => '2.00', 'descripcion' => 'Monto alternativo de multa diaria']);
        Configuracion::firstOrCreate(['clave' => 'nombre_biblioteca'], ['valor' => 'Biblioteca Central', 'descripcion' => 'Nombre de la institución']);

        Ubicacion::firstOrCreate(['nombre' => 'Estante A-1'], ['edificio' => 'Principal', 'piso' => '1', 'activa' => true]);

        // 6. Usuario de Prueba Regular (Estudiante con su rol asignado)
        $estudiante = User::firstOrCreate(
            ['email' => '12345@2.com'], 
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'documento_identidad' => '87654321',
                'tipo_usuario_id' => $tipoEstudiante->id,
                'estado' => 'activo',
                'email_verified_at' => now(),
            ]
        );
        $estudiante->assignRole('Estudiante');
    }
}