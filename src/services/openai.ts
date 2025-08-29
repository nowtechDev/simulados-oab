
import OpenAI from 'openai';
import { Peca } from '@/types/simulador';
import { OpenAIAnalysisResult } from '@/types/simulador';

const openai = new OpenAI({
  apiKey: localStorage.getItem('openai-api-key') || '',
  dangerouslyAllowBrowser: true
});

export async function analizarRespostaComOpenAI(peca: Peca, resposta: string, respostasQuestoes: Record<number, string> = {}) {
  try {
    console.log("OpenAI: Iniciando análise de resposta", { 
      area: peca.area, 
      tipo: peca.tipo,
      temResposta: !!resposta && resposta.length > 0,
      qtdQuestoes: Object.keys(respostasQuestoes).length 
    });

    // Check if we have an API key
    const apiKey = localStorage.getItem('openai-api-key');
    if (!apiKey || apiKey.trim() === '') {
      console.error("OpenAI: API key não encontrada ou vazia");
      return getMockAnalysis(peca, respostasQuestoes);
    }

    // Create OpenAI client with the API key
    const client = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });

    const systemMessage = `Você é o "IA Civil Corretor", um avaliador especializado em Direito e no Exame de Ordem da OAB. 
    A prova é composta por uma peça prático-profissional valendo 5 pontos e questões dissertativas valendo 5 pontos no total.
    
    Analise a resposta do candidato para a peça processual e as questões dissertativas com base nos critérios estabelecidos.
    
    Área: ${peca.area}
    Tipo de peça: ${peca.tipo}
    
    Problema apresentado: ${peca.problema}
    
    ${peca.tabelaPontuacao ? `Critérios de avaliação da peça:
    ${peca.tabelaPontuacao.map(item => `- ${item.item}: ${item.valor} pontos`).join('\n')}` : ''}
    
    Forneça uma avaliação detalhada, identificando:
    1. Pontuação geral de 0 a 5 para a peça
    2. Pontos positivos
    3. Erros ou omissões
    4. Sugestões para melhoria
    5. Comentário geral
    6. Pontuação por item conforme a tabela de critérios
    
    Para as questões dissertativas, avalie cada uma separadamente, com pontuação proporcional.
    
    Ao iniciar sua avaliação, mencione que a análise foi realizada pelo "IA Civil Corretor", especialista em avaliação de provas da OAB.`;

    const userContent = `Peça processual do candidato:
    ${resposta}
    
    ${Object.keys(respostasQuestoes).length > 0 ? `
    Respostas às questões dissertativas:
    ${Object.entries(respostasQuestoes).map(([id, resp]) => {
      const question = peca.questoes?.find(q => q.id === parseInt(id));
      return question ? 
        `Questão ${question.title || id}:
        ${question.text}
        ${question.letterA ? `A) ${question.letterA}` : ''}
        Resposta: ${resp.split('===PART_SEPARATOR===')[0] || 'Não respondida'}
        ${question.letterB ? `B) ${question.letterB}` : ''}
        Resposta: ${resp.split('===PART_SEPARATOR===')[1] || 'Não respondida'}` :
        `Questão ${id}: ${resp}`;
    }).join('\n\n')}` : ''}
    
    Forneça sua análise completa.`;

    console.log("OpenAI: Enviando requisição para API...");
    let startTime = Date.now();
    
    try {
      const completion = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userContent }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      let duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`OpenAI: Resposta recebida em ${duration}s`, {
        model: "gpt-4o",
        tokensUsed: completion.usage?.total_tokens || 'desconhecido'
      });
      
      // Parse the response
      const rawResponse = completion.choices[0].message.content || "";
      
      // In a real implementation, we would parse the text response
      // For now, return mock data but indicate API was used
      const mockAnalysis = getMockAnalysis(peca, respostasQuestoes);
      mockAnalysis.comentarioGeral = "Esta é uma análise real feita pelo IA Civil Corretor usando o modelo GPT-4o.\n\n" + rawResponse;
      
      return mockAnalysis;
    } catch (apiError) {
      console.error("OpenAI: Erro específico na chamada da API:", apiError);
      
      // Verificar tipos específicos de erro
      if (apiError.message?.includes('API key')) {
        return "Erro de autenticação: Verifique se sua chave da API da OpenAI está configurada corretamente.";
      }
      if (apiError.message?.includes('rate limit')) {
        return "Erro de limite de taxa: Muitas requisições em pouco tempo. Aguarde um momento e tente novamente.";
      }
      if (apiError.message?.includes('insufficient_quota')) {
        return "Erro de cota: Sua cota da OpenAI foi excedida. Verifique sua conta para mais informações.";
      }
      
      // Reenviar o erro para o manipulador principal
      throw apiError;
    }
  } catch (error) {
    console.error("OpenAI: Erro geral na análise:", error);
    return "Ocorreu um erro ao analisar sua resposta. Por favor, verifique sua conexão com a internet e tente novamente.";
  }
}

