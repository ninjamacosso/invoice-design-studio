import { LayoutDashboard, Users, GitBranch, CheckSquare, BarChart3, Settings, HelpCircle, Sparkles, Bot, LogOut, Share2, Inbox, Wand2, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  active: string;
  onChange: (key: string) => void;
}

const mainItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "contacts", label: "Contactos", icon: Users, badge: "248" },
  { key: "pipeline", label: "Pipeline", icon: GitBranch },
  { key: "inbox", label: "Inbox", icon: Inbox, badge: "12" },
  { key: "social", label: "Social Manager", icon: Share2 },
  { key: "creative", label: "Creative Studio", icon: Wand2 },
  { key: "bulk", label: "Bulk Messaging", icon: Megaphone },
  { key: "outreach", label: "Outreach IA", icon: Bot, badge: "3" },
  { key: "tasks", label: "Tarefas", icon: CheckSquare, badge: "5" },
  { key: "reports", label: "Relatórios", icon: BarChart3 },
];

const settingsItems = [
  { key: "settings", label: "Definições", icon: Settings },
  { key: "help", label: "Ajuda", icon: HelpCircle },
];

export const Sidebar = ({ active, onChange }: SidebarProps) => {
  const { profile, roles, signOut } = useAuth();
  const initials = (profile?.full_name || profile?.email || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const roleLabel = roles.includes("admin") ? "Administrador" : roles.includes("manager") ? "Gestor" : "Agente";

  return (
    <aside className="hidden lg:flex w-64 flex-col gradient-sidebar text-sidebar-foreground h-screen sticky top-0 border-r border-sidebar-border">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-white">NexCRM</h1>
            <p className="text-xs text-sidebar-foreground/60">Gestão de Clientes</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
        <div>
          <p className="px-3 text-[10px] uppercase tracking-widest text-sidebar-foreground/50 font-semibold mb-2">Principal</p>
          <ul className="space-y-1">
            {mainItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.key;
              return (
                <li key={item.key}>
                  <button
                    onClick={() => onChange(item.key)}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        isActive ? "bg-white/20 text-white" : "bg-sidebar-accent text-sidebar-foreground"
                      )}>{item.badge}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="px-3 text-[10px] uppercase tracking-widest text-sidebar-foreground/50 font-semibold mb-2">Configurações</p>
          <ul className="space-y-1">
            {settingsItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.key}>
                  <button
                    onClick={() => onChange(item.key)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white transition-all"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">{initials}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{profile?.full_name || "Utilizador"}</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">{roleLabel}</p>
          </div>
          <button
            onClick={signOut}
            title="Sair"
            className="p-2 rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
