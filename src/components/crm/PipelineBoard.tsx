import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, Euro, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DndContext, DragEndEvent, DragOverlay, DragStartEvent,
  PointerSensor, useSensor, useSensors, closestCorners, useDroppable,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { useDeals, useDealMutations, useContacts } from "@/hooks/useCRM";
import type { Database } from "@/integrations/supabase/types";

type Stage = Database["public"]["Enums"]["deal_stage"];
type DealRow = ReturnType<typeof useDeals>["data"] extends (infer T)[] | undefined ? T : never;

const STAGES: { key: Stage; name: string; color: string; accent: string }[] = [
  { key: "lead", name: "Lead", color: "border-t-primary", accent: "text-primary" },
  { key: "qualified", name: "Qualificado", color: "border-t-primary-glow", accent: "text-primary-glow" },
  { key: "proposal", name: "Proposta", color: "border-t-info", accent: "text-info" },
  { key: "negotiation", name: "Negociação", color: "border-t-warning", accent: "text-warning" },
  { key: "won", name: "Ganho", color: "border-t-success", accent: "text-success" },
  { key: "lost", name: "Perdido", color: "border-t-destructive", accent: "text-destructive" },
];

const formatValue = (v: number) => v >= 1000 ? `€${(v / 1000).toFixed(0)}K` : `€${v}`;
const daysAgo = (iso: string) => Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000));

function DealCard({ deal, isOverlay = false, onDelete }: { deal: DealRow; isOverlay?: boolean; onDelete?: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: deal.id, data: { type: "deal", deal },
  });
  const style = { transform: CSS.Translate.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} className={cn(
      "bg-card p-3 rounded-lg shadow-sm border border-border/50 group",
      isDragging && !isOverlay && "opacity-30",
      isOverlay && "shadow-elegant rotate-2 cursor-grabbing"
    )}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="font-semibold text-sm leading-snug">{deal.title}</p>
        <button {...attributes} {...listeners} className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity touch-none" aria-label="Arrastar">
          <GripVertical className="w-4 h-4" />
        </button>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{deal.contacts?.full_name ?? "Sem contacto"}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-primary flex items-center gap-0.5">
          <Euro className="w-3 h-3" />{formatValue(Number(deal.value || 0)).replace("€", "")}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground">{daysAgo(deal.created_at)}d</span>
          {onDelete && (
            <button onClick={(e) => { e.stopPropagation(); onDelete(deal.id); }} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100">
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StageColumn({ stage, deals, onDelete }: { stage: typeof STAGES[number]; deals: DealRow[]; onDelete: (id: string) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.key, data: { type: "stage", stage } });
  const total = deals.reduce((sum, d) => sum + Number(d.value || 0), 0);
  return (
    <div ref={setNodeRef} className={cn(
      "bg-muted/50 rounded-xl p-3 border-t-4 transition-colors min-h-[200px]",
      stage.color, isOver && "bg-accent/60 ring-2 ring-primary/40"
    )}>
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-semibold text-sm">{stage.name}</h4>
        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-card", stage.accent)}>{deals.length}</span>
      </div>
      <p className="text-[10px] text-muted-foreground mb-3 font-medium">{formatValue(total)}</p>
      <SortableContext items={deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 min-h-[100px]">
          {deals.map((d) => <DealCard key={d.id} deal={d} onDelete={onDelete} />)}
        </div>
      </SortableContext>
    </div>
  );
}

export const PipelineBoard = () => {
  const { data: deals = [] } = useDeals();
  const { data: contacts = [] } = useContacts();
  const { create, update, remove } = useDealMutations();
  const [activeDeal, setActiveDeal] = useState<DealRow | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", value: 0, contact_id: "", stage: "lead" as Stage });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const total = deals.reduce((s, d) => s + Number(d.value || 0), 0);

  const handleDragStart = (e: DragStartEvent) => {
    const deal = deals.find((d) => d.id === e.active.id);
    if (deal) setActiveDeal(deal);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveDeal(null);
    const { active, over } = e;
    if (!over) return;
    const dealItem = deals.find((d) => d.id === active.id);
    if (!dealItem) return;
    const overData = over.data.current;
    let targetStage: Stage | undefined;
    if (overData?.type === "stage") targetStage = overData.stage.key;
    else if (overData?.type === "deal") targetStage = overData.deal.stage;
    if (targetStage && dealItem.stage !== targetStage) {
      update.mutate({ id: dealItem.id, stage: targetStage });
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await create.mutateAsync({
      title: form.title.trim(),
      value: form.value,
      contact_id: form.contact_id || null,
      stage: form.stage,
    });
    setForm({ title: "", value: 0, contact_id: "", stage: "lead" });
    setOpen(false);
  };

  return (
    <Card className="p-6 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="font-display font-bold text-lg">Pipeline de Vendas</h3>
          <p className="text-sm text-muted-foreground">
            Total no pipeline: <span className="font-semibold text-foreground">{formatValue(total)}</span> · {deals.length} negócios · arrasta entre colunas
          </p>
        </div>
        <Button size="sm" className="gradient-primary text-white" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4" />Novo Negócio
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {STAGES.map((s) => (
            <StageColumn key={s.key} stage={s} deals={deals.filter((d) => d.stage === s.key)} onDelete={(id) => remove.mutate(id)} />
          ))}
        </div>
        <DragOverlay>{activeDeal ? <DealCard deal={activeDeal} isOverlay /> : null}</DragOverlay>
      </DndContext>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Novo Negócio</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div><Label>Título *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={120} /></div>
            <div><Label>Valor (€)</Label><Input type="number" min={0} value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} /></div>
            <div>
              <Label>Contacto</Label>
              <Select value={form.contact_id} onValueChange={(v) => setForm({ ...form, contact_id: v })}>
                <SelectTrigger><SelectValue placeholder="Sem contacto" /></SelectTrigger>
                <SelectContent>
                  {contacts.map((c) => <SelectItem key={c.id} value={c.id}>{c.full_name}{c.company ? ` · ${c.company}` : ""}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Estágio</Label>
              <Select value={form.stage} onValueChange={(v) => setForm({ ...form, stage: v as Stage })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STAGES.map((s) => <SelectItem key={s.key} value={s.key}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" className="gradient-primary text-white" disabled={create.isPending}>Criar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
