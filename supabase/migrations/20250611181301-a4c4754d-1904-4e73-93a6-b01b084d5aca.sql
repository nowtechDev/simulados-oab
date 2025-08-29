
-- Adicionar colunas para links e arquivos na tabela agentes_ia
ALTER TABLE public.agentes_ia 
ADD COLUMN links TEXT[] DEFAULT '{}',
ADD COLUMN arquivos JSONB DEFAULT '[]';

-- Criar bucket para armazenar arquivos dos agentes
INSERT INTO storage.buckets (id, name, public)
VALUES ('agente-arquivos', 'agente-arquivos', false);

-- Política para permitir upload de arquivos (apenas usuários autenticados)
CREATE POLICY "Usuários podem fazer upload de arquivos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'agente-arquivos' AND auth.uid() IS NOT NULL);

-- Política para permitir leitura de arquivos (apenas usuários autenticados)
CREATE POLICY "Usuários podem ler arquivos"
ON storage.objects FOR SELECT
USING (bucket_id = 'agente-arquivos' AND auth.uid() IS NOT NULL);

-- Política para permitir atualização de arquivos (apenas usuários autenticados)
CREATE POLICY "Usuários podem atualizar arquivos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'agente-arquivos' AND auth.uid() IS NOT NULL);

-- Política para permitir deletar arquivos (apenas usuários autenticados)
CREATE POLICY "Usuários podem deletar arquivos"
ON storage.objects FOR DELETE
USING (bucket_id = 'agente-arquivos' AND auth.uid() IS NOT NULL);
