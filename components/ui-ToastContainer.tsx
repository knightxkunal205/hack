"use client";

import React from "react";
import { useChainTracker } from "@/context/ChainTrackerContext";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useChainTracker();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isWarning = toast.type === "warning";
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
              isSuccess
                ? "bg-emerald-950/90 text-emerald-100 border-emerald-500/40 shadow-emerald-950/40"
                : isWarning
                ? "bg-amber-950/90 text-amber-100 border-amber-500/40 shadow-amber-950/40"
                : isError
                ? "bg-rose-950/90 text-rose-100 border-rose-500/40 shadow-rose-950/40"
                : "bg-slate-900/90 text-slate-100 border-slate-700 shadow-slate-950/40"
            }`}
          >
            <div className="mt-0.5 flex-shrink-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {isError && <XCircle className="w-5 h-5 text-rose-400" />}
              {!isSuccess && !isWarning && !isError && <Info className="w-5 h-5 text-sky-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm leading-tight text-white">{toast.title}</h4>
              <p className="text-xs text-slate-300 mt-1 leading-normal">{toast.description}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
