import { Search, Bell, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TopbarProps {
  title: string;
  onNewContact: () => void;
  onToggleNotifications: () => void;
  notificationCount: number;
}

export const Topbar = ({ title, onNewContact, onToggleNotifications, notificationCount }: TopbarProps) => {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-8 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="w-5 h-5" />
          </Button>
          <h2 className="font-display text-2xl sm:text-3xl font-bold">{title}</h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Pesquisar contactos, negócios..." className="pl-10 w-64 lg:w-80 bg-card" />
          </div>

          <Button variant="outline" size="icon" className="relative" onClick={onToggleNotifications}>
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </Button>

          <Button onClick={onNewContact} className="gradient-primary text-white shadow-elegant hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Contacto</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
