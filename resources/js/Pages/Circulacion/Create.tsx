import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

interface Props {
  usuarios: any[];
  ejemplaresDisponibles: any[];
}

export default function PrestamosCreate({ usuarios = [], ejemplaresDisponibles = [] }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    user_id: '',
    ejemplar_id: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/prestamos', {
      preserveScroll: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Head title="Registrar Nuevo Préstamo - Biblioteca PPD" />

      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Registrar Nuevo Préstamo</h1>
              <p className="text-xs text-slate-500">Asigna un ejemplar disponible a un usuario registrado y activo.</p>
            </div>
            <Link
              href="/prestamos"
              className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-300 transition-colors"
            >
              ← Volver
            </Link>
          </div>

          {/* Caja de errores que muestra el motivo exacto del bloqueo del servidor */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <p className="font-bold mb-1">No se pudo registrar el préstamo:</p>
              <ul className="list-disc pl-5 space-y-1">
                {Object.values(errors).map((errorMsg, idx) => (
                  <li key={idx}>{String(errorMsg)}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                Usuario Solicitante (Activos)
              </label>
              <select
                value={data.user_id}
                onChange={(e) => setData('user_id', e.target.value)}
                className="w-full border-slate-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                required
              >
                <option value="">Seleccione un usuario...</option>
                {usuarios?.map((u: any) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email || u.documento_identidad})
                  </option>
                ))}
              </select>
              {errors.user_id && <span className="text-xs text-red-600 mt-1 block">{errors.user_id}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                Ejemplar Disponible
              </label>
              <select
                value={data.ejemplar_id}
                onChange={(e) => setData('ejemplar_id', e.target.value)}
                className="w-full border-slate-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                required
              >
                <option value="">Seleccione un ejemplar...</option>
                {ejemplaresDisponibles?.map((e: any) => (
                  <option key={e.id} value={e.id}>
                    {e.recurso?.titulo || 'Recurso sin título'} — Cód. Barras: {e.codigo_barras}
                  </option>
                ))}
              </select>
              {errors.ejemplar_id && <span className="text-xs text-red-600 mt-1 block">{errors.ejemplar_id}</span>}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={processing}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {processing ? 'Registrando...' : 'Registrar Préstamo'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
