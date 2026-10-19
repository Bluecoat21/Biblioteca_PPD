import React, { useState, PropsWithChildren } from 'react';
import { Link, usePage } from '@inertiajs/react';

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
          <Link href="/dashboard" className="nav-item">📊 Dashboard</Link>
          <Link href="/recursos" className="nav-item">📚 Recursos y Catálogo</Link>
          <Link href="/prestamos" className="nav-item">🔄 Préstamos y Multas</Link>
          <Link href="/reservas" className="nav-item">📅 Reservas</Link>
          <Link href="/ubicaciones" className="nav-item">📦 Inventario y Ubicaciones</Link>
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