import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        documento_identidad: '',
        codigo_acceso_web: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
            <Head title="Activación de Cuenta Web - Biblioteca PPD" />
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-white">Activar Cuenta Web</h2>
                    <p className="text-xs text-slate-400 mt-1">Ingresa tu DNI, el Código de Acceso provisto por la biblioteca y establece tu contraseña.</p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">DNI / Documento de Identidad</label>
                        <input
                            type="text"
                            value={data.documento_identidad}
                            onChange={(e) => setData('documento_identidad', e.target.value)}
                            placeholder="Ej. 73079159"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                            required
                        />
                        {errors.documento_identidad && <span className="text-xs text-red-400">{errors.documento_identidad}</span>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">Código de Acceso Web</label>
                        <input
                            type="text"
                            value={data.codigo_acceso_web}
                            onChange={(e) => setData('codigo_acceso_web', e.target.value)}
                            placeholder="ACCESO-XXXXXX"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-blue-400 font-mono font-bold focus:outline-none focus:border-blue-500"
                            required
                        />
                        {errors.codigo_acceso_web && <span className="text-xs text-red-400 block mt-1">{errors.codigo_acceso_web}</span>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">Nueva Contraseña Web</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Mínimo 8 caracteres"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                            required
                        />
                        {errors.password && <span className="text-xs text-red-400">{errors.password}</span>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">Confirmar Contraseña</label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="Repite tu contraseña"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-[#0f2b48] hover:bg-[#1a426e] text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-lg mt-2"
                    >
                        Activar Cuenta y Acceder
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-slate-400">
                    ¿Ya activaste tu cuenta?{' '}
                    <Link href="/login" className="text-blue-400 hover:underline">
                        Iniciar Sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}