<?php

namespace App\Http\Controllers;

use App\Models\PoliticaPrestamo;
use App\Models\TipoUsuario;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PoliticaPrestamoController extends Controller
{
    public function index()
    {
        $politicas = PoliticaPrestamo::with('tipoUsuario')->get();
        $tiposUsuario = TipoUsuario::all();

        return Inertia::render('Configuracion/PoliticasPrestamo', [
            'politicas' => $politicas,
            'tiposUsuario' => $tiposUsuario,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tipo_usuario_id' => ['required', 'exists:tipos_usuario,id'],
            'tipo_recurso' => ['required', 'string'],
            'dias_prestamo' => ['required', 'integer', 'min:1'],
            'permite_renovacion' => ['required', 'boolean'],
            'max_renovaciones' => ['required', 'integer', 'min:0'],
        ]);

        PoliticaPrestamo::create($request->all());

        return redirect()->back()->with('success', 'Política de préstamo registrada correctamente.');
    }

    public function destroy($id)
    {
        $politica = PoliticaPrestamo::findOrFail($id);
        $politica->delete();

        return redirect()->back()->with('success', 'Política eliminada correctamente.');
    }
}