import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function SuspensionesCreate({ usuarios }: { usuarios: any[] }) {
  const { data, setData, post, processing, errors } = useForm({
    user_id: '',
    motivo: '',
    fecha_inicio: '',
    fecha_fin: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/suspensiones');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Head title="Nueva Suspensión - Biblioteca PPD" />

      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Registrar Nueva Suspensión</h1>
              <p className="text-xs text-slate-500">Bloqueo temporal de privilegios e inhabilitación física de miembros.</p>
            </div>
            <Link
              href="/suspensiones"
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
                required
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
                required
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
                  required
                />
                {errors.fecha_inicio && <span className="text-xs text-red-600 mt-1 block">{errors.fecha_inicio}</span>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Fecha de Fin (Opcional)</label>
                <input
                  type="date"
                  value={data.fecha_fin}
                  onChange={(e) => setData('fecha_fin', e.target.value)}
                  className="w-full border-slate-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Déjalo en blanco si es una suspensión indefinida.</span>
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
                Aplicar Suspensión e Inhabilitar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}