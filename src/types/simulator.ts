
export interface Question {
  prova: number;
  Numero: number;
  Enunciado: string;
  "Alternativa A": string;
  "Alternativa B": string;
  "Alternativa C": string;
  "Alternativa D": string;
  "Resposta Correta": string;
  Área: string;
  Tema: string;
}

export interface ExamQuestion {
  id: number;
  text: string;
  options: Array<{ id: string; text: string }>;
  area: string;
  tags?: string[];
  correctOption?: string; // Made optional for essay questions
  explanation?: string;
  // Properties for essay questions
  title?: string;
  isEssay?: boolean;
  pointsA?: number;
  pointsB?: number;
  letterA?: string;
  letterB?: string;
}

export interface SimulatorState {
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswers: Record<number, string>;
  showResults: boolean;
  timeRemaining: number;
  isTimerActive: boolean;
  showExplanation: boolean;
  filteredQuestions: Question[];
  aiQuery: string;
  aiResponse: string;
  isQueryingAI: boolean;
}
