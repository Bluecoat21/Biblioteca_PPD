<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RecursoBibliograficoController;
use App\Http\Controllers\AutorController;
use App\Http\Controllers\EditorialController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\EjemplarController;

// Rutas protegidas para el Módulo 1
Route::middleware(['auth'])->group(function () {
    Route::resource('recursos', RecursoBibliograficoController::class);
    Route::resource('autores', AutorController::class);
    Route::resource('editoriales', EditorialController::class);
    Route::resource('categorias', CategoriaController::class);
    Route::post('recursos/{recurso}/ejemplares', [EjemplarController::class, 'store'])->name('ejemplares.store');
    Route::put('ejemplares/{ejemplar}', [EjemplarController::class, 'update'])->name('ejemplares.update');
    Route::delete('ejemplares/{ejemplar}', [EjemplarController::class, 'destroy'])->name('ejemplares.destroy');
});