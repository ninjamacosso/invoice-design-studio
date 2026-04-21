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
import { OutreachSection } from "@/components/crm/OutreachSection";
import { SettingsSection } from "@/components/crm/SettingsSection";
import { HelpSection } from "@/components/crm/HelpSection";
import { InboxSection } from "@/components/crm/InboxSection";
import { SocialManagerSection } from "@/components/crm/SocialManagerSection";
import { CreativeStudioSection } from "@/components/crm/CreativeStudioSection";
import { BulkMessagingSection } from "@/components/crm/BulkMessagingSection";
import { NewContactDialog } from "@/components/crm/NewContactDialog";
import { NotificationsPanel } from "@/components/crm/NotificationsPanel";

const titles: Record<string, string> = {
  dashboard: "Dashboard",
  contacts: "Contactos",
  pipeline: "Pipeline",
  inbox: "Inbox Multicanal",
  social: "Social Manager",
  creative: "Creative Studio IA",
  bulk: "Bulk Messaging",
  outreach: "Outreach IA",
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
          {view === "inbox" && <InboxSection />}
          {view === "social" && <SocialManagerSection />}
          {view === "creative" && <CreativeStudioSection />}
          {view === "bulk" && <BulkMessagingSection />}
          {view === "outreach" && <OutreachSection />}
          {view === "tasks" && <TasksSection />}
          {view === "reports" && (
            <>
              <StatsGrid />
              <ReportsSection />
              <RevenueChart />
            </>
          )}
          {view === "settings" && <SettingsSection />}
          {view === "help" && <HelpSection />}
        </div>
      </main>

      <NewContactDialog open={newContactOpen} onOpenChange={setNewContactOpen} />
      <NotificationsPanel open={notifOpen} onOpenChange={setNotifOpen} />
    </div>
  );
};

export default Index;
