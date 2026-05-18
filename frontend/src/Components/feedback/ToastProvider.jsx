/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

const ToastContext = createContext({ pushToast: () => {} });

const toneMap = {
  info: "border-slate-200/70 bg-white/80 text-slate-900 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-100",
  success:
    "border-emerald-300/80 bg-emerald-50/90 text-emerald-900 dark:border-emerald-600/50 dark:bg-emerald-500/10 dark:text-emerald-200",
  error:
    "border-rose-300/80 bg-rose-50/90 text-rose-900 dark:border-rose-600/50 dark:bg-rose-500/10 dark:text-rose-200",
};

let internalId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    (message, tone = "info") => {
      const id = ++internalId;
      setToasts((prev) => [...prev, { id, message, tone }]);
      window.setTimeout(() => removeToast(id), 3500);
    },
    [removeToast]
  );

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed right-4 top-4 z-[100] flex w-[min(360px,calc(100%-2rem))] flex-col gap-2"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={cn(
              "flex items-start justify-between gap-3 rounded-2xl border px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur-xl transition",
              toneMap[toast.tone] || toneMap.info
            )}
          >
            <p className="text-sm">{toast.message}</p>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
              className="rounded-lg p-1 opacity-60 transition hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
