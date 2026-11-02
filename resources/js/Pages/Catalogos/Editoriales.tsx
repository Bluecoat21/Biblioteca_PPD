import React, { useState } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';

interface Editorial {
    id: number;
    nombre: string;
    pais: string | null;
}

interface Props {
    editoriales: { data: Editorial[] } | Editorial[];
}

export default function Editoriales({ editoriales }: Props) {
    const { esAdmin } = usePage().props as any;
    const listaEditoriales = Array.isArray(editoriales) ? editoriales : (editoriales?.data || []);
    const [busqueda, setBusqueda] = useState('');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editando, setEditando] = useState<Editorial | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        nombre: '',
        pais: '',
    });

    const editorialesFiltradas = listaEditoriales.filter(e => 
        e.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const abrirPanelCrear = () => {
        setEditando(null);
        reset();
        setIsPanelOpen(true);
    };

    const abrirPanelEditar = (edi: Editorial) => {
        setEditando(edi);
        setData({ nombre: edi.nombre, pais: edi.pais || '' });
        setIsPanelOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editando) {
            put(`/editoriales/${editando.id}`, { onSuccess: () => setIsPanelOpen(false) });
        } else {
            post('/editoriales', { onSuccess: () => setIsPanelOpen(false) });
        }
    };

    const handleEliminar = (id: number) => {
        if (confirm('¿Eliminar esta editorial?')) destroy(`/editoriales/${id}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8 relative overflow-hidden">
            <Head title="Gestión de Editoriales" />

            <div className="max-w-6xl mx-auto">
                <div className="mb-6 flex items-center text-sm text-slate-500">
                    <Link href="/recursos" className="hover:text-blue-600 flex items-center gap-2 font-medium transition-colors">
                        <i className="fa-solid fa-arrow-left"></i> Volver al Catálogo
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#0f2b48] tracking-tight">Editoriales Asociadas</h1>
                        <p className="text-sm text-slate-500 mt-1">Administra las casas editoras y sus publicaciones.</p>
                    </div>
                    
                    {esAdmin && (
                        <button onClick={abrirPanelCrear} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-purple-500/30 transition-all flex items-center gap-2">
                            <i className="fa-solid fa-building"></i> Nueva Editorial
                        </button>
                    )}
                </div>

                <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-8 flex items-center gap-3">
                    <i className="fa-solid fa-magnifying-glass text-slate-400 ml-4"></i>
                    <input 
                        type="text" placeholder="Buscar editorial..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                        className="bg-transparent border-none focus:outline-none text-sm w-full py-3 text-slate-700"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {editorialesFiltradas.map((edi) => (
                        <div key={edi.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group flex flex-col overflow-hidden">
                            <div className="h-2 w-full bg-gradient-to-r from-purple-400 to-indigo-500"></div>
                            <div className="p-6 flex-1 relative">
                                
                                {esAdmin && (
                                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => abrirPanelEditar(edi)} className="bg-white text-slate-500 hover:text-purple-600 shadow-sm p-2 rounded-lg"><i className="fa-solid fa-pen text-xs"></i></button>
                                        <button onClick={() => handleEliminar(edi.id)} className="bg-white text-slate-500 hover:text-red-600 shadow-sm p-2 rounded-lg"><i className="fa-solid fa-trash text-xs"></i></button>
                                    </div>
                                )}

                                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                                    <i className="fa-solid fa-building text-lg"></i>
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg mb-1">{edi.nombre}</h3>
                                <p className="text-sm text-slate-500"><i className="fa-solid fa-globe text-xs mr-1"></i> {edi.pais || 'País no registrado'}</p>
                            </div>
                        </div>
                    ))}

                    {editorialesFiltradas.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                            <i className="fa-solid fa-building-circle-exclamation text-4xl mb-3 block"></i>
                            No se encontraron editoriales.
                        </div>
                    )}
                </div>
            </div>

            {esAdmin && (
                <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsPanelOpen(false)}></div>
                    <div className={`absolute top-0 right-0 w-full md:w-[400px] h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-purple-50">
                            <h2 className="text-xl font-bold text-purple-900">{editando ? 'Editar Editorial' : 'Nueva Editorial'}</h2>
                            <button onClick={() => setIsPanelOpen(false)} className="text-purple-700 hover:text-red-500 transition-colors">
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </div>
                        <div className="p-6 flex-1">
                            <form id="edi-form" onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nombre de la Editorial *</label>
                                    <input type="text" value={data.nombre} onChange={e => setData('nombre', e.target.value)} className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-600 outline-none bg-slate-50 focus:bg-white transition-all" required />
                                    {errors.nombre && <span className="text-xs text-red-600 mt-1 block">{errors.nombre}</span>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">País de Origen</label>
                                    <input type="text" value={data.pais} onChange={e => setData('pais', e.target.value)} className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-600 outline-none bg-slate-50 focus:bg-white transition-all" />
                                </div>
                            </form>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                            <button type="button" onClick={() => setIsPanelOpen(false)} className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-all">Cancelar</button>
                            <button type="submit" form="edi-form" disabled={processing} className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/30 transition-all">
                                {processing ? 'Guardando...' : 'Guardar Editorial'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}