import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import VirtualAssistantWidget from '../../Components/VirtualAssistantWidget';

export default function PrestamosIndex() {
  const { prestamos, esAdmin } = usePage().props as any;
  const listaPrestamos = prestamos?.data || [];

  const handleDevolver = (prestamoId: number) => {
    if (confirm('¿Confirmas la recepción y devolución de este ejemplar al inventario?')) {
      router.post(`/prestamos/${prestamoId}/devolver`, {}, {
        preserveScroll: true,
      });
    }
  };

  const handleRenovar = (prestamoId: number) => {
    if (confirm('¿Deseas extender el plazo de este préstamo?')) {
      router.post(`/prestamos/${prestamoId}/renovar`, {}, {
        preserveScroll: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Head title="Gestión de Préstamos" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Encabezado y Botón de Nuevo Préstamo */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {esAdmin ? 'Gestión General de Préstamos' : 'Mis Préstamos'}
              </h1>
              <p className="text-sm text-slate-600">Control de entregas, devoluciones y plazos vigentes de libros físicos.</p>
            </div>
            <div className="flex gap-3 items-center">
              {esAdmin && (
                <Link
                  href="/prestamos/create"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  <i className="fa-solid fa-plus"></i> Nuevo Préstamo
                </Link>
              )}
              <Link
                href="/dashboard"
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
                  {esAdmin && <th className="p-4">Usuario / Lector</th>}
                  <th className="p-4">Recurso / Ejemplar</th>
                  <th className="p-4">F. Préstamo</th>
                  <th className="p-4">F. Esperada Devolución</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {listaPrestamos.length > 0 ? (
                  listaPrestamos.map((p: any) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-semibold text-slate-700">#{p.id}</td>
                      
                      {esAdmin && (
                        <td className="p-4 text-slate-800 font-medium">
                          {p.usuario?.name || 'N/A'}
                          <span className="block text-xs font-mono text-slate-500">{p.usuario?.email}</span>
                        </td>
                      )}

                      <td className="p-4 text-slate-800 font-medium">
                        {p.ejemplar?.recurso?.titulo || 'Libro físico'}
                        <span className="block text-xs font-mono text-blue-600">Cód: {p.ejemplar?.codigo_barras || 'S/N'}</span>
                      </td>
                      <td className="p-4 text-slate-600">{p.fecha_prestamo?.substring(0, 10)}</td>
                      <td className="p-4 text-slate-600 font-medium">{p.fecha_devolucion_esperada?.substring(0, 10)}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          p.estado === 'activo' 
                            ? 'bg-blue-100 text-blue-800' 
                            : p.estado === 'devuelto'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {p.estado}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {p.estado === 'activo' && esAdmin && (
                            <>
                              <button
                                onClick={() => handleDevolver(p.id)}
                                className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors shadow-sm"
                              >
                                Registrar Devolución
                              </button>
                              <button
                                onClick={() => handleRenovar(p.id)}
                                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors shadow-sm"
                              >
                                Renovar
                              </button>
                            </>
                          )}
                          {p.estado === 'activo' && !esAdmin && (
                            <span className="text-xs text-slate-400 italic">En plazo vigente</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={esAdmin ? 7 : 6} className="p-12 text-center text-slate-500">
                      <div className="max-w-sm mx-auto space-y-3">
                        <p className="text-base font-semibold text-slate-700">No hay préstamos registrados</p>
                        <p className="text-xs text-slate-500">
                          {esAdmin 
                            ? 'No existen registros activos de préstamos físicos en el sistema.' 
                            : 'Actualmente no cuentas con préstamos vigentes de libros físicos.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <VirtualAssistantWidget hideForAdmin={esAdmin} />
    </div>
  );
}