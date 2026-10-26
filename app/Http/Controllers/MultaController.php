<?php

namespace App\Http\Controllers;

use App\Http\Requests\MultaRequest;
use App\Models\Multa;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MultaController extends Controller
{
    public function index(): Response
    {
        $multas = Multa::with('user:id,name,documento_identidad')
            ->orderByDesc('fecha_generacion')
            ->get()
            ->map(fn (Multa $m) => [
                'id' => $m->id,
                'usuario' => $m->user?->name,
                'documento' => $m->user?->documento_identidad,
                'motivo' => $m->motivo,
                'monto' => $m->monto,
                'dias_atraso' => $m->dias_atraso,
                'estado' => $m->estado,
                'fecha_generacion' => $m->fecha_generacion?->format('d/m/Y H:i'),
                'fecha_pago' => $m->fecha_pago?->format('d/m/Y H:i'),
                'observaciones' => $m->observaciones,
            ]);

return Inertia::render('Circulacion/Multas', ['multas' => $multas]);
    }

    public function create(): Response
    {
        return Inertia::render('Circulacion/Multas', [
            'usuarios' => User::orderBy('name')->get(['id', 'name', 'documento_identidad']),
        ]);
    }

    public function store(MultaRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['estado'] = 'pendiente';
        $data['fecha_generacion'] = now();

        Multa::create($data);
        return redirect()->route('multas.index');
    }

    public function pagar(Multa $multa): RedirectResponse
    {
        if ($multa->estado !== 'pendiente') {
            return back()->withErrors([
                'multa' => 'Solo se puede pagar una multa pendiente.',
            ]);
        }

        $multa->update([
            'estado' => 'pagada',
            'fecha_pago' => now(),
        ]);

        return redirect()->route('multas.index');
    }

    public function condonar(Multa $multa): RedirectResponse
    {
        if ($multa->estado !== 'pendiente') {
            return back()->withErrors([
                'multa' => 'Solo se puede condonar una multa pendiente.',
            ]);
        }

        $multa->update(['estado' => 'condonada']);
        return redirect()->route('multas.index');
    }
}