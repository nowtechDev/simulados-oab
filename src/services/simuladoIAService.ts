import { supabase } from '@/integrations/supabase/client';
import { aiProvidersService } from './aiProviders';

export interface SimuladoIAParams {
  areaId: string;
  pecaProcessual: string;
  assunto?: string;
  numeroQuestoes?: number;
}

export interface QuestaoSimulado {
  id: string;
  enunciado: string;
  numero_questao: string;
  area_id: string;
  tipo: string;
}

interface AgenteIA {
  id: string;
  nome: string;
  prompt: string;
  ia_provider: string;
  token_agente: string | null;
  versao: string | null;
  ativo: boolean;
}

export class SimuladoIAService {
  private static instance: SimuladoIAService;

  static getInstance(): SimuladoIAService {
    if (!SimuladoIAService.instance) {
      SimuladoIAService.instance = new SimuladoIAService();
    }
    return SimuladoIAService.instance;
  }

  async buscarAgenteCivil(): Promise<AgenteIA | null> {
    try {
      console.log('🔍 === BUSCANDO AGENTE IA CIVIL ===');
      
      // Buscar todos os agentes para debug
      const { data: todosAgentes, error: errorTodos } = await supabase
        .from('agentes_ia')
        .select('nome, ativo');
      
      console.log('📋 Todos os agentes no sistema:', todosAgentes);

      const { data, error } = await supabase
        .from('agentes_ia')
        .select('*')
        .eq('nome', 'IA Civil')
        .eq('ativo', true)
        .single();

      if (error) {
        console.error('❌ Erro ao buscar agente IA Civil:', error);
        console.log('🔍 Tentando buscar sem filtro de ativo...');
        
        // Tentar sem filtro de ativo
        const { data: dataBackup, error: errorBackup } = await supabase
          .from('agentes_ia')
          .select('*')
          .eq('nome', 'IA Civil')
          .single();
          
        if (errorBackup) {
          console.error('❌ Erro mesmo sem filtro de ativo:', errorBackup);
          return null;
        }
        
        console.log('⚠️ Agente encontrado mas não está ativo:', dataBackup);
        return dataBackup; // Retornar mesmo se não estiver ativo
      }

      console.log('✅ === AGENTE IA CIVIL ENCONTRADO ===');
      console.log('📊 Dados do agente:', {
        nome: data.nome,
        provider: data.ia_provider,
        versao: data.versao,
        ativo: data.ativo,
        hasToken: !!data.token_agente,
        tokenPreview: data.token_agente ? `${data.token_agente.substring(0, 15)}...` : 'TOKEN NÃO CONFIGURADO',
        promptLength: data.prompt?.length || 0,
        promptPreview: data.prompt ? `${data.prompt.substring(0, 200)}...` : 'PROMPT NÃO CONFIGURADO'
      });

      return data;
    } catch (error) {
      console.error('❌ Erro crítico ao buscar agente:', error);
      return null;
    }
  }

  async buscarQuestoesPorArea(areaId: string): Promise<QuestaoSimulado[]> {
    try {
      console.log('🔍 === BUSCANDO QUESTÕES POR ÁREA ===');
      console.log('📋 Área ID:', areaId);
      
      let todasQuestoes: QuestaoSimulado[] = [];
      let ultimoId: string | null = null;
      const tamanhoPagina = 1000; // Supabase limita a 1000 registros por consulta
      let maisPaginas = true;
      
      while (maisPaginas) {
        let query = supabase
          .from('segunda_fase_questoes')
          .select('id, enunciado, numero_questao, area_id, tipo')
          .eq('area_id', areaId)
          .eq('ativa', true)
          .order('id', { ascending: true })
          .limit(tamanhoPagina);
          
        // Se já temos um último ID, começamos a partir dele
        if (ultimoId) {
          query = query.gt('id', ultimoId);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('❌ Erro ao buscar questões:', error);
          break;
        }
        
        if (!data || data.length === 0) {
          maisPaginas = false;
        } else {
          todasQuestoes = [...todasQuestoes, ...data];
          ultimoId = data[data.length - 1].id;
          
          // Se retornou menos que o tamanho da página, não há mais páginas
          if (data.length < tamanhoPagina) {
            maisPaginas = false;
          }
        }
      }
      
      console.log('✅ Questões encontradas (paginação completa):', {
        total: todasQuestoes.length,
        primeirasQuestoes: todasQuestoes.slice(0, 5).map(q => ({
          id: q.id,
          tipo: q.tipo,
          numero_questao: q.numero_questao
        })),
        ultimasQuestoes: todasQuestoes.length > 5 ? todasQuestoes.slice(-5).map(q => ({
          id: q.id, 
          tipo: q.tipo,
          numero_questao: q.numero_questao
        })) : []
      });

      return todasQuestoes;
    } catch (error) {
      console.error('❌ Erro ao buscar questões:', error);
      return [];
    }
  }

