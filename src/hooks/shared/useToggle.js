import { useState, useCallback } from "react";

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
