import React from 'react';
import { Head, Link } from '@inertiajs/react';

interface Reserva {
    id: number;
    usuario?: { name: string };
    recurso_bibliografico?: { titulo: string };
    fecha_reserva: string;
    estado: string;
    posicion_cola: number;
}

interface Props {
    reservas: { data: Reserva[] } | Reserva[];
}

export default function ReservasIndex({ reservas }: Props) {
    const listaReservas = Array.isArray(reservas) ? reservas : (reservas?.data || []);

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
            <Head title="Reservas - Biblioteca PPD" />
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0f2b48]">Cola de Reservas Bibliográficas</h1>
                        <p className="text-sm text-slate-500">Gestión de turnos y solicitudes pendientes de recursos</p>
                    </div>
                    <Link href={getRoute('prestamos.index', '/prestamos')} className="text-sm font-semibold text-[#0f2b48] hover:underline">
                        ← Ir a Préstamos
                    </Link>
                </div>

                <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#0f2b48] text-white text-xs uppercase">
                                <th className="p-3">ID</th>
                                <th className="p-3">Usuario</th>
                                <th className="p-3">Recurso Solicitado</th>
                                <th className="p-3">Posición en Cola</th>
                                <th className="p-3">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {listaReservas.map((r) => (
                                <tr key={r.id} className="hover:bg-slate-50">
                                    <td className="p-3 font-mono font-bold">#{r.id}</td>
                                    <td className="p-3 font-semibold">{r.usuario?.name || 'N/A'}</td>
                                    <td className="p-3">{r.recurso_bibliografico?.titulo || 'N/A'}</td>
                                    <td className="p-3 font-mono font-bold">#{r.posicion_cola}</td>
                                    <td className="p-3">
                                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                            {r.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {listaReservas.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-6 text-center text-slate-400">No hay reservas activas en este momento.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}