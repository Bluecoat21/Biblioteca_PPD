<?php

namespace App\Http\Controllers;

use App\Models\Ejemplar;
use App\Models\MovimientoEjemplar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MovimientoController extends Controller
{
    public function registrarMovimiento(Request $request)
    {
        $validated = $request->validate([
            'ejemplar_id' => 'required|exists:ejemplares,id',
            'estado_nuevo' => ['required', Rule::in(['disponible', 'prestado', 'reservado', 'perdido', 'dañado', 'mantenimiento'])],
            'motivo' => 'nullable|string|max:500',
        ]);

        DB::transaction(function () use ($validated) {
            $ejemplar = Ejemplar::findOrFail($validated['ejemplar_id']);
            
            if ($ejemplar->estado === $validated['estado_nuevo']) {
                return;
            }

            $estadoAnterior = $ejemplar->estado;

            $ejemplar->update(['estado' => $validated['estado_nuevo']]);

            MovimientoEjemplar::create([
                'ejemplar_id' => $ejemplar->id,
                'estado_anterior' => $estadoAnterior,
                'estado_nuevo' => $validated['estado_nuevo'],
                'motivo' => $validated['motivo'] ?? 'Cambio de estado manual',
                'user_id' => auth()->id() ?? 1,
            ]);
        });

        return redirect()->back()->with('success', 'Movimiento registrado exitosamente.');
    }

    public function historialEjemplar($ejemplarId)
    {
        $movimientos = MovimientoEjemplar::with('user:id,name')
            ->where('ejemplar_id', $ejemplarId)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($movimientos);
    }
}