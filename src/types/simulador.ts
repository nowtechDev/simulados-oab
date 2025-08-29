
// Import ExamQuestion from simulator types to avoid duplication
import { ExamQuestion as BaseExamQuestion } from './simulator';

export type OpenAIAnalysisResult = {
  pontuacao: number;
  acertos: string[];
  erros: string[];
  sugestoes: string[];
  comentarioGeral: string;
  // New fields for scoring table
  tabelaPontuacao?: {
    item: string;
    valor: number;
    obtido: number;
  }[];
  // Separate analysis for essay questions
  questoesDissertativas?: {
    [questionId: number]: {
      pontuacao: number;
      comentario: string;
      itensIdentificados: string[];
      itensFaltantes: string[];
    }
  };
};

// Extended ExamQuestion with additional properties needed for the simulador
export interface ExamQuestion extends BaseExamQuestion {
  title?: string;
  isEssay?: boolean;
  // Properties for essay questions
  pointsA?: number;
  pointsB?: number;
  letterA?: string;
  letterB?: string;
}

export type Peca = {
  id: string;
  numero?: string;
  titulo: string;
  tipo: string;
  tipoPeca?: string;
  descricao: string;
  area: string;
  problema: string;
  orientacoes: string[];
  gabarito: string;
  dataAplicacao?: string;
  tabelaPontuacao?: {
    item: string;
    valor: number;
  }[];
  questoes?: ExamQuestion[];
};

export type SimuladorState = {
  currentStep: 'instrucoes' | 'redacao' | 'correcao';
  resposta: string;
  tempoRestante: number;
  isAnalisando: boolean;
  analiseIA: OpenAIAnalysisResult | string | null;
  respostasQuestoes?: Record<number, string>;
};

// Re-export from simulator types to maintain compatibility
export type { Question, SimulatorState as SimulatorPageState } from './simulator';
