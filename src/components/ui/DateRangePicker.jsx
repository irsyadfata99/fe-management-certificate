import { useState } from "react";
import { Calendar } from "lucide-react";
import { Input } from "./Input";
import { Button } from "./Button";
import { cn } from "@/utils/helpers/cn";

export const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
  onApply,
  className,
  disabled = false,
}) => {
  const [error, setError] = useState("");

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    onStartDateChange(newStartDate);

    if (endDate && newStartDate && newStartDate > endDate) {
      setError("Start date cannot be after end date");
    } else {
      setError("");
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    onEndDateChange(newEndDate);
    if (startDate && newEndDate && newEndDate < startDate) {
      setError("End date cannot be before start date");
    } else {
      setError("");
    }
  };

  const handleClear = () => {
    setError("");
    onClear?.();
  };

  const handleApply = () => {
    if (!error) {
      onApply?.();
    }
  };

  const hasDateRange = startDate || endDate;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          placeholder="Start Date"
          leftIcon={<Calendar className="w-4 h-4" />}
          error={!!error}
          disabled={disabled}
        />
        <Input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          placeholder="End Date"
          leftIcon={<Calendar className="w-4 h-4" />}
          error={!!error}
          disabled={disabled}
        />
      </div>

      {error && (
        <p className="text-xs text-danger-600 dark:text-danger-400">{error}</p>
      )}

      {hasDateRange && (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleClear}
            disabled={disabled}
            fullWidth
          >
            Clear Range
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={handleApply}
            disabled={disabled || !!error}
            fullWidth
          >
            Apply Filter
          </Button>
        </div>
      )}
    </div>
  );
};

export const DateRangeDisplay = ({ startDate, endDate }) => {
  if (!startDate && !endDate) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
      <Calendar className="w-4 h-4" />
      <span>
        {startDate && formatDate(startDate)}
        {startDate && endDate && " - "}
        {endDate && formatDate(endDate)}
      </span>
    </div>
  );
};

export default DateRangePicker;
