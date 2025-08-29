import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, FileText, Clock, ChevronLeft, ChevronRight, Send, Loader2, Filter, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import ExamTimer from '@/components/simulator/ExamTimer';

interface Questao {
  Numero: number;
  Enunciado: string;
  'Alternativa A': string;
  'Alternativa B': string;
  'Alternativa C': string;
  'Alternativa D': string;
  'Resposta Correta': string;
  Área: string;
  Tema: string;
}

interface AreaStats {
  correct: number;
  total: number;
  answered: number;
  themes: string[];
}

interface ScoreData {
  correct: number;
  answered: number;
  total: number;
  percentage: number;
  areaStats: Record<string, AreaStats>;
}

const ProvaView = () => {
  const {
    simuladoId,
    numeroProva
  } = useParams();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [filteredQuestoes, setFilteredQuestoes] = useState<Questao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [verifiedQuestions, setVerifiedQuestions] = useState<Record<number, boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isQueryingAI, setIsQueryingAI] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedTema, setSelectedTema] = useState<string>('all');
  const [aiFeedback, setAiFeedback] = useState('');
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [fontSize, setFontSize] = useState('base'); // sm, base, lg

  useEffect(() => {
    if (simuladoId && numeroProva) {
      fetchQuestoes();
    }
  }, [simuladoId, numeroProva]);
  useEffect(() => {
    let filtered = questoes;
    if (selectedArea !== 'all') {
      filtered = filtered.filter(q => q.Área === selectedArea);
    }
    if (selectedTema !== 'all') {
      filtered = filtered.filter(q => q.Tema === selectedTema);
    }
    setFilteredQuestoes(filtered);
    setCurrentQuestionIndex(0);
  }, [selectedArea, selectedTema, questoes]);
  const fetchQuestoes = async () => {
    setIsLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.from('provas_oab').select('*').eq('simulado_id', Number(simuladoId)).eq('prova', Number(numeroProva)).order('Numero');
      if (error) {
        throw error;
      }
      setQuestoes(data || []);
      setFilteredQuestoes(data || []);
    } catch (error) {
      console.error('Erro ao buscar questões:', error);
      toast({
        title: 'Erro ao carregar questões',
        description: 'Não foi possível carregar as questões da prova.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleSelectOption = (questaoNumero: number, opcao: string) => {
    if (verifiedQuestions[questaoNumero]) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questaoNumero]: opcao
    }));
  };
  const handleVerifyAnswer = () => {
    const currentQuestion = filteredQuestoes[currentQuestionIndex];
    setVerifiedQuestions(prev => ({
      ...prev,
      [currentQuestion.Numero]: true
    }));
  };
  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestoes.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAiQuery('');
      setAiResponse('');
    }
  };
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setAiQuery('');
      setAiResponse('');
    }
  };
  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setAiQuery('');
    setAiResponse('');
  };
  const getOptionLetter = (option: string) => {
    switch (option) {
      case 'Alternativa A':
        return 'A';
      case 'Alternativa B':
        return 'B';
      case 'Alternativa C':
        return 'C';
      case 'Alternativa D':
        return 'D';
      default:
        return '';
    }
  };
  const isCorrectAnswer = (questaoNumero: number, opcao: string) => {
    const questao = questoes.find(q => q.Numero === questaoNumero);
    return questao && questao['Resposta Correta'] === getOptionLetter(opcao);
  };
  const calculateScore = (): ScoreData => {
    let correct = 0;
    let answered = 0;
    let areaStats: Record<string, {
      correct: number;
      total: number;
      answered: number;
      themes: Set<string>;
    }> = {};
    questoes.forEach(questao => {
      const selectedOption = selectedAnswers[questao.Numero];
      if (!areaStats[questao.Área]) {
        areaStats[questao.Área] = {
          correct: 0,
          total: 0,
          answered: 0,
          themes: new Set()
        };
      }
      areaStats[questao.Área].total += 1;
      areaStats[questao.Área].themes.add(questao.Tema);
      if (selectedOption) {
        answered++;
        areaStats[questao.Área].answered += 1;
        if (isCorrectAnswer(questao.Numero, selectedOption)) {
          correct++;
          areaStats[questao.Área].correct += 1;
        }
      }
    });

    // Convert Set to Array for themes
    const finalAreaStats: Record<string, AreaStats> = {};
    Object.entries(areaStats).forEach(([area, data]) => {
      finalAreaStats[area] = {
        ...data,
        themes: Array.from(data.themes)
      };
    });
    return {
      correct,
      answered,
      total: questoes.length,
      percentage: answered > 0 ? Math.round(correct / answered * 100) : 0,
      areaStats: finalAreaStats
    };
  };
  const generateAIFeedback = async (score: ScoreData) => {
    setIsGeneratingFeedback(true);
    try {
      // Simular análise da IA baseada no desempenho
      await new Promise(resolve => setTimeout(resolve, 2000));
      const {
        correct,
        answered,
        areaStats
      } = score;
      const performance = answered > 0 ? correct / answered * 100 : 0;
      let feedback = `Baseado na sua performance de ${performance.toFixed(1)}% (${correct}/${answered} questões), aqui está minha análise:\n\n`;
      if (performance >= 75) {
        feedback += "🎉 **Excelente desempenho!** Você demonstra domínio sólido dos conceitos jurídicos.\n\n";
      } else if (performance >= 60) {
        feedback += "✅ **Bom desempenho!** Você está no caminho certo, mas há espaço para melhorias.\n\n";
      } else {
        feedback += "📚 **Foque nos estudos!** Identifiquei várias áreas que precisam de atenção.\n\n";
      }
      feedback += "**Análise por área:**\n";
      Object.entries(areaStats).forEach(([area, data]) => {
        const areaPercentage = data.answered > 0 ? data.correct / data.answered * 100 : 0;
        if (data.answered > 0) {
          feedback += `• ${area}: ${areaPercentage.toFixed(1)}% (${data.correct}/${data.answered})\n`;
        }
      });
      feedback += "\n**Recomendações de estudo:**\n";
      const weakAreas = Object.entries(areaStats).filter(([_, data]) => data.answered > 0 && data.correct / data.answered < 0.6).sort(([_, a], [__, b]) => a.correct / a.answered - b.correct / b.answered);
      if (weakAreas.length > 0) {
        feedback += `Priorize o estudo de: ${weakAreas.map(([area]) => area).join(', ')}.\n`;
        weakAreas.slice(0, 2).forEach(([area, data]) => {
          feedback += `\nPara ${area}, revise os temas: ${data.themes.slice(0, 3).join(', ')}.`;
        });
      } else {
        feedback += "Continue aprofundando seus conhecimentos em todas as áreas para manter o excelente nível!";
      }
      setAiFeedback(feedback);
    } catch (error) {
      console.error('Erro ao gerar feedback:', error);
      setAiFeedback('Não foi possível gerar o feedback personalizado no momento. Tente novamente mais tarde.');
    } finally {
      setIsGeneratingFeedback(false);
    }
  };
  const queryAI = async () => {
    if (!aiQuery.trim()) {
      toast({
        title: "Campo vazio",
        description: "Por favor, digite sua pergunta antes de enviar.",
        variant: "destructive"
      });
      return;
    }
    setIsQueryingAI(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const currentQuestion = filteredQuestoes[currentQuestionIndex];
      const response = `Baseado na sua pergunta sobre "${aiQuery}", posso explicar melhor:

Na área de ${currentQuestion.Área}, especificamente sobre ${currentQuestion.Tema}, é importante compreender os conceitos fundamentais.

Esta questão aborda aspectos essenciais da disciplina que são frequentemente cobrados no Exame de Ordem. A alternativa correta (${currentQuestion['Resposta Correta']}) está fundamentada nos princípios básicos da matéria.

Espero ter esclarecido sua dúvida. Se precisar de mais detalhes, fique à vontade para perguntar.`;
      setAiResponse(response);
    } catch (error) {
      console.error('Error querying AI:', error);
      toast({
        title: "Erro",
        description: "Não foi possível obter uma resposta da IA.",
        variant: "destructive"
      });
    } finally {
      setIsQueryingAI(false);
    }
  };
  const getUniqueAreas = () => {
    const areas = [...new Set(questoes.map(q => q.Área))].filter(area => area && area.trim() !== ''); // Filter out empty strings
    return areas.sort();
  };
  const getUniqueTemasForArea = () => {
    let filteredQuestions = questoes;
    if (selectedArea !== 'all') {
      filteredQuestions = questoes.filter(q => q.Área === selectedArea);
    }
    const temas = [...new Set(filteredQuestions.map(q => q.Tema))].filter(tema => tema && tema.trim() !== ''); // Filter out empty strings
    return temas.sort();
  };
  const renderQuestionNavigation = () => {
    const startQuestion = Math.max(0, currentQuestionIndex - 4);
    const endQuestion = Math.min(filteredQuestoes.length, startQuestion + 10);
    const visibleQuestions = filteredQuestoes.slice(startQuestion, endQuestion);
    return <div className="flex items-center justify-center gap-1 mb-4">
        <Button variant="ghost" size="sm" onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 10))} disabled={currentQuestionIndex === 0} className="h-7 w-7 p-0">
          <ChevronLeft className="h-3 w-3" />
        </Button>
        
        {visibleQuestions.map((questao, index) => {
        const globalIndex = startQuestion + index;
        const isAnswered = selectedAnswers[questao.Numero];
        const isCurrent = globalIndex === currentQuestionIndex;
        const isVerified = verifiedQuestions[questao.Numero];
        const isCorrect = isVerified && isAnswered && isCorrectAnswer(questao.Numero, isAnswered);
        return <button key={questao.Numero} onClick={() => goToQuestion(globalIndex)} className={cn("w-7 h-7 rounded-md text-xs font-medium transition-all duration-200", isCurrent ? "bg-[#8B5CF6] text-white shadow-md" : isVerified && isCorrect ? "bg-green-500 text-white" : isVerified && !isCorrect ? "bg-red-500 text-white" : isAnswered ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700")}>
              {globalIndex + 1}
            </button>;
      })}
        
        <Button variant="ghost" size="sm" onClick={() => setCurrentQuestionIndex(Math.min(filteredQuestoes.length - 1, currentQuestionIndex + 10))} disabled={currentQuestionIndex >= filteredQuestoes.length - 10} className="h-7 w-7 p-0">
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>;
  };
  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'sm':
        return {
          text: 'text-sm',
          heading: 'text-base'
        };
      case 'lg':
        return {
          text: 'text-lg',
          heading: 'text-xl'
        };
      default:
        return {
          text: 'text-base',
          heading: 'text-lg'
        };
    }
  };
  if (isLoading) {
    return <Layout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5CF6] mx-auto mb-4"></div>
            <h2 className="text-xl font-medium bg-gradient-to-r from-[#8B5CF6] to-[#9333EA] bg-clip-text text-transparent">
              Carregando exame...
            </h2>
          </div>
        </div>
      </Layout>;
  }
  ;
  if (showResults) {
    const score = calculateScore();
    return <Layout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 py-8">
          <div className="container mx-auto px-6 max-w-4xl">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-[#8B5CF6] to-[#9333EA] text-white rounded-t-lg">
                <h1 className="text-3xl font-bold text-center">
                  Resultado do Exame {numeroProva}
                </h1>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex flex-col items-center mb-8">
                  <div className="w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-r from-[#8B5CF6] to-[#9333EA] mb-4 shadow-lg">
                    <span className="text-3xl font-bold text-white">{score.percentage}%</span>
                  </div>
                  <p className="text-lg text-gray-700">
                    Você respondeu <span className="font-bold text-[#8B5CF6]">{score.answered}</span> de {score.total} questões
                  </p>
                  <p className="text-lg text-gray-700">
                    Acertou <span className="font-bold text-green-600">{score.correct}</span> das respondidas
                  </p>
                </div>
                
                <h2 className="text-xl font-semibold mb-4 text-[#8B5CF6]">Desempenho por Área</h2>
                <div className="space-y-4 mb-8">
                  {Object.entries(score.areaStats).map(([area, data]) => {
                  const percentage = data.answered > 0 ? Math.round(data.correct / data.answered * 100) : 0;
                  return <div key={area} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium text-gray-800">{area}</span>
                          <span className="text-[#8B5CF6] font-semibold">
                            {data.answered > 0 ? `${data.correct}/${data.answered} (${percentage}%)` : 'Não respondido'}
                          </span>
                        </div>
                        {data.answered > 0 && <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                            <div className={cn("h-3 rounded-full bg-gradient-to-r", percentage >= 70 ? "from-green-400 to-green-600" : percentage >= 50 ? "from-amber-400 to-amber-600" : "from-red-400 to-red-600")} style={{
                        width: `${percentage}%`
                      }}></div>
                          </div>}
                        <div className="text-sm text-gray-600">
                          Temas: {data.themes.join(', ')}
                        </div>
                      </div>;
                })}
                </div>

                {/* AI Feedback Section */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg mb-8">
                  <h2 className="text-xl font-semibold mb-4 text-[#8B5CF6] flex items-center gap-2">Feedback do Menthor</h2>
                  
                  {!aiFeedback && !isGeneratingFeedback && <Button onClick={() => generateAIFeedback(score)} className="bg-gradient-to-r from-[#8B5CF6] to-[#9333EA] hover:from-[#7C3AED] hover:to-[#8B5CF6] text-white">
                      Gerar Análise Personalizada
                    </Button>}
                  
                  {isGeneratingFeedback && <div className="flex items-center gap-2 text-[#8B5CF6]">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Gerando feedback personalizado...</span>
                    </div>}
                  
                  {aiFeedback && <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
                      <pre className="whitespace-pre-wrap text-gray-700 font-sans">{aiFeedback}</pre>
                    </div>}
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={() => navigate('/simulados')} className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar aos Simulados
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>;
  }
  if (filteredQuestoes.length === 0) {
    return <Layout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl text-gray-600">Nenhuma questão encontrada para o filtro selecionado</h2>
          </div>
        </div>
      </Layout>;
  }
  const currentQuestion = filteredQuestoes[currentQuestionIndex];
  const selectedOption = selectedAnswers[currentQuestion.Numero];
  const isVerified = verifiedQuestions[currentQuestion.Numero];
  const fontClasses = getFontSizeClasses();
  const opcoes = [{
    key: 'Alternativa A',
    value: currentQuestion['Alternativa A']
  }, {
    key: 'Alternativa B',
    value: currentQuestion['Alternativa B']
  }, {
    key: 'Alternativa C',
    value: currentQuestion['Alternativa C']
  }, {
    key: 'Alternativa D',
    value: currentQuestion['Alternativa D']
  }];
  return <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 relative">
        {/* Timer no canto superior direito */}
        <div className="fixed top-4 right-4 z-50">
          <ExamTimer initialTime={5 * 60 * 60} />
        </div>

        <div className="container mx-auto px-6 py-6 max-w-4xl">
          <div className="mb-4">
            
            
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#9333EA] bg-clip-text text-transparent">
                Exame {numeroProva}
              </h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>{questoes.length} questões</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>5 horas</span>
                  </div>
                </div>
                {/* Timer integrado no cabeçalho */}
                <ExamTimer initialTime={5 * 60 * 60} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-[#8B5CF6]" />
                <Select value={selectedArea} onValueChange={value => {
                setSelectedArea(value);
                setSelectedTema('all');
              }}>
                  <SelectTrigger className="w-48 border-[#8B5CF6]">
                    <SelectValue placeholder="Filtrar por área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as áreas</SelectItem>
                    {getUniqueAreas().map(area => <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              
              <Select value={selectedTema} onValueChange={setSelectedTema}>
                <SelectTrigger className="w-48 border-[#8B5CF6]">
                  <SelectValue placeholder="Filtrar por tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os temas</SelectItem>
                  {getUniqueTemasForArea().map(tema => <SelectItem key={tema} value={tema}>
                      {tema}
                    </SelectItem>)}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-600">Fonte:</span>
                <Button variant="outline" size="sm" onClick={() => setFontSize(fontSize === 'sm' ? 'sm' : fontSize === 'base' ? 'sm' : 'base')} disabled={fontSize === 'sm'} className="h-8 w-8 p-0">
                  <Minus className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setFontSize(fontSize === 'lg' ? 'lg' : fontSize === 'base' ? 'lg' : 'base')} disabled={fontSize === 'lg'} className="h-8 w-8 p-0">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-2">
              Questão {currentQuestionIndex + 1} de {filteredQuestoes.length}
              {(selectedArea !== 'all' || selectedTema !== 'all') && ' (filtrado)'}
            </div>

            {/* Question Navigation */}
            {renderQuestionNavigation()}
          </div>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-6">
            <CardHeader className="bg-gradient-to-r from-[#8B5CF6] to-[#9333EA] text-white">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">Questão {currentQuestionIndex + 1}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {currentQuestion.Área}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {currentQuestion.Tema}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6">
                <p className={cn("text-gray-800 leading-relaxed", fontClasses.heading)}>{currentQuestion.Enunciado}</p>
              </div>
              
              <div className="space-y-3 mb-6">
                {opcoes.map(opcao => {
                const isSelected = selectedOption === opcao.key;
                const isCorrect = isVerified && opcao.key === `Alternativa ${currentQuestion['Resposta Correta']}`;
                const isWrong = isVerified && isSelected && opcao.key !== `Alternativa ${currentQuestion['Resposta Correta']}`;
                return <button key={opcao.key} onClick={() => handleSelectOption(currentQuestion.Numero, opcao.key)} disabled={isVerified} className={cn("w-full text-left p-4 rounded-lg border-2 transition-all duration-200", fontClasses.text, isCorrect ? 'bg-green-50 border-green-500 text-green-800 shadow-lg' : isWrong ? 'bg-red-50 border-red-500 text-red-800 shadow-lg' : isSelected ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] text-[#8B5CF6] shadow-md' : 'hover:bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md', isVerified && 'cursor-not-allowed')}>
                      <span className="font-bold mr-3">
                        {getOptionLetter(opcao.key)})
                      </span>
                      {opcao.value}
                    </button>;
              })}
              </div>

              {selectedOption && !isVerified && <div className="flex justify-center mb-6">
                  <Button onClick={handleVerifyAnswer} className="bg-gradient-to-r from-[#8B5CF6] to-[#9333EA] hover:from-[#7C3AED] hover:to-[#8B5CF6] text-white shadow-lg px-8 py-3">
                    Verificar Resposta
                  </Button>
                </div>}

              <div className="flex justify-between items-center mb-6">
                <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
                
                <Button variant="outline" onClick={handleNextQuestion} disabled={currentQuestionIndex === filteredQuestoes.length - 1} className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white">
                  Próxima
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <div className="border-2 rounded-lg p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <h4 className="font-semibold mb-4 flex items-center gap-2 text-[#8B5CF6]">Pergunte ao Menthor</h4>
                
                {aiResponse && <div className="p-4 bg-white rounded-lg mb-4 border border-purple-200 shadow-sm">
                    <strong className="text-[#8B5CF6]">Menthor:</strong>
                    <br />
                    <span className="whitespace-pre-line text-gray-700">{aiResponse}</span>
                  </div>}
                
                <div className="space-y-3">
                  <Textarea value={aiQuery} onChange={e => setAiQuery(e.target.value)} placeholder="Digite sua dúvida sobre esta questão..." className="min-h-[80px] border-purple-200 focus:border-[#8B5CF6]" />
                  <Button onClick={queryAI} disabled={isQueryingAI || !aiQuery.trim()} className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#9333EA] hover:from-[#7C3AED] hover:to-[#8B5CF6] text-white shadow-lg">
                    {isQueryingAI ? <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Consultando Menthor...
                      </> : <>
                        <Send className="w-4 h-4 mr-2" />
                        Perguntar ao Menthor
                      </>}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Botão Encerrar Simulado posicionado abaixo da caixa e alinhado à direita */}
          <div className="flex justify-end mb-8">
            <Button onClick={() => setShowResults(true)} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg">
              Encerrar Simulado
            </Button>
          </div>
        </div>
      </div>
    </Layout>;
};

export default ProvaView;
