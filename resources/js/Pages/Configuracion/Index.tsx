import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';

interface Ubicacion {
    id: number;
    nombre: string;
    descripcion: string | null;
    edificio: string;
    piso: string;
    sala: string | null;
    activa: boolean;
}

interface TipoUsuario {
    id: number;
    nombre: string;
}

interface PoliticaPrestamo {
    id: number;
    tipo_recurso: 'LIBRO' | 'TESIS' | 'REVISTA' | 'DIGITAL';
    dias_prestamo: number;
    permite_renovacion: boolean;
    max_renovaciones: number;
    tipo_usuario?: TipoUsuario;
}

interface Props {
    ubicaciones: Ubicacion[];
    politicas: PoliticaPrestamo[];
}

export default function ConfiguracionIndex({ ubicaciones, politicas }: Props) {
    const [tabActiva, setTabActiva] = useState<'ubicaciones' | 'politicas'>('ubicaciones');
    const [busqueda, setBusqueda] = useState('');

    return (
        <div className="configuracion-module min-h-screen bg-slate-50 p-6">
            <Head title="Módulo de Configuración y Políticas" />

            <div className="max-w-7xl mx-auto">
                {/* Encabezado del Módulo */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0f2b48]">Configuración del Sistema</h1>
                        <p className="text-sm text-slate-500">Administración de ubicaciones físicas, estanterías y parámetros de préstamo institucionales</p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <input 
                            type="text"
                            placeholder="Buscar en configuraciones..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg px-3 py-2 shadow-sm focus:outline-none w-full md:w-64"
                        />
                        <button className="bg-[#0f2b48] hover:bg-[#1a426e] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center gap-2 whitespace-nowrap">
                            <i className="fa-solid fa-plus"></i> Nueva Configuración
                        </button>
                    </div>
                </div>

                {/* Sistema de Pestañas (Tabs) */}
                <div className="flex border-b border-slate-200 mb-6 bg-white rounded-t-xl px-4 pt-2 shadow-sm">
                    <button
                        onClick={() => setTabActiva('ubicaciones')}
                        className={`py-3 px-6 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                            tabActiva === 'ubicaciones' ? 'border-[#0f2b48] text-[#0f2b48]' : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <i className="fa-solid fa-map-location-dot"></i> Ubicaciones Físicas ({ubicaciones.length})
                    </button>
                    <button
                        onClick={() => setTabActiva('politicas')}
                        className={`py-3 px-6 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                            tabActiva === 'politicas' ? 'border-[#0f2b48] text-[#0f2b48]' : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <i className="fa-solid fa-sliders"></i> Políticas de Préstamo ({politicas.length})
                    </button>
                </div>

                {/* Pestaña 1: Ubicaciones */}
                {tabActiva === 'ubicaciones' && (
                    <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#0f2b48] text-white text-xs uppercase tracking-wider">
                                    <th className="py-3 px-4">ID</th>
                                    <th className="py-3 px-4">Nombre / Estantería</th>
                                    <th className="py-3 px-4">Edificio</th>
                                    <th className="py-3 px-4">Piso</th>
                                    <th className="py-3 px-4">Sala</th>
                                    <th className="py-3 px-4">Estado</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                                {ubicaciones.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-4 font-mono font-bold">#{u.id}</td>
                                        <td className="py-3 px-4">
                                            <div className="font-bold text-slate-900">{u.nombre}</div>
                                            <div className="text-xs text-slate-500">{u.descripcion || 'Sin descripción'}</div>
                                        </td>
                                        <td className="py-3 px-4 font-semibold text-slate-800">{u.edificio}</td>
                                        <td className="py-3 px-4 font-mono text-xs">Piso {u.piso}</td>
                                        <td className="py-3 px-4 text-xs text-slate-600">{u.sala || 'N/A'}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                u.activa ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                            }`}>
                                                {u.activa ? 'ACTIVA' : 'INACTIVA'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <button className="text-slate-400 hover:text-[#0f2b48] p-1.5"><i className="fa-solid fa-pen-to-square"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pestaña 2: Políticas de Préstamo */}
                {tabActiva === 'politicas' && (
                    <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#0f2b48] text-white text-xs uppercase tracking-wider">
                                    <th className="py-3 px-4">ID</th>
                                    <th className="py-3 px-4">Tipo de Usuario / Rol</th>
                                    <th className="py-3 px-4">Tipo de Recurso</th>
                                    <th className="py-3 px-4 text-center">Días de Préstamo</th>
                                    <th className="py-3 px-4 text-center">Permite Renovación</th>
                                    <th className="py-3 px-4 text-center">Max. Renovaciones</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                                {politicas.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-4 font-mono font-bold">#{p.id}</td>
                                        <td className="py-3 px-4 font-bold text-slate-900">{p.tipo_usuario?.nombre || 'General'}</td>
                                        <td className="py-3 px-4">
                                            <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-800">
                                                {p.tipo_recurso}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center font-bold text-emerald-700">{p.dias_prestamo} días</td>
                                        <td className="py-3 px-4 text-center">
                                            {p.permite_renovacion ? (
                                                <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold">Sí</span>
                                            ) : (
                                                <span className="bg-rose-100 text-rose-800 text-xs px-2.5 py-1 rounded-full font-bold">No</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-center font-mono text-xs">
                                            {p.permite_renovacion ? `${p.max_renovaciones} vez/veces` : 'N/A'}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <button className="text-slate-400 hover:text-[#0f2b48] p-1.5"><i className="fa-solid fa-pen-to-square"></i></button>
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