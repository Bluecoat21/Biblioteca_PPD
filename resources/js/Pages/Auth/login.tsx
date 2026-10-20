import React from 'react';
import { Head, useForm } from '@inertiajs/react';

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
        <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', fontFamily: 'sans-serif' }}>
            <Head title="Iniciar Sesión - Biblioteca PPD" />
            <h2 style={{ textAlign: 'center', color: '#1e3a8a' }}>Iniciar Sesión</h2>
            
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Correo Electrónico:</label>
                    <input 
                        type="email" 
                        value={data.email} 
                        onChange={e => setData('email', e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                    {errors.email && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.email}</span>}
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Contraseña:</label>
                    <input 
                        type="password" 
                        value={data.password} 
                        onChange={e => setData('password', e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                    {errors.password && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.password}</span>}
                </div>

                <button 
                    type="submit" 
                    disabled={processing}
                    style={{ background: '#2563eb', color: 'white', padding: '0.75rem', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }}
                >
                    Ingresar
                </button>
            </form>
        </div>
    );
}