import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function SuspensionesIndex() {
  const { suspensiones } = usePage().props as any;

  const levantarSuspension = (id: number) => {
    if (confirm('¿Estás seguro de levantar esta suspensión y reactivar los privilegios del usuario?')) {
      router.post(`/suspensiones/${id}/levantar`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Head title="Gestión de Suspensiones - Biblioteca PPD" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Encabezado */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Gestión de Suspensiones</h1>
              <p className="text-sm text-slate-600">Control de bloqueos temporales e inhabilitación de miembros.</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/suspensiones/create"
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                + Nueva Suspensión
              </Link>
              <Link
                href="/dashboard"
                className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                Volver al Dashboard
              </Link>
            </div>
          </div>

          {/* Tabla de Suspensiones */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0f2b48] text-white text-sm">
                  <th className="p-4">ID</th>
                  <th className="p-4">Usuario Suspendido</th>
                  <th className="p-4">Motivo</th>
                  <th className="p-4">Desde</th>
                  <th className="p-4">Hasta</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Registrado por</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {suspensiones?.data && suspensiones.data.length > 0 ? (
                  suspensiones.data.map((suspension: any) => (
                    <tr key={suspension.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-semibold text-slate-700">#{suspension.id}</td>
                      <td className="p-4 text-slate-800 font-medium">
                        {suspension.user?.name || 'N/A'}
                        <div className="text-xs text-slate-500 font-mono">DNI: {suspension.user?.documento_identidad || 'N/A'}</div>
                      </td>
                      <td className="p-4 text-slate-600">{suspension.motivo}</td>
                      <td className="p-4 text-slate-600">{suspension.fecha_inicio}</td>
                      <td className="p-4 text-slate-600">{suspension.fecha_fin || 'Indefinida'}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          suspension.activa 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {suspension.activa ? 'Activa (Suspendido)' : 'Inactiva / Levantada'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">{suspension.creador?.name || 'Sistema'}</td>
                      <td className="p-4 text-right">
                        {suspension.activa && (
                          <button
                            onClick={() => levantarSuspension(suspension.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
                          >
                            Levantar Suspensión
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500">
                      No hay suspensiones registradas en el sistema.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}