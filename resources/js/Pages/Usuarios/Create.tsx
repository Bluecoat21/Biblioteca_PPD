import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

interface Props {
    tipos: Array<{ id: number; nombre: string }>;
    roles: string[];
}

export default function UsuariosCreate({ tipos = [], roles = [] }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        documento_identidad: '',
        tipo_usuario_id: '',
        telefono: '',
        estado: 'activo',
        rol: '',
        password: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/usuarios');
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <Head title="Nuevo Usuario - Biblioteca PPD" />
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0f2b48]">Registrar Nuevo Usuario</h1>
                        <p className="text-sm text-slate-500">Completa la información de membresía y accesos al sistema.</p>
                    </div>
                    <Link href="/usuarios" className="text-sm font-semibold text-[#0f2b48] hover:underline">
                        ← Volver al Directorio
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre Completo</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                            required
                        />
                        {errors.name && <span className="text-xs text-red-600">{errors.name}</span>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                                required
                            />
                            {errors.email && <span className="text-xs text-red-600">{errors.email}</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Documento de Identidad</label>
                            <input
                                type="text"
                                value={data.documento_identidad}
                                onChange={(e) => setData('documento_identidad', e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                                required
                            />
                            {errors.documento_identidad && <span className="text-xs text-red-600">{errors.documento_identidad}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Tipo de Usuario</label>
                            <select
                                value={data.tipo_usuario_id}
                                onChange={(e) => setData('tipo_usuario_id', e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white"
                                required
                            >
                                <option value="">Seleccione tipo...</option>
                                {tipos.map((t) => (
                                    <option key={t.id} value={t.id}>{t.nombre}</option>
                                ))}
                            </select>
                            {errors.tipo_usuario_id && <span className="text-xs text-red-600">{errors.tipo_usuario_id}</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Rol del Sistema</label>
                            <select
                                value={data.rol}
                                onChange={(e) => setData('rol', e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white"
                                required
                            >
                                <option value="">Seleccione rol...</option>
                                {roles.map((r, idx) => (
                                    <option key={idx} value={r}>{r}</option>
                                ))}
                            </select>
                            {errors.rol && <span className="text-xs text-red-600">{errors.rol}</span>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Contraseña Temporal</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                            required
                        />
                        {errors.password && <span className="text-xs text-red-600">{errors.password}</span>}
                    </div>

                    <div className="pt-4 flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#0f2b48] hover:bg-[#1a426e] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm"
                        >
                            Guardar Usuario
                        </button>
                        <Link href="/usuarios" className="text-sm text-slate-600 hover:underline">
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}