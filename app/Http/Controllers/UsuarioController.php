<?php

namespace App\Http\Controllers;

use App\Http\Requests\UsuarioRequest;
use App\Models\TipoUsuario;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UsuarioController extends Controller
{
    public function index(): Response
    {
        $usuarios = User::with(['tipoUsuario', 'roles'])
            ->orderBy('name')
            ->get()
            ->map(fn (User $u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'documento_identidad' => $u->documento_identidad,
                'telefono' => $u->telefono,
                'estado' => $u->estado,
                'tipo' => $u->tipoUsuario?->nombre,
                'rol' => $u->roles->first()?->name,
            ]);

        return Inertia::render('usuarios/index', [
            'usuarios' => $usuarios,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('usuarios/create', [
            'tipos' => TipoUsuario::orderBy('nombre')->get(['id', 'nombre']),
            'roles' => Role::orderBy('name')->pluck('name'),
        ]);
    }

    public function store(UsuarioRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $rol = $data['rol'];
        unset($data['rol']);

        $usuario = new User($data);
        $usuario->email_verified_at = now();
        $usuario->save();
        $usuario->syncRoles([$rol]);

        return redirect('/usuarios');
    }

    public function edit(User $usuario): Response
    {
        return Inertia::render('usuarios/edit', [
            'usuario' => [
                'id' => $usuario->id,
                'name' => $usuario->name,
                'email' => $usuario->email,
                'documento_identidad' => $usuario->documento_identidad,
                'tipo_usuario_id' => $usuario->tipo_usuario_id,
                'telefono' => $usuario->telefono,
                'estado' => $usuario->estado,
                'rol' => $usuario->roles->first()?->name,
            ],
            'tipos' => TipoUsuario::orderBy('nombre')->get(['id', 'nombre']),
            'roles' => Role::orderBy('name')->pluck('name'),
        ]);
    }

    public function update(UsuarioRequest $request, User $usuario): RedirectResponse
    {
        $data = $request->validated();
        $rol = $data['rol'];
        unset($data['rol']);

        if (empty($data['password'])) {
            unset($data['password']);
        }

        $usuario->update($data);
        $usuario->syncRoles([$rol]);

        return redirect('/usuarios');
    }

    public function destroy(User $usuario): RedirectResponse
    {
        if ($usuario->id === auth()->id()) {
            return back()->withErrors([
                'usuario' => 'No puedes eliminar tu propio usuario.',
            ]);
        }

        $usuario->delete();

        return redirect('/usuarios');
    }
}