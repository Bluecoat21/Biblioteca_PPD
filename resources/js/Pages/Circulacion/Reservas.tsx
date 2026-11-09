import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import VirtualAssistantWidget from '../../Components/VirtualAssistantWidget';

export default function ReservasIndex() {
  const { reservas, ejemplaresDisponibles = [], esAdmin, errors } = usePage().props as any;
  const esAdminBibliotecario = esAdmin;

  const [ejemplarSeleccionado, setEjemplarSeleccionado] = useState<{ [key: number]: string }>({});

  const handleNotificarRetiro = (reservaId: number) => {
    if (confirm('¿Confirmas que estás en camino a la biblioteca para recoger este libro?')) {
      router.post(`/reservas/${reservaId}/notificar-retiro`, {}, {
        preserveScroll: true,
      });
    }
  };

  const handleCompletar = (reservaId: number) => {
    const ejemplarId = ejemplarSeleccionado[reservaId];
    if (!ejemplarId) {
      alert('Por favor, seleccione un ejemplar físico disponible del estante para proceder con la entrega.');
      return;
    }

    if (confirm('¿Confirmas la entrega del libro? Esto registrará el préstamo automáticamente.')) {
      router.post(`/reservas/${reservaId}/completar`, {
        ejemplar_id: ejemplarId
      }, {
        preserveScroll: true,
      });
    }
  };

  const handleCancelar = (reservaId: number) => {
    if (confirm('¿Estás seguro de cancelar esta reserva?')) {
      router.post(`/reservas/${reservaId}/cancelar`, {}, {
        preserveScroll: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Head title="Gestión de Reservas" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {errors && Object.keys(errors).length > 0 && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
              <p className="font-bold">Se encontraron restricciones en el sistema:</p>
              <ul className="list-disc pl-5 mt-1">
                {Object.values(errors).map((err: any, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {esAdminBibliotecario ? 'Gestión General de Reservas' : 'Mis Reservas'}
              </h1>
              <p className="text-sm text-slate-600">Control de colas de espera, avisos de retiro y conversión a préstamos.</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/dashboard"
                className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                Volver al Dashboard
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0f2b48] text-white text-sm">
                  <th className="p-4">ID</th>
                  {esAdminBibliotecario && (
                    <>
                      <th className="p-4">Usuario</th>
                      <th className="p-4">DNI / Documento</th>
                    </>
                  )}
                  <th className="p-4">Recurso Bibliográfico</th>
                  <th className="p-4 text-center">Posición en Cola</th>
                  <th className="p-4">Fecha Reserva</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-center">Acciones / Retiro en Ventanilla</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {reservas?.data && reservas.data.length > 0 ? (
                  reservas.data.map((reserva: any) => (
                    <tr key={reserva.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-semibold text-slate-700">#{reserva.id}</td>
                      
                      {esAdminBibliotecario && (
                        <>
                          <td className="p-4 text-slate-800 font-medium">{reserva.usuario?.name || 'N/A'}</td>
                          <td className="p-4 text-slate-600 font-mono">{reserva.usuario?.documento_identidad || 'S/N'}</td>
                        </>
                      )}

                      <td className="p-4 text-slate-800 font-medium">
                        {reserva.recurso_bibliografico?.titulo || 'Recurso genérico'}
                      </td>
                      <td className="p-4 text-center font-bold text-blue-600">
                        {['pendiente', 'en_camino'].includes(reserva.estado) ? `#${reserva.posicion_cola || 1}` : '-'}
                      </td>
                      <td className="p-4 text-slate-600">{reserva.fecha_reserva?.substring(0, 10) || reserva.created_at?.substring(0, 10)}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          reserva.estado === 'pendiente' 
                            ? 'bg-blue-100 text-blue-800' 
                            : reserva.estado === 'en_camino'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : reserva.estado === 'completada'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {reserva.estado === 'en_camino' ? 'En camino a ventanilla' : reserva.estado}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                          
                          {/* Acciones para el Administrador / Bibliotecario */}
                          {['pendiente', 'en_camino'].includes(reserva.estado) && esAdminBibliotecario && (
                            <div className="flex items-center gap-2">
                              <select
                                className="text-xs border-slate-300 rounded-lg shadow-sm py-1.5 px-2"
                                onChange={(e) => setEjemplarSeleccionado({ ...ejemplarSeleccionado, [reserva.id]: e.target.value })}
                                defaultValue=""
                              >
                                <option value="" disabled>Seleccionar Ejemplar...</option>
                                {ejemplaresDisponibles
                                  .filter((ej: any) => ej.recurso_bibliografico_id === reserva.recurso_bibliografico_id)
                                  .map((ej: any) => (
                                    <option key={ej.id} value={ej.id}>
                                      Cód: {ej.codigo_barras}
                                    </option>
                                  ))}
                              </select>

                              <button
                                onClick={() => handleCompletar(reserva.id)}
                                className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors shadow-sm whitespace-nowrap"
                              >
                                Atender / Entregar
                              </button>
                            </div>
                          )}

                          {/* Acciones para el Lector / Usuario Estudiante (Validando Stock Real) */}
                          {!esAdminBibliotecario && reserva.estado === 'pendiente' && (() => {
                            const ejemplaresDelRecurso = reserva.recurso_bibliografico?.ejemplares || [];
                            const hayStockDisponible = ejemplaresDelRecurso.some((ej: any) => ej.estado === 'disponible');

                            return hayStockDisponible ? (
                              <button
                                onClick={() => handleNotificarRetiro(reserva.id)}
                                className="bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-amber-700 transition-colors shadow-sm flex items-center gap-1"
                              >
                                <i className="fa-solid fa-person-walking"></i> Voy a recogerlo
                              </button>
                            ) : (
                              <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 italic">
                                Esperando devolución (Sin stock libre)
                              </span>
                            );
                          })()}

                          {!esAdminBibliotecario && reserva.estado === 'en_camino' && (
                            <span className="text-xs text-amber-700 font-medium bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                              Presenta tu DNI en ventanilla
                            </span>
                          )}
                          
                          {['pendiente', 'en_camino'].includes(reserva.estado) && (
                            <button
                              onClick={() => handleCancelar(reserva.id)}
                              className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-700 transition-colors shadow-sm"
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={esAdminBibliotecario ? 8 : 6} className="p-12 text-center text-slate-500">
                      <div className="max-w-sm mx-auto space-y-3">
                        <p className="text-base font-semibold text-slate-700">No hay reservas registradas</p>
                        <p className="text-xs text-slate-500">
                          {esAdminBibliotecario 
                            ? 'No existen solicitudes de reserva pendientes en el sistema.' 
                            : 'No tienes reservas activas. Explora el catálogo para reservar libros en cola.'}
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