<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEjemplarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'codigo_barras' => 'required|string|unique:ejemplares,codigo_barras|max:50',
            'signatura_topografica' => 'nullable|string|max:100',
            'estado' => 'required|in:disponible,prestado,mantenimiento,baja',
            'tipo_adquisicion' => 'required|in:compra,donacion,intercambio',
            'ubicacion_id' => 'nullable|integer',
            'fecha_adquisicion' => 'nullable|date',
            'valor_adquisicion' => 'nullable|numeric|min:0',
            'observaciones' => 'nullable|string',
        ];
    }
}