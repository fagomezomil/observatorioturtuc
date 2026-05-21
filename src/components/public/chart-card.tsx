interface ChartCardProps {
  title?: string;
  description?: string;
  height?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}

const heightMap = {
  sm: "h-[300px]",
  md: "h-[350px]",
  lg: "h-[550px]",
};

export function ChartCard({ title, description, height = "md", className, children }: ChartCardProps) {
  return (
    <div className={`rounded-[12px] bg-card p-5 ${className ?? ""}`}>
      {title && (
        <div className="mb-4">
          <h4 className="text-base font-semibold text-foreground">{title}</h4>
          {description && <p className="text-[13px] text-muted-foreground mt-0.5">{description}</p>}
        </div>
      )}
      <div className={heightMap[height]}>
        {children}
      </div>
    </div>
  );
}