import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Shield, CreditCard, Plug, Palette, Users as UsersIcon, Globe, Camera, Check, Trash2, Key, Smartphone, Mail, MessageSquare, Phone, Brain, Zap, Crown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const ProfileTab = () => {
  const [saved, setSaved] = useState(false);
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    toast({ title: "Perfil actualizado", description: "As tuas alterações foram guardadas." });
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={save} className="space-y-6">
      <Card className="p-6 shadow-card">
        <h3 className="font-display text-lg font-bold mb-1">Informação Pessoal</h3>
        <p className="text-sm text-muted-foreground mb-6">Como apareces para a tua equipa e clientes</p>

        <div className="flex items-center gap-6 mb-6">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full gradient-primary text-white text-2xl font-bold flex items-center justify-center shadow-elegant">JM</div>
            <button type="button" className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
          <div>
            <p className="font-semibold">Foto de Perfil</p>
            <p className="text-sm text-muted-foreground mb-2">PNG ou JPG, máx 2MB</p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm">Carregar</Button>
              <Button type="button" variant="ghost" size="sm" className="text-destructive">Remover</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Nome</Label><Input defaultValue="João" /></div>
          <div className="space-y-2"><Label>Apelido</Label><Input defaultValue="Martins" /></div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" defaultValue="joao@nexcrm.com" /></div>
          <div className="space-y-2"><Label>Telefone</Label><Input defaultValue="+351 912 345 678" /></div>
          <div className="space-y-2"><Label>Cargo</Label><Input defaultValue="Director Comercial" /></div>
          <div className="space-y-2">
            <Label>Fuso Horário</Label>
            <Select defaultValue="lisbon">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="lisbon">Europe/Lisbon (UTC+0)</SelectItem>
                <SelectItem value="madrid">Europe/Madrid (UTC+1)</SelectItem>
                <SelectItem value="london">Europe/London (UTC+0)</SelectItem>
                <SelectItem value="ny">America/New_York (UTC-5)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <Label>Bio</Label>
          <Textarea rows={3} defaultValue="Director comercial com 12 anos de experiência em vendas B2B SaaS. Apaixonado por automatização e pipeline data-driven." />
        </div>
      </Card>

      <Card className="p-6 shadow-card">
        <h3 className="font-display text-lg font-bold mb-1">Idioma e Região</h3>
        <p className="text-sm text-muted-foreground mb-6">Personaliza a tua experiência</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Idioma</Label>
            <Select defaultValue="pt">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Moeda</Label>
            <Select defaultValue="usd">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD ($)</SelectItem>
                <SelectItem value="eur">EUR (€)</SelectItem>
                <SelectItem value="gbp">GBP (£)</SelectItem>
                <SelectItem value="brl">BRL (R$)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Formato de Data</Label>
            <Select defaultValue="dmy">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dmy">DD/MM/AAAA</SelectItem>
                <SelectItem value="mdy">MM/DD/AAAA</SelectItem>
                <SelectItem value="ymd">AAAA-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">Cancelar</Button>
        <Button type="submit" className="gradient-primary text-white">
          {saved ? <><Check className="w-4 h-4" />Guardado</> : "Guardar Alterações"}
        </Button>
      </div>
    </form>
  );
};

