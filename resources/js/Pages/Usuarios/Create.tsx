import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

interface Props {
    tipos: Array<{ id: number; nombre: string }>;
    roles: string[];
}

export default function UsuariosCreate({ tipos = [], roles = [] }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        documento_identidad: '',
        codigo_estudiante: '',
        codigo_acceso_web: '',
        telefono: '',
        tipo_usuario_id: '',
        rol: '',
        estado: 'activo',
    });

    // Generar código único automáticamente al montar el componente
    useEffect(() => {
        if (!data.codigo_acceso_web) {
            const codigo = 'ACCESO-' + Math.random().toString(36).substring(2, 8).toUpperCase();
            setData('codigo_acceso_web', codigo);
        }
    }, []);

    const generarCodigo = () => {
        const codigo = 'ACCESO-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        setData('codigo_acceso_web', codigo);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/usuarios');
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <Head title="Registrar Usuario Presencial - Biblioteca PPD" />

            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-[#0f2b48]">Registrar Nuevo Usuario Presencial</h1>
                        <p className="text-xs text-slate-500">Crea el perfil físico y asigna un Código de Acceso Web único para el usuario.</p>
                    </div>
                    <Link href="/usuarios" className="text-xs text-blue-600 hover:underline font-semibold">
                        ← Volver al Directorio
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Nombre Completo</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            required
                        />
                        {errors.name && <span className="text-xs text-red-600">{errors.name}</span>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Correo Electrónico</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                required
                            />
                            {errors.email && <span className="text-xs text-red-600">{errors.email}</span>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Documento de Identidad (DNI)</label>
                            <input
                                type="text"
                                value={data.documento_identidad}
                                onChange={(e) => setData('documento_identidad', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                required
                            />
                            {errors.documento_identidad && <span className="text-xs text-red-600">{errors.documento_identidad}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Teléfono / Celular</label>
                            <input
                                type="text"
                                value={data.telefono}
                                onChange={(e) => setData('telefono', e.target.value)}
                                placeholder="Ej. 987654321"
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            />
                            {errors.telefono && <span className="text-xs text-red-600">{errors.telefono}</span>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Código de Estudiante</label>
                            <input
                                type="text"
                                value={data.codigo_estudiante}
                                onChange={(e) => setData('codigo_estudiante', e.target.value)}
                                placeholder="Ej. 20261234"
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-500"
                                required
                            />
                            {errors.codigo_estudiante && <span className="text-xs text-red-600">{errors.codigo_estudiante}</span>}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-semibold text-slate-700 uppercase">Código de Acceso Web (Generado)</label>
                            <button
                                type="button"
                                onClick={generarCodigo}
                                className="text-[11px] text-blue-600 hover:underline font-semibold"
                            >
                                🔑 Generar Otro Código
                            </button>
                        </div>
                        <input
                            type="text"
                            value={data.codigo_acceso_web}
                            onChange={(e) => setData('codigo_acceso_web', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono text-blue-700 font-bold focus:outline-none focus:border-blue-500"
                            required
                        />
                        {errors.codigo_acceso_web && <span className="text-xs text-red-600">{errors.codigo_acceso_web}</span>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Tipo de Usuario</label>
                            <select
                                value={data.tipo_usuario_id}
                                onChange={(e) => setData('tipo_usuario_id', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                required
                            >
                                <option value="">Seleccione tipo...</option>
                                {tipos.map((t) => (
                                    <option key={t.id} value={t.id}>{t.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Rol del Sistema</label>
                            <select
                                value={data.rol}
                                onChange={(e) => setData('rol', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                required
                            >
                                <option value="">Seleccione rol...</option>
                                {roles.map((r, idx) => (
                                    <option key={idx} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#0f2b48] hover:bg-[#1a426e] text-white font-semibold py-3 rounded-lg text-sm transition-all shadow-sm"
                        >
                            Guardar Registro y Otorgar Código Web
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}