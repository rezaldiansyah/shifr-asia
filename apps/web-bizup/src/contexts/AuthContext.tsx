'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, User } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        phone?: string;
    }) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = api.getToken();
        if (token) {
            try {
                const { user } = await api.getUser();
                setUser(user);
            } catch {
                api.setToken(null);
            }
        }
        setLoading(false);
    };

    const login = async (email: string, password: string) => {
        const { user, token } = await api.login(email, password);
        api.setToken(token);
        setUser(user);
    };

    const register = async (data: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        phone?: string;
    }) => {
        const { user, token } = await api.register(data);
        api.setToken(token);
        setUser(user);
    };

    const logout = async () => {
        await api.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
