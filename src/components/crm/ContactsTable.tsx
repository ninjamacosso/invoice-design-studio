import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Download, Plus, MoreHorizontal, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Contact {
  id: number;
  name: string;
  email: string;
  company: string;
  status: "Cliente" | "Prospect" | "Lead";
  value: string;
  lastActivity: string;
  owner: string;
  initials: string;
  avatarColor: string;
}

const contacts: Contact[] = [
  { id: 1, name: "Maria Santos", email: "maria@acme.com", company: "Acme Corp.", status: "Cliente", value: "$120K", lastActivity: "há 10 min", owner: "Ana Ferreira", initials: "MS", avatarColor: "bg-primary" },
  { id: 2, name: "Carlos Mendes", email: "carlos@techvision.pt", company: "TechVision Lda.", status: "Prospect", value: "$45K", lastActivity: "há 1 hora", owner: "Carlos Mendes", initials: "CM", avatarColor: "bg-info" },
  { id: 3, name: "Pedro Silva", email: "pedro@nexus.com", company: "Nexus Solutions", status: "Lead", value: "$28K", lastActivity: "há 2 horas", owner: "João Martins", initials: "PS", avatarColor: "bg-warning" },
  { id: 4, name: "Sofia Almeida", email: "sofia@orbit.com", company: "Orbit SA", status: "Cliente", value: "$210K", lastActivity: "há 4 horas", owner: "Luísa Costa", initials: "SA", avatarColor: "bg-success" },
  { id: 5, name: "Ricardo Lopes", email: "ricardo@globalmedia.pt", company: "Global Media", status: "Prospect", value: "$67K", lastActivity: "ontem", owner: "Ana Ferreira", initials: "RL", avatarColor: "bg-primary-glow" },
  { id: 6, name: "Inês Costa", email: "ines@delta.com", company: "Delta Group", status: "Lead", value: "$15K", lastActivity: "há 2 dias", owner: "João Martins", initials: "IC", avatarColor: "bg-destructive" },
];

const statusVariant: Record<Contact["status"], string> = {
  Cliente: "bg-success/15 text-success hover:bg-success/20",
  Prospect: "bg-info/15 text-info hover:bg-info/20",
  Lead: "bg-warning/15 text-warning hover:bg-warning/20",
};

export const ContactsTable = ({ onAdd }: { onAdd: () => void }) => {
  const [filter, setFilter] = useState<string>("Todos");
  const filtered = filter === "Todos" ? contacts : contacts.filter((c) => c.status === filter);

  return (
    <Card className="p-6 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          {["Todos", "Cliente", "Prospect", "Lead"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                filter === tab
                  ? "gradient-primary text-white shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              )}
            >
              {tab} {tab === "Todos" && <span className="ml-1 opacity-70">248</span>}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Filter className="w-4 h-4" />Filtrar</Button>
          <Button variant="outline" size="sm"><Download className="w-4 h-4" />Exportar</Button>
          <Button size="sm" onClick={onAdd} className="gradient-primary text-white"><Plus className="w-4 h-4" />Adicionar</Button>
        </div>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="py-3 font-semibold">Nome</th>
              <th className="py-3 font-semibold">Empresa</th>
              <th className="py-3 font-semibold">Estado</th>
              <th className="py-3 font-semibold">Valor</th>
              <th className="py-3 font-semibold">Última Actividade</th>
              <th className="py-3 font-semibold">Responsável</th>
              <th className="py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-border/50 hover:bg-accent/40 transition-colors group">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold", c.avatarColor)}>
                      {c.initials}
                    </div>
                    <div>
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 font-medium">{c.company}</td>
                <td className="py-4"><Badge className={cn("font-semibold border-0", statusVariant[c.status])}>{c.status}</Badge></td>
                <td className="py-4 font-semibold">{c.value}</td>
                <td className="py-4 text-muted-foreground">{c.lastActivity}</td>
                <td className="py-4 text-muted-foreground">{c.owner}</td>
                <td className="py-4">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Mail className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Phone className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-3.5 h-3.5" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
