<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\RecursoBibliografico;

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

// --- CONTROLADORES DE USUARIOS Y AUTH ---
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\SuspensionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;

// --- MIDDLEWARES DE SPATIE ---
use Spatie\Permission\Middleware\RoleMiddleware;

// Rutas públicas (invitados)
Route::middleware('guest')->group(function () {
    Route::inertia('/', 'welcome')->name('home');
    
    // Rutas de Registro Web
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);

    // Rutas de Recuperación de Contraseña
    Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');
});

// Grupo principal protegido por autenticación, verificación y prevención de caché
Route::middleware(['auth', 'verified', 'cache.headers:no_store,no_cache,must_revalidate'])->group(function () {

    // Dashboard principal del sistema
    Route::get('/dashboard', function () {
        $user = auth()->user();
        if ($user) {
            $user->load(['roles', 'tipoUsuario']);
        }

        $recursosRecientes = RecursoBibliografico::latest()->take(8)->get();

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->getRoleNames(),
                    'tipoUsuario' => $user->tipoUsuario,
                ] : null,
            ],
            'recursosRecientes' => $recursosRecientes, 
        ]);
    })->name('dashboard');

    /*
    |--------------------------------------------------------------------------
    | MÓDULO 1: CATÁLOGOS Y RECURSOS BIBLIOGRÁFICOS
    |--------------------------------------------------------------------------
    */
    Route::resource('recursos', RecursoBibliograficoController::class);
    Route::get('recursos/{recurso}/descargar', [RecursoBibliograficoController::class, 'descargarArchivo'])->name('recursos.descargar');

    Route::get('autores', [AutorController::class, 'index'])->name('autores.index');
    Route::get('editoriales', [EditorialController::class, 'index'])->name('editoriales.index');
    Route::get('categorias', [CategoriaController::class, 'index'])->name('categorias.index');

    Route::post('autores', [AutorController::class, 'store'])->name('autores.store');
    Route::put('autores/{autor}', [AutorController::class, 'update'])->name('autores.update');
    Route::delete('autores/{autor}', [AutorController::class, 'destroy'])->name('autores.destroy');

    Route::post('editoriales', [EditorialController::class, 'store'])->name('editoriales.store');
    Route::put('editoriales/{editorial}', [EditorialController::class, 'update'])->name('editoriales.update');
    Route::delete('editoriales/{editorial}', [EditorialController::class, 'destroy'])->name('editoriales.destroy');

    Route::post('categorias', [CategoriaController::class, 'store'])->name('categorias.store');
    Route::put('categorias/{categoria}', [CategoriaController::class, 'update'])->name('categorias.update');
    Route::delete('categorias/{categoria}', [CategoriaController::class, 'destroy'])->name('categorias.destroy');

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
    Route::post('/prestamos/{id}/devolver', [PrestamoController::class, 'devolver'])->name('prestamos.devolver');
    Route::post('/prestamos/{id}/renovar', [PrestamoController::class, 'renovar'])->name('prestamos.renovar');

    // Reservas
    Route::get('/reservas', [ReservaController::class, 'index'])->name('reservas.index');
    Route::post('/reservas', [ReservaController::class, 'store'])->name('reservas.store');
    Route::post('/reservas/{id}/completar', [ReservaController::class, 'completar'])->name('reservas.completar');
    Route::post('/reservas/{id}/notificar-retiro', [ReservaController::class, 'notificarRetiro'])->name('reservas.notificar');
    Route::post('/reservas/{id}/cancelar', [ReservaController::class, 'cancelar'])->name('reservas.cancelar');

    // Movimientos
    Route::post('/movimientos', [MovimientoController::class, 'registrarMovimiento'])->name('movimientos.registrar');
    Route::get('/ejemplares/{ejemplarId}/historial', [MovimientoController::class, 'historialEjemplar'])->name('ejemplares.historial');

    // Multas: Index abierto para que los estudiantes consulten su historial y el admin gestione
    Route::get('multas', [MultaController::class, 'index'])->name('multas.index');
    
    // Rutas protegidas exclusivamente para Administradores y Bibliotecarios usando la barra vertical (|)
    Route::middleware([RoleMiddleware::class . ':Administrador|Bibliotecario|admin|administrator|administrador'])->group(function () {
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
    Route::middleware([RoleMiddleware::class . ':Administrador|Bibliotecario|admin|administrator|administrador'])->group(function () {
        Route::get('/configuraciones', [ConfiguracionController::class, 'index'])->name('configuraciones.index');
        Route::post('/configuraciones', [ConfiguracionController::class, 'updateOrCreate'])->name('configuraciones.updateOrCreate');

        Route::resource('ubicaciones', UbicacionController::class);
        Route::resource('politicas-prestamo', PoliticaPrestamoController::class)->except(['show', 'edit', 'update']);

        Route::get('tipos-usuario', [TipoUsuarioController::class, 'index'])->name('tipos-usuario.index');
        Route::get('tipos-usuario/create', [TipoUsuarioController::class, 'create'])->name('tipos-usuario.create');
        Route::post('tipos-usuario', [TipoUsuarioController::class, 'store'])->name('tipos-usuario.store');
        Route::get('tipos-usuario/{tipoUsuario}/edit', [TipoUsuarioController::class, 'edit'])->name('tipos-usuario.edit');
        Route::put('tipos-usuario/{tipoUsuario}', [TipoUsuarioController::class, 'update'])->name('tipos-usuario.update');
        Route::delete('tipos-usuario/{tipoUsuario}', [TipoUsuarioController::class, 'destroy'])->name('tipos-usuario.destroy');

        // Reportes
        Route::get('/reportes/dashboard', [ReporteController::class, 'dashboard'])->name('reportes.dashboard');
        Route::get('/reportes/movimientos', [ReporteController::class, 'reporteMovimientos'])->name('reportes.movimientos');
    });


    /*
    |--------------------------------------------------------------------------
    | MÓDULO 4: GESTIÓN DE USUARIOS Y SUSPENSIONES
    |--------------------------------------------------------------------------
    */
    Route::middleware([RoleMiddleware::class . ':Administrador|Bibliotecario|admin|administrator|administrador'])->group(function () {
        Route::get('usuarios', [UsuarioController::class, 'index'])->name('usuarios.index');
        Route::get('usuarios/create', [UsuarioController::class, 'create'])->name('usuarios.create');
        Route::post('usuarios', [UsuarioController::class, 'store'])->name('usuarios.store');
        Route::get('usuarios/{usuario}/edit', [UsuarioController::class, 'edit'])->name('usuarios.edit');
        Route::put('usuarios/{usuario}', [UsuarioController::class, 'update'])->name('usuarios.update');

        Route::get('suspensiones', [SuspensionController::class, 'index'])->name('suspensiones.index');
        Route::get('suspensiones/create', [SuspensionController::class, 'create'])->name('suspensiones.create');
        Route::post('suspensiones', [SuspensionController::class, 'store'])->name('suspensiones.store');
        Route::post('suspensiones/{suspension}/levantar', [SuspensionController::class, 'levantar'])->name('suspensiones.levantar');
    });
});

require __DIR__.'/settings.php';