
import { AIProvider, AIResponse, AIInteraction } from './types';
import { GeminiProvider } from './providers/geminiProvider';
import { OpenAIProvider } from './providers/openaiProvider';
import { ClaudeProvider, GrokProvider, DeepSeekProvider } from './providers/otherProviders';
import { InteractionLogger } from './interactionLogger';

export class AIProvidersService {
  private static instance: AIProvidersService;

  static getInstance(): AIProvidersService {
    if (!AIProvidersService.instance) {
      AIProvidersService.instance = new AIProvidersService();
    }
    return AIProvidersService.instance;
  }

  async executeWithProvider(
    provider: AIProvider,
    prompt: string,
    pageContext: string,
    model?: string,
    customToken?: string
  ): Promise<AIResponse> {
    try {
      console.log('🤖 === EXECUTANDO PROVIDER DE IA ===');
      console.log('📋 Configurações:', {
        provider,
        model: model || this.getDefaultModel(provider),
        hasCustomToken: !!customToken,
        tokenPreview: customToken ? `${customToken.substring(0, 10)}...` : 'Não fornecido',
        promptLength: prompt.length,
        pageContext
      });

      let response: AIResponse;

      switch (provider) {
        case 'gemini':
          console.log('🌟 Executando Gemini provider...');
          response = await GeminiProvider.execute(prompt, model || 'gemini-1.5-flash', customToken);
          break;
        case 'openai':
          console.log('🧠 Executando OpenAI provider...');
          response = await OpenAIProvider.execute(prompt, model || 'gpt-4o-mini', customToken);
          break;
        case 'claude':
          console.log('🎭 Executando Claude provider...');
          response = await ClaudeProvider.execute(prompt, model || 'claude-3-sonnet-20240229', customToken);
          break;
        case 'grok':
          console.log('🚀 Executando Grok provider...');
          response = await GrokProvider.execute(prompt, model || 'grok-beta', customToken);
          break;
        case 'deepseek':
          console.log('🌊 Executando DeepSeek provider...');
          response = await DeepSeekProvider.execute(prompt, model || 'deepseek-chat', customToken);
          break;
        default:
          console.error('❌ Provider não suportado:', provider);
          throw new Error(`Provider ${provider} não suportado`);
      }

      console.log('📊 === RESULTADO DO PROVIDER ===');
      console.log('✅ Sucesso:', response.success);
      console.log('📏 Tokens usados:', response.tokens_used || 0);
      console.log('💰 Custo USD:', response.cost_usd || 0);
      console.log('📝 Tamanho da resposta:', response.data?.length || 0);
      
      if (response.error) {
        console.error('❌ Erro do provider:', response.error);
      }

      // Registrar interação no banco de dados
      if (response.success) {
        console.log('💾 Registrando interação no banco de dados...');
        try {
          await InteractionLogger.logInteraction({
            provider,
            model: model || this.getDefaultModel(provider),
            prompt,
            response: response.data || '',
            tokens_used: response.tokens_used || 0,
            cost_usd: response.cost_usd || 0,
            page_context: pageContext,
            metadata: { timestamp: new Date().toISOString() }
          });
          console.log('✅ Interação registrada com sucesso');
        } catch (logError) {
          console.error('⚠️ Erro ao registrar interação:', logError);
        }
      }

      return response;
    } catch (error: any) {
      console.error('❌ === ERRO CRÍTICO NO PROVIDER ===');
      console.error('Mensagem do erro:', error.message);
      console.error('Stack trace:', error.stack);
      console.error('Provider:', provider);
      console.error('Erro completo:', error);
      
      return {
        success: false,
        error: error.message || `Erro desconhecido no provider ${provider}`
      };
    }
  }

  private getDefaultModel(provider: string): string {
    const defaults: Record<string, string> = {
      'gemini': 'gemini-1.5-flash',
      'openai': 'gpt-4o-mini',
      'claude': 'claude-3-sonnet-20240229',
      'grok': 'grok-beta',
      'deepseek': 'deepseek-chat'
    };
    return defaults[provider] || 'unknown';
  }
}
