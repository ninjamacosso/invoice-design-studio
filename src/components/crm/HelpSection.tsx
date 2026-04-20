import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Book, Video, MessageCircle, Mail, Zap, GitBranch, Bot, Users, BarChart3, Sparkles, ArrowRight, Send, LifeBuoy, FileText, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const categories = [
  { icon: Zap, title: "Começar", desc: "Configurar a tua conta e primeiros passos", articles: 12, color: "from-primary to-primary-glow" },
  { icon: Users, title: "Contactos", desc: "Importar, segmentar e gerir contactos", articles: 18, color: "from-info to-blue-400" },
  { icon: GitBranch, title: "Pipeline", desc: "Configurar fases e gestão de negócios", articles: 9, color: "from-success to-emerald-400" },
  { icon: Bot, title: "Agentes IA", desc: "Treinar e configurar os teus agentes", articles: 24, color: "from-orange-500 to-pink-500" },
  { icon: BarChart3, title: "Relatórios", desc: "Analisar dados e exportar dashboards", articles: 7, color: "from-purple-500 to-pink-500" },
  { icon: LifeBuoy, title: "Resolução", desc: "Resolver problemas comuns", articles: 15, color: "from-warning to-orange-400" },
];

const popular = [
  { title: "Como criar a minha primeira campanha de WhatsApp em massa", time: "5 min" },
  { title: "Configurar o agente Aurora para qualificar leads automaticamente", time: "8 min" },
  { title: "Importar 1000+ contactos a partir de um CSV", time: "3 min" },
  { title: "Personalizar fases do pipeline para o meu processo de vendas", time: "6 min" },
  { title: "Definir limites de confiança da IA por campanha", time: "4 min" },
];

const faqs = [
  { q: "Como funcionam os agentes IA?", a: "Os agentes IA do NexCRM usam modelos de linguagem avançados (GPT, Gemini) para conversar com os teus leads, qualificá-los e mover negócios no pipeline. Cada agente tem um papel específico: Aurora trata SMS/WhatsApp, Vox faz chamadas, Pulse qualifica leads e Scribe resume conversas. Tu defines o briefing, o tom e o limiar de confiança a partir do qual a IA escala para um humano." },
  { q: "Posso editar mensagens antes da IA enviar?", a: "Sim. No modo 'Aprovação' da campanha, todas as mensagens passam por ti antes de serem enviadas. No modo 'Híbrido', só as mensagens com confiança abaixo do limiar definido (padrão 75%) precisam da tua aprovação. No modo 'Auto', a IA envia tudo mas escala automaticamente em casos ambíguos ou de sentimento negativo." },
  { q: "Quantos contactos posso importar?", a: "Depende do teu plano: Starter inclui 1,000 contactos, Business 5,000, Enterprise ilimitados. A importação aceita CSV, Excel ou conexão directa a HubSpot/Salesforce. A IA detecta duplicados e sugere mesclagens automaticamente." },
  { q: "Como ligar o WhatsApp Business?", a: "Vai a Definições → Integrações → Twilio. Vais precisar de uma conta Twilio com WhatsApp Business API aprovada pela Meta. Depois de ligar, escolhes o número e os agentes ficam imediatamente disponíveis para enviar mensagens." },
  { q: "Os meus dados estão seguros?", a: "Sim. Toda a comunicação é encriptada (TLS 1.3), os dados em repouso usam AES-256, fazemos backups automáticos diários e estamos em conformidade com GDPR. Nunca usamos os teus dados para treinar modelos. Podes exportar ou eliminar tudo a qualquer momento em Definições → Segurança." },
  { q: "Posso cancelar a qualquer momento?", a: "Sim, sem perguntas. O cancelamento é imediato a partir de Definições → Faturação. Mantens acesso até ao fim do período pago e podes exportar todos os dados antes de sair." },
  { q: "Existe app móvel?", a: "Sim, temos apps nativas para iOS e Android. Recebes notificações push de respostas, podes aprovar mensagens da IA, editar contactos e ver o pipeline em qualquer lugar. Procura 'NexCRM' nas lojas." },
  { q: "Como contactar suporte?", a: "Chat em directo (canto inferior direito) com tempo médio de resposta de 4 minutos em horário útil. Email para support@nexcrm.com responde em 24h. Clientes Business e Enterprise têm gestor de conta dedicado." },
];

const videos = [
  { title: "Tour de 3 minutos pelo NexCRM", duration: "3:12", views: "12.4K" },
  { title: "Configurar o teu primeiro agente IA", duration: "8:47", views: "8.2K" },
  { title: "Pipeline drag & drop: tudo o que precisas saber", duration: "5:23", views: "6.1K" },
  { title: "Campanhas multi-canal com aprovação humana", duration: "11:08", views: "4.9K" },
];

