"use client";

import { useState } from "react";
import { DestinoPeriodoSelector } from "@/components/admin/destino-periodo-selector";
import { createOcupacion, updateOcupacion, deleteOcupacion } from "@/lib/actions/datos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";

interface Ocupacion {
  id: string;
  destinoId: string;
  periodoId: string;
  ocupacionMensual: number | null;
  ocupacionDiaria: number | null;
  notas: string | null;
  destino: { id: string; nombre: string };
}

export default function OcupacionPage() {
  const [destinoId, setDestinoId] = useState("");
  const [periodoId, setPeriodoId] = useState("");
  const [data, setData] = useState<Ocupacion[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ocupacionMensual: "", ocupacionDiaria: "", notas: "" });

  const handleSelected = async (dId: string, pId: string) => {
    setDestinoId(dId);
    setPeriodoId(pId);
    const res = await fetch(`/api/datos/ocupacion?destinoId=${dId}&periodoId=${pId}`);
    setData(await res.json());
  };

  const handleCreate = async () => {
    await createOcupacion({
      destinoId,
      periodoId,
      ocupacionMensual: form.ocupacionMensual ? parseFloat(form.ocupacionMensual) : undefined,
      ocupacionDiaria: form.ocupacionDiaria ? parseFloat(form.ocupacionDiaria) : undefined,
      notas: form.notas || undefined,
    });
    setOpen(false);
    setForm({ ocupacionMensual: "", ocupacionDiaria: "", notas: "" });
    handleSelected(destinoId, periodoId);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar este registro?")) {
      await deleteOcupacion(id);
      handleSelected(destinoId, periodoId);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Ocupación Hotelera</h2>
      <DestinoPeriodoSelector onSelected={handleSelected} />

      {destinoId && periodoId && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Registros</CardTitle>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger render={<Button size="sm"><Plus className="mr-2 h-4 w-4" />Nuevo</Button>} />
              <DialogContent>
                <DialogHeader><DialogTitle>Nueva ocupación</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <Input type="number" step="0.1" placeholder="Ocupación mensual (%)" value={form.ocupacionMensual} onChange={(e) => setForm({ ...form, ocupacionMensual: e.target.value })} />
                  <Input type="number" step="0.1" placeholder="Ocupación diaria (%)" value={form.ocupacionDiaria} onChange={(e) => setForm({ ...form, ocupacionDiaria: e.target.value })} />
                  <Input placeholder="Notas" value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} />
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
                  <TableHead>Mensual (%)</TableHead>
                  <TableHead>Diaria (%)</TableHead>
                  <TableHead>Notas</TableHead>
                  <TableHead className="w-[80px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Sin datos</TableCell></TableRow>
                ) : data.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.destino?.nombre}</TableCell>
                    <TableCell>{o.ocupacionMensual ?? "—"}</TableCell>
                    <TableCell>{o.ocupacionDiaria ?? "—"}</TableCell>
                    <TableCell>{o.notas || "—"}</TableCell>
                    <TableCell><Button variant="ghost" size="icon" onClick={() => handleDelete(o.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
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