const NotificationsTab = () => {
  const sections = [
    {
      title: "Email", icon: Mail, items: [
        { label: "Novo contacto criado", desc: "Quando alguém da equipa cria um contacto", on: true },
        { label: "Negócio fechado", desc: "Notificação ao ganhar ou perder um negócio", on: true },
        { label: "Resumo semanal", desc: "Relatório de performance todos os Domingos", on: true },
        { label: "Newsletter NexCRM", desc: "Novidades do produto e dicas", on: false },
      ]
    },
    {
      title: "Push (App)", icon: Smartphone, items: [
        { label: "Mensagens recebidas", desc: "Resposta de cliente em SMS/WhatsApp", on: true },
        { label: "Tarefas atribuídas", desc: "Quando alguém te atribui uma tarefa", on: true },
        { label: "Aprovação IA pendente", desc: "Quando um agente escala para humano", on: true },
      ]
    },
    {
      title: "Agentes IA", icon: Brain, items: [
        { label: "Decisões de alta confiança", desc: "Notificar mesmo quando IA decide sozinha", on: false },
        { label: "Sentimento negativo detectado", desc: "Cliente irritado ou recusa explícita", on: true },
        { label: "Lead qualificado", desc: "Quando IA classifica lead como hot", on: true },
      ]
    },
  ];

  return (
    <div className="space-y-4">
      {sections.map((s) => {
        const Icon = s.icon;
        return (
          <Card key={s.title} className="p-6 shadow-card">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-display text-lg font-bold">{s.title}</h3>
            </div>
            <div className="space-y-1">
              {s.items.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between py-3 gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.on} />
                  </div>
                  {i < s.items.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

const SecurityTab = () => (
  <div className="space-y-4">
    <Card className="p-6 shadow-card">
      <h3 className="font-display text-lg font-bold mb-1">Palavra-passe</h3>
      <p className="text-sm text-muted-foreground mb-6">Última alteração há 47 dias</p>
      <div className="space-y-4 max-w-md">
        <div className="space-y-2"><Label>Palavra-passe actual</Label><Input type="password" /></div>
        <div className="space-y-2"><Label>Nova palavra-passe</Label><Input type="password" /></div>
        <div className="space-y-2"><Label>Confirmar nova palavra-passe</Label><Input type="password" /></div>
        <Button className="gradient-primary text-white">Actualizar Palavra-passe</Button>
      </div>
    </Card>

    <Card className="p-6 shadow-card">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-display text-lg font-bold mb-1 flex items-center gap-2">
            Autenticação de Dois Factores
            <Badge className="bg-success/15 text-success border-0 text-[10px]">Activo</Badge>
          </h3>
          <p className="text-sm text-muted-foreground">Camada extra de segurança ao iniciar sessão</p>
        </div>
        <Switch defaultChecked />
      </div>
      <div className="bg-success/5 border border-success/20 rounded-lg p-4 flex items-center gap-3">
        <Shield className="w-5 h-5 text-success shrink-0" />
        <div className="text-sm">
          <p className="font-semibold">2FA via app autenticadora</p>
          <p className="text-xs text-muted-foreground">Configurado a 12 Mar 2026</p>
        </div>
        <Button variant="outline" size="sm" className="ml-auto">Gerir</Button>
      </div>
    </Card>

    <Card className="p-6 shadow-card">
      <h3 className="font-display text-lg font-bold mb-1">Sessões Activas</h3>
      <p className="text-sm text-muted-foreground mb-6">Dispositivos onde tens sessão iniciada</p>
      <div className="space-y-3">
        {[
          { device: "MacBook Pro · Safari", location: "Lisboa, Portugal", time: "Activa agora", current: true },
          { device: "iPhone 15 · App NexCRM", location: "Lisboa, Portugal", time: "há 2 horas" },
          { device: "Chrome · Windows", location: "Porto, Portugal", time: "há 3 dias" },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-accent/30 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{s.device} {s.current && <Badge className="ml-2 bg-primary/15 text-primary border-0 text-[9px]">Esta sessão</Badge>}</p>
              <p className="text-xs text-muted-foreground">{s.location} · {s.time}</p>
            </div>
            {!s.current && <Button variant="ghost" size="sm" className="text-destructive">Terminar</Button>}
          </div>
        ))}
      </div>
      <Button variant="outline" className="mt-4 w-full">Terminar todas as outras sessões</Button>
    </Card>

    <Card className="p-6 shadow-card border-destructive/30">
      <h3 className="font-display text-lg font-bold mb-1 text-destructive">Zona de Perigo</h3>
      <p className="text-sm text-muted-foreground mb-6">Acções irreversíveis para a tua conta</p>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10">
          Exportar todos os meus dados
        </Button>
        <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10">
          <Trash2 className="w-4 h-4" />Eliminar conta
        </Button>
      </div>
    </Card>
  </div>
);

const IntegrationsTab = () => {
  const integrations = [
    { name: "Twilio", desc: "SMS, WhatsApp e chamadas de voz", icon: Phone, status: "disconnected", color: "from-red-500 to-rose-500" },
    { name: "Lovable AI", desc: "Modelos GPT/Gemini para os agentes", icon: Sparkles, status: "connected", color: "from-primary to-primary-glow" },
    { name: "Google Calendar", desc: "Sincronizar reuniões e agenda", icon: Globe, status: "connected", color: "from-info to-blue-400" },
    { name: "Slack", desc: "Notificações no canal da equipa", icon: MessageSquare, status: "disconnected", color: "from-purple-500 to-pink-500" },
    { name: "Stripe", desc: "Pagamentos e gestão de subscrições", icon: CreditCard, status: "disconnected", color: "from-indigo-500 to-purple-500" },
    { name: "HubSpot", desc: "Importar contactos legacy", icon: UsersIcon, status: "disconnected", color: "from-orange-500 to-red-500" },
  ];

  return (
    <div className="space-y-4">
      <Card className="p-6 shadow-card bg-gradient-to-br from-primary/5 via-primary-glow/5 to-transparent border-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Plug className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold">Integrações</h3>
            <p className="text-sm text-muted-foreground">Liga o NexCRM às tuas ferramentas favoritas</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((i) => {
          const Icon = i.icon;
          const isConnected = i.status === "connected";
          return (
            <Card key={i.name} className="p-5 shadow-card hover:shadow-elegant transition-all">
              <div className="flex items-start gap-4">
                <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br text-white flex items-center justify-center shrink-0", i.color)}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-display font-bold">{i.name}</h4>
                    {isConnected && <Badge className="bg-success/15 text-success border-0 text-[10px]"><Check className="w-3 h-3 mr-0.5" />Ligado</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{i.desc}</p>
                  <Button
                    size="sm"
                    variant={isConnected ? "outline" : "default"}
                    className={cn(!isConnected && "gradient-primary text-white")}
                    onClick={() => toast({ title: isConnected ? "Integração gerida" : "A iniciar ligação...", description: i.name })}
                  >
                    {isConnected ? "Configurar" : "Ligar"}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 shadow-card">
        <h3 className="font-display text-lg font-bold mb-1 flex items-center gap-2"><Key className="w-5 h-5" />Chaves de API</h3>
        <p className="text-sm text-muted-foreground mb-4">Gera tokens para integrar o NexCRM com sistemas próprios</p>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-muted/30">
            <div className="flex-1 min-w-0">
              <p className="font-mono text-sm truncate">nxc_live_••••••••••••••••a8f3</p>
              <p className="text-xs text-muted-foreground">Criado 12 Mar · Última utilização há 4h</p>
            </div>
            <Button variant="ghost" size="sm">Copiar</Button>
            <Button variant="ghost" size="sm" className="text-destructive">Revogar</Button>
          </div>
        </div>
        <Button variant="outline" className="mt-4">+ Nova Chave de API</Button>
      </Card>
    </div>
  );
};

const TeamTab = () => {
  const members = [
    { name: "João Martins", email: "joao@nexcrm.com", role: "Admin", initials: "JM", color: "bg-primary" },
    { name: "Ana Ferreira", email: "ana@nexcrm.com", role: "Manager", initials: "AF", color: "bg-info" },
    { name: "Carlos Mendes", email: "carlos@nexcrm.com", role: "Sales", initials: "CM", color: "bg-warning" },
    { name: "Luísa Costa", email: "luisa@nexcrm.com", role: "Sales", initials: "LC", color: "bg-success" },
  ];

  return (
    <div className="space-y-4">
      <Card className="p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display text-lg font-bold">Membros da Equipa</h3>
            <p className="text-sm text-muted-foreground">{members.length} membros activos · 6 lugares disponíveis no plano</p>
          </div>
          <Button className="gradient-primary text-white">Convidar Membro</Button>
        </div>

        <div className="space-y-2">
          {members.map((m) => (
            <div key={m.email} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-accent/30 transition-colors">
              <div className={cn("w-10 h-10 rounded-full text-white text-xs font-bold flex items-center justify-center", m.color)}>{m.initials}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.email}</p>
              </div>
              <Select defaultValue={m.role.toLowerCase()}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 shadow-card">
        <h3 className="font-display text-lg font-bold mb-1">Convites Pendentes</h3>
        <p className="text-sm text-muted-foreground mb-4">2 convites enviados, à espera de aceitação</p>
        <div className="space-y-2">
          {[
            { email: "ricardo@nexcrm.com", role: "Sales", sent: "há 2 dias" },
            { email: "beatriz@nexcrm.com", role: "Manager", sent: "há 5 dias" },
          ].map((inv) => (
            <div key={inv.email} className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-border bg-muted/30">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"><Mail className="w-4 h-4 text-muted-foreground" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{inv.email}</p>
                <p className="text-xs text-muted-foreground">{inv.role} · enviado {inv.sent}</p>
              </div>
              <Button variant="ghost" size="sm">Reenviar</Button>
              <Button variant="ghost" size="sm" className="text-destructive">Cancelar</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const BillingTab = () => (
  <div className="space-y-4">
    <Card className="p-6 shadow-card bg-gradient-to-br from-primary/10 via-primary-glow/10 to-transparent border-primary/20">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Plano actual</p>
            <h3 className="font-display text-2xl font-bold">Business</h3>
            <p className="text-sm text-muted-foreground mt-1">10 utilizadores · 5,000 contactos · agentes IA ilimitados</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl font-bold">$149<span className="text-sm text-muted-foreground font-normal">/mês</span></p>
          <p className="text-xs text-muted-foreground">Próxima cobrança: 21 Mai 2026</p>
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        <Button className="gradient-primary text-white"><Zap className="w-4 h-4" />Fazer Upgrade</Button>
        <Button variant="outline">Ver outros planos</Button>
      </div>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { label: "Utilizadores", current: 4, max: 10 },
        { label: "Contactos", current: 248, max: 5000 },
        { label: "Mensagens IA / mês", current: 1847, max: 10000 },
      ].map((u) => {
        const pct = (u.current / u.max) * 100;
        return (
          <Card key={u.label} className="p-5 shadow-card">
            <p className="text-xs text-muted-foreground mb-1">{u.label}</p>
            <p className="font-display text-2xl font-bold">{u.current.toLocaleString()} <span className="text-sm text-muted-foreground font-normal">/ {u.max.toLocaleString()}</span></p>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-3">
              <div className="h-full gradient-primary rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
          </Card>
        );
      })}
    </div>

    <Card className="p-6 shadow-card">
      <h3 className="font-display text-lg font-bold mb-1">Método de Pagamento</h3>
      <p className="text-sm text-muted-foreground mb-4">Cartão usado para cobranças automáticas</p>
      <div className="flex items-center gap-3 p-4 rounded-lg border border-border/50 bg-muted/30">
        <div className="w-12 h-8 rounded gradient-primary flex items-center justify-center text-white text-xs font-bold">VISA</div>
        <div className="flex-1">
          <p className="font-semibold text-sm">•••• •••• •••• 4242</p>
          <p className="text-xs text-muted-foreground">Expira 09/2027 · João Martins</p>
        </div>
        <Button variant="outline" size="sm">Alterar</Button>
      </div>
    </Card>

    <Card className="p-6 shadow-card">
      <h3 className="font-display text-lg font-bold mb-4">Histórico de Faturas</h3>
      <div className="space-y-2">
        {[
          { date: "21 Abr 2026", amount: "$149.00", status: "Pago", num: "INV-2026-004" },
          { date: "21 Mar 2026", amount: "$149.00", status: "Pago", num: "INV-2026-003" },
          { date: "21 Fev 2026", amount: "$149.00", status: "Pago", num: "INV-2026-002" },
          { date: "21 Jan 2026", amount: "$149.00", status: "Pago", num: "INV-2026-001" },
        ].map((inv) => (
          <div key={inv.num} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/30 transition-colors">
            <div className="flex-1">
              <p className="font-mono text-sm font-semibold">{inv.num}</p>
              <p className="text-xs text-muted-foreground">{inv.date}</p>
            </div>
            <Badge className="bg-success/15 text-success border-0">{inv.status}</Badge>
            <p className="font-semibold w-20 text-right">{inv.amount}</p>
            <Button variant="ghost" size="sm">Descarregar</Button>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const AppearanceTab = () => {
  const [theme, setTheme] = useState("light");
  return (
    <Card className="p-6 shadow-card">
      <h3 className="font-display text-lg font-bold mb-1">Tema da Aplicação</h3>
      <p className="text-sm text-muted-foreground mb-6">Escolhe como o NexCRM aparece para ti</p>

      <div className="grid grid-cols-3 gap-4 max-w-2xl">
        {[
          { key: "light", label: "Claro", bg: "bg-white", inner: "bg-slate-100" },
          { key: "dark", label: "Escuro", bg: "bg-slate-900", inner: "bg-slate-800" },
          { key: "system", label: "Sistema", bg: "bg-gradient-to-br from-white to-slate-900", inner: "bg-slate-500" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => { setTheme(t.key); toast({ title: "Tema alterado", description: `Tema definido para ${t.label}.` }); }}
            className={cn(
              "p-3 rounded-xl border-2 transition-all text-left",
              theme === t.key ? "border-primary shadow-elegant" : "border-border hover:border-primary/50"
            )}
          >
            <div className={cn("h-20 rounded-lg mb-3 flex items-center justify-center", t.bg)}>
              <div className={cn("w-12 h-12 rounded", t.inner)} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{t.label}</p>
              {theme === t.key && <Check className="w-4 h-4 text-primary" />}
            </div>
          </button>
        ))}
      </div>

      <Separator className="my-6" />

      <h3 className="font-display text-lg font-bold mb-1">Densidade da Interface</h3>
      <p className="text-sm text-muted-foreground mb-4">Controla o espaçamento entre elementos</p>
      <Select defaultValue="comfortable">
        <SelectTrigger className="max-w-xs"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="compact">Compacta</SelectItem>
          <SelectItem value="comfortable">Confortável (padrão)</SelectItem>
          <SelectItem value="spacious">Espaçada</SelectItem>
        </SelectContent>
      </Select>

      <Separator className="my-6" />

      <h3 className="font-display text-lg font-bold mb-1">Animações</h3>
      <div className="flex items-center justify-between py-3">
        <div>
          <p className="font-medium text-sm">Reduzir animações</p>
          <p className="text-xs text-muted-foreground">Útil se preferes interfaces mais estáticas</p>
        </div>
        <Switch />
      </div>
    </Card>
  );
};

export const SettingsSection = () => (
  <Tabs defaultValue="profile" className="space-y-6">
    <TabsList className="bg-card border border-border h-auto p-1 flex-wrap">
      <TabsTrigger value="profile" className="data-[state=active]:gradient-primary data-[state=active]:text-white"><User className="w-4 h-4" />Perfil</TabsTrigger>
      <TabsTrigger value="notifications" className="data-[state=active]:gradient-primary data-[state=active]:text-white"><Bell className="w-4 h-4" />Notificações</TabsTrigger>
      <TabsTrigger value="security" className="data-[state=active]:gradient-primary data-[state=active]:text-white"><Shield className="w-4 h-4" />Segurança</TabsTrigger>
      <TabsTrigger value="appearance" className="data-[state=active]:gradient-primary data-[state=active]:text-white"><Palette className="w-4 h-4" />Aparência</TabsTrigger>
      <TabsTrigger value="integrations" className="data-[state=active]:gradient-primary data-[state=active]:text-white"><Plug className="w-4 h-4" />Integrações</TabsTrigger>
      <TabsTrigger value="team" className="data-[state=active]:gradient-primary data-[state=active]:text-white"><UsersIcon className="w-4 h-4" />Equipa</TabsTrigger>
      <TabsTrigger value="billing" className="data-[state=active]:gradient-primary data-[state=active]:text-white"><CreditCard className="w-4 h-4" />Faturação</TabsTrigger>
    </TabsList>

    <TabsContent value="profile"><ProfileTab /></TabsContent>
    <TabsContent value="notifications"><NotificationsTab /></TabsContent>
    <TabsContent value="security"><SecurityTab /></TabsContent>
    <TabsContent value="appearance"><AppearanceTab /></TabsContent>
    <TabsContent value="integrations"><IntegrationsTab /></TabsContent>
    <TabsContent value="team"><TeamTab /></TabsContent>
    <TabsContent value="billing"><BillingTab /></TabsContent>
  </Tabs>
);
