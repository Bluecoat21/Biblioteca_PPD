import React from 'react';
import { Head, useForm } from '@inertiajs/react';

interface Props {
    configuraciones?: any;
}

export default function ConfiguracionIndex({ configuraciones = {} }: Props) {
    const { data, setData, post, processing } = useForm({
        dias_prestamo_docente: configuraciones?.dias_prestamo_docente || 15,
        dias_prestamo_alumno: configuraciones?.dias_prestamo_alumno || 7,
        multa_diaria: configuraciones?.multa_diaria || 1.00,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/configuraciones');
    };

    return (
        <div className="configuracion-module min-h-screen bg-slate-50 p-6">
            <Head title="Configuración del Sistema" />

            <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl p-6 border border-slate-200">
                <h1 className="text-2xl font-bold text-primary mb-2">Parámetros Generales del Sistema</h1>
                <p className="text-sm text-slate-500 mb-6">Ajusta los días de préstamo predeterminados y montos de multas institucionales.</p>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Días de Préstamo (Alumnos)</label>
                        <input
                            type="number"
                            value={data.dias_prestamo_alumno}
                            onChange={(e) => setData('dias_prestamo_alumno', Number(e.target.value))}
                            className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Días de Préstamo (Docentes)</label>
                        <input
                            type="number"
                            value={data.dias_prestamo_docente}
                            onChange={(e) => setData('dias_prestamo_docente', Number(e.target.value))}
                            className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Monto de Multa Diaria (S/.)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.multa_diaria}
                            onChange={(e) => setData('multa_diaria', Number(e.target.value))}
                            className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#0f2b48] hover:bg-[#1a426e] text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}