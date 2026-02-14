import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes safely
 * Menggabungkan class Tailwind dengan deduplikasi otomatis
 *
 * @param {...any} inputs - Class names (string, array, object, dll)
 * @returns {string} Merged class names
 *
 * @example
 * cn('px-4 py-2', 'bg-blue-500')
 * // "px-4 py-2 bg-blue-500"
 *
 * @example
 * cn('px-4', { 'py-2': true, 'bg-red-500': false })
 * // "px-4 py-2"
 *
 * @example
 * // Override conflicting classes (last one wins)
 * cn('bg-blue-500', 'bg-red-500')
 * // "bg-red-500"
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
