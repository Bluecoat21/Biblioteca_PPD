import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';

interface TipoUsuario {
    id: number;
    nombre: string;
    max_prestamos: number;
    dias_prestamo_default: number;
}

interface Multa {
    id: number;
    monto: number;
    motivo: string;
    dias_atraso: number;
    estado: 'PENDIENTE' | 'PAGADO' | 'ANULADO';
    fecha_generacion: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    documento_identidad: string;
    telefono: string | null;
    estado: 'ACTIVO' | 'SUSPENDIDO' | 'INACTIVO';
    tipo_usuario?: TipoUsuario;
    multas_pendientes_count?: number;
}

interface Props {
    usuarios: User[];
    tiposUsuario: TipoUsuario[];
    multas: Multa[];
}

export default function UsuariosIndex({ usuarios, tiposUsuario, multas }: Props) {
    const [tabActiva, setTabActiva] = useState<'lectores' | 'tipos' | 'sanciones'>('lectores');
    const [busqueda, setBusqueda] = useState('');

    const registrarPagoMulta = (id: number) => {
        if (confirm('¿Desea registrar el pago de esta multa?')) {
            router.post(route('multas.pagar', id), {}, {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="usuarios-module min-h-screen bg-slate-50 p-6">
            <Head title="Módulo de Usuarios y Sanciones" />

            <div className="max-w-7xl mx-auto">
                {/* Encabezado del Módulo */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0f2b48]">Gestión de Usuarios y Sanciones</h1>
                        <p className="text-sm text-slate-500">Administración de lectores institucionales, perfiles de préstamo y control de penalizaciones</p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <input 
                            type="text"
                            placeholder="Buscar por nombre, DNI o email..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg px-3 py-2 shadow-sm focus:outline-none w-full md:w-64"
                        />
                        <button className="bg-[#0f2b48] hover:bg-[#1a426e] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center gap-2 whitespace-nowrap">
                            <i className="fa-solid fa-user-plus"></i> Registrar Usuario
                        </button>
                    </div>
                </div>

                {/* Sistema de Pestañas (Tabs) */}
                <div className="flex border-b border-slate-200 mb-6 bg-white rounded-t-xl px-4 pt-2 shadow-sm">
                    <button
                        onClick={() => setTabActiva('lectores')}
                        className={`py-3 px-6 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                            tabActiva === 'lectores' ? 'border-[#0f2b48] text-[#0f2b48]' : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <i className="fa-solid fa-users"></i> Lectores Institucionales ({usuarios.length})
                    </button>
                    <button
                        onClick={() => setTabActiva('tipos')}
                        className={`py-3 px-6 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                            tabActiva === 'tipos' ? 'border-[#0f2b48] text-[#0f2b48]' : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <i className="fa-solid fa-id-card"></i> Tipos de Usuario ({tiposUsuario.length})
                    </button>
                    <button
                        onClick={() => setTabActiva('sanciones')}
                        className={`py-3 px-6 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                            tabActiva === 'sanciones' ? 'border-[#0f2b48] text-[#0f2b48]' : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <i className="fa-solid fa-[#0f2b48] fa-receipt"></i> Multas y Sanciones ({multas.length})
                    </button>
                </div>

                {/* Pestaña 1: Lectores */}
                {tabActiva === 'lectores' && (
                    <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#0f2b48] text-white text-xs uppercase tracking-wider">
                                    <th className="py-3 px-4">ID</th>
                                    <th className="py-3 px-4">Nombre / Correo</th>
                                    <th className="py-3 px-4">DNI / Doc</th>
                                    <th className="py-3 px-4">Perfil</th>
                                    <th className="py-3 px-4">Estado</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                                {usuarios.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-4 font-mono font-bold">#{u.id}</td>
                                        <td className="py-3 px-4">
                                            <div className="font-bold text-slate-900">{u.name}</div>
                                            <div className="text-xs text-slate-500">{u.email}</div>
                                        </td>
                                        <td className="py-3 px-4 font-mono text-xs">{u.documento_identidad}</td>
                                        <td className="py-3 px-4 font-semibold text-slate-800">
                                            {u.tipo_usuario?.nombre || 'General'}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                u.estado === 'ACTIVO' ? 'bg-emerald-100 text-emerald-800' :
                                                u.estado === 'SUSPENDIDO' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                                            }`}>
                                                {u.estado}
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

                {/* Pestaña 2: Tipos de Usuario */}
                {tabActiva === 'tipos' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {tiposUsuario.map((tipo) => (
                            <div key={tipo.id} className="bg-white shadow-sm rounded-xl p-5 border border-slate-200">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-lg font-bold text-[#0f2b48]">{tipo.nombre}</h3>
                                    <span className="bg-slate-100 text-slate-700 text-xs font-mono px-2 py-1 rounded font-bold">
                                        ID #{tipo.id}
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm text-slate-600 mb-4">
                                    <div className="flex justify-between">
                                        <span>Límite de Préstamos:</span>
                                        <strong className="text-slate-900">{tipo.max_prestamos} recursos</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Plazo Estándar:</span>
                                        <strong className="text-slate-900">{tipo.dias_prestamo_default} días</strong>
                                    </div>
                                </div>
                                <button className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-2 rounded-lg text-xs font-bold transition-colors">
                                    Editar Parámetros
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pestaña 3: Multas */}
                {tabActiva === 'sanciones' && (
                    <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#0f2b48] text-white text-xs uppercase tracking-wider">
                                    <th className="py-3 px-4">ID</th>
                                    <th className="py-3 px-4">Monto</th>
                                    <th className="py-3 px-4">Atraso</th>
                                    <th className="py-3 px-4">Motivo</th>
                                    <th className="py-3 px-4">Estado</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                                {multas.map((m) => (
                                    <tr key={m.id} className="hover:bg-slate-50">
                                        <td className="py-3 px-4 font-mono font-bold">#{m.id}</td>
                                        <td className="py-3 px-4 font-bold text-slate-900">S/. {Number(m.monto).toFixed(2)}</td>
                                        <td className="py-3 px-4 text-rose-600 font-semibold">{m.dias_atraso} días</td>
                                        <td className="py-3 px-4 text-xs max-w-xs truncate">{m.motivo}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                m.estado === 'PENDIENTE' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                                            }`}>
                                                {m.estado}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            {m.estado === 'PENDIENTE' && (
                                                <button 
                                                    onClick={() => registrarPagoMulta(m.id)}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
                                                >
                                                    Pagar
                                                </button>
                                            )}
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