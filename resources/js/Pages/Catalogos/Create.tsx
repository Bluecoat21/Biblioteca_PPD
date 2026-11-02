import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

interface Props {
    editoriales?: any[];
    autores?: any[];
    categorias?: any[];
}

export default function CatalogosCreate({ editoriales = [], autores = [], categorias = [] }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        titulo: '',
        isbn: '',
        tipo: 'libro',
        anio_publicacion: new Date().getFullYear(),
        editorial_id: '',
        nueva_editorial: '',
        autor_id: '',
        nuevo_autor_nombres: '',
        nuevo_autor_apellidos: '',
        categorias: [] as string[],
        nueva_categoria: '',
        sinopsis: '',
        portada_imagen: null as File | null,
        archivo_pdf: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/recursos', {
            forceFormData: true,
        });
    };

    const esDigitalOTesis = ['tesis', 'digital', 'revista'].includes(data.tipo);

    const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setData('categorias', selectedOptions);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <Head title="Nuevo Recurso - Biblioteca PPD" />
            
            <div className="max-w-3xl mx-auto">
                
                {/* NAVEGACIÓN SUPERIOR */}
                <div className="mb-6 flex items-center justify-between text-sm text-slate-500">
                    <Link href="/recursos" className="hover:text-blue-600 flex items-center gap-2 font-medium transition-colors">
                        <i className="fa-solid fa-arrow-left"></i> Volver al Catálogo
                    </Link>
                    <Link href="/dashboard" className="hover:text-blue-600 flex items-center gap-2 font-medium transition-colors">
                        <i className="fa-solid fa-house"></i> Ir al Dashboard
                    </Link>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h1 className="text-2xl font-bold text-[#0f2b48] mb-1">Registrar Nuevo Recurso Bibliográfico</h1>
                    <p className="text-sm text-slate-500 mb-6">Completa los datos para almacenar el libro, tesis o documento digital.</p>

                    <form onSubmit={submit} className="space-y-6">
                        {/* TÍTULO */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Título del Recurso *</label>
                            <input
                                type="text"
                                value={data.titulo}
                                onChange={(e) => setData('titulo', e.target.value)}
                                className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                required
                            />
                            {errors.titulo && <span className="text-xs text-red-600">{errors.titulo}</span>}
                        </div>

                        {/* ISBN, TIPO, EDITORIAL */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">ISBN / Código</label>
                                <input
                                    type="text"
                                    placeholder="Automático si está vacío"
                                    value={data.isbn}
                                    onChange={(e) => setData('isbn', e.target.value)}
                                    className="w-full border border-slate-300 rounded-xl p-3 text-sm"
                                />
                                {errors.isbn && <span className="text-xs text-red-600">{errors.isbn}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Tipo de Recurso *</label>
                                <select
                                    value={data.tipo}
                                    onChange={(e) => setData('tipo', e.target.value)}
                                    className="w-full border border-slate-300 rounded-xl p-3 text-sm bg-white"
                                    required
                                >
                                    <option value="libro">Libro Físico</option>
                                    <option value="tesis">Tesis Académica (Digital)</option>
                                    <option value="revista">Revista</option>
                                    <option value="digital">Artículo / Documento Digital</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Editorial *</label>
                                <select
                                    value={data.editorial_id}
                                    onChange={(e) => setData('editorial_id', e.target.value)}
                                    className="w-full border border-slate-300 rounded-xl p-3 text-sm bg-white"
                                    required
                                >
                                    <option value="">Seleccione...</option>
                                    <option value="otro">➕ Otro (Registrar nueva)</option>
                                    {editoriales.map((ed) => (
                                        <option key={ed.id} value={ed.id}>{ed.nombre}</option>
                                    ))}
                                </select>
                                {errors.editorial_id && <span className="text-xs text-red-600">{errors.editorial_id}</span>}
                            </div>
                        </div>

                        {/* NUEVA EDITORIAL */}
                        {data.editorial_id === 'otro' && (
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                                <label className="block text-sm font-semibold text-blue-900 mb-1">Nombre de la Nueva Editorial *</label>
                                <input
                                    type="text"
                                    placeholder="Ej. Fondo Editorial UNSA"
                                    value={data.nueva_editorial}
                                    onChange={(e) => setData('nueva_editorial', e.target.value)}
                                    className="w-full border border-blue-300 rounded-xl p-3 text-sm bg-white"
                                    required={data.editorial_id === 'otro'}
                                />
                                {errors.nueva_editorial && <span className="text-xs text-red-600">{errors.nueva_editorial}</span>}
                            </div>
                        )}

                        {/* AUTOR */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Autor del Recurso *</label>
                                <select
                                    value={data.autor_id}
                                    onChange={(e) => setData('autor_id', e.target.value)}
                                    className="w-full border border-slate-300 rounded-xl p-3 text-sm bg-white"
                                    required
                                >
                                    <option value="">Seleccione autor...</option>
                                    <option value="otro">➕ Otro (Registrar nuevo)</option>
                                    {autores.map((aut) => (
                                        <option key={aut.id} value={aut.id}>{aut.apellidos}, {aut.nombres}</option>
                                    ))}
                                </select>
                                {errors.autor_id && <span className="text-xs text-red-600">{errors.autor_id}</span>}
                            </div>

                            {data.autor_id === 'otro' ? (
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Nombres *"
                                            value={data.nuevo_autor_nombres}
                                            onChange={(e) => setData('nuevo_autor_nombres', e.target.value)}
                                            className="w-full border border-slate-300 rounded-xl p-3 text-sm bg-white"
                                            required={data.autor_id === 'otro'}
                                        />
                                        {errors.nuevo_autor_nombres && <span className="text-xs text-red-600">{errors.nuevo_autor_nombres}</span>}
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Apellidos *"
                                            value={data.nuevo_autor_apellidos}
                                            onChange={(e) => setData('nuevo_autor_apellidos', e.target.value)}
                                            className="w-full border border-slate-300 rounded-xl p-3 text-sm bg-white"
                                            required={data.autor_id === 'otro'}
                                        />
                                        {errors.nuevo_autor_apellidos && <span className="text-xs text-red-600">{errors.nuevo_autor_apellidos}</span>}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-xs text-slate-500 flex items-center">
                                    Selecciona un autor existente de la lista o elige "Otro" para añadir uno nuevo.
                                </div>
                            )}
                        </div>

                        {/* CATEGORÍAS MÚLTIPLES */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Géneros o Categorías *</label>
                            <p className="text-xs text-slate-500 mb-2">Mantén presionada la tecla Ctrl (o Cmd en Mac) para seleccionar varias.</p>
                            <select
                                multiple
                                value={data.categorias}
                                onChange={handleCategoriaChange}
                                className="w-full border border-slate-300 rounded-xl p-3 text-sm bg-white min-h-[120px]"
                                required
                            >
                                {categorias.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                ))}
                            </select>
                            {errors.categorias && <span className="text-xs text-red-600">{errors.categorias}</span>}

                            <div className="mt-4 border-t border-slate-300 pt-4">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Otra categoría (Opcional)</label>
                                <input
                                    type="text"
                                    placeholder="Nombre de la nueva categoría"
                                    value={data.nueva_categoria}
                                    onChange={(e) => setData('nueva_categoria', e.target.value)}
                                    className="w-full border border-slate-300 rounded-xl p-3 text-sm bg-white"
                                />
                                {errors.nueva_categoria && <span className="text-xs text-red-600">{errors.nueva_categoria}</span>}
                            </div>
                        </div>

                        {/* SINOPSIS */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Sinopsis</label>
                            <textarea
                                value={data.sinopsis}
                                onChange={(e) => setData('sinopsis', e.target.value)}
                                rows={3}
                                className="w-full border border-slate-300 rounded-xl p-3 text-sm"
                            ></textarea>
                        </div>

                        {/* ARCHIVOS: PORTADA Y PDF */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Imagen de Portada (Opcional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('portada_imagen', e.target.files ? e.target.files[0] : null)}
                                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-700 file:text-white cursor-pointer"
                                />
                                {errors.portada_imagen && <span className="text-xs text-red-600">{errors.portada_imagen}</span>}
                            </div>

                            {esDigitalOTesis && (
                                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                                    <label className="block text-sm font-semibold text-emerald-900 mb-1">
                                        <i className="fa-solid fa-file-pdf mr-1"></i> Archivo PDF *
                                    </label>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => setData('archivo_pdf', e.target.files ? e.target.files[0] : null)}
                                        className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:text-white cursor-pointer"
                                        required={esDigitalOTesis}
                                    />
                                    {errors.archivo_pdf && <span className="text-xs text-red-600">{errors.archivo_pdf}</span>}
                                </div>
                            )}
                        </div>

                        {/* BOTONES DE ACCIÓN */}
                        <div className="pt-4 flex items-center gap-3 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-[#0f2b48] hover:bg-[#1a426e] text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-sm transition-all"
                            >
                                Guardar y Registrar Recurso
                            </button>
                            <Link href="/recursos" className="text-sm text-slate-600 hover:underline px-4 py-2">
                                Cancelar
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}