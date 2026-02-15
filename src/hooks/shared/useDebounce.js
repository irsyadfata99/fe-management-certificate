/**
 * Debounce Hook
 * Custom React hook untuk debouncing values
 */

import { useState, useEffect } from "react";

/**
 * Debounce a value
 * @param {any} value - Value to debounce
 * @param {number} [delay=500] - Delay in milliseconds
 * @returns {any} Debounced value
 *
 * @example
 * const [input, setInput] = useState('');
 * const debouncedInput = useDebounce(input, 300);
 *
 * useEffect(() => {
 *   // This will only fire 300ms after user stops typing
 *   console.log('Debounced value:', debouncedInput);
 * }, [debouncedInput]);
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up the timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up timeout if value changes before delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
