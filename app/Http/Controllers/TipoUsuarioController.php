<?php

namespace App\Http\Controllers;

use App\Http\Requests\TipoUsuarioRequest;
use App\Models\TipoUsuario;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TipoUsuarioController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Configuracion/TiposUsuario/Index', [
            'tipos' => TipoUsuario::withCount('users')->orderBy('nombre')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Configuracion/TiposUsuario/Create');
    }

    public function store(TipoUsuarioRequest $request): RedirectResponse
    {
        TipoUsuario::create($request->validated());
        return redirect()->route('tipos-usuario.index')->with('success', 'Tipo de usuario creado exitosamente.');
    }

    public function edit(TipoUsuario $tipoUsuario): Response
    {
        return Inertia::render('Configuracion/TiposUsuario/Edit', [
            'tipo' => $tipoUsuario,
        ]);
    }

    public function update(TipoUsuarioRequest $request, TipoUsuario $tipoUsuario): RedirectResponse
    {
        $tipoUsuario->update($request->validated());
        return redirect()->route('tipos-usuario.index')->with('success', 'Tipo de usuario actualizado correctamente.');
    }

    public function destroy(TipoUsuario $tipoUsuario): RedirectResponse
    {
        if ($tipoUsuario->users()->exists()) {
            return back()->withErrors([
                'tipo' => 'No se puede eliminar: hay usuarios asociados a este tipo.',
            ]);
        }

        $tipoUsuario->delete();
        return redirect()->route('tipos-usuario.index')->with('success', 'Tipo de usuario eliminado.');
    }
}