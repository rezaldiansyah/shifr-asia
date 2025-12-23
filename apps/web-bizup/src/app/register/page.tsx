'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== passwordConfirm) {
            setError('Password tidak cocok');
            return;
        }

        setLoading(true);

        try {
            await register({
                name,
                email,
                password,
                password_confirmation: passwordConfirm,
                phone: phone || undefined,
            });
            router.push('/dashboard');
        } catch (err: unknown) {
            const error = err as { message?: string };
            setError(error.message || 'Registrasi gagal. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #374da0 0%, #2cbbbc 100%)' }}>
            <div className="w-full max-w-md animate-fadeIn">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">bizup.id</h1>
                    <p className="text-white/80">Digital Business Card</p>
                </div>

                {/* Register Card */}
                <div className="card">
                    <h2 className="text-2xl font-semibold text-center mb-6">Daftar</h2>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input"
                                placeholder="email@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">No. WhatsApp (Opsional)</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="input"
                                placeholder="08123456789"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                placeholder="Min. 8 karakter"
                                required
                                minLength={8}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Konfirmasi Password</label>
                            <input
                                type="password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                className="input"
                                placeholder="Ulangi password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full"
                        >
                            {loading ? (
                                <span className="animate-pulse">Memproses...</span>
                            ) : (
                                'Daftar Sekarang'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Sudah punya akun?{' '}
                        <Link href="/login" className="text-[#374da0] font-medium hover:underline">
                            Masuk
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-white/60 text-sm mt-8">
                    © 2024 Bizup.id by Shifr Asia
                </p>
            </div>
        </main>
    );
}
