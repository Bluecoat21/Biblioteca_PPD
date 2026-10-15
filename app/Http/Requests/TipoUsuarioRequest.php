<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TipoUsuarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('tipoUsuario')?->id;

        return [
            'nombre' => ['required', 'string', 'max:255', Rule::unique('tipos_usuario', 'nombre')->ignore($id)],
            'max_prestamos' => ['required', 'integer', 'min:0', 'max:255'],
            'dias_prestamo_default' => ['required', 'integer', 'min:1', 'max:255'],
        ];
    }
}