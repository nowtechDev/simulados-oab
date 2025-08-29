import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageCircle, Brain, Zap, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Configuração dos tokens das IAs (substituir pelos tokens reais)
const AI_TOKENS = {
  OPENAI_API_KEY: "sk-seu-token-aqui",
  GEMINI_API_KEY: "seu-token-gemini-aqui", 
  CLAUDE_API_KEY: "seu-token-claude-aqui"
};

// Configuração de debugging
const DEBUG_MODE = true;

// Helper para logs condicionais
const debugLog = (message: string, ...args: any[]) => {
  if (DEBUG_MODE) {
    console.log(message, ...args);
  }
};

// Interfaces
interface LeiCivil {
  id: number;
  Artigo: string;  // Maiúsculo conforme a tabela
  Conteúdo: string;  // Maiúsculo e com acento conforme a tabela
  created_at?: string;
  embedding?: number[]; // Para armazenar o vetor de embedding
  similarity?: number; // Para armazenar a similaridade calculada
}

interface AIResponse {
  provider: 'openai' | 'gemini' | 'claude';
  response: string;
  success: boolean;
  error?: string;
  executionTime?: number;
  ragContext?: string; // Contexto RAG usado
}

interface TestResult {
  query: string;
  timestamp: string;
  ragContext: string; // Artigos selecionados pelo RAG
  openai: AIResponse;
  gemini: AIResponse;
  claude: AIResponse;
}

// Serviço de Embeddings para RAG (Retrieval-Augmented Generation)
class EmbeddingService {
  private static cache = new Map<string, number[]>();

  static async generateEmbedding(text: string): Promise<number[]> {
    // Verificar cache primeiro
    if (this.cache.has(text)) {
      debugLog('📋 Usando embedding do cache');
      return this.cache.get(text)!;
    }

    try {
      debugLog('🧠 Gerando embedding para:', text.substring(0, 50) + '...');
      
      if (!AI_TOKENS.OPENAI_API_KEY || AI_TOKENS.OPENAI_API_KEY.includes('seu-token')) {
        debugLog('⚠️ Token OpenAI não configurado, usando embedding simulado');
        return this.generateMockEmbedding(text);
      }

      // Timeout para evitar travamentos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos

      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AI_TOKENS.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "text-embedding-ada-002",
          input: text.substring(0, 8000), // Limitar tamanho do texto
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        console.error('❌ Erro da API OpenAI:', data.error);
        return this.generateMockEmbedding(text);
      }

      if (!data.data || !data.data[0] || !data.data[0].embedding) {
        throw new Error('Resposta inválida da API OpenAI');
      }

      const embedding = data.data[0].embedding;
      this.cache.set(text, embedding);
      debugLog('✅ Embedding gerado com sucesso');
      return embedding;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('⏰ Timeout na geração de embedding, usando simulado');
      } else {
        console.error('❌ Erro ao gerar embedding:', error);
      }
      return this.generateMockEmbedding(text);
    }
  }

  private static generateMockEmbedding(text: string): number[] {
    // Gerar embedding simulado baseado no hash do texto
    const hash = this.simpleHash(text);
    const embedding = [];
    for (let i = 0; i < 1536; i++) { // Tamanho do embedding do Ada-002
      embedding.push(Math.sin(hash + i) * 0.1);
    }
    console.log('🎲 Usando embedding simulado');
    return embedding;
  }

  private static simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  static calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Vetores devem ter o mesmo tamanho');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

