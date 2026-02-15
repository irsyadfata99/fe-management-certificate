/**
 * Confirm Hook
 * Custom hook untuk managing confirmation dialogs
 */

import { useState, useCallback } from "react";
import { useDisclosure } from "./useDisclosure";

/**
 * Manage confirmation dialog state
 * @returns {Object} Confirm state and handlers
 *
 * @example
 * const { isOpen, onConfirm, handleConfirm, handleCancel, confirmData } = useConfirm();
 *
 * const handleDelete = (item) => {
 *   onConfirm({
 *     title: 'Delete Item',
 *     message: 'Are you sure?',
 *     item
 *   });
 * };
 *
 * <ConfirmDialog
 *   open={isOpen}
 *   title={confirmData?.title}
 *   message={confirmData?.message}
 *   onConfirm={() => {
 *     deleteItem(confirmData.item);
 *     handleCancel();
 *   }}
 *   onCancel={handleCancel}
 * />
 */
export const useConfirm = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [confirmData, setConfirmData] = useState(null);
  const [onConfirmCallback, setOnConfirmCallback] = useState(null);

  /**
   * Show confirmation dialog
   * @param {Object} data - Confirmation data
   * @param {Function} [callback] - Callback on confirm
   */
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

  /**
   * Handle confirm action
   */
  const handleConfirm = useCallback(() => {
    if (onConfirmCallback) {
      onConfirmCallback(confirmData);
    }
    onClose();
    setConfirmData(null);
    setOnConfirmCallback(null);
  }, [onConfirmCallback, confirmData, onClose]);

  /**
   * Handle cancel action
   */
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
