import React from "react";

export default function Input({ label, hint, error, className = "", icon, ...props }) {
    return (
        <label className={`block ${className}`}>
            {label ? <div className="mb-1 text-sm font-medium text-gray-700">{label}</div> : null}
            <div className="relative">
                {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
                <input
                    {...props}
                    className={[
                        "w-full rounded-md border px-3 py-2 text-gray-900 outline-none transition-colors focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                        "placeholder:text-gray-400 bg-white shadow-sm",
                        icon ? "pl-10" : "",
                        error ? "border-red-500 focus:border-red-500" : "border-gray-300",
                    ].join(" ")}
                />
            </div>
            {error ? <div className="mt-1 text-xs text-red-600">{error}</div> : null}
            {!error && hint ? <div className="mt-1 text-xs text-gray-500">{hint}</div> : null}
        </label>
    );
}