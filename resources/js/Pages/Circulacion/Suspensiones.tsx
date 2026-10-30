import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function SuspensionesIndex() {
  const { suspensiones } = usePage().props as any;

  // Helper seguro para rutas con fallback estático
  const getRoute = (routeName: string, fallbackUrl: string) => {
    try {
      if (typeof window !== 'undefined' && (window as any).route) {
        return (window as any).route(routeName);
      }
    } catch (e) {}
    return fallbackUrl;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Head title="Gestión de Suspensiones" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Encabezado */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Gestión de Suspensiones</h1>
              <p className="text-sm text-slate-600">Control de bloqueos temporales a miembros de la biblioteca.</p>
            </div>
            <div className="flex gap-3">
              <Link
                href={getRoute('suspensiones.create', '/suspensiones/create')}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                + Nueva Suspensión
              </Link>
              <Link
                href={getRoute('dashboard', '/dashboard')}
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {suspensiones?.data && suspensiones.data.length > 0 ? (
                  suspensiones.data.map((suspension: any) => (
                    <tr key={suspension.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-semibold text-slate-700">#{suspension.id}</td>
                      <td className="p-4 text-slate-800 font-medium">{suspension.user?.name || 'N/A'}</td>
                      <td className="p-4 text-slate-600">{suspension.motivo}</td>
                      <td className="p-4 text-slate-600">{suspension.fecha_inicio}</td>
                      <td className="p-4 text-slate-600">{suspension.fecha_fin}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          suspension.activa 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {suspension.activa ? 'Activa (Suspendido)' : 'Inactiva'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">{suspension.creador?.name || 'Sistema'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
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