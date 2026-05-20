"use client";

import { useState } from "react";
import { DestinoPeriodoSelector } from "@/components/admin/destino-periodo-selector";
import { createProcedencia, deleteProcedencia } from "@/lib/actions/datos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface Procedencia {
  id: string;
  origen: string;
  porcentaje: number;
  tipoTurista: string | null;
  ranking: number | null;
  destino: { nombre: string };
}

export default function ProcedenciaPage() {
  const [destinoId, setDestinoId] = useState("");
  const [periodoId, setPeriodoId] = useState("");
  const [data, setData] = useState<Procedencia[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ origen: "", porcentaje: "", tipoTurista: "turista", ranking: "" });

  const handleSelected = async (dId: string, pId: string) => {
    setDestinoId(dId);
    setPeriodoId(pId);
    const res = await fetch(`/api/datos/procedencia?destinoId=${dId}&periodoId=${pId}`);
    setData(await res.json());
  };

  const handleCreate = async () => {
    if (!form.origen.trim() || !form.porcentaje) return;
    await createProcedencia({
      destinoId,
      periodoId,
      origen: form.origen.trim(),
      porcentaje: parseFloat(form.porcentaje),
      tipoTurista: form.tipoTurista,
      ranking: form.ranking ? parseInt(form.ranking) : undefined,
    });
    setOpen(false);
    setForm({ origen: "", porcentaje: "", tipoTurista: "turista", ranking: "" });
    handleSelected(destinoId, periodoId);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar este registro?")) {
      await deleteProcedencia(id);
      handleSelected(destinoId, periodoId);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Procedencia</h2>
      <DestinoPeriodoSelector onSelected={handleSelected} />

      {destinoId && periodoId && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Registros</CardTitle>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger render={<Button size="sm"><Plus className="mr-2 h-4 w-4" />Nuevo</Button>} />
              <DialogContent>
                <DialogHeader><DialogTitle>Nueva procedencia</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Origen (ej: Buenos Aires)" value={form.origen} onChange={(e) => setForm({ ...form, origen: e.target.value })} />
                  <Input type="number" step="0.1" placeholder="Porcentaje" value={form.porcentaje} onChange={(e) => setForm({ ...form, porcentaje: e.target.value })} />
                  <Select value={form.tipoTurista} onValueChange={(v) => setForm({ ...form, tipoTurista: v ?? "turista" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="turista">Turista</SelectItem>
                      <SelectItem value="excursionista">Excursionista</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="number" placeholder="Ranking (opcional)" value={form.ranking} onChange={(e) => setForm({ ...form, ranking: e.target.value })} />
                  <Button onClick={handleCreate} className="w-full">Guardar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Origen</TableHead>
                  <TableHead>Porcentaje</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Ranking</TableHead>
                  <TableHead className="w-[80px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Sin datos</TableCell></TableRow>
                ) : data.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.origen}</TableCell>
                    <TableCell>{p.porcentaje}%</TableCell>
                    <TableCell>{p.tipoTurista}</TableCell>
                    <TableCell>{p.ranking ?? "—"}</TableCell>
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