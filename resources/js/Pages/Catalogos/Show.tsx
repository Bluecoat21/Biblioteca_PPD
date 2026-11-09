import React, { useState } from 'react';
import { Head, usePage, router, Link, useForm } from '@inertiajs/react';

export default function CatalogosShow() {
  const { 
    recurso, 
    auth, 
    esAdmin, 
    totalEjemplares = 0, 
    ejemplaresDisponiblesCount = 0, 
    ubicaciones = [],
    usuarioTienePrestamo = false,
    usuarioTieneReserva = false 
  } = usePage().props as any;

  const roles = auth?.user?.roles || [];
  const hasRole = roles.some((r: any) => {
    const roleName = typeof r === 'string' ? r : r?.name;
    return roleName && ['admin', 'administrator', 'bibliotecario', 'administrador'].includes(roleName.toLowerCase());
  });
  const esAdminBibliotecario = esAdmin || hasRole || auth?.user?.email === '12345@1.test';

  const [mostrarFormEjemplar, setMostrarFormEjemplar] = useState(false);

  // Formulario reactivo para alta rápida de ejemplares físicos
  const { data, setData, post, processing, reset, errors } = useForm({
    codigo_barras: `BAR-${Math.floor(100000 + Math.random() * 900000)}`,
    signatura_topografica: '',
    estado: 'disponible',
    tipo_adquisicion: 'compra',
    ubicacion_id: ubicaciones[0]?.id || '',
    fecha_adquisicion: new Date().toISOString().split('T')[0],
    observaciones: '',
  });

  const handleStoreEjemplar = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/recursos/${recurso.id}/ejemplares`, {
      onSuccess: () => {
        reset();
        setMostrarFormEjemplar(false);
      },
    });
  };

  const handleEliminarEjemplar = (ejemplarId: number) => {
    if (confirm('¿Estás seguro de eliminar este ejemplar del inventario?')) {
      router.delete(`/ejemplares/${ejemplarId}`, { preserveScroll: true });
    }
  };

  const handleReservar = (recursoId: number) => {
    if (!auth?.user || !auth.user.id) {
      alert('Debes iniciar sesión para realizar una reserva.');
      return;
    }
    if (confirm('¿Deseas registrarte en la cola de reserva virtual para este recurso bibliográfico?')) {
      router.post('/reservas', {
        recurso_bibliografico_id: recursoId,
        user_id: auth.user.id,
      }, { preserveScroll: true });
    }
  };

  const handleEliminarRecurso = (id: number, titulo: string) => {
    if (confirm(`¿Estás seguro de dar de baja el recurso "${titulo}"?`)) {
      router.delete(`/recursos/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <Head title={`Detalle - ${recurso?.titulo || 'Recurso'}`} />
      
      <div className="max-w-5xl mx-auto">
        
        {/* Navegación rápida */}
        <div className="mb-6 flex items-center justify-between text-sm text-slate-500">
            <Link href="/recursos" className="hover:text-blue-600 flex items-center gap-2 font-medium transition-colors">
                <i className="fa-solid fa-arrow-left"></i> Volver al Catálogo
            </Link>
            <Link href="/dashboard" className="hover:text-blue-600 flex items-center gap-2 font-medium transition-colors">
                <i className="fa-solid fa-house"></i> Ir al Dashboard
            </Link>
        </div>

        {/* Tarjeta principal de detalle */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
            <div className="flex flex-col md:flex-row gap-8">
            
            {/* Portada o visualizador PDF */}
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
                        title="Vista previa PDF"
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

            {/* Ficha técnica y botones */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-2xl font-bold text-slate-800">{recurso?.titulo}</h1>
                    
                    {esAdminBibliotecario && (
                    <button
                        onClick={() => handleEliminarRecurso(recurso.id, recurso.titulo)}
                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                        <i className="fa-solid fa-trash-can"></i> Eliminar Recurso
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

                {/* Evaluación de Estados de Disponibilidad y Restricciones */}
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
                    !esAdminBibliotecario && (
                      usuarioTienePrestamo ? (
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-blue-800 text-sm w-full">
                          <p className="font-bold flex items-center gap-2">
                            <i className="fa-solid fa-book-reader text-blue-600"></i> Préstamo en posesión
                          </p>
                          <p className="text-xs mt-1 text-blue-700 leading-relaxed">
                            Actualmente tienes un ejemplar físico prestado de este recurso. Debes devolverlo antes de realizar nuevas solicitudes o reservas.
                          </p>
                        </div>
                      ) : usuarioTieneReserva ? (
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm w-full">
                          <p className="font-bold flex items-center gap-2">
                            <i className="fa-solid fa-clock text-amber-600"></i> Reserva en trámite
                          </p>
                          <p className="text-xs mt-1 text-amber-700 leading-relaxed">
                            Ya te encuentras registrado en la cola de espera de este recurso. Revisa el estado de tu turno en el módulo de <strong>Mis Reservas</strong>.
                          </p>
                        </div>
                      ) : totalEjemplares === 0 ? (
                        <div className="bg-slate-100 border border-slate-300 p-4 rounded-xl text-slate-700 text-sm w-full">
                          <p className="font-bold flex items-center gap-2 text-slate-800">
                            <i className="fa-solid fa-triangle-exclamation text-amber-500"></i> Sin copias físicas en inventario
                          </p>
                          <p className="text-xs mt-1 text-slate-600 leading-relaxed">
                            Este libro aún no cuenta con ejemplares físicos registrados en el inventario.
                          </p>
                        </div>
                      ) : ejemplaresDisponiblesCount > 0 ? (
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm w-full">
                          <p className="font-bold flex items-center gap-2">
                            <i className="fa-solid fa-circle-info text-amber-600"></i> Ejemplar disponible en estantería
                          </p>
                          <p className="text-xs mt-1 text-amber-700 leading-relaxed">
                            Actualmente hay <strong>{ejemplaresDisponiblesCount}</strong> copia(s) física(s) lista(s). Acércate a la biblioteca con tu <strong>DNI</strong> para solicitar el préstamo directo.
                          </p>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleReservar(recurso.id)}
                          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm shadow-sm"
                        >
                          <i className="fa-solid fa-bookmark"></i> Entrar en Cola de Reserva
                        </button>
                      )
                    )
                )}
                </div>
            </div>

            </div>
        </div>

        {/* Módulo Administrativo: Inventario Físico */}
        {esAdminBibliotecario && !recurso?.es_digital && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Inventario de Ejemplares Físicos</h2>
                        <p className="text-xs text-slate-500">Gestión de copias físicas registradas para este libro</p>
                    </div>
                    <button
                        onClick={() => setMostrarFormEjemplar(!mostrarFormEjemplar)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
                    >
                        <i className={`fa-solid ${mostrarFormEjemplar ? 'fa-xmark' : 'fa-plus'}`}></i>
                        {mostrarFormEjemplar ? 'Cancelar' : 'Agregar Nuevo Ejemplar'}
                    </button>
                </div>

                {mostrarFormEjemplar && (
                    <form onSubmit={handleStoreEjemplar} className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 space-y-4">
                        <h3 className="text-sm font-bold text-slate-700 uppercase">Registrar Copia Física</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Código de Barras *</label>
                                <input
                                    type="text"
                                    value={data.codigo_barras}
                                    onChange={(e) => setData('codigo_barras', e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                                    required
                                />
                                {errors.codigo_barras && <span className="text-[10px] text-red-600">{errors.codigo_barras}</span>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Signatura Topográfica</label>
                                <input
                                    type="text"
                                    placeholder="Ej. 005.1 / H67"
                                    value={data.signatura_topografica}
                                    onChange={(e) => setData('signatura_topografica', e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Ubicación Física *</label>
                                <select
                                    value={data.ubicacion_id}
                                    onChange={(e) => setData('ubicacion_id', e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                                    required
                                >
                                    <option value="">Seleccionar estante...</option>
                                    {ubicaciones.map((ubi: any) => (
                                        <option key={ubi.id} value={ubi.id}>{ubi.nombre} (Piso {ubi.piso || 1})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Tipo de Adquisición *</label>
                                <select
                                    value={data.tipo_adquisicion}
                                    onChange={(e) => setData('tipo_adquisicion', e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                                >
                                    <option value="compra">Compra</option>
                                    <option value="donacion">Donación</option>
                                    <option value="intercambio">Intercambio</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Fecha de Adquisición</label>
                                <input
                                    type="date"
                                    value={data.fecha_adquisicion}
                                    onChange={(e) => setData('fecha_adquisicion', e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Estado Inicial</label>
                                <select
                                    value={data.estado}
                                    onChange={(e) => setData('estado', e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                                >
                                    <option value="disponible">Disponible</option>
                                    <option value="mantenimiento">Mantenimiento</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all"
                            >
                                Guardar Ejemplar
                            </button>
                        </div>
                    </form>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider">
                                <th className="p-3">Código de Barras</th>
                                <th className="p-3">Signatura</th>
                                <th className="p-3">Ubicación</th>
                                <th className="p-3">Adquisición</th>
                                <th className="p-3">Estado</th>
                                <th className="p-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {recurso?.ejemplares && recurso.ejemplares.length > 0 ? (
                                recurso.ejemplares.map((ej: any) => (
                                    <tr key={ej.id} className="hover:bg-slate-50">
                                        <td className="p-3 font-mono font-bold text-slate-900">{ej.codigo_barras}</td>
                                        <td className="p-3">{ej.signatura_topografica || 'S/N'}</td>
                                        <td className="p-3">{ej.ubicacion?.nombre || 'Estante Principal'}</td>
                                        <td className="p-3 capitalize">{ej.tipo_adquisicion}</td>
                                        <td className="p-3">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                                                ej.estado === 'disponible' 
                                                    ? 'bg-emerald-100 text-emerald-800' 
                                                    : ej.estado === 'prestado'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {ej.estado}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <button
                                                onClick={() => handleEliminarEjemplar(ej.id)}
                                                className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                                                title="Eliminar ejemplar"
                                            >
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                                        No hay ejemplares físicos registrados para este recurso.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}