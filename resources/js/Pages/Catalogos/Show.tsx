import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function CatalogosShow() {
  // 1. Extraemos 'recurso' y 'auth' desde las props de Inertia
  const { recurso, auth } = usePage().props as any;

  // 2. Definimos la función de reserva usando auth.user.id
  const handleReservar = (recursoId: number) => {
    if (!auth?.user?.id) {
      alert('Debes iniciar sesión para realizar una reserva.');
      return;
    }

    if (confirm('¿Deseas realizar una reserva para este recurso bibliográfico?')) {
      router.post('/reservas', {
        recurso_bibliografico_id: recursoId,
        user_id: auth.user.id,
      }, {
        preserveScroll: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <Head title={`Detalle - ${recurso?.titulo || 'Recurso'}`} />
      
      {/* Contenido del detalle de tu recurso */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">{recurso?.titulo}</h1>
        <p className="text-slate-600 mb-6">{recurso?.sinopsis}</p>

        {/* Botón de Reserva */}
        <button
          onClick={() => handleReservar(recurso.id)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Reservar Recurso
        </button>
      </div>
    </div>
  );
}