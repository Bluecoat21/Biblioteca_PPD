import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

interface Props {
    status?: string;
}

export default function ForgotPassword({ status }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
            <Head title="Recuperar Contraseña - Biblioteca PPD" />

            <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-white">¿Olvidaste tu contraseña?</h2>
                    <p className="text-xs text-slate-400 mt-2">
                        Ingresa tu correo registrado y te enviaremos un enlace a tu bandeja para restablecerla.
                    </p>
                </div>

                {status && (
                    <div className="mb-4 text-xs font-medium text-emerald-400 bg-emerald-950/50 border border-emerald-800 p-3 rounded-xl text-center">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Correo Electrónico</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="tu_correo@gmail.com"
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                            required
                        />
                        {errors.email && <span className="text-xs text-red-400 mt-1 block">{errors.email}</span>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-[#0f2b48] hover:bg-[#1a426e] text-white font-semibold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg mt-2"
                    >
                        Enviar Enlace de Recuperación
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-slate-400">
                    <Link href="/login" className="text-blue-400 hover:underline">
                        ← Volver a Iniciar Sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}