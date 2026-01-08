'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useTranslation } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

export default function ForgotPasswordPage() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;

        try {
            await api.forgotPassword(email);
            setSuccess(true);
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
                                {t('auth.checkEmail')}
                            </h2>
                            <p className="text-gray-600 mb-6">
                                {t('auth.resetEmailSent')}
                            </p>
                            <Link
                                href="/login"
                                className="text-second hover:text-second-hover font-medium"
                            >
                                {t('auth.backToLogin')}
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2 font-[family-name:var(--font-ubuntu)]">
                                {t('auth.forgotPassword')}
                            </h2>
                            <p className="text-gray-600 mb-6 text-sm">
                                {t('auth.forgotPasswordDesc')}
                            </p>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('auth.email')}
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition"
                                        placeholder="email@domain.com"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-main hover:bg-main-hover text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? t('common.loading') : t('auth.sendResetLink')}
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
