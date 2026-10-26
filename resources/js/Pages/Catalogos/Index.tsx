import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

interface Recurso {
    id: number;
    titulo: string;
    isbn: string | null;
    tipo: string;
    anio_publicacion: number;
}

interface Autor {
    id: number;
    nombres: string;
    apellidos: string;
    nacionalidad: string | null;
}

interface Editorial {
    id: number;
    nombre: string;
    pais: string | null;
}

interface Categoria {
    id: number;
    nombre: string;
    descripcion: string | null;
}

interface PaginatedData<T> {
    data: T[];
    total: number;
    current_page: number;
    last_page: number;
}

interface Props {
    recursos: PaginatedData<Recurso> | Recurso[];
    autores?: Autor[];
    editoriales?: Editorial[];
    categorias?: Categoria[];
}

export default function CatalogosIndex({ 
    recursos, 
    autores = [], 
    editoriales = [], 
    categorias = [] 
}: Props) {
    const [tabActiva, setTabActiva] = useState<'recursos' | 'autores_editoriales' | 'categorias'>('recursos');
    const [busqueda, setBusqueda] = useState('');

    // Helper seguro para evitar errores si Ziggy no está inyectado
    const getRoute = (routeName: string, fallbackUrl: string) => {
        try {
            if (typeof window !== 'undefined' && (window as any).route) {
                return (window as any).route(routeName);
            }
        } catch (e) {
            // Ignorar y usar fallback
        }
        return fallbackUrl;
    };

    const getRouteWithParam = (routeName: string, param: any, fallbackUrl: string) => {
        try {
            if (typeof window !== 'undefined' && (window as any).route) {
                return (window as any).route(routeName, param);
            }
        } catch (e) {
            // Ignorar y usar fallback
        }
        return fallbackUrl;
    };

    const listaRecursos = Array.isArray(recursos) ? recursos : (recursos?.data || []);

    return (
        <div className="catalogos-module min-h-screen bg-slate-50 p-6">
            <Head title="Módulo de Catálogos y Recursos" />

            <div className="max-w-7xl mx-auto">
                {/* Encabezado */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">Gestión de Catálogo Institucional</h1>
                        <p className="text-sm text-slate-500">Administración centralizada de recursos bibliográficos, autoría y taxonomía</p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <input 
                            type="text"
                            placeholder="Buscar en el catálogo..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="search-input bg-white border border-slate-300 text-slate-700 text-sm rounded-lg px-3 py-2 shadow-sm focus:outline-none w-full md:w-64"
                        />
                        <Link 
                            href={getRoute('recursos.create', '/recursos/create')} 
                            className="btn-primary bg-[#0f2b48] hover:bg-[#1a426e] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center gap-2 whitespace-nowrap"
                        >
                            <i className="fa-solid fa-plus"></i> Nuevo Registro
                        </Link>
                    </div>
                </div>

                {/* Sistema de Pestañas (Tabs) */}
                <div className="tabs-navigation flex border-b border-slate-200 mb-6 bg-white rounded-t-xl px-4 pt-2 shadow-sm">
                    <button
                        onClick={() => setTabActiva('recursos')}
                        className={`py-3 px-6 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                            tabActiva === 'recursos' ? 'border-primary text-primary border-b-2 border-[#0f2b48]' : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <i className="fa-solid fa-book"></i> Recursos Bibliográficos ({listaRecursos.length})
                    </button>
                    <button
                        onClick={() => setTabActiva('autores_editoriales')}
                        className={`py-3 px-6 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                            tabActiva === 'autores_editoriales' ? 'border-primary text-primary border-b-2 border-[#0f2b48]' : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <i className="fa-solid fa-pen-nib"></i> Autores & Editoriales ({autores.length + editoriales.length})
                    </button>
                    <button
                        onClick={() => setTabActiva('categorias')}
                        className={`py-3 px-6 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                            tabActiva === 'categorias' ? 'border-primary text-primary border-b-2 border-[#0f2b48]' : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <i className="fa-solid fa-tags"></i> Taxonomía / Categorías ({categorias.length})
                    </button>
                </div>

                {/* Contenido de la Pestaña: Recursos */}
                {tabActiva === 'recursos' && (
                    <div className="data-table-container bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#0f2b48] text-white text-xs uppercase tracking-wider">
                                    <th className="py-3 px-4">ID</th>
                                    <th className="py-3 px-4">Título del Recurso</th>
                                    <th className="py-3 px-4">ISBN</th>
                                    <th className="py-3 px-4">Tipo</th>
                                    <th className="py-3 px-4">Año</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                                {listaRecursos.map((rec) => (
                                    <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-4 font-mono font-bold">#{rec.id}</td>
                                        <td className="py-3 px-4 font-semibold text-slate-900">{rec.titulo}</td>
                                        <td className="py-3 px-4 font-mono text-xs">{rec.isbn || 'N/A'}</td>
                                        <td className="py-3 px-4"><span className="badge-tipo">{rec.tipo}</span></td>
                                        <td className="py-3 px-4">{rec.anio_publicacion}</td>
                                        <td className="py-3 px-4 text-right">
                                            <Link 
                                                href={getRouteWithParam('recursos.show', rec.id, `/recursos/${rec.id}`)} 
                                                className="text-slate-400 hover:text-[#0f2b48] p-1.5 inline-block"
                                            >
                                                <i className="fa-solid fa-eye"></i>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {listaRecursos.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-6 text-center text-slate-400">
                                            No hay recursos registrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Contenido de la Pestaña: Autores y Editoriales */}
                {tabActiva === 'autores_editoriales' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white shadow-sm rounded-xl p-5 border border-slate-200">
                            <h3 className="text-lg font-bold text-[#0f2b48] mb-3">Autores Registrados</h3>
                            <ul className="divide-y divide-slate-100 text-sm">
                                {autores.map(aut => (
                                    <li key={aut.id} className="py-2.5 flex justify-between items-center">
                                        <div>
                                            <span className="font-semibold text-slate-900">{aut.apellidos}, {aut.nombres}</span>
                                            <span className="block text-xs text-slate-400">{aut.nacionalidad || 'Sin nacionalidad'}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white shadow-sm rounded-xl p-5 border border-slate-200">
                            <h3 className="text-lg font-bold text-[#0f2b48] mb-3">Editoriales Registradas</h3>
                            <ul className="divide-y divide-slate-100 text-sm">
                                {editoriales.map(ed => (
                                    <li key={ed.id} className="py-2.5 flex justify-between items-center">
                                        <div>
                                            <span className="font-semibold text-slate-900">{ed.nombre}</span>
                                            <span className="block text-xs text-slate-400">{ed.pais || 'País no especificado'}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Contenido de la Pestaña: Categorías */}
                {tabActiva === 'categorias' && (
                    <div className="data-table-container bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#0f2b48] text-white text-xs uppercase tracking-wider">
                                    <th className="py-3 px-4">ID</th>
                                    <th className="py-3 px-4">Nombre de Categoría</th>
                                    <th className="py-3 px-4">Descripción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                                {categorias.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-slate-50">
                                        <td className="py-3 px-4 font-mono font-bold">#{cat.id}</td>
                                        <td className="py-3 px-4 font-semibold text-slate-900">{cat.nombre}</td>
                                        <td className="py-3 px-4 text-xs text-slate-500">{cat.descripcion || 'Sin descripción'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}