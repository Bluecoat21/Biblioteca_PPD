<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAutorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'nacionalidad' => 'nullable|string|max:100',
            'biografia' => 'nullable|string',
            'fecha_nacimiento' => 'nullable|date',
        ];
    }
}