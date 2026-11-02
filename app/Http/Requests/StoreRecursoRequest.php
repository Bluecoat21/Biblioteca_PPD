<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRecursoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'titulo' => ['required', 'string', 'max:255'],
            'isbn' => ['nullable', 'string', 'max:50'],
            'tipo' => ['required', 'string'],
            'anio_publicacion' => ['nullable', 'integer'],
            'editorial_id' => ['required'],
            'nueva_editorial' => ['nullable', 'string', 'max:255'],
            'autor_id' => ['required'],
            'nuevo_autor_nombres' => ['nullable', 'string', 'max:255'],
            'nuevo_autor_apellidos' => ['nullable', 'string', 'max:255'],
            
            // CAMBIO: Ahora validamos un arreglo de categorías
            'categorias' => ['required', 'array'], 
            'categorias.*' => ['exists:categorias,id'],
            
            'nueva_categoria' => ['nullable', 'string', 'max:255'],
            'sinopsis' => ['nullable', 'string'],
            'archivo_pdf' => ['nullable', 'file', 'mimes:pdf', 'max:20480'],
            'portada_imagen' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }
}