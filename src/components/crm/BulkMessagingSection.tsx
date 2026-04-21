import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MessageSquare, Send, Users, Sparkles, Loader2, Plus, Play, Pause, BarChart3, Mail, Smartphone, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { callAI } from "@/lib/ai";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const audiences = [
  { id: 1, name: "Leads frios (90 dias)", count: 1842, channel: "wa" },
  { id: 2, name: "Clientes ativos plano Pro", count: 426, channel: "sms" },
  { id: 3, name: "Trial expirado última semana", count: 287, channel: "email" },
  { id: 4, name: "Workshop participantes", count: 612, channel: "wa" },
];

const campaigns = [
  { id: 1, name: "Black Friday WhatsApp", channel: "wa", status: "a-correr", sent: 1240, total: 1842, opened: 892, replied: 234, mode: "hibrido" },
  { id: 2, name: "Reativação SMS clientes", channel: "sms", status: "concluida", sent: 426, total: 426, opened: 380, replied: 112, mode: "auto" },
  { id: 3, name: "Webinar follow-up", channel: "email", status: "agendada", sent: 0, total: 612, opened: 0, replied: 0, mode: "aprovacao" },
  { id: 4, name: "Demo upsell Enterprise", channel: "wa", status: "pausada", sent: 89, total: 287, opened: 67, replied: 18, mode: "aprovacao" },
];

const channelMeta: Record<string, { color: string; label: string; Icon: any }> = {
  wa: { color: "bg-green-500", label: "WhatsApp", Icon: MessageSquare },
  sms: { color: "bg-purple-500", label: "SMS", Icon: Smartphone },
  email: { color: "bg-orange-500", label: "Email", Icon: Mail },
};

const statusColor: Record<string, string> = {
  "a-correr": "bg-success text-white",
  "concluida": "bg-muted text-muted-foreground",
  "agendada": "bg-info text-white",
  "pausada": "bg-warning text-white",
};

