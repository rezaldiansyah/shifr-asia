'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const navItems = [
        { href: '/dashboard', label: t('nav.dashboard'), icon: 'home' },
        { href: '/dashboard/products', label: t('nav.products'), icon: 'products' },
        { href: '/dashboard/orders', label: t('nav.orders'), icon: 'orders' },
        { href: '/dashboard/store', label: t('nav.store'), icon: 'store' },
        { href: '/dashboard/builder', label: t('nav.builder'), icon: 'builder' },
        { href: '/dashboard/subscription', label: t('nav.subscription'), icon: 'subscription' },
    ];

    const getIcon = (iconName: string) => {
        const icons: Record<string, React.ReactNode> = {
            home: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            products: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            orders: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
            store: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            builder: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
            ),
            subscription: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        };
        return icons[iconName] || icons.home;
    };

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard';
        }
        return pathname.startsWith(href);
    };

    const Sidebar = () => (
        <>
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
                <Link href="/dashboard" className="text-xl font-bold text-main font-[family-name:var(--font-ubuntu)]">
                    Shifr Asia
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center px-4 py-3 rounded-lg transition ${isActive(item.href)
                                ? 'text-main bg-main/10 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <span className="mr-3">{getIcon(item.icon)}</span>
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* User Menu */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-main rounded-full flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                    {t('auth.logout')}
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-fourth flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 bg-fifth border-r border-gray-200 flex-col fixed h-full">
                <Sidebar />
            </aside>

            {/* Mobile Menu Button */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-fifth border-b border-gray-200 flex items-center px-4 z-40">
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 text-gray-600 hover:text-gray-800"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <span className="ml-3 text-lg font-bold text-main font-[family-name:var(--font-ubuntu)]">
                    Shifr Asia
                </span>
                <div className="ml-auto">
                    <LanguageSwitcher variant="toggle" />
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 z-50 mobile-overlay"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <aside
                        className="w-64 h-full bg-fifth flex flex-col mobile-sidebar"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                            <span className="text-lg font-bold text-main">Menu</span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-gray-600 hover:text-gray-800"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <Sidebar />
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 md:ml-64 pt-16 md:pt-0">
                {/* Desktop Header */}
                <header className="hidden md:flex h-16 bg-fifth border-b border-gray-200 items-center px-6 justify-end">
                    <LanguageSwitcher variant="toggle" />
                </header>

                <div className="p-4 md:p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
