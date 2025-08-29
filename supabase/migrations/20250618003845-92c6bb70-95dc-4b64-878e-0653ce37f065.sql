
-- Adicionar campo status na tabela plans_user
ALTER TABLE public.plans_user 
ADD COLUMN status boolean NOT NULL DEFAULT false;
