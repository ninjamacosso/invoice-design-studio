import { Bot, MessageSquare, Phone, Send, Sparkles, Users, CheckCircle2, AlertTriangle, TrendingUp, Zap, Pause, Play, Settings, Plus, Filter, ArrowRight, Brain, MessageCircle, PhoneCall, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

/* ============ MOCK DATA ============ */

const agents = [
  { id: 1, name: "Aurora", role: "SDR Conversacional", desc: "Qualifica leads e mantém diálogos por SMS/WhatsApp", channel: "WhatsApp + SMS", status: "active", autonomy: 85, handled: 1247, escalated: 89, color: "from-primary to-primary-glow" },
  { id: 2, name: "Vox", role: "Voice Agent", desc: "Faz primeira chamada de descoberta e marca reuniões", channel: "Voz", status: "active", autonomy: 70, handled: 342, escalated: 67, color: "from-orange-500 to-pink-500" },
  { id: 3, name: "Scribe", role: "Call Summariser", desc: "Transcreve chamadas, resume e cria tarefas de follow-up", channel: "Pós-chamada", status: "active", autonomy: 95, handled: 218, escalated: 4, color: "from-info to-primary" },
  { id: 4, name: "Pulse", role: "Lead Qualifier", desc: "Analisa respostas e move negócios no pipeline automaticamente", channel: "Background", status: "paused", autonomy: 80, handled: 856, escalated: 142, color: "from-success to-emerald-400" },
];

const campaigns = [
  { id: 1, name: "Reactivação de Leads Q1", channel: "WhatsApp", mode: "auto", agent: "Aurora", target: 248, sent: 186, replied: 47, converted: 12, status: "running" },
  { id: 2, name: "Follow-up Pós-Demo TechVision", channel: "SMS", mode: "approval", agent: "Aurora", target: 32, sent: 28, replied: 19, converted: 5, status: "running" },
  { id: 3, name: "Cold Outreach Healthcare", channel: "Voz + WhatsApp", mode: "hybrid", agent: "Vox + Aurora", target: 124, sent: 89, replied: 23, converted: 4, status: "running" },
  { id: 4, name: "Renovação Contratos 2026", channel: "Voz", mode: "approval", agent: "Vox", target: 56, sent: 0, replied: 0, converted: 0, status: "draft" },
];

const conversations = [
  { id: 1, contact: "Maria Santos", company: "Acme Corp.", channel: "whatsapp", agent: "Aurora", lastMsg: "Perfeito, podemos marcar para quinta às 15h?", time: "há 2 min", unread: 2, sentiment: "positive", confidence: 94 },
  { id: 2, contact: "Pedro Silva", company: "Nexus Solutions", channel: "sms", agent: "Aurora", lastMsg: "Não estou interessado, obrigado.", time: "há 18 min", unread: 1, sentiment: "negative", confidence: 88 },
  { id: 3, contact: "Sofia Almeida", company: "Orbit SA", channel: "whatsapp", agent: "Aurora", lastMsg: "Pode enviar mais detalhes sobre o pricing?", time: "há 32 min", unread: 1, sentiment: "neutral", confidence: 76 },
  { id: 4, contact: "Carlos Mendes", company: "TechVision", channel: "voice", agent: "Vox", lastMsg: "[Chamada de 4:23 — resumo disponível]", time: "há 1 h", unread: 0, sentiment: "positive", confidence: 91 },
  { id: 5, contact: "Inês Costa", company: "Delta Group", channel: "whatsapp", agent: "Aurora", lastMsg: "Estou em reunião, ligo mais tarde.", time: "há 2 h", unread: 0, sentiment: "neutral", confidence: 82 },
];

const approvalQueue = [
  { id: 1, contact: "Ricardo Lopes", company: "Global Media", agent: "Aurora", channel: "whatsapp", confidence: 62, reason: "Confiança abaixo do limiar (75%)", draft: "Olá Ricardo! Reparei que o vosso contrato termina em Maio. Posso enviar uma proposta de renovação com 15% de desconto se decidirmos esta semana. Faz sentido marcar 15 min?" },
  { id: 2, contact: "Maria Santos", company: "Acme Corp.", agent: "Aurora", channel: "whatsapp", confidence: 71, reason: "Cliente mencionou 'preço alto' — sentimento misto", draft: "Compreendo a preocupação com o investimento, Maria. Posso mostrar-vos um cálculo de ROI específico para o vosso volume? Com base no que partilharam, o payback seria de ~4 meses." },
  { id: 3, contact: "Hugo Rocha", company: "Vertex Inc.", agent: "Vox", channel: "voice", confidence: 58, reason: "Decisão de €92K — requer aprovação humana", draft: "Script de chamada: introduzir nova oferta enterprise + agendar call com CFO." },
];

const channelIcon = { whatsapp: MessageCircle, sms: MessageSquare, voice: PhoneCall, email: Mail } as const;
const sentimentColor = { positive: "bg-success/15 text-success", negative: "bg-destructive/15 text-destructive", neutral: "bg-muted text-muted-foreground" };

/* ============ SUB-COMPONENTS ============ */

const HeroStats = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {[
      { icon: Bot, label: "Mensagens IA hoje", value: "1,847", sub: "82% sem intervenção", color: "from-primary/15 to-primary-glow/15 text-primary" },
      { icon: PhoneCall, label: "Chamadas automatizadas", value: "124", sub: "média 3:42 min", color: "from-orange-500/15 to-pink-500/15 text-orange-600" },
      { icon: CheckCircle2, label: "Taxa de resposta", value: "34%", sub: "▲ 12% vs humano", color: "from-success/15 to-emerald-400/15 text-success" },
      { icon: Users, label: "Aprovações pendentes", value: "3", sub: "tempo médio: 4 min", color: "from-warning/15 to-warning/5 text-warning" },
    ].map((s) => {
      const Icon = s.icon;
      return (
        <Card key={s.label} className="p-5 shadow-card hover:shadow-elegant transition-all">
          <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3", s.color)}>
            <Icon className="w-5 h-5" />
          </div>
          <p className="text-xs text-muted-foreground">{s.label}</p>
          <p className="font-display text-2xl font-bold">{s.value}</p>
          <p className="text-[10px] text-muted-foreground mt-1">{s.sub}</p>
        </Card>
      );
    })}
  </div>
);

