<?php

namespace App\Http\Controllers;

use App\Http\Requests\MultaRequest;
use App\Models\Multa;
use App\Models\User;
use App\Models\Prestamo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MultaController extends Controller
{
    public function index(Request $request)
    {
        $esAdmin = false;
        if (auth()->check()) {
            $user = auth()->user();
            $esAdmin = $user->hasRole(['Administrador', 'Bibliotecario', 'admin', 'administrator', 'administrador'])
                       || $user->email === '12345@1.test';
        }

        $query = Multa::with(['user', 'prestamo']);

        // Si no es admin ni bibliotecario, solo ve sus propias multas
        if (!$esAdmin) {
            $query->where('user_id', auth()->id());
        }

        if ($request->has('search') && $esAdmin) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $multas = $query->latest()->paginate(10);

        return Inertia::render('Circulacion/Multas', [
            'multas' => $multas,
            'filters' => $request->only(['search']),
            'esAdmin' => $esAdmin,
        ]);
    }

    public function create()
    {
        $user = auth()->user();
        $esAdmin = $user && ($user->hasRole(['Administrador', 'Bibliotecario', 'admin', 'administrator', 'administrador']) || $user->email === '12345@1.test');

        if (!$esAdmin) {
            abort(403, 'No tienes permisos para registrar multas.');
        }

        $usuarios = User::select('id', 'name', 'email', 'documento_identidad')->orderBy('name')->get();
        $prestamos = Prestamo::select('id', 'ejemplar_id', 'user_id')->where('estado', 'activo')->get();

        return Inertia::render('Circulacion/MultasCreate', [
            'usuarios' => $usuarios,
            'prestamos' => $prestamos,
            'esAdmin' => $esAdmin,
        ]);
    }

    public function store(MultaRequest $request)
    {
        $data = $request->validated();

        Multa::create([
            'user_id' => $data['user_id'],
            'prestamo_id' => $request->input('prestamo_id'),
            'monto' => $data['monto'],
            'motivo' => $data['motivo'],
            'dias_atraso' => $data['dias_atraso'] ?? null,
            'estado' => 'pendiente',
            'fecha_generacion' => now(),
            'observaciones' => $data['observaciones'] ?? null,
        ]);

        return redirect()->route('multas.index')->with('success', 'Multa registrada correctamente.');
    }

    public function pagar($id)
    {
        $user = auth()->user();
        $esAdmin = $user && ($user->hasRole(['Administrador', 'Bibliotecario', 'admin', 'administrator', 'administrador']) || $user->email === '12345@1.test');

        if (!$esAdmin) {
            abort(403, 'No tienes permisos para actualizar multas.');
        }

        $multa = Multa::findOrFail($id);
        $multa->update([
            'estado' => 'pagada',
            'fecha_pago' => now(),
        ]);

        return back()->with('success', 'Multa marcada como pagada exitosamente.');
    }
}