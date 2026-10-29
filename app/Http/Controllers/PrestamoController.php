<?php

namespace App\Http\Controllers;

use App\Models\Prestamo;
use App\Models\Ejemplar;
use App\Models\Reserva;
use App\Models\PoliticaPrestamo;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PrestamoController extends Controller
{
    public function index(Request $request)
    {
        $query = Prestamo::with(['ejemplar.recurso', 'usuario', 'bibliotecario']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('usuario', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('ejemplar', function ($q) use ($search) {
                $q->where('codigo_barras', 'like', "%{$search}%");
            });
        }

        $prestamos = $query->latest()->paginate(10);
        $ejemplaresDisponibles = Ejemplar::with('recurso')->where('estado', 'disponible')->get();
        $usuarios = User::all();

        return Inertia::render('Circulacion/Index', [
            'prestamos' => $prestamos,
            'ejemplaresDisponibles' => $ejemplaresDisponibles,
            'usuarios' => $usuarios,
            'filters' => $request->only(['search'])
        ]);
    } // <--- Asegúrate de que esta llave cierre correctamente index()

    public function create()
    {
        if (!auth()->user()->hasRole(['Administrador', 'Bibliotecario'])) {
            abort(403, 'No tienes permisos para acceder a este formulario.');
        }

        $ejemplaresDisponibles = Ejemplar::with('recurso')->where('estado', 'disponible')->get();
        $usuarios = User::all();

        return Inertia::render('Circulacion/Create', [
            'ejemplaresDisponibles' => $ejemplaresDisponibles,
            'usuarios' => $usuarios,
        ]);
    } // <--- Asegúrate de que esta llave cierre create()

    public function store(Request $request)
    {
        $request->validate([
            'ejemplar_id' => ['required', 'exists:ejemplars,id'],
            'user_id' => ['required', 'exists:users,id'],
        ]);

        $ejemplar = Ejemplar::with('recurso')->findOrFail($request->ejemplar_id);
        $usuario = User::with('tipoUsuario')->findOrFail($request->user_id);

        if ($ejemplar->estado !== 'disponible') {
            return back()->withErrors(['ejemplar_id' => 'El ejemplar no se encuentra disponible (Estado actual: ' . $ejemplar->estado . ').']);
        }

        $prestamosActivos = Prestamo::where('user_id', $usuario->id)
            ->whereIn('estado', ['activo', 'atrasado'])
            ->count();

        $maxPermitidos = $usuario->tipoUsuario ? $usuario->tipoUsuario->max_prestamos : 3;
        if ($prestamosActivos >= $maxPermitidos) {
            return back()->withErrors(['user_id' => 'El usuario ha alcanzado el límite máximo de préstamos permitidos (' . $maxPermitidos . ').']);
        }

        $tipoRecurso = $ejemplar->recurso ? $ejemplar->recurso->tipo : 'libro';
        $politica = null;
        
        if ($usuario->tipo_usuario_id) {
            $politica = PoliticaPrestamo::where('tipo_usuario_id', $usuario->tipo_usuario_id)
                ->where('tipo_recurso', $tipoRecurso)
                ->first();
        }

        $diasPrestamo = $politica ? $politica->dias_prestamo : ($usuario->tipoUsuario->dias_prestamo_default ?? 7);

        DB::transaction(function () use ($ejemplar, $usuario, $diasPrestamo) {
            Prestamo::create([
                'ejemplar_id' => $ejemplar->id,
                'user_id' => $usuario->id,
                'bibliotecario_id' => auth()->id() ?? 1,
                'fecha_prestamo' => Carbon::now(),
                'fecha_devolucion_esperada' => Carbon::now()->addDays($diasPrestamo),
                'estado' => 'activo',
                'renovaciones' => 0,
            ]);

            $ejemplar->update(['estado' => 'prestado']);
        });

        return redirect()->back()->with('success', 'Préstamo registrado exitosamente.');
    }

    public function devolver($id)
    {
        $prestamo = Prestamo::with('ejemplar')->findOrFail($id);

        if ($prestamo->estado === 'devuelto') {
            return back()->withErrors(['error' => 'Este préstamo ya fue devuelto.']);
        }

        DB::transaction(function () use ($prestamo) {
            $hoy = Carbon::now();
            $esperada = Carbon::parse($prestamo->fecha_devolucion_esperada);
            
            $prestamo->update([
                'fecha_devolucion_real' => $hoy,
                'estado' => 'devuelto',
            ]);

            if ($prestamo->ejemplar) {
                $prestamo->ejemplar->update(['estado' => 'disponible']);
            }
        });

        return redirect()->back()->with('success', 'Devolución registrada correctamente.');
    }

    public function renovar($id)
    {
        $prestamo = Prestamo::with(['ejemplar.recurso', 'usuario.tipoUsuario'])->findOrFail($id);

        if ($prestamo->estado !== 'activo') {
            return back()->withErrors(['error' => 'Solo se pueden renovar préstamos activos.']);
        }

        $recursoId = $prestamo->ejemplar->recurso_bibliografico_id ?? null;
        if ($recursoId) {
            $tieneReservas = Reserva::where('recurso_bibliografico_id', $recursoId)
                ->where('estado', 'pendiente')
                ->exists();

            if ($tieneReservas) {
                return back()->withErrors(['error' => 'No se puede renovar: existen reservas pendientes en cola para este recurso.']);
            }
        }

        $tipoUsuarioId = $prestamo->usuario->tipo_usuario_id;
        $tipoRecurso = $prestamo->ejemplar->recurso->tipo ?? 'libro';

        $politica = PoliticaPrestamo::where('tipo_usuario_id', $tipoUsuarioId)
            ->where('tipo_recurso', $tipoRecurso)
            ->first();

        $maxRenovaciones = $politica ? $politica->max_renovaciones : 1;
        $permiteRenovacion = $politica ? $politica->permite_renovacion : true;

        if (!$permiteRenovacion || $prestamo->renovaciones >= $maxRenovaciones) {
            return back()->withErrors(['error' => 'Se ha alcanzado el límite máximo de renovaciones permitidas.']);
        }

        $diasExtra = $politica ? $politica->dias_prestamo : 7;

        $prestamo->update([
            'fecha_devolucion_esperada' => Carbon::parse($prestamo->fecha_devolucion_esperada)->addDays($diasExtra),
            'renovaciones' => $prestamo->renovaciones + 1,
        ]);

        return redirect()->back()->with('success', 'Préstamo renovado exitosamente.');
    }
}