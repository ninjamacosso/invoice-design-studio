import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Calendar as CalIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const initialTasks = [
  { id: 1, title: "Ligar a Maria Santos – Acme Corp.", priority: "Alta", due: "Hoje 14:00", done: false },
  { id: 2, title: "Enviar proposta a TechVision", priority: "Alta", due: "Hoje 17:00", done: false },
  { id: 3, title: "Preparar demo Orbit SA", priority: "Média", due: "Amanhã", done: false },
  { id: 4, title: "Follow-up email Pedro Silva", priority: "Baixa", due: "23 Abr", done: false },
  { id: 5, title: "Reunião interna de pipeline", priority: "Média", due: "25 Abr", done: true },
];

const priorityColors: Record<string, string> = {
  Alta: "bg-destructive/15 text-destructive",
  Média: "bg-warning/15 text-warning",
  Baixa: "bg-info/15 text-info",
};

const meetings = [
  { day: "21", month: "ABR", title: "Reunião Acme Corp.", time: "10:00 – João Martins" },
  { day: "23", month: "ABR", title: "Demo TechVision", time: "14:30 – Ana Ferreira" },
  { day: "28", month: "ABR", title: "Follow-up Orbit SA", time: "09:00 – Carlos Mendes" },
];

export const TasksSection = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [tab, setTab] = useState<"Pendentes" | "Hoje" | "Concluídas">("Pendentes");

  const filtered = tasks.filter((t) => {
    if (tab === "Concluídas") return t.done;
    if (tab === "Hoje") return t.due.includes("Hoje");
    return !t.done;
  });

  const toggle = (id: number) => setTasks(tasks.map((t) => t.id === id ? { ...t, done: !t.done } : t));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="p-6 shadow-card lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            {(["Pendentes", "Hoje", "Concluídas"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  tab === t ? "gradient-primary text-white shadow-md" : "bg-muted text-muted-foreground hover:bg-accent"
                )}
              >{t}</button>
            ))}
          </div>
          <Button size="sm" className="gradient-primary text-white"><Plus className="w-4 h-4" />Nova Tarefa</Button>
        </div>

        <div className="space-y-2">
          {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Sem tarefas nesta categoria.</p>}
          {filtered.map((t) => (
            <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-accent/40 transition-colors">
              <Checkbox checked={t.done} onCheckedChange={() => toggle(t.id)} />
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-medium", t.done && "line-through text-muted-foreground")}>{t.title}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <CalIcon className="w-3 h-3" /> {t.due}
                </p>
              </div>
              <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full", priorityColors[t.priority])}>{t.priority}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 shadow-card">
        <h3 className="font-display font-bold text-lg mb-1">Próximas Reuniões</h3>
        <p className="text-sm text-muted-foreground mb-5">Agenda Abril 2026</p>
        <div className="space-y-3">
          {meetings.map((m, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-transparent border border-border/50">
              <div className="w-12 h-12 rounded-lg gradient-primary text-white flex flex-col items-center justify-center shrink-0">
                <span className="font-display font-bold text-sm leading-none">{m.day}</span>
                <span className="text-[9px] font-semibold opacity-90 mt-0.5">{m.month}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{m.title}</p>
                <p className="text-xs text-muted-foreground">{m.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
