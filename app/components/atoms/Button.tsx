import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-primary-600 text-neutral-50 hover:bg-primary-700 focus-visible:outline-primary-600",
  secondary:
    "bg-transparent text-brand border border-border-strong hover:bg-primary-600/10 focus-visible:outline-primary-600",
  ghost: "bg-transparent text-foreground-muted hover:bg-surface-muted focus-visible:outline-primary-600",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "text-sm px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2.5 gap-2",
  lg: "text-base px-5 py-3 gap-2",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center rounded-full font-medium cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

function classes(variant: ButtonVariant, size: ButtonSize, extra?: string) {
  return [BASE_CLASSES, VARIANT_CLASSES[variant], SIZE_CLASSES[size], extra].filter(Boolean).join(" ");
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={classes(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  target,
}: ButtonBaseProps & { href: string; target?: string }) {
  const externo = href.startsWith("http");
  if (externo || target === "_blank") {
    return (
      <a href={href} target={target ?? "_blank"} rel="noreferrer" className={classes(variant, size, className)}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes(variant, size, className)}>
      {children}
    </Link>
  );
}
