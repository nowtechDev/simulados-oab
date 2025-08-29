import { motion } from 'framer-motion';
import { ArrowLeft, Download, CheckCircle, AlertCircle, HelpCircle, FileText, BarChart, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Peca } from '@/types/simulador';
import { type OpenAIAnalysisResult } from '@/types/simulador';
import { Badge } from '@/components/ui/badge';
import ScoringTable from '@/components/simulador/ScoringTable';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { gerarGabaritoCompleto } from '@/services/openai';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface CorrecaoViewProps {
  peca: Peca;
  resposta: string;
  analiseIA: OpenAIAnalysisResult | string | null;
  onVoltarRedacao: () => void;
  onReiniciar: () => void;
  onDownloadResposta: () => void;
  respostasQuestoes?: Record<number, string>;
}

const CorrecaoView = ({
  peca,
  resposta,
  analiseIA,
  onVoltarRedacao,
  onReiniciar,
  onDownloadResposta,
  respostasQuestoes = {}
}: CorrecaoViewProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('resultados');
  const [isLoadingGabarito, setIsLoadingGabarito] = useState(false);
  const [gabarito, setGabarito] = useState<{ pecaProcessual: string; questoesRespostas: Record<number, string> } | null>(null);

  // Handle loading the answer key from the AI
  const handleLoadGabarito = async () => {
    setIsLoadingGabarito(true);
    try {
      console.log("CorrecaoView: Iniciando geração de gabarito para", peca.area);
      
      // Verificar configuração da API
      const apiKey = localStorage.getItem('openai-api-key');
      if (!apiKey || apiKey.trim() === '') {
        console.error("CorrecaoView: Chave da API OpenAI não configurada");
        toast({
          title: "Configuração necessária",
          description: "Por favor, configure sua chave da API da OpenAI nas configurações antes de gerar o gabarito.",
          variant: "destructive",
        });
        setIsLoadingGabarito(false);
        return;
      }
      
      const result = await gerarGabaritoCompleto(peca);
      console.log("CorrecaoView: Gabarito gerado com sucesso", {
        temPecaProcessual: !!result.pecaProcessual,
        numQuestoesRespondidas: Object.keys(result.questoesRespostas || {}).length
      });
      
      if (!result.pecaProcessual || result.pecaProcessual.length < 100) {
        console.warn("CorrecaoView: Gabarito pode estar incompleto - peça processual muito curta ou vazia");
        toast({
          title: "Atenção",
          description: "O gabarito parece estar incompleto. Tente novamente ou verifique sua conexão.",
          variant: "default",
        });
      }
      
      setGabarito(result);
      setActiveTab('gabarito');
    } catch (error) {
      console.error("CorrecaoView: Erro ao gerar gabarito:", error);
      toast({
        title: "Erro ao gerar gabarito",
        description: "Não foi possível gerar o gabarito. Verifique sua conexão e a chave da API.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingGabarito(false);
    }
  };

  // Process the AI analysis result
  const processAnalysis = () => {
    if (!analiseIA) {
      console.warn("CorrecaoView: Análise da IA não disponível (null)");
      toast({
        title: "Atenção",
        description: "Não foi possível obter a análise completa. Verifique sua conexão e a chave da API.",
        variant: "default",
      });
      return {
        pontuacao: 0,
        comentarioGeral: "Não foi possível analisar a resposta. Verifique sua conexão com a internet e se a chave da API da OpenAI está configurada corretamente.",
        acertos: [],
        erros: [],
        sugestoes: [],
        tabelaPontuacao: [],
        questoesDissertativas: {}
      };
    }

    if (typeof analiseIA === 'string') {
      console.warn("CorrecaoView: Análise da IA retornou como string em vez de objeto estruturado", analiseIA);
      // Se a análise for uma string, provavelmente é uma mensagem de erro
      if (analiseIA.includes("API key") || analiseIA.includes("chave")) {
        toast({
          title: "Configuração necessária",
          description: "Por favor, configure sua chave da API da OpenAI nas configurações.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Aviso",
          description: "A análise completa não pôde ser gerada. Mostrando resultado parcial.",
          variant: "default",
        });
      }
      return {
        pontuacao: 0,
        comentarioGeral: analiseIA,
        acertos: [],
        erros: [],
        sugestoes: [],
        tabelaPontuacao: [],
        questoesDissertativas: {}
      };
    }

    console.log("CorrecaoView: Análise da IA processada com sucesso", {
      pontuacao: analiseIA.pontuacao,
      totalQuestoes: Object.keys(analiseIA.questoesDissertativas || {}).length
    });
    return analiseIA;
  };

  const analysis = processAnalysis();
  
  // Calculate total points from the analysis
  const totalEssayPoints = peca.questoes && peca.questoes.filter(q => q.isEssay).length > 0
    ? Object.values(analysis.questoesDissertativas || {}).reduce((sum, q) => sum + q.pontuacao, 0)
    : 0;

  // Format the essay question points into a table-friendly format
  const formatQuestionsTable = () => {
    if (!peca.questoes || !analysis.questoesDissertativas) return [];

    return peca.questoes
      .filter(q => q.isEssay)
      .map(q => {
        const qAnalysis = analysis.questoesDissertativas?.[q.id];
        const totalPoints = (q.pointsA || 0) + (q.pointsB || 0);
        return {
          item: `Questão ${q.title || q.id}: ${q.text.substring(0, 50)}...`,
          valor: totalPoints,
          obtido: qAnalysis?.pontuacao || 0
        };
      });
  };

  // Format user's essay answers for display
  const formatUserEssayAnswer = (questionId: number) => {
    const answer = respostasQuestoes[questionId] || '';
    const parts = answer.split('===PART_SEPARATOR===');
    
    return {
      letterA: parts[0] || 'Não respondida',
      letterB: parts[1] || 'Não respondida'
    };
  };

  // Format the gabarito answers for display
  const formatGabaritoAnswer = (questionId: number) => {
    if (!gabarito || !gabarito.questoesRespostas[questionId]) {
      return { letterA: '', letterB: '' };
    }
    
    const answer = gabarito.questoesRespostas[questionId] || '';
    const parts = answer.split('===PART_SEPARATOR===');
    
    return {
      letterA: parts[0] || '',
      letterB: parts[1] || ''
    };
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }} 
      className="glass-panel p-0 overflow-hidden rounded-lg border border-gray-200 shadow-sm"
    >
      {/* Header with exam details and score */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-5">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold mb-1">
              {peca.numero || "Exame de Ordem Unificado"}
            </h2>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-white/20 border-none text-white hover:bg-white/30">
                {peca.area}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 border-none text-white hover:bg-white/30">
                {peca.tipo}
              </Badge>
              <Badge variant="secondary" className="bg-green-500/80 border-none text-white hover:bg-green-500/90">
                Corrigido por IA Civil Corretor
              </Badge>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold">
              {(analysis.pontuacao + totalEssayPoints).toFixed(1)}/10.0
            </div>
            <div className="text-sm opacity-80">
              Peça: {analysis.pontuacao.toFixed(1)}/5.0 | Questões: {totalEssayPoints.toFixed(1)}/5.0
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="resultados" className="flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              Resultados
            </TabsTrigger>
            <TabsTrigger value="resposta" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Sua Resposta
            </TabsTrigger>
            <TabsTrigger value="gabarito" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Gabarito
            </TabsTrigger>
          </TabsList>
          
          {/* Results Tab */}
          <TabsContent value="resultados">
            <div className="space-y-6">
              {/* Main analysis card */}
              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <Bot className="w-5 h-5 mr-2 text-purple-600" />
                  Análise da Peça Processual pelo IA Civil Corretor
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <h4 className="font-medium">Pontos Positivos</h4>
                    </div>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {analysis.acertos.map((item, index) => (
                        <li key={index} className="text-gray-700">{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                      <h4 className="font-medium">Pontos de Atenção</h4>
                    </div>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {analysis.erros.map((item, index) => (
                        <li key={index} className="text-gray-700">{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <HelpCircle className="w-5 h-5 text-amber-600 mr-2" />
                      <h4 className="font-medium">Sugestões</h4>
                    </div>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {analysis.sugestoes.map((item, index) => (
                        <li key={index} className="text-gray-700">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Comentário Geral</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{analysis.comentarioGeral}</p>
                </div>
              </div>
              
              {/* Scoring table */}
              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Tabela de Pontuação da Peça
                </h3>
                
                {analysis.tabelaPontuacao && analysis.tabelaPontuacao.length > 0 ? (
                  <ScoringTable items={analysis.tabelaPontuacao} showObtained maxTotal={5.0} />
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Tabela de pontuação não disponível para esta peça.
                  </div>
                )}
              </div>
              
              {/* Essay questions analysis */}
              {peca.questoes && peca.questoes.filter(q => q.isEssay).length > 0 && (
                <div className="bg-white p-5 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                    <Bot className="w-5 h-5 mr-2 text-purple-600" />
                    Análise das Questões Dissertativas pelo IA Civil Corretor
                  </h3>
                  
                  {/* Scoring table for all questions */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-3">Pontuação por Questão</h4>
                    <ScoringTable items={formatQuestionsTable()} showObtained maxTotal={5.0} />
                  </div>
                  
                  {/* Individual question analysis */}
                  <Accordion type="single" collapsible className="w-full">
                    {peca.questoes.filter(q => q.isEssay).map((question, index) => {
                      const qAnalysis = analysis.questoesDissertativas?.[question.id];
                      return (
                        <AccordionItem key={question.id} value={`question-${question.id}`}>
                          <AccordionTrigger className="hover:bg-gray-50 px-4">
                            <div className="flex items-center">
                              <span className="mr-2">Questão {question.title || index + 1}</span>
                              {qAnalysis && (
                                <Badge variant={qAnalysis.pontuacao > (question.pointsA || 0) + (question.pointsB || 0) * 0.7 ? "success" : "secondary"}>
                                  {qAnalysis.pontuacao.toFixed(2)} pts
                                </Badge>
                              )}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pt-2 pb-4">
                            {qAnalysis ? (
                              <div className="space-y-3">
                                <div className="text-sm text-gray-700 border-l-4 border-blue-500 pl-3 py-1">
                                  <strong>Comentário:</strong> {qAnalysis.comentario}
                                </div>
                                
                                <div>
                                  <strong className="text-sm text-gray-600">Itens Identificados:</strong>
                                  <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                                    {qAnalysis.itensIdentificados.map((item, i) => (
                                      <li key={i}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div>
                                  <strong className="text-sm text-gray-600">Itens Faltantes:</strong>
                                  <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                                    {qAnalysis.itensFaltantes.map((item, i) => (
                                      <li key={i}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            ) : (
                              <div className="text-gray-500 text-sm">
                                Análise não disponível para esta questão.
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* User's answer tab */}
          <TabsContent value="resposta">
            <div className="space-y-6">
              {/* Piece */}
              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Sua Peça Processual
                </h3>
                <div className="whitespace-pre-line font-mono text-sm bg-gray-50 p-4 rounded border border-gray-200 overflow-auto max-h-[400px]">
                  {resposta || "Peça não fornecida."}
                </div>
              </div>
              
              {/* Essay questions */}
              {peca.questoes && peca.questoes.filter(q => q.isEssay).length > 0 && (
                <div className="bg-white p-5 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Suas Respostas às Questões Dissertativas
                  </h3>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {peca.questoes.filter(q => q.isEssay).map((question, index) => {
                      const userAnswer = formatUserEssayAnswer(question.id);
                      return (
                        <AccordionItem key={question.id} value={`user-question-${question.id}`}>
                          <AccordionTrigger className="hover:bg-gray-50 px-4">
                            Questão {question.title || index + 1}
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pt-2 pb-4">
                            <div className="text-sm text-gray-700 mb-3 whitespace-pre-line">
                              {question.text}
                            </div>
                            
                            <div className="mb-4">
                              <h5 className="font-medium text-purple-700 mb-2">
                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md">Letra A</span>
                              </h5>
                              <div className="whitespace-pre-line font-mono text-sm bg-gray-50 p-3 rounded border border-gray-200">
                                {userAnswer.letterA}
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-purple-700 mb-2">
                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md">Letra B</span>
                              </h5>
                              <div className="whitespace-pre-line font-mono text-sm bg-gray-50 p-3 rounded border border-gray-200">
                                {userAnswer.letterB}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Answer key tab */}
          <TabsContent value="gabarito">
            {gabarito ? (
              <div className="space-y-6">
                {/* Model piece */}
                <div className="bg-white p-5 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Modelo de Peça Processual
                  </h3>
                  <div className="whitespace-pre-line font-mono text-sm bg-gray-50 p-4 rounded border border-gray-200 overflow-auto max-h-[400px]">
                    {gabarito.pecaProcessual || "Gabarito não disponível."}
                  </div>
                </div>
                
                {/* Model essay answers */}
                {peca.questoes && peca.questoes.filter(q => q.isEssay).length > 0 && (
                  <div className="bg-white p-5 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Gabarito das Questões Dissertativas
                    </h3>
                    
                    <Accordion type="single" collapsible className="w-full">
                      {peca.questoes.filter(q => q.isEssay).map((question, index) => {
                        const gabaritoAnswer = formatGabaritoAnswer(question.id);
                        return (
                          <AccordionItem key={question.id} value={`gabarito-question-${question.id}`}>
                            <AccordionTrigger className="hover:bg-gray-50 px-4">
                              Questão {question.title || index + 1}
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pt-2 pb-4">
                              <div className="text-sm text-gray-700 mb-3 whitespace-pre-line">
                                {question.text}
                              </div>
                              
                              <div className="mb-4">
                                <h5 className="font-medium text-purple-700 mb-2">
                                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md">Letra A</span>
                                </h5>
                                <div className="whitespace-pre-line font-mono text-sm bg-gray-50 p-3 rounded border border-gray-200">
                                  {gabaritoAnswer.letterA || "Gabarito não disponível."}
                                </div>
                              </div>
                              
                              <div>
                                <h5 className="font-medium text-purple-700 mb-2">
                                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md">Letra B</span>
                                </h5>
                                <div className="whitespace-pre-line font-mono text-sm bg-gray-50 p-3 rounded border border-gray-200">
                                  {gabaritoAnswer.letterB || "Gabarito não disponível."}
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                {isLoadingGabarito ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                    <p className="text-gray-600">Gerando gabarito com inteligência artificial...</p>
                    <p className="text-gray-500 text-sm mt-1">Isso pode levar alguns instantes</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Bot className="w-16 h-16 text-purple-200 mb-4" />
                    <p className="text-gray-600 mb-4">O gabarito ainda não foi gerado.</p>
                    <Button 
                      onClick={handleLoadGabarito} 
                      className="gap-2 bg-purple-700 hover:bg-purple-800 text-white"
                    >
                      <Bot className="w-4 h-4" />
                      Gerar Gabarito com IA
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between border-t pt-5 mt-6">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onVoltarRedacao} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar à redação
            </Button>
            
            <Button variant="outline" onClick={onReiniciar} className="gap-2">
              Reiniciar
            </Button>
          </div>
          
          <Button onClick={onDownloadResposta} className="gap-2">
            <Download className="w-4 h-4" />
            Baixar resposta
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CorrecaoView;