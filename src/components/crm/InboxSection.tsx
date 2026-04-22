import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Send, Search, Phone, Video, MoreVertical, Paperclip, Smile, Loader2, Bot, User as UserIcon, CheckCheck, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { callAI } from "@/lib/ai";
import { toast } from "sonner";
import { useConversations, useMessages, useConversationMutations, useContacts } from "@/hooks/useCRM";
import type { Database } from "@/integrations/supabase/types";

type Channel = Database["public"]["Enums"]["channel_type"];

const channelMeta: Record<Channel, { color: string; label: string }> = {
  whatsapp: { color: "bg-green-500", label: "WhatsApp" },
  instagram: { color: "bg-pink-500", label: "Instagram" },
  facebook: { color: "bg-blue-500", label: "Messenger" },
  sms: { color: "bg-purple-500", label: "SMS" },
  email: { color: "bg-orange-500", label: "Email" },
};

const initials = (s: string) => s.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();

export const InboxSection = () => {
  const [activeChannel, setActiveChannel] = useState<"all" | Channel>("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ contact_id: "", channel: "whatsapp" as Channel, subject: "" });

  const { data: conversations = [] } = useConversations();
  const { data: messages = [] } = useMessages(activeId);
  const { data: contacts = [] } = useContacts();
  const { sendMessage, createConversation, updateConversation, markRead } = useConversationMutations();

  const filtered = useMemo(() => conversations.filter(c => {
    const matchCh = activeChannel === "all" || c.channel === activeChannel;
    const q = search.toLowerCase();
    const matchQ = !q || (c.contacts?.full_name ?? "").toLowerCase().includes(q) || (c.subject ?? "").toLowerCase().includes(q);
    return matchCh && matchQ;
  }), [conversations, activeChannel, search]);

  useEffect(() => {
    if (!activeId && filtered.length > 0) setActiveId(filtered[0].id);
  }, [filtered, activeId]);

  useEffect(() => {
    if (activeId) markRead.mutate(activeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  const activeConv = conversations.find(c => c.id === activeId);

  const channelCounts = useMemo(() => {
    const counts: Record<string, number> = { all: conversations.length };
    (Object.keys(channelMeta) as Channel[]).forEach(ch => {
      counts[ch] = conversations.filter(c => c.channel === ch).length;
    });
    return counts;
  }, [conversations]);

  const send = async (text: string) => {
    if (!text.trim() || !activeId) return;
    await sendMessage.mutateAsync({ conversationId: activeId, content: text, direction: "outbound" });
    setInput("");
    setAiSuggestion("");
  };

  const suggestReply = async () => {
    if (!activeId) return;
    setLoadingAi(true);
    const last = messages[messages.length - 1]?.content ?? "";
    const r = await callAI({
      action: "reply",
      prompt: `Responde a esta mensagem do cliente: "${last}"`,
      context: `Cliente: ${activeConv?.contacts?.full_name ?? "—"}, canal: ${activeConv ? channelMeta[activeConv.channel].label : ""}`,
      tone: "profissional e cordial",
    });
    setLoadingAi(false);
    if (r.error) return toast.error(r.error);
    if (r.text) setAiSuggestion(r.text);
  };

  const toggleHandler = async () => {
    if (!activeConv) return;
    await updateConversation.mutateAsync({ id: activeConv.id, handler: activeConv.handler === "human" ? "bot" : "human" });
  };

  const submitNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.contact_id) return toast.error("Escolhe um contacto");
    const conv = await createConversation.mutateAsync({
      contact_id: form.contact_id,
      channel: form.channel,
      subject: form.subject.trim() || null,
      handler: "human",
    });
    setActiveId(conv.id);
    setOpen(false);
    setForm({ contact_id: "", channel: "whatsapp", subject: "" });
  };

  return (
    <>
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-180px)]">
      {/* Channels */}
      <Card className="col-span-12 md:col-span-2 p-3 shadow-card">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground px-2 mb-2">Canais</p>
        <div className="space-y-1">
          <button onClick={() => setActiveChannel("all")} className={cn("w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors", activeChannel === "all" ? "bg-accent text-accent-foreground font-semibold" : "hover:bg-secondary")}>
            <span>Todos</span>
            <Badge variant="secondary" className="text-[10px]">{channelCounts.all}</Badge>
          </button>
          {(Object.entries(channelMeta) as [Channel, typeof channelMeta[Channel]][]).map(([ch, meta]) => (
            <button key={ch} onClick={() => setActiveChannel(ch)} className={cn("w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors", activeChannel === ch ? "bg-accent text-accent-foreground font-semibold" : "hover:bg-secondary")}>
              <span className="flex items-center gap-2"><span className={cn("w-2 h-2 rounded-full", meta.color)} />{meta.label}</span>
              <Badge variant="secondary" className="text-[10px]">{channelCounts[ch] ?? 0}</Badge>
            </button>
          ))}
        </div>
      </Card>

      {/* Conversations list */}
      <Card className="col-span-12 md:col-span-3 shadow-card flex flex-col">
        <div className="p-3 border-b space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Procurar..." className="pl-9" />
          </div>
          <Button size="sm" className="w-full gradient-primary text-white" onClick={() => setOpen(true)}><Plus className="w-4 h-4" /> Nova conversa</Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filtered.length === 0 && <p className="text-xs text-muted-foreground text-center p-4">Sem conversas.</p>}
            {filtered.map((c) => {
              const meta = channelMeta[c.channel];
              const name = c.contacts?.full_name ?? c.subject ?? "Conversa";
              return (
                <button key={c.id} onClick={() => setActiveId(c.id)} className={cn("w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors", activeId === c.id ? "bg-accent" : "hover:bg-secondary")}>
                  <div className="relative">
                    <Avatar><AvatarFallback>{initials(name)}</AvatarFallback></Avatar>
                    <span className={cn("absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background", meta.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm truncate">{name}</p>
                      <span className="text-[10px] text-muted-foreground shrink-0">{c.last_message_at ? new Date(c.last_message_at).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }) : ""}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{c.last_message_preview ?? "Sem mensagens ainda"}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {c.handler === "bot" ? (
                        <Badge className="gradient-primary text-white text-[9px] px-1.5 py-0"><Bot className="w-2.5 h-2.5 mr-0.5" />IA</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0"><UserIcon className="w-2.5 h-2.5 mr-0.5" />Humano</Badge>
                      )}
                      {(c.unread_count ?? 0) > 0 && <Badge className="bg-destructive text-white text-[9px] ml-auto">{c.unread_count}</Badge>}
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
        {!activeConv ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">Seleciona ou cria uma conversa</div>
        ) : (
          <>
            <div className="p-4 border-b flex items-center gap-3">
              <Avatar><AvatarFallback>{initials(activeConv.contacts?.full_name ?? "?")}</AvatarFallback></Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{activeConv.contacts?.full_name ?? activeConv.subject ?? "Conversa"}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className={cn("w-2 h-2 rounded-full", channelMeta[activeConv.channel].color)} />
                  {channelMeta[activeConv.channel].label} · {activeConv.handler === "bot" ? "Gerido por IA" : "Atendimento humano"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Bot</span>
                <Switch checked={activeConv.handler === "bot"} onCheckedChange={toggleHandler} />
              </div>
              <Button size="icon" variant="ghost"><Phone className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost"><Video className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost"><MoreVertical className="w-4 h-4" /></Button>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Sem mensagens. Envia a primeira ↓</p>}
                {messages.map((m) => (
                  <div key={m.id} className={cn("flex", m.direction === "inbound" ? "justify-start" : "justify-end")}>
                    <div className={cn("max-w-[70%] rounded-2xl px-4 py-2.5 text-sm", m.direction === "inbound" ? "bg-secondary" : m.is_ai ? "gradient-primary text-white" : "bg-primary text-primary-foreground")}>
                      {m.is_ai && <div className="flex items-center gap-1 mb-1 text-[10px] opacity-90"><Bot className="w-3 h-3" /> Resposta IA</div>}
                      <p>{m.content}</p>
                      <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-70">
                        {new Date(m.created_at).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}
                        {m.direction === "outbound" && <CheckCheck className="w-3 h-3" />}
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
                  <Button size="sm" variant="outline" onClick={() => { setInput(aiSuggestion); setAiSuggestion(""); }}>Editar</Button>
                  <Button size="sm" variant="ghost" onClick={() => setAiSuggestion("")}>Descartar</Button>
                </div>
              </div>
            )}

            <div className="p-3 border-t flex items-center gap-2">
              <Button size="icon" variant="ghost"><Paperclip className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" onClick={suggestReply} disabled={loadingAi || messages.length === 0} title="Sugestão IA">
                {loadingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-primary" />}
              </Button>
              <Input
                placeholder="Escreve uma mensagem..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(input)}
                maxLength={2000}
              />
              <Button size="icon" variant="ghost"><Smile className="w-4 h-4" /></Button>
              <Button className="gradient-primary text-white" onClick={() => send(input)} disabled={sendMessage.isPending}><Send className="w-4 h-4" /></Button>
            </div>
          </>
        )}
      </Card>
    </div>

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader><DialogTitle>Nova conversa</DialogTitle></DialogHeader>
        <form onSubmit={submitNew} className="space-y-4">
          <div>
            <Label>Contacto *</Label>
            <Select value={form.contact_id} onValueChange={(v) => setForm({ ...form, contact_id: v })}>
              <SelectTrigger><SelectValue placeholder="Escolhe um contacto" /></SelectTrigger>
              <SelectContent>{contacts.map(c => <SelectItem key={c.id} value={c.id}>{c.full_name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Canal</Label>
            <Select value={form.channel} onValueChange={(v) => setForm({ ...form, channel: v as Channel })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{(Object.entries(channelMeta) as [Channel, typeof channelMeta[Channel]][]).map(([k, m]) => <SelectItem key={k} value={k}>{m.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Assunto</Label><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Opcional" maxLength={200} /></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" className="gradient-primary text-white">Criar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
};
