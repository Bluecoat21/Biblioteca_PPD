<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEditorialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:255|unique:editoriales,nombre',
            'pais' => 'nullable|string|max:100',
            'sitio_web' => 'nullable|url|max:255',
        ];
    }
}