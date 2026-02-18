import { useState, useCallback } from "react";
import { useDisclosure } from "./useDisclosure";

export const useConfirm = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [confirmData, setConfirmData] = useState(null);
  const [onConfirmCallback, setOnConfirmCallback] = useState(null);

  const onConfirm = useCallback(
    (data, callback) => {
      setConfirmData(data);
      if (callback) {
        setOnConfirmCallback(() => callback);
      }
      onOpen();
    },
    [onOpen],
  );

  const handleConfirm = useCallback(() => {
    if (onConfirmCallback) {
      onConfirmCallback(confirmData);
    }
    onClose();
    setConfirmData(null);
    setOnConfirmCallback(null);
  }, [onConfirmCallback, confirmData, onClose]);

  const handleCancel = useCallback(() => {
    onClose();
    setConfirmData(null);
    setOnConfirmCallback(null);
  }, [onClose]);

  return {
    isOpen,
    confirmData,
    onConfirm,
    handleConfirm,
    handleCancel,
  };
};
