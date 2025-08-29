
-- Adicionar as novas colunas à tabela plans
ALTER TABLE public.plans 
ADD COLUMN slug text UNIQUE,
ADD COLUMN display_name text,
ADD COLUMN price decimal(10,2),
ADD COLUMN billing_cycle text DEFAULT 'mensal',
ADD COLUMN benefits jsonb DEFAULT '[]'::jsonb,
ADD COLUMN is_popular boolean DEFAULT false,
ADD COLUMN color_theme text DEFAULT '#4F1964',
ADD COLUMN active boolean DEFAULT true,
ADD COLUMN sort_order integer DEFAULT 0;

-- Inserir os dados dos planos estáticos das páginas
INSERT INTO public.plans (
  slug, 
  display_name, 
  name, 
  description, 
  price, 
  value, 
  billing_cycle, 
  benefits, 
  is_popular, 
  color_theme, 
  active, 
  sort_order
) VALUES 
(
  'essencial',
  'Plano Menthor Aprendiz',
  'Plano Menthor Aprendiz',
  'Complete as informações abaixo para começar sua jornada de aprovação na OAB.',
  39.90,
  3990, -- valor em centavos
  'mensal',
  '[
    "Acesso completo ao banco de questões da 1ª e 2ª fase FGV",
    "Resolva provas e converse com a IA diretamente abaixo das questões", 
    "A IA interage com o enunciado e alternativas, explica seus erros e tira dúvidas em tempo real",
    "Treinamento para a 2ª fase com acesso ao banco de provas reais",
    "A IA corrige sua peça como um examinador, dá feedback e responde suas dúvidas",
    "Crie cadernos com ajuda da IA e organize por tema e matéria"
  ]'::jsonb,
  false,
  '#4F1964',
  true,
  1
),
(
  'profissional',
  'Plano Menthor Avançado', 
  'Plano Menthor Avançado',
  'Complete as informações abaixo para começar sua jornada de aprovação na OAB.',
  59.90,
  5990, -- valor em centavos
  'mensal',
  '[
    "Tudo do plano Menthor Aprendiz, e mais:",
    "A IA cria simulados completos da 1ª fase com foco nos temas que mais caem",
    "Acompanha sua resolução com explicações personalizadas e análise de desempenho", 
    "Gere peças da 2ª fase personalizadas: escolha a área, o tipo de peça, e a IA entrega o enunciado, corrige e oferece um modelo nota 10",
    "Solicite questões estilo FGV sobre os temas em que mais tem dificuldade",
    "Exporte cadernos otimizados pela IA direto para Word"
  ]'::jsonb,
  true,
  '#4F1964',
  true,
  2
);
