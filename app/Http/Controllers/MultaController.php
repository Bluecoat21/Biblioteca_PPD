<?php

namespace App\Http\Controllers;

use App\Models\Multa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Prestamo;
class MultaController extends Controller
{
public function index(Request $request)
    {
        $query = Multa::with(['user', 'prestamo']);

        // Blindaje por rol: Si es lector/estudiante, solo ve sus propias multas
        if (!auth()->user()->hasRole(['Administrador', 'Bibliotecario'])) {
            $query->where('user_id', auth()->id());
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $multas = $query->latest()->paginate(10);

        return Inertia::render('Circulacion/Multas', [
            'multas' => $multas,
            'filters' => $request->only(['search'])
        ]);
    }

public function create()
    {
        $usuarios = User::select('id', 'name', 'email')->get();
        $prestamos = Prestamo::select('id', 'ejemplar_id', 'user_id')->where('estado', 'activo')->get();

        return Inertia::render('Circulacion/MultasCreate', [
            'usuarios' => $usuarios,
            'prestamos' => $prestamos,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'monto' => ['required', 'numeric', 'min:0'],
            'motivo' => ['required', 'string'],
        ]);

        // Lógica existente de almacenamiento de multas...
        return redirect()->route('multas.index')->with('success', 'Multa registrada correctamente.');
    }

    public function pagar($id)
    {
        $multa = Multa::findOrFail($id);
        $multa->update([
            'estado' => 'pagada',
            'fecha_pago' => now(),
        ]);

        return back()->with('success', 'Multa marcada como pagada.');
    }
}