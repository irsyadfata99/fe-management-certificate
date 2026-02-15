/**
 * Toggle Hook
 * Custom hook untuk boolean toggle state
 */

import { useState, useCallback } from "react";

/**
 * Manage boolean toggle state
 * @param {boolean} [initialValue=false] - Initial value
 * @returns {[boolean, Object]} [value, handlers]
 *
 * @example
 * const [isOpen, { toggle, setTrue, setFalse, setValue }] = useToggle();
 *
 * <button onClick={toggle}>Toggle Modal</button>
 * <Modal open={isOpen} onClose={setFalse} />
 *
 * @example
 * const [isActive, { toggle, setTrue }] = useToggle(true);
 */
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  const handlers = {
    toggle,
    setTrue,
    setFalse,
    setValue,
    on: setTrue,
    off: setFalse,
  };

  return [value, handlers];
};
