/**
 * Disclosure Hook
 * Custom hook untuk managing modal/drawer/popover state
 * Similar to Chakra UI's useDisclosure
 */

import { useState, useCallback } from "react";

/**
 * Manage disclosure state (modal, drawer, popover, etc)
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.defaultIsOpen=false] - Initial open state
 * @param {Function} [options.onOpen] - Callback when opened
 * @param {Function} [options.onClose] - Callback when closed
 * @returns {Object} Disclosure state and handlers
 *
 * @example
 * const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
 *
 * <button onClick={onOpen}>Open Modal</button>
 * <Modal open={isOpen} onClose={onClose}>
 *   <button onClick={onClose}>Close</button>
 * </Modal>
 *
 * @example
 * // With callbacks
 * const disclosure = useDisclosure({
 *   onOpen: () => console.log('Modal opened'),
 *   onClose: () => console.log('Modal closed')
 * });
 */
export const useDisclosure = (options = {}) => {
  const {
    defaultIsOpen = false,
    onOpen: onOpenCallback,
    onClose: onCloseCallback,
  } = options;

  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  const onOpen = useCallback(() => {
    setIsOpen(true);
    onOpenCallback?.();
  }, [onOpenCallback]);

  const onClose = useCallback(() => {
    setIsOpen(false);
    onCloseCallback?.();
  }, [onCloseCallback]);

  const onToggle = useCallback(() => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  }, [isOpen, onOpen, onClose]);

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
    open: onOpen,
    close: onClose,
    toggle: onToggle,
  };
};
