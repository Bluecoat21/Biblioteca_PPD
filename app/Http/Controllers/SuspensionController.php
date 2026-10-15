<?php

namespace App\Http\Controllers;

use App\Http\Requests\SuspensionRequest;
use App\Models\Suspension;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SuspensionController extends Controller
{
    public function index(): Response
    {
        $suspensiones = Suspension::with(['user:id,name,documento_identidad', 'creador:id,name'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Suspension $s) => [
                'id' => $s->id,
                'usuario' => $s->user?->name,
                'documento' => $s->user?->documento_identidad,
                'motivo' => $s->motivo,
                'fecha_inicio' => $s->fecha_inicio?->format('d/m/Y'),
                'fecha_fin' => $s->fecha_fin?->format('d/m/Y') ?? 'Indefinida',
                'activa' => $s->activa,
                'creada_por' => $s->creador?->name,
            ]);

        return Inertia::render('suspensiones/index', [
            'suspensiones' => $suspensiones,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('suspensiones/create', [
            'usuarios' => User::where('estado', 'activo')
                ->orderBy('name')
                ->get(['id', 'name', 'documento_identidad']),
        ]);
    }

    public function store(SuspensionRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $usuario = User::findOrFail($data['user_id']);

        if ($usuario->id === auth()->id()) {
            return back()->withErrors([
                'user_id' => 'No puedes suspender tu propio usuario.',
            ]);
        }

        if ($usuario->suspensiones()->where('activa', true)->exists()) {
            return back()->withErrors([
                'user_id' => 'Este usuario ya tiene una suspensión activa.',
            ]);
        }

        DB::transaction(function () use ($data, $usuario) {
            Suspension::create($data + [
                'activa' => true,
                'created_by' => auth()->id(),
            ]);

            $usuario->update([
                'estado' => 'suspendido',
                'fecha_suspension_hasta' => $data['fecha_fin'] ?? null,
            ]);
        });

        return redirect('/suspensiones');
    }

    public function levantar(Suspension $suspension): RedirectResponse
    {
        if (! $suspension->activa) {
            return back()->withErrors([
                'suspension' => 'Esta suspensión ya fue levantada.',
            ]);
        }

        DB::transaction(function () use ($suspension) {
            $suspension->update(['activa' => false]);

            $usuario = $suspension->user;

            if ($usuario && $usuario->estado === 'suspendido') {
                $usuario->update([
                    'estado' => 'activo',
                    'fecha_suspension_hasta' => null,
                ]);
            }
        });

        return redirect('/suspensiones');
    }
}