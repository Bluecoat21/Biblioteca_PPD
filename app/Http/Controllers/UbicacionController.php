<?php

namespace App\Http\Controllers;

use App\Models\Ubicacion;
use Illuminate\Http\Request;

class UbicacionController extends Controller
{
    public function index()
    {
        return response()->json(Ubicacion::withCount('ejemplares')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'edificio' => 'nullable|string|max:255',
            'piso' => 'nullable|string|max:255',
            'activa' => 'boolean'
        ]);

        $ubicacion = Ubicacion::create($validated);
        return response()->json($ubicacion, 201);
    }

    public function update(Request $request, Ubicacion $ubicacion)
    {
        $validated = $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'descripcion' => 'nullable|string',
            'edificio' => 'nullable|string|max:255',
            'piso' => 'nullable|string|max:255',
            'activa' => 'boolean'
        ]);

        $ubicacion->update($validated);
        return response()->json($ubicacion);
    }

    public function destroy(Ubicacion $ubicacion)
    {
        $ubicacion->delete(); // SoftDelete
        return response()->json(null, 204);
    }
}