import React, { useState, useRef, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

interface Option {
  id: string;
  label: string;
}

interface Props {
  hideForAdmin?: boolean;
}

export default function VirtualAssistantWidget({ hideForAdmin = false }: Props) {
  const { auth } = usePage().props as any;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>('');

  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: '¡Hola! Te acompaño en este módulo. Selecciona una consulta para ver cómo funciona:' }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Validación robusta para ocultar en vistas de administración o biblioteca
  const user = auth?.user;
  const userEmail = user?.email || '';
  const rawRoles = user?.roles || user?.tipoUsuario?.nombre || [];
  const rolesList: string[] = Array.isArray(rawRoles) 
    ? rawRoles.map((r: any) => (typeof r === 'string' ? r : r?.name || ''))
    : [typeof rawRoles === 'string' ? rawRoles : ''];

  const isAdminOrLibrarian = 
    hideForAdmin ||
    userEmail === '12345@1.test' ||
    rolesList.some((role: string) => {
      const rLower = role.toLowerCase();
      return rLower.includes('admin') || 
             rLower.includes('bibliotecario') || 
             rLower.includes('administrator') || 
             rLower.includes('administrador');
    });

  // Si es administrador o bibliotecario, no se renderiza nada
  if (isAdminOrLibrarian) {
    return null;
  }

  // Diccionario de opciones según la ruta actual
  const getOptionsForPath = (path: string): Option[] => {
    if (path.includes('/recursos') || path.includes('/catalogos')) {
      return [
        { id: 'cat_search', label: '🔍 ¿Cómo buscar libros o tesis?' },
        { id: 'cat_digital', label: '💻 ¿Cómo descargar recursos digitales?' },
        { id: 'cat_details', label: '📖 ¿Qué veo en el detalle del recurso?' },
      ];
    }
    if (path.includes('/prestamos')) {
      return [
        { id: 'pres_control', label: '📋 ¿Cómo interpreto mis préstamos?' },
        { id: 'pres_renew', label: '🔄 ¿Cómo funcionan las renovaciones?' },
        { id: 'pres_limits', label: '⚠️ ¿Cuáles son los límites y restricciones?' },
      ];
    }
    if (path.includes('/reservas')) {
      return [
        { id: 'res_queue', label: '⏱️ ¿Cómo funciona la cola de espera?' },
        { id: 'res_notify', label: '🔔 ¿Qué hace "Notificar Retiro"?' },
        { id: 'res_cancel', label: '❌ ¿Puedo cancelar una reserva?' },
      ];
    }
    if (path.includes('/multas')) {
      return [
        { id: 'mult_reason', label: '💸 ¿Por qué se generan multas o suspensiones?' },
        { id: 'mult_status', label: '🏷️ ¿Cómo identifico si está pendiente o pagada?' },
      ];
    }
    return [
      { id: 'dash_overview', label: '📚 ¿Qué encuentro en la Estantería Virtual?' },
      { id: 'dash_nav', label: '🧭 ¿Cómo navegar por el menú principal?' },
      { id: 'dash_help', label: '💡 Consejos rápidos para estudiantes' },
    ];
  };

  const getResponses = (): Record<string, string> => ({
    dash_overview: 'En la Estantería Virtual visualizas los últimos libros, tesis y recursos institucionales agregados. Puedes ver su portada, estado y acceder rápidamente a su lectura o detalles.',
    dash_nav: 'El menú lateral te permite moverte entre el Dashboard, el Catálogo completo, tus Préstamos vigentes, tus Reservas en cola y el control de tus Multas y Sanciones.',
    dash_help: 'Mantén tus datos actualizados y evita retrasos en las entregas para no generar multas pendientes que bloqueen nuevos préstamos o reservas en el sistema.',

    cat_search: 'Puedes usar la barra superior de búsqueda escribiendo el título exacto o el código ISBN del libro o tesis que necesites ubicar de forma inmediata.',
    cat_digital: 'Si el recurso cuenta con la etiqueta "PDF" o "Digital", podrás visualizarlo y descargarlo directamente desde el sistema gracias al almacenamiento seguro del servidor.',
    cat_details: 'Al hacer clic en "Ver detalles", el sistema verifica automáticamente si ya cuentas con un préstamo activo o una reserva en cola para ese mismo ejemplar.',

    pres_control: 'Aquí controlas tus entregas, devoluciones y los plazos vigentes de libros físicos. Si la fecha esperada se supera, el sistema calcula automáticamente una multa diaria.',
    pres_renew: 'Puedes renovar un préstamo activo siempre y cuando el recurso no cuente con reservas pendientes de otros usuarios y no hayas alcanzado el límite máximo de renovaciones de tu política.',
    pres_limits: 'El sistema valida automáticamente que no tengas suspensiones activas, multas pendientes de pago, o que hayas superado el límite máximo de préstamos permitidos para tu tipo de usuario.',

    res_queue: 'Si un libro no se encuentra disponible, puedes reservarlo. El sistema te asignará una posición en la cola de espera (ej. Posición #1) de forma ordenada y FIFO.',
    res_notify: 'El botón "Notificar Retiro" cambia tu estado a "en_camino" para avisarle al bibliotecario que te acerques a ventanilla presentando tu DNI o código de identidad.',
    res_cancel: 'Puedes cancelar una reserva activa en cualquier momento siempre y cuando se encuentre en estado pendiente o en camino antes de ser completada.',

    mult_reason: 'Las multas económicas se generan automáticamente por días de atraso en las devoluciones (calculadas por tarifa diaria) o por daños al ejemplar físico. Las suspensiones inhabilitan temporalmente tus privilegios.',
    mult_status: 'En la tabla verás el estado actual: "PENDIENTE" (requiere cancelación o restricción en sistema) o "PAGADA" (multa saldada exitosamente por el administrador/bibliotecario).'
  });

  const handleSelectOption = (option: Option) => {
    setMessages((prev) => [...prev, { sender: 'user', text: option.label }]);
    setLoading(true);

    setTimeout(() => {
      const responses = getResponses();
      const botReply = responses[option.id] || 'Estoy aquí para acompañarte en el uso correcto de esta sección del sistema.';
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
      setLoading(false);
    }, 400);
  };

  const currentOptions = getOptionsForPath(currentPath);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans select-none">
      
      {/* Ventana de Chat */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[480px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4">
          
          <div className="bg-[#0f2b48] p-4 flex justify-between items-center border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm shadow-md">
                <i className="fa-solid fa-robot"></i>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Guía PPD Inteligente</h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Asistente de Sección Activo
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-950/60">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl leading-relaxed shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none font-medium' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-slate-400 p-3 rounded-2xl text-xs flex items-center gap-1.5 border border-slate-700/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-slate-900 border-t border-slate-800 grid grid-cols-1 gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-1 flex items-center justify-between">
              <span>Guía de esta sección:</span>
              <span className="text-blue-400 lowercase italic text-[9px]">{currentPath}</span>
            </span>
            <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
              {currentOptions.map((opt) => (
                <button
                  key={opt.id}
                  disabled={loading}
                  onClick={() => handleSelectOption(opt)}
                  className="w-full text-left bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800/80 hover:border-blue-500/50 p-2.5 rounded-xl text-xs transition-all flex items-center justify-between group disabled:opacity-50"
                >
                  <span>{opt.label}</span>
                  <i className="fa-solid fa-chevron-right text-[10px] text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-transform"></i>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Botón Flotante */}
      <div className="relative group cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="absolute -inset-1 rounded-full bg-blue-500/30 blur-sm animate-pulse"></div>
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#0f2b48] to-blue-600 text-white flex items-center justify-center shadow-2xl border-2 border-blue-400/40 animate-bounce duration-1000 hover:scale-110 transition-transform">
          <i className="fa-solid fa-robot text-2xl"></i>
        </div>
        <div className="absolute right-16 top-2 bg-slate-900 text-slate-200 text-xs px-3 py-1.5 rounded-xl shadow-xl border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          ¿Necesitas ayuda con esta sección?
        </div>
      </div>

    </div>
  );
}