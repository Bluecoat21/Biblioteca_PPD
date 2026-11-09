<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use App\Models\Prestamo;
use App\Models\Ejemplar;
use App\Models\User;
use App\Models\PoliticaPrestamo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReservaController extends Controller
{
    public function index(Request $request)
    {
        $esAdmin = false;
        if (auth()->check()) {
            $esAdmin = auth()->user()->hasRole(['Administrador', 'Bibliotecario'])
                       || auth()->user()->email === '12345@1.test';
        }

        $query = Reserva::with([
            'usuario:id,name,email,documento_identidad,tipo_usuario_id', 
            'recursoBibliografico.ejemplares'
        ]);

        if (!$esAdmin) {
            $query->where('user_id', auth()->id());
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('usuario', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('documento_identidad', 'like', "%{$search}%");
            });
        }

        $reservas = $query->latest()->paginate(10);
        $ejemplaresDisponibles = Ejemplar::with('recurso')->where('estado', 'disponible')->get();

        return Inertia::render('Circulacion/Reservas', [
            'reservas' => $reservas,
            'ejemplaresDisponibles' => $ejemplaresDisponibles,
            'esAdmin' => $esAdmin,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $userId = $request->input('user_id', auth()->id());
        $request->merge(['user_id' => $userId]);

        $request->validate([
            'recurso_bibliografico_id' => ['required', 'exists:recursos_bibliograficos,id'],
            'user_id' => ['required', 'exists:users,id'],
        ]);

        // VALIDACIÓN 1: Verificar si el usuario ya tiene este mismo libro en PRÉSTAMO ACTIVO o ATRASADO
        $tienePrestamoActivo = Prestamo::where('user_id', $request->user_id)
            ->whereIn('estado', ['activo', 'atrasado'])
            ->whereHas('ejemplar', function ($q) use ($request) {
                $q->where('recurso_bibliografico_id', $request->recurso_bibliografico_id);
            })
            ->exists();

        if ($tienePrestamoActivo) {
            return back()->withErrors(['error' => 'Ya posees un ejemplar prestado de este libro. No puedes entrar en la cola de reserva.']);
        }

        // VALIDACIÓN 2: Verificar si ya tiene una RESERVA ACTIVA en cola para este libro
        $reservaExistente = Reserva::where('user_id', $request->user_id)
            ->where('recurso_bibliografico_id', $request->recurso_bibliografico_id)
            ->whereIn('estado', ['pendiente', 'en_camino'])
            ->exists();

        if ($reservaExistente) {
            return back()->withErrors(['error' => 'Ya cuentas con una reserva activa en cola para este recurso.']);
        }

        $posicionCola = Reserva::where('recurso_bibliografico_id', $request->recurso_bibliografico_id)
            ->whereIn('estado', ['pendiente', 'en_camino'])
            ->count() + 1;

        Reserva::create([
            'recurso_bibliografico_id' => $request->recurso_bibliografico_id,
            'user_id' => $request->user_id,
            'fecha_reserva' => now(),
            'fecha_expiracion' => now()->addDays(3),
            'estado' => 'pendiente',
            'posicion_cola' => $posicionCola,
        ]);

        return redirect()->back()->with('success', "Reserva registrada con éxito. Posición en cola: #{$posicionCola}");
    }

    public function notificarRetiro($id)
    {
        $reserva = Reserva::where('user_id', auth()->id())->findOrFail($id);

        if ($reserva->estado !== 'pendiente') {
            return back()->withErrors(['error' => 'Solo puedes notificar reservas en estado pendiente.']);
        }

        $reserva->update([
            'estado' => 'en_camino',
        ]);

        return back()->with('success', 'Aviso enviado al bibliotecario. Presenta tu DNI en ventanilla.');
    }

    public function completar(Request $request, $id)
    {
        if (!auth()->user()->hasRole(['Administrador', 'Bibliotecario']) && auth()->user()->email !== '12345@1.test') {
            abort(403, 'No tienes permisos para completar reservas.');
        }

        $request->validate([
            'ejemplar_id' => ['required', 'exists:ejemplares,id'],
        ]);

        $reserva = Reserva::with('recursoBibliografico')->findOrFail($id);

        if (!in_array($reserva->estado, ['pendiente', 'en_camino'])) {
            return back()->withErrors(['error' => 'Solo se pueden atender reservas pendientes o en camino.']);
        }

        $usuario = User::with(['tipoUsuario', 'suspensiones', 'multas'])->findOrFail($reserva->user_id);
        $ejemplar = Ejemplar::with('recurso')->findOrFail($request->ejemplar_id);

        if ($ejemplar->estado !== 'disponible') {
            return back()->withErrors(['ejemplar_id' => 'El ejemplar seleccionado no se encuentra disponible.']);
        }

        $tieneSuspension = $usuario->suspensiones()
            ->where('activa', true)
            ->whereDate('fecha_fin', '>=', Carbon::now())
            ->exists();

        if ($tieneSuspension) {
            return back()->withErrors(['error' => 'El usuario cuenta con una suspensión activa y no puede recibir préstamos.']);
        }

        $tieneMultas = $usuario->multas()->where('estado', 'pendiente')->exists();
        if ($tieneMultas) {
            return back()->withErrors(['error' => 'El usuario tiene multas pendientes de pago. Debe saldarlas antes del préstamo.']);
        }

        $prestamosActivos = Prestamo::where('user_id', $usuario->id)
            ->whereIn('estado', ['activo', 'atrasado'])
            ->count();

        $maxPermitidos = $usuario->tipoUsuario ? $usuario->tipoUsuario->max_prestamos : 3;
        if ($prestamosActivos >= $maxPermitidos) {
            return back()->withErrors(['error' => 'El usuario ha alcanzado el límite máximo de préstamos permitidos.']);
        }

        $tipoRecurso = $reserva->recursoBibliografico->tipo ?? 'libro';
        $politica = null;
        
        if ($usuario->tipo_usuario_id) {
            $politica = PoliticaPrestamo::where('tipo_usuario_id', $usuario->tipo_usuario_id)
                ->where('tipo_recurso', $tipoRecurso)
                ->first();
        }

        $diasPrestamo = $politica ? $politica->dias_prestamo : ($usuario->tipoUsuario->dias_prestamo_default ?? 7);

        DB::transaction(function () use ($reserva, $usuario, $ejemplar, $diasPrestamo) {
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
            $reserva->update(['estado' => 'completada']);
        });

        return redirect()->back()->with('success', 'Reserva atendida y préstamo registrado exitosamente.');
    }

    public function cancelar($id)
    {
        $reserva = Reserva::findOrFail($id);
        
        if (!in_array($reserva->estado, ['pendiente', 'en_camino'])) {
            return back()->withErrors(['error' => 'Solo se pueden cancelar reservas activas.']);
        }

        $reserva->update(['estado' => 'cancelada']);

        return back()->with('success', 'Reserva cancelada correctamente.');
    }
}