const AgentsTab = () => {
  const [agentList, setAgentList] = useState(agents);
  const toggle = (id: number) => {
    setAgentList((prev) => prev.map((a) => a.id === id ? { ...a, status: a.status === "active" ? "paused" : "active" } : a));
    toast({ title: "Agente actualizado", description: "Estado alterado com sucesso." });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-lg">Agentes IA</h3>
          <p className="text-sm text-muted-foreground">Os agentes fazem 80% do trabalho. Tu supervisas os 20%.</p>
        </div>
        <Button className="gradient-primary text-white"><Plus className="w-4 h-4" />Novo Agente</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agentList.map((a) => (
          <Card key={a.id} className="p-5 shadow-card hover:shadow-elegant transition-all">
            <div className="flex items-start gap-4">
              <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br text-white flex items-center justify-center shrink-0 shadow-md", a.color)}>
                <Brain className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h4 className="font-display font-bold">{a.name}</h4>
                    <p className="text-xs text-muted-foreground">{a.role}</p>
                  </div>
                  <Switch checked={a.status === "active"} onCheckedChange={() => toggle(a.id)} />
                </div>
                <p className="text-sm text-muted-foreground mt-2">{a.desc}</p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <Badge variant="secondary" className="text-[10px]">{a.channel}</Badge>
                  <Badge className={cn("text-[10px] border-0", a.status === "active" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground")}>
                    {a.status === "active" ? "Activo" : "Pausado"}
                  </Badge>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Autonomia</span>
                    <span className="font-semibold">{a.autonomy}%</span>
                  </div>
                  <Progress value={a.autonomy} className="h-1.5" />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border/50">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Tratadas</p>
                    <p className="font-display text-lg font-bold">{a.handled.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Escaladas</p>
                    <p className="font-display text-lg font-bold text-warning">{a.escalated}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const CampaignsTab = ({ onNew }: { onNew: () => void }) => {
  const modeBadge: Record<string, string> = {
    auto: "bg-primary/15 text-primary",
    approval: "bg-warning/15 text-warning",
    hybrid: "bg-info/15 text-info",
  };
  const modeLabel: Record<string, string> = { auto: "Auto", approval: "Com aprovação", hybrid: "Híbrido" };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-lg">Campanhas em Massa</h3>
          <p className="text-sm text-muted-foreground">Envios de SMS, WhatsApp e chamadas orquestrados pelos agentes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Filter className="w-4 h-4" />Filtrar</Button>
          <Button onClick={onNew} className="gradient-primary text-white"><Plus className="w-4 h-4" />Nova Campanha</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {campaigns.map((c) => {
          const pct = c.target > 0 ? (c.sent / c.target) * 100 : 0;
          const replyRate = c.sent > 0 ? ((c.replied / c.sent) * 100).toFixed(0) : "0";
          return (
            <Card key={c.id} className="p-5 shadow-card hover:shadow-elegant transition-all">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <h4 className="font-display font-bold truncate">{c.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Agente: {c.agent} · Canal: {c.channel}</p>
                </div>
                <Badge className={cn("border-0 text-[10px] shrink-0", modeBadge[c.mode])}>{modeLabel[c.mode]}</Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{c.sent} / {c.target} enviados</span>
                  <span className="font-semibold">{pct.toFixed(0)}%</span>
                </div>
                <Progress value={pct} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/50">
                <div><p className="text-[10px] text-muted-foreground uppercase">Respostas</p><p className="font-bold text-sm">{c.replied} <span className="text-xs text-muted-foreground">({replyRate}%)</span></p></div>
                <div><p className="text-[10px] text-muted-foreground uppercase">Convertidos</p><p className="font-bold text-sm text-success">{c.converted}</p></div>
                <div className="flex items-center justify-end gap-1">
                  {c.status === "running" ? (
                    <Button size="icon" variant="ghost" className="h-8 w-8"><Pause className="w-3.5 h-3.5" /></Button>
                  ) : (
                    <Button size="icon" variant="ghost" className="h-8 w-8"><Play className="w-3.5 h-3.5" /></Button>
                  )}
                  <Button size="icon" variant="ghost" className="h-8 w-8"><Settings className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const InboxTab = () => {
  const [selectedId, setSelectedId] = useState(conversations[0].id);
  const selected = conversations.find((c) => c.id === selectedId)!;
  const Icon = channelIcon[selected.channel as keyof typeof channelIcon];

  return (
    <Card className="shadow-card overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[320px_1fr] min-h-[560px]">
        <div className="border-r border-border bg-muted/30">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Input placeholder="Pesquisar conversas..." className="bg-card" />
            </div>
          </div>
          <div className="overflow-y-auto max-h-[500px]">
            {conversations.map((c) => {
              const CIcon = channelIcon[c.channel as keyof typeof channelIcon];
              const isActive = c.id === selectedId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={cn(
                    "w-full text-left p-4 border-b border-border/50 hover:bg-accent/40 transition-colors",
                    isActive && "bg-accent/60"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full gradient-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {c.contact.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm truncate">{c.contact}</p>
                        <span className="text-[10px] text-muted-foreground shrink-0">{c.time}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">{c.company}</p>
                      <p className="text-xs mt-1 truncate text-muted-foreground">{c.lastMsg}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <CIcon className="w-3 h-3 text-muted-foreground" />
                        <Badge className={cn("text-[9px] border-0 px-1.5 py-0", sentimentColor[c.sentiment as keyof typeof sentimentColor])}>
                          {c.sentiment}
                        </Badge>
                        {c.unread > 0 && (
                          <span className="ml-auto text-[10px] bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center font-bold">
                            {c.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-primary text-white text-sm font-bold flex items-center justify-center">
                {selected.contact.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="font-semibold">{selected.contact}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Icon className="w-3 h-3" />{selected.company} · agente {selected.agent}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/15 text-primary border-0 text-[10px]">
                <Sparkles className="w-3 h-3 mr-1" />IA confiança {selected.confidence}%
              </Badge>
              <Button variant="outline" size="sm">Assumir</Button>
            </div>
          </div>

          <div className="flex-1 p-6 space-y-4 bg-muted/20 overflow-y-auto">
            <div className="flex justify-start">
              <div className="bg-card max-w-md p-3 rounded-2xl rounded-tl-sm shadow-sm border border-border/50">
                <p className="text-sm">Olá! Sou {selected.agent}, do CRM. Vi que demonstraram interesse na nossa solução. Tem 5 min para uma chamada esta semana?</p>
                <p className="text-[10px] text-muted-foreground mt-1">Aurora · 10:32</p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="gradient-primary text-white max-w-md p-3 rounded-2xl rounded-tr-sm shadow-md">
                <p className="text-sm">{selected.lastMsg}</p>
                <p className="text-[10px] opacity-80 mt-1">{selected.contact} · {selected.time}</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-gradient-to-br from-primary/10 to-primary-glow/10 border border-primary/20 max-w-md p-3 rounded-2xl rounded-tl-sm">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <p className="text-[10px] font-bold uppercase text-primary tracking-wider">Sugestão da IA</p>
                </div>
                <p className="text-sm">Perfeito! Agendei provisoriamente quinta às 15h. Vou enviar convite por email — confirmas?</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="gradient-primary text-white h-7 text-xs">Aprovar e enviar</Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs">Editar</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border bg-card">
            <div className="flex gap-2">
              <Textarea placeholder="Escreve uma mensagem ou deixa a IA tratar..." rows={2} className="resize-none" />
              <div className="flex flex-col gap-2">
                <Button size="icon" className="gradient-primary text-white"><Send className="w-4 h-4" /></Button>
                <Button size="icon" variant="outline"><Sparkles className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const ApprovalTab = () => {
  const [queue, setQueue] = useState(approvalQueue);

  const handle = (id: number, action: "approve" | "reject") => {
    setQueue((q) => q.filter((i) => i.id !== id));
    toast({
      title: action === "approve" ? "Mensagem aprovada" : "Mensagem rejeitada",
      description: action === "approve" ? "Enviada pelo agente IA." : "A IA vai tentar uma alternativa.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Fila de Aprovação Humana
          </h3>
          <p className="text-sm text-muted-foreground">Os 10-20% que precisam do teu olho. A IA explica porquê escalou.</p>
        </div>
        <Badge className="bg-warning/15 text-warning border-0">{queue.length} pendentes</Badge>
      </div>

      {queue.length === 0 && (
        <Card className="p-12 text-center shadow-card">
          <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
          <p className="font-display text-lg font-bold">Tudo tratado!</p>
          <p className="text-sm text-muted-foreground">Os agentes estão a gerir tudo autonomamente.</p>
        </Card>
      )}

      {queue.map((item) => {
        const CIcon = channelIcon[item.channel as keyof typeof channelIcon];
        return (
          <Card key={item.id} className="p-5 shadow-card hover:shadow-elegant transition-all border-l-4 border-l-warning">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-warning/15 text-warning flex items-center justify-center shrink-0">
                <CIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                  <div>
                    <p className="font-semibold">{item.contact} <span className="text-muted-foreground font-normal">· {item.company}</span></p>
                    <p className="text-xs text-muted-foreground">Agente: {item.agent}</p>
                  </div>
                  <Badge className="bg-warning/15 text-warning border-0 text-[10px]">
                    Confiança {item.confidence}%
                  </Badge>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-warning mb-3">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{item.reason}</span>
                </div>

                <div className="bg-muted/40 p-3 rounded-lg border border-border/50 mb-3">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider mb-1">Draft proposto pela IA</p>
                  <p className="text-sm">{item.draft}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="gradient-primary text-white" onClick={() => handle(item.id, "approve")}>
                    <CheckCircle2 className="w-3.5 h-3.5" />Aprovar e enviar
                  </Button>
                  <Button size="sm" variant="outline">Editar</Button>
                  <Button size="sm" variant="ghost" onClick={() => handle(item.id, "reject")}>Rejeitar</Button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

const NewCampaignDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  if (!open) return null;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Campanha criada", description: "A IA vai começar a preparar as mensagens personalizadas." });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-elegant" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold">Nova Campanha em Massa</h3>
            <p className="text-xs text-muted-foreground">A IA personaliza cada mensagem por contacto</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2"><Label>Nome da Campanha</Label><Input placeholder="Ex: Reactivação clientes Q2" required /></div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Canal</Label>
              <Select defaultValue="whatsapp">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="voice">Chamada de Voz</SelectItem>
                  <SelectItem value="multi">Multi-canal (IA decide)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Agente IA</Label>
              <Select defaultValue="aurora">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="aurora">Aurora — SDR Conversacional</SelectItem>
                  <SelectItem value="vox">Vox — Voice Agent</SelectItem>
                  <SelectItem value="pulse">Pulse — Lead Qualifier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Segmento de Contactos</Label>
            <Select defaultValue="all-prospects">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all-prospects">Todos os Prospects (124)</SelectItem>
                <SelectItem value="leads-cold">Leads frios &gt; 30 dias (87)</SelectItem>
                <SelectItem value="clients-renewal">Clientes a renovar Q2 (56)</SelectItem>
                <SelectItem value="custom">Filtro personalizado...</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Modo de Aprovação</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { v: "auto", label: "Auto", desc: "IA envia tudo" },
                { v: "hybrid", label: "Híbrido", desc: "Envia se >75% confiança" },
                { v: "approval", label: "Aprovação", desc: "Tu aprovas cada msg" },
              ].map((m) => (
                <label key={m.v} className="cursor-pointer">
                  <input type="radio" name="mode" value={m.v} defaultChecked={m.v === "hybrid"} className="peer sr-only" />
                  <div className="p-3 rounded-lg border-2 border-border peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                    <p className="font-semibold text-sm">{m.label}</p>
                    <p className="text-[10px] text-muted-foreground">{m.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Briefing para a IA</Label>
            <Textarea
              rows={3}
              placeholder="Ex: Reactivar clientes que não compram há 60 dias. Oferta: 15% desconto até fim do mês. Tom: amigável mas profissional. Marcar reunião de 15 min como objectivo final."
              required
            />
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3" />A IA vai gerar uma mensagem personalizada por contacto baseada neste briefing
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="gradient-primary text-white">
              <Zap className="w-4 h-4" />Lançar Campanha
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

/* ============ MAIN ============ */

export const OutreachSection = () => {
  const [newOpen, setNewOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-elegant bg-gradient-to-br from-primary/5 via-primary-glow/5 to-transparent border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0 shadow-glow">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-2xl font-bold mb-1">Centro de Outreach IA</h2>
            <p className="text-sm text-muted-foreground">
              Os teus agentes IA fazem <span className="font-bold text-foreground">80% do trabalho</span> — chamadas, SMS, WhatsApp e qualificação. Tu validas só o que importa.
            </p>
            <div className="flex items-center gap-2 mt-3 text-xs flex-wrap">
              <Badge className="bg-success/15 text-success border-0"><TrendingUp className="w-3 h-3 mr-1" />4 agentes activos</Badge>
              <Badge className="bg-primary/15 text-primary border-0"><Bot className="w-3 h-3 mr-1" />1,847 interacções hoje</Badge>
              <Badge className="bg-warning/15 text-warning border-0"><AlertTriangle className="w-3 h-3 mr-1" />3 escaladas</Badge>
            </div>
          </div>
        </div>
      </Card>

      <HeroStats />

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList className="bg-card border border-border h-auto p-1 flex-wrap">
          <TabsTrigger value="agents" className="data-[state=active]:gradient-primary data-[state=active]:text-white"><Bot className="w-4 h-4" />Agentes</TabsTrigger>
          <TabsTrigger value="campaigns" className="data-[state=active]:gradient-primary data-[state=active]:text-white"><Zap className="w-4 h-4" />Campanhas</TabsTrigger>
          <TabsTrigger value="inbox" className="data-[state=active]:gradient-primary data-[state=active]:text-white"><MessageSquare className="w-4 h-4" />Inbox</TabsTrigger>
          <TabsTrigger value="approval" className="data-[state=active]:gradient-primary data-[state=active]:text-white">
            <AlertTriangle className="w-4 h-4" />Aprovação
            <span className="ml-1 bg-warning text-warning-foreground text-[10px] font-bold rounded-full w-4 h-4 inline-flex items-center justify-center">3</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agents"><AgentsTab /></TabsContent>
        <TabsContent value="campaigns"><CampaignsTab onNew={() => setNewOpen(true)} /></TabsContent>
        <TabsContent value="inbox"><InboxTab /></TabsContent>
        <TabsContent value="approval"><ApprovalTab /></TabsContent>
      </Tabs>

      <NewCampaignDialog open={newOpen} onClose={() => setNewOpen(false)} />
    </div>
  );
};
