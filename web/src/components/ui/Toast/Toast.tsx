import { useEffect, useState } from "react";
import styles from "./Toast.module.css";

export type ToastVariant = "success" | "error" | "info";

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onClose?: () => void;
}

export function Toast({
  message,
  variant = "success",
  duration = 4000,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation on mount
    const enterTimer = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss after duration
    const exitTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300); // wait for exit animation
    }, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, [duration, onClose]);

  const icons: Record<ToastVariant, string> = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };

  return (
    <div
      className={`${styles.toast} ${styles[variant]} ${
        visible ? styles.visible : ""
      }`}
      role="alert"
      aria-live="polite"
    >
      <span className={styles.icon}>{icons[variant]}</span>
      <span className={styles.message}>{message}</span>
      <button
        className={styles.closeBtn}
        onClick={() => {
          setVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
        aria-label="Fechar notificação"
      >
        ×
      </button>
    </div>
  );
}
