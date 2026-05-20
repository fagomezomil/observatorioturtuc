import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PeriodSelectorProps {
  periods: { id: string; nombre: string; temporada: string; anio: number }[];
  currentPeriodId: string;
}

export function PeriodSelector({ periods, currentPeriodId }: PeriodSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {periods.map((p) => {
        const slug = p.nombre.toLowerCase().replace(/\s+/g, "-");
        const isActive = p.id === currentPeriodId;
        return (
          <Link
            key={p.id}
            href={`/balance/${slug}`}
            className={`flex items-center gap-1 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            {p.nombre}
            {isActive && <ChevronRight className="h-3 w-3" />}
          </Link>
        );
      })}
    </div>
  );
}