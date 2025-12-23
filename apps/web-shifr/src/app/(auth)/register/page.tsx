'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/api';
import { useTranslation } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setErrors({});

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            password_confirmation: formData.get('password_confirmation') as string,
            phone: formData.get('phone') as string,
        };

        try {
            await register(data);
            router.push('/dashboard');
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || t('error.generic'));
            if (apiError.errors) {
                setErrors(apiError.errors);
            }
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
                    <p className="text-gray-600 mt-2">{t('auth.startFree')}</p>
                </div>

                {/* Form Card */}
                <div className="bg-fifth rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 font-[family-name:var(--font-ubuntu)]">
                        {t('auth.register')}
                    </h2>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('auth.name')}
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition"
                                placeholder={t('auth.name')}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
                        </div>

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
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                No. WhatsApp (optional)
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition"
                                placeholder="08123456789"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('auth.password')}
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                minLength={8}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition"
                                placeholder="Min. 8 characters"
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('auth.confirmPassword')}
                            </label>
                            <input
                                type="password"
                                id="password_confirmation"
                                name="password_confirmation"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition"
                                placeholder="Repeat password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-main hover:bg-main-hover text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? t('common.loading') : t('auth.register')}
                        </button>
                    </form>

                    <p className="text-center text-gray-600 mt-6">
                        {t('auth.hasAccount')}{' '}
                        <Link href="/login" className="text-second hover:text-second-hover font-medium">
                            {t('auth.login')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
