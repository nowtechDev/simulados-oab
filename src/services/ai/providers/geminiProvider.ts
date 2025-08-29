
import { AIResponse } from '../types';
import { CostCalculator } from '../costCalculator';

export class GeminiProvider {
  static async execute(prompt: string, model: string, customToken?: string): Promise<AIResponse> {
    console.log('🤖 GeminiProvider.execute chamado:', {
      model,
      hasCustomToken: !!customToken,
      tokenPreview: customToken ? `${customToken.substring(0, 10)}...` : 'Não fornecido',
      promptLength: prompt.length
    });

    const apiKey = customToken;
    
    if (!apiKey) {
      console.error('❌ API key do Gemini não configurada');
      return {
        success: false,
        error: 'API key do Gemini não configurada no agente'
      };
    }

    // Map old model names to new ones
    const modelMapping: Record<string, string> = {
      'gemini-pro': 'gemini-1.5-flash',
      'gemini-1.0-pro': 'gemini-1.5-flash',
    };

    const actualModel = modelMapping[model] || model;
    console.log('📋 Modelo selecionado:', { original: model, final: actualModel });

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${actualModel}:generateContent?key=${apiKey}`;
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        }
      };

      console.log('🌐 Enviando requisição para Gemini API:', {
        url: url.replace(/key=.*/, 'key=***'),
        bodyLength: JSON.stringify(requestBody).length
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📡 Resposta HTTP recebida:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na API do Gemini:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        throw new Error(`Erro na API do Gemini: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📦 Dados recebidos do Gemini:', {
        hasCandidates: !!data.candidates,
        candidatesLength: data.candidates?.length || 0,
        hasUsageMetadata: !!data.usageMetadata
      });
      
      if (!data.candidates || data.candidates.length === 0) {
        console.error('❌ Nenhuma resposta gerada pelo Gemini:', data);
        throw new Error('Nenhuma resposta gerada pelo Gemini');
      }

      const text = data.candidates[0].content.parts[0].text;
      const tokens = data.usageMetadata?.totalTokenCount || 0;
      const cost = CostCalculator.calculateGeminiCost(tokens);

      console.log('✅ Resposta processada com sucesso:', {
        textLength: text.length,
        tokens,
        cost
      });

      return {
        success: true,
        data: text,
        tokens_used: tokens,
        cost_usd: cost
      };
    } catch (error: any) {
      console.error('❌ Erro no executeGemini:', {
        message: error.message,
        stack: error.stack
      });
      return {
        success: false,
        error: error.message || 'Erro desconhecido na API do Gemini'
      };
    }
  }
}
