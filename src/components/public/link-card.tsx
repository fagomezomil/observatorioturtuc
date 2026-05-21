import Link from "next/link";
import { type LucideIcon } from "lucide-react";

interface LinkCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function LinkCard({ href, icon: Icon, title, description, className }: LinkCardProps) {
  return (
    <Link href={href} className={`group block rounded-[12px] border border-border bg-card p-5 transition-colors hover:bg-primary hover:border-primary ${className ?? ""}`}>
      <div className="flex items-center gap-3 mb-1">
        <div className="rounded-lg p-2 transition-colors" style={{ backgroundColor: "rgba(0, 110, 102, 0.1)" }}>
          <Icon className="h-4 w-4 text-[#006e66] group-hover:text-white transition-colors" />
        </div>
        <h3 className="text-base font-semibold text-foreground group-hover:text-white transition-colors">{title}</h3>
      </div>
      <p className="text-[13px] text-muted-foreground group-hover:text-white/80 transition-colors">{description}</p>
    </Link>
  );
}