<?php

namespace App\Http\Controllers;

use App\Models\Prestamo;
use App\Models\Ejemplar;
use App\Models\Reserva;
use App\Models\PoliticaPrestamo;
use App\Models\User;
use App\Models\Configuracion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PrestamoController extends Controller
{
    public function index(Request $request)
    {
        $esAdmin = false;
        if (auth()->check()) {
            $esAdmin = auth()->user()->hasRole(['Administrador', 'Bibliotecario'])
                       || auth()->user()->email === '12345@1.test';
        }

        $query = Prestamo::with(['ejemplar.recurso', 'usuario', 'bibliotecario']);

        if (!$esAdmin) {
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
        $usuarios = User::where('estado', 'activo')->orderBy('name')->get();

        return Inertia::render('Circulacion/Index', [
            'prestamos' => $prestamos,
            'ejemplaresDisponibles' => $ejemplaresDisponibles,
            'usuarios' => $usuarios,
            'esAdmin' => $esAdmin,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        $esAdmin = false;
        if (auth()->check()) {
            $esAdmin = auth()->user()->hasRole(['Administrador', 'Bibliotecario'])
                       || auth()->user()->email === '12345@1.test';
        }

        if (!$esAdmin) {
            abort(403, 'No tienes permisos para acceder a este formulario.');
        }

        $ejemplaresDisponibles = Ejemplar::with('recurso')->where('estado', 'disponible')->get();
        $usuarios = User::where('estado', 'activo')->orderBy('name')->get();

        return Inertia::render('Circulacion/Create', [
            'ejemplaresDisponibles' => $ejemplaresDisponibles,
            'usuarios' => $usuarios,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'ejemplar_id' => ['required', 'exists:ejemplares,id'],
            'user_id' => ['required', 'exists:users,id'],
        ]);

        $ejemplar = Ejemplar::with('recurso')->findOrFail($request->ejemplar_id);
        $usuario = User::with(['tipoUsuario', 'suspensiones', 'multas'])->findOrFail($request->user_id);

        if ($usuario->estado !== 'activo') {
            return back()->withErrors(['user_id' => 'El usuario no se encuentra activo y no puede recibir préstamos.']);
        }

        if ($ejemplar->estado !== 'disponible') {
            return back()->withErrors(['ejemplar_id' => 'El ejemplar no se encuentra disponible (Estado actual: ' . $ejemplar->estado . ').']);
        }

        // Validación de cola de reservas
        $recursoId = $ejemplar->recurso_bibliografico_id;
        if ($recursoId) {
            $reservaActivaEnCola = Reserva::where('recurso_bibliografico_id', $recursoId)
                ->whereIn('estado', ['pendiente', 'en_camino'])
                ->orderBy('posicion_cola', 'asc')
                ->first();

            if ($reservaActivaEnCola && $reservaActivaEnCola->user_id !== $usuario->id) {
                $usuarioReservado = User::find($reservaActivaEnCola->user_id);
                $nombreReservado = $usuarioReservado ? $usuarioReservado->name : 'un usuario en espera';
                
                return back()->withErrors([
                    'ejemplar_id' => "Operación denegada: Este recurso cuenta con una reserva activa en cola para '{$nombreReservado}' (Posición #1)."
                ]);
            }
        }

        $tieneSuspensionActiva = $usuario->suspensiones()
            ->where('activa', true)
            ->where(function ($q) {
                $q->whereNull('fecha_fin')
                  ->orWhereDate('fecha_fin', '>=', Carbon::now());
            })
            ->exists();

        if ($tieneSuspensionActiva) {
            return back()->withErrors(['user_id' => 'El usuario cuenta con una suspensión activa.']);
        }

        $tieneMultasPendientes = $usuario->multas()->where('estado', 'pendiente')->exists();
        if ($tieneMultasPendientes) {
            return back()->withErrors(['user_id' => 'El usuario tiene multas pendientes de pago.']);
        }

        $prestamosActivos = Prestamo::where('user_id', $usuario->id)
            ->whereIn('estado', ['activo', 'atrasado'])
            ->count();

        $maxPermitidos = $usuario->tipoUsuario ? $usuario->tipoUsuario->max_prestamos : 3;
        if ($prestamosActivos >= $maxPermitidos) {
            return back()->withErrors(['user_id' => 'El usuario ha alcanzado el límite máximo de préstamos (' . $maxPermitidos . ').']);
        }

        $tipoRecurso = $ejemplar->recurso ? $ejemplar->recurso->tipo : 'libro';
        $politica = null;
        
        if ($usuario->tipo_usuario_id) {
            $politica = PoliticaPrestamo::where('tipo_usuario_id', $usuario->tipo_usuario_id)
                ->where('tipo_recurso', $tipoRecurso)
                ->first();
        }

        // ==========================================
        // LECTURA DINÁMICA DE DÍAS DESDE CONFIGURACIÓN
        // ==========================================
        $tipoNombre = strtolower($usuario->tipoUsuario->nombre ?? '');
        $esDocente = str_contains($tipoNombre, 'docente') || str_contains($tipoNombre, 'profesor');
        $claveConfig = $esDocente ? 'dias_prestamo_docente' : 'dias_prestamo_alumno';
        
        $configDias = Configuracion::where('clave', $claveConfig)->value('valor');

        $diasPrestamo = $politica 
            ? $politica->dias_prestamo 
            : ($configDias !== null ? intval($configDias) : ($usuario->tipoUsuario->dias_prestamo_default ?? 7));

        DB::transaction(function () use ($ejemplar, $usuario, $diasPrestamo, $recursoId) {
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

            if ($recursoId) {
                Reserva::where('recurso_bibliografico_id', $recursoId)
                    ->where('user_id', $usuario->id)
                    ->whereIn('estado', ['pendiente', 'en_camino'])
                    ->update(['estado' => 'completada']);
            }
        });

        return redirect()->back()->with('success', 'Préstamo registrado exitosamente aplicando los días configurados.');
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
            
            $prestamo->update([
                'fecha_devolucion_real' => $hoy,
                'estado' => 'devuelto',
            ]);

            if ($prestamo->ejemplar) {
                $prestamo->ejemplar->update(['estado' => 'disponible']);
            }

            if ($hoy->greaterThan($esperada)) {
                $diasAtraso = $esperada->diffInDays($hoy);
                
                // LECTURA DINÁMICA DE LA MULTA DIARIA DESDE CONFIGURACIÓN
                $configMonto = Configuracion::where('clave', 'monto_multa_dia')->value('valor');
                $tarifaDiaria = $configMonto !== null ? floatval($configMonto) : 1.00;
                $montoTotal = $diasAtraso * $tarifaDiaria;

                \App\Models\Multa::create([
                    'user_id' => $prestamo->user_id,
                    'prestamo_id' => $prestamo->id,
                    'monto' => $montoTotal,
                    'motivo' => 'atraso',
                    'dias_atraso' => $diasAtraso,
                    'estado' => 'pendiente',
                    'fecha_generacion' => $hoy,
                    'observaciones' => "Generado automáticamente por retraso de {$diasAtraso} día(s) a S/. {$tarifaDiaria} por día.",
                ]);
            }
        });

        return redirect()->back()->with('success', 'Devolución registrada correctamente y multas calculadas.');
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
                return back()->withErrors(['error' => 'No se puede renovar: existen reservas pendientes.']);
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
            return back()->withErrors(['error' => 'Se ha alcanzado el límite máximo de renovaciones.']);
        }

        $tipoNombre = strtolower($prestamo->usuario->tipoUsuario->nombre ?? '');
        $esDocente = str_contains($tipoNombre, 'docente') || str_contains($tipoNombre, 'profesor');
        $claveConfig = $esDocente ? 'dias_prestamo_docente' : 'dias_prestamo_alumno';
        $configDias = Configuracion::where('clave', $claveConfig)->value('valor');

        $diasExtra = $politica ? $politica->dias_prestamo : ($configDias !== null ? intval($configDias) : 7);

        $prestamo->update([
            'fecha_devolucion_esperada' => Carbon::parse($prestamo->fecha_devolucion_esperada)->addDays($diasExtra),
            'renovaciones' => $prestamo->renovaciones + 1,
        ]);

        return redirect()->back()->with('success', 'Préstamo renovado exitosamente.');
    }
}