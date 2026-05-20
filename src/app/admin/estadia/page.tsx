"use client";

import { useState } from "react";
import { DestinoPeriodoSelector } from "@/components/admin/destino-periodo-selector";
import { createEstadia, deleteEstadia } from "@/lib/actions/datos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";

interface Estadia {
  id: string;
  noches: number;
  variacionInteranual: number | null;
  destino: { nombre: string };
}

export default function EstadiaPage() {
  const [destinoId, setDestinoId] = useState("");
  const [periodoId, setPeriodoId] = useState("");
  const [data, setData] = useState<Estadia[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ noches: "", variacionInteranual: "" });

  const handleSelected = async (dId: string, pId: string) => {
    setDestinoId(dId);
    setPeriodoId(pId);
    const res = await fetch(`/api/datos/estadia?destinoId=${dId}&periodoId=${pId}`);
    setData(await res.json());
  };

  const handleCreate = async () => {
    if (!form.noches) return;
    await createEstadia({
      destinoId,
      periodoId,
      noches: parseFloat(form.noches),
      variacionInteranual: form.variacionInteranual ? parseFloat(form.variacionInteranual) : undefined,
    });
    setOpen(false);
    setForm({ noches: "", variacionInteranual: "" });
    handleSelected(destinoId, periodoId);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar este registro?")) {
      await deleteEstadia(id);
      handleSelected(destinoId, periodoId);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Estadía Promedio</h2>
      <DestinoPeriodoSelector onSelected={handleSelected} />

      {destinoId && periodoId && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Registros</CardTitle>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger render={<Button size="sm"><Plus className="mr-2 h-4 w-4" />Nuevo</Button>} />
              <DialogContent>
                <DialogHeader><DialogTitle>Nueva estadía</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <Input type="number" step="0.1" placeholder="Noches promedio" value={form.noches} onChange={(e) => setForm({ ...form, noches: e.target.value })} />
                  <Input type="number" step="0.1" placeholder="Variación interanual (%)" value={form.variacionInteranual} onChange={(e) => setForm({ ...form, variacionInteranual: e.target.value })} />
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
                  <TableHead>Noches</TableHead>
                  <TableHead>Variación interanual</TableHead>
                  <TableHead className="w-[80px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Sin datos</TableCell></TableRow>
                ) : data.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.destino?.nombre}</TableCell>
                    <TableCell>{e.noches}</TableCell>
                    <TableCell>{e.variacionInteranual != null ? `${e.variacionInteranual}%` : "—"}</TableCell>
                    <TableCell><Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
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