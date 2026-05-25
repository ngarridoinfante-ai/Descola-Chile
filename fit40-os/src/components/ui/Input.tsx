"use client";
import { cn } from "@/lib/utils/cn";
import { type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  unit?: string;
}

export function Input({ label, error, unit, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={cn(
            "w-full bg-elevated border border-border rounded-xl px-4 h-11 text-text-primary placeholder:text-text-muted",
            "focus:outline-none focus:border-green/60 focus:ring-1 focus:ring-green/20 transition-colors",
            unit && "pr-14",
            error && "border-red-alert/50",
            className
          )}
          {...props}
        />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">
            {unit}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-alert">{error}</p>}
    </div>
  );
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function TextArea({ label, error, className, ...props }: TextAreaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "w-full bg-elevated border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted",
          "focus:outline-none focus:border-green/60 focus:ring-1 focus:ring-green/20 transition-colors resize-none",
          error && "border-red-alert/50",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-alert">{error}</p>}
    </div>
  );
}
