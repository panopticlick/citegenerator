import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("mx-auto w-full max-w-6xl px-4", className)} {...props} />;
}
