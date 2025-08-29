
-- Criar tabela para armazenar tokens de IA dos usuários
CREATE TABLE public.tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  nome_ia TEXT NOT NULL,
  token TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar Row Level Security (RLS)
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;

-- Política para usuários visualizarem apenas seus próprios tokens
CREATE POLICY "Users can view their own tokens" 
  ON public.tokens 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para usuários criarem seus próprios tokens
CREATE POLICY "Users can create their own tokens" 
  ON public.tokens 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem seus próprios tokens
CREATE POLICY "Users can update their own tokens" 
  ON public.tokens 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para usuários deletarem seus próprios tokens
CREATE POLICY "Users can delete their own tokens" 
  ON public.tokens 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_tokens_updated_at 
  BEFORE UPDATE ON public.tokens 
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
