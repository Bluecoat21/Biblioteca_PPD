import React, { useState, useRef, useEffect } from 'react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

interface Option {
  id: string;
  label: string;
}

const FAQ_OPTIONS: Option[] = [
  { id: 'faq_login', label: '🔑 ¿Cómo inicio sesión por primera vez?' },
  { id: 'faq_password', label: '🔒 ¿Olvidé mi contraseña o clave?' },
  { id: 'faq_register', label: '📝 ¿Cómo solicito una cuenta nueva?' },
  { id: 'faq_schedule', label: '📚 ¿Horarios y servicios de la biblioteca?' },
];

export default function VirtualAssistantWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: '¡Hola! Selecciona una opción de ayuda para que te asista de forma automática:' }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Función que envía la opción seleccionada al webhook de n8n
  const handleSelectOption = async (option: Option) => {
    // Agregamos la pregunta elegida por el usuario al chat
    setMessages((prev) => [...prev, { sender: 'user', text: option.label }]);
    setLoading(true);

    try {
      // Petición HTTP POST a tu webhook local de n8n
      const response = await fetch('http://localhost:5678/webhook/biblioteca-bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ optionId: option.id }),
      });

      if (!response.ok) {
        throw new Error('Error al conectar con n8n.');
      }

      const data = await response.json();
      const botReply = data.reply || 'No se encontró una respuesta para esta opción.';
      
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev, 
        { sender: 'bot', text: '⚠️ El servidor de automatización (n8n) está desconectado. Asegúrate de iniciarlo en tu entorno local.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans select-none">
      
      {/* Ventana de Chat Interactiva con Opciones */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[460px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4">
          
          {/* Header */}
          <div className="bg-[#0f2b48] p-4 flex justify-between items-center border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm shadow-md">
                <i className="fa-solid fa-robot"></i>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Ayuda Rápida PPD</h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Automatizado con n8n
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

          {/* Historial de Mensajes */}
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

          {/* Botones de Opción Múltiple Estáticos en la Base */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 grid grid-cols-1 gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-1">Selecciona una consulta:</span>
            <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
              {FAQ_OPTIONS.map((opt) => (
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

      {/* Botón Flotante con Mascota */}
      <div className="relative group cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="absolute -inset-1 rounded-full bg-blue-500/30 blur-sm animate-pulse"></div>
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#0f2b48] to-blue-600 text-white flex items-center justify-center shadow-2xl border-2 border-blue-400/40 animate-bounce duration-1000 hover:scale-110 transition-transform">
          <i className="fa-solid fa-robot text-2xl"></i>
        </div>
        <div className="absolute right-16 top-2 bg-slate-900 text-slate-200 text-xs px-3 py-1.5 rounded-xl shadow-xl border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          ¿Ayuda con opciones automáticas? 🤖
        </div>
      </div>

    </div>
  );
}