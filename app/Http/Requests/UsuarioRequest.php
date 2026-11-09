<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UsuarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('usuario')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($id)],
            'documento_identidad' => ['required', 'string', 'max:20', Rule::unique('users', 'documento_identidad')->ignore($id)],
            'codigo_estudiante' => ['required', 'string', 'max:50', Rule::unique('users', 'codigo_estudiante')->ignore($id)],
            'codigo_acceso_web' => ['nullable', 'string', 'max:50'],
            'telefono' => ['nullable', 'string', 'max:20'],
            'tipo_usuario_id' => ['required', 'integer', 'exists:tipos_usuario,id'],
            'estado' => ['required', Rule::in(['activo', 'suspendido', 'inactivo'])],
            'rol' => ['required', 'exists:roles,name'],
            'password' => ['nullable', 'string', 'min:8'],
            'cuenta_web_activa' => ['nullable', 'boolean'],
        ];
    }
}