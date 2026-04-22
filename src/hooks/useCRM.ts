import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

// ===== Generic helpers =====
function useOwnerId() {
  const { user } = useAuth();
  return user?.id ?? null;
}

// ============ CONTACTS ============
export type Contact = Tables<"contacts">;

export const useContacts = () => {
  const ownerId = useOwnerId();
  return useQuery({
    queryKey: ["contacts", ownerId],
    queryFn: async () => {
      const { data, error } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Contact[];
    },
    enabled: !!ownerId,
  });
};

export const useContactMutations = () => {
  const qc = useQueryClient();
  const ownerId = useOwnerId();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["contacts"] });

  const create = useMutation({
    mutationFn: async (input: Omit<TablesInsert<"contacts">, "owner_id">) => {
      if (!ownerId) throw new Error("Não autenticado");
      const { data, error } = await supabase.from("contacts").insert({ ...input, owner_id: ownerId }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { invalidate(); toast.success("Contacto criado"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...patch }: TablesUpdate<"contacts"> & { id: string }) => {
      const { data, error } = await supabase.from("contacts").update(patch).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { invalidate(); toast.success("Contacto atualizado"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contacts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast.success("Contacto removido"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return { create, update, remove };
};

// ============ DEALS ============
export type Deal = Tables<"deals">;

export const useDeals = () => {
  const ownerId = useOwnerId();
  const qc = useQueryClient();

  useEffect(() => {
    if (!ownerId) return;
    const ch = supabase.channel("deals-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "deals" }, () => {
        qc.invalidateQueries({ queryKey: ["deals"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [ownerId, qc]);

  return useQuery({
    queryKey: ["deals", ownerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("*, contacts(full_name, company)")
        .order("position", { ascending: true });
      if (error) throw error;
      return data as (Deal & { contacts: { full_name: string; company: string | null } | null })[];
    },
    enabled: !!ownerId,
  });
};

export const useDealMutations = () => {
  const qc = useQueryClient();
  const ownerId = useOwnerId();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["deals"] });

  const create = useMutation({
    mutationFn: async (input: Omit<TablesInsert<"deals">, "owner_id">) => {
      if (!ownerId) throw new Error("Não autenticado");
      const { data, error } = await supabase.from("deals").insert({ ...input, owner_id: ownerId }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { invalidate(); toast.success("Negócio criado"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...patch }: TablesUpdate<"deals"> & { id: string }) => {
      const { data, error } = await supabase.from("deals").update(patch).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => invalidate(),
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("deals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast.success("Negócio removido"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return { create, update, remove };
};

// ============ TASKS ============
export type Task = Tables<"tasks">;

export const useTasks = () => {
  const ownerId = useOwnerId();
  return useQuery({
    queryKey: ["tasks", ownerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*, contacts(full_name), deals(title)")
        .order("due_date", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return data as (Task & { contacts: { full_name: string } | null; deals: { title: string } | null })[];
    },
    enabled: !!ownerId,
  });
};

export const useTaskMutations = () => {
  const qc = useQueryClient();
  const ownerId = useOwnerId();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["tasks"] });

  return {
    create: useMutation({
      mutationFn: async (input: Omit<TablesInsert<"tasks">, "owner_id">) => {
        if (!ownerId) throw new Error("Não autenticado");
        const { data, error } = await supabase.from("tasks").insert({ ...input, owner_id: ownerId }).select().single();
        if (error) throw error;
        return data;
      },
      onSuccess: () => { invalidate(); toast.success("Tarefa criada"); },
      onError: (e: Error) => toast.error(e.message),
    }),
    update: useMutation({
      mutationFn: async ({ id, ...patch }: TablesUpdate<"tasks"> & { id: string }) => {
        const { data, error } = await supabase.from("tasks").update(patch).eq("id", id).select().single();
        if (error) throw error;
        return data;
      },
      onSuccess: () => invalidate(),
      onError: (e: Error) => toast.error(e.message),
    }),
    remove: useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase.from("tasks").delete().eq("id", id);
        if (error) throw error;
      },
      onSuccess: () => { invalidate(); toast.success("Tarefa removida"); },
      onError: (e: Error) => toast.error(e.message),
    }),
  };
};

// ============ CONVERSATIONS / MESSAGES ============
export type Conversation = Tables<"conversations">;
export type Message = Tables<"messages">;

export const useConversations = () => {
  const ownerId = useOwnerId();
  const qc = useQueryClient();

  useEffect(() => {
    if (!ownerId) return;
    const ch = supabase.channel("conv-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, () => {
        qc.invalidateQueries({ queryKey: ["conversations"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [ownerId, qc]);

  return useQuery({
    queryKey: ["conversations", ownerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("*, contacts(full_name, avatar_url)")
        .order("last_message_at", { ascending: false });
      if (error) throw error;
      return data as (Conversation & { contacts: { full_name: string; avatar_url: string | null } | null })[];
    },
    enabled: !!ownerId,
  });
};

export const useMessages = (conversationId: string | null) => {
  const qc = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;
    const ch = supabase.channel(`msg-${conversationId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` }, () => {
        qc.invalidateQueries({ queryKey: ["messages", conversationId] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [conversationId, qc]);

  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Message[];
    },
    enabled: !!conversationId,
  });
};

export const useConversationMutations = () => {
  const qc = useQueryClient();
  const ownerId = useOwnerId();

  const sendMessage = useMutation({
    mutationFn: async (input: { conversationId: string; content: string; direction?: "inbound" | "outbound"; isAi?: boolean; authorName?: string }) => {
      if (!ownerId) throw new Error("Não autenticado");
      const { data, error } = await supabase.from("messages").insert({
        conversation_id: input.conversationId,
        owner_id: ownerId,
        content: input.content,
        direction: input.direction ?? "outbound",
        is_ai: input.isAi ?? false,
        author_name: input.authorName,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["messages", vars.conversationId] });
      qc.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const createConversation = useMutation({
    mutationFn: async (input: Omit<TablesInsert<"conversations">, "owner_id">) => {
      if (!ownerId) throw new Error("Não autenticado");
      const { data, error } = await supabase.from("conversations").insert({ ...input, owner_id: ownerId }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["conversations"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const updateConversation = useMutation({
    mutationFn: async ({ id, ...patch }: TablesUpdate<"conversations"> & { id: string }) => {
      const { data, error } = await supabase.from("conversations").update(patch).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["conversations"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const markRead = useMutation({
    mutationFn: async (conversationId: string) => {
      await supabase.from("conversations").update({ unread_count: 0 }).eq("id", conversationId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["conversations"] }),
  });

  return { sendMessage, createConversation, updateConversation, markRead };
};

// ============ SOCIAL ============
export const useSocialAccounts = () => {
  const ownerId = useOwnerId();
  return useQuery({
    queryKey: ["social_accounts", ownerId],
    queryFn: async () => {
      const { data, error } = await supabase.from("social_accounts").select("*").order("created_at");
      if (error) throw error;
      return data as Tables<"social_accounts">[];
    },
    enabled: !!ownerId,
  });
};

export const useSocialPosts = () => {
  const ownerId = useOwnerId();
  return useQuery({
    queryKey: ["social_posts", ownerId],
    queryFn: async () => {
      const { data, error } = await supabase.from("social_posts").select("*").order("scheduled_at", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return data as Tables<"social_posts">[];
    },
    enabled: !!ownerId,
  });
};

export const useSocialComments = () => {
  const ownerId = useOwnerId();
  return useQuery({
    queryKey: ["social_comments", ownerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_comments")
        .select("*, social_posts(caption)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as (Tables<"social_comments"> & { social_posts: { caption: string } | null })[];
    },
    enabled: !!ownerId,
  });
};

export const useSocialMutations = () => {
  const qc = useQueryClient();
  const ownerId = useOwnerId();

  return {
    createPost: useMutation({
      mutationFn: async (input: Omit<TablesInsert<"social_posts">, "owner_id">) => {
        if (!ownerId) throw new Error("Não autenticado");
        const { data, error } = await supabase.from("social_posts").insert({ ...input, owner_id: ownerId }).select().single();
        if (error) throw error;
        return data;
      },
      onSuccess: () => { qc.invalidateQueries({ queryKey: ["social_posts"] }); toast.success("Post guardado"); },
      onError: (e: Error) => toast.error(e.message),
    }),
    updatePost: useMutation({
      mutationFn: async ({ id, ...patch }: TablesUpdate<"social_posts"> & { id: string }) => {
        const { data, error } = await supabase.from("social_posts").update(patch).eq("id", id).select().single();
        if (error) throw error;
        return data;
      },
      onSuccess: () => qc.invalidateQueries({ queryKey: ["social_posts"] }),
      onError: (e: Error) => toast.error(e.message),
    }),
    deletePost: useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase.from("social_posts").delete().eq("id", id);
        if (error) throw error;
      },
      onSuccess: () => { qc.invalidateQueries({ queryKey: ["social_posts"] }); toast.success("Post removido"); },
      onError: (e: Error) => toast.error(e.message),
    }),
    updateComment: useMutation({
      mutationFn: async ({ id, ...patch }: TablesUpdate<"social_comments"> & { id: string }) => {
        const { data, error } = await supabase.from("social_comments").update(patch).eq("id", id).select().single();
        if (error) throw error;
        return data;
      },
      onSuccess: () => qc.invalidateQueries({ queryKey: ["social_comments"] }),
      onError: (e: Error) => toast.error(e.message),
    }),
  };
};

// ============ CREATIVE ASSETS ============
export const useCreativeAssets = () => {
  const ownerId = useOwnerId();
  return useQuery({
    queryKey: ["creative_assets", ownerId],
    queryFn: async () => {
      const { data, error } = await supabase.from("creative_assets").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Tables<"creative_assets">[];
    },
    enabled: !!ownerId,
  });
};

export const useCreativeMutations = () => {
  const qc = useQueryClient();
  const ownerId = useOwnerId();
  return {
    create: useMutation({
      mutationFn: async (input: Omit<TablesInsert<"creative_assets">, "owner_id">) => {
        if (!ownerId) throw new Error("Não autenticado");
        const { data, error } = await supabase.from("creative_assets").insert({ ...input, owner_id: ownerId }).select().single();
        if (error) throw error;
        return data;
      },
      onSuccess: () => { qc.invalidateQueries({ queryKey: ["creative_assets"] }); toast.success("Asset guardado"); },
      onError: (e: Error) => toast.error(e.message),
    }),
    remove: useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase.from("creative_assets").delete().eq("id", id);
        if (error) throw error;
      },
      onSuccess: () => qc.invalidateQueries({ queryKey: ["creative_assets"] }),
    }),
  };
};

// ============ CAMPAIGNS / AUDIENCES ============
export const useAudiences = () => {
  const ownerId = useOwnerId();
  return useQuery({
    queryKey: ["audiences", ownerId],
    queryFn: async () => {
      const { data, error } = await supabase.from("audiences").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Tables<"audiences">[];
    },
    enabled: !!ownerId,
  });
};

export const useCampaigns = () => {
  const ownerId = useOwnerId();
  return useQuery({
    queryKey: ["campaigns", ownerId],
    queryFn: async () => {
      const { data, error } = await supabase.from("campaigns").select("*, audiences(name, contacts_count)").order("created_at", { ascending: false });
      if (error) throw error;
      return data as (Tables<"campaigns"> & { audiences: { name: string; contacts_count: number | null } | null })[];
    },
    enabled: !!ownerId,
  });
};

export const useCampaignMutations = () => {
  const qc = useQueryClient();
  const ownerId = useOwnerId();
  return {
    createAudience: useMutation({
      mutationFn: async (input: Omit<TablesInsert<"audiences">, "owner_id">) => {
        if (!ownerId) throw new Error("Não autenticado");
        const { data, error } = await supabase.from("audiences").insert({ ...input, owner_id: ownerId }).select().single();
        if (error) throw error;
        return data;
      },
      onSuccess: () => { qc.invalidateQueries({ queryKey: ["audiences"] }); toast.success("Audiência criada"); },
      onError: (e: Error) => toast.error(e.message),
    }),
    createCampaign: useMutation({
      mutationFn: async (input: Omit<TablesInsert<"campaigns">, "owner_id">) => {
        if (!ownerId) throw new Error("Não autenticado");
        const { data, error } = await supabase.from("campaigns").insert({ ...input, owner_id: ownerId }).select().single();
        if (error) throw error;
        return data;
      },
      onSuccess: () => { qc.invalidateQueries({ queryKey: ["campaigns"] }); toast.success("Campanha criada"); },
      onError: (e: Error) => toast.error(e.message),
    }),
    updateCampaign: useMutation({
      mutationFn: async ({ id, ...patch }: TablesUpdate<"campaigns"> & { id: string }) => {
        const { data, error } = await supabase.from("campaigns").update(patch).eq("id", id).select().single();
        if (error) throw error;
        return data;
      },
      onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
      onError: (e: Error) => toast.error(e.message),
    }),
    deleteCampaign: useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase.from("campaigns").delete().eq("id", id);
        if (error) throw error;
      },
      onSuccess: () => { qc.invalidateQueries({ queryKey: ["campaigns"] }); toast.success("Campanha removida"); },
    }),
  };
};

// ============ DASHBOARD STATS ============
export const useStats = () => {
  const ownerId = useOwnerId();
  return useQuery({
    queryKey: ["stats", ownerId],
    queryFn: async () => {
      const [contacts, deals, tasks, convs] = await Promise.all([
        supabase.from("contacts").select("id", { count: "exact", head: true }),
        supabase.from("deals").select("value, stage"),
        supabase.from("tasks").select("id", { count: "exact", head: true }).eq("status", "todo"),
        supabase.from("conversations").select("unread_count"),
      ]);
      const dealsList = (deals.data ?? []) as { value: number; stage: string }[];
      const pipelineValue = dealsList.filter(d => !["won", "lost"].includes(d.stage)).reduce((s, d) => s + Number(d.value || 0), 0);
      const won = dealsList.filter(d => d.stage === "won").length;
      const totalDeals = dealsList.length || 1;
      const convList = (convs.data ?? []) as { unread_count: number | null }[];
      const unread = convList.reduce((s, c) => s + (c.unread_count ?? 0), 0);
      return {
        contactsCount: contacts.count ?? 0,
        activeDeals: dealsList.filter(d => !["won", "lost"].includes(d.stage)).length,
        pipelineValue,
        conversionRate: Math.round((won / totalDeals) * 100),
        openTasks: tasks.count ?? 0,
        unreadMessages: unread,
      };
    },
    enabled: !!ownerId,
  });
};
