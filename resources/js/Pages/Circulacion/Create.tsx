import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

interface Props {
    ejemplaresDisponibles: any[];
    usuarios: any[];
}

export default function CirculacionCreate({ ejemplaresDisponibles = [], usuarios = [] }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        ejemplar_id: '',
        user_id: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/prestamos');
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <Head title="Nuevo Préstamo - Biblioteca PPD" />
            <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h1 className="text-2xl font-bold text-[#0f2b48] mb-1">Registrar Préstamo de Ejemplar</h1>
                <p className="text-sm text-slate-500 mb-6">Selecciona el miembro y el ejemplar físico disponible.</p>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Usuario Solicitante</label>
                        <select
                            value={data.user_id}
                            onChange={(e) => setData('user_id', e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white"
                            required
                        >
                            <option value="">Seleccione un usuario...</option>
                            {usuarios.map((u: any) => (
                                <option key={u.id} value={u.id}>{u.name} ({u.documento_identidad || 'Sin ID'})</option>
                            ))}
                        </select>
                        {errors.user_id && <span className="text-xs text-red-600">{errors.user_id}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Ejemplar Disponible</label>
                        <select
                            value={data.ejemplar_id}
                            onChange={(e) => setData('ejemplar_id', e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white"
                            required
                        >
                            <option value="">Seleccione un ejemplar...</option>
                            {ejemplaresDisponibles.map((ej: any) => (
                                <option key={ej.id} value={ej.id}>
                                    Código: {ej.codigo_barras} - {ej.recurso_bibliografico?.titulo || 'Obra'}
                                </option>
                            ))}
                        </select>
                        {errors.ejemplar_id && <span className="text-xs text-red-600">{errors.ejemplar_id}</span>}
                    </div>

                    <div className="pt-4 flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#0f2b48] hover:bg-[#1a426e] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all"
                        >
                            Asignar Préstamo
                        </button>
                        <Link href="/prestamos" className="text-sm text-slate-600 hover:underline">
                            Volver
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}