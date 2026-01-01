import type { HTMLAttributes } from "react";
import { clsx } from "clsx";

type BadgeVariant = "default" | "primary" | "success" | "warning";
type BadgeSize = "sm" | "md";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-800",
  primary: "bg-blue-100 text-blue-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

export function Badge({ variant = "default", size = "md", className, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center font-semibold rounded-full",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    />
  );
}
