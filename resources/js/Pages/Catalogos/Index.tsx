import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

interface Recurso {
    id: number;
    titulo: string;
    isbn: string | null;
    tipo: string;
    anio_publicacion: number;
    es_digital: boolean;
    archivo_url: string | null;
    portada_url?: string | null;
    sinopsis: string | null;
}

interface Props {
    recursos: { data: Recurso[] } | Recurso[];
}

export default function CatalogosIndex({ recursos }: Props) {
    // Recibimos esAdmin directo del controlador
    const { esAdmin } = usePage().props as any;
    const [busqueda, setBusqueda] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');

    const listaRecursos = Array.isArray(recursos) ? recursos : (recursos?.data || []);

    const recursosFiltrados = listaRecursos.filter((rec) => {
        const coincideTexto = rec.titulo.toLowerCase().includes(busqueda.toLowerCase()) || 
                              (rec.isbn && rec.isbn.toLowerCase().includes(busqueda.toLowerCase()));
        const coincideTipo = filtroTipo === '' || rec.tipo === filtroTipo;
        return coincideTexto && coincideTipo;
    });

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <Head title="Módulo de Catálogos y Recursos" />

            <div className="max-w-7xl mx-auto">
                {/* BOTÓN VOLVER AL DASHBOARD */}
                <div className="mb-6 flex items-center text-sm text-slate-500">
                    <Link href="/dashboard" className="hover:text-blue-600 flex items-center gap-2 font-medium transition-colors">
                        <i className="fa-solid fa-arrow-left"></i> Volver al Dashboard
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0f2b48]">Catálogo Institucional y Repositorio</h1>
                        <p className="text-sm text-slate-500">Explora libros físicos, tesis virtuales y recursos bibliográficos</p>
                    </div>
                    
                    {/* BOTÓN DE NUEVO REGISTRO (Solo Admins) */}
                    {esAdmin && (
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Link 
                                href="/recursos/create" 
                                className="bg-[#0f2b48] hover:bg-[#1a426e] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all flex items-center gap-2 whitespace-nowrap"
                            >
                                <i className="fa-solid fa-plus"></i> Nuevo Registro
                            </Link>
                        </div>
                    )}
                </div>

                {/* ACCESOS DIRECTOS A CRUDS (Solo Admins) */}
                {esAdmin && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <Link href="/autores" className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all flex items-center justify-between group">
                            <div>
                                <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">Gestión</span>
                                <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600">Autores</h3>
                            </div>
                            <i className="fa-solid fa-pen-nib text-blue-600 text-xl"></i>
                        </Link>
                        <Link href="/categorias" className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all flex items-center justify-between group">
                            <div>
                                <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">Gestión</span>
                                <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600">Categorías y Taxonomía</h3>
                            </div>
                            <i className="fa-solid fa-tags text-blue-600 text-xl"></i>
                        </Link>
                        <Link href="/editoriales" className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all flex items-center justify-between group">
                            <div>
                                <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">Gestión</span>
                                <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600">Editoriales</h3>
                            </div>
                            <i className="fa-solid fa-building text-blue-600 text-xl"></i>
                        </Link>
                    </div>
                )}

                {/* BARRA DE BÚSQUEDA Y FILTRO */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-3 w-full md:w-96 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                        <i className="fa-solid fa-magnifying-glass text-slate-400"></i>
                        <input 
                            type="text"
                            placeholder="Buscar por título, ISBN..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="bg-transparent border-none focus:outline-none text-sm w-full text-slate-700"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <select
                            value={filtroTipo}
                            onChange={(e) => setFiltroTipo(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none w-full md:w-48"
                        >
                            <option value="">Todos los tipos / géneros</option>
                            <option value="libro">Libro</option>
                            <option value="tesis">Tesis</option>
                            <option value="revista">Revista</option>
                            <option value="digital">Digital</option>
                        </select>
                    </div>
                </div>

                {/* TARJETAS DE RECURSOS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {recursosFiltrados.map((rec) => (
                        <div key={rec.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
                            
                            <div className="h-44 bg-slate-900 overflow-hidden relative flex items-center justify-center">
                                {rec.portada_url ? (
                                    <img 
                                        src={`/storage/${rec.portada_url}`} 
                                        alt={rec.titulo} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                                    />
                                ) : rec.es_digital && rec.archivo_url ? (
                                    <div className="w-full h-full relative overflow-hidden bg-slate-100 cursor-pointer" onClick={() => window.location.href = `/recursos/${rec.id}`}>
                                        <div className="absolute inset-0 overflow-hidden">
                                            <iframe 
                                                src={`/storage/${rec.archivo_url}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0&view=Fit`} 
                                                className="absolute top-0 left-0 w-[200%] h-[200%] border-0 select-none pointer-events-none origin-top-left" 
                                                style={{ transform: 'scale(0.5)', transformOrigin: 'top left' }}
                                                title="Preview PDF" 
                                            />
                                        </div>
                                        <div className="absolute inset-0 z-10 bg-transparent"></div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full bg-[#0f2b48] p-4 flex flex-col justify-between text-white">
                                        <span className="text-xs font-mono">ISBN: {rec.isbn || 'N/A'}</span>
                                        <span className="font-bold text-sm line-clamp-2">{rec.titulo}</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="bg-blue-100 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded uppercase">
                                        {rec.tipo}
                                    </span>
                                    {rec.es_digital && (
                                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                                            PDF Virtual
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {rec.titulo}
                                </h3>
                                <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                                    {rec.sinopsis || 'Sin descripción.'}
                                </p>
                            </div>
                            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                                <span className="text-xs text-slate-400 font-mono">#{rec.id}</span>
                                <Link 
                                    href={`/recursos/${rec.id}`} 
                                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    Ver detalles <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                    ))}

                    {recursosFiltrados.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                            <i className="fa-solid fa-book-open text-4xl mb-3 block"></i>
                            No se encontraron recursos bibliográficos con los filtros seleccionados.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}