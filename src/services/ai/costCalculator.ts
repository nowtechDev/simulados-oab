
export class CostCalculator {
  static calculateGeminiCost(tokens: number): number {
    // Preços do Gemini Pro (aproximados)
    const inputCostPer1kTokens = 0.00025; // $0.00025 por 1k tokens
    return (tokens / 1000) * inputCostPer1kTokens;
  }

  static calculateOpenAICost(tokens: number, model: string): number {
    // Preços aproximados da OpenAI
    const costs: Record<string, number> = {
      'gpt-4o-mini': 0.00015, // $0.00015 por 1k tokens
      'gpt-4': 0.03, // $0.03 por 1k tokens
      'gpt-3.5-turbo': 0.002, // $0.002 por 1k tokens
    };
    
    const costPer1kTokens = costs[model] || 0.002;
    return (tokens / 1000) * costPer1kTokens;
  }
}
