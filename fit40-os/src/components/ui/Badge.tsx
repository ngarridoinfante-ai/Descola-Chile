import { cn } from "@/lib/utils/cn";

type BadgeVariant = "green" | "orange" | "red" | "blue" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<BadgeVariant, string> = {
  green: "bg-green/10 text-green border border-green/20",
  orange: "bg-orange/10 text-orange border border-orange/20",
  red: "bg-red-alert/10 text-red-alert border border-red-alert/20",
  blue: "bg-blue-info/10 text-blue-info border border-blue-info/20",
  neutral: "bg-elevated text-text-secondary border border-border",
};

export function Badge({ variant = "neutral", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
