import React, { useState, PropsWithChildren } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js'; 
import VirtualAssistantWidget from '../Components/VirtualAssistantWidget'; // <--- 1. IMPORTAR AQUÍ

export default function AuthenticatedLayout({ children }: PropsWithChildren) {
  const { auth } = usePage().props as any;
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app-layout">
      {/* Sidebar de Navegación */}
      <aside className={`app-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        {/* ... (tus enlaces del sidebar) ... */}
      </aside>

      {/* Contenido Principal */}
      <div className="app-main">
        <header className="app-header">
          {/* ... */}
        </header>

        <main className="app-content">
          {children}
        </main>
      </div>

      {/* --- 2. RENDERIZAR EL WIDGET AQUÍ --- */}
      <VirtualAssistantWidget />
    </div>
  );
}