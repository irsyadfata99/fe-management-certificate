import { useState, useCallback } from "react";
import { toast } from "sonner";

export const useClipboard = (options = {}) => {
  const { timeout = 2000, successMessage = "Copied to clipboard" } = options;

  const [copied, setCopied] = useState(false);
  const [value, setValue] = useState(null);

  const copy = useCallback(
    async (text) => {
      if (!text) return;

      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }

        setValue(text);
        setCopied(true);
        toast.success(successMessage);

        setTimeout(() => {
          setCopied(false);
        }, timeout);
      } catch (error) {
        console.error("Failed to copy:", error);
        toast.error("Failed to copy to clipboard");
        setCopied(false);
      }
    },
    [timeout, successMessage],
  );

  return {
    copy,
    copied,
    value,
  };
};
