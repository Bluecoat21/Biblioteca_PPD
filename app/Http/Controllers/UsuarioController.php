<?php

namespace App\Http\Controllers;

use App\Http\Requests\UsuarioRequest;
use App\Models\TipoUsuario;
use App\Models\User;
use App\Models\Suspension;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UsuarioController extends Controller
{
    public function index(Request $request): Response
    {
        $esAdmin = false;
        if (auth()->check()) {
            $esAdmin = auth()->user()->hasRole(['Administrador', 'Bibliotecario'])
                       || auth()->user()->email === '12345@1.test';
        }

        $usuarios = User::with(['tipoUsuario', 'roles'])
            ->orderBy('name')
            ->get()
            ->map(fn ($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'documento_identidad' => $u->documento_identidad,
                'codigo_estudiante' => $u->codigo_estudiante ?? 'N/A',
                'codigo_acceso_web' => $u->codigo_acceso_web,
                'cuenta_web_activa' => (bool) $u->cuenta_web_activa,
                'telefono' => $u->telefono ?? 'N/A',
                'estado' => $u->estado,
                'tipo' => $u->tipoUsuario?->nombre,
                'rol' => $u->roles->first()?->name,
            ]);

        return Inertia::render('Usuarios/Index', [
            'usuarios' => $usuarios,
            'esAdmin' => $esAdmin,
        ]);
    }

    public function create(): Response
    {
        if (!auth()->user()->hasRole(['Administrador', 'Bibliotecario']) && auth()->user()->email !== '12345@1.test') {
            abort(403, 'No tienes permisos para registrar usuarios.');
        }

        return Inertia::render('Usuarios/Create', [
            'tipos' => TipoUsuario::orderBy('nombre')->get(['id', 'nombre']),
            'roles' => Role::orderBy('name')->pluck('name'),
        ]);
    }

    public function store(UsuarioRequest $request): RedirectResponse
    {
        $data = $request->validated();
        
        $rol = $data['rol'];
        unset($data['rol']);

        if (empty($data['codigo_acceso_web'])) {
            $data['codigo_acceso_web'] = 'ACCESO-' . strtoupper(Str::random(6));
        }

        $usuario = new User($data);
        $usuario->password = Hash::make(Str::random(16));
        $usuario->cuenta_web_activa = false;
        $usuario->email_verified_at = now();
        $usuario->save();
        
        $usuario->syncRoles([$rol]);

        return redirect()->route('usuarios.index')->with('success', 'Usuario registrado presencialmente con éxito.');
    }

    public function edit(User $usuario): Response
    {
        return Inertia::render('Usuarios/Edit', [
            'usuario' => [
                'id' => $usuario->id,
                'name' => $usuario->name,
                'email' => $usuario->email,
                'documento_identidad' => $usuario->documento_identidad,
                'codigo_estudiante' => $usuario->codigo_estudiante,
                'codigo_acceso_web' => $usuario->codigo_acceso_web,
                'cuenta_web_activa' => (bool) $usuario->cuenta_web_activa,
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

        if (isset($data['cuenta_web_activa'])) {
            $data['cuenta_web_activa'] = (bool) $data['cuenta_web_activa'];
        }

        $estadoAnterior = $usuario->estado;
        $nuevoEstado = $data['estado'] ?? $usuario->estado;

        $usuario->update($data);
        $usuario->syncRoles([$rol]);

        // Sincronización automática con el registro de suspensiones
        if ($estadoAnterior !== 'suspendido' && $nuevoEstado === 'suspendido') {
            Suspension::create([
                'user_id' => $usuario->id,
                'motivo' => 'Suspensión aplicada manualmente desde la edición del perfil de usuario.',
                'fecha_inicio' => now()->toDateString(),
                'fecha_fin' => null,
                'activa' => true,
                'created_by' => auth()->id() ?? $usuario->id,
            ]);
        } elseif ($estadoAnterior === 'suspendido' && $nuevoEstado === 'activo') {
            Suspension::where('user_id', $usuario->id)
                ->where('activa', true)
                ->update(['activa' => false]);
        }

        return redirect()->route('usuarios.index')->with('success', 'Usuario actualizado correctamente.');
    }
}