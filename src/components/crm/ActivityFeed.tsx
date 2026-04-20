import { Card } from "@/components/ui/card";
import { CheckCircle2, UserPlus, FileText, Calendar, XCircle, Edit, Mail } from "lucide-react";

const activities = [
  { icon: CheckCircle2, color: "text-success bg-success/10", text: "Ana Ferreira fechou negócio com Acme Corp.", time: "há 10 minutos" },
  { icon: UserPlus, color: "text-primary bg-primary/10", text: "Novo contacto Carlos Mendes adicionado", time: "há 32 minutos" },
  { icon: FileText, color: "text-info bg-info/10", text: "Proposta enviada para TechVision Lda.", time: "há 1 hora" },
  { icon: Calendar, color: "text-warning bg-warning/10", text: "Reunião agendada com Nexus Solutions", time: "há 2 horas" },
  { icon: XCircle, color: "text-destructive bg-destructive/10", text: "Negócio com Global Media perdido", time: "há 3 horas" },
  { icon: Edit, color: "text-primary-glow bg-primary-glow/10", text: "Luísa Costa actualizou contacto Orbit SA", time: "há 4 horas" },
  { icon: Mail, color: "text-info bg-info/10", text: "Email enviado para Pedro Silva", time: "ontem 16:45" },
];

export const ActivityFeed = () => (
  <Card className="p-6 shadow-card">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="font-display font-bold text-lg">Actividade Recente</h3>
        <p className="text-sm text-muted-foreground">Últimas acções da equipa</p>
      </div>
      <button className="text-sm text-primary font-medium hover:underline">Ver tudo →</button>
    </div>
    <div className="space-y-4">
      {activities.map((a, i) => {
        const Icon = a.icon;
        return (
          <div key={i} className="flex items-start gap-3 group">
            <div className={`w-9 h-9 rounded-lg ${a.color} flex items-center justify-center shrink-0`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-sm leading-snug group-hover:text-primary transition-colors">{a.text}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  </Card>
);
