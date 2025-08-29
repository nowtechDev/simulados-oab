import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Clock, FileText, HelpCircle, Loader2, Send, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import SimuladoConfigForm, { SimuladoConfig } from '@/components/simulator/SimuladoConfigForm';
import ExamTimer from '@/components/simulator/ExamTimer';
import QuestionView from '@/components/simulator/QuestionView';

type QuestionDifficulty = 'fácil' | 'médio' | 'difícil';

interface AIGeneratedQuestion {
  id: number;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOption: string;
  explanation: string;
  area: string;
  difficulty: QuestionDifficulty;
}

interface SimulatorState {
  status: 'intro' | 'config' | 'generating' | 'answering' | 'results';
  questions: AIGeneratedQuestion[];
  selectedOptions: Record<number, string>;
  currentQuestionIndex: number;
  showExplanation: boolean;
  aiQuery: string;
  aiResponse: string;
  isQueryingAI: boolean;
  generationProgress: number;
  config: SimuladoConfig | null;
}

const SimuladoPrimeiraFaseIA = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [state, setState] = useState<SimulatorState>({
    status: 'intro',
    questions: [],
    selectedOptions: {},
    currentQuestionIndex: 0,
    showExplanation: false,
    aiQuery: '',
    aiResponse: '',
    isQueryingAI: false,
    generationProgress: 0,
    config: null
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!loggedIn) {
      toast({
        title: "Acesso restrito",
        description: "Faça login para acessar esta página",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [navigate, toast]);

  const goToConfig = () => {
    setState(prev => ({ ...prev, status: 'config' }));
  };

  const startSimulator = async (config: SimuladoConfig) => {
    console.log("Generating questions with config:", config);
    
    setState(prev => ({ 
      ...prev, 
      status: 'generating',
      config: config 
    }));
    
    const progressInterval = setInterval(() => {
      setState(prev => {
        const newProgress = Math.min(prev.generationProgress + 2, 95);
        return { ...prev, generationProgress: newProgress };
      });
    }, 300);

    try {
      const questions = await generateQuestionsWithAI(config);
      
      setState(prev => ({ 
        ...prev, 
        questions,
        status: 'answering',
        generationProgress: 100 
      }));
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Erro ao gerar questões",
        description: "Não foi possível conectar à API da OpenAI. Verifique sua chave de API.",
        variant: "destructive"
      });
      
      setState(prev => ({ ...prev, status: 'config' }));
    } finally {
      clearInterval(progressInterval);
    }
  };

  const generateQuestionsWithAI = async (config: SimuladoConfig): Promise<AIGeneratedQuestion[]> => {
    console.log("Generating questions with config:", config);
    
    const delayTime = config.simuladoCompleto ? 6000 : (config.numQuestoes * 200) + 2000;
    await new Promise(resolve => setTimeout(resolve, delayTime));
    
    const mockAreas = [
      "Direito Constitucional", 
      "Direito Civil", 
      "Direito Penal", 
      "Direito Administrativo",
      "Direito Tributário",
      "Direito Empresarial",
      "Direito do Trabalho",
      "Direito Processual Civil"
    ];
    
    const difficulties: QuestionDifficulty[] = ['fácil', 'médio', 'difícil'];

    const selectedArea = config.area === 'todas' ? 
                         null : 
                         config.area;
    
    const questionCount = config.simuladoCompleto ? 80 : config.numQuestoes;
    
    return Array.from({ length: questionCount }, (_, i) => {
      const questionArea = selectedArea || mockAreas[i % mockAreas.length];
      
      let questionText = `Questão ${i + 1}: Em relação ao ${questionArea}`;
      
      if (config.subarea) {
        questionText += `, especificamente sobre ${config.subarea},`;
      }
      
      if (config.palavraChave) {
        questionText += ` envolvendo o tema "${config.palavraChave}",`;
      }
      
      questionText += " é correto afirmar que:";
      
      return {
        id: i + 1,
        text: questionText,
        options: [
          { id: 'A', text: `Alternativa A sobre ${questionArea}` },
          { id: 'B', text: `Alternativa B sobre ${questionArea}` },
          { id: 'C', text: `Alternativa C sobre ${questionArea}` },
          { id: 'D', text: `Alternativa D sobre ${questionArea}` },
        ],
        correctOption: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
        explanation: `Esta é uma explicação detalhada sobre a resposta correta para a questão sobre ${questionArea}.`,
        area: questionArea,
        difficulty: difficulties[Math.floor(Math.random() * 3)]
      };
    });
  };

  const handleSelectOption = (optionId: string) => {
    const currentQuestion = state.questions[state.currentQuestionIndex];
    setState(prev => ({
      ...prev,
      selectedOptions: {
        ...prev.selectedOptions,
        [currentQuestion.id]: optionId
      }
    }));
  };

  const handleNextQuestion = () => {
    if (state.currentQuestionIndex < state.questions.length - 1) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        showExplanation: false,
        aiResponse: '',
        aiQuery: ''
      }));
    } else {
      setState(prev => ({
        ...prev,
        status: 'results'
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

  const toggleExplanation = () => {
    setState(prev => ({
      ...prev,
      showExplanation: !prev.showExplanation
    }));
  };

  const handleMarkAnswer = () => {
    handleNextQuestion();
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const currentQuestion = state.questions[state.currentQuestionIndex];
      const response = `
        Baseado na sua pergunta sobre "${state.aiQuery}", posso explicar melhor o conceito envolvido na questão:
        
        Na área de ${currentQuestion.area}, é importante compreender que a alternativa correta está fundamentada nos princípios básicos da disciplina. 
        
        ${currentQuestion.explanation}
        
        Espero ter esclarecido sua dúvida. Se precisar de mais detalhes, fique à vontade para perguntar.
      `;
      
      setState(prev => ({
        ...prev,
        aiResponse: response,
        isQueryingAI: false
      }));
    } catch (error) {
      console.error('Error querying AI:', error);
      toast({
        title: "Erro",
        description: "Não foi possível obter uma resposta da IA. Verifique sua chave de API.",
        variant: "destructive"
      });
      setState(prev => ({ ...prev, isQueryingAI: false }));
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    
    state.questions.forEach(question => {
      if (state.selectedOptions[question.id] === question.correctOption) {
        correctAnswers++;
      }
    });
    
    return {
      score: correctAnswers,
      total: state.questions.length,
      percentage: Math.round((correctAnswers / state.questions.length) * 100)
    };
  };

  const renderContent = () => {
    switch (state.status) {
      case 'intro':
        return renderIntroView();
      case 'config':
        return renderConfigView();
      case 'generating':
        return renderGeneratingView();
      case 'answering':
        return renderQuestionView();
      case 'results':
        return renderResultsView();
      default:
        return renderIntroView();
    }
  };

  const renderIntroView = () => {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="p-8 text-center">
          <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Simulado da 1ª Fase – IA
          </h1>
          
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex items-center text-muted-foreground gap-2">
              <Clock className="w-4 h-4" />
              <span>5 horas</span>
            </div>
            <div className="flex items-center text-muted-foreground gap-2">
              <FileText className="w-4 h-4" />
              <span>Questões de múltipla escolha</span>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            Este simulado utiliza Inteligência Artificial para gerar questões personalizadas baseadas no conteúdo programático da prova da OAB.
            Você pode personalizar seu simulado escolhendo áreas específicas e a quantidade de questões que deseja praticar.
          </p>
          
          <Card className="bg-muted/50 p-6 mb-8">
            <h3 className="font-semibold mb-4">Como funciona?</h3>
            <ul className="text-left space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>A IA gerará questões personalizadas de acordo com as áreas que você selecionar</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Você pode escolher entre 1 e 20 questões para praticar áreas específicas</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Ou gerar um simulado completo com 80 questões no formato do Exame de Ordem</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Consulte a IA para receber explicações detalhadas durante a prova</span>
              </li>
            </ul>
          </Card>
          
          <Button onClick={goToConfig} size="lg" className="min-w-[200px]">
            Configurar Simulado
          </Button>
        </Card>
      </div>
    );
  };

  const renderConfigView = () => {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#4F1964] mb-2 text-center">
            Configure seu Simulado
          </h1>
          <p className="text-center text-foreground/60">
            Personalize seu simulado de acordo com suas necessidades de estudo
          </p>
        </div>
        
        <SimuladoConfigForm onStartSimulado={startSimulator} />
      </div>
    );
  };

  const renderGeneratingView = () => {
    const questionCount = state.config?.simuladoCompleto ? 80 : state.config?.numQuestoes || 0;
    
    return (
      <div className="max-w-3xl mx-auto">
        <div className="glass-panel p-8 text-center">
          <h2 className="text-2xl font-bold text-[#4F1964] mb-6">
            Gerando Questões
          </h2>
          
          <div className="flex justify-center mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
          
          <p className="text-foreground/80 mb-8">
            Nossa IA está trabalhando para criar questões personalizadas para seu simulado.
            Isso pode levar alguns instantes...
          </p>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${state.generationProgress}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-foreground/60">
            Gerando questão {Math.round((state.generationProgress / 100) * questionCount)} de {questionCount}
          </p>
        </div>
      </div>
    );
  };

  const renderQuestionView = () => {
    if (state.questions.length === 0) return null;
    
    const currentQuestion = state.questions[state.currentQuestionIndex];
    const selectedOption = state.selectedOptions[currentQuestion.id];
    const isAnswered = selectedOption !== undefined;
    const isCorrect = isAnswered && selectedOption === currentQuestion.correctOption;
    
    return (
      <>
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Simulado da 1ª Fase – IA</h1>
            <ExamTimer />
          </div>
          
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-2 min-w-max">
              {state.questions.map((q, index) => {
                const isSelected = index === state.currentQuestionIndex;
                const isQuestionAnswered = state.selectedOptions[q.id] !== undefined;
                
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setState(prev => ({
                        ...prev,
                        currentQuestionIndex: index,
                        showExplanation: false,
                        aiResponse: '',
                        aiQuery: ''
                      }));
                    }}
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-colors",
                      isSelected
                        ? "bg-primary text-white"
                        : isQuestionAnswered
                        ? "bg-primary/20 text-primary"
                        : "bg-gray-100 text-foreground/60 hover:bg-gray-200"
                    )}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-panel p-8"
            >
              <QuestionView 
                question={currentQuestion}
                currentQuestionIndex={state.currentQuestionIndex}
                totalQuestions={state.questions.length}
                selectedOption={selectedOption}
                showExplanation={state.showExplanation}
                onSelectOption={handleSelectOption}
                onToggleExplanation={toggleExplanation}
                isAnswered={isAnswered}
                isCorrect={isCorrect}
                onMarkAnswer={handleMarkAnswer}
              />

              <div className="border rounded-md p-4 mb-6 mt-8">
                <h4 className="font-medium mb-4">Assistente IA - Tire suas dúvidas</h4>
                
                {state.aiResponse && (
                  <div className="p-4 bg-gray-50 rounded-md mb-4 whitespace-pre-line">
                    {state.aiResponse}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Textarea
                    value={state.aiQuery}
                    onChange={(e) => setState(prev => ({ ...prev, aiQuery: e.target.value }))}
                    placeholder="Digite sua dúvida sobre esta questão..."
                    className="flex-1"
                  />
                  <Button
                    onClick={queryAI}
                    disabled={state.isQueryingAI || !state.aiQuery.trim()}
                    variant="outline"
                  >
                    {state.isQueryingAI ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={state.currentQuestionIndex === 0}
                  className="gap-2"
                >
                  Anterior
                </Button>
                
                <Button 
                  onClick={handleNextQuestion}
                  disabled={!isAnswered}
                  className="gap-2"
                >
                  {state.currentQuestionIndex === state.questions.length - 1 ? "Finalizar" : "Próxima"}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </>
    );
  };

  const renderResultsView = () => {
    const score = calculateScore();
    
    const areaPerformance: Record<string, { correct: number, total: number }> = {};
    
    state.questions.forEach(question => {
      if (!areaPerformance[question.area]) {
        areaPerformance[question.area] = { correct: 0, total: 0 };
      }
      
      areaPerformance[question.area].total += 1;
      
      if (state.selectedOptions[question.id] === question.correctOption) {
        areaPerformance[question.area].correct += 1;
      }
    });
    
    return (
      <div className="max-w-3xl mx-auto">
        <div className="glass-panel p-8">
          <h1 className="text-3xl font-bold text-[#4F1964] mb-6 text-center">
            Resultado do Simulado
          </h1>
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-32 rounded-full flex items-center justify-center bg-primary/10 mb-4">
              <span className="text-3xl font-bold text-primary">{score.percentage}%</span>
            </div>
            <p className="text-lg">
              Você acertou <span className="font-bold">{score.score}</span> de {score.total} questões
            </p>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Desempenho por Área</h2>
          <div className="space-y-4 mb-8">
            {Object.entries(areaPerformance).map(([area, data]) => {
              const percentage = Math.round((data.correct / data.total) * 100);
              return (
                <div key={area}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{area}</span>
                    <span>{data.correct}/{data.total} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={cn(
                        "h-2.5 rounded-full",
                        percentage >= 70 ? "bg-green-500" : 
                        percentage >= 50 ? "bg-amber-500" : "bg-red-500"
                      )}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => navigate('/simulados')}>
              Voltar aos Simulados
            </Button>
            <Button onClick={() => setState({
              status: 'config',
              questions: [],
              selectedOptions: {},
              currentQuestionIndex: 0,
              showExplanation: false,
              aiQuery: '',
              aiResponse: '',
              isQueryingAI: false,
              generationProgress: 0,
              config: null
            })}>
              Novo Simulado
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default SimuladoPrimeiraFaseIA;
