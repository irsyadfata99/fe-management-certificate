/**
 * Clipboard Hook
 * Custom hook untuk copy to clipboard functionality
 */

import { useState, useCallback } from "react";
import { toast } from "sonner";

/**
 * Copy text to clipboard
 * @param {Object} [options] - Configuration options
 * @param {number} [options.timeout=2000] - Reset timeout in ms
 * @param {string} [options.successMessage] - Success toast message
 * @returns {Object} Clipboard state and handlers
 *
 * @example
 * const { copy, copied, value } = useClipboard({
 *   successMessage: 'Password copied!'
 * });
 *
 * <button onClick={() => copy(password)}>
 *   {copied ? 'Copied!' : 'Copy Password'}
 * </button>
 *
 * @example
 * // Copy certificate number
 * const { copy } = useClipboard();
 * <button onClick={() => copy('No. 000123')}>
 *   Copy Certificate Number
 * </button>
 */
export const useClipboard = (options = {}) => {
  const { timeout = 2000, successMessage = "Copied to clipboard" } = options;

  const [copied, setCopied] = useState(false);
  const [value, setValue] = useState(null);

  const copy = useCallback(
    async (text) => {
      if (!text) return;

      try {
        // Modern Clipboard API
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback for older browsers
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

        // Reset after timeout
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
