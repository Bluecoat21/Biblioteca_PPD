import React from 'react';
import { Head, Link } from '@inertiajs/react';

interface Multa {
    id: number;
    usuario: string;
    documento: string;
    motivo: string;
    monto: number;
    dias_atraso: number;
    estado: string;
    fecha_generacion: string;
}

interface Props {
    multas: Multa[];
}

export default function MultasIndex({ multas = [] }: Props) {
    const getRoute = (routeName: string, fallbackUrl: string) => {
        try {
            if (typeof window !== 'undefined' && (window as any).route) {
                return (window as any).route(routeName);
            }
        } catch (e) {}
        return fallbackUrl;
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <Head title="Multas y Sanciones - Biblioteca PPD" />
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0f2b48]">Control de Multas y Sanciones</h1>
                        <p className="text-sm text-slate-500">Penalizaciones vigentes por retrasos en devoluciones</p>
                    </div>
                    <Link href={getRoute('prestamos.index', '/prestamos')} className="text-sm font-semibold text-[#0f2b48] hover:underline">
                        ← Volver a Préstamos
                    </Link>
                </div>

                <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#0f2b48] text-white text-xs uppercase">
                                <th className="p-3">ID</th>
                                <th className="p-3">Usuario</th>
                                <th className="p-3">Motivo</th>
                                <th className="p-3">Monto</th>
                                <th className="p-3">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {multas.map((m) => (
                                <tr key={m.id} className="hover:bg-slate-50">
                                    <td className="p-3 font-mono font-bold">#{m.id}</td>
                                    <td className="p-3 font-semibold">{m.usuario}</td>
                                    <td className="p-3">{m.motivo}</td>
                                    <td className="p-3 font-bold text-red-600">S/. {Number(m.monto).toFixed(2)}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                            m.estado === 'pendiente' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                                        }`}>
                                            {m.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {multas.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-6 text-center text-slate-400">No hay multas registradas.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}