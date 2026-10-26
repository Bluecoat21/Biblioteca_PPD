<?php

namespace App\Http\Controllers;

use App\Models\Configuracion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConfiguracionController extends Controller
{
    public function index()
    {
        return Inertia::render('Configuracion/Index', [
            'configuraciones' => Configuracion::all()
        ]);
    }

    public function updateOrCreate(Request $request)
    {
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