import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Filter, Plus, MoreHorizontal, Mail, Phone, Trash2, MessageSquare, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useContacts, useContactMutations, type Contact } from "@/hooks/useCRM";
import { useConversationMutations } from "@/hooks/useCRM";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


const statusVariant: Record<string, string> = {
  customer: "bg-success/15 text-success hover:bg-success/20",
  active: "bg-info/15 text-info hover:bg-info/20",
  lead: "bg-warning/15 text-warning hover:bg-warning/20",
  inactive: "bg-muted text-muted-foreground",
};

const statusLabel: Record<string, string> = {
  customer: "Cliente",
  active: "Prospect",
  lead: "Lead",
  inactive: "Inativo",
};

const initials = (name: string) => name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();

const colors = ["bg-primary", "bg-info", "bg-warning", "bg-success", "bg-primary-glow", "bg-destructive"];
const colorFor = (id: string) => colors[id.charCodeAt(0) % colors.length];

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `há ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h}h`;
  return `há ${Math.floor(h / 24)}d`;
};

export const ContactsTable = ({ onAdd }: { onAdd: () => void }) => {
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const { data: contacts = [], isLoading } = useContacts();
  const { remove } = useContactMutations();
  const { createConversation } = useConversationMutations();

  const filtered = contacts.filter((c) => {
    const matchesStatus = filter === "all" || c.status === filter;
    const q = query.toLowerCase();
    const matchesQuery = !q || c.full_name.toLowerCase().includes(q) || (c.company ?? "").toLowerCase().includes(q) || (c.email ?? "").toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  const startConversation = async (contact: Contact) => {
    await createConversation.mutateAsync({
      contact_id: contact.id,
      channel: "email",
      subject: `Conversa com ${contact.full_name}`,
      handler: "human",
    });
  };

  return (
    <Card className="p-6 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { k: "all", l: "Todos" },
            { k: "customer", l: "Clientes" },
            { k: "active", l: "Prospects" },
            { k: "lead", l: "Leads" },
          ].map((tab) => (
            <button
              key={tab.k}
              onClick={() => setFilter(tab.k)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                filter === tab.k ? "gradient-primary text-white shadow-md" : "bg-muted text-muted-foreground hover:bg-accent"
              )}
            >
              {tab.l} <span className="ml-1 opacity-70">{tab.k === "all" ? contacts.length : contacts.filter(c => c.status === tab.k).length}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Procurar..." className="pl-9 h-9 w-48" />
          </div>
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
              <th className="py-3 font-semibold">Telefone</th>
              <th className="py-3 font-semibold">Última atividade</th>
              <th className="py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">A carregar...</td></tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Sem contactos. Cria o primeiro →</td></tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-border/50 hover:bg-accent/40 transition-colors group">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold", colorFor(c.id))}>
                      {initials(c.full_name)}
                    </div>
                    <div>
                      <p className="font-semibold">{c.full_name}</p>
                      <p className="text-xs text-muted-foreground">{c.email ?? "—"}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 font-medium">{c.company ?? "—"}</td>
                <td className="py-4"><Badge className={cn("font-semibold border-0", statusVariant[c.status])}>{statusLabel[c.status]}</Badge></td>
                <td className="py-4 text-muted-foreground">{c.phone ?? "—"}</td>
                <td className="py-4 text-muted-foreground">{timeAgo(c.updated_at)}</td>
                <td className="py-4">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startConversation(c)} title="Iniciar conversa"><MessageSquare className="w-3.5 h-3.5" /></Button>
                    {c.email && <a href={`mailto:${c.email}`}><Button variant="ghost" size="icon" className="h-8 w-8"><Mail className="w-3.5 h-3.5" /></Button></a>}
                    {c.phone && <a href={`tel:${c.phone}`}><Button variant="ghost" size="icon" className="h-8 w-8"><Phone className="w-3.5 h-3.5" /></Button></a>}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-3.5 h-3.5" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-destructive" onClick={() => remove.mutate(c.id)}>
                          <Trash2 className="w-4 h-4 mr-2" /> Remover
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