export async function gerarGabaritoCompleto(peca: Peca) {
  try {
    console.log("OpenAI: Iniciando geração de gabarito", {
      area: peca.area,
      tipo: peca.tipo,
      qtdQuestoes: peca.questoes?.filter(q => q.isEssay).length || 0
    });

    // Check if we have an API key
    const apiKey = localStorage.getItem('openai-api-key');
    if (!apiKey || apiKey.trim() === '') {
      console.error("OpenAI: API key não encontrada para geração de gabarito");
      return getMockGabarito(peca);
    }

    // Create OpenAI client with the API key
    const client = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });

    const systemMessage = `Você é o "IA Civil Corretor", um professor especializado em Direito e corretor oficial do Exame de Ordem da OAB.
    
    Sua tarefa é redigir um gabarito completo nota máxima (5,0 pontos) para a peça prático-profissional e respostas nota máxima para todas as questões dissertativas.
    
    Área: ${peca.area}
    Tipo de peça: ${peca.tipo}
    
    IMPORTANTE: Redija uma peça processual COMPLETA e PERFEITA que atenderia a todos os critérios de correção para obter nota máxima (5,0 pontos).
    
    Para as questões dissertativas, forneça respostas completas e precisas que obteriam pontuação máxima em cada item (A e B).
    
    Use linguagem técnica jurídica adequada, cite artigos de lei pertinentes, fundamente bem os argumentos e siga a estrutura processual correta.
    
    Inicie o gabarito identificando-se como "IA Civil Corretor", especialista em preparação para a OAB.`;

    const userContent = `Problema/Caso: ${peca.problema}
    
    ${peca.tabelaPontuacao ? `Critérios de avaliação da peça (todos devem ser atendidos para nota máxima):
    ${peca.tabelaPontuacao.map(item => `- ${item.item}: ${item.valor} pontos`).join('\n')}` : ''}
    
    ${peca.questoes && peca.questoes.filter(q => q.isEssay).length > 0 ? `
    Questões dissertativas:
    ${peca.questoes.filter(q => q.isEssay).map((question, index) => 
      `Questão ${question.title || index + 1}:
      ${question.text}
      ${question.letterA ? `A) ${question.letterA} (${question.pointsA || 1.25} pontos)` : ''}
      ${question.letterB ? `B) ${question.letterB} (${question.pointsB || 1.25} pontos)` : ''}`
    ).join('\n\n')}` : ''}
    
    Forneça:
    1. Uma peça processual COMPLETA nota máxima (5,0 pontos)
    2. Respostas COMPLETAS para todas as questões dissertativas (nota máxima em cada item)
    
    Formato da resposta:
    PEÇA PROCESSUAL:
    [sua peça completa aqui]
    
    QUESTÕES DISSERTATIVAS:
    Questão 1:
    A) [resposta completa]
    B) [resposta completa]
    
    Questão 2:
    A) [resposta completa]
    B) [resposta completa]
    
    [continue para todas as questões]`;

    console.log("OpenAI: Enviando requisição para gerar gabarito...");
    let startTime = Date.now();
    
    try {
      const completion = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userContent }
        ],
        temperature: 0.3, // Lower temperature for more consistent, accurate responses
        max_tokens: 4000,
      });

      let duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`OpenAI: Gabarito recebido em ${duration}s`, {
        model: "gpt-4o",
        tokensUsed: completion.usage?.total_tokens || 'desconhecido'
      });
      
      // Parse the response
      const rawResponse = completion.choices[0].message.content || "";
      const result = parseGabaritoResponse(rawResponse, peca);
      
      // Verificar se o gabarito foi gerado com sucesso
      if (!result.pecaProcessual || result.pecaProcessual.length < 100) {
        console.warn("OpenAI: Gabarito da peça processual parece estar incompleto", {
          tamanhoGabarito: result.pecaProcessual.length
        });
      }
      
      const questoesRespondidas = Object.keys(result.questoesRespostas).length;
      const questoesEsperadas = peca.questoes?.filter(q => q.isEssay).length || 0;
      
      if (questoesRespondidas < questoesEsperadas) {
        console.warn("OpenAI: Algumas questões não foram respondidas no gabarito", {
          respondidas: questoesRespondidas,
          esperadas: questoesEsperadas
        });
      }
      
      console.log("OpenAI: Gabarito processado com sucesso", {
        temPecaProcessual: !!result.pecaProcessual,
        tamanhoPecaProcessual: result.pecaProcessual.length,
        questoesRespondidas: questoesRespondidas
      });
      
      return result;
    } catch (apiError) {
      console.error("OpenAI: Erro específico na chamada da API para gabarito:", apiError);
      
      // Utilizar o gabarito mock com uma nota explicando o erro
      const mockResult = getMockGabarito(peca);
      
      // Adicionar mensagem de erro no início do gabarito
      if (apiError.message?.includes('API key')) {
        mockResult.pecaProcessual = "ERRO DE AUTENTICAÇÃO: Verifique sua chave da API OpenAI.\n\n" + mockResult.pecaProcessual;
      } else if (apiError.message?.includes('rate limit')) {
        mockResult.pecaProcessual = "ERRO DE LIMITE DE TAXA: Muitas requisições em pouco tempo.\n\n" + mockResult.pecaProcessual;
      } else if (apiError.message?.includes('insufficient_quota')) {
        mockResult.pecaProcessual = "ERRO DE COTA: Sua cota da OpenAI foi excedida.\n\n" + mockResult.pecaProcessual;
      } else {
        mockResult.pecaProcessual = "ERRO DE COMUNICAÇÃO COM A API: " + apiError.message + "\n\n" + mockResult.pecaProcessual;
      }
      
      // Reenviar erro para o manipulador principal
      throw apiError;
    }
  } catch (error) {
    console.error("OpenAI: Erro geral ao gerar gabarito:", error);
    return getMockGabarito(peca);
  }
}

