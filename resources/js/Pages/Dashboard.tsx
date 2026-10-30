import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function Dashboard() {
  const { auth } = usePage().props as any;

  // Verificación robusta de roles (Spatie)
  const roles = auth?.user?.roles || [];
  const hasRole = roles.some((r: any) => {
    const roleName = typeof r === 'string' ? r : r?.name;
    return roleName && ['admin', 'administrator', 'bibliotecario', 'administrador'].includes(roleName.toLowerCase());
  });

  // Blindaje absoluto: Es admin si tiene el rol O si usa el correo oficial del seeder (12345@1.test)
  const esAdminBibliotecario = hasRole || auth?.user?.email === '12345@1.test';

  // Función para manejar el cierre de sesión seguro mediante POST
  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const logoutUrl = (window as any).route ? (window as any).route('logout') : '/logout';
      router.post(logoutUrl);
    } catch (err) {
      router.post('/logout');
    }
  };

  const getRoute = (routeName: string, fallbackUrl: string) => {
    try {
      if (typeof window !== 'undefined' && (window as any).route) {
        return (window as any).route(routeName);
      }
    } catch (e) {}
    return fallbackUrl;
  };

  return (
    <div className="app-layout flex min-h-screen bg-slate-100">
      <Head title="Dashboard - Biblioteca PPD" />

      {/* 1. Barra lateral institucional (Sidebar) */}
      <aside className="sidebar-institutional w-64 bg-[#0f2b48] text-white flex flex-col justify-between p-4 shadow-lg">
        <div>
          <div className="brand-logo flex items-center gap-3 mb-8 px-2 pt-2">
            <div className="logo-icon bg-blue-600 p-2.5 rounded-xl text-white">
              <i className="fa-solid fa-book-bookmark"></i>
            </div>
            <div>
              <span className="brand-text font-bold tracking-wide block">Biblioteca PPD</span>
              <span className="text-xs text-slate-400 block">Sistema Integral</span>
            </div>
          </div>

          <nav className="nav-menu space-y-1">
            <Link href={getRoute('dashboard', '/dashboard')} className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-600/30 text-white font-medium">
              <i className="fa-solid fa-house w-5"></i> Dashboard
            </Link>
            <Link href={getRoute('recursos.index', '/recursos')} className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors">
              <i className="fa-solid fa-book-open w-5"></i> Recursos y Catálogo
            </Link>
            <Link href={getRoute('prestamos.index', '/prestamos')} className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors">
              <i className="fa-solid fa-hand-holding w-5"></i> Préstamos
            </Link>
            <Link href={getRoute('reservas.index', '/reservas')} className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors">
              <i className="fa-solid fa-calendar-check w-5"></i> Reservas
            </Link>

            {/* Módulos exclusivos para Administradores / Bibliotecarios */}
            {esAdminBibliotecario && (
              <>
                <div className="pt-4 pb-1 px-3 text-xs uppercase tracking-wider text-slate-400 font-semibold">Administración</div>
                <Link href={getRoute('multas.index', '/multas')} className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors">
                  <i className="fa-solid fa-receipt w-5"></i> Multas y Sanciones
                </Link>
                <Link href={getRoute('suspensiones.index', '/suspensiones')} className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors">
                  <i className="fa-solid fa-ban w-5"></i> Suspensiones
                </Link>
                <Link href={getRoute('ubicaciones.index', '/ubicaciones')} className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors">
                  <i className="fa-solid fa-boxes-stacked w-5"></i> Ubicaciones e Inventario
                </Link>
                <Link href={getRoute('usuarios.index', '/usuarios')} className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors">
                  <i className="fa-solid fa-users w-5"></i> Usuarios
                </Link>
                <Link href={getRoute('configuraciones.index', '/configuraciones')} className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors">
                  <i className="fa-solid fa-gear w-5"></i> Configuración
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Botón de Cerrar Sesión (Método POST) */}
        <div className="pt-4 border-t border-slate-800">
          <form onSubmit={handleLogout}>
            <button 
              type="submit" 
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm font-medium"
            >
              <i className="fa-solid fa-right-from-bracket w-5"></i> Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      {/* 2. Contenedor principal */}
      <main className="main-content flex-1 flex flex-col min-w-0">
        <header className="header-institutional bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <div className="header-search flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-xl w-96 border border-slate-200">
            <i className="fa-solid fa-magnifying-glass text-slate-400"></i>
            <input type="text" placeholder="Buscar recursos bibliográficos, ISBN..." className="bg-transparent border-none focus:outline-none text-sm w-full text-slate-700" />
          </div>
          <div className="header-user flex items-center gap-3">
            <div className="user-avatar w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold shadow-sm">
              {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-info">
              <div className="user-name text-sm font-bold text-slate-800">{auth?.user?.name || 'Usuario'}</div>
              <div className="user-role text-xs text-slate-500">
                {esAdminBibliotecario ? 'Administrador Institucional' : 'Estudiante / Lector'}
              </div>
            </div>
          </div>
        </header>

        {/* 3. Cuerpo del Dashboard */}
        <div className="content-body p-8 flex-1">
          <div className="card-institutional bg-white border border-slate-200 p-6 rounded-2xl shadow-sm mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Panel de Control General</h2>
            <p className="text-slate-600 text-sm">
              Bienvenido al Sistema de Gestión Bibliotecaria PPD. Selecciona una sección para comenzar tus consultas o gestiones.
            </p>
          </div>

          {/* Accesos rápidos e indicadores generales */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <Link 
              href={getRoute('recursos.index', '/recursos')} 
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all block group"
            >
              <div className="text-3xl mb-3 text-blue-600 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-book"></i>
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1">Catálogo</h3>
              <p className="text-xs text-slate-500">Búsqueda de libros, obras y taxonomía</p>
            </Link>

            <Link 
              href={getRoute('prestamos.index', '/prestamos')} 
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all block group"
            >
              <div className="text-3xl mb-3 text-blue-600 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-hand-holding"></i>
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1">Préstamos</h3>
              <p className="text-xs text-slate-500">Consulta de tus préstamos activos</p>
            </Link>

            <Link 
              href={getRoute('reservas.index', '/reservas')} 
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all block group"
            >
              <div className="text-3xl mb-3 text-blue-600 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-calendar-check"></i>
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1">Reservas</h3>
              <p className="text-xs text-slate-500">Gestión de colas de espera</p>
            </Link>

            {/* Accesos rápidos exclusivos para Administradores / Bibliotecarios */}
            {esAdminBibliotecario && (
              <>
                <Link 
                  href={getRoute('multas.index', '/multas')} 
                  className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all block group"
                >
                  <div className="text-3xl mb-3 text-blue-600 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-receipt"></i>
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mb-1">Multas</h3>
                  <p className="text-xs text-slate-500">Revisión de multas o sanciones</p>
                </Link>

                <Link 
                  href={getRoute('suspensiones.index', '/suspensiones')} 
                  className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all block group"
                >
                  <div className="text-3xl mb-3 text-blue-600 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-ban"></i>
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mb-1">Suspensiones</h3>
                  <p className="text-xs text-slate-500">Control de bloqueos temporales</p>
                </Link>

                <Link 
                  href={getRoute('usuarios.index', '/usuarios')} 
                  className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all block group"
                >
                  <div className="text-3xl mb-3 text-blue-600 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-users"></i>
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mb-1">Usuarios</h3>
                  <p className="text-xs text-slate-500">Gestión de miembros y permisos</p>
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}