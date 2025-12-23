'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const handleLogout = async () => {
        if (confirm('Yakin ingin keluar?')) {
            await logout();
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-fadeIn">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Pengaturan</h1>

            {/* Profile Info */}
            <div className="card mb-6">
                <h2 className="text-lg font-semibold mb-4">Profil Akun</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Nama</label>
                        <p className="text-gray-900 font-medium">{user?.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                        <p className="text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">No. HP</label>
                        <p className="text-gray-900">{user?.phone || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Subscription */}
            <div className="card mb-6">
                <h2 className="text-lg font-semibold mb-4">Langganan</h2>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#374da0] to-[#2cbbbc] rounded-xl text-white">
                    <div>
                        <p className="font-semibold text-lg">Standard Plan</p>
                        <p className="text-white/80 text-sm">Rp 89.000/tahun</p>
                    </div>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                        Aktif
                    </span>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                    Berlaku hingga: 21 Desember 2025
                </p>
            </div>

            {/* Danger Zone */}
            <div className="card border-red-200">
                <h2 className="text-lg font-semibold text-red-600 mb-4">Zona Bahaya</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Keluar dari Akun</p>
                            <p className="text-sm text-gray-500">Anda akan keluar dari sesi ini</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                        >
                            Keluar
                        </button>
                    </div>
                </div>
            </div>

            {message && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                    {message}
                </div>
            )}
        </div>
    );
}
