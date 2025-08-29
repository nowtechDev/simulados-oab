import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, CheckCircle, Filter, Home, ChevronLeft, ChevronRight, Plus, Minus, BookOpen } from 'lucide-react';
import QuestionView from '@/components/simulator/QuestionView';
import ResultsView from '@/components/simulator/ResultsView';
import AIAssistant from '@/components/simulator/AIAssistant';
import ExamTimer from '@/components/simulator/ExamTimer';
import { useSimulatorState } from '@/hooks/useSimulatorState';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

const Simulator = () => {
  const { examId, simuladoId, numeroProva } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [navigationStart, setNavigationStart] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [strikedOptions, setStrikedOptions] = useState<Record<string, string[]>>({});
  
  // Determine which ID to use based on available params
  const currentExamId = numeroProva || examId;
  const currentSimuladoId = simuladoId;
  
  const {
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
  } = useSimulatorState(currentExamId, currentSimuladoId);

  // Strike through functionality
  const toggleStrikeOption = (questionId: string, optionId: string) => {
    setStrikedOptions(prev => {
      const questionStrikes = prev[questionId] || [];
      const isStriked = questionStrikes.includes(optionId);
      
      if (isStriked) {
        return {
          ...prev,
          [questionId]: questionStrikes.filter(id => id !== optionId)
        };
      } else {
        return {
          ...prev,
          [questionId]: [...questionStrikes, optionId]
        };
      }
    });
  };

  // Navigation logic for question numbers
  const VISIBLE_QUESTIONS = 10;
  
  const adjustNavigationRange = () => {
    if (state.currentQuestionIndex < navigationStart) {
      setNavigationStart(Math.max(0, state.currentQuestionIndex - Math.floor(VISIBLE_QUESTIONS / 2)));
    } else if (state.currentQuestionIndex >= navigationStart + VISIBLE_QUESTIONS) {
      setNavigationStart(Math.min(
        state.filteredQuestions.length - VISIBLE_QUESTIONS,
        state.currentQuestionIndex - Math.floor(VISIBLE_QUESTIONS / 2)
      ));
    }
  };

  React.useEffect(() => {
    adjustNavigationRange();
  }, [state.currentQuestionIndex]);

  const canNavigateBack = navigationStart > 0;
  const canNavigateForward = navigationStart + VISIBLE_QUESTIONS < state.filteredQuestions.length;

  const handleNavigateBack = () => {
    if (canNavigateBack) {
      setNavigationStart(Math.max(0, navigationStart - VISIBLE_QUESTIONS));
    }
  };

  const handleNavigateForward = () => {
    if (canNavigateForward) {
      setNavigationStart(Math.min(state.filteredQuestions.length - VISIBLE_QUESTIONS, navigationStart + VISIBLE_QUESTIONS));
    }
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!loggedIn) {
      toast({
        title: "Acesso restrito",
        description: "Faça login para acessar esta página",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (currentExamId) {
      fetchQuestions();
    }
  }, [currentExamId, currentSimuladoId, navigate, toast]);

  useEffect(() => {
    if (!currentExamId) return;

    let timerId: NodeJS.Timeout;

    const startTimer = () => {
      setState(prev => ({ ...prev, isTimerActive: true }));
      timerId = setInterval(() => {
        setState(prev => {
          if (prev.timeRemaining <= 0) {
            clearInterval(timerId);
            return { ...prev, isTimerActive: false, showResults: true };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    };

    startTimer();

    return () => {
      clearInterval(timerId);
    };
  }, [currentExamId]);

  const handleBackToHome = () => {
    navigate('/simulados-desbloqueado');
  };

  const handleFontSizeChange = (delta: number) => {
    setFontSize(prev => Math.max(12, Math.min(24, prev + delta)));
  };

  // Area themes mapping
  const areaThemes: Record<string, string[]> = {
    "Direito Administrativo": ["Serviços Públicos", "Intervenção do Estado na Propriedade Privada", "Lei 8.112/1990", "Organização Administrativa", "Licitações", "Improbidade Administrativa", "Controle da Administração"],
    "Direito Civil": ["Direito de Família", "Direito das Coisas", "Obrigações", "Contratos", "Sucessões", "Fatos Jurídicos", "Responsabilidade Civil"],
    "Direito Penal": ["Teoria do Crime", "Das Penas", "Crimes contra a Pessoa", "Crimes contra o Patrimônio", "Crimes contra a Administração Pública", "Lei Penal", "Extinção da Punibilidade"],
    "Direito Constitucional": ["Organização dos Poderes", "Direitos e Garantias Fundamentais", "Organização do Estado", "Controle de Constitucionalidade", "Ordem Social", "Teoria Constitucional"],
    "Direito do Trabalho": ["Contrato de Trabalho", "Duração do Trabalho", "Remuneração", "Jurisprudência Trabalhista", "Direito Coletivo do Trabalho", "Responsabilidade Trabalhista"],
    "Direito Processual do Trabalho": ["Recursos Trabalhistas", "Jurisprudência Processual Trabalhista", "Execução Trabalhista", "Procedimentos Especiais Trabalhistas", "Provas", "Resposta Trabalhista"],
    "Direito Processual Civil": ["Processo de Conhecimento", "Recursos Cíveis", "Sujeitos do Processo", "Processo de Execução", "Tutela Provisória", "Atos Processuais"],
    "Direito do Consumidor": ["Proteção ao Consumidor", "Direitos Básicos", "Responsabilidade pelo Fato do Produto/Serviço", "Práticas Abusivas", "Proteção Contratual", "Defesa do Consumidor em Juízo"],
    "Direito Empresarial": ["Sociedades Empresárias", "Títulos de Crédito", "Recuperação Judicial e Falência", "Estabelecimento Empresarial", "Propriedade Industrial", "Contratos Mercantis"],
    "Direito Tributário": ["Crédito Tributário", "Competência Tributária", "Limitações ao Poder de Tributar", "Impostos Federais", "Impostos Estaduais", "Impostos Municipais"]
  };

  if (state.showResults) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <ResultsView 
            examData={{
              title: `Exame ${currentExamId}`,
              timeLimit: "5 horas",
              questions: state.filteredQuestions.map(q => ({
                id: q.Numero,
                text: q.Enunciado,
                area: q.Área,
                correctOption: q["Resposta Correta"]
              }))
            }}
            selectedOptions={state.selectedAnswers}
            calculateScore={() => {
              const total = state.filteredQuestions.length;
              const correct = state.filteredQuestions.filter(q => 
                state.selectedAnswers[q.Numero] === q["Resposta Correta"]
              ).length;
              return {
                score: correct,
                total,
                percentage: Math.round((correct / total) * 100)
              };
            }}
            onReturnToSimulados={handleBackToHome}
          />
        </div>
      </Layout>
    );
  }

  if (state.filteredQuestions.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center">
          <Card className="p-8 text-center max-w-md mx-4 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Carregando questões...</h2>
            <p className="text-gray-600 text-sm">Preparando seu simulado</p>
          </Card>
        </div>
      </Layout>
    );
  }

  const currentQuestion = state.filteredQuestions[state.currentQuestionIndex];
  const selectedAnswer = state.selectedAnswers[currentQuestion.Numero];
  const isAnswered = selectedAnswer !== undefined;
  const isCorrect = isAnswered && selectedAnswer === currentQuestion["Resposta Correta"];

  // Get unique areas for filter
  const uniqueAreas = Array.from(new Set(state.questions.map(q => q.Área).filter(Boolean)));

  const visibleQuestions = state.filteredQuestions.slice(navigationStart, navigationStart + VISIBLE_QUESTIONS);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-purple-200 shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleBackToHome}
                  className="gap-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  <Home className="w-4 h-4" />
                  Voltar
                </Button>
                <div className="h-6 w-px bg-purple-300"></div>
                <div>
                  <h1 className="text-xl font-bold text-black">
                    OAB - Primeira Fase
                  </h1>
                  <p className="text-sm text-black">
                    {currentSimuladoId ? `Simulado ${currentSimuladoId} - ` : ''}Prova {currentExamId} • FGV
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Font Size Controls */}
                <div className="flex items-center gap-1 bg-white border border-purple-200 rounded-lg px-2 py-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFontSizeChange(-2)}
                    className="h-6 w-6 p-0 text-purple-600 hover:bg-purple-100"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-xs text-purple-600 px-2">{fontSize}px</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFontSizeChange(2)}
                    className="h-6 w-6 p-0 text-purple-600 hover:bg-purple-100"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* Filter Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-50 h-8"
                    >
                      <Filter className="w-4 h-4" />
                      Filtros
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-72 max-h-96">
                    <DropdownMenuLabel>Filtrar por Área</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleFilterQuestions('all')}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Todas as áreas
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <ScrollArea className="h-80">
                      {uniqueAreas.sort().map((area) => (
                        <DropdownMenuSub key={area}>
                          <DropdownMenuSubTrigger>
                            <BookOpen className="w-4 h-4 mr-2" />
                            {area}
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent className="w-64">
                            <DropdownMenuItem onClick={() => handleFilterQuestions(area)}>
                              Ver toda a área
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {areaThemes[area]?.map((theme) => (
                              <DropdownMenuItem 
                                key={theme}
                                onClick={() => {
                                  const filtered = state.questions.filter(q => q.Tema?.includes(theme));
                                  setState(prev => ({ ...prev, filteredQuestions: filtered }));
                                }}
                                className="text-sm"
                              >
                                {theme}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      ))}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Timer - moved to left to avoid covering filter */}
                <ExamTimer 
                  initialTime={state.timeRemaining}
                  isStarted={state.isTimerActive}
                  className="ml-4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-purple-200 py-4">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNavigateBack}
                disabled={!canNavigateBack}
                className="h-8 w-8 p-0 text-purple-600 hover:bg-purple-100 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex gap-1">
                {visibleQuestions.map((q, index) => {
                  const actualIndex = navigationStart + index;
                  const isCurrentQuestion = actualIndex === state.currentQuestionIndex;
                  const isQuestionAnswered = state.selectedAnswers[q.Numero] !== undefined;
                  
                  return (
                    <button
                      key={q.Numero}
                      onClick={() => navigateToQuestion(actualIndex)}
                      className={`
                        flex items-center justify-center w-8 h-8 text-xs font-medium rounded-lg transition-all
                        ${isCurrentQuestion
                          ? "bg-purple-600 text-white shadow-md"
                          : isQuestionAnswered
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-purple-100 border border-gray-200"
                        }
                      `}
                    >
                      {actualIndex + 1}
                    </button>
                  );
                })}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNavigateForward}
                disabled={!canNavigateForward}
                className="h-8 w-8 p-0 text-purple-600 hover:bg-purple-100 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-6">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.Numero}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <QuestionView 
                  question={{
                    id: currentQuestion.Numero,
                    text: currentQuestion.Enunciado,
                    options: [
                      { id: 'A', text: currentQuestion["Alternativa A"] },
                      { id: 'B', text: currentQuestion["Alternativa B"] },
                      { id: 'C', text: currentQuestion["Alternativa C"] },
                      { id: 'D', text: currentQuestion["Alternativa D"] }
                    ],
                    area: currentQuestion.Área,
                    tags: [currentQuestion.Tema],
                    correctOption: currentQuestion["Resposta Correta"],
                    explanation: `A resposta correta é ${currentQuestion["Resposta Correta"]}. ${currentQuestion.Tema} - ${currentQuestion.Área}`
                  }}
                  currentQuestionIndex={state.currentQuestionIndex}
                  totalQuestions={state.filteredQuestions.length}
                  selectedOption={selectedAnswer}
                  showExplanation={state.showExplanation}
                  onSelectOption={handleSelectAnswer}
                  onToggleExplanation={toggleExplanation}
                  isAnswered={isAnswered}
                  isCorrect={isCorrect}
                  onMarkAnswer={handleNextQuestion}
                  fontSize={fontSize}
                  strikedOptions={strikedOptions[currentQuestion.Numero] || []}
                  onToggleStrike={(optionId) => toggleStrikeOption(currentQuestion.Numero.toString(), optionId)}
                />

                <AIAssistant 
                  aiQuery={state.aiQuery}
                  aiResponse={state.aiResponse}
                  isQueryingAI={state.isQueryingAI}
                  setAiQuery={setAiQuery}
                  onQueryAI={queryAI}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="bg-white/95 backdrop-blur-sm border-t border-purple-200 shadow-lg">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center max-w-4xl mx-auto">
              <Button 
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={state.currentQuestionIndex === 0}
                className="gap-2 border-purple-300 hover:bg-purple-50 text-purple-700"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </Button>
              
              <div className="text-center">
                <p className="text-sm font-medium text-purple-700">
                  {state.currentQuestionIndex + 1} / {state.filteredQuestions.length}
                </p>
                <p className="text-xs text-purple-500">questões</p>
              </div>
              
              {state.currentQuestionIndex === state.filteredQuestions.length - 1 ? (
                <Button 
                  onClick={handleFinishExam} 
                  className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  Finalizar
                  <CheckCircle className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleNextQuestion} 
                  className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Próxima
                  <ArrowRight className="w-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Simulator;
