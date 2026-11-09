import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import VirtualAssistantWidget from '../../Components/VirtualAssistantWidget';

export default function MultasIndex() {
  const { multas, auth, esAdmin } = usePage().props as any;

  // Verificación robusta de rol de administrador o bibliotecario
  const roles = auth?.user?.roles || [];
  const hasRole = roles.some((r: any) => {
    const roleName = typeof r === 'string' ? r : r?.name;
    return roleName && ['admin', 'administrator', 'bibliotecario', 'administrador'].includes(roleName.toLowerCase());
  });
  
  const esAdminBibliotecario = esAdmin !== undefined ? esAdmin : (hasRole || auth?.user?.email === '12345@1.test');

  const handlePagar = (multaId: number) => {
    if (confirm('¿Confirmas el pago y liquidación de esta multa?')) {
      router.post(`/multas/${multaId}/pagar`, {}, {
        preserveScroll: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Head title="Gestión de Multas y Sanciones - Biblioteca PPD" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {esAdminBibliotecario ? 'Gestión General de Multas' : 'Mis Multas y Sanciones'}
              </h1>
              <p className="text-sm text-slate-600">
                {esAdminBibliotecario ? 'Control administrativo de sanciones económicas y cobros.' : 'Control de tus sanciones económicas por retraso en entregas.'}
              </p>
            </div>
            <div className="flex gap-3">
              {esAdminBibliotecario && (
                <Link
                  href="/multas/create"
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  <span>+ Registrar Multa</span>
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

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0f2b48] text-white text-sm">
                  <th className="p-4">ID</th>
                  {esAdminBibliotecario && <th className="p-4">Usuario Infractor</th>}
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
                      {esAdminBibliotecario && (
                        <td className="p-4 text-slate-800 font-medium">
                          {multa.user?.name || 'Usuario desconocido'}
                          <div className="text-xs text-slate-400 font-mono">DNI: {multa.user?.documento_identidad || 'N/A'}</div>
                        </td>
                      )}
                      <td className="p-4 text-slate-600 capitalize">{multa.motivo}</td>
                      <td className="p-4 font-bold text-red-600">S/. {multa.monto}</td>
                      <td className="p-4 text-slate-600">{multa.dias_atraso || 0} días</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          multa.estado === 'pendiente' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {multa.estado.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {multa.estado === 'pendiente' && esAdminBibliotecario ? (
                          <button
                            onClick={() => handlePagar(multa.id)}
                            className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
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
                    <td colSpan={esAdminBibliotecario ? 7 : 6} className="p-12 text-center text-slate-500">
                      <div className="max-w-sm mx-auto space-y-2">
                        <p className="text-base font-semibold text-emerald-700">¡Sin multas pendientes!</p>
                        <p className="text-xs text-slate-500">
                          {esAdminBibliotecario 
                            ? 'No se registran multas o sanciones activas en la base de datos.' 
                            : 'No tienes sanciones económicas registradas. Mantienes un historial limpio.'}
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
      <VirtualAssistantWidget hideForAdmin={esAdminBibliotecario} />
    </div>
  );
}