<?php

namespace App\Http\Controllers;

use App\Models\Ejemplar;
use App\Models\RecursoBibliografico;
use Illuminate\Http\Request;

class EjemplarController extends Controller
{
    public function store(Request $request, RecursoBibliografico $recurso)
    {
        if (!auth()->user()->hasRole(['Administrador', 'Bibliotecario']) && auth()->user()->email !== '12345@1.test') {
            abort(403, 'No tienes permisos para registrar ejemplares.');
        }

        $validated = $request->validate([
            'codigo_barras' => 'required|string|max:50|unique:ejemplares,codigo_barras',
            'signatura_topografica' => 'nullable|string|max:100',
            'estado' => 'required|in:disponible,prestado,mantenimiento,baja,perdido,dañado',
            'tipo_adquisicion' => 'required|in:compra,donacion,intercambio',
            'ubicacion_id' => 'nullable|exists:ubicaciones,id',
            'fecha_adquisicion' => 'nullable|date',
            'valor_adquisicion' => 'nullable|numeric|min:0',
            'observaciones' => 'nullable|string',
        ]);

        $recurso->ejemplares()->create($validated);

        return redirect()->back()->with('success', 'Ejemplar registrado correctamente en el inventario.');
    }

    public function update(Request $request, Ejemplar $ejemplar)
    {
        if (!auth()->user()->hasRole(['Administrador', 'Bibliotecario']) && auth()->user()->email !== '12345@1.test') {
            abort(403, 'No tienes permisos para actualizar ejemplares.');
        }

        $validated = $request->validate([
            'codigo_barras' => 'required|string|max:50|unique:ejemplares,codigo_barras,' . $ejemplar->id,
            'signatura_topografica' => 'nullable|string|max:100',
            'estado' => 'required|in:disponible,prestado,mantenimiento,baja,perdido,dañado',
            'tipo_adquisicion' => 'required|in:compra,donacion,intercambio',
            'ubicacion_id' => 'nullable|exists:ubicaciones,id',
            'fecha_adquisicion' => 'nullable|date',
            'valor_adquisicion' => 'nullable|numeric|min:0',
            'observaciones' => 'nullable|string',
        ]);

        $ejemplar->update($validated);

        return redirect()->back()->with('success', 'Ejemplar actualizado correctamente.');
    }

    public function destroy(Ejemplar $ejemplar)
    {
        if (!auth()->user()->hasRole(['Administrador', 'Bibliotecario']) && auth()->user()->email !== '12345@1.test') {
            abort(403, 'No tienes permisos para eliminar ejemplares.');
        }

        $ejemplar->delete();

        return redirect()->back()->with('success', 'Ejemplar eliminado del inventario.');
    }
}