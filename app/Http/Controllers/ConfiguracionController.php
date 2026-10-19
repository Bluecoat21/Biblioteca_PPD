<?php

namespace App\Http\Controllers;

use App\Models\Configuracion;
use Illuminate\Http\Request;

class ConfiguracionController extends Controller
{
    public function index()
    {
        return response()->json(Configuracion::all());
    }

    public function updateOrCreate(Request $request)
    {
        $validated = $request->validate([
            'clave' => 'required|string|max:255',
            'valor' => 'nullable|string',
            'descripcion' => 'nullable|string'
        ]);

        $config = Configuracion::updateOrCreate(
            ['clave' => $validated['clave']],
            ['valor' => $validated['valor'], 'descripcion' => $validated['descripcion']]
        );

        return response()->json($config);
    }
}