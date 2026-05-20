"use client";

import { useState } from "react";
import { DestinoPeriodoSelector } from "@/components/admin/destino-periodo-selector";
import { createSitioConsultado, deleteSitioConsultado } from "@/lib/actions/datos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";

interface Sitio {
  id: string;
  sitio: string;
  porcentaje: number;
  destino: { nombre: string };
}

export default function SitiosPage() {
  const [destinoId, setDestinoId] = useState("");
  const [periodoId, setPeriodoId] = useState("");
  const [data, setData] = useState<Sitio[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ sitio: "", porcentaje: "" });

  const handleSelected = async (dId: string, pId: string) => {
    setDestinoId(dId);
    setPeriodoId(pId);
    const res = await fetch(`/api/datos/sitios?destinoId=${dId}&periodoId=${pId}`);
    setData(await res.json());
  };

  const handleCreate = async () => {
    if (!form.sitio.trim() || !form.porcentaje) return;
    await createSitioConsultado({ destinoId, periodoId, sitio: form.sitio.trim(), porcentaje: parseFloat(form.porcentaje) });
    setOpen(false);
    setForm({ sitio: "", porcentaje: "" });
    handleSelected(destinoId, periodoId);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar este registro?")) {
      await deleteSitioConsultado(id);
      handleSelected(destinoId, periodoId);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Sitios Consultados</h2>
      <DestinoPeriodoSelector onSelected={handleSelected} />

      {destinoId && periodoId && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Registros</CardTitle>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger render={<Button size="sm"><Plus className="mr-2 h-4 w-4" />Nuevo</Button>} />
              <DialogContent>
                <DialogHeader><DialogTitle>Nuevo sitio</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Sitio (ej: Buscadores online)" value={form.sitio} onChange={(e) => setForm({ ...form, sitio: e.target.value })} />
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
                  <TableHead>Sitio</TableHead>
                  <TableHead>Porcentaje</TableHead>
                  <TableHead className="w-[80px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Sin datos</TableCell></TableRow>
                ) : data.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.sitio}</TableCell>
                    <TableCell>{s.porcentaje}%</TableCell>
                    <TableCell><Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
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