<?php

namespace App\Http\Controllers;

use App\Models\Ejemplar;
use App\Models\MovimientoEjemplar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class MovimientoController extends Controller
{
    // CU-17 y CU-18: Registrar cualquier cambio de estado
    public function registrarMovimiento(Request $request)
    {
        $validated = $request->validate([
            'ejemplar_id' => 'required|exists:ejemplares,id',
            'estado_nuevo' => ['required', Rule::in(['disponible', 'prestado', 'reservado', 'perdido', 'dañado', 'mantenimiento'])],
            'motivo' => 'nullable|string|max:500',
            'user_id' => 'required|exists:users,id' // En producción real, usar auth()->id()
        ]);

        return DB::transaction(function () use ($validated) {
            $ejemplar = Ejemplar::findOrFail($validated['ejemplar_id']);
            
            // Evitar registrar el mismo estado
            if ($ejemplar->estado === $validated['estado_nuevo']) {
                return response()->json(['message' => 'El ejemplar ya se encuentra en ese estado.'], 400);
            }

            $estadoAnterior = $ejemplar->estado;

            // Actualizar Ejemplar
            $ejemplar->update(['estado' => $validated['estado_nuevo']]);

            // Registrar Auditoría (Historial)
            $movimiento = MovimientoEjemplar::create([
                'ejemplar_id' => $ejemplar->id,
                'estado_anterior' => $estadoAnterior,
                'estado_nuevo' => $validated['estado_nuevo'],
                'motivo' => $validated['motivo'] ?? 'Cambio de estado manual',
                'user_id' => $validated['user_id'],
            ]);

            return response()->json([
                'message' => 'Movimiento registrado exitosamente',
                'movimiento' => $movimiento
            ], 201);
        });
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