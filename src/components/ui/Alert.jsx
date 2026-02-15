/**
 * Alert Component
 * Notification/alert boxes with variants
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
      "bg-info-50 border-info-200 text-info-900 dark:bg-info-950 dark:border-info-800 dark:text-info-100",
    icon: Info,
    iconColor: "text-info-500 dark:text-info-400",
  },
  success: {
    container:
      "bg-success-50 border-success-200 text-success-900 dark:bg-success-950 dark:border-success-800 dark:text-success-100",
    icon: CheckCircle,
    iconColor: "text-success-500 dark:text-success-400",
  },
  warning: {
    container:
      "bg-warning-50 border-warning-200 text-warning-900 dark:bg-warning-950 dark:border-warning-800 dark:text-warning-100",
    icon: AlertTriangle,
    iconColor: "text-warning-500 dark:text-warning-400",
  },
  danger: {
    container:
      "bg-danger-50 border-danger-200 text-danger-900 dark:bg-danger-950 dark:border-danger-800 dark:text-danger-100",
    icon: AlertCircle,
    iconColor: "text-danger-500 dark:text-danger-400",
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
        {title && <h5 className="font-medium mb-1 text-sm">{title}</h5>}
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
