import { Card } from "@/components/ui/card";

const sellers = [
  { name: "João Martins", initials: "JM", value: "$640K", pct: 100, color: "bg-primary" },
  { name: "Ana Ferreira", initials: "AF", value: "$520K", pct: 81, color: "bg-primary-glow" },
  { name: "Carlos Mendes", initials: "CM", value: "$380K", pct: 59, color: "bg-info" },
  { name: "Luísa Costa", initials: "LC", value: "$210K", pct: 33, color: "bg-success" },
];

const sources = [
  { icon: "🌐", label: "Website", pct: 38 },
  { icon: "📧", label: "Email", pct: 24 },
  { icon: "🤝", label: "Referência", pct: 19 },
  { icon: "📱", label: "Redes Sociais", pct: 12 },
  { icon: "📣", label: "Publicidade", pct: 7 },
];

const kpis = [
  { label: "Negócios Fechados", value: "47", sub: "este trimestre" },
  { label: "Tempo Médio de Fecho", value: "18d", sub: "média do ciclo" },
  { label: "Valor Médio / Negócio", value: "$51K", sub: "+12% vs Q1" },
  { label: "Taxa de Ganho", value: "34%", sub: "do total de oportunidades" },
];

export const ReportsSection = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <Card className="p-6 shadow-card">
      <h3 className="font-display font-bold text-lg mb-1">KPIs Principais</h3>
      <p className="text-sm text-muted-foreground mb-5">Indicadores-chave do negócio</p>
      <div className="grid grid-cols-2 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary-glow/5 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">{k.label}</p>
            <p className="font-display text-2xl font-bold text-gradient">{k.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{k.sub}</p>
          </div>
        ))}
      </div>
    </Card>

    <Card className="p-6 shadow-card">
      <h3 className="font-display font-bold text-lg mb-1">Performance por Vendedor</h3>
      <p className="text-sm text-muted-foreground mb-5">Receita gerada por membro</p>
      <div className="space-y-4">
        {sellers.map((s) => (
          <div key={s.name}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full ${s.color} text-white text-xs font-bold flex items-center justify-center`}>{s.initials}</div>
                <span className="text-sm font-medium">{s.name}</span>
              </div>
              <span className="text-sm font-semibold">{s.value}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>

    <Card className="p-6 shadow-card">
      <h3 className="font-display font-bold text-lg mb-1">Fontes de Lead</h3>
      <p className="text-sm text-muted-foreground mb-5">Origem dos contactos novos</p>
      <div className="space-y-3">
        {sources.map((s) => (
          <div key={s.label} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">{s.icon}</div>
            <div className="flex-1">
              <p className="text-sm font-medium">{s.label}</p>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                <div className="h-full gradient-primary rounded-full" style={{ width: `${s.pct * 2.5}%` }} />
              </div>
            </div>
            <span className="text-sm font-bold text-primary">{s.pct}%</span>
          </div>
        ))}
      </div>
    </Card>
  </div>
);
