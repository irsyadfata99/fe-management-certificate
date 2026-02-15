/**
 * Alert Component
 * Notification/alert boxes with variants
 * FIXED: Better text contrast in dark mode
 */

import { cn } from "@/utils/helpers/cn";
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";

/**
 * Alert variants with icons
 */
const alertVariants = {
  default: {
    container:
      "bg-neutral-50 border-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100",
    icon: Info,
    iconColor: "text-neutral-500 dark:text-neutral-400",
  },
  info: {
    container:
      "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100",
    icon: Info,
    iconColor: "text-blue-500 dark:text-blue-400",
  },
  success: {
    container:
      "bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100",
    icon: CheckCircle,
    iconColor: "text-green-600 dark:text-green-400",
  },
  warning: {
    container:
      "bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-100",
    icon: AlertTriangle,
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
  danger: {
    container:
      "bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100",
    icon: AlertCircle,
    iconColor: "text-red-600 dark:text-red-400",
  },
};

/**
 * Alert component
 */
export const Alert = ({
  children,
  variant = "default",
  title,
  onClose,
  className,
}) => {
  const config = alertVariants[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "relative flex gap-3 p-4 border rounded-lg",
        config.container,
        className,
      )}
      role="alert"
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <Icon className={cn("w-5 h-5", config.iconColor)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && <h5 className="font-semibold mb-1 text-sm">{title}</h5>}
        <div className="text-sm">{children}</div>
      </div>

      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className={cn(
            "flex-shrink-0 p-1 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/5",
            config.iconColor,
          )}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
