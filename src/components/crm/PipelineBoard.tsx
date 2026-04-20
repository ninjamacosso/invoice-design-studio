import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, DollarSign } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type Deal = {
  id: string;
  title: string;
  value: number;
  contact: string;
  days: number;
  stage: string;
};

type Stage = {
  key: string;
  name: string;
  color: string;
  accent: string;
};

const STAGES: Stage[] = [
  { key: "prospect", name: "Prospecção", color: "border-t-primary", accent: "text-primary" },
  { key: "qualify", name: "Qualificação", color: "border-t-primary-glow", accent: "text-primary-glow" },
  { key: "proposal", name: "Proposta", color: "border-t-info", accent: "text-info" },
  { key: "negotiate", name: "Negociação", color: "border-t-warning", accent: "text-warning" },
  { key: "close", name: "Fecho", color: "border-t-success", accent: "text-success" },
];

const INITIAL_DEALS: Deal[] = [
  { id: "d1", title: "Acme Corp.", value: 120000, contact: "Maria Santos", days: 3, stage: "prospect" },
  { id: "d2", title: "TechVision", value: 45000, contact: "Carlos M.", days: 5, stage: "prospect" },
  { id: "d3", title: "Delta Group", value: 15000, contact: "Inês Costa", days: 1, stage: "prospect" },
  { id: "d4", title: "Nexus Solutions", value: 28000, contact: "Pedro Silva", days: 7, stage: "qualify" },
  { id: "d5", title: "Vertex Inc.", value: 92000, contact: "Hugo Rocha", days: 12, stage: "qualify" },
  { id: "d6", title: "Orbit SA", value: 210000, contact: "Sofia A.", days: 14, stage: "proposal" },
  { id: "d7", title: "Quantum Labs", value: 78000, contact: "Tiago F.", days: 9, stage: "proposal" },
  { id: "d8", title: "Global Media", value: 67000, contact: "Ricardo L.", days: 21, stage: "negotiate" },
  { id: "d9", title: "Stellar Co.", value: 155000, contact: "Beatriz N.", days: 28, stage: "close" },
];

const formatValue = (v: number) => v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`;

function DealCard({ deal, isOverlay = false }: { deal: Deal; isOverlay?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: deal.id,
    data: { type: "deal", deal },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-card p-3 rounded-lg shadow-sm border border-border/50 group",
        isDragging && !isOverlay && "opacity-30",
        isOverlay && "shadow-elegant rotate-2 cursor-grabbing"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="font-semibold text-sm leading-snug">{deal.title}</p>
        <button
          {...attributes}
          {...listeners}
          className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity touch-none"
          aria-label="Arrastar"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{deal.contact}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-primary flex items-center gap-0.5">
          <DollarSign className="w-3 h-3" />{formatValue(deal.value).replace("$", "")}
        </span>
        <span className="text-[10px] text-muted-foreground">{deal.days}d</span>
      </div>
    </div>
  );
}

function StageColumn({ stage, deals }: { stage: Stage; deals: Deal[] }) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.key,
    data: { type: "stage", stage },
  });

  const total = deals.reduce((sum, d) => sum + d.value, 0);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "bg-muted/50 rounded-xl p-3 border-t-4 transition-colors min-h-[200px]",
        stage.color,
        isOver && "bg-accent/60 ring-2 ring-primary/40"
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-semibold text-sm">{stage.name}</h4>
        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-card", stage.accent)}>
          {deals.length}
        </span>
      </div>
      <p className="text-[10px] text-muted-foreground mb-3 font-medium">{formatValue(total)}</p>

      <SortableContext items={deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 min-h-[100px]">
          {deals.map((d) => <DealCard key={d.id} deal={d} />)}
        </div>
      </SortableContext>
    </div>
  );
}

export const PipelineBoard = () => {
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const total = deals.reduce((s, d) => s + d.value, 0);

  const handleDragStart = (e: DragStartEvent) => {
    const deal = deals.find((d) => d.id === e.active.id);
    if (deal) setActiveDeal(deal);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveDeal(null);
    const { active, over } = e;
    if (!over) return;

    const activeDealItem = deals.find((d) => d.id === active.id);
    if (!activeDealItem) return;

    const overData = over.data.current;
    let targetStage: string | undefined;

    if (overData?.type === "stage") {
      targetStage = overData.stage.key;
    } else if (overData?.type === "deal") {
      targetStage = overData.deal.stage;
    }

    if (!targetStage) return;

    if (activeDealItem.stage !== targetStage) {
      const stageName = STAGES.find((s) => s.key === targetStage)?.name;
      setDeals((prev) =>
        prev.map((d) => (d.id === active.id ? { ...d, stage: targetStage! } : d))
      );
      toast({
        title: "Negócio movido",
        description: `${activeDealItem.title} → ${stageName}`,
      });
    } else if (active.id !== over.id) {
      // reorder within same column
      const stageDeals = deals.filter((d) => d.stage === targetStage);
      const oldIdx = stageDeals.findIndex((d) => d.id === active.id);
      const newIdx = stageDeals.findIndex((d) => d.id === over.id);
      if (oldIdx !== -1 && newIdx !== -1) {
        const reordered = arrayMove(stageDeals, oldIdx, newIdx);
        const others = deals.filter((d) => d.stage !== targetStage);
        setDeals([...others, ...reordered]);
      }
    }
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
        <Button size="sm" className="gradient-primary text-white">
          <Plus className="w-4 h-4" />Novo Negócio
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {STAGES.map((s) => (
            <StageColumn key={s.key} stage={s} deals={deals.filter((d) => d.stage === s.key)} />
          ))}
        </div>

        <DragOverlay>
          {activeDeal ? <DealCard deal={activeDeal} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </Card>
  );
};
