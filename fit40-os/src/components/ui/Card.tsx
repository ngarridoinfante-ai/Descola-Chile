import { cn } from "@/lib/utils/cn";
import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: "none" | "green" | "orange" | "red";
  padding?: "sm" | "md" | "lg" | "none";
}

const glowStyles = {
  none: "",
  green: "glow-green border-green/20",
  orange: "glow-orange border-orange/20",
  red: "glow-red border-red-alert/20",
};

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
};

export function Card({ glow = "none", padding = "md", className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-2xl border border-border",
        glowStyles[glow],
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
