import { Card } from "@/components/ui/card";
import { TrendingUp, Briefcase, Euro, Users, Activity, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStats } from "@/hooks/useCRM";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  variant?: "primary" | "success" | "warm" | "info";
}

const variantClasses: Record<string, string> = {
  primary: "from-primary/10 to-primary-glow/10 text-primary",
  success: "from-success/10 to-success/5 text-success",
  warm: "from-orange-500/10 to-pink-500/10 text-orange-600",
  info: "from-info/10 to-info/5 text-info",
};

export const StatCard = ({ icon: Icon, label, value, variant = "primary" }: StatCardProps) => (
  <Card className="p-6 shadow-card hover:shadow-elegant transition-all hover:-translate-y-1 duration-300 border-border/50">
    <div className="flex items-start justify-between mb-4">
      <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center", variantClasses[variant])}>
        <Icon className="w-6 h-6" />
      </div>
      <TrendingUp className="w-4 h-4 text-success" />
    </div>
    <p className="text-sm text-muted-foreground mb-1">{label}</p>
    <p className="font-display text-3xl font-bold">{value}</p>
  </Card>
);

const formatValue = (v: number) => v >= 1000 ? `€${(v / 1000).toFixed(1)}K` : `€${v}`;

export const StatsGrid = () => {
  const { data } = useStats();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={Briefcase} label="Negócios Activos" value={String(data?.activeDeals ?? 0)} variant="primary" />
      <StatCard icon={Euro} label="Valor no Pipeline" value={formatValue(data?.pipelineValue ?? 0)} variant="success" />
      <StatCard icon={Users} label="Total Contactos" value={String(data?.contactsCount ?? 0)} variant="info" />
      <StatCard icon={Activity} label="Taxa de Conversão" value={`${data?.conversionRate ?? 0}%`} variant="warm" />
    </div>
  );
};
