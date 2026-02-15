/**
 * ConfirmDialog Component
 * Reusable confirmation dialog for destructive actions
 * Used across multiple pages for delete confirmations
 */

import { Modal, ModalFooter } from "@/components/ui/Modal";
import { Alert } from "@/components/ui/Alert";
import { AlertTriangle } from "lucide-react";

/**
 * ConfirmDialog
 * @param {Object} props
 * @param {boolean} props.open - Dialog open state
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onConfirm - Confirm handler
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Confirmation message
 * @param {string} props.confirmText - Confirm button text
 * @param {string} props.cancelText - Cancel button text
 * @param {boolean} props.loading - Loading state
 * @param {string} props.variant - Variant: 'danger' | 'warning' | 'primary'
 * @param {React.ReactNode} props.children - Additional content
 */
export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  variant = "danger",
  children,
}) => {
  const alertVariant = variant === "danger" ? "danger" : "warning";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      closeOnBackdrop={!loading}
      closeOnEsc={!loading}
    >
      <div className="space-y-4">
        {/* Alert Message */}
        <Alert variant={alertVariant}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm">{message}</p>
            </div>
          </div>
        </Alert>

        {/* Additional Content */}
        {children && (
          <div className="text-sm text-neutral-700 dark:text-neutral-300">
            {children}
          </div>
        )}
      </div>

      {/* Footer */}
      <ModalFooter
        onCancel={onClose}
        onConfirm={onConfirm}
        cancelText={cancelText}
        confirmText={confirmText}
        confirmLoading={loading}
        confirmDisabled={loading}
        confirmVariant={variant}
      />
    </Modal>
  );
};

export default ConfirmDialog;
