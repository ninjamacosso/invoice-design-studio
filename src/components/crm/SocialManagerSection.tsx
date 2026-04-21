import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Calendar, Heart, MessageCircle, Share2, TrendingUp, Sparkles, Send, Image as ImageIcon, Clock, Facebook, Instagram, BarChart3, Users, Eye, ThumbsUp, Loader2 } from "lucide-react";
import { callAI } from "@/lib/ai";
import { toast } from "sonner";

const accounts = [
  { id: "fb", name: "NexCRM Portugal", platform: "Facebook", followers: "12.4K", icon: Facebook, color: "bg-blue-500" },
  { id: "ig", name: "@nexcrm.pt", platform: "Instagram", followers: "8.2K", icon: Instagram, color: "bg-pink-500" },
];

const scheduledPosts = [
  { id: 1, platform: "ig", caption: "Lançamento da nova feature de IA 🚀", date: "Hoje, 18:00", status: "agendado", img: "🎨" },
  { id: 2, platform: "fb", caption: "Webinar gratuito esta sexta-feira sobre automação de vendas", date: "Amanhã, 10:00", status: "agendado", img: "📊" },
  { id: 3, platform: "ig", caption: "Como reduzir o ciclo de vendas em 40%", date: "23 Abr, 14:30", status: "rascunho", img: "💡" },
  { id: 4, platform: "fb", caption: "Caso de sucesso: empresa X aumentou receita em 3x", date: "24 Abr, 09:00", status: "agendado", img: "🏆" },
];

const recentComments = [
  { id: 1, user: "Maria Silva", avatar: "MS", text: "Adorei! Como faço para experimentar?", post: "Post Lançamento IA", time: "5min", platform: "ig", aiSuggestion: "Olá Maria! Que bom que gostaste 💜 Podes começar grátis em nexcrm.pt/trial. Precisas de ajuda?" },
  { id: 2, user: "João Costa", avatar: "JC", text: "Os preços incluem IVA?", post: "Post Webinar", time: "12min", platform: "fb", aiSuggestion: "Olá João! Sim, todos os preços apresentados já incluem IVA. Posso enviar-te mais detalhes em DM?" },
  { id: 3, user: "Sofia Pereira", avatar: "SP", text: "Vou recomendar à minha equipa!", post: "Caso de sucesso", time: "1h", platform: "ig", aiSuggestion: "Obrigada Sofia! 🙏 Se precisarem de ajuda no onboarding estamos cá." },
];

