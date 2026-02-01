"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

interface Toast {
    id: string;
    type: "success" | "error" | "info" | "warning";
    message: string;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (type: Toast["type"], message: string) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((type: Toast["type"], message: string) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, type, message }]);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

function ToastContainer({
    toasts,
    removeToast,
}: {
    toasts: Toast[];
    removeToast: (id: string) => void;
}) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const icons = {
        success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    };

    const colors = {
        success: "border-l-emerald-500 bg-emerald-50",
        error: "border-l-red-500 bg-red-50",
        info: "border-l-blue-500 bg-blue-50",
        warning: "border-l-amber-500 bg-amber-50",
    };

    return (
        <div
            className={`
        flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border-l-4
        bg-white animate-slide-in min-w-[320px] max-w-md
        ${colors[toast.type]}
      `}
        >
            {icons[toast.type]}
            <p className="flex-1 text-sm text-slate-700">{toast.message}</p>
            <button
                onClick={onClose}
                className="p-1 rounded hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
