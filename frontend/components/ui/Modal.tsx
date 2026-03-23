"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    size?: "sm" | "md" | "lg" | "xl";
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    size = "md",
    children,
    footer,
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        let prevOverflow: string | null = null;
        let prevPaddingRight: string | null = null;

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);

            // Preserve previous body styles and prevent layout shift when hiding scrollbar
            prevOverflow = document.body.style.overflow;
            prevPaddingRight = document.body.style.paddingRight;

            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = `${scrollbarWidth}px`;
            }
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            // Restore previous styles if we changed them
            if (prevOverflow !== null) document.body.style.overflow = prevOverflow;
            else document.body.style.overflow = "";
            if (prevPaddingRight !== null) document.body.style.paddingRight = prevPaddingRight;
            else document.body.style.paddingRight = "";
        };
    }, [isOpen, onClose]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!mounted) return null;

    if (!isOpen) return null;

    const sizes = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-2xl",
    };

    return createPortal(
        <div
            className="fixed inset-0 grid place-items-center p-4 overflow-y-auto"
            onClick={handleBackdropClick}
            style={{ zIndex: 2147483647 }}
        >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" style={{ zIndex: 2147483646 }} />

            {/* Modal Content */}
            <div
                ref={modalRef}
                className={`
                    relative w-full ${sizes[size]} 
                    bg-white rounded-2xl shadow-2xl 
                    flex flex-col max-h-[85vh] 
                    animate-modal select-text
                `}
                onClick={(e) => e.stopPropagation()}
                style={{ zIndex: 2147483647 }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex-shrink-0 rounded-b-2xl">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
