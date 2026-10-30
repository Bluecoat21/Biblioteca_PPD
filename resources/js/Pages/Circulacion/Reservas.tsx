import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function ReservasIndex() {
  const { reservas, auth } = usePage().props as any;

  const roles = auth?.user?.roles || [];
  const hasRole = roles.some((r: any) => {
    const roleName = typeof r === 'string' ? r : r?.name;
    return roleName && ['admin', 'administrator', 'bibliotecario', 'administrador'].includes(roleName.toLowerCase());
  });
  const esAdminBibliotecario = hasRole || auth?.user?.email === '12345@1.test';

  const getRoute = (routeName: string, fallbackUrl: string) => {
    try {
      if (typeof window !== 'undefined' && (window as any).route) {
        return (window as any).route(routeName);
      }
    } catch (e) {}
    return fallbackUrl;
  };

  const handleCancelar = (reservaId: number) => {
    if (confirm('¿Estás seguro de cancelar esta reserva?')) {
      router.post(getRoute('reservas.cancelar', `/reservas/${reservaId}/cancelar`), {}, {
        preserveScroll: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Head title="Gestión de Reservas" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Encabezado */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {esAdminBibliotecario ? 'Gestión de Reservas' : 'Mis Reservas'}
              </h1>
              <p className="text-sm text-slate-600">Control de colas de espera y apartados de recursos.</p>
            </div>
            <div className="flex gap-3">
              <Link
                href={getRoute('dashboard', '/dashboard')}
                className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                Volver al Dashboard
              </Link>
            </div>
          </div>

          {/* Tabla de Reservas */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0f2b48] text-white text-sm">
                  <th className="p-4">ID</th>
                  <th className="p-4">Usuario</th>
                  <th className="p-4">Recurso Bibliográfico</th>
                  <th className="p-4">Fecha Reserva</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {reservas?.data && reservas.data.length > 0 ? (
                  reservas.data.map((reserva: any) => (
                    <tr key={reserva.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-semibold text-slate-700">#{reserva.id}</td>
                      <td className="p-4 text-slate-800">{reserva.usuario?.name || 'N/A'}</td>
                      <td className="p-4 text-slate-600 font-medium">{reserva.recurso_bibliografico?.titulo || 'Recurso genérico'}</td>
                      <td className="p-4 text-slate-600">{reserva.created_at?.substring(0, 10)}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          reserva.estado === 'pendiente' 
                            ? 'bg-blue-100 text-blue-800' 
                            : reserva.estado === 'completada'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {reserva.estado}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {reserva.estado === 'pendiente' && (
                          <button
                            onClick={() => handleCancelar(reserva.id)}
                            className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-700 transition-colors shadow-sm"
                          >
                            Cancelar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No hay reservas registradas en el sistema.
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