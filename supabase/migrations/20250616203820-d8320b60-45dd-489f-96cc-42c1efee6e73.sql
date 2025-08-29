
-- Criar políticas RLS para a tabela plans para permitir que apenas admins gerenciem planos
CREATE POLICY "Admins can view all plans" 
  ON public.plans 
  FOR SELECT 
  TO authenticated 
  USING (public.is_admin_user());

CREATE POLICY "Admins can insert plans" 
  ON public.plans 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Admins can update plans" 
  ON public.plans 
  FOR UPDATE 
  TO authenticated 
  USING (public.is_admin_user());

CREATE POLICY "Admins can delete plans" 
  ON public.plans 
  FOR DELETE 
  TO authenticated 
  USING (public.is_admin_user());

-- Habilitar RLS na tabela plans
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
