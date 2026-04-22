import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Calendar as CalIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTasks, useTaskMutations, useContacts, useDeals } from "@/hooks/useCRM";
import type { Database } from "@/integrations/supabase/types";

type Priority = Database["public"]["Enums"]["task_priority"];
type Status = Database["public"]["Enums"]["task_status"];

const priorityColors: Record<Priority, string> = {
  urgent: "bg-destructive/15 text-destructive",
  high: "bg-destructive/15 text-destructive",
  medium: "bg-warning/15 text-warning",
  low: "bg-info/15 text-info",
};

const priorityLabel: Record<Priority, string> = { urgent: "Urgente", high: "Alta", medium: "Média", low: "Baixa" };

const formatDue = (iso: string | null) => {
  if (!iso) return "Sem prazo";
  const d = new Date(iso);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dd = new Date(d); dd.setHours(0, 0, 0, 0);
  const diff = (dd.getTime() - today.getTime()) / 86400000;
  if (diff === 0) return `Hoje ${d.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}`;
  if (diff === 1) return "Amanhã";
  if (diff < 0) return `Atrasada (${Math.abs(diff)}d)`;
  return d.toLocaleDateString("pt-PT", { day: "2-digit", month: "short" });
};

export const TasksSection = () => {
  const { data: tasks = [] } = useTasks();
  const { data: contacts = [] } = useContacts();
  const { data: deals = [] } = useDeals();
  const { create, update, remove } = useTaskMutations();
  const [tab, setTab] = useState<"todo" | "today" | "done">("todo");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", priority: "medium" as Priority, due_date: "", contact_id: "", deal_id: "" });

  const filtered = tasks.filter((t) => {
    if (tab === "done") return t.status === "done";
    if (tab === "today") {
      if (!t.due_date) return false;
      const d = new Date(t.due_date); const today = new Date();
      return d.toDateString() === today.toDateString() && t.status !== "done";
    }
    return t.status !== "done";
  });

  const toggle = (id: string, current: Status) => {
    update.mutate({ id, status: current === "done" ? "todo" : "done" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await create.mutateAsync({
      title: form.title.trim(),
      priority: form.priority,
      due_date: form.due_date || null,
      contact_id: form.contact_id || null,
      deal_id: form.deal_id || null,
    });
    setForm({ title: "", priority: "medium", due_date: "", contact_id: "", deal_id: "" });
    setOpen(false);
  };

  const upcoming = tasks.filter(t => t.status !== "done" && t.due_date).slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="p-6 shadow-card lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            {([
              { k: "todo", l: "Pendentes" },
              { k: "today", l: "Hoje" },
              { k: "done", l: "Concluídas" },
            ] as const).map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  tab === t.k ? "gradient-primary text-white shadow-md" : "bg-muted text-muted-foreground hover:bg-accent"
                )}
              >{t.l}</button>
            ))}
          </div>
          <Button size="sm" className="gradient-primary text-white" onClick={() => setOpen(true)}><Plus className="w-4 h-4" />Nova Tarefa</Button>
        </div>

        <div className="space-y-2">
          {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Sem tarefas nesta categoria.</p>}
          {filtered.map((t) => (
            <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-accent/40 transition-colors group">
              <Checkbox checked={t.status === "done"} onCheckedChange={() => toggle(t.id, t.status)} />
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-medium", t.status === "done" && "line-through text-muted-foreground")}>{t.title}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  <CalIcon className="w-3 h-3" /> {formatDue(t.due_date)}
                  {t.contacts?.full_name && <span>· {t.contacts.full_name}</span>}
                  {t.deals?.title && <span>· {t.deals.title}</span>}
                </p>
              </div>
              <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full", priorityColors[t.priority])}>{priorityLabel[t.priority]}</span>
              <button onClick={() => remove.mutate(t.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 shadow-card">
        <h3 className="font-display font-bold text-lg mb-1">Próximas tarefas</h3>
        <p className="text-sm text-muted-foreground mb-5">Com prazo definido</p>
        <div className="space-y-3">
          {upcoming.length === 0 && <p className="text-xs text-muted-foreground">Sem prazos agendados.</p>}
          {upcoming.map((t) => {
            const d = t.due_date ? new Date(t.due_date) : null;
            return (
              <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-transparent border border-border/50">
                <div className="w-12 h-12 rounded-lg gradient-primary text-white flex flex-col items-center justify-center shrink-0">
                  <span className="font-display font-bold text-sm leading-none">{d?.getDate().toString().padStart(2, "0")}</span>
                  <span className="text-[9px] font-semibold opacity-90 mt-0.5 uppercase">{d?.toLocaleDateString("pt-PT", { month: "short" }).slice(0, 3)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{formatDue(t.due_date)}{t.contacts?.full_name ? ` · ${t.contacts.full_name}` : ""}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nova Tarefa</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div><Label>Título *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={200} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Prioridade</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as Priority })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Prazo</Label><Input type="datetime-local" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></div>
            </div>
            <div>
              <Label>Contacto</Label>
              <Select value={form.contact_id} onValueChange={(v) => setForm({ ...form, contact_id: v })}>
                <SelectTrigger><SelectValue placeholder="Sem contacto" /></SelectTrigger>
                <SelectContent>{contacts.map((c) => <SelectItem key={c.id} value={c.id}>{c.full_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Negócio</Label>
              <Select value={form.deal_id} onValueChange={(v) => setForm({ ...form, deal_id: v })}>
                <SelectTrigger><SelectValue placeholder="Sem negócio" /></SelectTrigger>
                <SelectContent>{deals.map((d) => <SelectItem key={d.id} value={d.id}>{d.title}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" className="gradient-primary text-white" disabled={create.isPending}>Criar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
