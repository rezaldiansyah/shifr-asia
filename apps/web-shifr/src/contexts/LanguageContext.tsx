'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, t as translate } from '@/lib/i18n/translations';

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'shifr_locale';

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('en');
    const [isHydrated, setIsHydrated] = useState(false);

    // Load locale from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
        if (stored && (stored === 'id' || stored === 'en' || stored === 'ar')) {
            setLocaleState(stored);
            document.documentElement.lang = stored;
            document.documentElement.dir = stored === 'ar' ? 'rtl' : 'ltr';
        }
        setIsHydrated(true);
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem(STORAGE_KEY, newLocale);
        // Update HTML lang attribute
        document.documentElement.lang = newLocale;
        document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    };

    const t = (key: string): string => {
        return translate(key, locale);
    };

    // Prevent hydration mismatch
    if (!isHydrated) {
        return (
            <LanguageContext.Provider value={{ locale: 'en', setLocale, t: (key) => translate(key, 'en') }}>
                {children}
            </LanguageContext.Provider>
        );
    }

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

// Hook for components that only need translation function
export function useTranslation() {
    const { t, locale } = useLanguage();
    return { t, locale };
}
