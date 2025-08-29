
-- Adicionar nova coluna token_id na tabela agentes_ia
ALTER TABLE public.agentes_ia 
ADD COLUMN token_id UUID REFERENCES public.tokens(id);

-- Remover a coluna token_key_name (após certificar-se de que não há dados importantes)
ALTER TABLE public.agentes_ia 
DROP COLUMN token_key_name;
