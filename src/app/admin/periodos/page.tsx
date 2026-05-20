import { getPeriodos } from "@/lib/actions/periodos";
import { PeriodosTable } from "./periodos-table";

export default async function PeriodosPage() {
  const periodos = await getPeriodos();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Periodos</h2>
      </div>
      <PeriodosTable periodos={periodos} />
    </div>
  );
}