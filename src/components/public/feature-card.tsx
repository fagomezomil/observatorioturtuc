import { type LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon: Icon, title, description, className }: FeatureCardProps) {
  return (
    <div className={`rounded-[12px] bg-card p-6 text-center ${className ?? ""}`}>
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(0, 110, 102, 0.1)" }}>
        <Icon className="h-6 w-6 text-[#006e66]" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-[13px] text-muted-foreground mt-1">{description}</p>
    </div>
  );
}