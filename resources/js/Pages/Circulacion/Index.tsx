import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    documento_identidad: string;
}

interface Ejemplar {
    id: number;
    codigo_barras: string;
    signatura_topografica: string;
    titulo_recurso: string;
}

interface Prestamo {
    id: number;
    fecha_prestamo: string;
    fecha_devolucion_esperada: string;
    estado: 'PRESTADO' | 'DEVUELTO' | 'VENCIDO';
    user: User;
    ejemplar: Ejemplar;
}

interface Reserva {
    id: number;
    fecha_reserva: string;
    posicion_cola: number;
    estado: 'ACTIVA' | 'COMPLETADA' | 'CANCELADA';
    user: User;
    titulo_recurso: string;
}

interface Props {
    prestamos: Prestamo[];
    reservas: Reserva[];
}

export default function CirculacionIndex({ prestamos, reservas }: Props) {
    const [tabActiva, setTabActiva] = useState<'prestamos' | 'reservas'>('prestamos');
    const [busqueda, setBusqueda] = useState('');

    const registrarDevolucion = (id: number) => {
        if (confirm('¿Desea registrar la devolución física de este ejemplar?')) {
            router.post(route('prestamos.devolver', id), {}, {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="circulacion-module min-h-screen bg-slate-50 p-6">
            <Head title="Módulo de Circulación y Préstamos" />

            <div className="max-w-7xl mx-auto">
                {/* Encabezado del Módulo */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0f2b48]">Circulación y Mostrador</h1>
                        <p className="text-sm text-slate-500">Gestión de préstamos activos, recepción de devoluciones y cola de reservas</p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <input 
                            type="text"
                            placeholder="Buscar por usuario, DNI o código..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg px-3 py-2 shadow-sm focus:outline-none w-full md:w-64"
                        />
                        <button className="bg-[#0f2b48] hover:bg-[#1a426e] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center gap-2 whitespace-nowrap">
                            <i className="fa-solid fa-hand-holding-hand"></i> Nuevo Préstamo
                        </button>
                    </div>
                </div>

                {/* Navegación por Pestañas */}
                <div className="flex border-b border-slate-200 mb-6 bg-white rounded-t-xl px-4 pt-2 shadow-sm">
                    <button
                        onClick={() => setTabActiva('prestamos')}
                        className={`py-3 px-6 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                            tabActiva === 'prestamos' ? 'border-[#0f2b48] text-[#0f2b48]' : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <i className="fa-solid fa-book-reader"></i> Préstamos Activos ({prestamos.length})
                    </button>
                    <button
                        onClick={() => setTabActiva('reservas')}
                        className={`py-3 px-6 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                            tabActiva === 'reservas' ? 'border-[#0f2b48] text-[#0f2b48]' : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <i className="fa-solid fa-clock flex-row"></i> Cola de Reservas ({reservas.length})
                    </button>
                </div>

                {/* Pestaña: Préstamos */}
                {tabActiva === 'prestamos' && (
                    <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#0f2b48] text-white text-xs uppercase tracking-wider">
                                    <th className="py-3 px-4">ID</th>
                                    <th className="py-3 px-4">Lector / Usuario</th>
                                    <th className="py-3 px-4">Ejemplar Bibliográfico</th>
                                    <th className="py-3 px-4">Código / Signatura</th>
                                    <th className="py-3 px-4">Devolución Esperada</th>
                                    <th className="py-3 px-4">Estado</th>
                                    <th className="py-3 px-4 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                                {prestamos.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-4 font-mono font-bold">#{p.id}</td>
                                        <td className="py-3 px-4">
                                            <div className="font-semibold text-slate-900">{p.user?.name}</div>
                                            <div className="text-xs text-slate-400 font-mono">DNI: {p.user?.documento_identidad}</div>
                                        </td>
                                        <td className="py-3 px-4 font-medium">{p.ejemplar?.titulo_recurso}</td>
                                        <td className="py-3 px-4 font-mono text-xs">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                                {p.ejemplar?.codigo_barras}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-800">
                                            {new Date(p.fecha_devolucion_esperada).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                p.estado === 'PRESTADO' ? 'bg-amber-100 text-amber-800' :
                                                p.estado === 'VENCIDO' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                                            }`}>
                                                {p.estado}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            {p.estado !== 'DEVUELTO' && (
                                                <button 
                                                    onClick={() => registrarDevolucion(p.id)}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
                                                >
                                                    Devolver
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pestaña: Reservas */}
                {tabActiva === 'reservas' && (
                    <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#0f2b48] text-white text-xs uppercase tracking-wider">
                                    <th className="py-3 px-4">ID</th>
                                    <th className="py-3 px-4">Usuario</th>
                                    <th className="py-3 px-4">Recurso Solicitado</th>
                                    <th className="py-3 px-4 text-center">Posición en Cola</th>
                                    <th className="py-3 px-4">Fecha Solicitud</th>
                                    <th className="py-3 px-4">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                                {reservas.map((res) => (
                                    <tr key={res.id} className="hover:bg-slate-50">
                                        <td className="py-3 px-4 font-mono font-bold">#{res.id}</td>
                                        <td className="py-3 px-4 font-semibold text-slate-900">{res.user?.name}</td>
                                        <td className="py-3 px-4">{res.titulo_recurso}</td>
                                        <td className="py-3 px-4 text-center">
                                            <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                                                Turno #{res.posicion_cola}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 font-mono text-xs">{new Date(res.fecha_reserva).toLocaleDateString()}</td>
                                        <td className="py-3 px-4">
                                            <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-xs font-bold">
                                                {res.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}