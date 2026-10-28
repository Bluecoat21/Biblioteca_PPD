<?php

namespace App\Http\Controllers;

use App\Models\Ubicacion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UbicacionController extends Controller
{
    public function index()
    {
        $ubicaciones = Ubicacion::withCount('ejemplares')->get();
        
        return Inertia::render('Configuracion/Ubicaciones', [
            'ubicaciones' => $ubicaciones
        ]);
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

        Ubicacion::create($validated);
        return redirect()->back()->with('success', 'Ubicación registrada exitosamente.');
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
        return redirect()->back()->with('success', 'Ubicación actualizada correctamente.');
    }

    public function destroy(Ubicacion $ubicacion)
    {
        $ubicacion->delete();
        return redirect()->back()->with('success', 'Ubicación eliminada lógicamente.');
    }
}