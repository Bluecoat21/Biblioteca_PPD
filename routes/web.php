<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AutorController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\EditorialController;
use App\Http\Controllers\EjemplarController;
use App\Http\Controllers\RecursoBibliograficoController;

use App\Http\Controllers\PrestamoController;
use App\Http\Controllers\ReservaController;

use App\Http\Controllers\MultaController;
use App\Http\Controllers\SuspensionController;
use App\Http\Controllers\TipoUsuarioController;
use App\Http\Controllers\UsuarioController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    /*
    |--------------------------------------------------------------------------
    | MÓDULO 1 - RECURSOS BIBLIOGRÁFICOS
    |--------------------------------------------------------------------------
    */

    Route::resource('recursos', RecursoBibliograficoController::class);

    Route::resource('autores', AutorController::class);

    Route::resource('editoriales', EditorialController::class);

    Route::resource('categorias', CategoriaController::class);

    Route::post(
        'recursos/{recurso}/ejemplares',
        [EjemplarController::class, 'store']
    )->name('ejemplares.store');

    Route::put(
        'ejemplares/{ejemplar}',
        [EjemplarController::class, 'update']
    )->name('ejemplares.update');

    Route::delete(
        'ejemplares/{ejemplar}',
        [EjemplarController::class, 'destroy']
    )->name('ejemplares.destroy');

    /*
    |--------------------------------------------------------------------------
    | MÓDULO 2 - PRÉSTAMOS
    |--------------------------------------------------------------------------
    */

    Route::get('/prestamos', [PrestamoController::class, 'index'])
        ->name('prestamos.index');

    Route::post('/prestamos', [PrestamoController::class, 'store'])
        ->name('prestamos.store');

    Route::put('/prestamos/{id}/devolver', [PrestamoController::class, 'devolver'])
        ->name('prestamos.devolver');

    Route::put('/prestamos/{id}/renovar', [PrestamoController::class, 'renovar'])
        ->name('prestamos.renovar');

    /*
    |--------------------------------------------------------------------------
    | MÓDULO 3 - RESERVAS
    |--------------------------------------------------------------------------
    */

    Route::get('/reservas', [ReservaController::class, 'index'])
        ->name('reservas.index');

    Route::post('/reservas', [ReservaController::class, 'store'])
        ->name('reservas.store');

    Route::put('/reservas/{id}/cancelar', [ReservaController::class, 'cancelar'])
        ->name('reservas.cancelar');

    /*
    |--------------------------------------------------------------------------
    | TIPOS DE USUARIO
    |--------------------------------------------------------------------------
    */

    Route::get('tipos-usuario', [TipoUsuarioController::class, 'index'])
        ->middleware('can:tipos-usuario.ver')
        ->name('tipos-usuario.index');

    Route::middleware('can:tipos-usuario.gestionar')->group(function () {

        Route::get('tipos-usuario/create', [TipoUsuarioController::class, 'create'])
            ->name('tipos-usuario.create');

        Route::post('tipos-usuario', [TipoUsuarioController::class, 'store'])
            ->name('tipos-usuario.store');

        Route::get('tipos-usuario/{tipoUsuario}/edit', [TipoUsuarioController::class, 'edit'])
            ->name('tipos-usuario.edit');

        Route::put('tipos-usuario/{tipoUsuario}', [TipoUsuarioController::class, 'update'])
            ->name('tipos-usuario.update');

        Route::delete('tipos-usuario/{tipoUsuario}', [TipoUsuarioController::class, 'destroy'])
            ->name('tipos-usuario.destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | USUARIOS
    |--------------------------------------------------------------------------
    */

    Route::get('usuarios', [UsuarioController::class, 'index'])
        ->middleware('can:usuarios.ver')
        ->name('usuarios.index');

    Route::middleware('can:usuarios.gestionar')->group(function () {

        Route::get('usuarios/create', [UsuarioController::class, 'create'])
            ->name('usuarios.create');

        Route::post('usuarios', [UsuarioController::class, 'store'])
            ->name('usuarios.store');

        Route::get('usuarios/{usuario}/edit', [UsuarioController::class, 'edit'])
            ->name('usuarios.edit');

        Route::put('usuarios/{usuario}', [UsuarioController::class, 'update'])
            ->name('usuarios.update');

        Route::delete('usuarios/{usuario}', [UsuarioController::class, 'destroy'])
            ->name('usuarios.destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | MULTAS
    |--------------------------------------------------------------------------
    */

    Route::get('multas', [MultaController::class, 'index'])
        ->middleware('can:multas.ver')
        ->name('multas.index');

    Route::middleware('can:multas.gestionar')->group(function () {

        Route::get('multas/create', [MultaController::class, 'create'])
            ->name('multas.create');

        Route::post('multas', [MultaController::class, 'store'])
            ->name('multas.store');

        Route::post('multas/{multa}/pagar', [MultaController::class, 'pagar'])
            ->name('multas.pagar');

        Route::post('multas/{multa}/condonar', [MultaController::class, 'condonar'])
            ->name('multas.condonar');
    });

    /*
    |--------------------------------------------------------------------------
    | SUSPENSIONES
    |--------------------------------------------------------------------------
    */

    Route::get('suspensiones', [SuspensionController::class, 'index'])
        ->middleware('can:suspensiones.ver')
        ->name('suspensiones.index');

    Route::middleware('can:suspensiones.gestionar')->group(function () {

        Route::get('suspensiones/create', [SuspensionController::class, 'create'])
            ->name('suspensiones.create');

        Route::post('suspensiones', [SuspensionController::class, 'store'])
            ->name('suspensiones.store');

        Route::post('suspensiones/{suspension}/levantar', [SuspensionController::class, 'levantar'])
            ->name('suspensiones.levantar');
    });
});

require __DIR__.'/settings.php';