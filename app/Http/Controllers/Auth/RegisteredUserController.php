<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'documento_identidad' => ['required', 'string', 'exists:users,documento_identidad'],
            'codigo_acceso_web' => ['required', 'string'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Buscar el usuario registrado presencialmente en la BD
        $user = User::where('documento_identidad', trim($request->documento_identidad))
                    ->where('codigo_acceso_web', trim($request->codigo_acceso_web))
                    ->first();

        if (!$user) {
            return back()->withErrors([
                'codigo_acceso_web' => 'El DNI o el Código de Acceso Web no son válidos o no coinciden con nuestros registros.',
            ]);
        }

        // Si ya está activa la cuenta web, avisar
        if ($user->cuenta_web_activa) {
            return back()->withErrors([
                'codigo_acceso_web' => 'Esta cuenta ya ha sido activada previamente. Por favor inicia sesión.',
            ]);
        }

        // Activar la cuenta web y asignar la contraseña elegida por el alumno
        $user->update([
            'password' => Hash::make($request->password),
            'cuenta_web_activa' => true,
        ]);

        auth()->login($user);

        return redirect()->route('dashboard');
    }
}