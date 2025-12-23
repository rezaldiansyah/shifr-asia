'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err: unknown) {
            const error = err as { message?: string };
            setError(error.message || 'Login failed. Please try again.');
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

                {/* Login Card */}
                <div className="card">
                    <h2 className="text-2xl font-semibold text-center mb-6">Masuk</h2>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                placeholder="••••••••"
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
                                'Masuk'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Belum punya akun?{' '}
                        <Link href="/register" className="text-[#374da0] font-medium hover:underline">
                            Daftar sekarang
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
