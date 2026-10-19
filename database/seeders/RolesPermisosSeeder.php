<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesPermisosSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permisos = [
            'usuarios.ver',
            'usuarios.gestionar',
            'tipos-usuario.ver',
            'tipos-usuario.gestionar',
            'multas.ver',
            'multas.gestionar',
            'suspensiones.ver',
            'suspensiones.gestionar',
        ];

        foreach ($permisos as $permiso) {
            Permission::firstOrCreate(['name' => $permiso, 'guard_name' => 'web']);
        }

        $admin = Role::firstOrCreate(['name' => 'Administrador', 'guard_name' => 'web']);
        $admin->syncPermissions($permisos);

        $bibliotecario = Role::firstOrCreate(['name' => 'Bibliotecario', 'guard_name' => 'web']);
        $bibliotecario->syncPermissions([
            'usuarios.ver',
            'tipos-usuario.ver',
            'multas.ver',
            'multas.gestionar',
            'suspensiones.ver',
            'suspensiones.gestionar',
        ]);

        $consulta = Role::firstOrCreate(['name' => 'Consulta', 'guard_name' => 'web']);
        $consulta->syncPermissions([
            'usuarios.ver',
            'tipos-usuario.ver',
            'multas.ver',
            'suspensiones.ver',
        ]);
    }
}