export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audiences: {
        Row: {
          contacts_count: number | null
          created_at: string
          description: string | null
          filters: Json | null
          id: string
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          contacts_count?: number | null
          created_at?: string
          description?: string | null
          filters?: Json | null
          id?: string
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          contacts_count?: number | null
          created_at?: string
          description?: string | null
          filters?: Json | null
          id?: string
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          audience_id: string | null
          channel: Database["public"]["Enums"]["channel_type"]
          created_at: string
          delivered_count: number | null
          id: string
          mode: Database["public"]["Enums"]["campaign_mode"]
          name: string
          opened_count: number | null
          owner_id: string
          replied_count: number | null
          scheduled_at: string | null
          sent_count: number | null
          status: Database["public"]["Enums"]["campaign_status"]
          template: string | null
          updated_at: string
        }
        Insert: {
          audience_id?: string | null
          channel: Database["public"]["Enums"]["channel_type"]
          created_at?: string
          delivered_count?: number | null
          id?: string
          mode?: Database["public"]["Enums"]["campaign_mode"]
          name: string
          opened_count?: number | null
          owner_id: string
          replied_count?: number | null
          scheduled_at?: string | null
          sent_count?: number | null
          status?: Database["public"]["Enums"]["campaign_status"]
          template?: string | null
          updated_at?: string
        }
        Update: {
          audience_id?: string | null
          channel?: Database["public"]["Enums"]["channel_type"]
          created_at?: string
          delivered_count?: number | null
          id?: string
          mode?: Database["public"]["Enums"]["campaign_mode"]
          name?: string
          opened_count?: number | null
          owner_id?: string
          replied_count?: number | null
          scheduled_at?: string | null
          sent_count?: number | null
          status?: Database["public"]["Enums"]["campaign_status"]
          template?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_audience_id_fkey"
            columns: ["audience_id"]
            isOneToOne: false
            referencedRelation: "audiences"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          job_title: string | null
          notes: string | null
          owner_id: string
          phone: string | null
          source: string | null
          status: Database["public"]["Enums"]["contact_status"]
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          job_title?: string | null
          notes?: string | null
          owner_id: string
          phone?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["contact_status"]
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          job_title?: string | null
          notes?: string | null
          owner_id?: string
          phone?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["contact_status"]
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          channel: Database["public"]["Enums"]["channel_type"]
          contact_id: string | null
          created_at: string
          handler: Database["public"]["Enums"]["conversation_handler"]
          id: string
          last_message_at: string | null
          last_message_preview: string | null
          owner_id: string
          subject: string | null
          unread_count: number | null
          updated_at: string
        }
        Insert: {
          channel: Database["public"]["Enums"]["channel_type"]
          contact_id?: string | null
          created_at?: string
          handler?: Database["public"]["Enums"]["conversation_handler"]
          id?: string
          last_message_at?: string | null
          last_message_preview?: string | null
          owner_id: string
          subject?: string | null
          unread_count?: number | null
          updated_at?: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["channel_type"]
          contact_id?: string | null
          created_at?: string
          handler?: Database["public"]["Enums"]["conversation_handler"]
          id?: string
          last_message_at?: string | null
          last_message_preview?: string | null
          owner_id?: string
          subject?: string | null
          unread_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      creative_assets: {
        Row: {
          created_at: string
          id: string
          image_url: string
          owner_id: string
          prompt: string | null
          status: Database["public"]["Enums"]["asset_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          owner_id: string
          prompt?: string | null
          status?: Database["public"]["Enums"]["asset_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          owner_id?: string
          prompt?: string | null
          status?: Database["public"]["Enums"]["asset_status"]
          updated_at?: string
        }
        Relationships: []
      }
      deals: {
        Row: {
          contact_id: string | null
          created_at: string
          currency: string | null
          expected_close: string | null
          id: string
          notes: string | null
          owner_id: string
          position: number | null
          probability: number | null
          stage: Database["public"]["Enums"]["deal_stage"]
          title: string
          updated_at: string
          value: number | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          currency?: string | null
          expected_close?: string | null
          id?: string
          notes?: string | null
          owner_id: string
          position?: number | null
          probability?: number | null
          stage?: Database["public"]["Enums"]["deal_stage"]
          title: string
          updated_at?: string
          value?: number | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          currency?: string | null
          expected_close?: string | null
          id?: string
          notes?: string | null
          owner_id?: string
          position?: number | null
          probability?: number | null
          stage?: Database["public"]["Enums"]["deal_stage"]
          title?: string
          updated_at?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          author_name: string | null
          content: string
          conversation_id: string
          created_at: string
          direction: Database["public"]["Enums"]["message_direction"]
          id: string
          is_ai: boolean | null
          owner_id: string
          read: boolean | null
        }
        Insert: {
          author_name?: string | null
          content: string
          conversation_id: string
          created_at?: string
          direction: Database["public"]["Enums"]["message_direction"]
          id?: string
          is_ai?: boolean | null
          owner_id: string
          read?: boolean | null
        }
        Update: {
          author_name?: string | null
          content?: string
          conversation_id?: string
          created_at?: string
          direction?: Database["public"]["Enums"]["message_direction"]
          id?: string
          is_ai?: boolean | null
          owner_id?: string
          read?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          job_title: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          job_title?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          job_title?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      social_accounts: {
        Row: {
          active: boolean | null
          created_at: string
          display_name: string
          followers: number | null
          id: string
          owner_id: string
          platform: Database["public"]["Enums"]["social_platform"]
          updated_at: string
          username: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          display_name: string
          followers?: number | null
          id?: string
          owner_id: string
          platform: Database["public"]["Enums"]["social_platform"]
          updated_at?: string
          username?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          display_name?: string
          followers?: number | null
          id?: string
          owner_id?: string
          platform?: Database["public"]["Enums"]["social_platform"]
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      social_comments: {
        Row: {
          ai_suggestion: string | null
          author_name: string
          contact_id: string | null
          created_at: string
          id: string
          owner_id: string
          platform: Database["public"]["Enums"]["social_platform"]
          post_id: string | null
          status: Database["public"]["Enums"]["comment_status"]
          text: string
        }
        Insert: {
          ai_suggestion?: string | null
          author_name: string
          contact_id?: string | null
          created_at?: string
          id?: string
          owner_id: string
          platform: Database["public"]["Enums"]["social_platform"]
          post_id?: string | null
          status?: Database["public"]["Enums"]["comment_status"]
          text: string
        }
        Update: {
          ai_suggestion?: string | null
          author_name?: string
          contact_id?: string | null
          created_at?: string
          id?: string
          owner_id?: string
          platform?: Database["public"]["Enums"]["social_platform"]
          post_id?: string | null
          status?: Database["public"]["Enums"]["comment_status"]
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_comments_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      social_posts: {
        Row: {
          asset_id: string | null
          caption: string
          comments_count: number | null
          created_at: string
          id: string
          image_url: string | null
          likes: number | null
          owner_id: string
          platforms: Database["public"]["Enums"]["social_platform"][] | null
          scheduled_at: string | null
          status: Database["public"]["Enums"]["post_status"]
          updated_at: string
        }
        Insert: {
          asset_id?: string | null
          caption: string
          comments_count?: number | null
          created_at?: string
          id?: string
          image_url?: string | null
          likes?: number | null
          owner_id: string
          platforms?: Database["public"]["Enums"]["social_platform"][] | null
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["post_status"]
          updated_at?: string
        }
        Update: {
          asset_id?: string | null
          caption?: string
          comments_count?: number | null
          created_at?: string
          id?: string
          image_url?: string | null
          likes?: number | null
          owner_id?: string
          platforms?: Database["public"]["Enums"]["social_platform"][] | null
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["post_status"]
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          contact_id: string | null
          created_at: string
          deal_id: string | null
          description: string | null
          due_date: string | null
          id: string
          owner_id: string
          priority: Database["public"]["Enums"]["task_priority"]
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          owner_id: string
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          owner_id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "agent"
      asset_status: "draft" | "refined" | "published"
      campaign_mode: "auto" | "hybrid" | "manual"
      campaign_status: "draft" | "running" | "paused" | "completed"
      channel_type: "whatsapp" | "instagram" | "facebook" | "sms" | "email"
      comment_status: "pending" | "replied" | "ignored"
      contact_status: "active" | "inactive" | "lead" | "customer"
      conversation_handler: "human" | "bot"
      deal_stage:
        | "lead"
        | "qualified"
        | "proposal"
        | "negotiation"
        | "won"
        | "lost"
      message_direction: "inbound" | "outbound"
      post_status: "draft" | "scheduled" | "published" | "failed"
      social_platform: "facebook" | "instagram"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "todo" | "in_progress" | "done"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "agent"],
      asset_status: ["draft", "refined", "published"],
      campaign_mode: ["auto", "hybrid", "manual"],
      campaign_status: ["draft", "running", "paused", "completed"],
      channel_type: ["whatsapp", "instagram", "facebook", "sms", "email"],
      comment_status: ["pending", "replied", "ignored"],
      contact_status: ["active", "inactive", "lead", "customer"],
      conversation_handler: ["human", "bot"],
      deal_stage: [
        "lead",
        "qualified",
        "proposal",
        "negotiation",
        "won",
        "lost",
      ],
      message_direction: ["inbound", "outbound"],
      post_status: ["draft", "scheduled", "published", "failed"],
      social_platform: ["facebook", "instagram"],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: ["todo", "in_progress", "done"],
    },
  },
} as const
