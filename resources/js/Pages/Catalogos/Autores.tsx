import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface Autor {
    id: number;
    nombres: string;
    apellidos: string;
    nacionalidad: string | null;
    recursos_count?: number;
}

interface Props {
    autores: { data: Autor[] } | Autor[];
}

export default function AutoresIndex({ autores }: Props) {
    const lista = Array.isArray(autores) ? autores : (autores?.data || []);

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <Head title="Autores - Biblioteca PPD" />
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0f2b48]">Gestión de Autores</h1>
                        <p className="text-sm text-slate-500">Listado de creadores y escritores registrados</p>
                    </div>
                    <Link href={route('recursos.index')} className="text-sm font-semibold text-[#0f2b48] hover:underline">
                        ← Volver a Recursos
                    </Link>
                </div>

                <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#0f2b48] text-white text-xs uppercase">
                                <th className="p-3">ID</th>
                                <th className="p-3">Apellidos y Nombres</th>
                                <th className="p-3">Nacionalidad</th>
                                <th className="p-3">Obras</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {lista.map((aut) => (
                                <tr key={aut.id} className="hover:bg-slate-50">
                                    <td className="p-3 font-mono font-bold">#{aut.id}</td>
                                    <td className="p-3 font-semibold text-slate-900">{aut.apellidos}, {aut.nombres}</td>
                                    <td className="p-3">{aut.nacionalidad || 'N/A'}</td>
                                    <td className="p-3">{aut.recursos_count || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}