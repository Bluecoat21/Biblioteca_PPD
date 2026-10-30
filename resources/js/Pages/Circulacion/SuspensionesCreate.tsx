import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function SuspensionesCreate({ usuarios }: { usuarios: any[] }) {
  const { data, setData, post, processing, errors } = useForm({
    user_id: '',
    motivo: '',
    fecha_inicio: '',
    fecha_fin: '',
  });

  const getRoute = (routeName: string, fallbackUrl: string) => {
    try {
      if (typeof window !== 'undefined' && (window as any).route) {
        return (window as any).route(routeName);
      }
    } catch (e) {}
    return fallbackUrl;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(getRoute('suspensiones.store', '/suspensiones'));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Head title="Nueva Suspensión" />

      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Registrar Nueva Suspensión</h1>
              <p className="text-xs text-slate-500">Bloqueo temporal de privilegios para un miembro.</p>
            </div>
            <Link
              href={getRoute('suspensiones.index', '/suspensiones')}
              className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-300 transition-colors"
            >
              Volver
            </Link>
          </div>

          <form onSubmit={submit} className="space-y-6">
            {/* Usuario */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Usuario a Suspender</label>
              <select
                value={data.user_id}
                onChange={(e) => setData('user_id', e.target.value)}
                className="w-full border-slate-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="">Seleccione un usuario...</option>
                {usuarios?.map((u: any) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
              {errors.user_id && <span className="text-xs text-red-600 mt-1 block">{errors.user_id}</span>}
            </div>

            {/* Motivo */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Motivo de la Suspensión</label>
              <textarea
                value={data.motivo}
                onChange={(e) => setData('motivo', e.target.value)}
                rows={3}
                placeholder="Ej. Retraso reiterado en devolución de material bibliográfico..."
                className="w-full border-slate-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
              {errors.motivo && <span className="text-xs text-red-600 mt-1 block">{errors.motivo}</span>}
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Fecha de Inicio</label>
                <input
                  type="date"
                  value={data.fecha_inicio}
                  onChange={(e) => setData('fecha_inicio', e.target.value)}
                  className="w-full border-slate-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
                {errors.fecha_inicio && <span className="text-xs text-red-600 mt-1 block">{errors.fecha_inicio}</span>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Fecha de Fin</label>
                <input
                  type="date"
                  value={data.fecha_fin}
                  onChange={(e) => setData('fecha_fin', e.target.value)}
                  className="w-full border-slate-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
                {errors.fecha_fin && <span className="text-xs text-red-600 mt-1 block">{errors.fecha_fin}</span>}
              </div>
            </div>

            {/* Botón de Guardar */}
            <div className="flex justify-end pt-4 border-t">
              <button
                type="submit"
                disabled={processing}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
              >
                Aplicar Suspensión
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}