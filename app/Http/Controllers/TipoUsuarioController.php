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
        return Inertia::render('tipos-usuario/index', [
            'tipos' => TipoUsuario::withCount('users')->orderBy('nombre')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('tipos-usuario/create');
    }

    public function store(TipoUsuarioRequest $request): RedirectResponse
    {
        TipoUsuario::create($request->validated());

        return redirect('/tipos-usuario');
    }

    public function edit(TipoUsuario $tipoUsuario): Response
    {
        return Inertia::render('tipos-usuario/edit', [
            'tipo' => $tipoUsuario,
        ]);
    }

    public function update(TipoUsuarioRequest $request, TipoUsuario $tipoUsuario): RedirectResponse
    {
        $tipoUsuario->update($request->validated());

        return redirect('/tipos-usuario');
    }

    public function destroy(TipoUsuario $tipoUsuario): RedirectResponse
    {
        if ($tipoUsuario->users()->exists()) {
            return back()->withErrors([
                'tipo' => 'No se puede eliminar: hay usuarios con este tipo.',
            ]);
        }

        $tipoUsuario->delete();

        return redirect('/tipos-usuario');
    }
}