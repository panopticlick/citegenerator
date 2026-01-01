"use client";

import type { InputHTMLAttributes } from "react";
import { forwardRef, useId } from "react";
import { clsx } from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftAddon, rightAddon, className, id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    return (
      <div className="w-full">
        {label ? (
          <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1.5">
            {label}
          </label>
        ) : null}

        <div className="relative">
          {leftAddon ? (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              {leftAddon}
            </div>
          ) : null}

          <input
            ref={ref}
            id={id}
            className={clsx(
              "w-full px-4 py-3 bg-white border rounded-xl text-slate-900 placeholder:text-slate-400",
              "transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed",
              leftAddon ? "pl-10" : "",
              rightAddon ? "pr-10" : "",
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-200 hover:border-slate-300",
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            {...props}
          />

          {rightAddon ? (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              {rightAddon}
            </div>
          ) : null}
        </div>

        {error ? (
          <p id={errorId} className="mt-1.5 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        {hint && !error ? (
          <p id={hintId} className="mt-1.5 text-sm text-slate-500">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
