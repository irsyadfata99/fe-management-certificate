import { Modal } from "@/components/ui/Modal";
import { ModalFooter } from "@/components/ui/Modal";
import { Alert } from "@/components/ui/Alert";

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
      footer={
        <ModalFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          cancelText={cancelText}
          confirmText={confirmText}
          confirmLoading={loading}
          confirmDisabled={loading}
          confirmVariant={variant}
        />
      }
    >
      <div className="space-y-4">
        <Alert variant={alertVariant}>{message}</Alert>

        {children && (
          <div className="text-sm text-neutral-700 dark:text-neutral-300">
            {children}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
