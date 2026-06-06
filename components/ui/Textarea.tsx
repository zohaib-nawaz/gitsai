import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function Textarea({
  label,
  hint,
  error,
  id,
  className = "",
  ...props
}: TextareaProps) {
  const textareaId = id ?? "search-query";

  return (
    <div className="flex w-full flex-col gap-2">
      <label
        htmlFor={textareaId}
        className="text-sm font-medium text-brand"
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        className={`min-h-32 w-full resize-y rounded-2xl border bg-brand-surface px-4 py-3 text-base text-brand placeholder:text-brand-muted/60 focus:border-brand-light focus:outline-none focus:ring-2 focus:ring-brand-accent ${error ? "border-red-400" : "border-brand-border"} ${className}`}
        {...props}
      />
      {hint && !error && (
        <p className="text-sm text-brand-muted">{hint}</p>
      )}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
