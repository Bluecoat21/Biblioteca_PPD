import React from 'react';
import { Head, Link } from '@inertiajs/react';


declare const route: any;

interface Recurso {
    id: number;
    titulo: string;
    isbn: string;
    tipo: string;
    editorial: { nombre: string };
}

interface Props {
    recursos: {
        data: Recurso[];
    };
}

export default function Index({ recursos }: Props) {
    return (
        <div className="catalog-wrapper">
            <Head title="Catálogo de Recursos" />
            
            <div className="catalog-container" style={{ maxWidth: '80rem' }}>
                <div className="catalog-header">
                    <div>
                        <h1>Módulo de Catálogo y Recursos</h1>
                        <p>Gestión del inventario intelectual y físico de la biblioteca.</p>
                    </div>
                    <Link href={route('recursos.create')} className="btn-submit" style={{ textDecoration: 'none' }}>
                        + Nuevo Recurso
                    </Link>
                </div>

                <div className="catalog-card-form" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Título</th>
                                <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>ISBN</th>
                                <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Tipo</th>
                                <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Editorial</th>
                                <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recursos?.data?.length > 0 ? (
                                recursos.data.map((recurso) => (
                                    <tr key={recurso.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '1rem', fontWeight: 500, color: '#0f172a' }}>{recurso.titulo}</td>
                                        <td style={{ padding: '1rem', color: '#64748b' }}>{recurso.isbn || 'N/A'}</td>
                                        <td style={{ padding: '1rem', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: '#4f46e5' }}>{recurso.tipo}</td>
                                        <td style={{ padding: '1rem', color: '#64748b' }}>{recurso.editorial?.nombre || 'N/A'}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <Link href={route('recursos.show', recurso.id)} style={{ color: '#4f46e5', fontWeight: 500, textDecoration: 'none' }}>
                                                Ver Detalle
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                                        No hay recursos registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}