import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import '../css/scss/main.scss';

declare const route: any;

interface Editorial { id: number; nombre: string; }
interface Autor { id: number; nombres: string; apellidos: string; }
interface Categoria { id: number; nombre: string; }

interface Props {
    editoriales: Editorial[];
    autores: Autor[];
    categorias: Categoria[];
}

export default function Create({ editoriales = [], autores = [], categorias = [] }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        titulo: '',
        isbn: '',
        issn: '',
        anio_publicacion: new Date().getFullYear(),
        idioma: 'Español',
        numero_paginas: '',
        sinopsis: '',
        tipo: 'libro',
        editorial_id: '',
        autores: [] as number[],
        categorias: [] as number[],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('recursos.store'));
    };

    const handleCheckboxChange = (id: number, field: 'autores' | 'categorias') => {
        const currentValues = data[field];
        if (currentValues.includes(id)) {
            setData(field, currentValues.filter((item) => item !== id));
        } else {
            setData(field, [...currentValues, id]);
        }
    };

    return (
        <div className="catalog-wrapper">
            <Head title="Registrar Recurso Bibliográfico" />

            <div className="catalog-container">
                <div className="catalog-header">
                    <div>
                        <h1>Nuevo Recurso Bibliográfico</h1>
                        <p>Registra una nueva obra o material físico/digital.</p>
                    </div>
                    <Link href={route('recursos.index')} className="back-link">
                        ← Volver al catálogo
                    </Link>
                </div>

                <form onSubmit={submit} className="catalog-card-form">
                    <div className="form-group">
                        <label>Título del Recurso <span>*</span></label>
                        <input
                            type="text"
                            value={data.titulo}
                            onChange={(e) => setData('titulo', e.target.value)}
                            placeholder="Ej. Arquitectura de Software Limpia"
                        />
                        {errors.titulo && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.titulo}</span>}
                    </div>

                    <div className="form-grid-3">
                        <div className="form-group">
                            <label>ISBN</label>
                            <input
                                type="text"
                                value={data.isbn}
                                onChange={(e) => setData('isbn', e.target.value)}
                                placeholder="978-3-16-148410-0"
                            />
                            {errors.isbn && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.isbn}</span>}
                        </div>

                        <div className="form-group">
                            <label>Año de Publicación</label>
                            <input
                                type="number"
                                value={data.anio_publicacion}
                                onChange={(e) => setData('anio_publicacion', Number(e.target.value))}
                            />
                            {errors.anio_publicacion && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.anio_publicacion}</span>}
                        </div>

                        <div className="form-group">
                            <label>Tipo de Recurso</label>
                            <select value={data.tipo} onChange={(e) => setData('tipo', e.target.value)}>
                                <option value="libro">Libro</option>
                                <option value="revista">Revista</option>
                                <option value="tesis">Tesis</option>
                                <option value="digital">Digital</option>
                            </select>
                            {errors.tipo && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.tipo}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Editorial <span>*</span></label>
                        <select value={data.editorial_id} onChange={(e) => setData('editorial_id', e.target.value)}>
                            <option value="">Seleccione una editorial...</option>
                            {editoriales.map((ed) => (
                                <option key={ed.id} value={ed.id}>{ed.nombre}</option>
                            ))}
                        </select>
                        {errors.editorial_id && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.editorial_id}</span>}
                    </div>

                    <div className="checkbox-grid-box">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                            Autores Asociados <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <div className="checkbox-container">
                            {autores.map((autor) => (
                                <label key={autor.id}>
                                    <input
                                        type="checkbox"
                                        checked={data.autores.includes(autor.id)}
                                        onChange={() => handleCheckboxChange(autor.id, 'autores')}
                                    />
                                    <span>{autor.nombres} {autor.apellidos}</span>
                                </label>
                            ))}
                        </div>
                        {errors.autores && <span style={{ color: '#ef4444', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>{errors.autores}</span>}
                    </div>

                    <div className="checkbox-grid-box">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                            Categorías Temáticas <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <div className="checkbox-container">
                            {categorias.map((cat) => (
                                <label key={cat.id}>
                                    <input
                                        type="checkbox"
                                        checked={data.categorias.includes(cat.id)}
                                        onChange={() => handleCheckboxChange(cat.id, 'categorias')}
                                    />
                                    <span>{cat.nombre}</span>
                                </label>
                            ))}
                        </div>
                        {errors.categorias && <span style={{ color: '#ef4444', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>{errors.categorias}</span>}
                    </div>

                    <div className="form-group">
                        <label>Sinopsis o Resumen</label>
                        <textarea
                            value={data.sinopsis}
                            onChange={(e) => setData('sinopsis', e.target.value)}
                            rows={4}
                            placeholder="Descripción breve del contenido..."
                        />
                    </div>

                    <div className="form-actions">
                        <Link href={route('recursos.index')} className="btn-cancel">
                            Cancelar
                        </Link>
                        <button type="submit" disabled={processing} className="btn-submit">
                            {processing ? 'Guardando...' : 'Registrar Recurso'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}