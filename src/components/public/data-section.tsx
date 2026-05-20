interface DataSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function DataSection({ title, description, children }: DataSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {children}
    </div>
  );
}