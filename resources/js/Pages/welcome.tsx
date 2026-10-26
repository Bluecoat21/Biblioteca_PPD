import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function Welcome() {
  const { auth } = usePage().props as any;
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = route('recursos.index', { search: query });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <Head title="Biblioteca Virtual Académica - PPD" />

      {/* Header Institucional */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#0f2b48] text-white p-2.5 rounded-lg text-xl border border-slate-700">
              <i className="fa-solid fa-book-bookmark"></i>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block">Biblioteca Virtual Académica</span>
              <span className="text-xs text-slate-400 block">Sistema Integrado de Gestión Bibliotecaria PPD</span>
            </div>
          </div>

          <nav className="flex items-center gap-4">
            {auth?.user ? (
              <Link
                href={route('dashboard')}
                className="bg-[#0f2b48] hover:bg-[#1a426e] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all border border-slate-600 shadow-sm"
              >
                Ir al Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-slate-300 hover:text-white text-sm font-medium transition-colors px-3 py-2"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="bg-[#0f2b48] hover:bg-[#1a426e] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all border border-slate-600 shadow-sm"
                >
                  Registrarse
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Héroe Principal con Buscador Académico */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-6 py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-3xl">
          <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 mb-6">
            Repositorio & Catálogo Bibliográfico Institucional
          </span>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Descubre, Investiga y Accede al Conocimiento Académico
          </h1>
          
          <p className="text-lg text-slate-400 mb-8 leading-relaxed">
            Explora nuestro catálogo en línea, consulta disponibilidad de libros físicos, tesis, artículos y recursos digitales para tu formación investigativa.
          </p>

          {/* Formulario de Búsqueda Integrado */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-10">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por título, autor, materia o ISBN..."
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3.5 pl-11 focus:outline-none focus:border-[#0f2b48] focus:ring-1 focus:ring-[#0f2b48] text-sm shadow-inner"
              />
              <span className="absolute left-4 top-4 text-slate-500">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
            </div>
            <button
              type="submit"
              className="bg-[#0f2b48] hover:bg-[#1a426e] text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all border border-slate-600 shadow-md whitespace-nowrap"
            >
              Buscar en Catálogo
            </button>
          </form>

          {/* Categorías Temáticas Destacadas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-800">
              <i className="fa-solid fa-book text-slate-300 mb-2 block"></i>
              <h3 className="text-sm font-semibold text-slate-200">Libros Físicos</h3>
              <p className="text-xs text-slate-500">Colección general y reserva</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-800">
              <i className="fa-solid fa-graduation-cap text-slate-300 mb-2 block"></i>
              <h3 className="text-sm font-semibold text-slate-200">Tesis y Proyectos</h3>
              <p className="text-xs text-slate-500">Investigación institucional</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-800">
              <i className="fa-solid fa-newspaper text-slate-300 mb-2 block"></i>
              <h3 className="text-sm font-semibold text-slate-200">Revistas y Series</h3>
              <p className="text-xs text-slate-500">Publicaciones periódicas</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-800">
              <i className="fa-solid fa-laptop-code text-slate-300 mb-2 block"></i>
              <h3 className="text-sm font-semibold text-slate-200">Recursos Digitales</h3>
              <p className="text-xs text-slate-500">Documentos PDF e e-books</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 bg-slate-950">
        <p>&copy; {new Date().getFullYear()} Sistema de Biblioteca PPD — Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}