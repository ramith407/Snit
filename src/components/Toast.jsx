import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, Info, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((items) => items.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    ({ title, message, type = "success" }) => {
      const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
      setToasts((items) => [...items, { id, title, message, type }]);
      window.setTimeout(() => dismiss(id), 3500);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex w-[min(92vw,380px)] flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = toast.type === "info" ? Info : CheckCircle2;
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                className="glass-panel rounded-lg p-4"
              >
                <div className="flex gap-3">
                  <Icon className="mt-0.5 text-periwinkle" size={20} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-text">{toast.title}</p>
                    {toast.message && (
                      <p className="mt-1 text-sm leading-6 text-muted">{toast.message}</p>
                    )}
                  </div>
                  <button
                    className="text-muted transition hover:text-text"
                    onClick={() => dismiss(toast.id)}
                    aria-label="Dismiss notification"
                  >
                    <X size={18} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return value;
}