// Serviço RAG para busca vetorial inteligente
class RAGService {
  private static leisCache: LeiCivil[] = [];
  private static lastCacheUpdate = 0;
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  static async searchRelevantLeis(query: string, topK: number = 5): Promise<LeiCivil[]> {
    try {
      debugLog(`🔍 RAG: Buscando leis relevantes para: "${query}"`);
      
      // 1. Carregar todas as leis (com cache)
      const allLeis = await this.loadAllLeis();
      
      if (allLeis.length === 0) {
        console.warn('⚠️ Nenhuma lei encontrada na base de dados');
        return [];
      }

      debugLog(`📚 Total de leis na base: ${allLeis.length}`);

      // 2. Gerar embedding da query
      const queryEmbedding = await EmbeddingService.generateEmbedding(query);

      // 3. Calcular similaridades e ordenar
      debugLog('🔄 Calculando similaridades...');
      const leisWithSimilarity = await Promise.all(
        allLeis.map(async (lei, index) => {
          try {
            if (!lei.embedding) {
              // Gerar embedding para o conteúdo da lei se não existir
              const textToEmbed = `${lei.Artigo}: ${lei.Conteúdo}`;
              lei.embedding = await EmbeddingService.generateEmbedding(textToEmbed);
            }

            const similarity = EmbeddingService.calculateCosineSimilarity(
              queryEmbedding,
              lei.embedding
            );

            if (DEBUG_MODE && index < 3) {
              debugLog(`   Lei ${index + 1}: ${lei.Artigo} - Similaridade: ${similarity.toFixed(3)}`);
            }

            return {
              ...lei,
              similarity
            };
          } catch (error) {
            console.error(`❌ Erro ao calcular similaridade para lei ${lei.Artigo}:`, error);
            return {
              ...lei,
              similarity: 0
            };
          }
        })
      );

      // 4. Ordenar por similaridade (maior para menor) e pegar top K
      const topLeis = leisWithSimilarity
        .filter(lei => (lei.similarity || 0) > 0.1) // Filtrar similaridades muito baixas
        .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
        .slice(0, topK);

      debugLog('🎯 Top leis encontradas:');
      topLeis.forEach((lei, index) => {
        debugLog(`   ${index + 1}. ${lei.Artigo} (similaridade: ${(lei.similarity || 0).toFixed(3)})`);
      });

      return topLeis;
    } catch (error) {
      console.error('❌ Erro no RAG Service:', error);
      // Fallback para busca tradicional
      console.log('🔄 Usando fallback de busca textual...');
      return await this.fallbackTextSearch(query);
    }
  }

  private static async loadAllLeis(): Promise<LeiCivil[]> {
    const now = Date.now();
    
    // Verificar se o cache ainda é válido
    if (this.leisCache.length > 0 && (now - this.lastCacheUpdate) < this.CACHE_DURATION) {
      console.log('📋 Usando cache de leis');
      return this.leisCache;
    }

    try {
      console.log('🌐 Carregando todas as leis do Supabase...');
      const { data, error } = await supabase
        .from('leis_civil' as any)
        .select('*')
        .limit(1000); // Limite para evitar sobrecarga

      if (error) {
        console.error('❌ Erro ao carregar leis:', error);
        throw error;
      }

      this.leisCache = (data as unknown as LeiCivil[]) || [];
      this.lastCacheUpdate = now;
      
      console.log(`✅ Carregadas ${this.leisCache.length} leis`);
      return this.leisCache;
    } catch (error) {
      console.error('❌ Erro ao carregar leis:', error);
      return [];
    }
  }

  static async fallbackTextSearch(query: string): Promise<LeiCivil[]> {
    console.log('🔄 Usando busca textual como fallback');
    try {
      const { data, error } = await supabase
        .from('leis_civil' as any)
        .select('*')
        .or(`Artigo.ilike.%${query}%,Conteúdo.ilike.%${query}%`)
        .limit(5);

      if (error) throw error;
      return (data as unknown as LeiCivil[]) || [];
    } catch (error) {
      console.error('❌ Erro na busca textual:', error);
      return [];
    }
  }
}

// Serviço do Supabase atualizado para usar RAG
class SupabaseService {
  static async searchLeisCivil(query: string): Promise<LeiCivil[]> {
    try {
      console.log(`🔍 Iniciando busca RAG para: "${query}"`);
      
      // Usar RAG Service para busca vetorial inteligente
      const relevantLeis = await RAGService.searchRelevantLeis(query, 5);
      
      if (relevantLeis.length > 0) {
        console.log(`✅ RAG encontrou ${relevantLeis.length} leis relevantes`);
        console.log('📋 Leis selecionadas:', relevantLeis.map(lei => 
          `${lei.Artigo} (sim: ${(lei.similarity || 0).toFixed(3)})`
        ));
        return relevantLeis;
      } else {
        console.log('⚠️ RAG não encontrou leis relevantes');
        return [];
      }
    } catch (error) {
      console.error('❌ Erro no SupabaseService:', error);
      throw error;
    }
  }
}

