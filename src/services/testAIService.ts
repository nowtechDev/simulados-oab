import { supabase } from '@/integrations/supabase/client';

// Serviços das IAs (coloque seus tokens aqui)
const AI_TOKENS = {
  OPENAI_API_KEY: "sk-seu-token-aqui",
  GEMINI_API_KEY: "seu-token-gemini-aqui",
  CLAUDE_API_KEY: "seu-token-claude-aqui"
};

interface LeiCivil {
  id: number;
  Artigo: string;  // Maiúsculo conforme a tabela
  Conteúdo: string;  // Maiúsculo e com acento conforme a tabela
  created_at?: string;
}

interface AIResponse {
  provider: 'openai' | 'gemini' | 'claude';
  response: string;
  success: boolean;
  error?: string;
  executionTime?: number;
}

// Serviço do Supabase (usando a configuração já existente)
class SupabaseService {
  static async searchLeisCivil(query: string): Promise<LeiCivil[]> {
    try {
      console.log(`🔍 Buscando leis para a query: "${query}"`);
      
      const { data, error } = await supabase
        .from('leis_civil' as any) // Forçar tipo pois a tabela não está no schema atual
        .select('*')
        .or(`Artigo.ilike.%${query}%,Conteúdo.ilike.%${query}%`)
        .limit(10);

      if (error) {
        console.error('❌ Erro do Supabase:', error);
        console.log('💡 Provavelmente a tabela leis_civil não existe ainda');
        throw error;
      }

      console.log(`✅ Encontradas ${data?.length || 0} leis na base de dados`);
      
      if (data && data.length > 0) {
        console.log('📋 Leis encontradas:', (data as unknown as LeiCivil[]).map(lei => `${lei.Artigo}`));
      } else {
        console.warn('⚠️ Nenhuma lei encontrada para a query');
      }

      return (data as unknown as LeiCivil[]) || [];
    } catch (error) {
      console.error('💥 Erro ao buscar leis:', error);
      console.log('🔄 Retornando array vazio - usando dados mock se necessário');
      return [];
    }
  }
}

// Serviço OpenAI
class OpenAIService {
  static async generateResponse(query: string, leis: LeiCivil[]): Promise<string> {
    const context = leis.map(lei => 
      `Artigo ${lei.Artigo}: ${lei.Conteúdo}`
    ).join('\n\n');

    const prompt = `
Você é um assistente jurídico especializado em direito civil brasileiro. 
Responda APENAS com base nas informações fornecidas abaixo do banco de dados.
Se não encontrar informação relevante, diga que não há informações suficientes.

PERGUNTA: ${query}

ARTIGOS E LEIS DISPONÍVEIS:
${context}

Resposta baseada exclusivamente nos artigos acima:`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_TOKENS.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Erro ao gerar resposta.';
  }
}

// Serviço Gemini
class GeminiService {
  static async generateResponse(query: string, leis: LeiCivil[]): Promise<string> {
    const context = leis.map(lei => 
      `Artigo ${lei.Artigo}: ${lei.Conteúdo}`
    ).join('\n\n');

    const prompt = `
Você é um assistente jurídico especializado em direito civil brasileiro. 
Responda APENAS com base nas informações fornecidas abaixo do banco de dados.
Se não encontrar informação relevante, diga que não há informações suficientes.

PERGUNTA: ${query}

ARTIGOS E LEIS DISPONÍVEIS:
${context}

Resposta baseada exclusivamente nos artigos acima:`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${AI_TOKENS.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500,
        }
      }),
    });

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || 'Erro ao gerar resposta.';
  }
}

// Serviço Claude
class ClaudeService {
  static async generateResponse(query: string, leis: LeiCivil[]): Promise<string> {
    const context = leis.map(lei => 
      `Artigo ${lei.Artigo}: ${lei.Conteúdo}`
    ).join('\n\n');

    const prompt = `
Você é um assistente jurídico especializado em direito civil brasileiro. 
Responda APENAS com base nas informações fornecidas abaixo do banco de dados.
Se não encontrar informação relevante, diga que não há informações suficientes.

PERGUNTA: ${query}

ARTIGOS E LEIS DISPONÍVEIS:
${context}

Responda baseado exclusivamente nos artigos acima:`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_TOKENS.CLAUDE_API_KEY}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 500,
        temperature: 0.3,
        messages: [
          { role: "user", content: prompt }
        ],
      }),
    });

    const data = await response.json();
    return data.content[0]?.text || 'Erro ao gerar resposta.';
  }
}

