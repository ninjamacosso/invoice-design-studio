
-- Enums
CREATE TYPE public.deal_stage AS ENUM ('lead','qualified','proposal','negotiation','won','lost');
CREATE TYPE public.task_status AS ENUM ('todo','in_progress','done');
CREATE TYPE public.task_priority AS ENUM ('low','medium','high','urgent');
CREATE TYPE public.contact_status AS ENUM ('active','inactive','lead','customer');
CREATE TYPE public.channel_type AS ENUM ('whatsapp','instagram','facebook','sms','email');
CREATE TYPE public.message_direction AS ENUM ('inbound','outbound');
CREATE TYPE public.conversation_handler AS ENUM ('human','bot');
CREATE TYPE public.post_status AS ENUM ('draft','scheduled','published','failed');
CREATE TYPE public.social_platform AS ENUM ('facebook','instagram');
CREATE TYPE public.comment_status AS ENUM ('pending','replied','ignored');
CREATE TYPE public.asset_status AS ENUM ('draft','refined','published');
CREATE TYPE public.campaign_mode AS ENUM ('auto','hybrid','manual');
CREATE TYPE public.campaign_status AS ENUM ('draft','running','paused','completed');

-- contacts
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  job_title TEXT,
  avatar_url TEXT,
  tags TEXT[] DEFAULT '{}',
  source TEXT,
  status public.contact_status NOT NULL DEFAULT 'lead',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- deals
CREATE TABLE public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  value NUMERIC(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  stage public.deal_stage NOT NULL DEFAULT 'lead',
  probability INT DEFAULT 10,
  expected_close DATE,
  notes TEXT,
  position INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- tasks
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  deal_id UUID REFERENCES public.deals(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status public.task_status NOT NULL DEFAULT 'todo',
  priority public.task_priority NOT NULL DEFAULT 'medium',
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- conversations
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  channel public.channel_type NOT NULL,
  subject TEXT,
  handler public.conversation_handler NOT NULL DEFAULT 'human',
  unread_count INT DEFAULT 0,
  last_message_at TIMESTAMPTZ DEFAULT now(),
  last_message_preview TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL,
  direction public.message_direction NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT,
  is_ai BOOLEAN DEFAULT false,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- social_accounts
CREATE TABLE public.social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  platform public.social_platform NOT NULL,
  display_name TEXT NOT NULL,
  username TEXT,
  followers INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- social_posts
CREATE TABLE public.social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  caption TEXT NOT NULL,
  image_url TEXT,
  asset_id UUID,
  platforms public.social_platform[] DEFAULT '{}',
  scheduled_at TIMESTAMPTZ,
  status public.post_status NOT NULL DEFAULT 'draft',
  likes INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- social_comments
CREATE TABLE public.social_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  post_id UUID REFERENCES public.social_posts(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  platform public.social_platform NOT NULL,
  author_name TEXT NOT NULL,
  text TEXT NOT NULL,
  ai_suggestion TEXT,
  status public.comment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- creative_assets
CREATE TABLE public.creative_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  prompt TEXT,
  image_url TEXT NOT NULL,
  status public.asset_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- audiences
CREATE TABLE public.audiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  filters JSONB DEFAULT '{}'::jsonb,
  contacts_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- campaigns
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  channel public.channel_type NOT NULL,
  audience_id UUID REFERENCES public.audiences(id) ON DELETE SET NULL,
  mode public.campaign_mode NOT NULL DEFAULT 'hybrid',
  template TEXT,
  status public.campaign_status NOT NULL DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  sent_count INT DEFAULT 0,
  delivered_count INT DEFAULT 0,
  opened_count INT DEFAULT 0,
  replied_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Generic owner policies
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['contacts','deals','tasks','conversations','messages','social_accounts','social_posts','social_comments','creative_assets','audiences','campaigns'])
  LOOP
    EXECUTE format('CREATE POLICY "owner_select" ON public.%I FOR SELECT TO authenticated USING (owner_id = auth.uid())', t);
    EXECUTE format('CREATE POLICY "owner_insert" ON public.%I FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid())', t);
    EXECUTE format('CREATE POLICY "owner_update" ON public.%I FOR UPDATE TO authenticated USING (owner_id = auth.uid())', t);
    EXECUTE format('CREATE POLICY "owner_delete" ON public.%I FOR DELETE TO authenticated USING (owner_id = auth.uid())', t);
  END LOOP;
END $$;

-- updated_at triggers
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['contacts','deals','tasks','conversations','social_accounts','social_posts','creative_assets','audiences','campaigns'])
  LOOP
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()', t);
  END LOOP;
END $$;

-- Indexes
CREATE INDEX idx_contacts_owner ON public.contacts(owner_id);
CREATE INDEX idx_deals_owner_stage ON public.deals(owner_id, stage);
CREATE INDEX idx_deals_contact ON public.deals(contact_id);
CREATE INDEX idx_tasks_owner_status ON public.tasks(owner_id, status);
CREATE INDEX idx_conversations_owner ON public.conversations(owner_id, last_message_at DESC);
CREATE INDEX idx_messages_conv ON public.messages(conversation_id, created_at);
CREATE INDEX idx_posts_owner ON public.social_posts(owner_id, scheduled_at);
CREATE INDEX idx_comments_post ON public.social_comments(post_id);
CREATE INDEX idx_campaigns_owner ON public.campaigns(owner_id);

-- Realtime
ALTER TABLE public.conversations REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.deals REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.deals;

-- Auto-update conversation last_message on new message
CREATE OR REPLACE FUNCTION public.bump_conversation_on_message()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at,
      last_message_preview = LEFT(NEW.content, 140),
      unread_count = CASE WHEN NEW.direction = 'inbound' THEN unread_count + 1 ELSE unread_count END,
      updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END $$;

CREATE TRIGGER trg_bump_conversation
AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.bump_conversation_on_message();
