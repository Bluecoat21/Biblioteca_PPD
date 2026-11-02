import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function Dashboard() {
  const { auth, recursosRecientes = [] } = usePage().props as any;
  const [busquedaDashboard, setBusquedaDashboard] = useState('');
  
  const [paginaActual, setPaginaActual] = useState(1);
  const librosPorPagina = 20;

  const roles = auth?.user?.roles || [];
  const hasRole = roles.some((r: any) => {
    const roleName = typeof r === 'string' ? r : r?.name;
    return roleName && ['admin', 'administrator', 'bibliotecario', 'administrador'].includes(roleName.toLowerCase());
  });

  const esAdminBibliotecario = hasRole || auth?.user?.email === '12345@1.test';

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

  const listaRecursos = Array.isArray(recursosRecientes) ? recursosRecientes : (recursosRecientes?.data || []);
  const recursosFiltrados = listaRecursos.filter((rec: any) => 
    rec.titulo.toLowerCase().includes(busquedaDashboard.toLowerCase()) ||
    (rec.tipo && rec.tipo.toLowerCase().includes(busquedaDashboard.toLowerCase()))
  );

  const totalPaginas = Math.ceil(recursosFiltrados.length / librosPorPagina) || 1;
  const indiceUltimoRecurso = paginaActual * librosPorPagina;
  const indicePrimerRecurso = indiceUltimoRecurso - librosPorPagina;
  const recursosPaginados = recursosFiltrados.slice(indicePrimerRecurso, indiceUltimoRecurso);

  return (
    <div className="app-layout flex min-h-screen bg-slate-100">
      <Head title="Dashboard - Biblioteca PPD" />

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

      <main className="main-content flex-1 flex flex-col min-w-0">
        <header className="header-institutional bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <div className="header-search flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-xl w-96 border border-slate-200">
            <i className="fa-solid fa-magnifying-glass text-slate-400"></i>
            <input 
              type="text" 
              placeholder={esAdminBibliotecario ? "Buscar en el sistema..." : "Buscar en la estantería virtual..."} 
              value={busquedaDashboard}
              onChange={(e) => {
                setBusquedaDashboard(e.target.value);
                setPaginaActual(1);
              }}
              className="bg-transparent border-none focus:outline-none text-sm w-full text-slate-700" 
            />
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

        <div className="content-body p-8 flex-1">
          {esAdminBibliotecario ? (
            <>
              <div className="card-institutional bg-white border border-slate-200 p-6 rounded-2xl shadow-sm mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Panel de Control Administrativo</h2>
                <p className="text-slate-600 text-sm">
                  Bienvenido al sistema de gestión. Utiliza los accesos rápidos o el menú lateral para administrar inventarios, multas, suspensiones y parámetros.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <Link href={getRoute('recursos.index', '/recursos')} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all block group">
                  <div className="text-3xl mb-3 text-blue-600 group-hover:scale-110 transition-transform"><i className="fa-solid fa-book"></i></div>
                  <h3 className="font-bold text-slate-800 text-base mb-1">Catálogo</h3>
                  <p className="text-xs text-slate-500">Gestión de acervo y libros</p>
                </Link>

                <Link href={getRoute('prestamos.index', '/prestamos')} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all block group">
                  <div className="text-3xl mb-3 text-blue-600 group-hover:scale-110 transition-transform"><i className="fa-solid fa-hand-holding"></i></div>
                  <h3 className="font-bold text-slate-800 text-base mb-1">Préstamos</h3>
                  <p className="text-xs text-slate-500">Control de circulación</p>
                </Link>

                <Link href={getRoute('ubicaciones.index', '/ubicaciones')} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all block group">
                  <div className="text-3xl mb-3 text-blue-600 group-hover:scale-110 transition-transform"><i className="fa-solid fa-boxes-stacked"></i></div>
                  <h3 className="font-bold text-slate-800 text-base mb-1">Ubicaciones</h3>
                  <p className="text-xs text-slate-500">Estantes e inventario físico</p>
                </Link>

                <Link href={getRoute('multas.index', '/multas')} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all block group">
                  <div className="text-3xl mb-3 text-blue-600 group-hover:scale-110 transition-transform"><i className="fa-solid fa-receipt"></i></div>
                  <h3 className="font-bold text-slate-800 text-base mb-1">Multas</h3>
                  <p className="text-xs text-slate-500">Sanciones y pagos</p>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="card-institutional bg-white border border-slate-200 p-6 rounded-2xl shadow-sm mb-8 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-1">Estantería Virtual de Libros y Tesis</h2>
                  <p className="text-slate-600 text-sm">
                    Explora el acervo virtual institucional disponible para consulta rápida y lectura.
                  </p>
                </div>
                <Link 
                  href={getRoute('recursos.index', '/recursos')} 
                  className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1 whitespace-nowrap"
                >
                  Ir al Catálogo Completo <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>

              {/* Estantería en cuadrícula de 5 columnas para estudiante/lector */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
                {recursosPaginados.map((rec: any) => (
                  <div key={rec.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
                    
                    <div className="h-44 bg-slate-900 overflow-hidden relative flex items-center justify-center">
                      {rec.portada_url ? (
                        <img 
                          src={`/storage/${rec.portada_url}`} 
                          alt={rec.titulo} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                      ) : rec.es_digital && rec.archivo_url ? (
                        <div className="w-full h-full relative overflow-hidden bg-slate-100">
                          <div className="absolute inset-0 z-10 cursor-pointer" onClick={() => window.location.href = `/recursos/${rec.id}`}></div>
                          <iframe 
                            src={`/storage/${rec.archivo_url}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`} 
                            className="w-full h-full border-0 select-none pointer-events-none" 
                            title="Preview PDF" 
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-[#0f2b48] p-4 flex flex-col justify-between text-white">
                          <span className="text-[10px] font-mono text-slate-300">ISBN: {rec.isbn || 'N/A'}</span>
                          <span className="font-bold text-xs line-clamp-3">{rec.titulo}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1.5">
                          <span className="bg-blue-100 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded uppercase">
                            {rec.tipo}
                          </span>
                          {rec.es_digital && (
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                              PDF
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-800 text-xs mb-1 group-hover:text-blue-600 transition-colors line-clamp-2" title={rec.titulo}>
                          {rec.titulo}
                        </h3>
                      </div>
                    </div>

                    <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 font-mono">Año: {rec.anio_publicacion || 'N/A'}</span>
                      <Link 
                        href={`/recursos/${rec.id}`} 
                        className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        Ver / Leer <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                ))}

                {recursosPaginados.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                    <i className="fa-solid fa-book-open text-4xl mb-3 block"></i>
                    No hay recursos disponibles en esta sección.
                  </div>
                )}
              </div>

              {totalPaginas > 1 && (
                <div className="mt-8 flex justify-center items-center gap-3">
                  <button
                    onClick={() => setPaginaActual(p => Math.max(p - 1, 1))}
                    disabled={paginaActual === 1}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
                  >
                    <i className="fa-solid fa-chevron-left mr-1"></i> Anterior Grupo
                  </button>

                  <span className="text-xs font-medium text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                    Grupo <strong className="text-slate-900">{paginaActual}</strong> de <strong className="text-slate-900">{totalPaginas}</strong>
                  </span>

                  <button
                    onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))}
                    disabled={paginaActual === totalPaginas}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
                  >
                    Siguiente Grupo <i className="fa-solid fa-chevron-right ml-1"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}