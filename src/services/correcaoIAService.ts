
import { supabase } from '@/integrations/supabase/client';
import { aiProvidersService } from './aiProviders';
import { QuestaoSimulado } from './simuladoIAService';

export interface RespostaCorrecao {
  questaoId: string;
  resposta: string;
  gabarito: string;
  pontos: Array<{
    descricao: string;
    pontuacao: string;
  }>;
}

export interface ResultadoCorrecao {
  questaoId: string;
  nota: number;
  feedbackDetalhado: string;
  pontosAtendidos: string[];
  pontosFaltantes: string[];
  sugestoesMelhoria: string[];
}

export interface CorrecaoCompleta {
  resultados: ResultadoCorrecao[];
  notaGeral: number;
  feedbackGeral: string;
  totalPontos: number;
  pontosObtidos: number;
}

export class CorrecaoIAService {
  private static instance: CorrecaoIAService;

  static getInstance(): CorrecaoIAService {
    if (!CorrecaoIAService.instance) {
      CorrecaoIAService.instance = new CorrecaoIAService();
    }
    return CorrecaoIAService.instance;
  }

  async buscarAgenteCorretor() {
    try {
      const { data, error } = await supabase
        .from('agentes_ia')
        .select('*')
        .eq('nome', 'IA Civil Corretor')
        .eq('ativo', true)
        .single();

      if (error) {
        console.error('Erro ao buscar agente corretor:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar agente:', error);
      return null;
    }
  }

  async buscarGabaritoEPontos(questaoId: string) {
    try {
      // Buscar questão com gabarito
      const { data: questao, error: questaoError } = await supabase
        .from('segunda_fase_questoes')
        .select('gabarito')
        .eq('id', questaoId)
        .single();

      if (questaoError) {
        console.error('Erro ao buscar gabarito:', questaoError);
        return null;
      }

      // Buscar pontos relacionados
      const { data: pontos, error: pontosError } = await supabase
        .from('segunda_fase_pontos')
        .select('descricao, pontuacao')
        .eq('entrada_id', questaoId);

      if (pontosError) {
        console.error('Erro ao buscar pontos:', pontosError);
        return { gabarito: questao.gabarito, pontos: [] };
      }

      return {
        gabarito: questao.gabarito || '',
        pontos: pontos || []
      };
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      return null;
    }
  }

  async corrigirRespostas(
    questoes: QuestaoSimulado[],
    respostas: Record<string, string>
  ): Promise<CorrecaoCompleta> {
    try {
      const agente = await this.buscarAgenteCorretor();
      
      if (!agente) {
        throw new Error('Agente IA Civil Corretor não encontrado no sistema');
      }

      const resultados: ResultadoCorrecao[] = [];
      let totalPontos = 0;
      let pontosObtidos = 0;

      // Processar cada questão
      for (const questao of questoes) {
        const resposta = respostas[questao.id];
        if (!resposta) continue;

        const dadosGabarito = await this.buscarGabaritoEPontos(questao.id);
        if (!dadosGabarito) continue;

        const pontosQuestao = dadosGabarito.pontos.reduce((acc, p) => {
          const valor = parseFloat(p.pontuacao) || 0;
          return acc + valor;
        }, 0);

        totalPontos += pontosQuestao;

        // Criar prompt para correção
        const promptCorrecao = this.criarPromptCorrecao(
          agente.prompt,
          questao,
          resposta,
          dadosGabarito.gabarito,
          dadosGabarito.pontos
        );

        console.log('Enviando para correção com agente:', agente.ia_provider);

        // Converter o provider para o tipo correto
        const providerType = agente.ia_provider.toLowerCase() as 'openai' | 'gemini' | 'grok' | 'deepseek' | 'claude';
        
        // Executar correção com IA
        const aiResponse = await aiProvidersService.executeWithProvider(
          providerType,
          promptCorrecao,
          'Correção de Questão - Segunda Fase OAB',
          this.getModelFromProvider(agente.ia_provider, agente.versao),
          agente.token_agente || undefined
        );

        if (!aiResponse.success) {
          console.error('Erro na correção:', aiResponse.error);
          continue;
        }

        // Parse da resposta da IA
        const resultadoCorrecao = this.parseRespostaCorrecao(aiResponse.data || '', pontosQuestao);
        resultados.push({
          questaoId: questao.id,
          ...resultadoCorrecao
        });

        pontosObtidos += resultadoCorrecao.nota;
      }

      // Calcular nota geral (0-10)
      const notaGeral = totalPontos > 0 ? (pontosObtidos / totalPontos) * 10 : 0;

      // Gerar feedback geral
      const feedbackGeral = this.gerarFeedbackGeral(resultados, notaGeral);

      return {
        resultados,
        notaGeral: Math.round(notaGeral * 100) / 100,
        feedbackGeral,
        totalPontos,
        pontosObtidos: Math.round(pontosObtidos * 100) / 100
      };

    } catch (error: any) {
      console.error('Erro ao corrigir respostas:', error);
      throw new Error(error.message || 'Erro ao corrigir respostas');
    }
  }

  private criarPromptCorrecao(
    promptAgente: string,
    questao: QuestaoSimulado,
    respostaUsuario: string,
    gabarito: string,
    pontos: Array<{ descricao: string; pontuacao: string; }>
  ): string {
    return `${promptAgente}

QUESTÃO PARA CORREÇÃO:
${questao.enunciado}

RESPOSTA DO ALUNO:
${respostaUsuario}

GABARITO OFICIAL:
${gabarito}

CRITÉRIOS DE PONTUAÇÃO:
${pontos.map(p => `- ${p.descricao}: ${p.pontuacao} pontos`).join('\n')}

TOTAL DE PONTOS DA QUESTÃO: ${pontos.reduce((acc, p) => acc + (parseFloat(p.pontuacao) || 0), 0)} pontos

INSTRUÇÕES PARA CORREÇÃO:
1. Compare a resposta do aluno com o gabarito oficial
2. Avalie cada critério de pontuação individualmente
3. Identifique quais pontos foram atendidos e quais faltaram
4. Forneça feedback construtivo e sugestões de melhoria
5. Atribua uma nota proporcional aos critérios atendidos

FORMATO DA RESPOSTA (JSON):
{
  "nota": [número de pontos obtidos],
  "feedbackDetalhado": "[análise detalhada da resposta]",
  "pontosAtendidos": ["critério 1", "critério 2"],
  "pontosFaltantes": ["critério 3", "critério 4"],
  "sugestoesMelhoria": ["sugestão 1", "sugestão 2"]
}

Responda APENAS com o JSON, sem texto adicional.`;
  }

  private getModelFromProvider(provider: string, versao: string | null): string {
    const defaultModels: Record<string, string> = {
      'gemini': 'gemini-1.5-flash',
      'openai': 'gpt-4o-mini',
      'claude': 'claude-3-sonnet-20240229',
      'grok': 'grok-beta',
      'deepseek': 'deepseek-chat'
    };

    if (versao && versao.trim()) {
      return versao.trim();
    }

    return defaultModels[provider] || 'gemini-1.5-flash';
  }

  private parseRespostaCorrecao(resposta: string, pontosMaximos: number): Omit<ResultadoCorrecao, 'questaoId'> {
    try {
      // Tentar extrair JSON da resposta
      const jsonMatch = resposta.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          nota: Math.min(parsed.nota || 0, pontosMaximos),
          feedbackDetalhado: parsed.feedbackDetalhado || 'Feedback não disponível',
          pontosAtendidos: parsed.pontosAtendidos || [],
          pontosFaltantes: parsed.pontosFaltantes || [],
          sugestoesMelhoria: parsed.sugestoesMelhoria || []
        };
      }
    } catch (error) {
      console.error('Erro ao parsear resposta da IA:', error);
    }

    // Fallback se não conseguir parsear
    return {
      nota: pontosMaximos * 0.5, // Dar 50% dos pontos como fallback
      feedbackDetalhado: 'Não foi possível analisar a resposta automaticamente. Revise manualmente.',
      pontosAtendidos: [],
      pontosFaltantes: [],
      sugestoesMelhoria: ['Consulte o gabarito oficial para melhor compreensão']
    };
  }

  private gerarFeedbackGeral(resultados: ResultadoCorrecao[], nota: number): string {
    if (nota >= 7) {
      return 'Excelente desempenho! Você demonstrou bom domínio dos conteúdos avaliados.';
    } else if (nota >= 5) {
      return 'Bom desempenho, mas há pontos que podem ser aprimorados. Revise os feedbacks específicos.';
    } else {
      return 'É necessário mais estudo. Foque nos pontos identificados como deficitários e pratique mais.';
    }
  }
}

export const correcaoIAService = CorrecaoIAService.getInstance();
