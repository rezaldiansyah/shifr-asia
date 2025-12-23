'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (message: string, type?: ToastType) => void;
    hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: Toast = { id, type, message };

        setToasts((prev) => [...prev, newToast]);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const hideToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={hideToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

// Convenience hooks
export function useSuccessToast() {
    const { showToast } = useToast();
    const { t } = useTranslation();

    return {
        saved: () => showToast(t('success.saved'), 'success'),
        created: () => showToast(t('success.created'), 'success'),
        updated: () => showToast(t('success.updated'), 'success'),
        deleted: () => showToast(t('success.deleted'), 'success'),
        custom: (msg: string) => showToast(msg, 'success'),
    };
}

export function useErrorToast() {
    const { showToast } = useToast();
    const { t } = useTranslation();

    return {
        generic: () => showToast(t('error.generic'), 'error'),
        network: () => showToast(t('error.network'), 'error'),
        notFound: () => showToast(t('error.notFound'), 'error'),
        unauthorized: () => showToast(t('error.unauthorized'), 'error'),
        custom: (msg: string) => showToast(msg, 'error'),
    };
}

// Toast Container Component
function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
    const icons: Record<ToastType, React.ReactNode> = {
        success: (
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        warning: (
            <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        info: (
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    };

    const bgColors: Record<ToastType, string> = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        warning: 'bg-yellow-50 border-yellow-200',
        info: 'bg-blue-50 border-blue-200',
    };

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-up ${bgColors[toast.type]}`}
            role="alert"
        >
            {icons[toast.type]}
            <p className="flex-1 text-sm text-gray-700">{toast.message}</p>
            <button
                onClick={() => onDismiss(toast.id)}
                className="text-gray-400 hover:text-gray-600 transition"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}
