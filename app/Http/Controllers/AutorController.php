<?php

namespace App\Http\Controllers;

use App\Models\Autor;
use App\Http\Requests\StoreAutorRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AutorController extends Controller
{
    public function index()
    {
        $autores = Autor::withCount('recursos')->paginate(10);
        return Inertia::render('Catalogos/Autores', ['autores' => $autores]);
    }

    public function store(StoreAutorRequest $request)
    {
        Autor::create($request->validated());
        return redirect()->back()->with('success', 'Autor registrado exitosamente.');
    }

    public function update(Request $request, Autor $autor)
    {
        $validated = $request->validate([
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'nacionalidad' => 'nullable|string|max:100',
            'biografia' => 'nullable|string',
            'fecha_nacimiento' => 'nullable|date',
        ]);

        $autor->update($validated);
        return redirect()->back()->with('success', 'Autor actualizado exitosamente.');
    }

    public function destroy(Autor $autor)
    {
        $autor->delete();
        return redirect()->back()->with('success', 'Autor eliminado exitosamente.');
    }
}