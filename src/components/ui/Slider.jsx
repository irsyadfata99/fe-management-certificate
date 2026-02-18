import { cn } from "@/utils/helpers/cn";

export function Slider({
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className,
  ...props
}) {
  const handleChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    onChange?.(newValue);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("relative", className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          "w-full h-2 rounded-lg appearance-none cursor-pointer",
          "bg-neutral-200 dark:bg-neutral-700",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "[&::-webkit-slider-track]:rounded-lg",
          "[&::-webkit-slider-track]:h-2",
          "[&::-webkit-slider-track]:bg-neutral-200",
          "[&::-webkit-slider-track]:dark:bg-neutral-700",
          "[&::-webkit-slider-thumb]:appearance-none",
          "[&::-webkit-slider-thumb]:w-5",
          "[&::-webkit-slider-thumb]:h-5",
          "[&::-webkit-slider-thumb]:rounded-full",
          "[&::-webkit-slider-thumb]:bg-blue-600",
          "[&::-webkit-slider-thumb]:dark:bg-blue-500",
          "[&::-webkit-slider-thumb]:cursor-pointer",
          "[&::-webkit-slider-thumb]:shadow-md",
          "[&::-webkit-slider-thumb]:hover:bg-blue-700",
          "[&::-webkit-slider-thumb]:hover:dark:bg-blue-400",
          "[&::-webkit-slider-thumb]:transition-colors",
          "[&::-webkit-slider-thumb]:ring-2",
          "[&::-webkit-slider-thumb]:ring-white",
          "[&::-webkit-slider-thumb]:dark:ring-neutral-900",
          "[&::-moz-range-track]:rounded-lg",
          "[&::-moz-range-track]:h-2",
          "[&::-moz-range-track]:bg-neutral-200",
          "[&::-moz-range-track]:dark:bg-neutral-700",
          "[&::-moz-range-thumb]:w-5",
          "[&::-moz-range-thumb]:h-5",
          "[&::-moz-range-thumb]:rounded-full",
          "[&::-moz-range-thumb]:bg-blue-600",
          "[&::-moz-range-thumb]:dark:bg-blue-500",
          "[&::-moz-range-thumb]:border-2",
          "[&::-moz-range-thumb]:border-white",
          "[&::-moz-range-thumb]:dark:border-neutral-900",
          "[&::-moz-range-thumb]:cursor-pointer",
          "[&::-moz-range-thumb]:hover:bg-blue-700",
          "[&::-moz-range-thumb]:hover:dark:bg-blue-400",
          "[&::-moz-range-thumb]:transition-colors",
        )}
        style={{
          background: `linear-gradient(to right, rgb(37 99 235) 0%, rgb(37 99 235) ${percentage}%, rgb(229 231 235) ${percentage}%, rgb(229 231 235) 100%)`,
        }}
        {...props}
      />
    </div>
  );
}

export default Slider;
