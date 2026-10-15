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
    // Listar préstamos activos e historiales (para la vista de bibliotecario)
    public function index(Request $request)
    {
        $query = Prestamo::with(['ejemplar.recursoBibliografico', 'usuario', 'bibliotecario']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('usuario', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('ejemplar', function ($q) use ($search) {
                $q->where('codigo_barras', 'like', "%{$search}%");
            });
        }

        $prestamos = $query->latest()->paginate(10);
        $ejemplaresDisponibles = Ejemplar::with('recursoBibliografico')->where('estado', 'disponible')->get();
        $usuarios = User::all();

        return Inertia::render('Circulation/Prestamos/Index', [
            'prestamos' => $prestamos,
            'ejemplaresDisponibles' => $ejemplaresDisponibles,
            'usuarios' => $usuarios,
            'filters' => $request->only(['search'])
        ]);
    }

    // Registrar un nuevo préstamo físico
    public function store(Request $request)
    {
        $request->validate([
            'ejemplar_id' => ['required', 'exists:ejemplars,id'],
            'user_id' => ['required', 'exists:users,id'],
        ]);

        $ejemplar = Ejemplar::with('recursoBibliografico')->findOrFail($request->ejemplar_id);
        $usuario = User::with('tipoUsuario')->findOrFail($request->user_id);

        // 1. Validar disponibilidad del ejemplar
        if ($ejemplar->estado !== 'disponible') {
            return back()->withErrors(['ejemplar_id' => 'El ejemplar no se encuentra disponible (Estado actual: ' . $ejemplar->estado . ').']);
        }

        // 2. Validar límite de préstamos activos del usuario
        $prestamosActivos = Prestamo::where('user_id', $usuario->id)
            ->whereIn('estado', ['activo', 'atrasado'])
            ->count();

        $maxPermitidos = $usuario->tipoUsuario ? $usuario->tipoUsuario->max_prestamos : 3;
        if ($prestamosActivos >= $maxPermitidos) {
            return back()->withErrors(['user_id' => 'El usuario ha alcanzado el límite máximo de préstamos permitidos (' . $maxPermitidos . ').']);
        }

        // 3. Obtener política de préstamo según tipo de usuario y recurso
        $tipoRecurso = $ejemplar->recursoBibliografico ? $ejemplar->recursoBibliografico->tipo : 'libro';
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

            // Actualizar estado del ejemplar
            $ejemplar->update(['estado' => 'prestado']);
        });

        return redirect()->back()->with('success', 'Préstamo registrado exitosamente.');
    }

    // Registrar devolución de un ejemplar
    public function devolver($id)
    {
        $prestamo = Prestamo::with('ejemplar')->findOrFail($id);

        if ($prestamo->estado === 'devuelto') {
            return back()->withErrors(['error' => 'Este préstamo ya fue devuelto.']);
        }

        DB::transaction(function () use ($prestamo) {
            $hoy = Carbon::now();
            $esperada = Carbon::parse($prestamo->fecha_devolucion_esperada);
            
            // Determinar si se devolvió a tiempo o con atraso
            $nuevoEstado = $hoy->gt($esperada) ? 'atrasado' : 'devuelto';

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

    // Renovar préstamo
    public function renovar($id)
    {
        $prestamo = Prestamo::with(['ejemplar.recursoBibliografico', 'usuario.tipoUsuario'])->findOrFail($id);

        if ($prestamo->estado !== 'activo') {
            return back()->withErrors(['error' => 'Solo se pueden renovar préstamos activos.']);
        }

        // Verificar si existen reservas pendientes para el recurso
        $recursoId = $prestamo->ejemplar->recurso_bibliografico_id ?? null;
        if ($recursoId) {
            $tieneReservas = Reserva::where('recurso_bibliografico_id', $recursoId)
                ->where('estado', 'pendiente')
                ->exists();

            if ($tieneReservas) {
                return back()->withErrors(['error' => 'No se puede renovar: existen reservas pendientes en cola para este recurso.']);
            }
        }

        // Verificar políticas de renovación
        $tipoUsuarioId = $prestamo->usuario->tipo_usuario_id;
        $tipoRecurso = $prestamo->ejemplar->recursoBibliografico->tipo ?? 'libro';

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