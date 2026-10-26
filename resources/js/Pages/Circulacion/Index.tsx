import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

interface Recurso {
    titulo: string;
}

interface Ejemplar {
    id: number;
    codigo_barras?: string;
    recurso_bibliografico?: Recurso;
}

interface User {
    id: number;
    name: string;
}

interface Prestamo {
    id: number;
    user?: User;
    ejemplar?: Ejemplar;
    fecha_prestamo: string;
    fecha_devolucion_esperada: string;
    estado: string;
    renovaciones: number;
}

interface PaginatedData<T> {
    data: T[];
    total: number;
}

interface Props {
    prestamos: PaginatedData<Prestamo> | Prestamo[];
    ejemplaresDisponibles?: Ejemplar[];
    usuarios?: User[];
    filters?: { search?: string };
}

export default function CirculacionIndex({ prestamos, ejemplaresDisponibles = [], usuarios = [], filters }: Props) {
    const [busqueda, setBusqueda] = useState(filters?.search || '');
    
    // Extracción segura del paginador de Laravel
    const listaPrestamos = Array.isArray(prestamos) ? prestamos : (prestamos?.data || []);

    return (
        <div className="circulacion-module min-h-screen bg-slate-50 p-6">
            <Head title="Módulo de Circulación y Préstamos" />

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">Gestión de Circulación y Préstamos</h1>
                        <p className="text-sm text-slate-500">Control de entregas, devoluciones y disponibilidad de ejemplares</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link 
                            href="/prestamos" 
                            className="bg-[#0f2b48] hover:bg-[#1a426e] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center gap-2"
                        >
                            <i className="fa-solid fa-plus"></i> Registrar Préstamo
                        </Link>
                    </div>
                </div>

                {/* Tabla de Préstamos */}
                <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#0f2b48] text-white text-xs uppercase tracking-wider">
                                <th className="p-3">ID</th>
                                <th className="p-3">Usuario Solicitante</th>
                                <th className="p-3">Ejemplar / Recurso</th>
                                <th className="p-3">F. Préstamo</th>
                                <th className="p-3">F. Devolución Esperada</th>
                                <th className="p-3">Estado</th>
                                <th className="p-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {listaPrestamos.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50">
                                    <td className="p-3 font-mono font-bold">#{p.id}</td>
                                    <td className="p-3 font-semibold text-slate-900">{p.user?.name || 'Usuario #' + p.id}</td>
                                    <td className="p-3">{p.ejemplar?.recurso_bibliografico?.titulo || 'Código: ' + (p.ejemplar?.codigo_barras || 'N/A')}</td>
                                    <td className="p-3">{p.fecha_prestamo}</td>
                                    <td className="p-3">{p.fecha_devolucion_esperada}</td>
                                    <td className="p-3">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                            {p.estado}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right">
                                        <button className="text-slate-400 hover:text-[#0f2b48] p-1.5" title="Ver detalles">
                                            <i className="fa-solid fa-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {listaPrestamos.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-6 text-center text-slate-400">
                                        No hay préstamos activos registrados en el sistema.
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