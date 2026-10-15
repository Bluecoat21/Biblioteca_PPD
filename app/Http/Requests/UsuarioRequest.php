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
            'tipo_usuario_id' => ['required', 'integer', 'exists:tipos_usuario,id'],
            'telefono' => ['nullable', 'string', 'max:20'],
            'estado' => ['required', Rule::in(['activo', 'suspendido', 'inactivo'])],
            'rol' => ['required', 'exists:roles,name'],
            'password' => [$id ? 'nullable' : 'required', 'string', 'min:8'],
        ];
    }
}