  async buscarAreaPorId(areaId: string) {
    try {
      console.log('🔍 === BUSCANDO ÁREA POR ID ===');
      console.log('📋 Área ID:', areaId);

      const { data, error } = await supabase
        .from('segunda_fase_areas')
        .select('*')
        .eq('id', areaId)
        .single();

      if (error) {
        console.error('❌ Erro ao buscar área:', error);
        return null;
      }

      console.log('✅ Área encontrada:', {
        id: data.id,
        name: data.name,
        slug: data.slug,
        active: data.active
      });

      return data;
    } catch (error) {
      console.error('❌ Erro ao buscar área:', error);
      return null;
    }
  }

  async gerarSimuladoComIA(params: SimuladoIAParams): Promise<QuestaoSimulado[]> {
    try {
      console.log('🚀 === INICIANDO GERAÇÃO DE SIMULADO COM IA ===');
      console.log('📋 Parâmetros:', {
        areaId: params.areaId,
        pecaProcessual: params.pecaProcessual,
        assunto: params.assunto || 'Não especificado',
        numeroQuestoes: params.numeroQuestoes || 4
      });

      // Buscar o agente IA Civil no banco de dados
      const agente = await this.buscarAgenteCivil();
      
      if (!agente) {
        throw new Error('Agente IA Civil não encontrado no sistema');
      }

      console.log('🔑 === VALIDAÇÃO DO AGENTE ===');
      if (!agente.token_agente) {
        console.error('❌ Token de API não configurado para o agente');
        throw new Error('Token de API não configurado para o agente IA Civil');
      }
      console.log('✅ Token encontrado:', `${agente.token_agente.substring(0, 15)}...`);

      if (!agente.prompt) {
        console.error('❌ Prompt não configurado para o agente');
        throw new Error('Prompt não configurado para o agente IA Civil');
      }
      console.log('✅ Prompt encontrado, tamanho:', agente.prompt.length);

      // Buscar questões existentes na área
      const questoesExistentes = await this.buscarQuestoesPorArea(params.areaId);
      
      if (questoesExistentes.length === 0) {
        throw new Error('Nenhuma questão encontrada para esta área');
      }

      // Buscar informações da área
      const area = await this.buscarAreaPorId(params.areaId);
      
      if (!area) {
        throw new Error('Área não encontrada');
      }

      // Usar o prompt do agente com as informações do simulado
      const promptPersonalizado = this.criarPromptComAgente(
        agente.prompt,
        area.name,
        params.pecaProcessual,
        params.assunto || 'Não especificado',
        params.numeroQuestoes || 4,
        questoesExistentes
      );

      console.log('📝 === PROMPT CRIADO PARA O AGENTE ===');
      console.log('📏 Tamanho total do prompt:', promptPersonalizado.length);
      console.log('🔍 Prompt enviado para IA:');
      console.log('='.repeat(80));
      console.log(promptPersonalizado);
      console.log('='.repeat(80));

      console.log('🔄 === ENVIANDO PARA IA ===');
      console.log('Provider do agente:', agente.ia_provider);
      console.log('Modelo:', this.getModelFromProvider(agente.ia_provider, agente.versao));

      // Converter o provider para o tipo correto
      const providerType = agente.ia_provider.toLowerCase() as 'openai' | 'gemini' | 'grok' | 'deepseek' | 'claude';
      
      console.log('🌐 Executando com provider:', providerType);

      // Executar IA usando as configurações do agente
      const aiResponse = await aiProvidersService.executeWithProvider(
        providerType,
        promptPersonalizado,
        'Simulado IA - Seleção de Questões com Agente Civil',
        this.getModelFromProvider(agente.ia_provider, agente.versao),
        agente.token_agente || undefined
      );

      console.log('📥 === RESPOSTA COMPLETA DA IA ===');
      console.log('Success:', aiResponse.success);
      console.log('Error:', aiResponse.error);
      console.log('Tokens usados:', aiResponse.tokens_used);
      console.log('Custo USD:', aiResponse.cost_usd);
      console.log('Tamanho da resposta:', aiResponse.data?.length || 0);
      console.log('=== RESPOSTA BRUTA COMPLETA ===');
      console.log(aiResponse.data);
      console.log('=== FIM DA RESPOSTA BRUTA ===');

      if (!aiResponse.success) {
        console.error('❌ Falha na resposta da IA:', aiResponse.error);
        throw new Error(aiResponse.error || 'Erro ao executar agente IA');
      }

      // Parse da resposta da IA para extrair IDs das questões
      let questoesIds: string[] = [];
      
      try {
        console.log('🔄 === PROCESSANDO RESPOSTA DA IA ===');
        const response = aiResponse.data || '';
        
        // Tentar extrair IDs da resposta (pode estar em formato JSON ou texto)
        console.log('🔍 Tentando extrair JSON da resposta...');
        const jsonMatch = response.match(/\[.*?\]/);
        if (jsonMatch) {
          try {
            questoesIds = JSON.parse(jsonMatch[0]);
            console.log('✅ IDs extraídos do JSON:', questoesIds);
          } catch {
            console.log('⚠️ Falha no parse do JSON, tentando extração de texto...');
            questoesIds = this.extrairIdsDoTexto(response, questoesExistentes);
            console.log('✅ IDs extraídos do texto:', questoesIds);
          }
        } else {
          console.error('⚠️ Nenhum JSON encontrado na resposta da IA');
          throw new Error('A IA não retornou o formato esperado. Por favor, tente novamente.');
        }
        
        if (questoesIds.length === 0) {
          throw new Error('A IA não retornou IDs válidos de questões. Por favor, tente novamente.');
        }
        
        // Buscar questões pelos IDs
        const questoesSelecionadas = questoesExistentes.filter(q => questoesIds.includes(q.id));
        console.log('📋 Questões selecionadas:', questoesSelecionadas.length);
        
        if (questoesSelecionadas.length === 0) {
          throw new Error('Nenhuma das questões retornadas pela IA foi encontrada no banco de dados. Por favor, tente novamente.');
        }
        
        // Se não temos questões suficientes, completar aleatoriamente
        let questoesFinais = questoesSelecionadas;
        if (questoesSelecionadas.length < (params.numeroQuestoes || 4)) {
          console.log(`⚠️ IA retornou apenas ${questoesSelecionadas.length} questões, mas precisamos de ${params.numeroQuestoes || 4}`);
          console.log('🔄 Completando com questões aleatórias do banco...');
          
          // Excluir as questões já selecionadas
          const questoesRestantes = questoesExistentes.filter(q => !questoesSelecionadas.map(qs => qs.id).includes(q.id));
          
          // Selecionar aleatoriamente para completar
          const questoesAdicionais = this.selecionarQuestoesAleatoriamente(
            questoesRestantes, 
            (params.numeroQuestoes || 4) - questoesSelecionadas.length
          );
          
          // Obter as questões completas
          const questoesAdicionaisCompletas = questoesExistentes.filter(q => questoesAdicionais.includes(q.id));
          
          // Combinar questões
          questoesFinais = [...questoesSelecionadas, ...questoesAdicionaisCompletas];
          
          console.log('✅ Questões completas:', {
            selecionadasPelaIA: questoesSelecionadas.length,
            adicionadasAleatoriamente: questoesAdicionaisCompletas.length,
            total: questoesFinais.length
          });
        }
        
        // Limitar ao número solicitado (pode ter mais se a IA retornou mais)
        const questoesRetorno = questoesFinais.slice(0, params.numeroQuestoes || 4);
        
        console.log('✅ === SIMULADO GERADO COM SUCESSO ===');
        console.log('📊 Estatísticas finais:', {
          questoesSolicitadas: params.numeroQuestoes || 4,
          questoesRetornadas: questoesRetorno.length,
          questoesDisponiveis: questoesExistentes.length,
          agenteUtilizado: agente.nome,
          providerUtilizado: agente.ia_provider,
          tokensUsados: aiResponse.tokens_used,
          custoUSD: aiResponse.cost_usd
        });

        return questoesRetorno;
        
      } catch (parseError: any) {
        console.error('❌ Erro ao processar resposta da IA:', parseError);
        // Não mais usar seleção aleatória como fallback
        throw new Error(`Erro ao processar resposta da IA: ${parseError.message}`);
      }
      
    } catch (error: any) {
      console.error('❌ === ERRO CRÍTICO NA GERAÇÃO DO SIMULADO ===');
      console.error('Mensagem do erro:', error.message);
      console.error('Stack trace:', error.stack);
      console.error('Erro completo:', error);
      throw new Error(error.message || 'Erro ao gerar simulado');
    }
  }

