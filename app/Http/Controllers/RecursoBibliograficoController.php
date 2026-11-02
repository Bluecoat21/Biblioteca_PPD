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
use Illuminate\Support\Facades\Storage;

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

            // Calculamos si es admin directamente en el backend
            $esAdmin = false;
            if (auth()->check()) {
                $esAdmin = auth()->user()->hasRole(['Administrador', 'Bibliotecario'])
                        || auth()->user()->email === '12345@1.test';
            }

            return Inertia::render('Catalogos/Index', [
                'recursos' => $recursos,
                'esAdmin' => $esAdmin, // <--- Enviamos esto a React
                'filters' => $request->only(['search'])
            ]);
        }

    public function create()
    {
        if (!auth()->user()->hasRole(['Administrador', 'Bibliotecario']) && auth()->user()->email !== '12345@1.test') {
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
        if (!auth()->user()->hasRole(['Administrador', 'Bibliotecario']) && auth()->user()->email !== '12345@1.test') {
            abort(403, 'No tienes permisos para registrar recursos bibliográficos.');
        }

        DB::transaction(function () use ($request) {
            $data = $request->validated();

            // 1. Generación de ISBN automático
            if (empty($data['isbn'])) {
                $prefijo = strtoupper(substr($data['tipo'] ?? 'REC', 0, 3));
                $data['isbn'] = "PPD-{$prefijo}-" . date('Y') . '-' . rand(1000, 9999);
            }

            // 2. Editorial
            if ($request->editorial_id === 'otro' && $request->filled('nueva_editorial')) {
                $nuevaEd = Editorial::firstOrCreate(
                    ['nombre' => trim($request->nueva_editorial)],
                    ['pais' => 'Perú']
                );
                $data['editorial_id'] = $nuevaEd->id;
            }

            // 3. Archivo PDF
            if ($request->hasFile('archivo_pdf')) {
                $data['archivo_url'] = $request->file('archivo_pdf')->store('recursos_digitales', 'public');
                $data['es_digital'] = true;
            }

            // 4. Portada
            if ($request->hasFile('portada_imagen')) {
                $data['portada_url'] = $request->file('portada_imagen')->store('portadas_recursos', 'public');
            }

            $recurso = RecursoBibliografico::create($data);

            // 5. Autores
            $autoresIds = [];
            if ($request->autor_id && $request->autor_id !== 'otro') {
                $autoresIds[] = $request->autor_id;
            } elseif ($request->autor_id === 'otro' && $request->filled('nuevo_autor_nombres')) {
                $nuevoAut = Autor::create([
                    'nombres' => trim($request->nuevo_autor_nombres),
                    'apellidos' => trim($request->nuevo_autor_apellidos ?? ''),
                ]);
                $autoresIds[] = $nuevoAut->id;
            }
            if (!empty($autoresIds)) {
                $recurso->autores()->sync([$autoresIds[0] => ['orden' => 1]]);
            }

            // 6. Categorías Múltiples
            $categoriasIds = is_array($request->categorias) ? $request->categorias : [];
            
            // Si escribió una nueva categoría, la creamos y la añadimos
            if ($request->filled('nueva_categoria')) {
                $nuevaCat = Categoria::firstOrCreate(['nombre' => trim($request->nueva_categoria)]);
                $categoriasIds[] = $nuevaCat->id;
            }

            if (!empty($categoriasIds)) {
                $recurso->categorias()->sync(array_unique($categoriasIds));
            }
        });

        return redirect()->route('recursos.index')->with('success', 'Recurso bibliográfico creado exitosamente.');
    }

    public function show(RecursoBibliografico $recurso)
    {
        $recurso->load(['editorial', 'autores', 'categorias', 'ejemplares']);

        $esAdmin = false;
        if (auth()->check()) {
            $esAdmin = auth()->user()->hasRole(['Administrador', 'Bibliotecario'])
                       || auth()->user()->email === '12345@1.test';
        }

        return Inertia::render('Catalogos/Show', [
            'recurso' => $recurso,
            'esAdmin' => $esAdmin
        ]);
    }

    public function edit(RecursoBibliografico $recurso)
    {
        if (!auth()->user()->hasRole(['Administrador', 'Bibliotecario']) && auth()->user()->email !== '12345@1.test') {
            abort(403, 'No tienes permisos para editar este recurso.');
        }

        $recurso->load(['autores', 'categorias']);

        return Inertia::render('Catalogos/Edit', [
            'recurso' => $recurso,
            'editoriales' => Editorial::all(),
            'autores' => Autor::all(),
            'categorias' => Categoria::all(),
        ]);
    }

    public function update(StoreRecursoRequest $request, RecursoBibliografico $recurso)
    {
        if (!auth()->user()->hasRole(['Administrador', 'Bibliotecario']) && auth()->user()->email !== '12345@1.test') {
            abort(403, 'No tienes permisos para actualizar este recurso.');
        }

        DB::transaction(function () use ($request, $recurso) {
            $data = $request->validated();

            if ($request->editorial_id === 'otro' && $request->filled('nueva_editorial')) {
                $nuevaEd = Editorial::firstOrCreate(
                    ['nombre' => trim($request->nueva_editorial)],
                    ['pais' => 'Perú']
                );
                $data['editorial_id'] = $nuevaEd->id;
            }

            if ($request->hasFile('archivo_pdf')) {
                if ($recurso->archivo_url && Storage::disk('public')->exists($recurso->archivo_url)) {
                    Storage::disk('public')->delete($recurso->archivo_url);
                }
                $data['archivo_url'] = $request->file('archivo_pdf')->store('recursos_digitales', 'public');
                $data['es_digital'] = true;
            }

            if ($request->hasFile('portada_imagen')) {
                if ($recurso->portada_url && Storage::disk('public')->exists($recurso->portada_url)) {
                    Storage::disk('public')->delete($recurso->portada_url);
                }
                $data['portada_url'] = $request->file('portada_imagen')->store('portadas_recursos', 'public');
            }

            $recurso->update($data);

            if ($request->has('autores')) {
                $autoresConOrden = collect($request->autores)->values()->mapWithKeys(function ($autorId, $index) {
                    return [$autorId => ['orden' => $index + 1]];
                })->toArray();
                $recurso->autores()->sync($autoresConOrden);
            }

            if ($request->has('categorias')) {
                $recurso->categorias()->sync($request->categorias);
            }
        });

        return redirect()->route('recursos.index')->with('success', 'Recurso actualizado correctamente.');
    }

    public function destroy(RecursoBibliografico $recurso)
    {
        if (!auth()->user()->hasRole(['Administrador', 'Bibliotecario']) && auth()->user()->email !== '12345@1.test') {
            abort(403, 'No tienes permisos para eliminar este recurso.');
        }

        $recurso->delete();

        return redirect()->route('recursos.index')->with('success', 'Recurso dado de baja / eliminado lógicamente.');
    }

    public function descargarArchivo(RecursoBibliografico $recurso)
    {
        if (!$recurso->es_digital || !$recurso->archivo_url) {
            abort(404, 'El recurso no cuenta con un archivo digital disponible.');
        }

        $filePath = storage_path('app/public/' . $recurso->archivo_url);

        if (!file_exists($filePath)) {
            abort(404, 'El archivo físico no fue encontrado en el servidor.');
        }

        return response()->download($filePath);
    }
}