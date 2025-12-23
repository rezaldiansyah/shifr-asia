'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, User } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already authenticated
        const token = api.getToken();
        if (token) {
            api
                .getUser()
                .then((res) => setUser(res.user))
                .catch(() => {
                    api.setToken(null);
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const response = await api.login(email, password);
        api.setToken(response.token);
        setUser(response.user);
    };

    const register = async (data: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        phone?: string;
    }) => {
        const response = await api.register(data);
        api.setToken(response.token);
        setUser(response.user);
    };

    const logout = async () => {
        try {
            await api.logout();
        } catch {
            // Even if logout fails on server, clear local state
        }
        api.setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
            }}
        >
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
