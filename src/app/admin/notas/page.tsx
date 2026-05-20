"use client";

import { useState } from "react";
import { createNota, deleteNota } from "@/lib/actions/datos";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";

interface Nota {
  id: string;
  contenido: string;
  periodo: { nombre: string };
}

export default function NotasPage() {
  const [data, setData] = useState<Nota[]>([]);
  const [periodoId, setPeriodoId] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ contenido: "" });

  const loadData = async (pId: string) => {
    if (!pId) return;
    const res = await fetch(`/api/datos/notas?periodoId=${pId}`);
    setData(await res.json());
  };

  const handleCreate = async () => {
    if (!periodoId || !form.contenido.trim()) return;
    await createNota({ periodoId, contenido: form.contenido.trim() });
    setOpen(false);
    setForm({ contenido: "" });
    loadData(periodoId);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar esta nota?")) {
      await deleteNota(id);
      loadData(periodoId);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Notas Metodológicas</h2>
      <div className="flex gap-4">
        <select className="rounded-md border px-3 py-2 text-sm" value={periodoId} onChange={(e) => { setPeriodoId(e.target.value); loadData(e.target.value); }}>
          <option value="">Seleccionar periodo</option>
        </select>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Registros</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button size="sm"><Plus className="mr-2 h-4 w-4" />Nueva nota</Button>} />
            <DialogContent>
              <DialogHeader><DialogTitle>Nueva nota metodológica</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <textarea className="flex min-h-[100px] w-full rounded-md border px-3 py-2 text-sm" placeholder="Contenido de la nota" value={form.contenido} onChange={(e) => setForm({ ...form, contenido: e.target.value })} />
                <Button onClick={handleCreate} className="w-full">Guardar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contenido</TableHead>
                <TableHead className="w-[80px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground">Sin datos</TableCell></TableRow>
              ) : data.map((n) => (
                <TableRow key={n.id}>
                  <TableCell className="max-w-md truncate">{n.contenido}</TableCell>
                  <TableCell><Button variant="ghost" size="icon" onClick={() => handleDelete(n.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}