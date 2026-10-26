import React, { useState, PropsWithChildren } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js'; 

export default function AuthenticatedLayout({ children }: PropsWithChildren) {
  const { auth } = usePage().props as any;
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app-layout">
      {/* Sidebar de Navegación */}
      <aside className={`app-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-brand">
          <h2>Biblioteca PPD</h2>
        </div>
        <nav className="sidebar-nav">
          <Link href={route('dashboard')} className="nav-item">📊 Dashboard</Link>
          <Link href={route('recursos.index')} className="nav-item">📚 Recursos y Catálogo</Link>
          <Link href={route('prestamos.index')} className="nav-item">🔄 Préstamos</Link>
          <Link href={route('reservas.index')} className="nav-item">📅 Reservas</Link>
          <Link href={route('ubicaciones.index')} className="nav-item">📦 Ubicaciones e Inventario</Link>
          <Link href={route('usuarios.index')} className="nav-item">👥 Usuarios</Link>
          <Link href={route('multas.index')} className="nav-item">💰 Multas y Sanciones</Link>
          <Link href={route('configuraciones.index')} className="nav-item">⚙️ Configuración</Link>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <div className="app-main">
        <header className="app-header">
          <button 
            className="toggle-btn" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <div className="user-info">
            <span>{auth?.user?.name || 'Administrador'}</span>
          </div>
        </header>

        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}