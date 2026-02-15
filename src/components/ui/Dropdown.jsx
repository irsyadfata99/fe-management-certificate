/**
 * Dropdown Menu Component
 * Dropdown with menu items
 */

import { useState, useRef, useEffect } from "react";
import { cn } from "@/utils/helpers/cn";
import { ChevronDown } from "lucide-react";

/**
 * Dropdown component
 */
export const Dropdown = ({ trigger, children, align = "left", className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alignClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2",
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 min-w-[200px] bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg animate-fade-in-scale",
            alignClasses[align],
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * DropdownTrigger - Pre-built trigger button
 */
export const DropdownTrigger = ({ children, className }) => {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-700",
        className,
      )}
    >
      {children}
      <ChevronDown className="w-4 h-4" />
    </button>
  );
};

/**
 * DropdownMenu - Menu items container
 */
export const DropdownMenu = ({ children, className }) => {
  return (
    <div className={cn("py-1", className)} role="menu">
      {children}
    </div>
  );
};

/**
 * DropdownItem - Individual menu item
 */
export const DropdownItem = ({
  children,
  onClick,
  icon,
  disabled = false,
  danger = false,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition-colors",
        danger
          ? "text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-950"
          : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      role="menuitem"
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

/**
 * DropdownDivider - Menu separator
 */
export const DropdownDivider = () => {
  return (
    <div className="my-1 border-t border-neutral-200 dark:border-neutral-700" />
  );
};

/**
 * DropdownLabel - Menu section label
 */
export const DropdownLabel = ({ children, className }) => {
  return (
    <div
      className={cn(
        "px-4 py-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider",
        className,
      )}
    >
      {children}
    </div>
  );
};
