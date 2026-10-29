import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import VirtualAssistantWidget from '../Components/VirtualAssistantWidget'; // <--- Importas tu widget

export default function Welcome() {
  const [totalBooks, setTotalBooks] = useState<number>(0);

  useEffect(() => {
    let start = 0;
    const target = 650;
    const timer = setInterval(() => {
      start += Math.ceil(target / 100);
      if (start >= target) {
        setTotalBooks(target);
        clearInterval(timer);
      } else {
        setTotalBooks(start);
      }
    }, 20);
    return () => clearInterval(timer);
  }, []);

  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans overflow-hidden relative">
      <Head title="Acceso - Biblioteca Virtual PPD" />

      {/* LADO IZQUIERDO: Video y Contador */}
      <div className="hidden lg:flex lg:w-3/5 relative bg-slate-900 overflow-hidden flex-col justify-between p-12 select-none">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-70 filter brightness-75 scale-105">
            <source src="videos/biblioteca-fondo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/80 to-slate-950/40"></div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-[#0f2b48] text-white p-3 rounded-xl shadow-lg border border-slate-700/80 backdrop-blur-md">
            <i className="fa-solid fa-book-bookmark text-xl"></i>
          </div>
          <div>
            <span className="text-sm font-bold tracking-wider text-white uppercase block">Biblioteca Virtual PPD</span>
            <span className="text-xs text-slate-400 block">Sistema de Gestión Académica</span>
          </div>
        </div>

        <div className="relative z-10 max-w-xl my-auto text-center mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
            Plataforma Académica Centralizada
          </div>
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Gestión Inteligente del <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Conocimiento</span>
          </h1>
          <div className="bg-slate-900/70 border border-slate-800/80 px-8 py-5 rounded-2xl backdrop-blur-xl shadow-2xl inline-block">
            <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold block mb-1">Volúmenes en el Repositorio</span>
            <h2 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight">
              +{totalBooks.toLocaleString()} <span className="text-slate-300 text-xl font-normal">Libros y Recursos</span>
            </h2>
          </div>
        </div>

        <div className="relative z-10 flex justify-between items-center text-xs text-slate-500 pt-6 border-t border-slate-800/60">
          <span>&copy; {new Date().getFullYear()} Biblioteca PPD</span>
          <span className="hover:text-slate-300 transition-colors cursor-pointer">Privacidad</span>
        </div>
      </div>

      {/* LADO DERECHO: Formulario de Login */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center px-8 sm:px-16 py-12 bg-slate-950 relative z-10 shadow-2xl">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">Iniciar Sesión</h2>
            <p className="text-xs text-slate-400 mt-1">Ingresa tus credenciales institucionales</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Correo Electrónico</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="usuario@institucion.edu"
                required
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Contraseña</label>
              <input
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-[#0f2b48] hover:bg-[#1a426e] text-white font-semibold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg mt-2"
            >
              Acceder al Sistema
            </button>
          </form>
        </div>
      </div>

      {/* WIDGET FLOTANTE EXTERNO CONECTADO A n8n */}
      <VirtualAssistantWidget />

    </div>
  );
}