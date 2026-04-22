import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Heart, MessageCircle, Share2, TrendingUp, Sparkles, Send, Image as ImageIcon, Clock, Facebook, Instagram, BarChart3, Users, Eye, ThumbsUp, Loader2, Trash2 } from "lucide-react";
import { callAI } from "@/lib/ai";
import { toast } from "sonner";
import { useSocialAccounts, useSocialPosts, useSocialComments, useSocialMutations, useConversationMutations } from "@/hooks/useCRM";
import type { Database } from "@/integrations/supabase/types";

type Platform = Database["public"]["Enums"]["social_platform"];

const platformIcon = (p: Platform) => p === "facebook" ? Facebook : Instagram;
const platformColor = (p: Platform) => p === "facebook" ? "bg-blue-500" : "bg-pink-500";

export const SocialManagerSection = () => {
  const [composer, setComposer] = useState("");
  const [generating, setGenerating] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>(["instagram", "facebook"]);

  const { data: accounts = [] } = useSocialAccounts();
  const { data: posts = [] } = useSocialPosts();
  const { data: comments = [] } = useSocialComments();
  const { createPost, updatePost, deletePost, updateComment } = useSocialMutations();
  const { createConversation } = useConversationMutations();

  const generateCaption = async () => {
    setGenerating(true);
    const r = await callAI({ action: "caption", prompt: composer || "Novo produto SaaS de CRM com IA", platform: "Instagram", tone: "entusiasmante" });
    setGenerating(false);
    if (r.error) return toast.error(r.error);
    if (r.text) { setComposer(r.text); toast.success("Legenda gerada por IA"); }
  };

  const togglePlatform = (p: Platform) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const publish = async (status: "draft" | "scheduled" | "published") => {
    if (!composer.trim()) return toast.error("Escreve uma legenda");
    if (platforms.length === 0) return toast.error("Escolhe pelo menos uma plataforma");
    await createPost.mutateAsync({
      caption: composer.trim(),
      platforms,
      scheduled_at: scheduledAt || null,
      status,
    });
    setComposer("");
    setScheduledAt("");
  };

  const replyComment = async (commentId: string, text: string, contactId: string | null) => {
    // marca como respondido + cria conversa se houver contacto
    await updateComment.mutateAsync({ id: commentId, status: "replied" });
    if (contactId) {
      await createConversation.mutateAsync({
        contact_id: contactId,
        channel: comments.find(c => c.id === commentId)?.platform === "instagram" ? "instagram" : "facebook",
        subject: "Resposta a comentário",
        handler: "human",
        last_message_preview: text.slice(0, 140),
      });
    }
    toast.success("Resposta publicada");
  };

  const reach = posts.reduce((s, p) => s + (p.likes ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total likes", value: reach.toString(), icon: Heart, color: "text-destructive" },
          { label: "Posts publicados", value: posts.filter(p => p.status === "published").length.toString(), icon: Eye, color: "text-info" },
          { label: "Posts agendados", value: posts.filter(p => p.status === "scheduled").length.toString(), icon: Calendar, color: "text-primary" },
          { label: "Comentários pendentes", value: comments.filter(c => c.status === "pending").length.toString(), icon: MessageCircle, color: "text-warning" },
        ].map((k) => (
          <Card key={k.label} className="p-5 shadow-card">
            <k.icon className={`w-5 h-5 ${k.color} mb-3`} />
            <p className="text-2xl font-bold font-display">{k.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{k.label}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg">Contas conectadas</h3>
          <Button size="sm" variant="outline">+ Ligar conta</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.length === 0 && <p className="text-sm text-muted-foreground col-span-2">Sem contas ligadas ainda.</p>}
          {accounts.map((a) => {
            const Icon = platformIcon(a.platform);
            return (
              <div key={a.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-secondary/30">
                <div className={`w-12 h-12 rounded-xl ${platformColor(a.platform)} flex items-center justify-center text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{a.display_name}</p>
                  <p className="text-xs text-muted-foreground">{a.platform === "facebook" ? "Facebook" : "Instagram"} · {a.followers?.toLocaleString() ?? 0} seguidores</p>
                </div>
                <Badge className="gradient-success text-white">{a.active ? "Ativa" : "Inativa"}</Badge>
              </div>
            );
          })}
        </div>
      </Card>

      <Tabs defaultValue="composer">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="composer">Compositor</TabsTrigger>
          <TabsTrigger value="scheduled">Posts</TabsTrigger>
          <TabsTrigger value="comments">Comentários</TabsTrigger>
        </TabsList>

        <TabsContent value="composer" className="space-y-4 mt-4">
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold">Novo Post</h3>
              <Button size="sm" variant="outline" onClick={generateCaption} disabled={generating}>
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Gerar com IA
              </Button>
            </div>
            <Textarea value={composer} onChange={(e) => setComposer(e.target.value)} placeholder="O que queres partilhar hoje?" className="min-h-[140px] mb-4" maxLength={2200} />
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Button size="sm" variant="outline"><ImageIcon className="w-4 h-4" /> Imagem</Button>
              <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="w-auto" />
              <div className="flex gap-1">
                <button type="button" onClick={() => togglePlatform("facebook")} className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${platforms.includes("facebook") ? "bg-blue-500 text-white" : "bg-secondary"}`}><Facebook className="w-3 h-3" /> FB</button>
                <button type="button" onClick={() => togglePlatform("instagram")} className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${platforms.includes("instagram") ? "bg-pink-500 text-white" : "bg-secondary"}`}><Instagram className="w-3 h-3" /> IG</button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => publish("draft")} disabled={createPost.isPending}>Rascunho</Button>
              {scheduledAt && <Button variant="outline" onClick={() => publish("scheduled")} disabled={createPost.isPending}><Calendar className="w-4 h-4" /> Agendar</Button>}
              <Button className="gradient-primary text-white" onClick={() => publish("published")} disabled={createPost.isPending}><Send className="w-4 h-4" /> Publicar</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-3 mt-4">
          {posts.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Sem posts ainda.</p>}
          {posts.map((p) => (
            <Card key={p.id} className="p-4 shadow-card flex items-center gap-4 group">
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center text-3xl">{p.image_url ? "🖼️" : "📝"}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{p.caption}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  {p.scheduled_at && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(p.scheduled_at).toLocaleString("pt-PT")}</span>}
                  <Badge variant={p.status === "published" ? "default" : "secondary"} className="text-[10px]">{p.status}</Badge>
                  {p.platforms?.map(pl => {
                    const Icon = platformIcon(pl);
                    return <Icon key={pl} className="w-3 h-3" />;
                  })}
                </div>
              </div>
              <button onClick={() => deletePost.mutate(p.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="comments" className="space-y-4 mt-4">
          {comments.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Sem comentários.</p>}
          {comments.map((c) => {
            const Icon = platformIcon(c.platform);
            return (
              <Card key={c.id} className="p-5 shadow-card">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar><AvatarFallback>{c.author_name.split(" ").map(p => p[0]).slice(0, 2).join("")}</AvatarFallback></Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{c.author_name}</p>
                      <Icon className={`w-3 h-3 ${c.platform === "instagram" ? "text-pink-500" : "text-blue-500"}`} />
                      <span className="text-xs text-muted-foreground">· {new Date(c.created_at).toLocaleDateString("pt-PT")} · {c.social_posts?.caption?.slice(0, 30) ?? "Post"}</span>
                      <Badge variant={c.status === "pending" ? "default" : "secondary"} className="text-[9px] ml-auto">{c.status}</Badge>
                    </div>
                    <p className="text-sm mt-1">{c.text}</p>
                  </div>
                </div>
                {c.ai_suggestion && c.status === "pending" && (
                  <div className="ml-12 p-3 rounded-lg bg-accent/50 border border-accent">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-3 h-3 text-primary" />
                      <span className="text-xs font-semibold text-primary">Sugestão IA</span>
                    </div>
                    <p className="text-sm">{c.ai_suggestion}</p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="gradient-primary text-white" onClick={() => replyComment(c.id, c.ai_suggestion!, c.contact_id)}>Aprovar e enviar</Button>
                      <Button size="sm" variant="outline" onClick={() => updateComment.mutate({ id: c.id, status: "ignored" })}>Ignorar</Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
};
