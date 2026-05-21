interface ProfileCardProps {
  title: string;
  subtitle?: string;
  accent?: "teal" | "orange" | "navy" | "none";
  className?: string;
  children: React.ReactNode;
}

const accentBorderMap = {
  teal: "border-l-[3px] border-l-[#006e66]",
  orange: "border-l-[3px] border-l-[#e9721f]",
  navy: "border-l-[3px] border-l-[#223468]",
  none: "",
};

export function ProfileCard({ title, subtitle, accent = "none", className, children }: ProfileCardProps) {
  return (
    <div className={`rounded-[12px] border border-border bg-card p-5 ${accentBorderMap[accent]} ${className ?? ""}`}>
      <h4 className="text-base font-semibold text-foreground">{title}</h4>
      {subtitle && <p className="text-[13px] text-muted-foreground mt-0.5">{subtitle}</p>}
      <div className="mt-3">
        {children}
      </div>
    </div>
  );
}