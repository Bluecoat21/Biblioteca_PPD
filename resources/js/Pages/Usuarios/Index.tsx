import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    documento_identidad: string;
    telefono: string | null;
    estado: string;
    tipo: string | null;
    rol: string | null;
}

interface Props {
    usuarios: User[];
}

export default function UsuariosIndex({ usuarios = [] }: Props) {
    const [busqueda, setBusqueda] = useState('');
    const listaUsuarios = Array.isArray(usuarios) ? usuarios : [];

    return (
        <div className="usuarios-module min-h-screen bg-slate-50 p-6">
            <Head title="Directorio de Usuarios" />

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">Gestión de Usuarios y Miembros</h1>
                        <p className="text-sm text-slate-500">Administración de perfiles, tipos de usuario y roles del sistema</p>
                    </div>
                    <Link
                        href="/usuarios/create"
                        className="bg-[#0f2b48] hover:bg-[#1a426e] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center gap-2"
                    >
                        <i className="fa-solid fa-user-plus"></i> Nuevo Usuario
                    </Link>
                </div>

                <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#0f2b48] text-white text-xs uppercase tracking-wider">
                                <th className="p-3">ID</th>
                                <th className="p-3">Nombre Completo</th>
                                <th className="p-3">Correo Electrónico</th>
                                <th className="p-3">Documento</th>
                                <th className="p-3">Tipo de Usuario</th>
                                <th className="p-3">Rol</th>
                                <th className="p-3">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {listaUsuarios.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50">
                                    <td className="p-3 font-mono font-bold">#{u.id}</td>
                                    <td className="p-3 font-semibold text-slate-900">{u.name}</td>
                                    <td className="p-3">{u.email}</td>
                                    <td className="p-3 font-mono">{u.documento_identidad || 'N/A'}</td>
                                    <td className="p-3">{u.tipo || 'General'}</td>
                                    <td className="p-3">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                                            {u.rol || 'Sin rol'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                            {u.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {listaUsuarios.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-6 text-center text-slate-400">
                                        No hay usuarios registrados.
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