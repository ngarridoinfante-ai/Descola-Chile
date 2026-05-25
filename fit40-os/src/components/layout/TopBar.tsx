import Link from "next/link";
import { Settings } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
}

export function TopBar({ title, subtitle, rightAction }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0F]/90 backdrop-blur-xl border-b border-border px-4 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] pb-3">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div>
          <h1 className="text-lg font-bold text-text-primary leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>
          )}
        </div>
        {rightAction ?? (
          <Link
            href="/profile"
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-elevated border border-border text-text-secondary hover:text-text-primary hover:border-border-bright transition-colors"
          >
            <Settings size={16} />
          </Link>
        )}
      </div>
    </header>
  );
}
