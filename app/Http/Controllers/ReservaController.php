<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use App\Models\RecursoBibliografico;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReservaController extends Controller
{
    // Listar reservas pendientes
    public function index(Request $request)
    {
        $query = Reserva::with(['recursoBibliografico', 'usuario']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('usuario', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('recursoBibliografico', function ($q) use ($search) {
                $q->where('titulo', 'like', "%{$search}%");
            });
        }

        $reservas = $query->latest()->paginate(10);
        $recursosDisponibles = \App\Models\RecursoBibliografico::all();
        $usuarios = \App\Models\User::all();

        return Inertia::render('Circulation/Reservas/Index', [
            'reservas' => $reservas,
            'recursosDisponibles' => $recursosDisponibles,
            'usuarios' => $usuarios,
            'filters' => $request->only(['search'])
        ]);
    }

    // Crear una nueva reserva (cola de espera)
    public function store(Request $request)
    {
        $request->validate([
            'recurso_bibliografico_id' => ['required', 'exists:recursos_bibliograficos,id'],
            'user_id' => ['required', 'exists:users,id'],
        ]);

        // Verificar si el usuario ya tiene una reserva activa para el mismo recurso
        $reservaExistente = Reserva::where('recurso_bibliografico_id', $request->recurso_bibliografico_id)
            ->where('user_id', $request->user_id)
            ->where('estado', 'pendiente')
            ->exists();

        if ($reservaExistente) {
            return back()->withErrors(['error' => 'El usuario ya cuenta con una reserva pendiente para este recurso.']);
        }

        // Calcular posición actual en la cola
        $ultimaPosicion = Reserva::where('recurso_bibliografico_id', $request->recurso_bibliografico_id)
            ->where('estado', 'pendiente')
            ->max('posicion_cola') ?? 0;

        Reserva::create([
            'recurso_bibliografico_id' => $request->recurso_bibliografico_id,
            'user_id' => $request->user_id,
            'fecha_reserva' => Carbon::now(),
            'fecha_expiracion' => Carbon::now()->addDays(3), // 3 días para recoger o expirar por defecto
            'estado' => 'pendiente',
            'posicion_cola' => $ultimaPosicion + 1,
        ]);

        return redirect()->back()->with('success', 'Reserva registrada exitosamente en la cola de espera.');
    }

    // Cancelar una reserva
    public function cancelar($id)
    {
        $reserva = Reserva::findOrFail($id);

        if ($reserva->estado !== 'pendiente') {
            return back()->withErrors(['error' => 'Solo se pueden cancelar reservas pendientes.']);
        }

        DB::transaction(function () use ($reserva) {
            $recursoId = $reserva->recurso_bibliografico_id;
            $posicionCancelada = $reserva->posicion_cola;

            $reserva->update(['estado' => 'cancelada']);

            // Reorganizar las posiciones de la cola de espera restantes
            Reserva::where('recurso_bibliografico_id', $recursoId)
                ->where('estado', 'pendiente')
                ->where('posicion_cola', '>', $posicionCancelada)
                ->decrement('posicion_cola');
        });

        return redirect()->back()->with('success', 'Reserva cancelada correctamente.');
    }
}