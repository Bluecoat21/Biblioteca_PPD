import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function MultasCreate({ usuarios = [], prestamos = [] }: { usuarios: any[]; prestamos: any[] }) {
  const { data, setData, post, processing, errors } = useForm({
    user_id: '',
    prestamo_id: '',
    monto: '',
    motivo: 'atraso',
    dias_atraso: '',
    observaciones: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/multas');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Head title="Registrar Multa o Sanción - Biblioteca PPD" />

      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Registrar Nueva Multa</h1>
              <p className="text-xs text-slate-500">Genera una sanción económica por retraso o deterioro de material.</p>
            </div>
            <Link
              href="/multas"
              className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-300 transition-colors"
            >
              Volver
            </Link>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {/* Usuario */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Usuario Infractor</label>
              <select
                value={data.user_id}
                onChange={(e) => setData('user_id', e.target.value)}
                className="w-full border-slate-300 rounded-xl shadow-sm focus:border-blue-500 text-sm"
                required
              >
                <option value="">Seleccione un usuario...</option>
                {usuarios?.map((u: any) => (
                  <option key={u.id} value={u.id}>
                    {u.name} (DNI: {u.documento_identidad || 'N/A'})
                  </option>
                ))}
              </select>
              {errors.user_id && <span className="text-xs text-red-600 mt-1 block">{errors.user_id}</span>}
            </div>

            {/* Préstamo Asociado */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Préstamo Asociado (Opcional)</label>
              <select
                value={data.prestamo_id}
                onChange={(e) => setData('prestamo_id', e.target.value)}
                className="w-full border-slate-300 rounded-xl shadow-sm focus:border-blue-500 text-sm"
              >
                <option value="">Ninguno / Externo</option>
                {prestamos?.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    Préstamo #{p.id} (Ejemplar #{p.ejemplar_id})
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de Motivo y Monto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Motivo de la Sanción</label>
                <select
                  value={data.motivo}
                  onChange={(e) => setData('motivo', e.target.value)}
                  className="w-full border-slate-300 rounded-xl shadow-sm focus:border-blue-500 text-sm"
                  required
                >
                  <option value="atraso">Retraso en devolución</option>
                  <option value="dano">Deterioro o daño del ejemplar</option>
                  <option value="perdida">Pérdida de material</option>
                  <option value="otro">Otro motivo administrativo</option>
                </select>
                {errors.motivo && <span className="text-xs text-red-600 mt-1 block">{errors.motivo}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Monto de la Multa (S/.)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={data.monto}
                  onChange={(e) => setData('monto', e.target.value)}
                  className="w-full border-slate-300 rounded-xl shadow-sm focus:border-blue-500 text-sm"
                  required
                />
                {errors.monto && <span className="text-xs text-red-600 mt-1 block">{errors.monto}</span>}
              </div>
            </div>

            {/* Días de atraso */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Días de Atraso (Opcional)</label>
              <input
                type="number"
                min="0"
                placeholder="Ej. 3"
                value={data.dias_atraso}
                onChange={(e) => setData('dias_atraso', e.target.value)}
                className="w-full border-slate-300 rounded-xl shadow-sm focus:border-blue-500 text-sm"
              />
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Observaciones o Detalle</label>
              <textarea
                value={data.observaciones}
                onChange={(e) => setData('observaciones', e.target.value)}
                rows={3}
                placeholder="Detalle adicional sobre la sanción aplicada..."
                className="w-full border-slate-300 rounded-xl shadow-sm focus:border-blue-500 text-sm"
              />
            </div>

            {/* Botón */}
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