export const HelpSection = () => {
  const [query, setQuery] = useState("");

  const sendContact = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Mensagem enviada", description: "A nossa equipa responde em até 4 horas." });
  };

  return (
    <div className="space-y-6">
      {/* Hero / Search */}
      <Card className="p-8 shadow-elegant bg-gradient-to-br from-primary/10 via-primary-glow/10 to-transparent border-primary/20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">Como podemos ajudar?</h2>
          <p className="text-muted-foreground mb-6">Pesquisa nos nossos artigos, vê tutoriais ou fala com a equipa</p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar 'criar campanha', 'importar contactos'..."
              className="pl-12 h-14 text-base bg-card shadow-md"
            />
          </div>
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground flex-wrap">
            <span>Popular:</span>
            {["agentes IA", "WhatsApp", "importar CSV", "pipeline"].map((t) => (
              <button key={t} onClick={() => setQuery(t)} className="px-2.5 py-1 rounded-full bg-card border border-border hover:border-primary/50 transition-colors">{t}</button>
            ))}
          </div>
        </div>
      </Card>

      {/* Quick contact cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: MessageCircle, title: "Chat ao vivo", desc: "Resposta em ~4 min", action: "Iniciar chat", badge: "Online", color: "from-success to-emerald-400" },
          { icon: Mail, title: "Email", desc: "Resposta em 24h", action: "support@nexcrm.com", color: "from-info to-blue-400" },
          { icon: Video, title: "Demo guiada", desc: "30 min com especialista", action: "Agendar", color: "from-primary to-primary-glow" },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.title} className="p-5 shadow-card hover:shadow-elegant transition-all hover:-translate-y-1 cursor-pointer">
              <div className="flex items-start gap-4">
                <div className={cn("w-11 h-11 rounded-xl bg-gradient-to-br text-white flex items-center justify-center shrink-0", c.color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-display font-bold">{c.title}</h4>
                    {c.badge && <Badge className="bg-success/15 text-success border-0 text-[10px]"><span className="w-1.5 h-1.5 rounded-full bg-success mr-1 animate-pulse" />{c.badge}</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{c.desc}</p>
                  <button className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                    {c.action} <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-display text-xl font-bold mb-4">Explorar por categoria</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <Card key={c.title} className="p-5 shadow-card hover:shadow-elegant transition-all hover:-translate-y-1 cursor-pointer group">
                <div className={cn("w-11 h-11 rounded-xl bg-gradient-to-br text-white flex items-center justify-center mb-3", c.color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold mb-1">{c.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{c.desc}</p>
                <p className="text-xs font-semibold text-primary group-hover:underline flex items-center gap-1">
                  {c.articles} artigos <ArrowRight className="w-3 h-3" />
                </p>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Popular articles */}
        <Card className="p-6 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display text-lg font-bold flex items-center gap-2"><FileText className="w-5 h-5" />Artigos Populares</h3>
              <p className="text-sm text-muted-foreground">Os mais consultados esta semana</p>
            </div>
          </div>
          <div className="space-y-1">
            {popular.map((a, i) => (
              <button key={i} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent/40 transition-colors text-left group">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">{a.title}</p>
                  <p className="text-xs text-muted-foreground">Leitura de {a.time}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </Card>

        {/* Video tutorials */}
        <Card className="p-6 shadow-card">
          <h3 className="font-display text-lg font-bold flex items-center gap-2 mb-1"><PlayCircle className="w-5 h-5" />Vídeo Tutoriais</h3>
          <p className="text-sm text-muted-foreground mb-5">Aprende ao teu ritmo</p>
          <div className="space-y-3">
            {videos.map((v, i) => (
              <button key={i} className="w-full text-left group">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-lg mb-2 relative overflow-hidden flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary-glow/30 transition-colors">
                  <PlayCircle className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">{v.duration}</span>
                </div>
                <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors">{v.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{v.views} visualizações</p>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* FAQ */}
      <Card className="p-6 shadow-card">
        <h3 className="font-display text-xl font-bold mb-1">Perguntas Frequentes</h3>
        <p className="text-sm text-muted-foreground mb-6">Respostas rápidas às dúvidas mais comuns</p>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left font-semibold hover:text-primary">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>

      {/* Contact form */}
      <Card className="p-6 shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-glow">
              <Send className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">Não encontraste o que procuravas?</h3>
            <p className="text-sm text-muted-foreground mb-4">Envia-nos uma mensagem e a nossa equipa de suporte responde em até 4 horas em dias úteis.</p>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" />support@nexcrm.com</p>
              <p className="flex items-center gap-2"><Book className="w-4 h-4 text-primary" />docs.nexcrm.com</p>
              <p className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-primary" />Chat ao vivo (canto inferior direito)</p>
            </div>
          </div>
          <form onSubmit={sendContact} className="space-y-4">
            <div className="space-y-2"><Label>Assunto</Label><Input placeholder="Ex: Problema com integração Twilio" required /></div>
            <div className="space-y-2"><Label>Categoria</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required defaultValue="">
                <option value="" disabled>Escolhe uma categoria</option>
                <option>Problema técnico</option>
                <option>Dúvida de utilização</option>
                <option>Faturação</option>
                <option>Sugestão de feature</option>
              </select>
            </div>
            <div className="space-y-2"><Label>Descrição</Label><Textarea rows={4} placeholder="Descreve o teu problema ou dúvida com o máximo de detalhe possível..." required /></div>
            <Button type="submit" className="w-full gradient-primary text-white"><Send className="w-4 h-4" />Enviar Mensagem</Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
