import { StatMetric } from "./stat-metric";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  change?: number;
  suffix?: string;
  className?: string;
}

/**
 * @deprecated Use StatMetric directly for new code.
 * This wrapper exists for backward compatibility during migration.
 */
export function StatCard({ icon, value, label, change, suffix, className }: StatCardProps) {
  return (
    <StatMetric
      value={value}
      label={label}
      change={change}
      suffix={suffix}
      icon={icon}
      className={className}
    />
  );
}