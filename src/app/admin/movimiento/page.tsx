"use client";

import { useState } from "react";
import { DestinoPeriodoSelector } from "@/components/admin/destino-periodo-selector";
import { createMovimiento, deleteMovimiento } from "@/lib/actions/datos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface Movimiento {
  id: string;
  cantidadTuristas: number | null;
  pernoctes: number | null;
  tipo: string;
  destino: { nombre: string };
}

export default function MovimientoPage() {
  const [destinoId, setDestinoId] = useState("");
  const [periodoId, setPeriodoId] = useState("");
  const [data, setData] = useState<Movimiento[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ cantidadTuristas: "", pernoctes: "", tipo: "turista" });

  const handleSelected = async (dId: string, pId: string) => {
    setDestinoId(dId);
    setPeriodoId(pId);
    const res = await fetch(`/api/datos/movimiento?destinoId=${dId}&periodoId=${pId}`);
    setData(await res.json());
  };

  const handleCreate = async () => {
    await createMovimiento({
      destinoId,
      periodoId,
      cantidadTuristas: form.cantidadTuristas ? parseInt(form.cantidadTuristas) : undefined,
      pernoctes: form.pernoctes ? parseInt(form.pernoctes) : undefined,
      tipo: form.tipo,
    });
    setOpen(false);
    setForm({ cantidadTuristas: "", pernoctes: "", tipo: "turista" });
    handleSelected(destinoId, periodoId);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar este registro?")) {
      await deleteMovimiento(id);
      handleSelected(destinoId, periodoId);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Movimiento de Turistas</h2>
      <DestinoPeriodoSelector onSelected={handleSelected} />

      {destinoId && periodoId && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Registros</CardTitle>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger render={<Button size="sm"><Plus className="mr-2 h-4 w-4" />Nuevo</Button>} />
              <DialogContent>
                <DialogHeader><DialogTitle>Nuevo movimiento</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v ?? "turista" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="turista">Turista</SelectItem>
                      <SelectItem value="excursionista">Excursionista</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="number" placeholder="Cantidad de turistas" value={form.cantidadTuristas} onChange={(e) => setForm({ ...form, cantidadTuristas: e.target.value })} />
                  <Input type="number" placeholder="Pernoctes" value={form.pernoctes} onChange={(e) => setForm({ ...form, pernoctes: e.target.value })} />
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
                  <TableHead>Tipo</TableHead>
                  <TableHead>Turistas</TableHead>
                  <TableHead>Pernoctes</TableHead>
                  <TableHead className="w-[80px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Sin datos</TableCell></TableRow>
                ) : data.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.destino?.nombre}</TableCell>
                    <TableCell>{m.tipo}</TableCell>
                    <TableCell>{m.cantidadTuristas?.toLocaleString("es-AR") ?? "—"}</TableCell>
                    <TableCell>{m.pernoctes?.toLocaleString("es-AR") ?? "—"}</TableCell>
                    <TableCell><Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
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