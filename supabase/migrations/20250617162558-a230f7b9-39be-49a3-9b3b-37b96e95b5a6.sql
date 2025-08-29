
-- Verificar se os planos já existem e inserir se necessário
INSERT INTO public.plans (
  id,
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
  1,
  'essencial',
  'Plano Menthor Aprendiz',
  'Plano Menthor Aprendiz',
  'Complete as informações abaixo para começar sua jornada de aprovação na OAB.',
  39.90,
  3990,
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
  2,
  'profissional',
  'Plano Menthor Avançado', 
  'Plano Menthor Avançado',
  'Complete as informações abaixo para começar sua jornada de aprovação na OAB.',
  59.90,
  5990,
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
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  display_name = EXCLUDED.display_name,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  value = EXCLUDED.value,
  billing_cycle = EXCLUDED.billing_cycle,
  benefits = EXCLUDED.benefits,
  is_popular = EXCLUDED.is_popular,
  color_theme = EXCLUDED.color_theme,
  active = EXCLUDED.active,
  sort_order = EXCLUDED.sort_order;
