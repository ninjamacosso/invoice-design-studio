import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Briefcase, DollarSign, Users, Activity, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  variant?: "primary" | "success" | "warm" | "info";
}

const variantClasses: Record<string, string> = {
  primary: "from-primary/10 to-primary-glow/10 text-primary",
  success: "from-success/10 to-success/5 text-success",
  warm: "from-orange-500/10 to-pink-500/10 text-orange-600",
  info: "from-info/10 to-info/5 text-info",
};

export const StatCard = ({ icon: Icon, label, value, change, trend, variant = "primary" }: StatCardProps) => {
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  return (
    <Card className="p-6 shadow-card hover:shadow-elegant transition-all hover:-translate-y-1 duration-300 border-border/50">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center", variantClasses[variant])}>
          <Icon className="w-6 h-6" />
        </div>
        <span className={cn(
          "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
          trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
        )}>
          <TrendIcon className="w-3 h-3" />
          {change}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="font-display text-3xl font-bold">{value}</p>
    </Card>
  );
};

export const StatsGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard icon={Briefcase} label="Negócios Activos" value="124" change="12%" trend="up" variant="primary" />
    <StatCard icon={DollarSign} label="Receita Prevista" value="$2.4M" change="8.3%" trend="up" variant="success" />
    <StatCard icon={Users} label="Total Contactos" value="248" change="24 novos" trend="up" variant="info" />
    <StatCard icon={Activity} label="Taxa de Conversão" value="34%" change="2.1%" trend="down" variant="warm" />
  </div>
);
