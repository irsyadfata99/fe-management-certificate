import { Modal, ModalFooter } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Copy, Check, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/utils/helpers/cn";

export const PasswordDisplayModal = ({ open, onClose, password, username, title = "Password Generated" }) => {
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast.success("Password copied to clipboard");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error("Failed to copy password");
    }
  };

  const handleClose = () => {
    setCopied(false);
    setShowPassword(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title={title} size="md" closeOnBackdrop={false} closeOnEsc={false}>
      <div className="space-y-4">
        <Alert variant="warning" title="Important">
          Please save this password securely. It cannot be retrieved later.
        </Alert>
        {username && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Username</label>
            <div className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono">{username}</div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Generated Password</label>
          <div className="relative">
            <div className="px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg pr-24">
              <input type="text" value={password} readOnly className="sr-only" aria-hidden="true" />

              <div className="font-mono text-lg text-neutral-900 dark:text-neutral-100">{showPassword ? password : "••••••••••••"}</div>
            </div>

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-neutral-600 dark:text-neutral-400"
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  copied ? "bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300" : "hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400",
                )}
                title="Copy password"
                aria-label="Copy password"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <p className="text-sm text-neutral-600 dark:text-neutral-400">The user will need to change this password on their first login.</p>
      </div>

      <div className="pt-4 mt-2 border-t border-neutral-200 dark:border-neutral-700 flex justify-end gap-2">
        <ModalFooter onConfirm={handleClose} confirmText="Done" onCancel={handleClose} cancelText="Close" />
      </div>
    </Modal>
  );
};

export default PasswordDisplayModal;
