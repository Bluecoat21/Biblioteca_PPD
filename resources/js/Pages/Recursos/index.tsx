import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';

export default function RecursosIndex() {
  return (
    <AuthenticatedLayout>
      <Head title="Recursos y Catálogo - Biblioteca PPD" />

      <div className="recursos-page">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>Módulo de Recursos y Catálogo</h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Administra los libros, autores, editoriales y ejemplares físicos.</p>
          </div>
          <button style={{ backgroundColor: '#1e3a8a', color: '#fff', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
            + Nuevo Recurso
          </button>
        </header>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#334155' }}>Aquí se listarán los recursos bibliográficos registrados en la base de datos con sus respectivos filtros y categorías.</p>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}