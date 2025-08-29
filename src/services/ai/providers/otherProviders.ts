
import { AIResponse } from '../types';

export class ClaudeProvider {
  static async execute(prompt: string, model: string, customToken?: string): Promise<AIResponse> {
    // Implementação para Claude
    return {
      success: false,
      error: 'Provider Claude ainda não implementado'
    };
  }
}

export class GrokProvider {
  static async execute(prompt: string, model: string, customToken?: string): Promise<AIResponse> {
    // Implementação para Grok
    return {
      success: false,
      error: 'Provider Grok ainda não implementado'
    };
  }
}

export class DeepSeekProvider {
  static async execute(prompt: string, model: string, customToken?: string): Promise<AIResponse> {
    // Implementação para DeepSeek
    return {
      success: false,
      error: 'Provider DeepSeek ainda não implementado'
    };
  }
}
