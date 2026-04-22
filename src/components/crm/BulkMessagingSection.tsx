import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare, Send, Users, Sparkles, Loader2, Plus, Play, Pause, BarChart3, Mail, Smartphone, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { callAI } from "@/lib/ai";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAudiences, useCampaigns, useCampaignMutations, useContacts } from "@/hooks/useCRM";
import type { Database } from "@/integrations/supabase/types";

type Channel = Database["public"]["Enums"]["channel_type"];
type Mode = Database["public"]["Enums"]["campaign_mode"];

const channelMeta: Record<string, { color: string; label: string; Icon: typeof MessageSquare }> = {
  whatsapp: { color: "bg-green-500", label: "WhatsApp", Icon: MessageSquare },
  sms: { color: "bg-purple-500", label: "SMS", Icon: Smartphone },
  email: { color: "bg-orange-500", label: "Email", Icon: Mail },
  instagram: { color: "bg-pink-500", label: "Instagram", Icon: MessageSquare },
  facebook: { color: "bg-blue-500", label: "Facebook", Icon: MessageSquare },
};

const statusColor: Record<string, string> = {
  running: "bg-success text-white",
  completed: "bg-muted text-muted-foreground",
  draft: "bg-info text-white",
  paused: "bg-warning text-white",
};

export const BulkMessagingSection = () => {
  const { data: audiences = [] } = useAudiences();
  const { data: campaigns = [] } = useCampaigns();
  const { data: contacts = [] } = useContacts();
  const { createAudience, createCampaign, updateCampaign, deleteCampaign } = useCampaignMutations();

  const [template, setTemplate] = useState("Olá {nome}! 👋 Temos uma novidade que vais adorar...");
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({ name: "", channel: "whatsapp" as Channel, audience_id: "", mode: "hybrid" as Mode });
  const [audOpen, setAudOpen] = useState(false);
  const [audForm, setAudForm] = useState({ name: "", description: "" });

  const generateTemplate = async () => {
    setGenerating(true);
    const r = await callAI({
      action: "caption",
      prompt: `Cria mensagem outreach em massa para ${channelMeta[form.channel].label}, curta, com {nome} e {empresa}, CTA claro.`,
      platform: channelMeta[form.channel].label,
      tone: "amigável e direto",
    });
    setGenerating(false);
    if (r.error) return toast.error(r.error);
    if (r.text) { setTemplate(r.text); toast.success("Mensagem gerada"); }
  };

  const launch = async (status: "draft" | "running") => {
    if (!form.name.trim()) return toast.error("Dá um nome à campanha");
    if (!form.audience_id) return toast.error("Escolhe uma audiência");
    await createCampaign.mutateAsync({
      name: form.name.trim(),
      channel: form.channel,
      audience_id: form.audience_id,
      mode: form.mode,
      template,
      status,
    });
    setForm({ name: "", channel: "whatsapp", audience_id: "", mode: "hybrid" });
  };

  const submitAudience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audForm.name.trim()) return;
    await createAudience.mutateAsync({
      name: audForm.name.trim(),
      description: audForm.description.trim() || null,
      contacts_count: contacts.length,
    });
    setAudForm({ name: "", description: "" });
    setAudOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Campanhas ativas", value: campaigns.filter(c => c.status === "running").length.toString(), icon: Send, color: "text-primary" },
          { label: "Total enviadas", value: campaigns.reduce((s, c) => s + (c.sent_count ?? 0), 0).toLocaleString(), icon: CheckCircle2, color: "text-success" },
          { label: "Audiências", value: audiences.length.toString(), icon: Users, color: "text-info" },
          { label: "Total respostas", value: campaigns.reduce((s, c) => s + (c.replied_count ?? 0), 0).toLocaleString(), icon: MessageSquare, color: "text-warning" },
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
          {campaigns.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Sem campanhas ainda. Cria a primeira →</p>}
          {campaigns.map((c) => {
            const meta = channelMeta[c.channel];
            const total = c.audiences?.contacts_count ?? 1;
            const pct = ((c.sent_count ?? 0) / total) * 100;
            const Icon = meta.Icon;
            return (
              <Card key={c.id} className="p-5 shadow-card">
                <div className="flex items-start gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white", meta.color)}><Icon className="w-5 h-5" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-display font-bold">{c.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={statusColor[c.status]}>{c.status}</Badge>
                          <Badge variant="outline" className="text-xs"><Sparkles className="w-3 h-3 mr-1" />
                            {c.mode === "auto" ? "IA automática" : c.mode === "hybrid" ? "Híbrido" : "Aprovação humana"}
                          </Badge>
                          {c.audiences?.name && <span className="text-xs text-muted-foreground">· {c.audiences.name}</span>}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {c.status === "running" && <Button size="sm" variant="outline" onClick={() => updateCampaign.mutate({ id: c.id, status: "paused" })}><Pause className="w-4 h-4" /></Button>}
                        {(c.status === "paused" || c.status === "draft") && <Button size="sm" className="gradient-primary text-white" onClick={() => updateCampaign.mutate({ id: c.id, status: "running" })}><Play className="w-4 h-4" /></Button>}
                        <Button size="sm" variant="ghost"><BarChart3 className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteCampaign.mutate(c.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                    </div>
                    <Progress value={pct} className="h-2 mb-2" />
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div><span className="text-muted-foreground">Enviadas</span><p className="font-bold">{c.sent_count}/{total}</p></div>
                      <div><span className="text-muted-foreground">Entregues</span><p className="font-bold">{c.delivered_count}</p></div>
                      <div><span className="text-muted-foreground">Respostas</span><p className="font-bold text-success">{c.replied_count}</p></div>
                      <div><span className="text-muted-foreground">Taxa resp.</span><p className="font-bold">{(c.sent_count ?? 0) > 0 ? (((c.replied_count ?? 0) / (c.sent_count ?? 1)) * 100).toFixed(1) : 0}%</p></div>
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
              <div><Label>Nome da campanha *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Black Friday 2026" className="mt-1" maxLength={120} /></div>
              <div>
                <Label>Canal</Label>
                <Select value={form.channel} onValueChange={(v) => setForm({ ...form, channel: v as Channel })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="instagram">Instagram DM</SelectItem>
                    <SelectItem value="facebook">Messenger</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Audiência *</Label>
                <Select value={form.audience_id} onValueChange={(v) => setForm({ ...form, audience_id: v })}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Escolhe uma audiência" /></SelectTrigger>
                  <SelectContent>
                    {audiences.length === 0 && <div className="p-2 text-xs text-muted-foreground">Cria uma audiência primeiro</div>}
                    {audiences.map((a) => <SelectItem key={a.id} value={a.id}>{a.name} ({a.contacts_count})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Modo IA × Humano</Label>
                <Select value={form.mode} onValueChange={(v) => setForm({ ...form, mode: v as Mode })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">100% IA (envio automático)</SelectItem>
                    <SelectItem value="hybrid">Híbrido (IA personaliza, humano aprova)</SelectItem>
                    <SelectItem value="manual">Aprovação manual</SelectItem>
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
              <Textarea value={template} onChange={(e) => setTemplate(e.target.value)} className="min-h-[140px]" maxLength={2000} />
              <p className="text-xs text-muted-foreground mt-1">Variáveis: {"{nome}"}, {"{empresa}"}</p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {form.audience_id && <>Audiência: <span className="font-bold text-foreground">{audiences.find(a => a.id === form.audience_id)?.contacts_count ?? 0} contactos</span></>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => launch("draft")} disabled={createCampaign.isPending}>Guardar rascunho</Button>
                <Button className="gradient-primary text-white" onClick={() => launch("running")} disabled={createCampaign.isPending}><Send className="w-4 h-4" /> Lançar campanha</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="audiences" className="mt-4 space-y-3">
          {audiences.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Sem audiências.</p>}
          {audiences.map((a) => (
            <Card key={a.id} className="p-4 shadow-card flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-white"><Users className="w-5 h-5" /></div>
              <div className="flex-1">
                <p className="font-semibold">{a.name}</p>
                <p className="text-xs text-muted-foreground">{a.contacts_count?.toLocaleString() ?? 0} contactos {a.description ? `· ${a.description}` : ""}</p>
              </div>
            </Card>
          ))}
          <Button variant="outline" className="w-full" onClick={() => setAudOpen(true)}><Plus className="w-4 h-4" /> Criar audiência</Button>
        </TabsContent>
      </Tabs>

      <Dialog open={audOpen} onOpenChange={setAudOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nova audiência</DialogTitle></DialogHeader>
          <form onSubmit={submitAudience} className="space-y-4">
            <div><Label>Nome *</Label><Input value={audForm.name} onChange={(e) => setAudForm({ ...audForm, name: e.target.value })} required maxLength={120} /></div>
            <div><Label>Descrição</Label><Textarea value={audForm.description} onChange={(e) => setAudForm({ ...audForm, description: e.target.value })} maxLength={500} /></div>
            <p className="text-xs text-muted-foreground">Inclui todos os {contacts.length} contactos atuais. Filtros segmentados em breve.</p>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAudOpen(false)}>Cancelar</Button>
              <Button type="submit" className="gradient-primary text-white">Criar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
