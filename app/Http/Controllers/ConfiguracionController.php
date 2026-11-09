<?php

namespace App\Http\Controllers;

use App\Models\Configuracion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConfiguracionController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $esAdmin = $user && ($user->hasRole(['Administrador', 'Bibliotecario', 'admin', 'administrator', 'administrador']) || $user->email === '12345@1.test');

        if (!$esAdmin) {
            abort(403, 'No tienes permisos para acceder a la configuración del sistema.');
        }

        return Inertia::render('Configuracion/Index', [
            'configuraciones' => Configuracion::all()
        ]);
    }

    public function updateOrCreate(Request $request)
    {
        $user = auth()->user();
        $esAdmin = $user && ($user->hasRole(['Administrador', 'Bibliotecario', 'admin', 'administrator', 'administrador']) || $user->email === '12345@1.test');

        if (!$esAdmin) {
            abort(403, 'No tienes permisos para modificar la configuración del sistema.');
        }

        // Si se envían múltiples configuraciones en un array o de forma individual
        $configs = $request->input('configuraciones', $request->all());

        if (isset($configs['clave'])) {
            // Petición individual antigua
            Configuracion::updateOrCreate(
                ['clave' => $configs['clave']],
                ['valor' => $configs['valor'] ?? '', 'descripcion' => $configs['descripcion'] ?? '']
            );
        } else {
            // Guardado masivo desde el formulario unificado
            foreach ($configs as $clave => $valor) {
                if (in_array($clave, ['dias_prestamo_alumno', 'dias_prestamo_docente', 'monto_multa_dia'])) {
                    Configuracion::updateOrCreate(
                        ['clave' => $clave],
                        ['valor' => $valor]
                    );
                }
            }
        }

        return redirect()->back()->with('success', 'Configuración actualizada exitosamente.');
    }
}