// Serviço principal
class AITestService {
  static async processQuery(query: string): Promise<{
    openai: AIResponse;
    gemini: AIResponse;
    claude: AIResponse;
  }> {
    console.log(`🚀 Iniciando processamento da query: "${query}"`);
    
    // Buscar dados do Supabase
    const leis = await SupabaseService.searchLeisCivil(query);
    
    console.log(`📊 Total de leis encontradas: ${leis.length}`);
    
    if (leis.length === 0) {
      console.warn('⚠️ Nenhuma lei encontrada - enviando resposta padrão para todas as IAs');
      const noDataResponse: AIResponse = {
        provider: 'openai',
        response: 'Não foram encontradas informações relevantes na base de dados.',
        success: true
      };
      return {
        openai: { ...noDataResponse, provider: 'openai' },
        gemini: { ...noDataResponse, provider: 'gemini' },
        claude: { ...noDataResponse, provider: 'claude' }
      };
    }

    console.log(`🤖 Enviando query para as 3 IAs com ${leis.length} leis como contexto`);
    
    // Processar com todas as IAs
    const results = await Promise.allSettled([
      this.callOpenAI(query, leis),
      this.callGemini(query, leis),
      this.callClaude(query, leis)
    ]);

    console.log(`✅ Processamento concluído. Resultados:`);
    console.log(`   OpenAI: ${results[0].status}`);
    console.log(`   Gemini: ${results[1].status}`);
    console.log(`   Claude: ${results[2].status}`);

    return {
      openai: results[0].status === 'fulfilled' ? results[0].value : this.createErrorResponse('openai', results[0].reason),
      gemini: results[1].status === 'fulfilled' ? results[1].value : this.createErrorResponse('gemini', results[1].reason),
      claude: results[2].status === 'fulfilled' ? results[2].value : this.createErrorResponse('claude', results[2].reason)
    };
  }

  private static async callOpenAI(query: string, leis: LeiCivil[]): Promise<AIResponse> {
    const startTime = Date.now();
    try {
      console.log(`🟦 Consultando OpenAI...`);
      const response = await OpenAIService.generateResponse(query, leis);
      const executionTime = Date.now() - startTime;
      console.log(`✅ OpenAI respondeu em ${executionTime}ms`);
      return {
        provider: 'openai',
        response,
        success: true,
        executionTime
      };
    } catch (error) {
      console.error(`❌ Erro no OpenAI:`, error);
      return this.createErrorResponse('openai', error);
    }
  }

  private static async callGemini(query: string, leis: LeiCivil[]): Promise<AIResponse> {
    const startTime = Date.now();
    try {
      console.log(`🟢 Consultando Gemini...`);
      const response = await GeminiService.generateResponse(query, leis);
      const executionTime = Date.now() - startTime;
      console.log(`✅ Gemini respondeu em ${executionTime}ms`);
      return {
        provider: 'gemini',
        response,
        success: true,
        executionTime
      };
    } catch (error) {
      console.error(`❌ Erro no Gemini:`, error);
      return this.createErrorResponse('gemini', error);
    }
  }

  private static async callClaude(query: string, leis: LeiCivil[]): Promise<AIResponse> {
    const startTime = Date.now();
    try {
      console.log(`🟣 Consultando Claude...`);
      const response = await ClaudeService.generateResponse(query, leis);
      const executionTime = Date.now() - startTime;
      console.log(`✅ Claude respondeu em ${executionTime}ms`);
      return {
        provider: 'claude',
        response,
        success: true,
        executionTime
      };
    } catch (error) {
      console.error(`❌ Erro no Claude:`, error);
      return this.createErrorResponse('claude', error);
    }
  }

  private static createErrorResponse(provider: 'openai' | 'gemini' | 'claude', error: any): AIResponse {
    return {
      provider,
      response: '',
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

// Handler da API
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        error: 'Query é obrigatória e deve ser uma string'
      });
    }

    console.log(`📝 Processando pergunta: "${query}"`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    
    const results = await AITestService.processQuery(query);
    
    console.log(`📤 Enviando resposta final com ${Object.keys(results).length} resultados de IAs`);
    
    res.json({
      success: true,
      query,
      timestamp: new Date().toISOString(),
      results
    });

  } catch (error) {
    console.error('💥 Erro no handler:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'N/A');
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