// Função para criar contexto RAG otimizado
function createRAGContext(leis: LeiCivil[]): string {
  return leis.map((lei, index) => 
    `[${index + 1}] ${lei.Artigo}: ${lei.Conteúdo}${lei.similarity ? ` (Relevância: ${(lei.similarity * 100).toFixed(1)}%)` : ''}`
  ).join('\n\n');
}

// Função para criar prompt RAG otimizado
function createRAGPrompt(query: string, context: string): string {
  return `
Você é um assistente jurídico especializado em direito civil brasileiro. 
Use EXCLUSIVAMENTE as informações dos artigos fornecidos abaixo para responder à pergunta.
Os artigos foram selecionados por relevância semântica usando busca vetorial (RAG).

PERGUNTA: ${query}

ARTIGOS RELEVANTES (ordenados por relevância):
${context}

INSTRUÇÕES:
- Responda baseando-se APENAS nos artigos fornecidos
- Se não encontrar informação suficiente, diga claramente
- Cite os números dos artigos que você está usando
- Seja preciso e objetivo

RESPOSTA:`;
}

// Serviços das IAs
class OpenAIService {
  static async generateResponse(query: string, leis: LeiCivil[]): Promise<string> {
    if (!AI_TOKENS.OPENAI_API_KEY || AI_TOKENS.OPENAI_API_KEY.includes('seu-token')) {
      throw new Error('Token do OpenAI não configurado');
    }

    const context = createRAGContext(leis);
    const prompt = createRAGPrompt(query, context);

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

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Erro ao gerar resposta.';
  }
}

class GeminiService {
  static async generateResponse(query: string, leis: LeiCivil[]): Promise<string> {
    if (!AI_TOKENS.GEMINI_API_KEY || AI_TOKENS.GEMINI_API_KEY.includes('seu-token')) {
      throw new Error('Token do Gemini não configurado');
    }

    const context = createRAGContext(leis);
    const prompt = createRAGPrompt(query, context);

    try {
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
            maxOutputTokens: 500,
            temperature: 0.3
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || 'Erro ao gerar resposta.';
    } catch (error) {
      console.error('❌ Erro do Gemini (CORS?):', error);
      throw new Error('Erro de CORS com Gemini - considere usar um proxy');
    }
  }
}

class ClaudeService {
  static async generateResponse(query: string, leis: LeiCivil[]): Promise<string> {
    if (!AI_TOKENS.CLAUDE_API_KEY || AI_TOKENS.CLAUDE_API_KEY.includes('seu-token')) {
      throw new Error('Token do Claude não configurado');
    }

    const context = createRAGContext(leis);
    const prompt = createRAGPrompt(query, context);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AI_TOKENS.CLAUDE_API_KEY}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: "claude-3-sonnet-20240229",
          max_tokens: 500,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0]?.text || 'Erro ao gerar resposta.';
    } catch (error) {
      console.error('❌ Erro do Claude (CORS?):', error);
      throw new Error('Erro de CORS com Claude - considere usar um proxy');
    }
  }
}

