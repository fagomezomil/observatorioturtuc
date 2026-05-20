"use client";

import { useState } from "react";
import { DestinoPeriodoSelector } from "@/components/admin/destino-periodo-selector";
import { createInfoPrevia, deleteInfoPrevia } from "@/lib/actions/datos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";

interface Info {
  id: string;
  fuente: string;
  porcentaje: number;
  destino: { nombre: string };
}

export default function InfoPreviaPage() {
  const [destinoId, setDestinoId] = useState("");
  const [periodoId, setPeriodoId] = useState("");
  const [data, setData] = useState<Info[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ fuente: "", porcentaje: "" });

  const handleSelected = async (dId: string, pId: string) => {
    setDestinoId(dId);
    setPeriodoId(pId);
    const res = await fetch(`/api/datos/info-previa?destinoId=${dId}&periodoId=${pId}`);
    setData(await res.json());
  };

  const handleCreate = async () => {
    if (!form.fuente.trim() || !form.porcentaje) return;
    await createInfoPrevia({ destinoId, periodoId, fuente: form.fuente.trim(), porcentaje: parseFloat(form.porcentaje) });
    setOpen(false);
    setForm({ fuente: "", porcentaje: "" });
    handleSelected(destinoId, periodoId);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar este registro?")) {
      await deleteInfoPrevia(id);
      handleSelected(destinoId, periodoId);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Info Previa</h2>
      <DestinoPeriodoSelector onSelected={handleSelected} />

      {destinoId && periodoId && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Registros</CardTitle>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger render={<Button size="sm"><Plus className="mr-2 h-4 w-4" />Nuevo</Button>} />
              <DialogContent>
                <DialogHeader><DialogTitle>Nueva fuente de info</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Fuente (ej: Internet)" value={form.fuente} onChange={(e) => setForm({ ...form, fuente: e.target.value })} />
                  <Input type="number" step="0.1" placeholder="Porcentaje" value={form.porcentaje} onChange={(e) => setForm({ ...form, porcentaje: e.target.value })} />
                  <Button onClick={handleCreate} className="w-full">Guardar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fuente</TableHead>
                  <TableHead>Porcentaje</TableHead>
                  <TableHead className="w-[80px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Sin datos</TableCell></TableRow>
                ) : data.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.fuente}</TableCell>
                    <TableCell>{i.porcentaje}%</TableCell>
                    <TableCell><Button variant="ghost" size="icon" onClick={() => handleDelete(i.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
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