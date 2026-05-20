"use client";

import { useState } from "react";
import { DestinoPeriodoSelector } from "@/components/admin/destino-periodo-selector";
import { createGasto, deleteGasto } from "@/lib/actions/datos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";

interface Gasto {
  id: string;
  gastoDiarioPorPersona: number;
  moneda: string;
  grupoPromedio: number | null;
  porcentajeAlojamiento: number | null;
  porcentajeGastronomia: number | null;
  porcentajeTransporte: number | null;
  porcentajeExcursiones: number | null;
  porcentajeCompras: number | null;
  destino: { nombre: string };
}

export default function GastoPage() {
  const [destinoId, setDestinoId] = useState("");
  const [periodoId, setPeriodoId] = useState("");
  const [data, setData] = useState<Gasto[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ gastoDiario: "", grupoPromedio: "", aloja: "", gastro: "", transp: "", excursion: "", compras: "" });

  const handleSelected = async (dId: string, pId: string) => {
    setDestinoId(dId);
    setPeriodoId(pId);
    const res = await fetch(`/api/datos/gasto?destinoId=${dId}&periodoId=${pId}`);
    setData(await res.json());
  };

  const handleCreate = async () => {
    if (!form.gastoDiario) return;
    await createGasto({
      destinoId,
      periodoId,
      gastoDiarioPorPersona: parseFloat(form.gastoDiario),
      grupoPromedio: form.grupoPromedio ? parseFloat(form.grupoPromedio) : undefined,
      porcentajeAlojamiento: form.aloja ? parseFloat(form.aloja) : undefined,
      porcentajeGastronomia: form.gastro ? parseFloat(form.gastro) : undefined,
      porcentajeTransporte: form.transp ? parseFloat(form.transp) : undefined,
      porcentajeExcursiones: form.excursion ? parseFloat(form.excursion) : undefined,
      porcentajeCompras: form.compras ? parseFloat(form.compras) : undefined,
    });
    setOpen(false);
    setForm({ gastoDiario: "", grupoPromedio: "", aloja: "", gastro: "", transp: "", excursion: "", compras: "" });
    handleSelected(destinoId, periodoId);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar este registro?")) {
      await deleteGasto(id);
      handleSelected(destinoId, periodoId);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gasto Promedio</h2>
      <DestinoPeriodoSelector onSelected={handleSelected} />

      {destinoId && periodoId && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Registros</CardTitle>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger render={<Button size="sm"><Plus className="mr-2 h-4 w-4" />Nuevo</Button>} />
              <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Nuevo gasto</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <Input type="number" placeholder="Gasto diario por persona ($)" value={form.gastoDiario} onChange={(e) => setForm({ ...form, gastoDiario: e.target.value })} />
                  <Input type="number" step="0.1" placeholder="Grupo promedio (personas)" value={form.grupoPromedio} onChange={(e) => setForm({ ...form, grupoPromedio: e.target.value })} />
                  <Input type="number" step="0.1" placeholder="% Alojamiento" value={form.aloja} onChange={(e) => setForm({ ...form, aloja: e.target.value })} />
                  <Input type="number" step="0.1" placeholder="% Gastronomía" value={form.gastro} onChange={(e) => setForm({ ...form, gastro: e.target.value })} />
                  <Input type="number" step="0.1" placeholder="% Transporte" value={form.transp} onChange={(e) => setForm({ ...form, transp: e.target.value })} />
                  <Input type="number" step="0.1" placeholder="% Excursiones" value={form.excursion} onChange={(e) => setForm({ ...form, excursion: e.target.value })} />
                  <Input type="number" step="0.1" placeholder="% Compras" value={form.compras} onChange={(e) => setForm({ ...form, compras: e.target.value })} />
                  <Button onClick={handleCreate} className="w-full">Guardar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Destino</TableHead>
                  <TableHead>Gasto diario $</TableHead>
                  <TableHead>Grupo prom.</TableHead>
                  <TableHead>Aloja %</TableHead>
                  <TableHead>Gastro %</TableHead>
                  <TableHead>Transp. %</TableHead>
                  <TableHead>Exc. %</TableHead>
                  <TableHead>Compras %</TableHead>
                  <TableHead className="w-[80px]">Acc.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground">Sin datos</TableCell></TableRow>
                ) : data.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="font-medium">{g.destino?.nombre}</TableCell>
                    <TableCell>${g.gastoDiarioPorPersona.toLocaleString("es-AR")}</TableCell>
                    <TableCell>{g.grupoPromedio ?? "—"}</TableCell>
                    <TableCell>{g.porcentajeAlojamiento ?? "—"}%</TableCell>
                    <TableCell>{g.porcentajeGastronomia ?? "—"}%</TableCell>
                    <TableCell>{g.porcentajeTransporte ?? "—"}%</TableCell>
                    <TableCell>{g.porcentajeExcursiones ?? "—"}%</TableCell>
                    <TableCell>{g.porcentajeCompras ?? "—"}%</TableCell>
                    <TableCell><Button variant="ghost" size="icon" onClick={() => handleDelete(g.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}