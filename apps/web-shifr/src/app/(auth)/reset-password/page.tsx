'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useTranslation } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    useEffect(() => {
        if (!token || !email) {
            setError(t('auth.invalidResetToken'));
        }
    }, [token, email, t]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token || !email) return;

        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const password = formData.get('password') as string;
        const password_confirmation = formData.get('password_confirmation') as string;

        if (password !== password_confirmation) {
            setError('Password tidak cocok');
            setIsLoading(false);
            return;
        }

        try {
            await api.resetPassword({ email, token, password, password_confirmation });
            setSuccess(true);
            setTimeout(() => router.push('/login'), 3000);
        } catch (err: any) {
            setError(err.message || t('error.generic'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-fourth flex items-center justify-center p-4">
            {/* Language Switcher */}
            <div className="absolute top-4 right-4">
                <LanguageSwitcher variant="toggle" />
            </div>

            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-main font-[family-name:var(--font-ubuntu)]">
                        Shifr Asia
                    </h1>
                    <p className="text-gray-600 mt-2">{t('auth.resetPasswordTitle')}</p>
                </div>

                {/* Form Card */}
                <div className="bg-fifth rounded-2xl shadow-xl p-8">
                    {success ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                {t('auth.passwordResetSuccess')}
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Anda akan diarahkan ke halaman login...
                            </p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6 font-[family-name:var(--font-ubuntu)]">
                                {t('auth.resetPassword')}
                            </h2>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('auth.newPassword')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            required
                                            minLength={8}
                                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition"
                                            placeholder="Minimal 8 karakter"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('auth.confirmNewPassword')}
                                    </label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        required
                                        minLength={8}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition"
                                        placeholder="Ulangi kata sandi baru"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !token || !email}
                                    className="w-full bg-main hover:bg-main-hover text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? t('common.loading') : t('auth.resetPassword')}
                                </button>
                            </form>

                            <p className="text-center text-gray-600 mt-6">
                                <Link href="/login" className="text-second hover:text-second-hover font-medium">
                                    {t('auth.backToLogin')}
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-fourth flex items-center justify-center">Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
