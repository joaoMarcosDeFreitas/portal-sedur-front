import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const CAMPO =
  "w-full rounded-xl border border-border-strong bg-surface px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500 aria-[invalid=true]:border-danger";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${CAMPO} ${className}`} {...props} />;
}

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${CAMPO} min-h-28 resize-y ${className}`} {...props} />;
}
