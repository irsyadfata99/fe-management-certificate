import { useState, useCallback } from "react";

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
