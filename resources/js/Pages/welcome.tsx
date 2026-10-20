import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
  return (
    <div style={{ padding: '3rem', fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
      <Head title="Biblioteca PPD" />
      <h1 style={{ fontSize: '2rem', color: '#1e3a8a', fontWeight: 'bold' }}>
        Sistema de Biblioteca PPD
      </h1>
      <p style={{ color: '#475569', marginTop: '1rem' }}>
        El entorno local con Laravel, Inertia y React está operativo.
      </p>
      <div style={{ marginTop: '2rem' }}>
        <a 
          href="/dashboard" 
          style={{ background: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600 }}
        >
          Ir al Dashboard
        </a>
      </div>
    </div>
  );
}