import { useState } from "react";
import { Sidebar } from "@/components/crm/Sidebar";
import { Topbar } from "@/components/crm/Topbar";
import { StatsGrid } from "@/components/crm/StatsGrid";
import { RevenueChart, PipelineChart } from "@/components/crm/Charts";
import { ActivityFeed } from "@/components/crm/ActivityFeed";
import { ContactsTable } from "@/components/crm/ContactsTable";
import { PipelineBoard } from "@/components/crm/PipelineBoard";
import { TasksSection } from "@/components/crm/TasksSection";
import { ReportsSection } from "@/components/crm/ReportsSection";
import { NewContactDialog } from "@/components/crm/NewContactDialog";
import { NotificationsPanel } from "@/components/crm/NotificationsPanel";

const titles: Record<string, string> = {
  dashboard: "Dashboard",
  contacts: "Contactos",
  pipeline: "Pipeline",
  tasks: "Tarefas",
  reports: "Relatórios",
  settings: "Definições",
  help: "Ajuda",
};

const Index = () => {
  const [view, setView] = useState("dashboard");
  const [newContactOpen, setNewContactOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar active={view} onChange={setView} />

      <main className="flex-1 min-w-0">
        <Topbar
          title={titles[view] || "Dashboard"}
          onNewContact={() => setNewContactOpen(true)}
          onToggleNotifications={() => setNotifOpen(true)}
          notificationCount={4}
        />

        <div className="p-4 sm:p-8 space-y-6 animate-fade-in">
          {view === "dashboard" && (
            <>
              <StatsGrid />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <RevenueChart />
                <PipelineChart />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2"><ContactsTable onAdd={() => setNewContactOpen(true)} /></div>
                <ActivityFeed />
              </div>
            </>
          )}

          {view === "contacts" && <ContactsTable onAdd={() => setNewContactOpen(true)} />}
          {view === "pipeline" && <PipelineBoard />}
          {view === "tasks" && <TasksSection />}
          {view === "reports" && (
            <>
              <StatsGrid />
              <ReportsSection />
              <RevenueChart />
            </>
          )}
          {(view === "settings" || view === "help") && (
            <div className="text-center py-20 text-muted-foreground">
              <p className="font-display text-2xl mb-2">{titles[view]}</p>
              <p className="text-sm">Esta secção está em desenvolvimento.</p>
            </div>
          )}
        </div>
      </main>

      <NewContactDialog open={newContactOpen} onOpenChange={setNewContactOpen} />
      <NotificationsPanel open={notifOpen} onOpenChange={setNotifOpen} />
    </div>
  );
};

export default Index;
