import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Sparkles, Wand2, Image as ImageIcon, Type, Download, Loader2, Eraser, Square, RotateCcw, Send, Calendar, Save, Trash2 } from "lucide-react";
import { callAI } from "@/lib/ai";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCreativeAssets, useCreativeMutations, useSocialMutations } from "@/hooks/useCRM";

const presets = [
  { label: "Produto minimalista", prompt: "Foto de produto minimalista, fundo branco, iluminação suave de estúdio, alta qualidade" },
  { label: "Lifestyle moderno", prompt: "Cena lifestyle moderna, jovens profissionais a usar laptop num café, luz natural" },
  { label: "Anúncio promo", prompt: "Banner promocional vibrante com gradientes roxos e azuis, espaço para texto, design clean" },
  { label: "Quote inspiracional", prompt: "Fundo gradiente abstrato calmo, atmosfera contemplativa, espaço central para citação" },
];

export const CreativeStudioSection = () => {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<"draw" | "text" | "rect">("draw");
  const [color, setColor] = useState("#6366f1");
  const [brushSize, setBrushSize] = useState([4]);
  const [overlayText, setOverlayText] = useState("");
  const drawing = useRef(false);

  const { data: assets = [] } = useCreativeAssets();
  const { create: createAsset, remove: removeAsset } = useCreativeMutations();
  const { createPost } = useSocialMutations();

  const generate = async (p?: string) => {
    const finalPrompt = p ?? prompt;
    if (!finalPrompt.trim()) return toast.error("Descreve a imagem que queres");
    setGenerating(true);
    const r = await callAI({ action: "image", prompt: finalPrompt });
    setGenerating(false);
    if (r.error) return toast.error(r.error);
    if (r.imageUrl) {
      setImageUrl(r.imageUrl);
      toast.success("Imagem gerada! Edita no canvas →");
      setTimeout(() => loadOnCanvas(r.imageUrl!), 100);
    }
  };

  const loadOnCanvas = (url: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => { canvas.width = 640; canvas.height = 640; ctx.drawImage(img, 0, 0, 640, 640); };
    img.src = url;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (tool !== "draw") return;
    drawing.current = true;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = color; ctx.lineWidth = brushSize[0]; ctx.lineCap = "round"; ctx.beginPath();
    const r = canvasRef.current!.getBoundingClientRect();
    ctx.moveTo(((e.clientX - r.left) / r.width) * 640, ((e.clientY - r.top) / r.height) * 640);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const r = canvasRef.current!.getBoundingClientRect();
    ctx.lineTo(((e.clientX - r.left) / r.width) * 640, ((e.clientY - r.top) / r.height) * 640);
    ctx.stroke();
  };
  const onPointerUp = () => { drawing.current = false; };

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const r = canvasRef.current!.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 640;
    const y = ((e.clientY - r.top) / r.height) * 640;
    if (tool === "text" && overlayText) {
      ctx.fillStyle = color; ctx.font = "bold 42px Syne, sans-serif"; ctx.textBaseline = "middle";
      ctx.fillText(overlayText, x, y);
    } else if (tool === "rect") {
      ctx.fillStyle = color + "cc"; ctx.fillRect(x - 60, y - 30, 120, 60);
    }
  };

  const reset = () => imageUrl && loadOnCanvas(imageUrl);

  const download = () => {
    const url = canvasRef.current?.toDataURL("image/png");
    if (!url) return;
    const a = document.createElement("a");
    a.href = url; a.download = `nexcrm-${Date.now()}.png`; a.click();
  };

  const sendToAi = async () => {
    const dataUrl = canvasRef.current?.toDataURL("image/png");
    if (!dataUrl) return;
    setGenerating(true);
    toast.info("A enviar para a IA refinar...");
    const r = await callAI({ action: "edit_image", prompt: "Refina e melhora esta imagem mantendo as edições humanas", imageUrl: dataUrl });
    setGenerating(false);
    if (r.error) return toast.error(r.error);
    if (r.imageUrl) { setImageUrl(r.imageUrl); loadOnCanvas(r.imageUrl); toast.success("IA refinou!"); }
  };

  const saveAsset = async () => {
    const url = canvasRef.current?.toDataURL("image/png");
    if (!url) return toast.error("Sem imagem para guardar");
    await createAsset.mutateAsync({ image_url: url, prompt: prompt || null, status: "refined" });
  };

  const publishToSocial = async () => {
    const url = canvasRef.current?.toDataURL("image/png");
    if (!url) return;
    const asset = await createAsset.mutateAsync({ image_url: url, prompt: prompt || null, status: "published" });
    await createPost.mutateAsync({
      caption: prompt || "Novo post",
      image_url: url,
      asset_id: asset.id,
      platforms: ["instagram", "facebook"],
      status: "published",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-4 p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center"><Wand2 className="w-5 h-5 text-white" /></div>
            <div>
              <h3 className="font-display font-bold">Gerador IA</h3>
              <p className="text-xs text-muted-foreground">Gemini 2.5 Flash Image</p>
            </div>
          </div>

          <Textarea placeholder="Descreve a imagem que queres criar..." value={prompt} onChange={(e) => setPrompt(e.target.value)} className="min-h-[120px]" maxLength={500} />
          <Button onClick={() => generate()} disabled={generating} className="w-full gradient-primary text-white">
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Gerar imagem
          </Button>

          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">Presets</p>
            <div className="grid grid-cols-1 gap-2">
              {presets.map((p) => (
                <button key={p.label} onClick={() => { setPrompt(p.prompt); generate(p.prompt); }} className="text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors text-sm">
                  <p className="font-semibold">{p.label}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{p.prompt}</p>
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-5 p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <Button size="sm" variant={tool === "draw" ? "default" : "outline"} onClick={() => setTool("draw")}><Eraser className="w-4 h-4" /></Button>
              <Button size="sm" variant={tool === "text" ? "default" : "outline"} onClick={() => setTool("text")}><Type className="w-4 h-4" /></Button>
              <Button size="sm" variant={tool === "rect" ? "default" : "outline"} onClick={() => setTool("rect")}><Square className="w-4 h-4" /></Button>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-9 h-9 rounded border border-border cursor-pointer" />
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={reset} disabled={!imageUrl}><RotateCcw className="w-4 h-4" /></Button>
              <Button size="sm" variant="outline" onClick={download} disabled={!imageUrl}><Download className="w-4 h-4" /></Button>
            </div>
          </div>

          {tool === "text" && <Input placeholder="Texto a inserir (clica no canvas)" value={overlayText} onChange={(e) => setOverlayText(e.target.value)} className="mb-3" maxLength={100} />}
          {tool === "draw" && (
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs text-muted-foreground">Espessura</span>
              <Slider value={brushSize} onValueChange={setBrushSize} max={30} min={1} step={1} className="flex-1" />
              <span className="text-xs font-mono">{brushSize[0]}px</span>
            </div>
          )}

          <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary/40 border border-border">
            {!imageUrl && !generating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                <ImageIcon className="w-16 h-16 mb-2 opacity-30" />
                <p className="text-sm">Gera uma imagem para começar a editar</p>
              </div>
            )}
            {generating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-2" />
                <p className="text-sm font-semibold">A IA está a criar...</p>
              </div>
            )}
            <canvas ref={canvasRef} className="w-full h-full cursor-crosshair touch-none" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp} onClick={onCanvasClick} />
          </div>

          <div className="flex gap-2 mt-3">
            <Button onClick={sendToAi} disabled={!imageUrl || generating} className="flex-1 gradient-primary text-white">
              <Sparkles className="w-4 h-4" /> Refinar com IA
            </Button>
          </div>
        </Card>

        <Card className="lg:col-span-3 p-6 shadow-card space-y-4">
          <h3 className="font-display font-bold">Publicar</h3>
          <p className="text-xs text-muted-foreground">Após editar, guarda como asset ou envia diretamente para as redes.</p>
          <Button className="w-full" variant="outline" onClick={saveAsset} disabled={!imageUrl}><Save className="w-4 h-4" /> Guardar asset</Button>
          <Button className="w-full gradient-primary text-white" disabled={!imageUrl} onClick={publishToSocial}><Send className="w-4 h-4" /> Publicar nas redes</Button>
          <div className="pt-4 border-t">
            <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">Workflow</p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2"><span className="w-5 h-5 rounded-full gradient-primary text-white flex items-center justify-center text-[10px] font-bold">1</span> IA gera imagem</div>
              <div className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-[10px] font-bold">2</span> Humano edita</div>
              <div className="flex items-center gap-2"><span className="w-5 h-5 rounded-full gradient-primary text-white flex items-center justify-center text-[10px] font-bold">3</span> IA refina</div>
              <div className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-success text-white flex items-center justify-center text-[10px] font-bold">4</span> Publica</div>
            </div>
          </div>
        </Card>
      </div>

      {assets.length > 0 && (
        <Card className="p-6 shadow-card">
          <h3 className="font-display font-bold mb-4">Biblioteca de assets</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {assets.map((a) => (
              <div key={a.id} className="relative group aspect-square rounded-lg overflow-hidden bg-secondary border border-border">
                <img src={a.image_url} alt={a.prompt ?? ""} className="w-full h-full object-cover" />
                <button onClick={() => removeAsset.mutate(a.id)} className="absolute top-1 right-1 p-1 rounded bg-background/80 opacity-0 group-hover:opacity-100 text-destructive">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
