import type { ElementType, ReactNode } from "react";

type TextVariant = "display" | "h1" | "h2" | "h3" | "body" | "small" | "eyebrow";
type TextTone = "default" | "muted" | "inverted" | "accent" | "brand";

interface TextProps {
  as?: ElementType;
  variant?: TextVariant;
  tone?: TextTone;
  className?: string;
  children: ReactNode;
}

// "display" usa a fonte de destaque (ValleySans) — só para o título principal do site e
// algum ponto pontual de marca. O resto do texto usa Poppins (títulos) ou Montserrat (corpo).
const VARIANT_CLASSES: Record<TextVariant, string> = {
  display: "font-display text-4xl md:text-5xl font-semibold tracking-tight leading-tight",
  h1: "font-heading text-3xl md:text-4xl font-semibold tracking-tight leading-tight",
  h2: "font-heading text-2xl md:text-3xl font-semibold tracking-tight",
  h3: "font-heading text-xl md:text-2xl font-semibold",
  body: "font-sans text-base leading-relaxed",
  small: "font-sans text-sm leading-relaxed",
  eyebrow: "font-sans text-xs font-semibold uppercase tracking-wider",
};

const TONE_CLASSES: Record<TextTone, string> = {
  default: "text-foreground",
  muted: "text-foreground-muted",
  inverted: "text-neutral-50",
  accent: "text-accent-text",
  brand: "text-brand",
};

const DEFAULT_TAG: Record<TextVariant, ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  body: "p",
  small: "p",
  eyebrow: "span",
};

export function Text({ as, variant = "body", tone = "default", className = "", children }: TextProps) {
  const Tag = as ?? DEFAULT_TAG[variant];
  const classes = [VARIANT_CLASSES[variant], TONE_CLASSES[tone], className].filter(Boolean).join(" ");
  return <Tag className={classes}>{children}</Tag>;
}
