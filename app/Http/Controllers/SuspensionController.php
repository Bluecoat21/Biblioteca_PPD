<?php

namespace App\Http\Controllers;

use App\Models\Suspension;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuspensionController extends Controller
{
    /**
     * Mostrar listado de suspensiones.
     */
    public function index(Request $request)
    {
        $query = Suspension::with(['user', 'creador']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $suspensiones = $query->latest()->paginate(10);

        return Inertia::render('Circulacion/Suspensiones', [
            'suspensiones' => $suspensiones,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Mostrar formulario para crear una nueva suspensión.
     */
    public function create()
    {
        // Obtenemos los usuarios disponibles para suspender
        $usuarios = User::select('id', 'name', 'email')->get();

        return Inertia::render('Circulacion/SuspensionesCreate', [
            'usuarios' => $usuarios
        ]);
    }

    /**
     * Almacenar una nueva suspensión en la base de datos e inhabilitar al usuario.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'motivo' => ['required', 'string', 'max:255'],
            'fecha_inicio' => ['required', 'date'],
            'fecha_fin' => ['required', 'date', 'after_or_equal:fecha_inicio'],
        ]);

        // Crear la suspensión
        $suspension = Suspension::create([
            'user_id' => $request->user_id,
            'motivo' => $request->motivo,
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin' => $request->fecha_fin,
            'activa' => true,
            'created_by' => auth()->id(),
        ]);

        // CAMBIO CLAVE: Inhabilitar físicamente al usuario cambiando su estado a 'suspendido'
        $usuario = User::find($request->user_id);
        if ($usuario) {
            $usuario->update(['estado' => 'suspendido']);
        }

        return redirect()->route('suspensiones.index')->with('success', 'Suspensión aplicada y usuario inhabilitado con éxito.');
    }

    /**
     * Levantar / desactivar una suspensión activa y reactivar al usuario.
     */
    public function levantar($id)
    {
        $suspension = Suspension::findOrFail($id);
        
        $suspension->update([
            'activa' => false
        ]);

        // Verificar si el usuario tiene otras suspensiones activas antes de reactivarlo
        $tieneOtrasActivas = Suspension::where('user_id', $suspension->user_id)
            ->where('activa', true)
            ->exists();

        // Si ya no tiene más suspensiones activas, devolvemos su estado físico a 'activo'
        if (!$tieneOtrasActivas) {
            $usuario = User::find($suspension->user_id);
            if ($usuario) {
                $usuario->update(['estado' => 'activo']);
            }
        }

        return back()->with('success', 'Suspensión levantada y privilegios del usuario restaurados correctamente.');
    }
}