  private criarPromptComAgente(
    promptAgente: string,
    area: string,
    pecaProcessual: string,
    assunto: string,
    numeroQuestoes: number,
    questoesDisponiveis: QuestaoSimulado[]
  ): string {
    // Substituir placeholders no promptAgente se existirem
    let promptFinal = promptAgente
      .replace('{AREA}', area)
      .replace('{PECA_PROCESSUAL}', pecaProcessual)
      .replace('{ASSUNTO}', assunto)
      .replace('{NUMERO_QUESTOES}', numeroQuestoes.toString());
    
    // Se temos muitas questões, precisamos limitar para não estourar o contexto do modelo
    const maxQuestoesNoPrompt = 100; // Limite para não sobrecarregar o modelo
    let questoesParaPrompt = questoesDisponiveis;
    
    if (questoesDisponiveis.length > maxQuestoesNoPrompt) {
      console.log(`⚠️ Limitando questões no prompt: ${questoesDisponiveis.length} -> ${maxQuestoesNoPrompt}`);
      
      // Estratégia: misturar todas as questões e pegar as primeiras maxQuestoesNoPrompt
      questoesParaPrompt = [...questoesDisponiveis]
        .sort(() => Math.random() - 0.5)
        .slice(0, maxQuestoesNoPrompt);
      
      // Adicionar aviso no prompt
      promptFinal += `\n\nATENÇÃO: Devido ao grande número de questões disponíveis (${questoesDisponiveis.length}), estamos mostrando apenas uma amostra aleatória de ${maxQuestoesNoPrompt} questões. Selecione as melhores desta amostra.\n\n`;
    }
    
    // Formatar questões disponíveis de maneira clara
    const questoesFormato = questoesParaPrompt.map(q => {
      // Limitar o enunciado para não sobrecarregar o prompt
      const enunciadoResumido = q.enunciado.length > 300 
        ? q.enunciado.substring(0, 300) + '...' 
        : q.enunciado;
      
      return `ID: ${q.id}
Tipo: ${q.tipo || 'N/A'}
Número: ${q.numero_questao || 'N/A'}
Enunciado: ${enunciadoResumido}
---`;
    }).join('\n\n');
    
    // Substituir placeholder de questões se existir
    if (promptFinal.includes('{QUESTOES_DISPONIVEIS}')) {
      promptFinal = promptFinal.replace('{QUESTOES_DISPONIVEIS}', questoesFormato);
    } else {
      // Caso contrário, acrescentar ao final
      promptFinal += `

## QUESTÕES DISPONÍVEIS PARA SELEÇÃO
${questoesFormato}

## IMPORTANTE
Retorne APENAS um array JSON com os IDs das questões selecionadas.
Exemplo: ["id1", "id2", "id3", "id4"]
Não inclua NENHUM texto ou explicação adicional.`;
    }
    
    return promptFinal;
  }

