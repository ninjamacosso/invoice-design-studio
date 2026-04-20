import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Area, AreaChart } from "recharts";

const data = [
  { month: "Jan", revenue: 1200 },
  { month: "Fev", revenue: 1500 },
  { month: "Mar", revenue: 1350 },
  { month: "Abr", revenue: 1800 },
  { month: "Mai", revenue: 2100 },
  { month: "Jun", revenue: 1950 },
  { month: "Jul", revenue: 2400 },
  { month: "Ago", revenue: 2200 },
  { month: "Set", revenue: 2700 },
  { month: "Out", revenue: 2900 },
  { month: "Nov", revenue: 3100 },
  { month: "Dez", revenue: 3400 },
];

export const RevenueChart = () => (
  <Card className="p-6 lg:col-span-2 shadow-card">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="font-display font-bold text-lg">Receita Mensal</h3>
        <p className="text-sm text-muted-foreground">Evolução de receita ao longo do ano</p>
      </div>
      <button className="text-sm text-primary font-medium hover:underline">Ver tudo →</button>
    </div>
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}K`} />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.5rem",
            fontSize: "12px",
          }}
          formatter={(v: number) => [`$${v}K`, "Receita"]}
        />
        <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#rev)" />
      </AreaChart>
    </ResponsiveContainer>
  </Card>
);

const phases = [
  { label: "Prospecção", value: "$840K", pct: 100, color: "bg-primary" },
  { label: "Qualificação", value: "$620K", pct: 74, color: "bg-primary-glow" },
  { label: "Proposta", value: "$430K", pct: 51, color: "bg-info" },
  { label: "Negociação", value: "$280K", pct: 33, color: "bg-warning" },
  { label: "Fecho", value: "$120K", pct: 14, color: "bg-success" },
];

export const PipelineChart = () => (
  <Card className="p-6 shadow-card">
    <h3 className="font-display font-bold text-lg mb-1">Pipeline por Fase</h3>
    <p className="text-sm text-muted-foreground mb-6">Distribuição de oportunidades</p>
    <div className="space-y-4">
      {phases.map((p) => (
        <div key={p.label}>
          <div className="flex items-center justify-between mb-1.5 text-sm">
            <span className="font-medium">{p.label}</span>
            <span className="text-muted-foreground font-semibold">{p.value}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className={`h-full ${p.color} rounded-full transition-all`} style={{ width: `${p.pct}%` }} />
          </div>
        </div>
      ))}
    </div>
  </Card>
);
