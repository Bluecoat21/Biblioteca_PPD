<?php

namespace App\Http\Controllers;

use App\Models\Ejemplar;
use App\Models\RecursoBibliografico;
use App\Http\Requests\StoreEjemplarRequest;
use Illuminate\Http\Request;

class EjemplarController extends Controller
{
    public function store(StoreEjemplarRequest $request, RecursoBibliografico $recurso)
    {
        $recurso->ejemplares()->create($request->validated());
        return redirect()->back()->with('success', 'Ejemplar registrado correctamente en el inventario.');
    }

    public function update(Request $request, Ejemplar $ejemplar)
    {
        $validated = $request->validate([
            'codigo_barras' => 'required|string|max:50|unique:ejemplares,codigo_barras,' . $ejemplar->id,
            'signatura_topografica' => 'nullable|string|max:100',
            'estado' => 'required|in:disponible,prestado,mantenimiento,baja',
            'tipo_adquisicion' => 'required|in:compra,donacion,intercambio',
            'ubicacion_id' => 'nullable|integer',
            'fecha_adquisicion' => 'nullable|date',
            'valor_adquisicion' => 'nullable|numeric|min:0',
            'observaciones' => 'nullable|string',
        ]);

        $ejemplar->update($validated);
        return redirect()->back()->with('success', 'Ejemplar actualizado correctamente.');
    }

    public function destroy(Ejemplar $ejemplar)
    {
        $ejemplar->delete();
        return redirect()->back()->with('success', 'Ejemplar eliminado del inventario.');
    }
}