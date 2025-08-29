
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SimulatorState, Question } from '@/types/simulator';
import { supabase } from '@/integrations/supabase/client';
import { SimulatorAIService } from '@/services/simulatorAIService';

export const useSimulatorState = (examId: string | undefined, simuladoId?: string | undefined) => {
  const { toast } = useToast();
  
  const [state, setState] = useState<SimulatorState>({
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswers: {},
    showResults: false,
    timeRemaining: 5 * 60 * 60, // 5 hours
    isTimerActive: false,
    showExplanation: false,
    filteredQuestions: [],
    aiQuery: '',
    aiResponse: '',
    isQueryingAI: false,
  });

  const fetchQuestions = async () => {
    try {
      let query = supabase.from('provas_oab').select('*');
      
      if (simuladoId && examId) {
        // New route format: /prova/:simuladoId/:numeroProva
        query = query
          .eq('simulado_id', parseInt(simuladoId))
          .eq('prova', parseInt(examId))
          .order('Numero');
      } else if (examId) {
        // Old route format: /simulator/:examId
        query = query
          .eq('prova', parseInt(examId))
          .order('Numero');
      }

      const { data, error } = await query;

      if (error) throw error;

      setState(prev => ({
        ...prev,
        questions: data || [],
        filteredQuestions: data || []
      }));
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as questões",
        variant: "destructive"
      });
    }
  };

  const handleFilterQuestions = (area: string) => {
    if (area === 'all') {
      setState(prev => ({ ...prev, filteredQuestions: prev.questions }));
    } else {
      const filtered = state.questions.filter(q => q.Área === area);
      setState(prev => ({ ...prev, filteredQuestions: filtered }));
    }
  };

  const handleSelectAnswer = (optionId: string) => {
    const currentQuestion = state.filteredQuestions[state.currentQuestionIndex];
    setState(prev => ({
      ...prev,
      selectedAnswers: {
        ...prev.selectedAnswers,
        [currentQuestion.Numero]: optionId
      }
    }));
  };

  const handleNextQuestion = () => {
    if (state.currentQuestionIndex < state.filteredQuestions.length - 1) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        showExplanation: false,
        aiResponse: '',
        aiQuery: ''
      }));
    }
  };

  const handlePreviousQuestion = () => {
    if (state.currentQuestionIndex > 0) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
        showExplanation: false,
        aiResponse: '',
        aiQuery: ''
      }));
    }
  };

  const handleFinishExam = () => {
    setState(prev => ({ ...prev, showResults: true, isTimerActive: false }));
  };

  const toggleExplanation = () => {
    setState(prev => ({ ...prev, showExplanation: !prev.showExplanation }));
  };

  const setAiQuery = (query: string) => {
    setState(prev => ({ ...prev, aiQuery: query }));
  };

  const queryAI = async () => {
    if (!state.aiQuery.trim()) {
      toast({
        title: "Campo vazio",
        description: "Por favor, digite sua pergunta antes de enviar.",
        variant: "destructive"
      });
      return;
    }

    setState(prev => ({ ...prev, isQueryingAI: true }));

    try {
      const questaoAtual = state.filteredQuestions[state.currentQuestionIndex];
      
      if (!questaoAtual) {
        throw new Error('Nenhuma questão selecionada');
      }

      const response = await SimulatorAIService.executeQuery(questaoAtual, state.aiQuery);

      setState(prev => ({
        ...prev,
        aiResponse: response,
        isQueryingAI: false
      }));

    } catch (error: any) {
      console.error('❌ === ERRO CRÍTICO NA CONSULTA AI ===');
      console.error('Mensagem do erro:', error.message);
      console.error('Stack trace:', error.stack);
      console.error('Erro completo:', error);
      
      toast({
        title: "Erro na consulta AI",
        description: `Não foi possível obter uma resposta da IA: ${error.message}`,
        variant: "destructive"
      });
      setState(prev => ({ ...prev, isQueryingAI: false }));
    }
  };

  const navigateToQuestion = (index: number) => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: index,
      showExplanation: false,
      aiResponse: '',
      aiQuery: ''
    }));
  };

  return {
    state,
    setState,
    fetchQuestions,
    handleFilterQuestions,
    handleSelectAnswer,
    handleNextQuestion,
    handlePreviousQuestion,
    handleFinishExam,
    toggleExplanation,
    setAiQuery,
    queryAI,
    navigateToQuestion,
  };
};
