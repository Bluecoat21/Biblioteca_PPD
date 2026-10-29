<?php

namespace App\Http\Controllers;

use App\Models\Editorial;
use App\Http\Requests\StoreEditorialRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EditorialController extends Controller
{
    public function index()
    {
        $editoriales = Editorial::withCount('recursosBibliograficos')->paginate(10);
        return Inertia::render('Catalogos/Editoriales/Index', ['editoriales' => $editoriales]);
    }

    public function store(StoreEditorialRequest $request)
    {
        if (!auth()->user()->hasRole(['Administrador', 'Bibliotecario'])) {
            abort(403, 'No tienes permisos para registrar editoriales.');
        }

        Editorial::create($request->validated());
        return redirect()->back()->with('success', 'Editorial registrada exitosamente.');
    }

    public function update(Request $request, Editorial $editorial)
    {
        if (!auth()->user()->hasRole(['Administrador', 'Bibliotecario'])) {
            abort(403, 'No tienes permisos para actualizar editoriales.');
        }

        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:editoriales,nombre,' . $editorial->id,
            'pais' => 'nullable|string|max:100',
            'sitio_web' => 'nullable|url|max:255',
        ]);

        $editorial->update($validated);
        return redirect()->back()->with('success', 'Editorial actualizada exitosamente.');
    }

    public function destroy(Editorial $editorial)
    {
        if (!auth()->user()->hasRole(['Administrador', 'Bibliotecario'])) {
            abort(403, 'No tienes permisos para eliminar editoriales.');
        }

        $editorial->delete();
        return redirect()->back()->with('success', 'Editorial eliminada exitosamente.');
    }
}