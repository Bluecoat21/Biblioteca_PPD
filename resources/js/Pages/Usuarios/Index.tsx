import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

interface Usuario {
  id: number;
  name: string;
  email: string;
  documento_identidad: string;
  codigo_estudiante?: string;
  codigo_acceso_web?: string;
  cuenta_web_activa: boolean;
  telefono?: string;
  estado: string;
  tipo?: string;
  rol?: string;
}

interface Props {
  usuarios?: Usuario[];
  esAdmin?: boolean;
}

export default function UsuariosIndex({ usuarios = [], esAdmin = true }: Props) {
  const [busqueda, setBusqueda] = useState('');

  const listaUsuarios = Array.isArray(usuarios) ? usuarios : [];
  const usuariosFiltrados = listaUsuarios.filter((u) =>
    u.name.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.documento_identidad.includes(busqueda) ||
    u.email.toLowerCase().includes(busqueda.toLowerCase()) ||
    (u.codigo_acceso_web && u.codigo_acceso_web.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <Head title="Directorio de Usuarios - Biblioteca PPD" />

      <div className="max-w-7xl mx-auto">
        {/* Cabecera con título y botón de regreso */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#0f2b48]">Directorio de Usuarios y Miembros</h1>
            <p className="text-sm text-slate-500">
              Consulta de perfiles, claves de acceso web, números de contacto y estados institucionales.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors shadow-sm"
            >
              Volver al Dashboard
            </Link>

            {esAdmin && (
              <Link
                href="/usuarios/create"
                className="bg-[#0f2b48] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#1a426e] transition-colors shadow-sm"
              >
                + Nuevo Usuario Presencial
              </Link>
            )}
          </div>
        </div>

        {/* Buscador interno de la vista */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-slate-400"></i>
            <input
              type="text"
              placeholder="Buscar por Nombre, DNI, Correo o Código Institucional..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Tabla principal */}
        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#0f2b48] text-white text-xs uppercase tracking-wider">
                <th className="p-3">ID</th>
                <th className="p-3">Nombre Completo</th>
                <th className="p-3">Contacto / DNI</th>
                <th className="p-3">Código Inst.</th>
                <th className="p-3">Acceso Web / Estado Portal</th>
                <th className="p-3">Tipo / Rol</th>
                <th className="p-3">Estado Físico</th>
                {esAdmin && <th className="p-3 text-right">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {usuariosFiltrados.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold">#{u.id}</td>
                  <td className="p-3 font-semibold text-slate-900">{u.name}</td>
                  <td className="p-3">
                    <div className="text-xs">{u.email}</div>
                    <div className="text-[11px] text-slate-400 font-mono">DNI: {u.documento_identidad}</div>
                  </td>
                  <td className="p-3 font-mono font-semibold text-blue-600">{u.codigo_acceso_web || 'N/A'}</td>
                  <td className="p-3">
                    {u.cuenta_web_activa ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        • Cuenta Web Activada
                      </span>
                    ) : (
                      <div className="inline-block bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1 text-xs">
                        <span className="font-semibold text-amber-800 block">Pendiente Registro</span>
                        <span className="text-[10px] text-amber-600">Clave: {u.codigo_acceso_web}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="font-medium">{u.tipo || 'General'}</div>
                    <div className="text-[11px] text-slate-400">{u.rol || 'Sin Rol'}</div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        u.estado === 'activo'
                          ? 'bg-emerald-100 text-emerald-800'
                          : u.estado === 'suspendido'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {u.estado}
                    </span>
                  </td>
                  {esAdmin && (
                    <td className="p-3 text-right space-x-2">
                      <Link href={`/usuarios/${u.id}/edit`} className="text-xs font-bold text-blue-600 hover:underline">
                        Editar
                      </Link>
                      <Link href="/suspensiones" className="text-xs font-bold text-slate-600 hover:underline">
                        Suspensiones
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
              {usuariosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={esAdmin ? 8 : 7} className="py-6 text-center text-slate-400">
                    No se encontraron usuarios coincidentes.
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