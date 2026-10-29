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

    public function create()
    {
        if (!auth()->user()->hasRole(['Administrador', 'Bibliotecario'])) {
            abort(403, 'No tienes permisos para acceder a este formulario.');
        }

        return Inertia::render('Catalogos/Create', [
            'editoriales' => Editorial::all(),
            'autores' => Autor::all(),
            'categorias' => Categoria::all(),
        ]);
    }

    public function store(StoreRecursoRequest $request)
    {
        if (!auth()->user()->hasRole(['Administrador', 'Bibliotecario'])) {
            abort(403, 'No tienes permisos para registrar recursos bibliográficos.');
        }

        DB::transaction(function () use ($request) {
            $recurso = RecursoBibliografico::create($request->validated());

            $autoresConOrden = collect($request->autores)->mapWithKeys(function ($autorId, $index) {
                return [$autorId => ['orden' => $index + 1]];
            });
            $recurso->autores()->sync($autoresConOrden);
            $recurso->categorias()->sync($request->categorias);

            if ($request->hasFile('portada')) {
                $recurso->addMediaFromRequest('portada')->toMediaCollection('portadas');
            }
        });

        return redirect()->route('recursos.index')->with('success', 'Recurso bibliográfico creado exitosamente.');
    }

    public function show(RecursoBibliografico $recurso)
    {
        $recurso->load(['editorial', 'autores', 'categorias', 'ejemplares']);

        return Inertia::render('Catalogos/Show', [
            'recurso' => $recurso
        ]);
    }
}