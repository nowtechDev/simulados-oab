
import { toast } from "@/components/ui/use-toast";

export interface GPTCompletionParams {
  prompt: string;
  context?: string;
}

export interface GPTCompletionResult {
  content: string;
  isError: boolean;
}

export const generateCompletion = async (
  params: GPTCompletionParams
): Promise<GPTCompletionResult> => {
  try {
    const apiKey = localStorage.getItem('openai-api-key');
    
    if (!apiKey) {
      return {
        content: "API key da OpenAI não configurada. Configure sua chave na opção 'Configurar IA'.",
        isError: true
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
            content: `Você é um assistente acadêmico especializado em ajudar com anotações jurídicas. 
            Forneça respostas claras, precisas e concisas para ajudar o estudante a organizar melhor suas anotações.
            ${params.context ? `Contexto adicional: ${params.context}` : ''}`
          },
          {
            role: 'user',
            content: params.prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na API da OpenAI: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const completion = data.choices[0].message.content;
    
    return {
      content: completion,
      isError: false
    };
  } catch (error) {
    console.error("Erro ao gerar texto com OpenAI:", error);
    toast({
      title: "Erro na geração de texto",
      description: "Não foi possível conectar à API da OpenAI. Verifique sua chave de API.",
      variant: "destructive"
    });
    
    return {
      content: "Ocorreu um erro ao processar sua solicitação. Verifique sua chave de API e tente novamente.",
      isError: true
    };
  }
};
