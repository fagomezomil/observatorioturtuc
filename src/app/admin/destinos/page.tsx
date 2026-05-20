import { getDestinos } from "@/lib/actions/destinos";
import { DestinosTable } from "./destinos-table";

export default async function DestinosPage() {
  const destinos = await getDestinos();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Destinos</h2>
      </div>
      <DestinosTable destinos={destinos} />
    </div>
  );
}