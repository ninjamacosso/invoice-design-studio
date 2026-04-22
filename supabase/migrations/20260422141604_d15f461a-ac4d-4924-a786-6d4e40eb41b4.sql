
CREATE OR REPLACE FUNCTION public.seed_demo_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
  c1 UUID; c2 UUID; c3 UUID; c4 UUID; c5 UUID; c6 UUID;
  d1 UUID; d2 UUID; d3 UUID;
  conv1 UUID; conv2 UUID; conv3 UUID;
  post1 UUID; post2 UUID;
  aud1 UUID; aud2 UUID;
  existing INT;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT count(*) INTO existing FROM public.contacts WHERE owner_id = uid;
  IF existing > 0 THEN RETURN; END IF;

  -- Contacts
  INSERT INTO public.contacts (owner_id, full_name, email, phone, company, job_title, status) VALUES
    (uid, 'Maria Santos', 'maria@acme.com', '+351 912 111 111', 'Acme Corp.', 'CEO', 'customer') RETURNING id INTO c1;
  INSERT INTO public.contacts (owner_id, full_name, email, phone, company, job_title, status) VALUES
    (uid, 'Carlos Mendes', 'carlos@techvision.pt', '+351 912 222 222', 'TechVision Lda.', 'CTO', 'active') RETURNING id INTO c2;
  INSERT INTO public.contacts (owner_id, full_name, email, phone, company, job_title, status) VALUES
    (uid, 'Pedro Silva', 'pedro@nexus.com', '+351 912 333 333', 'Nexus Solutions', 'Marketing Lead', 'lead') RETURNING id INTO c3;
  INSERT INTO public.contacts (owner_id, full_name, email, phone, company, job_title, status) VALUES
    (uid, 'Sofia Almeida', 'sofia@orbit.com', '+351 912 444 444', 'Orbit SA', 'COO', 'customer') RETURNING id INTO c4;
  INSERT INTO public.contacts (owner_id, full_name, email, phone, company, job_title, status) VALUES
    (uid, 'Ricardo Lopes', 'ricardo@globalmedia.pt', '+351 912 555 555', 'Global Media', 'Director', 'active') RETURNING id INTO c5;
  INSERT INTO public.contacts (owner_id, full_name, email, phone, company, job_title, status) VALUES
    (uid, 'Inês Costa', 'ines@delta.com', '+351 912 666 666', 'Delta Group', 'Head of Sales', 'lead') RETURNING id INTO c6;

  -- Deals
  INSERT INTO public.deals (owner_id, contact_id, title, value, stage, probability) VALUES
    (uid, c1, 'Acme Corp - Plano Enterprise', 120000, 'won', 100) RETURNING id INTO d1;
  INSERT INTO public.deals (owner_id, contact_id, title, value, stage, probability) VALUES
    (uid, c2, 'TechVision - Onboarding', 45000, 'negotiation', 70) RETURNING id INTO d2;
  INSERT INTO public.deals (owner_id, contact_id, title, value, stage, probability) VALUES
    (uid, c4, 'Orbit SA - Expansão', 210000, 'proposal', 50) RETURNING id INTO d3;
  INSERT INTO public.deals (owner_id, contact_id, title, value, stage, probability) VALUES
    (uid, c3, 'Nexus - Trial Pro', 28000, 'qualified', 30),
    (uid, c5, 'Global Media - Pacote Anual', 67000, 'lead', 15),
    (uid, c6, 'Delta - Demo', 15000, 'lead', 10);

  -- Tasks
  INSERT INTO public.tasks (owner_id, contact_id, deal_id, title, priority, due_date, status) VALUES
    (uid, c1, d1, 'Ligar a Maria Santos para upsell', 'high', now() + interval '4 hours', 'todo'),
    (uid, c2, d2, 'Enviar proposta a TechVision', 'high', now() + interval '8 hours', 'todo'),
    (uid, c4, d3, 'Preparar demo Orbit SA', 'medium', now() + interval '1 day', 'todo'),
    (uid, c3, NULL, 'Follow-up email Pedro Silva', 'low', now() + interval '3 days', 'todo'),
    (uid, NULL, NULL, 'Reunião interna pipeline', 'medium', now() + interval '5 days', 'done');

  -- Conversations + messages
  INSERT INTO public.conversations (owner_id, contact_id, channel, subject, handler, last_message_preview, last_message_at) VALUES
    (uid, c1, 'whatsapp', 'Suporte plano Enterprise', 'human', 'Obrigada! Vou testar agora.', now() - interval '2 minutes') RETURNING id INTO conv1;
  INSERT INTO public.conversations (owner_id, contact_id, channel, subject, handler, last_message_preview, last_message_at, unread_count) VALUES
    (uid, c2, 'instagram', 'Pricing enterprise', 'human', 'Quanto custa o plano enterprise?', now() - interval '8 minutes', 2) RETURNING id INTO conv2;
  INSERT INTO public.conversations (owner_id, contact_id, channel, subject, handler, last_message_preview, last_message_at, unread_count) VALUES
    (uid, c3, 'whatsapp', 'Demo agendamento', 'bot', 'Podem fazer demo amanhã?', now() - interval '15 minutes', 1) RETURNING id INTO conv3;
  INSERT INTO public.conversations (owner_id, contact_id, channel, subject, handler, last_message_preview, last_message_at) VALUES
    (uid, c4, 'facebook', 'Feedback apresentação', 'human', 'Gostei muito da apresentação', now() - interval '1 hour'),
    (uid, c5, 'email', 'Re: Proposta comercial', 'human', 'Re: Proposta comercial', now() - interval '2 hours');

  -- Messages for conv1
  INSERT INTO public.messages (conversation_id, owner_id, direction, content, author_name, created_at) VALUES
    (conv1, uid, 'inbound', 'Olá! Vi a vossa publicação sobre o NexCRM e fiquei interessada.', 'Maria Santos', now() - interval '10 minutes'),
    (conv1, uid, 'outbound', 'Olá Maria! 👋 Obrigada pelo interesse. Que tipo de empresa tens?', 'Bot', now() - interval '9 minutes'),
    (conv1, uid, 'inbound', 'Tenho uma agência de marketing com 12 pessoas.', 'Maria Santos', now() - interval '8 minutes'),
    (conv1, uid, 'outbound', 'Perfeito! O plano Growth inclui pipeline ilimitado, integração com email e 3 agentes IA. €49/utilizador/mês. Queres uma demo de 15 min?', 'Bot', now() - interval '7 minutes'),
    (conv1, uid, 'inbound', 'Obrigada! Vou testar agora.', 'Maria Santos', now() - interval '2 minutes');

  INSERT INTO public.messages (conversation_id, owner_id, direction, content, author_name, created_at) VALUES
    (conv2, uid, 'inbound', 'Olá, queria saber sobre os planos.', 'Carlos Mendes', now() - interval '20 minutes'),
    (conv2, uid, 'inbound', 'Quanto custa o plano enterprise?', 'Carlos Mendes', now() - interval '8 minutes');

  INSERT INTO public.messages (conversation_id, owner_id, direction, content, author_name, created_at) VALUES
    (conv3, uid, 'inbound', 'Podem fazer demo amanhã?', 'Pedro Silva', now() - interval '15 minutes');

  -- Reset unread on conv1 since it was synthetic
  UPDATE public.conversations SET unread_count = 0 WHERE id = conv1;

  -- Social accounts
  INSERT INTO public.social_accounts (owner_id, platform, display_name, username, followers) VALUES
    (uid, 'facebook', 'NexCRM Portugal', 'nexcrm.pt', 12400),
    (uid, 'instagram', '@nexcrm.pt', 'nexcrm.pt', 8200);

  -- Social posts
  INSERT INTO public.social_posts (owner_id, caption, platforms, scheduled_at, status, likes, comments_count) VALUES
    (uid, 'Lançamento da nova feature de IA 🚀 Conhece o futuro da gestão comercial', ARRAY['instagram']::social_platform[], now() + interval '6 hours', 'scheduled', 0, 0) RETURNING id INTO post1;
  INSERT INTO public.social_posts (owner_id, caption, platforms, scheduled_at, status, likes, comments_count) VALUES
    (uid, 'Webinar gratuito esta sexta sobre automação de vendas. Inscreve-te!', ARRAY['facebook']::social_platform[], now() + interval '1 day', 'scheduled', 0, 0) RETURNING id INTO post2;
  INSERT INTO public.social_posts (owner_id, caption, platforms, status, likes, comments_count) VALUES
    (uid, 'Como reduzir o ciclo de vendas em 40% com IA', ARRAY['instagram','facebook']::social_platform[], 'published', 1842, 23),
    (uid, 'Caso de sucesso: empresa X aumentou receita em 3x', ARRAY['facebook']::social_platform[], 'published', 956, 14);

  -- Social comments
  INSERT INTO public.social_comments (owner_id, post_id, contact_id, platform, author_name, text, ai_suggestion, status) VALUES
    (uid, post1, c1, 'instagram', 'Maria Silva', 'Adorei! Como faço para experimentar?', 'Olá Maria! Que bom que gostaste 💜 Podes começar grátis em nexcrm.pt/trial. Precisas de ajuda?', 'pending'),
    (uid, post2, c2, 'facebook', 'João Costa', 'Os preços incluem IVA?', 'Olá João! Sim, todos os preços já incluem IVA. Posso enviar mais detalhes em DM?', 'pending'),
    (uid, post1, NULL, 'instagram', 'Sofia Pereira', 'Vou recomendar à minha equipa!', 'Obrigada Sofia! 🙏 Se precisarem de ajuda no onboarding estamos cá.', 'pending');

  -- Audiences
  INSERT INTO public.audiences (owner_id, name, description, contacts_count) VALUES
    (uid, 'Leads frios (90 dias)', 'Contactos sem interação nos últimos 90 dias', 1842) RETURNING id INTO aud1;
  INSERT INTO public.audiences (owner_id, name, description, contacts_count) VALUES
    (uid, 'Clientes ativos plano Pro', 'Subscritores Pro ativos', 426) RETURNING id INTO aud2;
  INSERT INTO public.audiences (owner_id, name, description, contacts_count) VALUES
    (uid, 'Trial expirado última semana', 'Trials expirados nos últimos 7 dias', 287);

  -- Campaigns
  INSERT INTO public.campaigns (owner_id, name, channel, audience_id, mode, template, status, sent_count, delivered_count, opened_count, replied_count) VALUES
    (uid, 'Black Friday WhatsApp', 'whatsapp', aud1, 'hybrid', 'Olá {nome}! Black Friday: 50% off no plano Pro 🔥', 'running', 1240, 1180, 892, 234),
    (uid, 'Reativação SMS clientes', 'sms', aud2, 'auto', 'Olá {nome}, novidades para a {empresa}!', 'completed', 426, 410, 380, 112),
    (uid, 'Webinar follow-up', 'email', aud1, 'manual', 'Olá {nome}, obrigado por participares no webinar.', 'draft', 0, 0, 0, 0);
END;
$$;

GRANT EXECUTE ON FUNCTION public.seed_demo_data() TO authenticated;
