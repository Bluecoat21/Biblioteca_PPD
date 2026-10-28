import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';

// Preguntas frecuentes para el asistente animado
const FAQ_QUESTIONS = [
  {
    id: 1,
    question: '¿Cómo inicio sesión por primera vez?',
    answer: 'Usa tu correo institucional y la clave temporal proporcionada por la administración de la biblioteca.'
  },
  {
    id: 2,
    question: '¿Olvidé mi contraseña?',
    answer: 'Haz clic en "¿Olvidaste tu contraseña?" o acércate al área de sistemas con tu carné.'
  },
  {
    id: 3,
    question: '¿Cómo me registro?',
    answer: 'Haz clic en "Solicitar registro" al pie del formulario para enviar tus datos académicos.'
  }
];

export default function Welcome() {
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Contador animado de libros
  useEffect(() => {
    let start = 0;
    const target = 15420;
    const duration = 2000;

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

      {/* LADO IZQUIERDO: Video de Fondo en Bucle y Contador */}
      <div className="hidden lg:flex lg:w-3/5 relative bg-slate-900 overflow-hidden flex-col justify-between p-12 select-none">
        
        {/* Video de Fondo Institucional */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-35 filter brightness-75 scale-105"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-shelves-full-of-books-in-a-library-41566-large.mp4" type="video/mp4" />
            Tu navegador no soporta videos.
          </video>
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/80 to-slate-950/40"></div>
        </div>

        {/* Branding Superior */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-[#0f2b48] text-white p-3 rounded-xl shadow-lg border border-slate-700/80 backdrop-blur-md">
            <i className="fa-solid fa-book-bookmark text-xl"></i>
          </div>
          <div>
            <span className="text-sm font-bold tracking-wider text-white uppercase block">Biblioteca Virtual PPD</span>
            <span className="text-xs text-slate-400 block">Sistema de Gestión Académica</span>
          </div>
        </div>

        {/* CENTRO: Contador e Información */}
        <div className="relative z-10 max-w-xl my-auto text-center mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
            Plataforma Académica Centralizada
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Gestión Inteligente del <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Conocimiento</span>
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed max-w-md mx-auto">
            Explora un acervo bibliográfico completo diseñado para potenciar la investigación y el desarrollo académico institucionales.
          </p>

          {/* Tarjeta de Contador Dinámico */}
          <div className="bg-slate-900/70 border border-slate-800/80 px-8 py-5 rounded-2xl backdrop-blur-xl shadow-2xl inline-block">
            <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold block mb-1">
              Volúmenes en el Repositorio
            </span>
            <h2 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight">
              +{totalBooks.toLocaleString()} <span className="text-slate-300 text-xl font-normal">Libros y Recursos</span>
            </h2>
          </div>
        </div>

        {/* Footer del Banner */}
        <div className="relative z-10 flex justify-between items-center text-xs text-slate-500 pt-6 border-t border-slate-800/60">
          <span>&copy; {new Date().getFullYear()} Biblioteca PPD</span>
          <span className="hover:text-slate-300 transition-colors cursor-pointer">Privacidad</span>
        </div>
      </div>

      {/* LADO DERECHO: Formulario de Login */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center px-8 sm:px-16 py-12 bg-slate-950 relative z-10 shadow-2xl">
        <div className="max-w-md w-full mx-auto">
          
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="bg-[#0f2b48] text-white p-2.5 rounded-lg">
              <i className="fa-solid fa-book-bookmark"></i>
            </div>
            <span className="text-base font-bold text-white">Biblioteca PPD</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">Iniciar Sesión</h2>
            <p className="text-xs text-slate-400 mt-1">Ingresa tus credenciales institucionales para continuar</p>
          </div>

          {/* Formulario */}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="usuario@institucion.edu"
                  required
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <span className="absolute left-3.5 top-3.5 text-slate-500 text-sm">
                  <i className="fa-solid fa-envelope"></i>
                </span>
              </div>
              {errors.email && <span className="text-red-400 text-xs mt-1 block">{errors.email}</span>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Contraseña
                </label>
                <a href="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <span className="absolute left-3.5 top-3.5 text-slate-500 text-sm">
                  <i className="fa-solid fa-lock"></i>
                </span>
              </div>
              {errors.password && <span className="text-red-400 text-xs mt-1 block">{errors.password}</span>}
            </div>

            <div className="flex items-center justify-between text-xs py-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                <input 
                  type="checkbox" 
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500" 
                />
                Recordar sesión
              </label>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-[#0f2b48] hover:bg-[#1a426e] text-white font-semibold py-3.5 px-4 rounded-xl text-sm transition-all border border-slate-700 shadow-lg flex items-center justify-center gap-2 mt-2 group"
            >
              <span>Acceder al Sistema</span>
              <i className="fa-solid fa-arrow-right-to-bracket group-hover:translate-x-1 transition-transform"></i>
            </button>
          </form>

          {/* Registro */}
          <div className="mt-8 text-center border-t border-slate-900 pt-6">
            <p className="text-xs text-slate-500">
              ¿No tienes cuenta institucional?{' '}
              <a href="/register" className="text-white font-medium hover:underline">
                Solicitar registro
              </a>
            </p>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* ASISTENTE VIRTUAL ANIMADO FLOTANTE (ESTILO CLIPPY/MASCOTA)  */}
      {/* ========================================================= */}
      <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
        
        {/* Burbuja de bienvenida inicial o cuadro de chat */}
        {isChatOpen && (
          <div className="w-80 sm:w-88 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-3">
            <div className="bg-[#0f2b48] p-3.5 flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Asistente PPD (FAQ)</span>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <div className="p-4 max-h-72 overflow-y-auto space-y-2.5 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-xl text-slate-300 border border-slate-700/50">
                ¡Hola! Soy tu guía virtual de la biblioteca. Elige una pregunta frecuente para ayudarte a iniciar sesión:
              </div>

              {FAQ_QUESTIONS.map((item) => (
                <div key={item.id} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
                  <button
                    onClick={() => setActiveFaq(activeFaq === item.id ? null : item.id)}
                    className="w-full text-left p-2.5 font-medium text-slate-200 hover:bg-slate-800/40 flex justify-between items-center gap-2"
                  >
                    <span>{item.question}</span>
                    <i className={`fa-solid fa-chevron-down text-xs transition-transform ${
                      activeFaq === item.id ? 'rotate-180 text-blue-400' : 'text-slate-500'
                    }`}></i>
                  </button>
                  
                  {activeFaq === item.id && (
                    <div className="p-2.5 bg-slate-900 text-slate-300 border-t border-slate-800/80 text-[11px] leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personaje/Bot Flotante Animado con Movimiento Constante */}
        <div className="relative group cursor-pointer" onClick={() => setIsChatOpen(!isChatOpen)}>
          
          {/* Anillo de pulso animado */}
          <div className="absolute -inset-1 rounded-full bg-blue-500/30 blur-sm animate-pulse"></div>

          {/* Botón Mascota con animación de flotación vertical (animate-bounce) */}
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#0f2b48] to-blue-600 text-white flex items-center justify-center shadow-2xl border-2 border-blue-400/40 animate-bounce duration-1000 hover:scale-110 transition-transform">
            <i className="fa-solid fa-robot text-2xl"></i>
          </div>

          {/* Tooltip flotante al pasar el mouse */}
          <div className="absolute right-16 top-2 bg-slate-900 text-slate-200 text-xs px-3 py-1.5 rounded-xl shadow-xl border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            ¿Necesitas ayuda para iniciar sesión? 💡
          </div>

        </div>

      </div>
    </div>
  );
}