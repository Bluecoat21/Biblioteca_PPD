<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservaController extends Controller
{
    public function index(Request $request)
    {
        $query = Reserva::with(['usuario', 'recursoBibliografico']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('usuario', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $reservas = $query->latest()->paginate(10);

        return Inertia::render('Circulacion/Reservas', [
            'reservas' => $reservas,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'recurso_bibliografico_id' => ['required', 'exists:recursos_bibliograficos,id'],
            'user_id' => ['required', 'exists:users,id'],
        ]);

        // Validar si el usuario ya tiene una reserva pendiente para este recurso
        $reservaExistente = Reserva::where('user_id', $request->user_id)
            ->where('recurso_bibliografico_id', $request->recurso_bibliografico_id)
            ->where('estado', 'pendiente')
            ->exists();

        if ($reservaExistente) {
            return back()->withErrors(['error' => 'Ya cuenta con una reserva pendiente para este recurso bibliográfico.']);
        }

        // Calcular la posición actual en la cola de espera
        $posicionCola = Reserva::where('recurso_bibliografico_id', $request->recurso_bibliografico_id)
            ->where('estado', 'pendiente')
            ->count() + 1;

        Reserva::create([
            'recurso_bibliografico_id' => $request->recurso_bibliografico_id,
            'user_id' => $request->user_id,
            'fecha_reserva' => now(),
            'fecha_expiracion' => now()->addDays(3), // Margen de 3 días
            'estado' => 'pendiente',
            'posicion_cola' => $posicionCola,
        ]);

        return redirect()->back()->with('success', "Reserva registrada con éxito. Posición en cola: #{$posicionCola}");
    }

    public function cancelar($id)
    {
        $reserva = Reserva::findOrFail($id);
        $reserva->update(['estado' => 'cancelada']);

        return back()->with('success', 'Reserva cancelada correctamente.');
    }
}