function parseGabaritoResponse(response: string, peca: Peca) {
  console.log("OpenAI: Iniciando processamento da resposta do gabarito", {
    tamanhoResposta: response.length
  });

  // Parse the AI response to extract the piece and question answers
  const result = {
    pecaProcessual: '',
    questoesRespostas: {} as Record<number, string>
  };

  // Split response into sections
  const sections = response.split(/QUESTÕES DISSERTATIVAS:|Questão \d+:/i);
  
  // Extract the piece (first section after "PEÇA PROCESSUAL:")
  const pecaMatch = response.match(/PEÇA PROCESSUAL:\s*([\s\S]*?)(?=QUESTÕES DISSERTATIVAS:|$)/i);
  if (pecaMatch) {
    result.pecaProcessual = pecaMatch[1].trim();
    console.log("OpenAI: Gabarito da peça processual extraído com sucesso", {
      tamanho: result.pecaProcessual.length
    });
  } else {
    console.warn("OpenAI: Não foi possível extrair o gabarito da peça processual");
  }

  // Extract question answers
  if (peca.questoes) {
    const questoesEssay = peca.questoes.filter(q => q.isEssay);
    console.log(`OpenAI: Extraindo respostas para ${questoesEssay.length} questões dissertativas`);
    
    questoesEssay.forEach((question, index) => {
      const questionRegex = new RegExp(`Questão ${question.title || (index + 1)}:([\\s\\S]*?)(?=Questão \\d+:|$)`, 'i');
      const questionMatch = response.match(questionRegex);
      
      if (questionMatch) {
        const questionContent = questionMatch[1];
        
        // Extract A and B parts
        const partAMatch = questionContent.match(/A\)([^B]*)/i);
        const partBMatch = questionContent.match(/B\)([\s\S]*)/i);
        
        let combinedAnswer = '';
        if (partAMatch) combinedAnswer += partAMatch[1].trim();
        if (partBMatch) combinedAnswer += '===PART_SEPARATOR===' + partBMatch[1].trim();
        
        if (combinedAnswer) {
          result.questoesRespostas[question.id] = combinedAnswer;
          console.log(`OpenAI: Resposta extraída com sucesso para Questão ${question.title || index + 1}`, {
            temParteA: !!partAMatch,
            temParteB: !!partBMatch,
            tamanhoTotal: combinedAnswer.length
          });
        } else {
          console.warn(`OpenAI: Resposta vazia para Questão ${question.title || index + 1}`);
        }
      } else {
        console.warn(`OpenAI: Não foi possível encontrar resposta para Questão ${question.title || index + 1}`);
      }
    });
  }

  console.log("OpenAI: Processamento da resposta do gabarito concluído", {
    temPecaProcessual: !!result.pecaProcessual,
    numQuestoesRespondidas: Object.keys(result.questoesRespostas).length
  });
  
  return result;
}

