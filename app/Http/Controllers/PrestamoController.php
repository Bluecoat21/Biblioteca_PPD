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

        // Blindaje por rol: Si es lector/estudiante, solo ve sus propios préstamos
        if (!auth()->user()->hasRole(['Administrador', 'Bibliotecario'])) {
            $query->where('user_id', auth()->id());
        }

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
    }

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
        $usuario = User::with(['tipoUsuario', 'suspensiones', 'multas'])->findOrFail($request->user_id);

        if ($ejemplar->estado !== 'disponible') {
            return back()->withErrors(['ejemplar_id' => 'El ejemplar no se encuentra disponible (Estado actual: ' . $ejemplar->estado . ').']);
        }

        // VALIDACIÓN 1: Verificar si tiene suspensión activa
        $tieneSuspensionActiva = $usuario->suspensiones()
            ->where('activa', true)
            ->whereDate('fecha_fin', '>=', Carbon::now())
            ->exists();

        if ($tieneSuspensionActiva) {
            return back()->withErrors(['user_id' => 'El usuario cuenta con una suspensión activa y no puede solicitar préstamos.']);
        }

        // VALIDACIÓN 2: Verificar si tiene multas pendientes de pago
        $tieneMultasPendientes = $usuario->multas()
            ->where('estado', 'pendiente')
            ->exists();

        if ($tieneMultasPendientes) {
            return back()->withErrors(['user_id' => 'El usuario tiene multas pendientes de pago. Debe saldarlas antes de solicitar un nuevo préstamo.']);
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
        $prestamo = Prestamo::with(['ejemplar', 'usuario'])->findOrFail($id);

        if ($prestamo->estado === 'devuelto') {
            return back()->withErrors(['error' => 'Este préstamo ya fue devuelto.']);
        }

        DB::transaction(function () use ($prestamo) {
            $hoy = Carbon::now();
            $esperada = Carbon::parse($prestamo->fecha_devolucion_esperada);
            
            // 1. Actualizamos el estado del préstamo y la fecha real de devolución
            $prestamo->update([
                'fecha_devolucion_real' => $hoy,
                'estado' => 'devuelto',
            ]);

            // 2. Liberamos el ejemplar para que vuelva a estar disponible
            if ($prestamo->ejemplar) {
                $prestamo->ejemplar->update(['estado' => 'disponible']);
            }

            // 3. AUTOMATIZACIÓN DE MULTA POR ATRASO
            if ($hoy->greaterThan($esperada)) {
                $diasAtraso = $esperada->diffInDays($hoy);

                // Obtenemos la tarifa diaria desde la tabla configuraciones (S/. 2.00 por defecto si no existe)
                $configMonto = \App\Models\Configuracion::where('clave', 'monto_multa_dia')->value('valor');
                $tarifaDiaria = $configMonto ? floatval($configMonto) : 2.00;

                $montoTotal = $diasAtraso * $tarifaDiaria;

                \App\Models\Multa::create([
                    'user_id' => $prestamo->user_id,
                    'prestamo_id' => $prestamo->id,
                    'monto' => $montoTotal,
                    'motivo' => "Retraso automático en devolución por {$diasAtraso} día(s).",
                    'dias_atraso' => $diasAtraso,
                    'estado' => 'pendiente',
                    'fecha_generacion' => $hoy,
                    'observaciones' => 'Generado automáticamente por el sistema al procesar la devolución.',
                ]);
            }
        });

        return redirect()->back()->with('success', 'Devolución registrada correctamente y multas evaluadas.');
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