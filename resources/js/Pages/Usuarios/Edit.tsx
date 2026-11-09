import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

interface UserData {
    id: number;
    name: string;
    email: string;
    documento_identidad: string;
    codigo_estudiante: string | null;
    codigo_acceso_web: string | null;
    cuenta_web_activa: boolean;
    tipo_usuario_id: number;
    telefono: string | null;
    estado: string;
    rol: string | null;
}

interface Props {
    usuario: UserData;
    tipos: Array<{ id: number; nombre: string }>;
    roles: string[];
}

export default function UsuariosEdit({ usuario, tipos = [], roles = [] }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: usuario.name || '',
        email: usuario.email || '',
        documento_identidad: usuario.documento_identidad || '',
        codigo_estudiante: usuario.codigo_estudiante || '',
        codigo_acceso_web: usuario.codigo_acceso_web || '',
        cuenta_web_activa: usuario.cuenta_web_activa ?? false,
        tipo_usuario_id: usuario.tipo_usuario_id || '',
        telefono: usuario.telefono || '',
        estado: usuario.estado || 'activo',
        rol: usuario.rol || '',
        password: '',
    });

    const generarNuevoCodigo = () => {
        const codigo = 'ACCESO-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        setData('codigo_acceso_web', codigo);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/usuarios/${usuario.id}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <Head title={`Editar Usuario: ${usuario.name} - Biblioteca PPD`} />

            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-[#0f2b48]">Editar Perfil de Usuario</h1>
                        <p className="text-xs text-slate-500">Modifica datos personales, membresía, clave web y estado.</p>
                    </div>
                    <Link href="/usuarios" className="text-xs font-semibold text-blue-600 hover:underline">
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
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-500"
                                required
                            />
                            {errors.codigo_estudiante && <span className="text-xs text-red-600">{errors.codigo_estudiante}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-xs font-semibold text-slate-700 uppercase">Código de Acceso Web</label>
                                <button
                                    type="button"
                                    onClick={generarNuevoCodigo}
                                    className="text-[11px] text-blue-600 hover:underline font-semibold"
                                >
                                    🔄 Regenerar
                                </button>
                            </div>
                            <input
                                type="text"
                                value={data.codigo_acceso_web}
                                onChange={(e) => setData('codigo_acceso_web', e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono text-blue-700 font-bold focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Estado del Portal Web</label>
                            <select
                                value={data.cuenta_web_activa ? '1' : '0'}
                                onChange={(e) => setData('cuenta_web_activa', e.target.value === '1')}
                                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
                            >
                                <option value="0">Pendiente de Registro</option>
                                <option value="1">Cuenta Web Activada</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Tipo de Usuario</label>
                            <select
                                value={data.tipo_usuario_id}
                                onChange={(e) => setData('tipo_usuario_id', Number(e.target.value))}
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
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Estado Físico</label>
                            <select
                                value={data.estado}
                                onChange={(e) => setData('estado', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                required
                            >
                                <option value="activo">Activo</option>
                                <option value="suspendido">Suspendido</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Restablecer Contraseña (Opcional)</label>
                        <input
                            type="password"
                            placeholder="Dejar en blanco para conservar la actual"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                        />
                        {errors.password && <span className="text-xs text-red-600">{errors.password}</span>}
                    </div>

                    <div className="pt-4 flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#0f2b48] hover:bg-[#1a426e] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm"
                        >
                            Guardar Cambios
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