// Componente principal
const TestesIA: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [currentRAGContext, setCurrentRAGContext] = useState<string>('');
  const [systemStatus, setSystemStatus] = useState<{
    supabase: boolean;
    embedding: boolean;
    checkedAt?: string;
  }>({ supabase: false, embedding: false });

  // Verificar saúde do sistema na inicialização
  React.useEffect(() => {
    const checkSystemHealth = async () => {
      try {
        debugLog('🔍 Verificando saúde do sistema...');
        
        // Testar conexão Supabase
        const supabaseTest = await supabase
          .from('leis_civil' as any)
          .select('id')
          .limit(1);
        
        const supabaseOk = !supabaseTest.error;
        
        // Testar embedding (simulado)
        const embeddingTest = await EmbeddingService.generateEmbedding('teste');
        const embeddingOk = embeddingTest.length > 0;
        
        setSystemStatus({
          supabase: supabaseOk,
          embedding: embeddingOk,
          checkedAt: new Date().toLocaleTimeString()
        });
        
        debugLog('✅ Verificação de saúde concluída:', { supabaseOk, embeddingOk });
      } catch (error) {
        console.error('❌ Erro na verificação de saúde:', error);
        setSystemStatus({
          supabase: false,
          embedding: false,
          checkedAt: new Date().toLocaleTimeString()
        });
      }
    };

    checkSystemHealth();
  }, []);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setCurrentRAGContext('');
    const startTime = Date.now();

    try {
      debugLog('🚀 Iniciando teste das IAs...');
      
      // 1. Buscar leis relevantes usando RAG
      debugLog('🔍 Fase 1: Busca RAG...');
      const leis = await SupabaseService.searchLeisCivil(query);
      
      if (leis.length === 0) {
        // Tentar busca textual como último recurso
        debugLog('🔄 Tentando busca textual como último recurso...');
        const fallbackLeis = await RAGService.fallbackTextSearch(query);
        
        if (fallbackLeis.length === 0) {
          throw new Error('Nenhuma lei relevante encontrada nem por RAG nem por busca textual. Verifique a conexão com o Supabase.');
        }
        
        // Usar resultado do fallback
        const ragContext = createRAGContext(fallbackLeis);
        setCurrentRAGContext(ragContext + '\n\n⚠️ Resultado obtido por busca textual (fallback)');
        
        // Processar com fallback
        await processAIResponses(query, fallbackLeis, ragContext + '\n\n⚠️ Resultado obtido por busca textual (fallback)');
        return;
      }

      // 2. Criar contexto RAG para mostrar ao usuário
      const ragContext = createRAGContext(leis);
      setCurrentRAGContext(ragContext);

      debugLog('🤖 Fase 2: Consultando IAs...');
      
      // 3. Processar IAs
      await processAIResponses(query, leis, ragContext);
      
    } catch (error) {
      console.error('❌ Erro geral:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      // Mostrar erro mais informativo
      if (errorMessage.includes('Supabase')) {
        alert(`❌ Erro de conexão com banco de dados:\n${errorMessage}\n\nVerifique sua conexão de internet e configuração do Supabase.`);
      } else if (errorMessage.includes('API')) {
        alert(`❌ Erro de API:\n${errorMessage}\n\nVerifique os tokens das IAs ou limite de requisições.`);
      } else {
        alert(`❌ Erro:\n${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const processAIResponses = async (query: string, leis: LeiCivil[], ragContext: string) => {
    // 3. Consultar as três IAs em paralelo
    const aiPromises = [
      (async () => {
        const aiStartTime = Date.now();
        try {
          const response = await OpenAIService.generateResponse(query, leis);
          return {
            provider: 'openai' as const,
            response,
            success: true,
            executionTime: Date.now() - aiStartTime,
            ragContext
          };
        } catch (error) {
          return {
            provider: 'openai' as const,
            response: '',
            success: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido',
            executionTime: Date.now() - aiStartTime,
            ragContext
          };
        }
      })(),
      
      (async () => {
        const aiStartTime = Date.now();
        try {
          const response = await GeminiService.generateResponse(query, leis);
          return {
            provider: 'gemini' as const,
            response,
            success: true,
            executionTime: Date.now() - aiStartTime,
            ragContext
          };
        } catch (error) {
          return {
            provider: 'gemini' as const,
            response: '',
            success: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido',
            executionTime: Date.now() - aiStartTime,
            ragContext
          };
        }
      })(),
      
      (async () => {
        const aiStartTime = Date.now();
        try {
          const response = await ClaudeService.generateResponse(query, leis);
          return {
            provider: 'claude' as const,
            response,
            success: true,
            executionTime: Date.now() - aiStartTime,
            ragContext
          };
        } catch (error) {
          return {
            provider: 'claude' as const,
            response: '',
            success: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido',
            executionTime: Date.now() - aiStartTime,
            ragContext
          };
        }
      })()
    ];

    const [openaiResult, geminiResult, claudeResult] = await Promise.all(aiPromises);

    // 4. Salvar resultado
    const result: TestResult = {
      query,
      timestamp: new Date().toLocaleString(),
      ragContext,
      openai: openaiResult,
      gemini: geminiResult,
      claude: claudeResult
    };

    setResults(prev => [result, ...prev]);
    
    const totalTime = Date.now() - Date.now();
    debugLog(`✅ Teste concluído`);
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'openai': return '🤖';
      case 'gemini': return '💎';
      case 'claude': return '🧠';
      default: return '❓';
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'openai': return 'OpenAI GPT';
      case 'gemini': return 'Google Gemini';
      case 'claude': return 'Anthropic Claude';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Brain className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">
            Testes de IA Jurídica com RAG
          </h1>
        </div>
        
        <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
          <span>
            Sistema RAG: Busca semântica + 3 IAs (OpenAI, Gemini, Claude) usando dados reais do Supabase
          </span>
        </div>

        {/* System Status */}
        <div className="flex items-center justify-center gap-4 text-xs mb-4">
          <div className={`flex items-center gap-1 px-2 py-1 rounded ${systemStatus.supabase ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <span className={`w-2 h-2 rounded-full ${systemStatus.supabase ? 'bg-green-500' : 'bg-red-500'}`}></span>
            Supabase: {systemStatus.supabase ? 'Conectado' : 'Erro'}
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded ${systemStatus.embedding ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            <span className={`w-2 h-2 rounded-full ${systemStatus.embedding ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            Embeddings: {systemStatus.embedding ? 'OK' : 'Simulado'}
          </div>
          {systemStatus.checkedAt && (
            <span className="text-gray-500">
              Última verificação: {systemStatus.checkedAt}
            </span>
          )}
        </div>
      </div>

      {/* Input Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Fazer Pergunta Jurídica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Digite sua pergunta sobre direito civil..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[100px]"
            disabled={isLoading}
          />
          
          <div className="flex gap-4">
            <Button 
              onClick={handleSubmit} 
              disabled={!query.trim() || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando RAG + 3 IAs...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Testar com RAG + 3 IAs
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setResults([])}
              disabled={isLoading || results.length === 0}
            >
              Limpar Histórico
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* RAG Context Display */}
      {currentRAGContext && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">
              🎯 Contexto RAG - Artigos Selecionados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">
                {currentRAGContext}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results.map((result, index) => (
        <Card key={index} className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pergunta: {result.query}</span>
              <Badge variant="outline">{result.timestamp}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* RAG Context for this result */}
            <div className="mb-6">
              <h4 className="font-semibold mb-2 text-gray-700">
                🎯 Artigos RAG Utilizados:
              </h4>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <pre className="whitespace-pre-wrap text-gray-600">
                  {result.ragContext}
                </pre>
              </div>
            </div>

            {/* AI Responses */}
            <div className="grid md:grid-cols-3 gap-4">
              {[result.openai, result.gemini, result.claude].map((aiResult, aiIndex) => (
                <Card key={aiIndex} className={`${!aiResult.success ? 'border-red-200' : 'border-green-200'}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span className="flex items-center">
                        <span className="mr-2 text-xl">
                          {getProviderIcon(aiResult.provider)}
                        </span>
                        {getProviderName(aiResult.provider)}
                      </span>
                      <Badge variant={aiResult.success ? "default" : "destructive"}>
                        {aiResult.success ? "✅" : "❌"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {aiResult.success ? (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {aiResult.response}
                        </p>
                        {aiResult.executionTime && (
                          <p className="text-xs text-gray-500">
                            ⏱️ {aiResult.executionTime}ms
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-red-600 text-sm">
                        <p className="font-semibold mb-1">Erro:</p>
                        <p>{aiResult.error}</p>
                        {aiResult.executionTime && (
                          <p className="text-xs mt-1">
                            ⏱️ {aiResult.executionTime}ms
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Instructions */}
      {results.length === 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">
              🚀 Como usar o sistema RAG
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <ol className="space-y-2">
              <li>1. <strong>Configure os tokens</strong> das IAs no código (OPENAI_API_KEY, etc.)</li>
              <li>2. <strong>Digite uma pergunta</strong> jurídica sobre direito civil</li>
              <li>3. <strong>O sistema RAG</strong> fará busca semântica nos artigos da lei</li>
              <li>4. <strong>Os artigos mais relevantes</strong> serão selecionados automaticamente</li>
              <li>5. <strong>3 IAs diferentes</strong> responderão baseadas no mesmo contexto</li>
              <li>6. <strong>Compare as respostas</strong> para ter múltiplas perspectivas</li>
            </ol>
            
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
              <p className="text-yellow-800 text-sm">
                <strong>⚠️ Atenção:</strong> Configure os tokens reais das IAs para usar o sistema em produção.
                Sem tokens válidos, será usado apenas embedding simulado.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestesIA;
