import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, Search, Phone, Video, MoreVertical, Paperclip, Smile, MessageSquare, Mail, Loader2, Bot, User as UserIcon, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { callAI } from "@/lib/ai";
import { toast } from "sonner";

const channels = [
  { id: "all", label: "Todos", count: 12 },
  { id: "wa", label: "WhatsApp", count: 5, color: "bg-green-500" },
  { id: "ig", label: "Instagram", count: 3, color: "bg-pink-500" },
  { id: "fb", label: "Messenger", count: 2, color: "bg-blue-500" },
  { id: "sms", label: "SMS", count: 1, color: "bg-purple-500" },
  { id: "email", label: "Email", count: 1, color: "bg-orange-500" },
];

const conversations = [
  { id: 1, name: "Maria Silva", channel: "wa", avatar: "MS", last: "Obrigada! Vou testar agora.", time: "2min", unread: 0, agent: "ai", assigned: "IA Bot" },
  { id: 2, name: "João Costa", channel: "ig", avatar: "JC", last: "Quanto custa o plano enterprise?", time: "8min", unread: 2, agent: "human", assigned: "Ana Ferreira" },
  { id: 3, name: "Sofia Pereira", channel: "wa", avatar: "SP", last: "Podem fazer demo amanhã?", time: "15min", unread: 1, agent: "ai", assigned: "IA Bot" },
  { id: 4, name: "Ricardo Santos", channel: "fb", avatar: "RS", last: "Gostei muito da apresentação", time: "1h", unread: 0, agent: "human", assigned: "João Martins" },
  { id: 5, name: "Inês Almeida", channel: "email", avatar: "IA", last: "Re: Proposta comercial", time: "2h", unread: 0, agent: "human", assigned: "Ana Ferreira" },
  { id: 6, name: "+351 912 345 678", channel: "sms", avatar: "?", last: "STOP", time: "3h", unread: 0, agent: "ai", assigned: "IA Bot" },
];

const initialMessages = [
  { id: 1, from: "them", text: "Olá! Vi a vossa publicação sobre o NexCRM e fiquei interessada.", time: "10:24" },
  { id: 2, from: "ai", text: "Olá Maria! 👋 Obrigada pelo interesse. O NexCRM ajuda equipas a gerir clientes e automatizar vendas com IA. Que tipo de empresa tens?", time: "10:24" },
  { id: 3, from: "them", text: "Tenho uma agência de marketing com 12 pessoas.", time: "10:25" },
  { id: 4, from: "ai", text: "Perfeito para o vosso tamanho! O plano Growth inclui pipeline ilimitado, integração com email e 3 agentes IA. €49/utilizador/mês. Queres uma demo de 15 min?", time: "10:25" },
  { id: 5, from: "them", text: "Sim, amanhã às 15h?", time: "10:26" },
  { id: 6, from: "ai", text: "Marcado ✅ Envio convite por email já. Mais alguma dúvida?", time: "10:26" },
  { id: 7, from: "them", text: "Obrigada! Vou testar agora.", time: "10:28" },
];

const channelMeta: Record<string, { color: string; label: string }> = {
  wa: { color: "bg-green-500", label: "WhatsApp" },
  ig: { color: "bg-pink-500", label: "Instagram" },
  fb: { color: "bg-blue-500", label: "Messenger" },
  sms: { color: "bg-purple-500", label: "SMS" },
  email: { color: "bg-orange-500", label: "Email" },
};

