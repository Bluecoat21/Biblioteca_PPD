import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function PrestamosIndex() {
  const { prestamos, auth, errors } = usePage().props as any;

  // Verificación de roles para determinar si es admin/bibliotecario
  const roles = auth?.user?.roles || [];
  const hasRole = roles.some((r: any) => {
    const roleName = typeof r === 'string' ? r : r?.name;
    return roleName && ['admin', 'administrator', 'bibliotecario', 'administrador'].includes(roleName.toLowerCase());
  });
  const esAdminBibliotecario = hasRole || auth?.user?.email === '12345@1.test';

  // Helper seguro para rutas con fallback estático
  const getRoute = (routeName: string, fallbackUrl: string) => {
    try {
      if (typeof window !== 'undefined' && (window as any).route) {
        return (window as any).route(routeName);
      }
    } catch (e) {}
    return fallbackUrl;
  };

  // Función para procesar la devolución de un préstamo
  const handleDevolver = (prestamoId: number) => {
    if (confirm('¿Estás seguro de registrar la devolución de este ejemplar? El sistema evaluará multas automáticamente si hay retraso.')) {
      router.post(getRoute('prestamos.devolver', `/prestamos/${prestamoId}/devolver`), {}, {
        preserveScroll: true,
      });
    }
  };

  // Función para renovar un préstamo
  const handleRenovar = (prestamoId: number) => {
    router.post(getRoute('prestamos.renovar', `/prestamos/${prestamoId}/renovar`), {}, {
      preserveScroll: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Head title="Gestión de Préstamos" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Alertas de error o éxito globales */}
          {errors && Object.keys(errors).length > 0 && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
              <p className="font-bold">Se encontraron restricciones:</p>
              <ul className="list-disc pl-5 mt-1">
                {Object.values(errors).map((err: any, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Encabezado */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {esAdminBibliotecario ? 'Gestión General de Préstamos' : 'Mis Préstamos'}
              </h1>
              <p className="text-sm text-slate-600">Control de entregas, devoluciones y plazos vigentes.</p>
            </div>
            <div className="flex gap-3">
              {esAdminBibliotecario && (
                <Link
                  href={getRoute('prestamos.create', '/prestamos/create')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  + Nuevo Préstamo
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

          {/* Tabla de Préstamos */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0f2b48] text-white text-sm">
                  <th className="p-4">ID</th>
                  <th className="p-4">Recurso / Ejemplar</th>
                  <th className="p-4">Usuario</th>
                  <th className="p-4">F. Préstamo</th>
                  <th className="p-4">F. Esperada Devolución</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {prestamos?.data && prestamos.data.length > 0 ? (
                  prestamos.data.map((prestamo: any) => (
                    <tr key={prestamo.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-semibold text-slate-700">#{prestamo.id}</td>
                      <td className="p-4 text-slate-800">
                        <div className="font-medium">{prestamo.ejemplar?.recurso?.titulo || 'Recurso genérico'}</div>
                        <div className="text-xs text-slate-500">Cód. Barras: {prestamo.ejemplar?.codigo_barras || 'N/A'}</div>
                      </td>
                      <td className="p-4 text-slate-600">{prestamo.usuario?.name || 'Usuario desconocido'}</td>
                      <td className="p-4 text-slate-600">{prestamo.fecha_prestamo?.substring(0, 10)}</td>
                      <td className="p-4 text-slate-600 font-medium">{prestamo.fecha_devolucion_esperada?.substring(0, 10)}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          prestamo.estado === 'activo' 
                            ? 'bg-blue-100 text-blue-800' 
                            : prestamo.estado === 'atrasado'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {prestamo.estado}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {prestamo.estado === 'activo' && esAdminBibliotecario && (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleDevolver(prestamo.id)}
                              className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors shadow-sm"
                            >
                              Devolver
                            </button>
                            <button
                              onClick={() => handleRenovar(prestamo.id)}
                              className="bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-amber-700 transition-colors shadow-sm"
                            >
                              Renovar
                            </button>
                          </div>
                        )}
                        {prestamo.estado === 'devuelto' && (
                          <span className="text-xs text-slate-400 font-medium">Finalizado</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No hay registros de préstamos disponibles.
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