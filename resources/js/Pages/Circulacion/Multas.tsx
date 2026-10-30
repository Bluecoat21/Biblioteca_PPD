import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function MultasIndex() {
  const { multas, auth } = usePage().props as any;

  // Verificación de roles
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

  // Función para marcar una multa como pagada (exclusivo admin/bibliotecario)
  const handlePagar = (multaId: number) => {
    if (confirm('¿Confirmas el pago y liquidación de esta multa?')) {
      router.post(getRoute('multas.pagar', `/multas/${multaId}/pagar`), {}, {
        preserveScroll: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Head title="Gestión de Multas y Sanciones" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Encabezado */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {esAdminBibliotecario ? 'Gestión General de Multas' : 'Mis Multas y Sanciones'}
              </h1>
              <p className="text-sm text-slate-600">Control de sanciones económicas por retraso en entregas.</p>
            </div>
            <div className="flex gap-3">
              {esAdminBibliotecario && (
                <Link
                  href={getRoute('multas.create', '/multas/create')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  + Registrar Multa
                </Link>
              )}
              <Link
                href={getRoute('dashboard', '/dashboard')}
                className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                Volver al Dashboard
              </Link>
            </div>
          </div>

          {/* Tabla de Multas */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0f2b48] text-white text-sm">
                  <th className="p-4">ID</th>
                  <th className="p-4">Usuario</th>
                  <th className="p-4">Motivo</th>
                  <th className="p-4">Monto</th>
                  <th className="p-4">Días Atraso</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {multas?.data && multas.data.length > 0 ? (
                  multas.data.map((multa: any) => (
                    <tr key={multa.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-semibold text-slate-700">#{multa.id}</td>
                      <td className="p-4 text-slate-800">{multa.user?.name || 'Usuario desconocido'}</td>
                      <td className="p-4 text-slate-600">{multa.motivo}</td>
                      <td className="p-4 font-bold text-red-600">S/. {multa.monto}</td>
                      <td className="p-4 text-slate-600">{multa.dias_atraso || 0} días</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          multa.estado === 'pendiente' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {multa.estado}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {multa.estado === 'pendiente' && esAdminBibliotecario ? (
                          <button
                            onClick={() => handlePagar(multa.id)}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors shadow-sm"
                          >
                            Marcar Pagada
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">Sin acciones</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No hay multas registradas en el sistema.
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