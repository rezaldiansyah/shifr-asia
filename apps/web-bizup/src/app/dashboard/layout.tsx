'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#374da0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <span className="text-2xl font-bold gradient-main bg-clip-text text-transparent"
                                style={{ background: 'linear-gradient(135deg, #374da0, #2cbbbc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                bizup.id
                            </span>
                        </Link>

                        {/* Nav */}
                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/dashboard" className="text-gray-600 hover:text-[#374da0] font-medium">
                                Kartu Saya
                            </Link>
                            <Link href="/dashboard/settings" className="text-gray-600 hover:text-[#374da0] font-medium">
                                Pengaturan
                            </Link>
                        </nav>

                        {/* User Menu */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 hidden sm:block">
                                Halo, <strong>{user.name}</strong>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-gray-500 hover:text-red-600 transition"
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
