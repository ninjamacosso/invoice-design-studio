import { supabase } from "@/integrations/supabase/client";

type AIAction = "image" | "edit_image" | "caption" | "reply" | "comment_reply";

interface AIRequest {
  action: AIAction;
  prompt?: string;
  context?: string;
  tone?: string;
  platform?: string;
  imageUrl?: string;
}

export async function callAI(req: AIRequest): Promise<{ text?: string; imageUrl?: string; error?: string }> {
  const { data, error } = await supabase.functions.invoke("ai-creative", { body: req });
  if (error) return { error: error.message };
  return data;
}
