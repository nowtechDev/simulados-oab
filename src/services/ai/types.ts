
export interface AIInteraction {
  provider: 'openai' | 'gemini' | 'grok' | 'deepseek' | 'claude';
  model: string;
  prompt: string;
  response: string;
  tokens_used: number;
  cost_usd: number;
  page_context: string;
  metadata?: Record<string, any>;
}

export interface AIResponse {
  success: boolean;
  data?: string;
  tokens_used?: number;
  cost_usd?: number;
  error?: string;
}

export type AIProvider = 'openai' | 'gemini' | 'grok' | 'deepseek' | 'claude';
