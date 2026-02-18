import React from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

const iconByType = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const toneByType = {
  success: "bg-green-600",
  error: "bg-error",
  info: "bg-blue-600",
};

export default function Toast({ toast, onClose }) {
  if (!toast) return null;
  const Icon = iconByType[toast.type] || Info;

  return (
    <div className="fixed right-4 top-4 z-[60] w-[min(420px,calc(100vw-2rem))]">
      <div
        className={`flex items-center gap-3 rounded-md p-4 text-white shadow-lg ${
          toneByType[toast.type] || "bg-gray-700"
        }`}
      >
        <Icon className="h-5 w-5" />
        <div className="min-w-0 flex-1">
          <div className="font-medium">{toast.message}</div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
