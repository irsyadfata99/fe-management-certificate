/**
 * Local Storage Hook
 * Custom hook untuk synced localStorage state
 */

import { useState, useEffect, useCallback } from "react";
import { storage } from "@/utils/helpers/storage";

/**
 * Sync state with localStorage
 * @param {string} key - LocalStorage key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @returns {[any, Function, Function]} [value, setValue, removeValue]
 *
 * @example
 * const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');
 *
 * <button onClick={() => setTheme('dark')}>
 *   Dark Mode
 * </button>
 *
 * @example
 * const [filters, setFilters] = useLocalStorage('table-filters', {
 *   status: 'active'
 * });
 */
export const useLocalStorage = (key, initialValue) => {
  // Get initial value from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = storage.get(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  /**
   * Set value in state and localStorage
   */
  const setValue = useCallback(
    (value) => {
      try {
        // Allow value to be a function like useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);
        storage.set(key, valueToStore);
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  /**
   * Remove value from state and localStorage
   */
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      storage.remove(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Sync with localStorage changes (from other tabs/windows)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          setStoredValue(e.newValue);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue, removeValue];
};
