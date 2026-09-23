import type { ReactNode } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  hint?: string;
  erro?: string;
  children: ReactNode;
}

/** Rótulo + campo + dica/erro. O `id` precisa ser o mesmo do input passado em `children`. */
export function FormField({ id, label, hint, erro, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {erro ? (
        <p role="alert" className="text-xs text-danger">
          {erro}
        </p>
      ) : (
        hint && <p className="text-xs text-foreground-muted">{hint}</p>
      )}
    </div>
  );
}