  private getModelFromProvider(provider: string, versao: string | null): string {
    const defaultModels: Record<string, string> = {
      'gemini': 'gemini-1.5-flash',
      'openai': 'gpt-4o-mini',
      'claude': 'claude-3-sonnet-20240229',
      'grok': 'grok-beta',
      'deepseek': 'deepseek-chat'
    };

    // Se há uma versão específica, usar ela
    if (versao && versao.trim()) {
      console.log('🎯 Usando modelo específico:', versao.trim());
      return versao.trim();
    }

    const modelo = defaultModels[provider] || 'gemini-1.5-flash';
    console.log('🎯 Usando modelo padrão:', modelo);
    return modelo;
  }

  private extrairIdsDoTexto(texto: string, questoesExistentes: QuestaoSimulado[]): string[] {
    const ids: string[] = [];
    
    console.log('🔍 Extraindo IDs do texto da resposta da IA...');
    
    // Tentar encontrar UUIDs no texto
    const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
    const matches = texto.match(uuidPattern);
    
    if (matches) {
      console.log('📋 UUIDs encontrados no texto:', matches);
      
      // Verificar se os IDs encontrados existem nas questões disponíveis
      const idsValidos = matches.filter(id => 
        questoesExistentes.some(q => q.id === id)
      );
      
      console.log('✅ IDs válidos encontrados:', idsValidos);
      ids.push(...idsValidos);
    } else {
      console.log('⚠️ Nenhum UUID encontrado no texto');
    }
    
    return ids;
  }

  private selecionarQuestoesAleatoriamente(questoes: QuestaoSimulado[], quantidade: number): string[] {
    console.log('🎲 Selecionando questões aleatoriamente...');
    const questoesEmbaralhadas = [...questoes].sort(() => Math.random() - 0.5);
    const idsSelecionados = questoesEmbaralhadas.slice(0, quantidade).map(q => q.id);
    console.log('✅ IDs selecionados aleatoriamente:', idsSelecionados);
    return idsSelecionados;
  }
}

export const simuladoIAService = SimuladoIAService.getInstance();
