
-- Criar tabela para rastrear interações com IA
CREATE TABLE public.ia_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('openai', 'gemini', 'grok', 'deepseek', 'claude')),
  model TEXT NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  cost_usd DECIMAL(10, 6) DEFAULT 0,
  page_context TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Adicionar RLS
ALTER TABLE public.ia_interactions ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas suas próprias interações
CREATE POLICY "Users can view their own interactions" 
  ON public.ia_interactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para usuários criarem suas próprias interações
CREATE POLICY "Users can create their own interactions" 
  ON public.ia_interactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem suas próprias interações
CREATE POLICY "Users can update their own interactions" 
  ON public.ia_interactions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para administradores verem todas as interações
CREATE POLICY "Admins can view all interactions" 
  ON public.ia_interactions 
  FOR SELECT 
  USING (is_admin_user());

-- Índices para melhor performance
CREATE INDEX idx_ia_interactions_user_id ON public.ia_interactions(user_id);
CREATE INDEX idx_ia_interactions_provider ON public.ia_interactions(provider);
CREATE INDEX idx_ia_interactions_created_at ON public.ia_interactions(created_at);
