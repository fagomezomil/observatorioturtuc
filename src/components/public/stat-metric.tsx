import { type LucideIcon } from "lucide-react";

interface StatMetricProps {
  value: string;
  label: string;
  change?: number;
  changeLabel?: string;
  suffix?: string;
  prefix?: string;
  icon?: LucideIcon;
  accentColor?: "teal" | "orange" | "navy";
  className?: string;
}

const accentMap = {
  teal: "text-[#006e66]",
  orange: "text-[#e9721f]",
  navy: "text-[#223468]",
};

export function StatMetric({
  value,
  label,
  change,
  changeLabel,
  suffix,
  prefix,
  icon: Icon,
  accentColor,
  className,
}: StatMetricProps) {
  return (
    <div className={`flex items-center gap-3 rounded-[12px] border border-border bg-card p-5 ${className ?? ""}`}>
      {Icon && (
        <div className="flex shrink-0 items-center justify-center rounded-lg px-3 py-4 bg-[#006e66]/[0.08]">
          <Icon className="h-5 w-5 text-[#006e66]" />
        </div>
      )}
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-[28px] font-bold font-tabular leading-none ${accentColor ? accentMap[accentColor] : "text-foreground"}`}>
            {prefix && <span className="text-base font-normal text-muted-foreground mr-1">{prefix}</span>}
            {value}
            {suffix && <span className="text-base font-normal text-muted-foreground ml-1">{suffix}</span>}
          </p>
          {change !== undefined && change !== null && (
            <span className={`shrink-0 inline-flex items-center gap-0.5 rounded-full py-4 text-xs font-medium font-tabular ${change >= 0 ? "trend-up" : "trend-down"}`}>
              {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
            </span>
          )}
        </div>
        <p className="text-[13px] font-medium text-muted-foreground mt-1.5">
          {label}
          {changeLabel && <span className="text-muted-foreground/60 ml-1">{changeLabel}</span>}
        </p>
      </div>
    </div>
  );
}