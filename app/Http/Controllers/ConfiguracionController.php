<?php

namespace App\Http\Controllers;

use App\Models\Configuracion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConfiguracionController extends Controller
{
    public function index()
    {
        if (!auth()->user()->hasRole(['Administrador'])) {
            abort(403, 'No tienes permisos para acceder a la configuración del sistema.');
        }

        return Inertia::render('Configuracion/Index', [
            'configuraciones' => Configuracion::all()
        ]);
    }

    public function updateOrCreate(Request $request)
    {
        if (!auth()->user()->hasRole(['Administrador'])) {
            abort(403, 'No tienes permisos para modificar la configuración del sistema.');
        }

        $validated = $request->validate([
            'clave' => 'required|string|max:255',
            'valor' => 'nullable|string',
            'descripcion' => 'nullable|string'
        ]);

        Configuracion::updateOrCreate(
            ['clave' => $validated['clave']],
            ['valor' => $validated['valor'], 'descripcion' => $validated['descripcion']]
        );

        return redirect()->back()->with('success', 'Configuración actualizada exitosamente.');
    }
}