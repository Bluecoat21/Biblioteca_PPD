<?php

namespace App\Http\Controllers;

use App\Models\RecursoBibliografico;
use App\Models\Editorial;
use App\Models\Autor;
use App\Models\Categoria;
use App\Http\Requests\StoreRecursoRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class RecursoBibliograficoController extends Controller
{
    // Mostrar listado con filtros y paginación
    public function index(Request $request)
    {
        $query = RecursoBibliografico::with(['editorial', 'autores', 'categorias', 'ejemplares']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('titulo', 'like', "%{$search}%")
->orWhere('isbn', 'like', "%{$search}%");
        }

        $recursos = $query->paginate(10)->withQueryString();

        return Inertia::render('Catalogos/Index', [
            'recursos' => $recursos,
            'filters' => $request->only(['search'])
        ]);
    }

    // Vista de creación (pasando editoriales, autores y categorías para los selects)
    public function create()
    {
        return Inertia::render('Catalogos/Create', [
            'editoriales' => Editorial::all(),
            'autores' => Autor::all(),
            'categorias' => Categoria::all(),
        ]);
    }

    // Almacenar el recurso y sus relaciones pivote
    public function store(StoreRecursoRequest $request)
    {
        DB::transaction(function () use ($request) {
            $recurso = RecursoBibliografico::create($request->validated());

            // Sincronizar autores (con orden por defecto en 1)
            $autoresConOrden = collect($request->autores)->mapWithKeys(function ($autorId, $index) {
                return [$autorId => ['orden' => $index + 1]];
            });
            $recurso->autores()->sync($autoresConOrden);

            // Sincronizar categorías
            $recurso->categorias()->sync($request->categorias);

            // Si se subió una portada con Spatie Media Library
            if ($request->hasFile('portada')) {
                $recurso->addMediaFromRequest('portada')->toMediaCollection('portadas');
            }
        });

        return redirect()->route('recursos.index')->with('success', 'Recurso bibliográfico creado exitosamente.');
    }

    // Mostrar detalle del recurso y sus ejemplares
    public function show(RecursoBibliografico $recurso)
    {
        $recurso->load(['editorial', 'autores', 'categorias', 'ejemplares']);

        return Inertia::render('Catalogos/Show', [
            'recurso' => $recurso
        ]);
    }
}