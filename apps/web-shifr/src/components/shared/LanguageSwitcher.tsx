'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Locale } from '@/lib/i18n/translations';

interface LanguageSwitcherProps {
    variant?: 'dropdown' | 'toggle';
    className?: string;
}

export default function LanguageSwitcher({ variant = 'toggle', className = '' }: LanguageSwitcherProps) {
    const { locale, setLocale } = useLanguage();

    if (variant === 'dropdown') {
        return (
            <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as Locale)}
                className={`px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-main ${className}`}
            >
                <option value="id">🇮🇩 Indonesia</option>
                <option value="en">🇬🇧 English</option>
            </select>
        );
    }

    return (
        <div className={`inline-flex items-center bg-gray-100 rounded-lg p-1 ${className}`}>
            <button
                onClick={() => setLocale('id')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${locale === 'id'
                        ? 'bg-white text-main shadow'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
            >
                ID
            </button>
            <button
                onClick={() => setLocale('en')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${locale === 'en'
                        ? 'bg-white text-main shadow'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
            >
                EN
            </button>
        </div>
    );
}
