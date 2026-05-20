"use client";

import { useState } from "react";
import { createImpacto, deleteImpacto } from "@/lib/actions/datos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";

interface Impacto {
  id: string;
  montoTotal: number;
  moneda: string;
  descripcion: string | null;
  periodo: { nombre: string };
}

export default function ImpactoPage() {
  const [data, setData] = useState<Impacto[]>([]);
  const [periodoId, setPeriodoId] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ montoTotal: "", moneda: "ARS", descripcion: "" });

  const loadPeriodos = async () => {
    const res = await fetch("/api/periodos");
    const periodos = await res.json();
    if (periodos.length > 0 && !periodoId) setPeriodoId(periodos[0].id);
    return periodos;
  };

  const loadData = async (pId: string) => {
    if (!pId) return;
    const res = await fetch(`/api/datos/impacto?periodoId=${pId}`);
    setData(await res.json());
  };

  useState(() => { loadPeriodos(); });

  const handleCreate = async () => {
    if (!periodoId || !form.montoTotal) return;
    await createImpacto({
      periodoId,
      montoTotal: parseFloat(form.montoTotal),
      moneda: form.moneda || "ARS",
      descripcion: form.descripcion || undefined,
    });
    setOpen(false);
    setForm({ montoTotal: "", moneda: "ARS", descripcion: "" });
    loadData(periodoId);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar este registro?")) {
      await deleteImpacto(id);
      loadData(periodoId);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Impacto Económico</h2>
      <div className="flex gap-4">
        <select className="rounded-md border px-3 py-2 text-sm" value={periodoId} onChange={(e) => { setPeriodoId(e.target.value); loadData(e.target.value); }}>
          <option value="">Seleccionar periodo</option>
        </select>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Registros</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button size="sm"><Plus className="mr-2 h-4 w-4" />Nuevo</Button>} />
            <DialogContent>
              <DialogHeader><DialogTitle>Nuevo impacto</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <Input type="number" placeholder="Monto total" value={form.montoTotal} onChange={(e) => setForm({ ...form, montoTotal: e.target.value })} />
                <Input placeholder="Moneda (ej: ARS)" value={form.moneda} onChange={(e) => setForm({ ...form, moneda: e.target.value })} />
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
                <TableHead>Periodo</TableHead>
                <TableHead>Monto total</TableHead>
                <TableHead>Moneda</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="w-[80px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Sin datos</TableCell></TableRow>
              ) : data.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-medium">{i.periodo?.nombre}</TableCell>
                  <TableCell>${i.montoTotal.toLocaleString("es-AR")}</TableCell>
                  <TableCell>{i.moneda}</TableCell>
                  <TableCell>{i.descripcion || "—"}</TableCell>
                  <TableCell><Button variant="ghost" size="icon" onClick={() => handleDelete(i.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}