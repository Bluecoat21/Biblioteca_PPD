import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard() {
  const { auth } = usePage().props as any;

  // Helper seguro para obtener URLs independientemente del estado de Ziggy
  const getRoute = (routeName: string, fallbackUrl: string) => {
    try {
      if (typeof window !== 'undefined' && (window as any).route) {
        return (window as any).route(routeName);
      }
    } catch (e) {
      // Si la ruta nombrada no existe o falla Ziggy, se utiliza la URL fallback
    }
    return fallbackUrl;
  };

  return (
    <div className="app-layout">
      <Head title="Dashboard - Biblioteca PPD" />

      {/* 1. Barra lateral institucional con enlaces Inertia seguros */}
      <aside className="sidebar-institutional">
        <div className="brand-logo">
          <div className="logo-icon">
            <i className="fa-solid fa-book-bookmark"></i>
          </div>
          <span className="brand-text">Biblioteca PPD</span>
        </div>

        <nav className="nav-menu">
          <Link href={getRoute('dashboard', '/dashboard')} className="nav-item active">
            <i className="fa-solid fa-house"></i> Dashboard
          </Link>
          <Link href={getRoute('recursos.index', '/recursos')} className="nav-item">
            <i className="fa-solid fa-book-open"></i> Recursos y Catálogo
          </Link>
          <Link href={getRoute('prestamos.index', '/prestamos')} className="nav-item">
            <i className="fa-solid fa-hand-holding"></i> Préstamos
          </Link>
          <Link href={getRoute('reservas.index', '/reservas')} className="nav-item">
            <i className="fa-solid fa-calendar-check"></i> Reservas
          </Link>
          <Link href={getRoute('ubicaciones.index', '/ubicaciones')} className="nav-item">
            <i className="fa-solid fa-boxes-stacked"></i> Ubicaciones e Inventario
          </Link>
          <Link href={getRoute('usuarios.index', '/usuarios')} className="nav-item">
            <i className="fa-solid fa-users"></i> Usuarios
          </Link>
          <Link href={getRoute('multas.index', '/multas')} className="nav-item">
            <i className="fa-solid fa-receipt"></i> Multas y Sanciones
          </Link>
          <Link href={getRoute('configuraciones.index', '/configuraciones')} className="nav-item">
            <i className="fa-solid fa-gear"></i> Configuración
          </Link>
        </nav>
      </aside>

      {/* 2. Contenedor principal */}
      <main className="main-content">
        <header className="header-institutional">
          <div className="header-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Buscar recursos bibliográficos, ISBN, usuarios..." />
          </div>
          <div className="header-user">
            <div className="user-avatar">
              {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="user-info">
              <div className="user-name">{auth?.user?.name || 'Administrador'}</div>
              <div className="user-role">Bibliotecario Institucional</div>
            </div>
          </div>
        </header>

        {/* 3. Cuerpo del Dashboard */}
        <div className="content-body">
          <div className="card-institutional mb-6">
            <h2 className="card-title">Panel de Control General</h2>
            <p className="text-slate-600">
              Bienvenido al Sistema Integrado de Gestión Bibliotecaria PPD. Selecciona un módulo del menú para comenzar.
            </p>
          </div>

          {/* Accesos rápidos e indicadores generales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link 
              href={getRoute('recursos.index', '/recursos')} 
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all block"
            >
              <div className="text-2xl mb-1 text-[#0f2b48]">
                <i className="fa-solid fa-book"></i>
              </div>
              <h3 className="font-bold text-slate-800">Catálogo</h3>
              <p className="text-xs text-slate-500">Gestión de libros, obras y taxonomía</p>
            </Link>

            <Link 
              href={getRoute('prestamos.index', '/prestamos')} 
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all block"
            >
              <div className="text-2xl mb-1 text-[#0f2b48]">
                <i className="fa-solid fa-hand-holding"></i>
              </div>
              <h3 className="font-bold text-slate-800">Préstamos</h3>
              <p className="text-xs text-slate-500">Registro de entregas y devoluciones</p>
            </Link>

            <Link 
              href={getRoute('reservas.index', '/reservas')} 
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all block"
            >
              <div className="text-2xl mb-1 text-[#0f2b48]">
                <i className="fa-solid fa-calendar-check"></i>
              </div>
              <h3 className="font-bold text-slate-800">Reservas</h3>
              <p className="text-xs text-slate-500">Colas de espera de usuarios</p>
            </Link>

            <Link 
              href={getRoute('usuarios.index', '/usuarios')} 
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all block"
            >
              <div className="text-2xl mb-1 text-[#0f2b48]">
                <i className="fa-solid fa-users"></i>
              </div>
              <h3 className="font-bold text-slate-800">Usuarios</h3>
              <p className="text-xs text-slate-500">Gestión de miembros y permisos</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}