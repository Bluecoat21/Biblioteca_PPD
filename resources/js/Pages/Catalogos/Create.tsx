import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

interface Props {
    editoriales: any[];
    autores: any[];
    categorias: any[];
}

export default function CatalogosCreate({ editoriales = [], autores = [], categorias = [] }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        titulo: '',
        isbn: '',
        tipo: 'libro',
        anio_publicacion: new Date().getFullYear(),
        editorial_id: '',
        autores: [],
        categorias: [],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/recursos');
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <Head title="Nuevo Recurso - Biblioteca PPD" />
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h1 className="text-2xl font-bold text-[#0f2b48] mb-1">Registrar Nuevo Recurso Bibliográfico</h1>
                <p className="text-sm text-slate-500 mb-6">Completa los datos del acervo y su taxonomía.</p>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Título</label>
                        <input
                            type="text"
                            value={data.titulo}
                            onChange={(e) => setData('titulo', e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                            required
                        />
                        {errors.titulo && <span className="text-xs text-red-600">{errors.titulo}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">ISBN</label>
                            <input
                                type="text"
                                value={data.isbn}
                                onChange={(e) => setData('isbn', e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Tipo de Recurso</label>
                            <select
                                value={data.tipo}
                                onChange={(e) => setData('tipo', e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white"
                            >
                                <option value="libro">Libro</option>
                                <option value="revista">Revista</option>
                                <option value="tesis">Tesis</option>
                                <option value="digital">Digital</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#0f2b48] hover:bg-[#1a426e] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all"
                        >
                            Guardar Recurso
                        </button>
                        <Link href="/recursos" className="text-sm text-slate-600 hover:underline">
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}