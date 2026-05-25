"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Dumbbell, UtensilsCrossed, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/training", label: "Training", icon: Dumbbell },
  { href: "/nutrition", label: "Nutrición", icon: UtensilsCrossed },
  { href: "/progress", label: "Progreso", icon: TrendingUp },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-xl border-t border-border">
      <div className="flex items-center justify-around px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all duration-150 min-w-[60px]",
                isActive
                  ? "text-green"
                  : "text-text-muted hover:text-text-secondary active:scale-95"
              )}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                className={cn(isActive && "drop-shadow-[0_0_6px_rgba(0,255,135,0.5)]")}
              />
              <span className={cn("text-[10px] font-medium", isActive && "text-glow-green")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
