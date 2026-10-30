import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function MultasCreate({ usuarios, prestamos }: { usuarios: any[]; prestamos: any[] }) {
  const { data, setData, post, processing, errors } = useForm({
    user_id: '',
    prestamo_id: '',
    monto: '',
    motivo: '',
    dias_atraso: '',
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
    post(getRoute('multas.store', '/multas'));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Head title="Registrar Multa o Sanción" />

      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Registrar Nueva Multa</h1>
              <p className="text-xs text-slate-500">Genera una sanción económica por retraso o incumplimiento.</p>
            </div>
            <Link
              href={getRoute('multas.index', '/multas')}
              className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-300 transition-colors"
            >
              Volver
            </Link>
          </div>

          <form onSubmit={submit} className="space-y-6">
            {/* Selección de Usuario */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Usuario Infractor</label>
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

            {/* Asociación con Préstamo (Opcional) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Préstamo Asociado (Opcional)</label>
              <select
                value={data.prestamo_id}
                onChange={(e) => setData('prestamo_id', e.target.value)}
                className="w-full border-slate-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="">Ninguno / Externo</option>
                {prestamos?.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    Préstamo #{p.id} - Ejemplar ID: {p.ejemplar_id}
                  </option>
                ))}
              </select>
              {errors.prestamo_id && <span className="text-xs text-red-600 mt-1 block">{errors.prestamo_id}</span>}
            </div>

            {/* Monto y Días de Atraso */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Monto de la Multa (S/.)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={data.monto}
                  onChange={(e) => setData('monto', e.target.value)}
                  className="w-full border-slate-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
                {errors.monto && <span className="text-xs text-red-600 mt-1 block">{errors.monto}</span>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Días de Atraso</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Ej. 3"
                  value={data.dias_atraso}
                  onChange={(e) => setData('dias_atraso', e.target.value)}
                  className="w-full border-slate-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
                {errors.dias_atraso && <span className="text-xs text-red-600 mt-1 block">{errors.dias_atraso}</span>}
              </div>
            </div>

            {/* Motivo */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Motivo o Descripción de la Multa</label>
              <textarea
                value={data.motivo}
                onChange={(e) => setData('motivo', e.target.value)}
                rows={3}
                placeholder="Ej. Demora en la devolución del material bibliográfico..."
                className="w-full border-slate-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
              {errors.motivo && <span className="text-xs text-red-600 mt-1 block">{errors.motivo}</span>}
            </div>

            {/* Botón de Guardar */}
            <div className="flex justify-end pt-4 border-t">
              <button
                type="submit"
                disabled={processing}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
              >
                Registrar Multa
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}