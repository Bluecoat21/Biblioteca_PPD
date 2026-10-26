import React from 'react';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
  return (
    <div className="app-layout">
      {/* 1. Barra lateral con su clase SCSS */}
      <aside className="sidebar-institutional">
        <div className="brand-logo">
          <div className="logo-icon">
            <i className="fa-solid fa-book"></i>
          </div>
          <span className="brand-text">Biblioteca PPD</span>
        </div>

        <nav className="nav-menu">
          <a href="/dashboard" className="nav-item active">
            <i className="fa-solid fa-house"></i> Dashboard
          </a>
          <a href="/catalogos" className="nav-item">
            <i className="fa-solid fa-book-open"></i> Recursos y Catálogo
          </a>
          <a href="/circulacion" className="nav-item">
            <i className="fa-solid fa-hand-holding"></i> Préstamos y Multas
          </a>
          <a href="/configuracion" className="nav-item">
            <i className="fa-solid fa-gear"></i> Configuración
          </a>
        </nav>
      </aside>

      {/* 2. Contenedor principal de la derecha */}
      <main className="main-content">
        <header className="header-institutional">
          <div className="header-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Buscar recursos, ISBN, usuarios..." />
          </div>
          <div className="header-user">
            <div className="user-avatar">A</div>
            <div className="user-info">
              <div className="user-name">Administrador</div>
              <div className="user-role">Bibliotecario Institucional</div>
            </div>
          </div>
        </header>

        {/* 3. Cuerpo de la página */}
        <div className="content-body">
          <div className="card-institutional">
            <h2 className="card-title">Panel de Control General</h2>
            <p>Bienvenido al Sistema Integrado de Gestión Bibliotecaria.</p>
          </div>
        </div>
      </main>
    </div>
  );
}