export const BulkMessagingSection = () => {
  const [template, setTemplate] = useState("Olá {nome}! 👋 Temos uma novidade que vais adorar...");
  const [generating, setGenerating] = useState(false);
  const [mode, setMode] = useState("hibrido");
  const [channel, setChannel] = useState("wa");

  const generateTemplate = async () => {
    setGenerating(true);
    const r = await callAI({
      action: "caption",
      prompt: `Cria uma mensagem de outreach em massa para ${channelMeta[channel].label}, curta, personalizada com {nome} e {empresa}, com call-to-action claro. Tema: campanha de reativação de clientes.`,
      platform: channelMeta[channel].label,
      tone: "amigável e direto",
    });
    setGenerating(false);
    if (r.error) return toast.error(r.error);
    if (r.text) {
      setTemplate(r.text);
      toast.success("Mensagem gerada por IA");
    }
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Mensagens enviadas hoje", value: "3.842", icon: Send, color: "text-primary" },
          { label: "Taxa de entrega", value: "98.4%", icon: CheckCircle2, color: "text-success" },
          { label: "Taxa de resposta", value: "24.8%", icon: MessageSquare, color: "text-info" },
          { label: "Audiências ativas", value: "12", icon: Users, color: "text-warning" },
        ].map((k) => (
          <Card key={k.label} className="p-5 shadow-card">
            <k.icon className={cn("w-5 h-5 mb-3", k.color)} />
            <p className="text-2xl font-bold font-display">{k.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{k.label}</p>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="new">Nova campanha</TabsTrigger>
          <TabsTrigger value="audiences">Audiências</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="mt-4 space-y-3">
          {campaigns.map((c) => {
            const meta = channelMeta[c.channel];
            const pct = (c.sent / c.total) * 100;
            return (
              <Card key={c.id} className="p-5 shadow-card">
                <div className="flex items-start gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white", meta.color)}>
                    <meta.Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-display font-bold">{c.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={statusColor[c.status]}>{c.status}</Badge>
                          <Badge variant="outline" className="text-xs">
                            <Sparkles className="w-3 h-3 mr-1" />
                            {c.mode === "auto" ? "IA automática" : c.mode === "hibrido" ? "Híbrido" : "Aprovação humana"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {c.status === "a-correr" && <Button size="sm" variant="outline"><Pause className="w-4 h-4" /></Button>}
                        {c.status === "pausada" && <Button size="sm" className="gradient-primary text-white"><Play className="w-4 h-4" /></Button>}
                        <Button size="sm" variant="ghost"><BarChart3 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                    <Progress value={pct} className="h-2 mb-2" />
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div><span className="text-muted-foreground">Enviadas</span><p className="font-bold">{c.sent}/{c.total}</p></div>
                      <div><span className="text-muted-foreground">Abertas</span><p className="font-bold">{c.opened}</p></div>
                      <div><span className="text-muted-foreground">Respostas</span><p className="font-bold text-success">{c.replied}</p></div>
                      <div><span className="text-muted-foreground">Taxa resp.</span><p className="font-bold">{c.sent ? ((c.replied / c.sent) * 100).toFixed(1) : 0}%</p></div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="new" className="mt-4">
          <Card className="p-6 shadow-card space-y-5">
            <div>
              <h3 className="font-display font-bold text-lg mb-1">Criar nova campanha</h3>
              <p className="text-sm text-muted-foreground">Configura canal, audiência, IA e mensagem</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nome da campanha</Label>
                <Input placeholder="Ex: Black Friday 2026" className="mt-1" />
              </div>
              <div>
                <Label>Canal</Label>
                <Select value={channel} onValueChange={setChannel}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wa">WhatsApp Business</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Audiência</Label>
                <Select>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Escolhe uma audiência" /></SelectTrigger>
                  <SelectContent>
                    {audiences.map((a) => (
                      <SelectItem key={a.id} value={a.id.toString()}>{a.name} ({a.count})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Modo IA × Humano</Label>
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">100% IA (envio automático)</SelectItem>
                    <SelectItem value="hibrido">Híbrido (IA personaliza, humano aprova lotes)</SelectItem>
                    <SelectItem value="aprovacao">Aprovação manual (cada mensagem)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Mensagem template</Label>
                <Button size="sm" variant="outline" onClick={generateTemplate} disabled={generating}>
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Gerar com IA
                </Button>
              </div>
              <Textarea value={template} onChange={(e) => setTemplate(e.target.value)} className="min-h-[140px]" />
              <p className="text-xs text-muted-foreground mt-1">Variáveis: {"{nome}"}, {"{empresa}"}, {"{ultima_compra}"}</p>
            </div>

            <Card className="p-4 bg-accent/40 border-primary/20">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">Personalização IA por contacto</p>
                  <p className="text-xs text-muted-foreground mt-1">A IA reescreve cada mensagem com base no histórico, indústria e comportamento de cada contacto. ~80% mais respostas.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </Card>

            <Card className="p-4 bg-accent/40 border-primary/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">Auto-resposta a respostas recebidas</p>
                  <p className="text-xs text-muted-foreground mt-1">Quando o cliente responder, a IA continua a conversa no Inbox. Escala a humano se detetar intenção de compra ou frustração.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </Card>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm">
                <span className="text-muted-foreground">Custo estimado: </span>
                <span className="font-bold">€42,80</span>
                <span className="text-muted-foreground"> · 1.842 mensagens</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Guardar rascunho</Button>
                <Button className="gradient-primary text-white"><Send className="w-4 h-4" /> Lançar campanha</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="audiences" className="mt-4 space-y-3">
          {audiences.map((a) => {
            const meta = channelMeta[a.channel];
            return (
              <Card key={a.id} className="p-4 shadow-card flex items-center gap-4">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white", meta.color)}>
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.count.toLocaleString()} contactos · {meta.label}</p>
                </div>
                <Button size="sm" variant="outline">Usar</Button>
              </Card>
            );
          })}
          <Button variant="outline" className="w-full"><Plus className="w-4 h-4" /> Criar audiência segmentada</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};
