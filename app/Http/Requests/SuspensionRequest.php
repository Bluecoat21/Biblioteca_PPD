<?php

namespace App\Http\Requests;

use App\Models\Suspension;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SuspensionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => [
                'required', 
                'integer', 
                Rule::exists('users', 'id')->whereNull('deleted_at'),
                function ($attribute, $value, $fail) {
                    // Validar si el usuario ya tiene una suspensión activa
                    $suspensionActiva = Suspension::where('user_id', $value)
                        ->where('activa', true)
                        ->exists();

                    if ($suspensionActiva) {
                        $fail('Este usuario ya cuenta con una suspensión activa en el sistema. Debe levantar la suspensión actual antes de aplicarle una nueva.');
                    }
                },
            ],
            'motivo' => ['required', 'string', 'max:1000'],
            'fecha_inicio' => ['required', 'date'],
            'fecha_fin' => ['nullable', 'date', 'after_or_equal:fecha_inicio'],
        ];
    }
}