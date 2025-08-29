
-- Adicionar constraints de unicidade para email e CPF quando type_user = 2
CREATE UNIQUE INDEX users_email_type_2_unique 
ON public.users (email) 
WHERE type_user = 2;

CREATE UNIQUE INDEX users_cpf_type_2_unique 
ON public.users ("cpfCnpj") 
WHERE type_user = 2;

-- Criar políticas RLS para a tabela users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data" 
  ON public.users 
  FOR SELECT 
  TO authenticated 
  USING (id = auth.uid());

CREATE POLICY "Users can update their own data" 
  ON public.users 
  FOR UPDATE 
  TO authenticated 
  USING (id = auth.uid());

-- Criar políticas RLS para a tabela plans_user
ALTER TABLE public.plans_user ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own plans" 
  ON public.plans_user 
  FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own plans" 
  ON public.plans_user 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own plans" 
  ON public.plans_user 
  FOR UPDATE 
  TO authenticated 
  USING (user_id = auth.uid());
