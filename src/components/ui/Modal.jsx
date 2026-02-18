import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/helpers/cn";
import { X } from "lucide-react";

const modalSizes = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-7xl",
};

export const Modal = ({
  open = false,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEsc = true,
  className,
}) => {
  useEffect(() => {
    if (!open || !closeOnEsc) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose, closeOnEsc]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          "relative w-full bg-white dark:bg-neutral-800 rounded-lg shadow-xl animate-fade-in-scale",
          modalSizes[size],
          className,
        )}
        role="dialog"
        aria-modal="true"
      >
        {(title || description || showCloseButton) && (
          <div className="flex items-start justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex-1">
              {title && (
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                onClick={onClose}
                className="flex-shrink-0 ml-4 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          {children}
        </div>

        {footer && (
          <div className="flex items-center justify-end gap-2 p-6 border-t border-neutral-200 dark:border-neutral-700">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export const ModalFooter = ({
  onCancel,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "Confirm",
  confirmLoading = false,
  confirmDisabled = false,
  confirmVariant = "primary",
  confirmType = "button",
}) => {
  return (
    <>
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 dark:bg-neutral-700 dark:text-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-600"
      >
        {cancelText}
      </button>
      <button
        type={confirmType}
        onClick={confirmType === "button" ? onConfirm : undefined}
        disabled={confirmDisabled || confirmLoading}
        className={cn(
          "px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed",
          confirmVariant === "primary" &&
            "bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700",
          confirmVariant === "danger" && "bg-danger-500 hover:bg-danger-600",
        )}
      >
        {confirmLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          confirmText
        )}
      </button>
    </>
  );
};
