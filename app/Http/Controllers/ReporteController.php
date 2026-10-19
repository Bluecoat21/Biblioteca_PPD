<?php

namespace App\Http\Controllers;

use App\Models\Ejemplar;
use App\Models\MovimientoEjemplar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReporteController extends Controller
{
    public function dashboard()
    {
        // 1. Conteo de ejemplares por estado
        $estados = Ejemplar::select('estado', DB::raw('count(*) as total'))
            ->groupBy('estado')
            ->pluck('total', 'estado');

        // 2. Movimientos recientes (últimos 7 días)
        $movimientosRecientes = MovimientoEjemplar::with(['ejemplar', 'user:id,name'])
            ->where('created_at', '>=', now()->subDays(7))
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // 3. Ejemplares perdidos o dañados (Alerta)
        $alertas = Ejemplar::whereIn('estado', ['perdido', 'dañado'])->count();

        return response()->json([
            'resumen_estados' => $estados,
            'alertas_perdidos_dañados' => $alertas,
            'movimientos_recientes' => $movimientosRecientes
        ]);
    }

    public function reporteMovimientos(Request $request)
    {
        $request->validate([
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
        ]);

        $reporte = MovimientoEjemplar::with(['ejemplar.recursoBibliografico', 'user'])
            ->whereBetween('created_at', [$request->fecha_inicio . ' 00:00:00', $request->fecha_fin . ' 23:59:59'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reporte);
    }
}