import React from 'react';
import { Head, Link } from '@inertiajs/react';

interface Ubicacion {
    id: number;
    nombre: string;
    descripcion: string | null;
    edificio: string | null;
    piso: string | null;
    activa: boolean | number;
    ejemplares_count?: number;
}

interface Props {
    ubicaciones: Ubicacion[] | { data: Ubicacion[] };
}

export default function UbicacionesIndex({ ubicaciones }: Props) {
    const listaUbicaciones = Array.isArray(ubicaciones) ? ubicaciones : (ubicaciones?.data || []);

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
            <Head title="Ubicaciones e Inventario - Biblioteca PPD" />

            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0f2b48]">Ubicaciones Físicas y Topografía</h1>
                        <p className="text-sm text-slate-500">Gestión de estantes, secciones, edificios y áreas físicas</p>
                    </div>
                    <Link
                        href={getRoute('configuraciones.index', '/configuracion')}
                        className="text-sm font-semibold text-[#0f2b48] hover:underline"
                    >
                        ← Volver a Configuración
                    </Link>
                </div>

                <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#0f2b48] text-white text-xs uppercase tracking-wider">
                                <th className="p-3">ID</th>
                                <th className="p-3">Nombre / Estante</th>
                                <th className="p-3">Edificio</th>
                                <th className="p-3">Piso</th>
                                <th className="p-3">Ejemplares</th>
                                <th className="p-3">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {listaUbicaciones.map((ubi) => (
                                <tr key={ubi.id} className="hover:bg-slate-50">
                                    <td className="p-3 font-mono font-bold">#{ubi.id}</td>
                                    <td className="p-3 font-semibold text-slate-900">{ubi.nombre}</td>
                                    <td className="p-3">{ubi.edificio || 'Principal'}</td>
                                    <td className="p-3">{ubi.piso || 'N/A'}</td>
                                    <td className="p-3">
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                            {ubi.ejemplares_count ?? 0} ejemplares
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                            ubi.activa ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {ubi.activa ? 'Activa' : 'Inactiva'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {listaUbicaciones.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-6 text-center text-slate-400">
                                        No hay ubicaciones registradas en el sistema.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}