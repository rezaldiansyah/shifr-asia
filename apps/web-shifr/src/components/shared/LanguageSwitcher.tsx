'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Locale } from '@/lib/i18n/translations';

interface LanguageSwitcherProps {
    variant?: 'dropdown' | 'toggle' | 'globe';
    className?: string;
}

export default function LanguageSwitcher({ variant = 'toggle', className = '' }: LanguageSwitcherProps) {
    const { locale, setLocale } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' }
    ];

    if (variant === 'globe') {
        const activeLang = languages.find(l => l.code === locale) || languages[0];
        return (
            <div className={`relative ${className}`} ref={dropdownRef}>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-main transition-colors rounded-lg hover:bg-gray-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    <span>{activeLang.code.toUpperCase()}</span>
                </button>
                
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg shadow-gray-200/50 py-1 z-50 animate-fade-in">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setLocale(lang.code as Locale);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${
                                    locale === lang.code ? 'text-main font-semibold bg-gray-50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <span className="text-lg">{lang.flag}</span>
                                {lang.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (variant === 'dropdown') {
        return (
            <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as Locale)}
                className={`px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-main ${className}`}
            >
                <option value="en">🇬🇧 English</option>
                <option value="id">🇮🇩 Indonesia</option>
                <option value="ar">🇸🇦 العربية</option>
            </select>
        );
    }

    return (
        <div className={`inline-flex items-center bg-gray-100 rounded-lg p-1 ${className}`}>
            <button
                onClick={() => setLocale('en')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${locale === 'en'
                        ? 'bg-white text-main shadow'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
            >
                EN
            </button>
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
                onClick={() => setLocale('ar')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${locale === 'ar'
                        ? 'bg-white text-main shadow'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
            >
                AR
            </button>
        </div>
    );
}
