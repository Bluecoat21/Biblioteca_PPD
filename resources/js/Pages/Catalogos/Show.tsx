import React from 'react';
import { Head, usePage, router, Link } from '@inertiajs/react';

export default function CatalogosShow() {
  const { recurso, auth, esAdmin } = usePage().props as any;

  const handleReservar = (recursoId: number) => {
    if (!auth?.user?.id) {
      alert('Debes iniciar sesión para realizar una reserva.');
      return;
    }
    if (confirm('¿Deseas realizar una reserva física para este recurso bibliográfico?')) {
      router.post('/reservas', {
        recurso_bibliografico_id: recursoId,
        user_id: auth.user.id,
      }, { preserveScroll: true });
    }
  };

  const handleEliminar = (id: number, titulo: string) => {
    if (confirm(`¿Estás seguro de eliminar / dar de baja el recurso "${titulo}"?`)) {
      router.delete(`/recursos/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <Head title={`Detalle - ${recurso?.titulo || 'Recurso'}`} />
      
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-6 flex items-center justify-between text-sm text-slate-500">
            <Link href="/recursos" className="hover:text-blue-600 flex items-center gap-2 font-medium transition-colors">
                <i className="fa-solid fa-arrow-left"></i> Volver al Catálogo
            </Link>
            <Link href="/dashboard" className="hover:text-blue-600 flex items-center gap-2 font-medium transition-colors">
                <i className="fa-solid fa-house"></i> Ir al Dashboard
            </Link>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-col md:flex-row gap-8">
            
            <div className="w-full md:w-5/12 flex flex-col items-center">
                {recurso?.portada_url ? (
                <img 
                    src={`/storage/${recurso.portada_url}`} 
                    alt={recurso.titulo} 
                    className="w-full h-96 object-cover rounded-xl shadow-md border border-slate-200"
                />
                ) : recurso?.es_digital && recurso?.archivo_url ? (
                <div className="w-full h-96 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 relative">
                    <div className="absolute inset-0 overflow-hidden">
                        <iframe
                        src={`/storage/${recurso.archivo_url}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
                        className="absolute top-0 left-0 w-[200%] h-[200%] border-0 select-none pointer-events-none origin-top-left"
                        style={{ transform: 'scale(0.5)', transformOrigin: 'top left' }}
                        title="Vista previa de la primera página"
                        />
                    </div>
                </div>
                ) : (
                <div className="w-full h-80 bg-[#0f2b48] rounded-xl p-6 text-white flex flex-col justify-between shadow-inner">
                    <div>
                    <span className="bg-blue-600 text-xs px-2.5 py-1 rounded-md uppercase font-bold tracking-wider">
                        {recurso?.tipo || 'Libro'}
                    </span>
                    <h2 className="text-xl font-bold mt-4 line-clamp-3">{recurso?.titulo}</h2>
                    </div>
                    <div className="text-xs text-slate-300 mt-6">
                    ISBN: <span className="text-white font-mono">{recurso?.isbn || 'N/A'}</span>
                    </div>
                </div>
                )}
            </div>

            <div className="flex-1 flex flex-col justify-between">
                <div>
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-2xl font-bold text-slate-800">{recurso?.titulo}</h1>
                    
                    {esAdmin && (
                    <button
                        onClick={() => handleEliminar(recurso.id, recurso.titulo)}
                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                        title="Borrado Lógico"
                    >
                        <i className="fa-solid fa-trash-can"></i> Eliminar
                    </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4 mt-2">
                    {recurso?.categorias && recurso.categorias.length > 0 ? (
                    recurso.categorias.map((cat: any) => (
                        <span key={cat.id} className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                        #{cat.nombre}
                        </span>
                    ))
                    ) : (
                    <span className="text-xs text-slate-400 italic">Sin categorías asignadas</span>
                    )}
                </div>

                <p className="text-sm text-slate-500 mb-4">
                    Autor(es): <span className="font-semibold text-slate-700">
                    {recurso?.autores?.map((a: any) => `${a.nombres} ${a.apellidos}`).join(', ') || 'Autor institucional'}
                    </span>
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                    <h3 className="text-xs font-bold uppercase text-slate-400 mb-1">Sinopsis / Resumen</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{recurso?.sinopsis || 'Sin sinopsis registrada.'}</p>
                </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100">
                {recurso?.es_digital && recurso?.archivo_url ? (
                    <a
                    href={`/storage/${recurso.archivo_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 text-sm shadow-sm"
                    >
                    <i className="fa-solid fa-file-pdf"></i> Ver / Descargar PDF Completo
                    </a>
                ) : (
                    <button
                    onClick={() => handleReservar(recurso.id)}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm shadow-sm"
                    >
                    <i className="fa-solid fa-bookmark"></i> Reservar Ejemplar Físico
                    </button>
                )}
                </div>
            </div>

            </div>
        </div>
      </div>
    </div>
  );
}