export const SocialManagerSection = () => {
  const [composer, setComposer] = useState("");
  const [generating, setGenerating] = useState(false);
  const [autoReply, setAutoReply] = useState(true);

  const generateCaption = async () => {
    setGenerating(true);
    const r = await callAI({ action: "caption", prompt: composer || "Novo produto SaaS de CRM com IA", platform: "Instagram", tone: "entusiasmante" });
    setGenerating(false);
    if (r.error) return toast.error(r.error);
    if (r.text) {
      setComposer(r.text);
      toast.success("Legenda gerada por IA");
    }
  };

  const replyComment = async (text: string) => {
    toast.success("Resposta publicada (mock)");
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Alcance 30d", value: "284K", trend: "+18%", icon: Eye, color: "text-info" },
          { label: "Engagement", value: "12.8%", trend: "+4.2%", icon: Heart, color: "text-destructive" },
          { label: "Novos seguidores", value: "+1.2K", trend: "+22%", icon: Users, color: "text-success" },
          { label: "Posts agendados", value: "14", trend: "esta semana", icon: Calendar, color: "text-primary" },
        ].map((k) => (
          <Card key={k.label} className="p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <k.icon className={`w-5 h-5 ${k.color}`} />
              <Badge variant="secondary" className="text-xs">{k.trend}</Badge>
            </div>
            <p className="text-2xl font-bold font-display">{k.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{k.label}</p>
          </Card>
        ))}
      </div>

      {/* Contas conectadas */}
      <Card className="p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg">Contas conectadas</h3>
          <Button size="sm" variant="outline">+ Ligar conta</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((a) => {
            const Icon = a.icon;
            return (
              <div key={a.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-secondary/30">
                <div className={`w-12 h-12 rounded-xl ${a.color} flex items-center justify-center text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.platform} · {a.followers} seguidores</p>
                </div>
                <Badge className="gradient-success text-white">Ativa</Badge>
              </div>
            );
          })}
        </div>
      </Card>

      <Tabs defaultValue="composer">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="composer">Compositor</TabsTrigger>
          <TabsTrigger value="scheduled">Agendados</TabsTrigger>
          <TabsTrigger value="comments">Comentários</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="composer" className="space-y-4 mt-4">
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold">Novo Post</h3>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={generateCaption} disabled={generating}>
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Gerar com IA
                </Button>
              </div>
            </div>
            <Textarea
              value={composer}
              onChange={(e) => setComposer(e.target.value)}
              placeholder="O que queres partilhar hoje?"
              className="min-h-[140px] mb-4"
            />
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Button size="sm" variant="outline"><ImageIcon className="w-4 h-4" /> Adicionar imagem</Button>
              <Button size="sm" variant="outline"><Calendar className="w-4 h-4" /> Agendar</Button>
              <div className="flex gap-1 ml-auto">
                <Badge variant="secondary"><Facebook className="w-3 h-3 mr-1" /> FB</Badge>
                <Badge variant="secondary"><Instagram className="w-3 h-3 mr-1" /> IG</Badge>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Guardar rascunho</Button>
              <Button className="gradient-primary text-white"><Send className="w-4 h-4" /> Publicar agora</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-3 mt-4">
          {scheduledPosts.map((p) => (
            <Card key={p.id} className="p-4 shadow-card flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center text-3xl">{p.img}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{p.caption}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {p.date}</span>
                  <Badge variant={p.status === "agendado" ? "default" : "secondary"} className="text-[10px]">{p.status}</Badge>
                  {p.platform === "ig" ? <Instagram className="w-3 h-3" /> : <Facebook className="w-3 h-3" />}
                </div>
              </div>
              <Button size="sm" variant="ghost">Editar</Button>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="comments" className="space-y-4 mt-4">
          <Card className="p-4 shadow-card flex items-center justify-between">
            <div>
              <p className="font-semibold">Auto-resposta IA</p>
              <p className="text-xs text-muted-foreground">A IA sugere respostas; humano aprova antes de publicar</p>
            </div>
            <Switch checked={autoReply} onCheckedChange={setAutoReply} />
          </Card>
          {recentComments.map((c) => (
            <Card key={c.id} className="p-5 shadow-card">
              <div className="flex items-start gap-3 mb-3">
                <Avatar><AvatarFallback>{c.avatar}</AvatarFallback></Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{c.user}</p>
                    {c.platform === "ig" ? <Instagram className="w-3 h-3 text-pink-500" /> : <Facebook className="w-3 h-3 text-blue-500" />}
                    <span className="text-xs text-muted-foreground">· {c.time} · {c.post}</span>
                  </div>
                  <p className="text-sm mt-1">{c.text}</p>
                </div>
              </div>
              <div className="ml-12 p-3 rounded-lg bg-accent/50 border border-accent">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span className="text-xs font-semibold text-primary">Sugestão IA</span>
                </div>
                <p className="text-sm">{c.aiSuggestion}</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="gradient-primary text-white" onClick={() => replyComment(c.aiSuggestion)}>Aprovar e enviar</Button>
                  <Button size="sm" variant="outline">Editar</Button>
                  <Button size="sm" variant="ghost">Ignorar</Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold">Performance dos últimos 30 dias</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { l: "Posts", v: "42" },
                { l: "Likes", v: "18.3K", icon: ThumbsUp },
                { l: "Comentários", v: "1.2K", icon: MessageCircle },
                { l: "Partilhas", v: "486", icon: Share2 },
              ].map((s) => (
                <div key={s.l} className="p-4 rounded-lg bg-secondary/40">
                  <p className="text-2xl font-bold">{s.v}</p>
                  <p className="text-xs text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
            <div className="h-40 rounded-lg gradient-primary opacity-20 flex items-center justify-center">
              <TrendingUp className="w-16 h-16 text-primary" />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