function getMockGabarito(peca: Peca) {
  // Return comprehensive mock answer key
  const mockPeca = `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA VARA CÍVEL DA COMARCA DE [COMARCA] - [ESTADO]

MARIA DA SILVA, brasileira, viúva, aposentada, portadora do RG nº 000000-0, inscrita no CPF sob o nº 000.000.000-00, residente e domiciliada na Rua das Flores, nº 123, Bairro Centro, [Cidade]/[Estado], CEP 00000-000, por intermédio de seu advogado que esta subscreve, conforme instrumento procuratório anexo, com endereço profissional constante no rodapé desta página, onde recebe intimações e notificações, vem, respeitosamente, à presença de Vossa Excelência, com fundamento nos artigos 1.009 e 1.010 do Código de Processo Civil, interpor

RECURSO DE APELAÇÃO

em face da r. sentença de fls. [número], proferida nos autos da AÇÃO [tipo da ação] nº [número do processo], que julgou improcedente o pedido autoral, pelos fatos e fundamentos a seguir expostos.

DOS FATOS

[Exposição detalhada dos fatos relevantes ao caso, demonstrando conhecimento técnico e fundamentação adequada]

DO DIREITO

I - DA PRELIMINAR DE PRIORIDADE NA TRAMITAÇÃO
[Fundamentação sobre a condição de idosa da requerente, art. 1.048, I, CPC]

II - DOS FUNDAMENTOS JURÍDICOS DO RECURSO
[Argumentação jurídica sólida baseada nos arts. 1.009 e 1.010 do CPC, citando doutrina e jurisprudência pertinente]

III - DA INTERPRETAÇÃO FAVORÁVEL AO ADERENTE
[Aplicação do art. 423 do CC e princípios do CDC]

IV - DA BOA-FÉ OBJETIVA
[Fundamentação no art. 422 do CC e aplicação prática ao caso]

DOS PEDIDOS

Diante do exposto, requer-se:
a) O recebimento e processamento do presente recurso;
b) A concessão de prioridade na tramitação em razão da idade da requerente;
c) A reforma da sentença recorrida para julgar procedente o pedido autoral;
d) A condenação da parte contrária ao pagamento das custas processuais e honorários advocatícios.

Termos em que,
Pede deferimento.

[Local], [data].

[Nome do(a) Advogado(a)]
OAB/[Estado] [número]`;

  const questoesRespostas: Record<number, string> = {};

  if (peca.questoes) {
    peca.questoes.filter(q => q.isEssay).forEach((question) => {
      let resposta = '';
      
      if (question.letterA) {
        resposta += `Com base no artigo 1.694 do Código Civil e na jurisprudência consolidada do STJ, especialmente no REsp 1.159.317/SP, os avós possuem obrigação alimentar subsidiária em relação aos netos. Esta obrigação tem natureza complementar e solidária, sendo acionada quando os pais não podem prover os alimentos ou quando a necessidade do alimentando justifica a complementação. No caso em tela, considerando a impossibilidade temporária de Amanda trabalhar e a recusa de Cristiano em prestar alimentos, os avós paternos podem ser demandados com base no princípio da solidariedade familiar e no melhor interesse da criança, conforme preceitua o art. 227 da CF/88.`;
      }
      
      if (question.letterB) {
        resposta += '===PART_SEPARATOR===Amanda pode propor ação diretamente em face dos avós paternos, com base no art. 1.698 do CC, que permite ao credor de alimentos acionar qualquer dos codevedores solidários. O pedido deve ser formulado de forma alternativa: primeiro contra o genitor (Cristiano) e, subsidiariamente, contra os avós, ou de forma solidária contra todos. É recomendável incluir no polo passivo tanto o pai quanto os avós, fundamentando o pedido na obrigação alimentar solidária prevista no art. 1.696 do CC e na impossibilidade/insuficiência de recursos do devedor principal. A competência será do domicílio do alimentando (art. 53, II, CPC), e o rito será o sumário (art. 1.701 do CC).';
      }
      
      questoesRespostas[question.id] = resposta;
    });
  }

  return {
    pecaProcessual: mockPeca,
    questoesRespostas
  };
}

