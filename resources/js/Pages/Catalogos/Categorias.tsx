import React, { useState } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';

interface Categoria {
    id: number;
    nombre: string;
    descripcion: string | null;
}

interface Props {
    categorias: { data: Categoria[] } | Categoria[];
}

export default function Categorias({ categorias }: Props) {
    const { esAdmin } = usePage().props as any;
    const listaCategorias = Array.isArray(categorias) ? categorias : (categorias?.data || []);
    const [busqueda, setBusqueda] = useState('');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editando, setEditando] = useState<Categoria | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        nombre: '',
        descripcion: '',
    });

    const categoriasFiltradas = listaCategorias.filter(c => 
        c.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const abrirPanelCrear = () => {
        setEditando(null);
        reset();
        setIsPanelOpen(true);
    };

    const abrirPanelEditar = (cat: Categoria) => {
        setEditando(cat);
        setData({ nombre: cat.nombre, descripcion: cat.descripcion || '' });
        setIsPanelOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editando) {
            put(`/categorias/${editando.id}`, { onSuccess: () => setIsPanelOpen(false) });
        } else {
            post('/categorias', { onSuccess: () => setIsPanelOpen(false) });
        }
    };

    const handleEliminar = (id: number) => {
        if (confirm('¿Eliminar esta categoría?')) destroy(`/categorias/${id}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8 relative overflow-hidden">
            <Head title="Gestión de Categorías" />

            <div className="max-w-6xl mx-auto">
                <div className="mb-6 flex items-center text-sm text-slate-500">
                    <Link href="/recursos" className="hover:text-blue-600 flex items-center gap-2 font-medium transition-colors">
                        <i className="fa-solid fa-arrow-left"></i> Volver al Catálogo
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#0f2b48] tracking-tight">Taxonomía y Categorías</h1>
                        <p className="text-sm text-slate-500 mt-1">Organiza los recursos mediante géneros y etiquetas.</p>
                    </div>
                    
                    {esAdmin && (
                        <button onClick={abrirPanelCrear} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2">
                            <i className="fa-solid fa-tag"></i> Nueva Categoría
                        </button>
                    )}
                </div>

                <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-8 flex items-center gap-3">
                    <i className="fa-solid fa-magnifying-glass text-slate-400 ml-4"></i>
                    <input 
                        type="text" placeholder="Buscar categoría..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                        className="bg-transparent border-none focus:outline-none text-sm w-full py-3 text-slate-700"
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categoriasFiltradas.map((cat) => (
                        <div key={cat.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all group relative">
                            <div className="flex justify-between items-start mb-3">
                                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-100">#{cat.id}</span>
                                
                                {esAdmin && (
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => abrirPanelEditar(cat)} className="text-slate-400 hover:text-emerald-600 p-1"><i className="fa-solid fa-pen text-xs"></i></button>
                                        <button onClick={() => handleEliminar(cat.id)} className="text-slate-400 hover:text-red-600 p-1"><i className="fa-solid fa-trash text-xs"></i></button>
                                    </div>
                                )}
                            </div>
                            <h3 className="font-bold text-slate-800 text-base mb-1">{cat.nombre}</h3>
                            <p className="text-xs text-slate-500 line-clamp-2">{cat.descripcion || 'Sin descripción.'}</p>
                        </div>
                    ))}

                    {categoriasFiltradas.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                            <i className="fa-solid fa-tags text-4xl mb-3 block"></i>
                            No se encontraron categorías.
                        </div>
                    )}
                </div>
            </div>

            {esAdmin && (
                <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsPanelOpen(false)}></div>
                    <div className={`absolute top-0 right-0 w-full md:w-[400px] h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-emerald-50">
                            <h2 className="text-xl font-bold text-emerald-900">{editando ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
                            <button onClick={() => setIsPanelOpen(false)} className="text-emerald-700 hover:text-red-500"><i className="fa-solid fa-xmark text-xl"></i></button>
                        </div>
                        <div className="p-6 flex-1">
                            <form id="cat-form" onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nombre de la Categoría *</label>
                                    <input type="text" value={data.nombre} onChange={e => setData('nombre', e.target.value)} className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-600 outline-none bg-slate-50 focus:bg-white transition-all" required />
                                    {errors.nombre && <span className="text-xs text-red-600 mt-1 block">{errors.nombre}</span>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Descripción</label>
                                    <textarea value={data.descripcion} onChange={e => setData('descripcion', e.target.value)} rows={4} className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-600 outline-none bg-slate-50 focus:bg-white transition-all"></textarea>
                                </div>
                            </form>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                            <button type="button" onClick={() => setIsPanelOpen(false)} className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-all">Cancelar</button>
                            <button type="submit" form="cat-form" disabled={processing} className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 transition-all">
                                {processing ? 'Guardando...' : 'Guardar Categoría'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}