import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

interface Props {
    configuraciones?: Array<{ id: number; clave: string; valor: string; descripcion: string }>;
}

export default function ConfiguracionIndex({ configuraciones = [] }: Props) {
    const getConfigValor = (clave: string, valorDefault: string) => {
        const item = Array.isArray(configuraciones) 
            ? configuraciones.find((c) => c.clave === clave)
            : null;
        return item ? item.valor : valorDefault;
    };

    const { data, setData, post, processing } = useForm({
        dias_prestamo_alumno: getConfigValor('dias_prestamo_alumno', '7'),
        dias_prestamo_docente: getConfigValor('dias_prestamo_docente', '15'),
        monto_multa_dia: getConfigValor('monto_multa_dia', '1.00'),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/configuraciones', {
            preserveScroll: true,
        });
    };

    return (
        <div className="configuracion-module min-h-screen bg-slate-50 p-6">
            <Head title="Configuración del Sistema - Biblioteca PPD" />

            <div className="max-w-3xl mx-auto">
                {/* Cabecera con título y botón Volver */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0f2b48]">Parámetros Generales del Sistema</h1>
                        <p className="text-xs text-slate-500">Ajusta los días de préstamo predeterminados y montos de multas institucionales.</p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors shadow-sm"
                    >
                        Volver al Dashboard
                    </Link>
                </div>

                <div className="bg-white shadow-sm rounded-2xl p-8 border border-slate-200">
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Días de Préstamo (Alumnos)</label>
                            <input
                                type="number"
                                value={data.dias_prestamo_alumno}
                                onChange={(e) => setData('dias_prestamo_alumno', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Días de Préstamo (Docentes)</label>
                            <input
                                type="number"
                                value={data.dias_prestamo_docente}
                                onChange={(e) => setData('dias_prestamo_docente', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Monto de Multa Diaria (S/.)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.monto_multa_dia}
                                onChange={(e) => setData('monto_multa_dia', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-[#0f2b48] hover:bg-[#1a426e] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-50"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}