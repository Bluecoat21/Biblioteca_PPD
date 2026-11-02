<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Http\Requests\StoreCategoriaRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoriaController extends Controller
{
    public function index()
    {
        $categorias = Categoria::with('categoriaPadre')->withCount('recursos')->paginate(10);
        $categoriasPadre = Categoria::whereNull('categoria_padre_id')->get();

        // Calculamos si es admin directamente en el backend
        $esAdmin = false;
        if (auth()->check()) {
            $esAdmin = auth()->user()->hasRole(['Administrador', 'Bibliotecario'])
                       || auth()->user()->email === '12345@1.test';
        }

        return Inertia::render('Catalogos/Categorias', [
            'categorias' => $categorias,
            'categoriasPadre' => $categoriasPadre,
            'esAdmin' => $esAdmin // <--- Enviamos a React
        ]);
    }

    public function store(StoreCategoriaRequest $request)
    {
        if (!auth()->user()->hasRole(['Administrador', 'Bibliotecario'])) {
            abort(403, 'No tienes permisos para crear categorías.');
        }

        Categoria::create($request->validated());
        return redirect()->back()->with('success', 'Categoría creada exitosamente.');
    }

    public function update(Request $request, Categoria $categoria)
    {
        if (!auth()->user()->hasRole(['Administrador', 'Bibliotecario'])) {
            abort(403, 'No tienes permisos para actualizar categorías.');
        }

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'categoria_padre_id' => 'nullable|exists:categorias,id|not_in:' . $categoria->id,
        ]);

        $categoria->update($validated);
        return redirect()->back()->with('success', 'Categoría actualizada exitosamente.');
    }

    public function destroy(Categoria $categoria)
    {
        if (!auth()->user()->hasRole(['Administrador', 'Bibliotecario'])) {
            abort(403, 'No tienes permisos para eliminar categorías.');
        }

        $categoria->delete();
        return redirect()->back()->with('success', 'Categoría eliminada exitosamente.');
    }
}