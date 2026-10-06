import React, { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

let _id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = "info", duration = 3500) => {
    const id = ++_id;
    setToasts((prev) => [...prev, { id, message, type, fading: false }]);

    // start fade-out a bit before removal
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, fading: true } : t))
      );
    }, duration - 350);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, fading: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 350);
  }, []);

  const success = useCallback((msg) => show(msg, "success"), [show]);
  const error   = useCallback((msg) => show(msg, "error"),   [show]);
  const info    = useCallback((msg) => show(msg, "info"),    [show]);

  return (
    <ToastContext.Provider value={{ show, success, error, info }}>
      {children}

      <div className="toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast ${t.type}${t.fading ? " fading" : ""}`}
          >
            <span className="toast-icon">
              {t.type === "success" && "OK"}
              {t.type === "error"   && "!"}
              {t.type === "info"    && "i"}
            </span>
            <span>{t.message}</span>
            <button className="toast-close" onClick={() => dismiss(t.id)}>
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
