
import { OpenAIAnalysisResult } from '@/types/simulador';

export const mockAnalysisResult: OpenAIAnalysisResult = {
  pontuacao: 4.0,
  acertos: [
    "Identificou corretamente o tipo de recurso cabível para a situação apresentada",
    "Estruturou adequadamente a peça processual com os elementos essenciais",
    "Fundamentou corretamente com base na legislação processual aplicável",
    "Apresentou argumentação jurídica coerente com o caso concreto"
  ],
  erros: [
    "Falhou em apresentar todos os fundamentos legais que sustentam o pedido de urgência",
    "Não explorou suficientemente os argumentos sobre o perigo da demora",
    "Alguns pedidos não estavam alinhados com a jurisprudência atual dos tribunais superiores",
    "Não apresentou jurisprudência suficiente para embasar as alegações"
  ],
  sugestoes: [
    "Aprofundar o estudo sobre os pressupostos da tutela de urgência no CPC",
    "Trabalhar na fundamentação jurídica com maior embasamento doutrinário",
    "Incluir mais citações jurisprudenciais relevantes para o caso",
    "Desenvolver melhor os argumentos sobre o fumus boni iuris e periculum in mora"
  ],
  comentarioGeral: "Sua peça demonstra um bom domínio da técnica processual e conhecimento adequado do direito material envolvido. A estrutura está correta e os fundamentos legais básicos foram apresentados. Contudo, há espaço para aprimoramento na fundamentação jurídica, especialmente no tocante à demonstração da urgência do pedido e na apresentação de jurisprudência pertinente. Recomendo revisão dos requisitos para concessão de tutelas provisórias e aprofundamento do estudo sobre a argumentação jurídica aplicável ao caso.",
  tabelaPontuacao: [
    { item: "Endereçamento e qualificação das partes", valor: 0.5, obtido: 0.5 },
    { item: "Fundamentos jurídicos do pedido", valor: 2.0, obtido: 1.5 },
    { item: "Requisitos da tutela provisória", valor: 1.5, obtido: 1.0 },
    { item: "Pedidos adequados", valor: 1.0, obtido: 0.8 }
  ],
  questoesDissertativas: {
    1: {
      pontuacao: 1.0,
      comentario: "A resposta apresenta um bom entendimento sobre os requisitos da tutela provisória de urgência, mas poderia ter desenvolvido melhor a diferença entre o fumus boni iuris e o periculum in mora.",
      itensIdentificados: [
        "Identificou corretamente os requisitos da tutela de urgência",
        "Explicou adequadamente a probabilidade do direito"
      ],
      itensFaltantes: [
        "Não explorou suficientemente a diferença entre tutela cautelar e tutela antecipada",
        "Faltou mencionar o requisito negativo (reversibilidade da medida)"
      ]
    },
    2: {
      pontuacao: 0.75,
      comentario: "A resposta sobre o prazo e documentação do agravo foi parcialmente correta, mas deixou de mencionar alguns documentos obrigatórios.",
      itensIdentificados: [
        "Indicou corretamente o prazo de 15 dias úteis",
        "Mencionou a necessidade de cópia da decisão agravada"
      ],
      itensFaltantes: [
        "Não mencionou a necessidade de procuração",
        "Faltou citar a necessidade do comprovante de preparo"
      ]
    }
  }
};
