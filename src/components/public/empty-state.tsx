import { Database } from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ icon: Icon = Database, title, description, className }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className ?? ""}`}>
      <div className="rounded-xl bg-muted p-3 mb-3">
        <Icon className="h-6 w-6 text-muted-foreground/50" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      {description && <p className="text-[13px] text-muted-foreground/70 mt-1 max-w-xs">{description}</p>}
    </div>
  );
}