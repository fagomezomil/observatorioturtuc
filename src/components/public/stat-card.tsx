import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  change?: number;
  suffix?: string;
  className?: string;
}

export function StatCard({ icon: Icon, value, label, change, suffix, className }: StatCardProps) {
  return (
    <div className={`rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md ${className ?? ""}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-md bg-primary/10 p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-end gap-2">
        <p className="text-2xl font-bold text-foreground">
          {value}
          {suffix && <span className="text-base font-normal text-muted-foreground ml-1">{suffix}</span>}
        </p>
        {change !== undefined && change !== null && (
          <span className={`text-sm font-medium ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
            {change >= 0 ? "+" : ""}{change}%
          </span>
        )}
      </div>
    </div>
  );
}