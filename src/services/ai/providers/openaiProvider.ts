
import { AIResponse } from '../types';
import { CostCalculator } from '../costCalculator';

export class OpenAIProvider {
  static async execute(prompt: string, model: string, customToken?: string): Promise<AIResponse> {
    const apiKey = customToken || localStorage.getItem('openai-api-key');
    
    if (!apiKey) {
      return {
        success: false,
        error: 'API key da OpenAI não configurada'
      };
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: prompt
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
    const tokens = data.usage?.total_tokens || 0;
    const cost = CostCalculator.calculateOpenAICost(tokens, model);

    return {
      success: true,
      data: data.choices[0].message.content,
      tokens_used: tokens,
      cost_usd: cost
    };
  }
}
