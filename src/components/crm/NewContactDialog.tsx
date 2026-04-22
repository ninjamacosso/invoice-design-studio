import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useContactMutations } from "@/hooks/useCRM";
import type { Database } from "@/integrations/supabase/types";

type ContactStatus = Database["public"]["Enums"]["contact_status"];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export const NewContactDialog = ({ open, onOpenChange }: Props) => {
  const { create } = useContactMutations();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    company: "",
    job_title: "",
    status: "lead" as ContactStatus,
    notes: "",
  });

  const reset = () => setForm({ full_name: "", email: "", phone: "", company: "", job_title: "", status: "lead", notes: "" });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim()) return;
    await create.mutateAsync({
      full_name: form.full_name.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      company: form.company.trim() || null,
      job_title: form.job_title.trim() || null,
      status: form.status,
      notes: form.notes.trim() || null,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Novo Contacto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2"><Label>Nome completo *</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="João Silva" required maxLength={120} /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@empresa.com" maxLength={255} /></div>
            <div className="space-y-2"><Label>Telefone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+351 912 345 678" maxLength={32} /></div>
            <div className="space-y-2"><Label>Empresa</Label><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Acme Corp." maxLength={120} /></div>
            <div className="space-y-2"><Label>Cargo</Label><Input value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} placeholder="Director Comercial" maxLength={120} /></div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Estado</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as ContactStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="active">Prospect ativo</SelectItem>
                  <SelectItem value="customer">Cliente</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2"><Label>Notas</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Detalhes adicionais sobre o contacto..." rows={3} maxLength={1000} /></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="gradient-primary text-white" disabled={create.isPending}>
              {create.isPending ? "A guardar..." : "Guardar Contacto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
