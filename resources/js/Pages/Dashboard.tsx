import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';

interface DashboardProps {
  auth: {
    user: {
      name: string;
      email: string;
    };
  };
  stats?: {
    totalRecursos: number;
    totalPrestamosActivos: number;
    totalEjemplares: number;
    multasPendientes: number;
  };
}

export default function Dashboard({ auth, stats }: DashboardProps) {
  const defaultStats = {
    totalRecursos: stats?.totalRecursos ?? 1250,
    totalPrestamosActivos: stats?.totalPrestamosActivos ?? 42,
    totalEjemplares: stats?.totalEjemplares ?? 3100,
    multasPendientes: stats?.multasPendientes ?? 5,
  };

  return (
    <AuthenticatedLayout>
      <Head title="Panel Principal - Biblioteca PPD" />

      <div className="dashboard">
        {/* Encabezado */}
        <header className="dashboard__header">
          <div>
            <h1 className="title">Bienvenido, {auth.user.name}</h1>
            <p className="subtitle">Resumen general del sistema de biblioteca e inventario</p>
          </div>
        </header>

        {/* Tarjetas de Métricas Principal */}
        <section className="dashboard__stats">
          <div className="stat-card">
            <div className="icon-wrapper">📚</div>
            <div className="info">
              <div className="value">{defaultStats.totalRecursos}</div>
              <div className="label">Recursos Bibliográficos</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon-wrapper">📖</div>
            <div className="info">
              <div className="value">{defaultStats.totalEjemplares}</div>
              <div className="label">Ejemplares Registrados</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon-wrapper">🔄</div>
            <div className="info">
              <div className="value">{defaultStats.totalPrestamosActivos}</div>
              <div className="label">Préstamos Activos</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon-wrapper">⚠️</div>
            <div className="info">
              <div className="value">{defaultStats.multasPendientes}</div>
              <div className="label">Multas Pendientes</div>
            </div>
          </div>
        </section>

        {/* Paneles de Contenido Modular */}
        <section className="dashboard__content">
          <div className="panel">
            <h2 className="panel__title">Acceso Rápido a Módulos</h2>
            <p className="text-muted">
              Selecciona un módulo del menú lateral para administrar recursos, gestionar inventarios o consultar préstamos.
            </p>
          </div>

          <div className="panel">
            <h2 className="panel__title">Actividad Reciente</h2>
            <p className="text-muted">Aquí se mostrarán las últimas acciones realizadas en el sistema.</p>
          </div>
        </section>
      </div>
    </AuthenticatedLayout>
  );
}