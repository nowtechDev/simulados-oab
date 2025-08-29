
export interface Agente {
  id: string;
  nome: string;
  prompt: string;
  ia_provider: string;
  token_agente?: string;
  ativo: boolean;
  links?: string[];
  arquivos?: any;
  versao?: string;
  created_at: string;
  updated_at: string;
}

export interface AgenteExecutionParams {
  agenteName: string;
  inputData: Record<string, any>;
  context?: string;
}

export interface AgenteResponse {
  success: boolean;
  data?: any;
  error?: string;
}
