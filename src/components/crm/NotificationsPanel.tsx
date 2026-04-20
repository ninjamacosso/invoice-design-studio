import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CheckCircle2, Clock, Mail, UserPlus } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const notifications = [
  { icon: CheckCircle2, color: "text-success bg-success/10", title: "Negócio fechado!", desc: "Acme Corp. — $120K", time: "há 10 min" },
  { icon: Clock, color: "text-warning bg-warning/10", title: "Reunião com TechVision em 30 min", desc: "Sala virtual", time: "há 20 min" },
  { icon: Mail, color: "text-info bg-info/10", title: "Pedro Silva respondeu ao email", desc: "Re: Proposta comercial", time: "há 1 hora" },
  { icon: UserPlus, color: "text-primary bg-primary/10", title: "Novo lead: Maria Santos", desc: "Origem: Website", time: "há 2 horas" },
];

export const NotificationsPanel = ({ open, onOpenChange }: Props) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent className="w-full sm:max-w-md">
      <SheetHeader className="mb-6">
        <div className="flex items-center justify-between">
          <SheetTitle className="font-display text-xl">Notificações</SheetTitle>
          <button className="text-xs text-primary font-medium hover:underline">Marcar todas</button>
        </div>
      </SheetHeader>
      <div className="space-y-3">
        {notifications.map((n, i) => {
          const Icon = n.icon;
          return (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-accent/40 transition-colors cursor-pointer">
              <div className={`w-9 h-9 rounded-lg ${n.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </SheetContent>
  </Sheet>
);
