import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ open, title, children, onClose, footer }) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                role="button"
                tabIndex={-1}
            />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden ring-1 ring-black/5">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 text-gray-700">{children}</div>

                {footer ? (
                    <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                        {footer}
                    </div>
                ) : null}
            </div>
        </div>
    );
}