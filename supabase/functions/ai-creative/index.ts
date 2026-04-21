// AI Creative gateway: generate images, captions, replies, comments via Lovable AI
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

type Action = "image" | "caption" | "reply" | "comment_reply" | "edit_image";

interface Body {
  action: Action;
  prompt?: string;
  context?: string;
  tone?: string;
  platform?: string;
  imageUrl?: string;
  model?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (!LOVABLE_API_KEY) {
    return json({ error: "LOVABLE_API_KEY not configured" }, 500);
  }

  try {
    const body = (await req.json()) as Body;
    const { action } = body;

    if (action === "image" || action === "edit_image") {
      const messages: any[] = [];
      if (action === "edit_image" && body.imageUrl) {
        messages.push({
          role: "user",
          content: [
            { type: "text", text: body.prompt || "Improve this image" },
            { type: "image_url", image_url: { url: body.imageUrl } },
          ],
        });
      } else {
        messages.push({ role: "user", content: body.prompt || "A beautiful product photo" });
      }
      const r = await callAI({
        model: body.model || "google/gemini-2.5-flash-image",
        messages,
        modalities: ["image", "text"],
      });
      if (!r.ok) return passthrough(r);
      const data = await r.json();
      const url = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      return json({ imageUrl: url });
    }

    // text actions
    const systemMap: Record<string, string> = {
      caption: `Crias legendas ${body.tone || "envolventes"} para ${body.platform || "Instagram"}. Inclui 3-5 hashtags relevantes. Máx 2 parágrafos curtos. Português de Portugal.`,
      reply: `És um agente de atendimento simpático e profissional num CRM. Responde em português de Portugal, breve, útil. Tom: ${body.tone || "amigável"}.`,
      comment_reply: `Respondes a comentários em redes sociais de forma curta (máx 2 frases), positiva e humana. Português de Portugal.`,
    };
    const system = systemMap[action] || "És um assistente útil.";
    const r = await callAI({
      model: body.model || "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: system },
        { role: "user", content: `${body.prompt || ""}\n\nContexto: ${body.context || "n/a"}` },
      ],
    });
    if (!r.ok) return passthrough(r);
    const data = await r.json();
    return json({ text: data.choices?.[0]?.message?.content ?? "" });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "unknown" }, 500);
  }
});

function callAI(payload: unknown) {
  return fetch(AI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

async function passthrough(r: Response) {
  if (r.status === 429) return json({ error: "Limite de pedidos atingido. Tenta novamente em instantes." }, 429);
  if (r.status === 402) return json({ error: "Créditos IA esgotados. Adiciona créditos nas Definições do workspace." }, 402);
  const t = await r.text();
  return json({ error: `AI gateway: ${t}` }, 500);
}

function json(b: unknown, status = 200) {
  return new Response(JSON.stringify(b), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
