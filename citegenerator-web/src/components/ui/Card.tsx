import type { HTMLAttributes } from "react";
import { clsx } from "clsx";

type CardVariant = "default" | "elevated" | "bordered";
type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-white shadow-sm border border-slate-200",
  elevated: "bg-white shadow-lg border border-slate-100",
  bordered: "bg-white border-2 border-slate-200",
};

const paddingStyles: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({ variant = "default", padding = "md", className, ...props }: CardProps) {
  return (
    <div
      className={clsx("rounded-2xl", variantStyles[variant], paddingStyles[padding], className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("border-b border-slate-200 pb-4 mb-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={clsx("text-lg font-bold text-slate-900", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx(className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("border-t border-slate-200 pt-4 mt-4", className)} {...props} />;
}
