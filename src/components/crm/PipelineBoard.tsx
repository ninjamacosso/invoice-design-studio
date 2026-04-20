import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const stages = [
  { name: "Prospecção", color: "border-t-primary", deals: [
    { title: "Acme Corp.", value: "$120K", contact: "Maria Santos", days: 3 },
    { title: "TechVision", value: "$45K", contact: "Carlos M.", days: 5 },
    { title: "Delta Group", value: "$15K", contact: "Inês Costa", days: 1 },
  ]},
  { name: "Qualificação", color: "border-t-primary-glow", deals: [
    { title: "Nexus Solutions", value: "$28K", contact: "Pedro Silva", days: 7 },
    { title: "Vertex Inc.", value: "$92K", contact: "Hugo Rocha", days: 12 },
  ]},
  { name: "Proposta", color: "border-t-info", deals: [
    { title: "Orbit SA", value: "$210K", contact: "Sofia A.", days: 14 },
    { title: "Quantum Labs", value: "$78K", contact: "Tiago F.", days: 9 },
  ]},
  { name: "Negociação", color: "border-t-warning", deals: [
    { title: "Global Media", value: "$67K", contact: "Ricardo L.", days: 21 },
  ]},
  { name: "Fecho", color: "border-t-success", deals: [
    { title: "Stellar Co.", value: "$155K", contact: "Beatriz N.", days: 28 },
  ]},
];

export const PipelineBoard = () => (
  <Card className="p-6 shadow-card">
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div>
        <h3 className="font-display font-bold text-lg">Pipeline de Vendas</h3>
        <p className="text-sm text-muted-foreground">Total no pipeline: <span className="font-semibold text-foreground">$2.29M</span> · 34 negócios activos</p>
      </div>
      <Button size="sm" className="gradient-primary text-white"><Plus className="w-4 h-4" />Novo Negócio</Button>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {stages.map((s) => (
        <div key={s.name} className={`bg-muted/50 rounded-xl p-3 border-t-4 ${s.color}`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm">{s.name}</h4>
            <span className="text-xs text-muted-foreground">{s.deals.length}</span>
          </div>
          <div className="space-y-2">
            {s.deals.map((d, i) => (
              <div key={i} className="bg-card p-3 rounded-lg shadow-sm hover:shadow-md transition-all cursor-grab border border-border/50">
                <p className="font-semibold text-sm mb-1">{d.title}</p>
                <p className="text-xs text-muted-foreground mb-2">{d.contact}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">{d.value}</span>
                  <span className="text-[10px] text-muted-foreground">{d.days}d</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </Card>
);
