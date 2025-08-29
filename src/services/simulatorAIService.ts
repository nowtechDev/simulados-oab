
import { supabase } from '@/integrations/supabase/client';
import { aiProvidersService } from '@/services/aiProviders';
import { Question } from '@/types/simulator';

export class SimulatorAIService {
  static async buscarAgenteIACivilCorretor() {
    try {
      console.log('🔍 === BUSCANDO AGENTE IA CIVIL CORRETOR ===');
      
      // Buscar todos os agentes para debug
      const { data: todosAgentes, error: errorTodos } = await supabase
        .from('agentes_ia')
        .select('nome, ativo');
      
      console.log('📋 Todos os agentes no sistema:', todosAgentes);
      
      // Buscar o agente específico
      const { data, error } = await supabase
        .from('agentes_ia')
        .select('*')
        .eq('nome', 'IA Civil Corretor')
        .eq('ativo', true)
        .single();

      if (error) {
        console.error('❌ Erro ao buscar agente IA Civil Corretor:', error);
        console.log('🔍 Tentando buscar sem filtro de ativo...');
        
        // Tentar sem filtro de ativo
        const { data: dataBackup, error: errorBackup } = await supabase
          .from('agentes_ia')
          .select('*')
          .eq('nome', 'IA Civil Corretor')
          .single();
          
        if (errorBackup) {
          console.error('❌ Erro mesmo sem filtro de ativo:', errorBackup);
          return null;
        }
        
        console.log('⚠️ Agente encontrado mas não está ativo:', dataBackup);
        return dataBackup; // Retornar mesmo se não estiver ativo
      }

      console.log('✅ === AGENTE IA CIVIL CORRETOR ENCONTRADO ===');
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

  static criarPromptCorrecao(
    promptAgente: string,
    questao: Question,
    perguntaAluno: string
  ): string {
    const promptCompleto = `${promptAgente}

=== CONTEXTO DA QUESTÃO ===
Prova: ${questao.prova}
Número da Questão: ${questao.Numero}
Área: ${questao.Área}
Tema: ${questao.Tema}

=== ENUNCIADO ===
${questao.Enunciado}

=== ALTERNATIVAS ===
A) ${questao["Alternativa A"]}
B) ${questao["Alternativa B"]}
C) ${questao["Alternativa C"]}
D) ${questao["Alternativa D"]}

=== RESPOSTA CORRETA ===
${questao["Resposta Correta"]}

=== PERGUNTA DO ALUNO ===
${perguntaAluno}

=== INSTRUÇÕES PARA RESPOSTA ===
1. Analise a pergunta do aluno em relação à questão apresentada
2. Use seu conhecimento jurídico para explicar o conceito envolvido
3. Explique por que a alternativa correta está certa
4. Se necessário, explique por que as outras alternativas estão incorretas
5. Seja didático e educativo na resposta
6. Use referências legais quando apropriado
7. Responda de forma clara e objetiva

Responda seguindo EXATAMENTE a estrutura e tom definidos no seu prompt principal.`;

    console.log('📝 === PROMPT CRIADO PARA O AGENTE ===');
    console.log('📏 Tamanho total do prompt:', promptCompleto.length);
    console.log('🔍 Prompt completo enviado:');
    console.log('='.repeat(80));
    console.log(promptCompleto);
    console.log('='.repeat(80));
    
    return promptCompleto;
  }

  static getModelFromProvider(provider: string, versao: string | null): string {
    const defaultModels: Record<string, string> = {
      'gemini': 'gemini-1.5-flash',
      'openai': 'gpt-4o-mini',
      'claude': 'claude-3-sonnet-20240229',
      'grok': 'grok-beta',
      'deepseek': 'deepseek-chat'
    };

    if (versao && versao.trim()) {
      console.log('🎯 Usando modelo específico:', versao.trim());
      return versao.trim();
    }

    const modelo = defaultModels[provider.toLowerCase()] || 'gemini-1.5-flash';
    console.log('🎯 Usando modelo padrão:', modelo);
    return modelo;
  }

  static async executeQuery(questao: Question, pergunta: string) {
    console.log('🚀 === INÍCIO DA CONSULTA AI ===');
    console.log('📝 Pergunta do usuário:', pergunta);
    
    const agente = await this.buscarAgenteIACivilCorretor();
    
    if (!agente) {
      throw new Error('Agente "IA Civil Corretor" não encontrado no sistema');
    }

    console.log('🔑 === VALIDAÇÃO DO TOKEN ===');
    if (!agente.token_agente) {
      console.error('❌ Token de API não configurado para o agente');
      throw new Error('Token de API não configurado para o agente');
    }
    console.log('✅ Token encontrado:', `${agente.token_agente.substring(0, 15)}...`);

    console.log('📋 === VALIDAÇÃO DO PROMPT ===');
    if (!agente.prompt) {
      console.error('❌ Prompt não configurado para o agente');
      throw new Error('Prompt não configurado para o agente');
    }
    console.log('✅ Prompt encontrado, tamanho:', agente.prompt.length);

    console.log('📋 === DADOS DA QUESTÃO ATUAL ===');
    console.log('Questão número:', questao.Numero);
    console.log('Área:', questao.Área);
    console.log('Tema:', questao.Tema);
    console.log('Resposta correta:', questao["Resposta Correta"]);
    console.log('Enunciado (primeiros 100 chars):', questao.Enunciado?.substring(0, 100) + '...');

    // Criar prompt completo para o agente
    const promptCorrecao = this.criarPromptCorrecao(
      agente.prompt,
      questao,
      pergunta
    );

    const modeloFinal = this.getModelFromProvider(agente.ia_provider, agente.versao);
    
    console.log('🔄 === ENVIANDO PARA IA ===');
    console.log('Provider:', agente.ia_provider);
    console.log('Modelo:', modeloFinal);
    console.log('Tamanho do prompt:', promptCorrecao.length);

    // Normalizar o provider para minúsculo
    const providerType = agente.ia_provider.toLowerCase() as 'openai' | 'gemini' | 'grok' | 'deepseek' | 'claude';
    
    console.log('🌐 Executando com provider:', providerType);

    // Executar correção com IA
    const aiResponse = await aiProvidersService.executeWithProvider(
      providerType,
      promptCorrecao,
      'Simulado Primeira Fase - IA Civil Corretor',
      modeloFinal,
      agente.token_agente
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
      throw new Error(aiResponse.error || 'Erro na resposta da IA');
    }

    if (!aiResponse.data) {
      console.error('❌ Resposta vazia da IA');
      throw new Error('Resposta vazia da IA');
    }

    console.log('✅ === CONSULTA AI FINALIZADA COM SUCESSO ===');
    console.log('📊 Estatísticas finais:', {
      tokens: aiResponse.tokens_used,
      custo: aiResponse.cost_usd,
      tamanhoResposta: aiResponse.data.length,
      sucesso: true
    });

    return aiResponse.data;
  }
}
