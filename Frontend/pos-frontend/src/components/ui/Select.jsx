import React from "react";

export default function Select({
                                   label,
                                   hint,
                                   error,
                                   className = "",
                                   children,
                                   ...props
                               }) {
    return (
        <label className={`block ${className}`}>
            {label ? <div className="mb-1 text-sm font-medium text-gray-700">{label}</div> : null}
            <div className="relative">
                <select
                    {...props}
                    className={[
                        "w-full appearance-none rounded-md border bg-white px-3 py-2 pr-10 text-gray-900 outline-none transition-colors focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm",
                        error ? "border-red-500 focus:border-red-500" : "border-gray-300",
                    ].join(" ")}
                >
                    {children}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                        ></path>
                    </svg>
                </div>
            </div>
            {error ? <div className="mt-1 text-xs text-red-600">{error}</div> : null}
            {!error && hint ? <div className="mt-1 text-xs text-gray-500">{hint}</div> : null}
        </label>
    );
}