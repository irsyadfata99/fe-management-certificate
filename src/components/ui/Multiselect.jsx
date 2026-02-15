/**
 * MultiSelect Component
 * Dropdown with checkboxes for multiple selection
 */

import { useState, useRef, useEffect } from "react";
import { cn } from "@/utils/helpers/cn";
import { ChevronDown, X } from "lucide-react";

/**
 * MultiSelect component
 * @param {Object} props
 * @param {Array} props.options - Array of { value, label }
 * @param {Array} props.value - Array of selected values
 * @param {Function} props.onChange - Callback when selection changes
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.error - Error state
 * @param {string} props.helperText - Helper/error text
 * @param {boolean} props.fullWidth - Full width
 * @param {boolean} props.disabled - Disabled state
 */
export const MultiSelect = ({
  options = [],
  value = [],
  onChange,
  placeholder = "Select options...",
  error = false,
  helperText,
  fullWidth = false,
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle option selection
  const toggleOption = (optionValue) => {
    if (disabled) return;

    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];

    onChange?.(newValue);
  };

  // Remove single item
  const removeItem = (optionValue, e) => {
    e.stopPropagation();
    if (disabled) return;
    onChange?.(value.filter((v) => v !== optionValue));
  };

  // Get selected labels
  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label);

  const baseStyles =
    "w-full rounded-lg border px-3 py-2 text-sm transition-all duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent cursor-pointer";

  const normalStyles =
    "border-neutral-300 bg-white text-neutral-900 hover:border-neutral-400 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:border-neutral-500";

  const errorStyles =
    "border-danger-500 bg-danger-50 text-danger-900 dark:border-danger-600 dark:bg-danger-950 dark:text-danger-100";

  const disabledStyles =
    "opacity-50 cursor-not-allowed bg-neutral-50 dark:bg-neutral-800";

  return (
    <div className={cn(fullWidth && "w-full")} ref={wrapperRef}>
      <div className="relative">
        {/* Trigger */}
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            baseStyles,
            error ? errorStyles : normalStyles,
            disabled && disabledStyles,
            "min-h-[42px]",
            className,
          )}
        >
          <div className="flex items-center gap-2 flex-wrap pr-6">
            {/* Selected Items */}
            {selectedLabels.length > 0 ? (
              selectedLabels.map((label, index) => {
                const optionValue = options.find(
                  (opt) => opt.label === label,
                )?.value;
                return (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs dark:bg-primary-900 dark:text-primary-300"
                  >
                    {label}
                    {!disabled && (
                      <button
                        type="button"
                        onClick={(e) => removeItem(optionValue, e)}
                        className="hover:text-primary-900 dark:hover:text-primary-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                );
              })
            ) : (
              <span className="text-neutral-400 dark:text-neutral-500">
                {placeholder}
              </span>
            )}
          </div>

          {/* Chevron Icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 dark:text-neutral-500">
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                isOpen && "rotate-180",
              )}
            />
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400">
                No options available
              </div>
            ) : (
              options.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleOption(option.value)}
                      className="w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700"
                    />
                    <span className="text-sm text-neutral-900 dark:text-neutral-100">
                      {option.label}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Helper Text / Error Message */}
      {helperText && (
        <p
          className={cn(
            "mt-1 text-xs",
            error
              ? "text-danger-600 dark:text-danger-400"
              : "text-neutral-500 dark:text-neutral-400",
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

MultiSelect.displayName = "MultiSelect";
