interface DataSectionProps {
  title: string;
  description?: string;
  variant?: "default" | "inset";
  children: React.ReactNode;
}

export function DataSection({ title, description, variant = "default", children }: DataSectionProps) {
  return (
    <section className={variant === "inset" ? "bg-muted/30 rounded-[12px] p-5" : ""}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description && <p className="text-[13px] text-muted-foreground mt-1">{description}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}