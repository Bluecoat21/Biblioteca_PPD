import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function PrestamosCreate() {
  const { ejemplaresDisponibles, usuarios } = usePage().props as any;

  const { data, setData, post, processing, errors } = useForm({
    ejemplar_id: '',
    user_id: '',
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
    post(getRoute('prestamos.store', '/prestamos'));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Head title="Registrar Nuevo Préstamo" />

      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Registrar Nuevo Préstamo</h1>
              <p className="text-sm text-slate-600">Asigna un ejemplar disponible a un usuario registrado.</p>
            </div>
            <Link
              href={getRoute('prestamos.index', '/prestamos')}
              className="text-sm text-slate-600 hover:text-slate-900 font-medium"
            >
              ← Volver
            </Link>
          </div>

          <form onSubmit={submit} className="space-y-6">
            {/* Selector de Usuario */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Usuario Solicitante</label>
              <select
                value={data.user_id}
                onChange={(e) => setData('user_id', e.target.value)}
                className="w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Seleccione un usuario...</option>
                {usuarios?.map((u: any) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
              {errors.user_id && <p className="text-red-600 text-xs mt-1">{errors.user_id}</p>}
            </div>

            {/* Selector de Ejemplar Disponible */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Ejemplar Disponible</label>
              <select
                value={data.ejemplar_id}
                onChange={(e) => setData('ejemplar_id', e.target.value)}
                className="w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Seleccione un ejemplar...</option>
                {ejemplaresDisponibles?.map((ej: any) => (
                  <option key={ej.id} value={ej.id}>
                    {ej.recurso?.titulo} — Cód. Barras: {ej.codigo_barras}
                  </option>
                ))}
              </select>
              {errors.ejemplar_id && <p className="text-red-600 text-xs mt-1">{errors.ejemplar_id}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="submit"
                disabled={processing}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
              >
                Registrar Préstamo
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}