"use client";

import { useState } from "react";
import { DestinoPeriodoSelector } from "@/components/admin/destino-periodo-selector";
import { createPernocteExtra, deletePernocteExtra } from "@/lib/actions/datos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";

interface Pernocte {
  id: string;
  pernoctes: number | null;
  porcentaje: number | null;
  descripcion: string | null;
  destino: { nombre: string };
}

export default function PernoctesPage() {
  const [destinoId, setDestinoId] = useState("");
  const [periodoId, setPeriodoId] = useState("");
  const [data, setData] = useState<Pernocte[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ pernoctes: "", porcentaje: "", descripcion: "" });

  const handleSelected = async (dId: string, pId: string) => {
    setDestinoId(dId);
    setPeriodoId(pId);
    const res = await fetch(`/api/datos/pernoctes?destinoId=${dId}&periodoId=${pId}`);
    setData(await res.json());
  };

  const handleCreate = async () => {
    await createPernocteExtra({
      destinoId,
      periodoId,
      pernoctes: form.pernoctes ? parseInt(form.pernoctes) : undefined,
      porcentaje: form.porcentaje ? parseFloat(form.porcentaje) : undefined,
      descripcion: form.descripcion || undefined,
    });
    setOpen(false);
    setForm({ pernoctes: "", porcentaje: "", descripcion: "" });
    handleSelected(destinoId, periodoId);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar este registro?")) {
      await deletePernocteExtra(id);
      handleSelected(destinoId, periodoId);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pernoctes Extra Hoteleros</h2>
      <DestinoPeriodoSelector onSelected={handleSelected} />

      {destinoId && periodoId && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Registros</CardTitle>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger render={<Button size="sm"><Plus className="mr-2 h-4 w-4" />Nuevo</Button>} />
              <DialogContent>
                <DialogHeader><DialogTitle>Nuevo pernocte</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <Input type="number" placeholder="Pernoctes" value={form.pernoctes} onChange={(e) => setForm({ ...form, pernoctes: e.target.value })} />
                  <Input type="number" step="0.1" placeholder="Porcentaje sobre total" value={form.porcentaje} onChange={(e) => setForm({ ...form, porcentaje: e.target.value })} />
                  <Input placeholder="Descripción" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
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
                  <TableHead>Pernoctes</TableHead>
                  <TableHead>Porcentaje</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="w-[80px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Sin datos</TableCell></TableRow>
                ) : data.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.destino?.nombre}</TableCell>
                    <TableCell>{p.pernoctes?.toLocaleString("es-AR") ?? "—"}</TableCell>
                    <TableCell>{p.porcentaje != null ? `${p.porcentaje}%` : "—"}</TableCell>
                    <TableCell>{p.descripcion || "—"}</TableCell>
                    <TableCell><Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
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