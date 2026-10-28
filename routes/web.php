<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// --- CONTROLADORES DE CATÁLOGOS ---
use App\Http\Controllers\AutorController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\EditorialController;
use App\Http\Controllers\EjemplarController;
use App\Http\Controllers\RecursoBibliograficoController;

// --- CONTROLADORES DE CIRCULACIÓN ---
use App\Http\Controllers\PrestamoController;
use App\Http\Controllers\ReservaController;
use App\Http\Controllers\MultaController;
use App\Http\Controllers\MovimientoController;

// --- CONTROLADORES DE CONFIGURACIÓN ---
use App\Http\Controllers\ConfiguracionController;
use App\Http\Controllers\UbicacionController;
use App\Http\Controllers\TipoUsuarioController;
use App\Http\Controllers\PoliticaPrestamoController;
use App\Http\Controllers\ReporteController;

// --- CONTROLADORES DE USUARIOS ---
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\SuspensionController;

// Ruta pública de bienvenida
Route::inertia('/', 'welcome')->name('home');

// Grupo principal protegido por autenticación y verificación
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard principal del sistema
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    })->name('dashboard');

    /*
    |--------------------------------------------------------------------------
    | MÓDULO 1: CATÁLOGOS Y RECURSOS BIBLIOGRÁFICOS
    |--------------------------------------------------------------------------
    */
    Route::resource('recursos', RecursoBibliograficoController::class);
    Route::resource('autores', AutorController::class);
    Route::resource('editoriales', EditorialController::class);
    Route::resource('categorias', CategoriaController::class);

    // Gestión de Ejemplares (Anidados a Recursos)
    Route::post('recursos/{recurso}/ejemplares', [EjemplarController::class, 'store'])->name('ejemplares.store');
    Route::put('ejemplares/{ejemplar}', [EjemplarController::class, 'update'])->name('ejemplares.update');
    Route::delete('ejemplares/{ejemplar}', [EjemplarController::class, 'destroy'])->name('ejemplares.destroy');


    /*
    |--------------------------------------------------------------------------
    | MÓDULO 2: CIRCULACIÓN (PRÉSTAMOS, RESERVAS, MULTAS Y MOVIMIENTOS)
    |--------------------------------------------------------------------------
    */
    // Préstamos
    Route::get('/prestamos', [PrestamoController::class, 'index'])->name('prestamos.index');
    Route::get('/prestamos/create', [PrestamoController::class, 'create'])->name('prestamos.create');
    Route::post('/prestamos', [PrestamoController::class, 'store'])->name('prestamos.store');
    Route::put('/prestamos/{id}/devolver', [PrestamoController::class, 'devolver'])->name('prestamos.devolver');
    Route::put('/prestamos/{id}/renovar', [PrestamoController::class, 'renovar'])->name('prestamos.renovar');

    // Reservas
    Route::get('/reservas', [ReservaController::class, 'index'])->name('reservas.index');
    Route::post('/reservas', [ReservaController::class, 'store'])->name('reservas.store');
    Route::post('/reservas/{id}/cancelar', [ReservaController::class, 'cancelar'])->name('reservas.cancelar');

    // Movimientos de Ejemplares (Auditoría de estados)
    Route::post('/movimientos', [MovimientoController::class, 'registrarMovimiento'])->name('movimientos.registrar');
    Route::get('/ejemplares/{ejemplarId}/historial', [MovimientoController::class, 'historialEjemplar'])->name('ejemplares.historial');

    // Multas
    Route::get('multas', [MultaController::class, 'index'])->middleware('can:multas.ver')->name('multas.index');
    Route::middleware('can:multas.gestionar')->group(function () {
        Route::get('multas/create', [MultaController::class, 'create'])->name('multas.create');
        Route::post('multas', [MultaController::class, 'store'])->name('multas.store');
        Route::post('multas/{multa}/pagar', [MultaController::class, 'pagar'])->name('multas.pagar');
        Route::post('multas/{multa}/condonar', [MultaController::class, 'condonar'])->name('multas.condonar');
    });


    /*
    |--------------------------------------------------------------------------
    | MÓDULO 3: CONFIGURACIÓN Y PARÁMETROS INSTITUCIONALES
    |--------------------------------------------------------------------------
    */
    // Parámetros Generales del Sistema
    Route::get('/configuraciones', [ConfiguracionController::class, 'index'])->name('configuraciones.index');
    Route::post('/configuraciones', [ConfiguracionController::class, 'updateOrCreate'])->name('configuraciones.updateOrCreate');

    // Ubicaciones físicas
    Route::resource('ubicaciones', UbicacionController::class);

    // Políticas de Préstamo
    Route::resource('politicas-prestamo', PoliticaPrestamoController::class)->except(['show', 'edit', 'update']);

    // Tipos de Usuario
    Route::get('tipos-usuario', [TipoUsuarioController::class, 'index'])->middleware('can:tipos-usuario.ver')->name('tipos-usuario.index');
    Route::middleware('can:tipos-usuario.gestionar')->group(function () {
        Route::get('tipos-usuario/create', [TipoUsuarioController::class, 'create'])->name('tipos-usuario.create');
        Route::post('tipos-usuario', [TipoUsuarioController::class, 'store'])->name('tipos-usuario.store');
        Route::get('tipos-usuario/{tipoUsuario}/edit', [TipoUsuarioController::class, 'edit'])->name('tipos-usuario.edit');
        Route::put('tipos-usuario/{tipoUsuario}', [TipoUsuarioController::class, 'update'])->name('tipos-usuario.update');
        Route::delete('tipos-usuario/{tipoUsuario}', [TipoUsuarioController::class, 'destroy'])->name('tipos-usuario.destroy');
    });

    // Reportes y Estadísticas
    Route::get('/reportes/dashboard', [ReporteController::class, 'dashboard'])->name('reportes.dashboard');
    Route::get('/reportes/movimientos', [ReporteController::class, 'reporteMovimientos'])->name('reportes.movimientos');


    /*
    |--------------------------------------------------------------------------
    | MÓDULO 4: GESTIÓN DE USUARIOS Y SUSPENSIONES
    |--------------------------------------------------------------------------
    */
    // Usuarios del Sistema
    Route::get('usuarios', [UsuarioController::class, 'index'])->middleware('can:usuarios.ver')->name('usuarios.index');
    Route::middleware('can:usuarios.gestionar')->group(function () {
        Route::get('usuarios/create', [UsuarioController::class, 'create'])->name('usuarios.create');
        Route::post('usuarios', [UsuarioController::class, 'store'])->name('usuarios.store');
        Route::get('usuarios/{usuario}/edit', [UsuarioController::class, 'edit'])->name('usuarios.edit');
        Route::put('usuarios/{usuario}', [UsuarioController::class, 'update'])->name('usuarios.update');
        Route::delete('usuarios/{usuario}', [UsuarioController::class, 'destroy'])->name('usuarios.destroy');
    });

    // Suspensiones de Usuarios
    Route::get('suspensiones', [SuspensionController::class, 'index'])->middleware('can:suspensiones.ver')->name('suspensiones.index');
    Route::middleware('can:suspensiones.gestionar')->group(function () {
        Route::get('suspensiones/create', [SuspensionController::class, 'create'])->name('suspensiones.create');
        Route::post('suspensiones', [SuspensionController::class, 'store'])->name('suspensiones.store');
        Route::post('suspensiones/{suspension}/levantar', [SuspensionController::class, 'levantar'])->name('suspensiones.levantar');
    });
});

require __DIR__.'/settings.php';