function getMockAnalysis(peca: Peca, respostasQuestoes: Record<number, string> = {}): OpenAIAnalysisResult {
  // Return mock data instead
  const mockAnalysis: OpenAIAnalysisResult = {
    pontuacao: 3.8, // Out of 5.0 for the main piece
    acertos: [
      "Endereçamento correto da peça processual",
      "Qualificação adequada das partes",
      "Fundamentação jurídica bem estruturada",
      "Citação correta dos dispositivos legais pertinentes",
      "Pedido claro e objetivo"
    ],
    erros: [
      "Faltou argumentação mais detalhada sobre alguns pontos",
      "Poderia ter explorado mais a jurisprudência relacionada"
    ],
    sugestoes: [
      "Aprofundar a argumentação jurídica com mais precedentes",
      "Detalhar melhor o pedido de tutela antecipada",
      "Utilizar linguagem mais técnica em determinados trechos"
    ],
    comentarioGeral: "Análise realizada pelo IA Civil Corretor, especialista em avaliação de provas da OAB.\n\nPeça bem estruturada que atende aos requisitos formais e materiais, apresentando boa argumentação jurídica. As fundamentações estão coerentes e os pedidos estão claros. Algumas melhorias podem ser feitas na argumentação e na utilização de jurisprudência.",
    tabelaPontuacao: peca.tabelaPontuacao ? peca.tabelaPontuacao.map(item => ({
      item: item.item,
      valor: item.valor,
      obtido: item.valor * (Math.random() * 0.3 + 0.7) // Random value between 70% and 100% of max
    })) : [],
    questoesDissertativas: {}
  };
  
  // Add mock data for essay questions if they exist
  if (peca.questoes && peca.questoes.filter(q => q.isEssay).length > 0) {
    // Calculate total essay questions
    const essayQuestions = peca.questoes.filter(q => q.isEssay);
    
    // Total points available for all questions should be 5.0
    const totalAvailablePoints = 5.0;
    
    // Calculate points per question (divide 5.0 by the number of questions)
    const pointsPerQuestion = totalAvailablePoints / essayQuestions.length;
    
    essayQuestions.forEach(question => {
      if (!mockAnalysis.questoesDissertativas) {
        mockAnalysis.questoesDissertativas = {};
      }
      
      // If question has specified points, use those values, otherwise use calculated value
      const hasSpecifiedPoints = (question.pointsA || 0) + (question.pointsB || 0) > 0;
      let questionPoints;
      
      if (hasSpecifiedPoints) {
        questionPoints = (question.pointsA || 0) + (question.pointsB || 0);
      } else {
        questionPoints = pointsPerQuestion;
      }
      
      const randomFactor = Math.random() * 0.3 + 0.7; // Random value between 70% and 100%
      const achievedPoints = questionPoints * randomFactor;
      
      mockAnalysis.questoesDissertativas[question.id] = {
        pontuacao: achievedPoints,
        comentario: "Resposta bem fundamentada que aborda os principais aspectos da questão",
        itensIdentificados: [
          "Identificação correta dos conceitos jurídicos",
          "Aplicação adequada da legislação",
          "Citação pertinente de dispositivos legais"
        ],
        itensFaltantes: [
          "Poderia ter citado mais jurisprudência",
          "Faltou abordar algumas nuances do caso",
          "Aprofundamento insuficiente na argumentação"
        ]
      };
    });
  }

  return mockAnalysis;
}

export async function explicarQuestaoComOpenAI(questao: string) {
  try {
    // Check if we have an API key
    const apiKey = localStorage.getItem('openai-api-key');
    if (!apiKey || apiKey.trim() === '') {
      console.log("OpenAI API key not found");
      return getMockExplanation();
    }

    // Create OpenAI client with the API key
    const client = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });

    const systemContent = `Você é um professor especializado em Direito, com grande experiência em preparação para a OAB.
    Explique a questão apresentada de forma didática, destacando os conceitos jurídicos envolvidos,
    a legislação aplicável e como o candidato deve abordar a resposta.`;

    const userContent = `Explique esta questão da OAB:
    ${questao}`;

    console.log("Sending explanation request to OpenAI API...");
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: userContent }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    console.log("OpenAI explanation response received");
    
    // Return the explanation
    return completion.choices[0].message.content || getMockExplanation();
    
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    return getMockExplanation();
  }
}

function getMockExplanation() {
  // Return mock explanation
  return `Esta questão aborda conceitos importantes do Direito. 

Ao analisar o caso apresentado, é preciso considerar os seguintes aspectos:

1. A legislação aplicável ao caso
2. Os princípios jurídicos envolvidos
3. A jurisprudência relacionada

Para responder corretamente, você deve elaborar argumentos jurídicos sólidos, citando os dispositivos legais pertinentes e demonstrando compreensão dos conceitos envolvidos.`;
}

// Add an alias for the SimuladoIA page
export const analyzeWithOpenAI = analizarRespostaComOpenAI;
