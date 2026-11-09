import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Login() {
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
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
            <Head title="Iniciar Sesión - Biblioteca PPD" />
            
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-white">Iniciar Sesión</h2>
                    <p className="text-xs text-slate-400 mt-1">Accede al sistema integral de la biblioteca</p>
                </div>
                
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Correo Electrónico:</label>
                        <input 
                            type="email" 
                            value={data.email} 
                            onChange={e => setData('email', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                            required
                        />
                        {errors.email && <span className="text-xs text-red-400 mt-1 block">{errors.email}</span>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Contraseña:</label>
                        <input 
                            type="password" 
                            value={data.password} 
                            onChange={e => setData('password', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                            required
                        />
                        {errors.password && <span className="text-xs text-red-400 mt-1 block">{errors.password}</span>}
                    </div>

                    {/* ENLACES DE RECUPERACIÓN Y REGISTRO */}
                    <div className="flex justify-between items-center text-xs pt-1">
                        <Link href="/forgot-password" className="text-blue-400 hover:underline">
                            ¿Olvidaste tu contraseña?
                        </Link>
                        <Link href="/register" className="text-slate-400 hover:text-white transition-colors">
                            Crear cuenta web
                        </Link>
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full bg-[#0f2b48] hover:bg-[#1a426e] text-white font-semibold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg mt-2"
                    >
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    );
}