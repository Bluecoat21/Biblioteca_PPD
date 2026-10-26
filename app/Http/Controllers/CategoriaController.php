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

        return Inertia::render('Categorias/Index', [
            'categorias' => $categorias,
            'categoriasPadre' => $categoriasPadre
        ]);
    }

    public function store(StoreCategoriaRequest $request)
    {
        Categoria::create($request->validated());
        return redirect()->back()->with('success', 'Categoría creada exitosamente.');
    }

    public function update(Request $request, Categoria $categoria)
    {
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
        $categoria->delete();
        return redirect()->back()->with('success', 'Categoría eliminada exitosamente.');
    }
}