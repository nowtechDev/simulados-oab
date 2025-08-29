
import { supabase } from '@/integrations/supabase/client';
import { Agente, AgenteExecutionParams, AgenteResponse } from '@/types/agente';

class AgenteManager {
  private static instance: AgenteManager;
  private agentesCache: Map<string, Agente> = new Map();

  static getInstance(): AgenteManager {
    if (!AgenteManager.instance) {
      AgenteManager.instance = new AgenteManager();
    }
    return AgenteManager.instance;
  }

  async getAgente(nome: string): Promise<Agente | null> {
    // Check cache first
    if (this.agentesCache.has(nome)) {
      return this.agentesCache.get(nome)!;
    }

    try {
      const { data, error } = await supabase
        .from('agentes_ia')
        .select('*')
        .eq('nome', nome)
        .eq('ativo', true)
        .single();

      if (error) {
        console.error('Erro ao buscar agente:', error);
        return null;
      }

      if (data) {
        this.agentesCache.set(nome, data as Agente);
        return data as Agente;
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar agente:', error);
      return null;
    }
  }

  async executeAgente(params: AgenteExecutionParams): Promise<AgenteResponse> {
    const agente = await this.getAgente(params.agenteName);
    
    if (!agente) {
      return {
        success: false,
        error: `Agente '${params.agenteName}' não encontrado ou inativo`
      };
    }

    try {
      // Route to appropriate AI provider
      switch (agente.ia_provider.toLowerCase()) {
        case 'openai':
          return await this.executeOpenAI(agente, params);
        case 'gemini':
          return await this.executeGemini(agente, params);
        case 'claude':
          return await this.executeClaude(agente, params);
        default:
          return {
            success: false,
            error: `Provider '${agente.ia_provider}' não suportado`
          };
      }
    } catch (error: any) {
      console.error('Erro ao executar agente:', error);
      return {
        success: false,
        error: error.message || 'Erro desconhecido ao executar agente'
      };
    }
  }

  private async executeOpenAI(agente: Agente, params: AgenteExecutionParams): Promise<AgenteResponse> {
    const apiKey = agente.token_agente || localStorage.getItem('openai-api-key');
    
    if (!apiKey) {
      return {
        success: false,
        error: 'API key da OpenAI não configurada para este agente'
      };
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: agente.prompt
          },
          {
            role: 'user',
            content: this.formatInputData(params.inputData, params.context)
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro na API da OpenAI: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.choices[0].message.content
    };
  }

  private async executeGemini(agente: Agente, params: AgenteExecutionParams): Promise<AgenteResponse> {
    // Implementar Gemini quando necessário
    return {
      success: false,
      error: 'Provider Gemini ainda não implementado'
    };
  }

  private async executeClaude(agente: Agente, params: AgenteExecutionParams): Promise<AgenteResponse> {
    // Implementar Claude quando necessário
    return {
      success: false,
      error: 'Provider Claude ainda não implementado'
    };
  }

  private formatInputData(inputData: Record<string, any>, context?: string): string {
    let formatted = '';
    
    if (context) {
      formatted += `Contexto: ${context}\n\n`;
    }
    
    for (const [key, value] of Object.entries(inputData)) {
      formatted += `${key}: ${value}\n`;
    }
    
    return formatted;
  }

  clearCache() {
    this.agentesCache.clear();
  }
}

export const agenteManager = AgenteManager.getInstance();
