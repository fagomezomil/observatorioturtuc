"use client";

import { useState } from "react";
import { DestinoPeriodoSelector } from "@/components/admin/destino-periodo-selector";
import { createPerfil, deletePerfil } from "@/lib/actions/datos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";

interface Perfil {
  id: string;
  destinoId: string;
  periodoId: string;
  porcentajePrimeraVez: number | null;
  encuestasRealizadas: number | null;
  porcentajeArgentinos: number | null;
  porcentajeExtranjeros: number | null;
  porcentajeVisitoAntes: number | null;
  porcentajeNoVisitoAntes: number | null;
  destino: { id: string; nombre: string };
}

export default function PerfilPage() {
  const [destinoId, setDestinoId] = useState("");
  const [periodoId, setPeriodoId] = useState("");
  const [data, setData] = useState<Perfil[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ porcentajePrimeraVez: "", encuestasRealizadas: "", porcentajeArgentinos: "", porcentajeExtranjeros: "", porcentajeVisitoAntes: "", porcentajeNoVisitoAntes: "" });

  const handleSelected = async (dId: string, pId: string) => {
    setDestinoId(dId);
    setPeriodoId(pId);
    const res = await fetch(`/api/datos/perfil?destinoId=${dId}&periodoId=${pId}`);
    setData(await res.json());
  };

  const handleCreate = async () => {
    await createPerfil({
      destinoId,
      periodoId,
      porcentajePrimeraVez: form.porcentajePrimeraVez ? parseFloat(form.porcentajePrimeraVez) : undefined,
      encuestasRealizadas: form.encuestasRealizadas ? parseInt(form.encuestasRealizadas) : undefined,
      porcentajeArgentinos: form.porcentajeArgentinos ? parseFloat(form.porcentajeArgentinos) : undefined,
      porcentajeExtranjeros: form.porcentajeExtranjeros ? parseFloat(form.porcentajeExtranjeros) : undefined,
      porcentajeVisitoAntes: form.porcentajeVisitoAntes ? parseFloat(form.porcentajeVisitoAntes) : undefined,
      porcentajeNoVisitoAntes: form.porcentajeNoVisitoAntes ? parseFloat(form.porcentajeNoVisitoAntes) : undefined,
    });
    setOpen(false);
    setForm({ porcentajePrimeraVez: "", encuestasRealizadas: "", porcentajeArgentinos: "", porcentajeExtranjeros: "", porcentajeVisitoAntes: "", porcentajeNoVisitoAntes: "" });
    handleSelected(destinoId, periodoId);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar este registro?")) {
      await deletePerfil(id);
      handleSelected(destinoId, periodoId);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Perfil del Turista</h2>
      <DestinoPeriodoSelector onSelected={handleSelected} />

      {destinoId && periodoId && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Registros</CardTitle>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger render={<Button size="sm"><Plus className="mr-2 h-4 w-4" />Nuevo</Button>} />
              <DialogContent>
                <DialogHeader><DialogTitle>Nuevo perfil</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <Input type="number" step="0.1" placeholder="% Primera vez" value={form.porcentajePrimeraVez} onChange={(e) => setForm({ ...form, porcentajePrimeraVez: e.target.value })} />
                  <Input type="number" placeholder="Encuestas realizadas" value={form.encuestasRealizadas} onChange={(e) => setForm({ ...form, encuestasRealizadas: e.target.value })} />
                  <Input type="number" step="0.1" placeholder="% Argentinos" value={form.porcentajeArgentinos} onChange={(e) => setForm({ ...form, porcentajeArgentinos: e.target.value })} />
                  <Input type="number" step="0.1" placeholder="% Extranjeros" value={form.porcentajeExtranjeros} onChange={(e) => setForm({ ...form, porcentajeExtranjeros: e.target.value })} />
                  <Input type="number" step="0.1" placeholder="% Ya visitó antes" value={form.porcentajeVisitoAntes} onChange={(e) => setForm({ ...form, porcentajeVisitoAntes: e.target.value })} />
                  <Input type="number" step="0.1" placeholder="% Primera vez (no visitó)" value={form.porcentajeNoVisitoAntes} onChange={(e) => setForm({ ...form, porcentajeNoVisitoAntes: e.target.value })} />
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
                  <TableHead>Primera vez %</TableHead>
                  <TableHead>Encuestas</TableHead>
                  <TableHead>Argentinos %</TableHead>
                  <TableHead>Extranjeros %</TableHead>
                  <TableHead>Visitó antes %</TableHead>
                  <TableHead>No visitó %</TableHead>
                  <TableHead className="w-[80px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground">Sin datos</TableCell></TableRow>
                ) : data.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.destino?.nombre}</TableCell>
                    <TableCell>{p.porcentajePrimeraVez ?? "—"}</TableCell>
                    <TableCell>{p.encuestasRealizadas ?? "—"}</TableCell>
                    <TableCell>{p.porcentajeArgentinos ?? "—"}</TableCell>
                    <TableCell>{p.porcentajeExtranjeros ?? "—"}</TableCell>
                    <TableCell>{p.porcentajeVisitoAntes ?? "—"}</TableCell>
                    <TableCell>{p.porcentajeNoVisitoAntes ?? "—"}</TableCell>
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