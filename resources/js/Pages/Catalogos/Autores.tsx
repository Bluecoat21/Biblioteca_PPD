import React, { useState } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';

interface Autor {
    id: number;
    nombres: string;
    apellidos: string;
    nacionalidad: string | null;
    biografia: string | null;
}

interface Props {
    autores: { data: Autor[] } | Autor[];
}

export default function Autores({ autores }: Props) {
    // Recibimos esAdmin directo del backend
    const { esAdmin } = usePage().props as any;
    
    const listaAutores = Array.isArray(autores) ? autores : (autores?.data || []);
    const [busqueda, setBusqueda] = useState('');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editando, setEditando] = useState<Autor | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        nombres: '',
        apellidos: '',
        nacionalidad: '',
        biografia: '',
    });

    const autoresFiltrados = listaAutores.filter(a => 
        `${a.nombres} ${a.apellidos}`.toLowerCase().includes(busqueda.toLowerCase())
    );

    const abrirPanelCrear = () => {
        setEditando(null);
        reset();
        setIsPanelOpen(true);
    };

    const abrirPanelEditar = (autor: Autor) => {
        setEditando(autor);
        setData({
            nombres: autor.nombres,
            apellidos: autor.apellidos,
            nacionalidad: autor.nacionalidad || '',
            biografia: autor.biografia || '',
        });
        setIsPanelOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editando) {
            put(`/autores/${editando.id}`, { onSuccess: () => setIsPanelOpen(false) });
        } else {
            post('/autores', { onSuccess: () => setIsPanelOpen(false) });
        }
    };

    const handleEliminar = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este autor?')) {
            destroy(`/autores/${id}`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8 relative overflow-hidden">
            <Head title="Gestión de Autores" />

            <div className="max-w-6xl mx-auto">
                <div className="mb-6 flex items-center text-sm text-slate-500">
                    <Link href="/recursos" className="hover:text-blue-600 flex items-center gap-2 font-medium transition-colors">
                        <i className="fa-solid fa-arrow-left"></i> Volver al Catálogo
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#0f2b48] tracking-tight">Directorio de Autores</h1>
                        <p className="text-sm text-slate-500 mt-1">Gestiona los escritores y sus obras registradas.</p>
                    </div>
                    
                    {/* BOTÓN CREAR (Solo Admins) */}
                    {esAdmin && (
                        <button 
                            onClick={abrirPanelCrear}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
                        >
                            <i className="fa-solid fa-plus"></i> Nuevo Autor
                        </button>
                    )}
                </div>

                <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-8 flex items-center gap-3">
                    <i className="fa-solid fa-magnifying-glass text-slate-400 ml-4"></i>
                    <input 
                        type="text"
                        placeholder="Buscar por nombre o apellido..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="bg-transparent border-none focus:outline-none text-sm w-full py-3 text-slate-700"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {autoresFiltrados.map((autor) => (
                        <div key={autor.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                                    {autor.nombres.charAt(0)}{autor.apellidos.charAt(0)}
                                </div>
                                
                                {/* BOTONES EDITAR/ELIMINAR (Solo Admins) */}
                                {esAdmin && (
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => abrirPanelEditar(autor)} className="text-slate-400 hover:text-blue-600 p-2"><i className="fa-solid fa-pen"></i></button>
                                        <button onClick={() => handleEliminar(autor.id)} className="text-slate-400 hover:text-red-600 p-2"><i className="fa-solid fa-trash"></i></button>
                                    </div>
                                )}
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg">{autor.apellidos}, {autor.nombres}</h3>
                            <p className="text-xs text-slate-400 mb-3">{autor.nacionalidad || 'Nacionalidad no especificada'}</p>
                            <p className="text-sm text-slate-600 line-clamp-2">{autor.biografia || 'Sin biografía registrada.'}</p>
                        </div>
                    ))}

                    {autoresFiltrados.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                            <i className="fa-solid fa-user-slash text-4xl mb-3 block"></i>
                            No se encontraron autores.
                        </div>
                    )}
                </div>
            </div>

            {/* PANEL DESLIZANTE */}
            {esAdmin && (
                <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsPanelOpen(false)}></div>
                    <div className={`absolute top-0 right-0 w-full md:w-[450px] h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-800">{editando ? 'Editar Autor' : 'Registrar Autor'}</h2>
                            <button onClick={() => setIsPanelOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </div>
                        <div className="p-6 flex-1 overflow-y-auto">
                            <form id="autor-form" onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nombres *</label>
                                    <input type="text" value={data.nombres} onChange={e => setData('nombres', e.target.value)} className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none bg-slate-50 focus:bg-white transition-all" required />
                                    {errors.nombres && <span className="text-xs text-red-600 mt-1 block">{errors.nombres}</span>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Apellidos *</label>
                                    <input type="text" value={data.apellidos} onChange={e => setData('apellidos', e.target.value)} className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none bg-slate-50 focus:bg-white transition-all" required />
                                    {errors.apellidos && <span className="text-xs text-red-600 mt-1 block">{errors.apellidos}</span>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nacionalidad</label>
                                    <input type="text" value={data.nacionalidad} onChange={e => setData('nacionalidad', e.target.value)} className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none bg-slate-50 focus:bg-white transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Biografía</label>
                                    <textarea value={data.biografia} onChange={e => setData('biografia', e.target.value)} rows={4} className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none bg-slate-50 focus:bg-white transition-all"></textarea>
                                </div>
                            </form>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                            <button type="button" onClick={() => setIsPanelOpen(false)} className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-all">Cancelar</button>
                            <button type="submit" form="autor-form" disabled={processing} className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all">
                                {processing ? 'Guardando...' : 'Guardar Autor'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}