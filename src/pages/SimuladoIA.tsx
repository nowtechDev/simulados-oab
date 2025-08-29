import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import ExamTimer from '@/components/simulator/ExamTimer';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, RefreshCw, Send, ArrowRight, CheckCircle, XCircle, AlertTriangle, BookOpen, FileText, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeWithOpenAI } from '@/services/openai';
import ResultadoAvaliacaoView from '@/components/simulador/ResultadoAvaliacaoView';
import QuestionarioSimulado from '@/components/simulados/QuestionarioSimulado';
import { OpenAIAnalysisResult } from '@/types/simulador';
import { simuladoIAService, QuestaoSimulado } from '@/services/simuladoIAService';
import { correcaoIAService, CorrecaoCompleta } from '@/services/correcaoIAService';
import { useSimuladoData } from '@/hooks/useSimuladoData';

type SimuladoQuestion = {
  statement: string;
  questionA: string;
  questionB: string;
  isLoading: boolean;
  respostaA: string;
  respostaB: string;
};

type FeedbackResult = {
  nota: number;
  acertos: string[];
  errosOuAcertosParciais: string[];
  feedbackGeral: string;
  pontosFracos: string[];
};

const SimuladoIA = () => {
  const [areaJuridica, setAreaJuridica] = useState<string>('');
  const [peca, setPeca] = useState<string>('');
  const [pecaPersonalizada, setPecaPersonalizada] = useState<string>('');
  const [assunto, setAssunto] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPeca, setIsGeneratingPeca] = useState(false);
  const [pecaGerada, setPecaGerada] = useState<string>('');
  const [questions, setQuestions] = useState<SimuladoQuestion[]>([]);
  const [questoesIA, setQuestoesIA] = useState<QuestaoSimulado[]>([]);
  const [isCustomPeca, setIsCustomPeca] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [showNovoSimulado, setShowNovoSimulado] = useState(false);
  const [isGeneratingNovoSimulado, setIsGeneratingNovoSimulado] = useState(false);
  const [userResponse, setUserResponse] = useState('');
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [showResultadoAnaliseIA, setShowResultadoAnaliseIA] = useState(false);
  const [analiseCompleta, setAnaliseCompleta] = useState<OpenAIAnalysisResult | null>(null);
  const [showQuestionario, setShowQuestionario] = useState(false);
  const [showCorrecao, setShowCorrecao] = useState(false);
  const [correcaoResultado, setCorrecaoResultado] = useState<CorrecaoCompleta | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { segundaFaseAreas } = useSimuladoData();

  // Opções de peças por área
  const pecasPorArea: Record<string, string[]> = {
    'direito-administrativo': [
      'Ação Ordinária', 'Mandado de Segurança', 'Contestação', 'Agravo de Instrumento',
      'Apelação', 'Recurso Ordinário em MS', 'Ação Popular', 'Ação Anulatória',
      'Apelação em MS', 'Ação Civil Pública', 'Ação de Responsabilidade Civil',
      'Ação de Desapropriação Indireta'
    ],
    'direito-constitucional': [
      'Mandado de Segurança', 'Ação Direta de Inconstitucionalidade (ADI)', 'Ação Popular',
      'Recurso Ordinário Constitucional', 'Recurso Extraordinário', 'Mandado de Injunção Coletivo',
      'Ação Civil Pública', 'ADPF', 'ADO', 'Habeas Data', 'Recurso Extraordinário em ADI',
      'Ação Condenatória', 'Apelação em MS', 'Mandado de Segurança Coletivo', 'Reclamação Constitucional'
    ],
    'direito-civil': [
      'Apelação', 'Agravo de Instrumento', 'Embargos de Terceiro', 'Contestação',
      'Ação de Alimentos', 'Ação de Consignação em Pagamento', 'Recurso Especial',
      'Embargos à Execução', 'Ação Indenizatória', 'Réplica', 'Ação de Conhecimento com Tutela',
      'Interdição com Tutela', 'Ação de Despejo', 'Usucapião Especial Urbano',
      'Declaratória de Inexistência de Débito', 'Obrigação de Fazer', 'Petição Inicial',
      'Ação Rescisória', 'Reintegração de Posse'
    ],
    'direito-empresarial': [
      'Agravo de Instrumento', 'Ação de Execução por Quantia Certa', 'Ação de Dissolução Parcial',
      'Ação Renovatória', 'Habilitação de Créditos Retardatária', 'Impugnação à Relação de Credores',
      'Ação de Falência', 'Contestação', 'Ação Monitória', 'Recuperação Judicial', 'Apelação',
      'Extinção das Obrigações do Falido', 'Prestação de Contas', 'Recurso Especial',
      'Ação de Restituição', 'Ação Ordinária', 'Embargos à Execução', 'Embargos de Terceiro',
      'Ação Revocatória', 'Resolução de Sociedade', 'Contestação à Falência', 'Ação de Cobrança',
      'Desconsideração da PJ', 'Execução de Título Judicial', 'Obrigação de Não Fazer',
      'Cancelamento de Protesto'
    ],
    'direito-penal': [
      'Recurso de Apelação – Penal', 'Memoriais', 'Recurso em Sentido Estrito (RESE)',
      'Resposta à Acusação', 'Agravo em Execução', 'Contrarrazões de Apelação',
      'Relaxamento de Prisão', 'Queixa-Crime', 'Revisão Criminal', 'Resposta à Execução'
    ],
    'direito-trabalho': [
      'Contestação', 'Recurso Ordinário', 'Petição Inicial – Reclamação Trabalhista',
      'Ação de Consignação em Pagamento', 'Contestação e Reconvenção', 'Embargos à Execução Trabalhista'
    ],
    'direito-tributario': [
      'Mandado de Segurança', 'Recurso de Apelação', 'Agravo de Instrumento',
      'Embargos à Execução Fiscal', 'Ação de Repetição de Indébito', 'Ação Anulatória',
      'Exceção de Pré-Executividade', 'Declaratória de Inexistência de Relação Jurídica',
      'Recurso Inominado', 'Ação de Consignação em Pagamento', 'Agravo – Tributário',
      'Ação Declaratória com Repetição de Indébito'
    ]
  };

  const areaLabels: Record<string, string> = {
    'direito-administrativo': 'Direito Administrativo',
    'direito-constitucional': 'Direito Constitucional',
    'direito-civil': 'Direito Civil',
    'direito-empresarial': 'Direito Empresarial',
    'direito-penal': 'Direito Penal',
    'direito-trabalho': 'Direito do Trabalho',
    'direito-tributario': 'Direito Tributário'
  };

  const pecasOptions = areaJuridica ? [...pecasPorArea[areaJuridica], 'Outro (especificar)'] : [];

  const handlePecaChange = (value: string) => {
    setPeca(value);
    setIsCustomPeca(value === 'Outro (especificar)');
    if (value !== 'Outro (especificar)') {
      setPecaPersonalizada('');
    }
  };

  const generateSimulado = async () => {
    // Resetar o erro da IA
    setAiError(null);
    
    if (!areaJuridica) {
      toast({
        title: "Área necessária",
        description: "Por favor, selecione uma área jurídica",
        variant: "destructive"
      });
      return;
    }

    const selectedPeca = isCustomPeca ? pecaPersonalizada : peca;
    
    if (!selectedPeca) {
      toast({
        title: "Peça necessária",
        description: "Por favor, selecione ou especifique uma peça processual",
        variant: "destructive"
      });
      return;
    }

    console.log('🚀 === INICIANDO GERAÇÃO DE SIMULADO ===');
    console.log('📋 Parâmetros selecionados:', {
      areaJuridica,
      selectedPeca,
      assunto: assunto || 'Não especificado'
    });

    setIsLoading(true);
    
    try {
      // Buscar a área correspondente no banco de dados
      const areaEncontrada = segundaFaseAreas.find(area => 
        area.slug === areaJuridica || area.name.toLowerCase().includes(areaJuridica.replace('-', ' '))
      );

      if (!areaEncontrada) {
        console.error('❌ Área não encontrada:', {
          areaJuridica,
          areasDisponiveis: segundaFaseAreas.map(a => ({ id: a.id, name: a.name, slug: a.slug }))
        });
        throw new Error('Área jurídica não encontrada no banco de dados');
      }

      console.log('✅ Área encontrada:', {
        id: areaEncontrada.id,
        name: areaEncontrada.name,
        slug: areaEncontrada.slug
      });

      // Usar o serviço de simulado IA para gerar questões
      console.log('🤖 Chamando simuladoIAService.gerarSimuladoComIA...');
      
      try {
        const questoesGeradas = await simuladoIAService.gerarSimuladoComIA({
          areaId: areaEncontrada.id,
          pecaProcessual: selectedPeca,
          assunto: assunto || undefined,
          numeroQuestoes: 4
        });

        console.log('📊 Resultado da geração:', {
          questoesGeradas: questoesGeradas.length,
          questoes: questoesGeradas.map(q => ({
            id: q.id,
            tipo: q.tipo,
            numero_questao: q.numero_questao
          }))
        });

        if (questoesGeradas.length === 0) {
          throw new Error('Nenhuma questão foi gerada para os parâmetros informados');
        }

        setQuestoesIA(questoesGeradas);
        setShowQuestionario(true);
        
        toast({
          title: "Simulado gerado!",
          description: `${questoesGeradas.length} questões foram geradas com sucesso pelo agente IA Civil.`,
        });

        console.log('✅ === SIMULADO GERADO E EXIBIDO COM SUCESSO ===');
      } catch (aiError: any) {
        // Se houver erro específico da IA, exibir como erro crítico
        console.error('❌ Erro do agente IA:', aiError);
        setAiError(aiError.message || 'Erro desconhecido do agente IA');
        throw new Error(`Erro do agente IA: ${aiError.message}`);
      }

    } catch (error: any) {
      console.error('❌ === ERRO CRÍTICO NA GERAÇÃO DO SIMULADO ===');
      console.error('Mensagem do erro:', error.message);
      console.error('Stack trace:', error.stack);
      console.error('Erro completo:', error);
      
      toast({
        title: "Erro na geração do simulado",
        description: error.message || "Ocorreu um erro ao gerar o simulado. Verifique sua conexão e tente novamente.",
        variant: "destructive"
      });  
      
      // Garantir que o erro seja armazenado
      if (!aiError) {
        setAiError(error.message || 'Erro desconhecido ao gerar o simulado');
      }
      
      setIsLoading(false);
      return; // Não prosseguir com o simulado
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRespostas = async (respostas: Record<string, string>) => {
    setIsSubmitting(true);
    
    try {
      console.log('Iniciando correção com IA Civil Corretor...');
      
      // Usar o serviço de correção IA
      const resultadoCorrecao = await correcaoIAService.corrigirRespostas(questoesIA, respostas);
      
      setCorrecaoResultado(resultadoCorrecao);
      setShowCorrecao(true);
      setShowQuestionario(false);
      
      toast({
        title: "Correção concluída!",
        description: `Sua nota foi ${resultadoCorrecao.notaGeral.toFixed(1)}/10`,
      });
      
    } catch (error: any) {
      console.error("Erro ao submeter respostas:", error);
      toast({
        title: "Erro na correção",
        description: error.message || "Ocorreu um erro ao corrigir as respostas. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoltarSimulado = () => {
    setShowCorrecao(false);
    setShowQuestionario(true);
  };

  const handleNovoSimulado = () => {
    setShowCorrecao(false);
    setShowFeedback(false);
    setFeedback(null);
    setAnaliseCompleta(null);
    setCorrecaoResultado(null);
    setQuestions([]);
    setQuestoesIA([]);
    setPecaGerada('');
    setUserResponse('');
    setShowQuestionario(false);
  };

  // Se estiver mostrando o questionário, renderizar o componente específico
  if (showQuestionario) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-10">
          <QuestionarioSimulado 
            questoes={questoesIA}
            onSubmitRespostas={handleSubmitRespostas}
            isLoading={isSubmitting}
          />
        </div>
      </Layout>
    );
  }

  // Se mostrando feedback, renderizar resultado
  if (showFeedback && feedback) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-10">
          <div className="space-y-6">
            <Card className="overflow-hidden border-[#F8E6FF]/30 shadow-md">
              <CardHeader className="bg-gradient-to-r from-[#F8E6FF]/50 to-[#F8E6FF]/30 border-b border-[#F8E6FF]/20">
                <CardTitle className="text-[#4F1964] flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Resultado da Avaliação
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-36 h-36 rounded-full 
                    ${feedback?.nota >= 7 ? 'bg-green-50 border-green-300' : 
                      feedback?.nota >= 5 ? 'bg-amber-50 border-amber-300' : 
                      'bg-red-50 border-red-300'} 
                    border-4 mb-4 transition-all duration-300`}>
                    <span className={`text-5xl font-bold 
                      ${feedback?.nota >= 7 ? 'text-green-600' : 
                        feedback?.nota >= 5 ? 'text-amber-600' : 
                        'text-red-600'}`}>
                      {feedback?.nota.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-gray-600">Seu desempenho no simulado</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-green-50 p-5 rounded-lg border border-green-200 shadow-sm">
                    <h3 className="font-semibold flex items-center gap-2 text-green-800 mb-3">
                      <CheckCircle className="h-5 w-5" />
                      Pontos Fortes
                    </h3>
                    <ul className="space-y-2">
                      {feedback?.acertos.map((acerto, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{acerto}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-amber-50 p-5 rounded-lg border border-amber-200 shadow-sm">
                    <h3 className="font-semibold flex items-center gap-2 text-amber-800 mb-3">
                      <AlertTriangle className="h-5 w-5" />
                      Pontos para Melhorar
                    </h3>
                    <ul className="space-y-2">
                      {feedback?.errosOuAcertosParciais.map((erro, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{erro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="bg-[#F8E6FF]/20 p-6 rounded-lg mb-8 border border-[#F8E6FF]/40 shadow-sm">
                  <h3 className="font-semibold text-[#4F1964] mb-3 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Feedback Geral
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{feedback?.feedbackGeral}</p>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={handleNovoSimulado}
                    className="bg-gradient-to-r from-[#4F1964] to-[#9b59b6] hover:opacity-90 transition-all duration-200"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Novo Simulado
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  // Se mostrando correção IA, renderizar resultado
  if (showCorrecao && correcaoResultado) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-10">
          <div className="space-y-6">
            <Card className="overflow-hidden border-[#F8E6FF]/30 shadow-md">
              <CardHeader className="bg-gradient-to-r from-[#F8E6FF]/50 to-[#F8E6FF]/30 border-b border-[#F8E6FF]/20">
                <CardTitle className="text-[#4F1964] flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Resultado da Correção IA
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-36 h-36 rounded-full 
                    ${correcaoResultado.notaGeral >= 7 ? 'bg-green-50 border-green-300' : 
                      correcaoResultado.notaGeral >= 5 ? 'bg-amber-50 border-amber-300' : 
                      'bg-red-50 border-red-300'} 
                    border-4 mb-4 transition-all duration-300`}>
                    <span className={`text-5xl font-bold 
                      ${correcaoResultado.notaGeral >= 7 ? 'text-green-600' : 
                        correcaoResultado.notaGeral >= 5 ? 'text-amber-600' : 
                        'text-red-600'}`}>
                      {correcaoResultado.notaGeral.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    {correcaoResultado.pontosObtidos.toFixed(1)} de {correcaoResultado.totalPontos} pontos
                  </p>
                </div>
                
                <div className="bg-[#F8E6FF]/20 p-6 rounded-lg mb-8 border border-[#F8E6FF]/40 shadow-sm">
                  <h3 className="font-semibold text-[#4F1964] mb-3 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Feedback Geral
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{correcaoResultado.feedbackGeral}</p>
                </div>

                {/* Detalhamento por questão */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-[#4F1964]">Correção Detalhada por Questão</h3>
                  
                  {correcaoResultado.resultados.map((resultado, index) => {
                    const questao = questoesIA.find(q => q.id === resultado.questaoId);
                    if (!questao) return null;

                    return (
                      <Card key={resultado.questaoId} className="border-l-4 border-l-[#9b59b6]">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center justify-between">
                            <span>Questão {index + 1}</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold
                              ${resultado.nota >= 3 ? 'bg-green-100 text-green-800' : 
                                resultado.nota >= 1.5 ? 'bg-amber-100 text-amber-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {resultado.nota.toFixed(1)} pontos
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-md">
                            <h4 className="font-medium text-gray-800 mb-2">Feedback:</h4>
                            <p className="text-gray-700 text-sm">{resultado.feedbackDetalhado}</p>
                          </div>
                          
                          {resultado.pontosAtendidos.length > 0 && (
                            <div className="bg-green-50 p-4 rounded-md">
                              <h4 className="font-medium text-green-800 mb-2 flex items-center">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Pontos Atendidos
                              </h4>
                              <ul className="text-sm text-green-700 space-y-1">
                                {resultado.pontosAtendidos.map((ponto, i) => (
                                  <li key={i} className="flex items-start">
                                    <CheckCircle className="h-3 w-3 mt-1 mr-2 flex-shrink-0" />
                                    {ponto}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {resultado.pontosFaltantes.length > 0 && (
                            <div className="bg-red-50 p-4 rounded-md">
                              <h4 className="font-medium text-red-800 mb-2 flex items-center">
                                <XCircle className="h-4 w-4 mr-2" />
                                Pontos Não Atendidos
                              </h4>
                              <ul className="text-sm text-red-700 space-y-1">
                                {resultado.pontosFaltantes.map((ponto, i) => (
                                  <li key={i} className="flex items-start">
                                    <XCircle className="h-3 w-3 mt-1 mr-2 flex-shrink-0" />
                                    {ponto}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {resultado.sugestoesMelhoria.length > 0 && (
                            <div className="bg-blue-50 p-4 rounded-md">
                              <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Sugestões de Melhoria
                              </h4>
                              <ul className="text-sm text-blue-700 space-y-1">
                                {resultado.sugestoesMelhoria.map((sugestao, i) => (
                                  <li key={i} className="flex items-start">
                                    <ArrowRight className="h-3 w-3 mt-1 mr-2 flex-shrink-0" />
                                    {sugestao}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="flex gap-4 justify-center mt-8">
                  <Button 
                    onClick={handleNovoSimulado}
                    className="bg-gradient-to-r from-[#4F1964] to-[#9b59b6] hover:opacity-90 transition-all duration-200"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Novo Simulado
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="bg-[#F8E6FF] px-4 py-1.5 rounded-full text-sm font-medium text-[#4F1964] mb-4 inline-block">
              Preparação Personalizada
            </span>
            <h1 className="text-3xl font-bold text-[#4F1964] mb-4">Simulado da 2ª Fase – IA</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Gere questões personalizadas para a segunda fase da OAB adaptadas ao seu nível.
              Escolha a área, tipo de peça e assunto para um treinamento focado usando inteligência artificial.
            </p>
          </div>
          
          {/* Mostrar erro da IA se existir */}
          {aiError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-red-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Erro do Agente IA
              </h2>
              <div className="bg-white p-4 rounded-md border border-red-100 mb-4">
                <p className="text-gray-800 whitespace-pre-wrap font-mono text-sm">{aiError}</p>
              </div>
              <p className="text-red-600 text-sm">
                O agente IA não conseguiu gerar o simulado. Por favor, tente novamente com parâmetros diferentes ou contate o suporte.
              </p>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setAiError(null)}
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
          
          <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-[#F8E6FF]/30">
            <h2 className="text-lg font-semibold text-[#4F1964] mb-4 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-[#9b59b6]" />
              Configure seu Simulado
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <BookOpen className="h-4 w-4 mr-1 text-[#9b59b6]" />
                  Área da Prova
                </label>
                <Select value={areaJuridica} onValueChange={setAreaJuridica}>
                  <SelectTrigger className="border-[#F8E6FF]/60 focus:ring-[#4F1964]/20">
                    <SelectValue placeholder="Selecione uma área" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(areaLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <FileText className="h-4 w-4 mr-1 text-[#9b59b6]" />
                  Peça Processual
                </label>
                <Select 
                  value={peca} 
                  onValueChange={handlePecaChange}
                  disabled={!areaJuridica}
                >
                  <SelectTrigger className="border-[#F8E6FF]/60 focus:ring-[#4F1964]/20">
                    <SelectValue placeholder="Selecione uma peça" />
                  </SelectTrigger>
                  <SelectContent>
                    {pecasOptions.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {isCustomPeca && (
                  <Input
                    className="mt-2 border-[#F8E6FF]/60 focus:ring-[#4F1964]/20"
                    placeholder="Digite o nome da peça"
                    value={pecaPersonalizada}
                    onChange={(e) => setPecaPersonalizada(e.target.value)}
                  />
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-1">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <Sparkles className="h-4 w-4 mr-1 text-[#9b59b6]" />
                    Assunto (opcional)
                  </label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span><HelpCircle className="h-4 w-4 text-gray-400" /></span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[220px] text-sm">
                          Especifique um assunto para direcionar o conteúdo do simulado.
                          Deixe em branco para um conteúdo geral sobre a peça escolhida.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  placeholder="Ex: Contratos, Sucessões, etc."
                  value={assunto}
                  onChange={(e) => setAssunto(e.target.value)}
                  className="border-[#F8E6FF]/60 focus:ring-[#4F1964]/20"
                />
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                className="w-full sm:w-auto bg-gradient-to-r from-[#4F1964] to-[#9b59b6] hover:opacity-90 transition-all duration-200 shadow-md"
                onClick={generateSimulado}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
                    Gerando Simulado...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Gerar Simulado
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="fixed top-24 right-8 z-10">
        <ExamTimer initialTime={5 * 60 * 60} isStarted={timerStarted} />
      </div>
    </Layout>
  );
};

export default SimuladoIA;