export const InboxSection = () => {
  const [activeChannel, setActiveChannel] = useState("all");
  const [activeConv, setActiveConv] = useState(conversations[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  const filtered = activeChannel === "all" ? conversations : conversations.filter((c) => c.channel === activeChannel);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { id: Date.now(), from: "me", text, time: new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }) }]);
    setInput("");
    setAiSuggestion("");
  };

  const suggestReply = async () => {
    setLoadingAi(true);
    const last = messages[messages.length - 1]?.text ?? "";
    const r = await callAI({
      action: "reply",
      prompt: `Responde a esta mensagem do cliente: "${last}"`,
      context: `Cliente: ${activeConv.name}, canal: ${channelMeta[activeConv.channel]?.label}`,
      tone: "profissional e cordial",
    });
    setLoadingAi(false);
    if (r.error) return toast.error(r.error);
    if (r.text) setAiSuggestion(r.text);
  };

  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-180px)]">
      {/* Channels */}
      <Card className="col-span-12 md:col-span-2 p-3 shadow-card">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground px-2 mb-2">Canais</p>
        <div className="space-y-1">
          {channels.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                activeChannel === ch.id ? "bg-accent text-accent-foreground font-semibold" : "hover:bg-secondary"
              )}
            >
              <span className="flex items-center gap-2">
                {ch.color && <span className={cn("w-2 h-2 rounded-full", ch.color)} />}
                {ch.label}
              </span>
              <Badge variant="secondary" className="text-[10px]">{ch.count}</Badge>
            </button>
          ))}
        </div>
      </Card>

      {/* Conversations list */}
      <Card className="col-span-12 md:col-span-3 shadow-card flex flex-col">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Procurar..." className="pl-9" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filtered.map((c) => {
              const ch = channelMeta[c.channel];
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveConv(c)}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors",
                    activeConv.id === c.id ? "bg-accent" : "hover:bg-secondary"
                  )}
                >
                  <div className="relative">
                    <Avatar><AvatarFallback>{c.avatar}</AvatarFallback></Avatar>
                    <span className={cn("absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background", ch.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm truncate">{c.name}</p>
                      <span className="text-[10px] text-muted-foreground shrink-0">{c.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{c.last}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {c.agent === "ai" ? (
                        <Badge className="gradient-primary text-white text-[9px] px-1.5 py-0"><Bot className="w-2.5 h-2.5 mr-0.5" />IA</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0"><UserIcon className="w-2.5 h-2.5 mr-0.5" />{c.assigned}</Badge>
                      )}
                      {c.unread > 0 && <Badge className="bg-destructive text-white text-[9px] ml-auto">{c.unread}</Badge>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat panel */}
      <Card className="col-span-12 md:col-span-7 shadow-card flex flex-col">
        <div className="p-4 border-b flex items-center gap-3">
          <Avatar><AvatarFallback>{activeConv.avatar}</AvatarFallback></Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">{activeConv.name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className={cn("w-2 h-2 rounded-full", channelMeta[activeConv.channel]?.color)} />
              {channelMeta[activeConv.channel]?.label} · {activeConv.agent === "ai" ? "Gerido por IA" : `Atribuído a ${activeConv.assigned}`}
            </p>
          </div>
          <Button size="icon" variant="ghost"><Phone className="w-4 h-4" /></Button>
          <Button size="icon" variant="ghost"><Video className="w-4 h-4" /></Button>
          <Button size="icon" variant="ghost"><MoreVertical className="w-4 h-4" /></Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex", m.from === "them" ? "justify-start" : "justify-end")}>
                <div className={cn(
                  "max-w-[70%] rounded-2xl px-4 py-2.5 text-sm",
                  m.from === "them" ? "bg-secondary" : m.from === "ai" ? "gradient-primary text-white" : "bg-primary text-primary-foreground"
                )}>
                  {m.from === "ai" && <div className="flex items-center gap-1 mb-1 text-[10px] opacity-90"><Bot className="w-3 h-3" /> Resposta automática IA</div>}
                  <p>{m.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-70">
                    {m.time} {m.from !== "them" && <CheckCheck className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {aiSuggestion && (
          <div className="mx-4 mb-2 p-3 rounded-lg bg-accent border border-primary/30">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary">Sugestão IA</span>
            </div>
            <p className="text-sm mb-2">{aiSuggestion}</p>
            <div className="flex gap-2">
              <Button size="sm" className="gradient-primary text-white" onClick={() => send(aiSuggestion)}>Enviar</Button>
              <Button size="sm" variant="outline" onClick={() => setInput(aiSuggestion)}>Editar</Button>
              <Button size="sm" variant="ghost" onClick={() => setAiSuggestion("")}>Descartar</Button>
            </div>
          </div>
        )}

        <div className="p-3 border-t flex items-center gap-2">
          <Button size="icon" variant="ghost"><Paperclip className="w-4 h-4" /></Button>
          <Button size="icon" variant="ghost" onClick={suggestReply} disabled={loadingAi} title="Sugestão IA">
            {loadingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-primary" />}
          </Button>
          <Input
            placeholder="Escreve uma mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
          />
          <Button size="icon" variant="ghost"><Smile className="w-4 h-4" /></Button>
          <Button className="gradient-primary text-white" onClick={() => send(input)}><Send className="w-4 h-4" /></Button>
        </div>
      </Card>
    </div>
  );
};
