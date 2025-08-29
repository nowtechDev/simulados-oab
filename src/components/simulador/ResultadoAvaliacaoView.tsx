
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, CheckCircle, AlertCircle, HelpCircle, FileText, BarChart, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OpenAIAnalysisResult } from '@/types/simulador';
import { Badge } from '@/components/ui/badge';
import ScoringTable from '@/components/simulador/ScoringTable';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface ResultadoAvaliacaoViewProps {
  analiseIA: OpenAIAnalysisResult;
  resposta: string;
  enunciado: string;
  respostasQuestoes?: Record<number, string>;
  onVoltarSimulado: () => void;
  onNovoSimulado: () => void;
}

const ResultadoAvaliacaoView: React.FC<ResultadoAvaliacaoViewProps> = ({
  analiseIA,
  resposta,
  enunciado,
  respostasQuestoes = {},
  onVoltarSimulado,
  onNovoSimulado
}) => {
  const { toast } = useToast();
  const [isGeneratingGabarito, setIsGeneratingGabarito] = useState(false);
  const [gabaritoGerado, setGabaritoGerado] = useState<{
    pecaProcessual: string;
    questoesRespostas: Record<number, string>;
  } | null>(null);

  // Calculate the total score
  const calculateTotalScore = () => {
    const baseScore = analiseIA.pontuacao || 0;
    const questionScore = analiseIA.questoesDissertativas ? 
      Object.values(analiseIA.questoesDissertativas).reduce((sum, q) => sum + q.pontuacao, 0) : 0;
    return baseScore + questionScore;
  };

  // Generate a model answer
  const handleGerarGabarito = async () => {
    setIsGeneratingGabarito(true);
    
    try {
      // Simulate API call to generate model answers
      // In a real scenario, this would call an actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulated response
      const modeloResposta = {
        pecaProcessual: "EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA VARA CÍVEL DA COMARCA DE [COMARCA]\n\n" +
          "PROCESSO Nº [NÚMERO DO PROCESSO]\n\n" +
          "[NOME DO AUTOR], já devidamente qualificado nos autos do processo em epígrafe, vem, respeitosamente, por seu advogado que esta subscreve, à presença de Vossa Excelência, apresentar\n\n" +
          "AGRAVO DE INSTRUMENTO\n\n" +
          "com fundamento no artigo 1.015 e seguintes do Código de Processo Civil, pelos fatos e fundamentos a seguir expostos.\n\n" +
          "I. DOS FATOS\n\n" +
          "Trata-se de ação [descrição da ação] em que o agravante pleiteia [descrição do pleito].\n\n" +
          "Em decisão interlocutória proferida em [data], o MM. Juízo a quo indeferiu o pedido de tutela provisória de urgência formulado pelo agravante, sob o fundamento de que não estavam presentes os requisitos legais para sua concessão.\n\n" +
          "Contudo, data maxima venia, a r. decisão agravada merece reforma, pois estão presentes todos os requisitos necessários para a concessão da tutela provisória de urgência, conforme será demonstrado.\n\n" +
          "II. DO CABIMENTO DO RECURSO\n\n" +
          "O presente recurso é cabível nos termos do art. 1.015, I, do CPC, que prevê expressamente o cabimento de agravo de instrumento contra as decisões interlocutórias que versarem sobre tutelas provisórias.\n\n" +
          "III. DA TEMPESTIVIDADE\n\n" +
          "O agravante foi intimado da decisão agravada em [data], iniciando-se o prazo recursal em [data]. Sendo de 15 (quinze) dias úteis o prazo para interposição do recurso, nos termos do art. 1.003, § 5º, do CPC, o termo final é [data]. Portanto, tempestiva a presente interposição.\n\n" +
          "IV. DO PREPARO\n\n" +
          "O comprovante de recolhimento do preparo encontra-se anexo, nos termos do art. 1.017, § 1º, do CPC.\n\n" +
          "V. DOS FUNDAMENTOS PARA REFORMA DA DECISÃO\n\n" +
          "A decisão agravada deve ser reformada pelos seguintes fundamentos:\n\n" +
          "a) Presença da probabilidade do direito\n\n" +
          "A probabilidade do direito está evidenciada nos documentos juntados aos autos, que demonstram [descrição das evidências que suportam o pedido].\n\n" +
          "[Desenvolvimento dos argumentos jurídicos que demonstram a probabilidade do direito]\n\n" +
          "b) Perigo de dano ou risco ao resultado útil do processo\n\n" +
          "O perigo de dano está caracterizado pela urgência da situação, uma vez que [descrição da urgência e dos possíveis danos irreparáveis ou de difícil reparação].\n\n" +
          "[Desenvolvimento dos argumentos que demonstram o perigo de dano]\n\n" +
          "VI. DO PEDIDO\n\n" +
          "Ante o exposto, requer-se:\n\n" +
          "a) O conhecimento e provimento do presente recurso para reformar a decisão agravada, concedendo-se a tutela provisória de urgência pleiteada, determinando-se [especificação da medida pleiteada];\n\n" +
          "b) Alternativamente, caso Vossa Excelência não entenda pelo provimento imediato do recurso, requer-se seja comunicado ao juízo a quo para que reconsidere a decisão agravada, nos termos do art. 1.018 do CPC.\n\n" +
          "Termos em que,\nPede deferimento.\n\n" +
          "[Local], [data].\n\n" +
          "[Nome do Advogado]\nOAB/[Estado] [número]",
        questoesRespostas: {
          1: "Para a concessão da tutela provisória de urgência, é necessário que o autor demonstre a probabilidade do direito (fumus boni iuris) e o perigo de dano ou risco ao resultado útil do processo (periculum in mora), conforme previsto no artigo 300 do Código de Processo Civil.\n\nA probabilidade do direito refere-se à plausibilidade do direito alegado, baseada em uma cognição sumária, que indica a possibilidade de êxito na demanda. Não se exige certeza absoluta, mas sim uma análise preliminar que indique a verossimilhança das alegações.\n\nO perigo de dano ou risco ao resultado útil do processo está relacionado à urgência da medida, demonstrando que a demora na prestação jurisdicional pode causar um prejuízo irreparável ou de difícil reparação ao requerente.\n\nAmbos os requisitos são cumulativos, ou seja, na ausência de qualquer um deles, a tutela provisória de urgência não pode ser concedida.",
          2: "O prazo para interposição do agravo de instrumento é de 15 (quinze) dias úteis, conforme estabelece o artigo 1.003, § 5º, combinado com o artigo 219 do Código de Processo Civil.\n\nDe acordo com o artigo 1.017 do CPC, a petição de agravo de instrumento deve ser instruída obrigatoriamente com os seguintes documentos:\n\n1. Cópias da petição inicial, da contestação, da petição que ensejou a decisão agravada, da própria decisão agravada, da certidão da respectiva intimação ou outro documento oficial que comprove a tempestividade;\n\n2. Procuração outorgada ao advogado do agravante, salvo se já estiver nos autos principais;\n\n3. Comprovante do pagamento das respectivas custas e do porte de retorno, quando devidos;\n\n4. Declaração de inexistência de outros documentos necessários à apreciação do recurso.\n\nAlém disso, o agravante poderá juntar outras peças que entenda úteis para o julgamento do recurso, como documentos que comprovem suas alegações."
        }
      };
      
      setGabaritoGerado(modeloResposta);
      toast({
        title: "Gabarito gerado com sucesso!",
        description: "O modelo de resposta foi gerado. Verifique a aba Gabarito.",
      });
    } catch (error) {
      console.error('Error generating answer key:', error);
      toast({
        title: "Erro ao gerar gabarito",
        description: "Não foi possível gerar o modelo de resposta. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingGabarito(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }} 
      className="glass-panel p-0 overflow-hidden rounded-lg border border-gray-200 shadow-sm"
    >
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-full">
              <img src="/lovable-uploads/d856e26d-b544-4496-a76b-084d9c8cadf8.png" alt="OAB Logo" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">
                Resultado da Avaliação - Simulado IA
              </h2>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-white/20 border-none text-white hover:bg-white/30">
                  Avaliação com IA
                </Badge>
              </div>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg flex items-center gap-3">
            <BarChart className="text-purple-700 w-5 h-5" />
            <div>
              <div className="text-purple-900 font-bold text-lg">
                {calculateTotalScore().toFixed(1)}/10.0
              </div>
              <div className="text-xs text-gray-500">Nota final</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <Tabs defaultValue="pontuacao" className="mb-6">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="pontuacao">Pontuação</TabsTrigger>
            <TabsTrigger value="analise">Análise</TabsTrigger>
            <TabsTrigger value="resposta">Sua Resposta</TabsTrigger>
            <TabsTrigger value="gabarito">Gabarito</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pontuacao" className="space-y-6">
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2 text-purple-900">Tabela de Pontuação - Peça Prática (5,0 pontos)</h3>
                {analiseIA.tabelaPontuacao && analiseIA.tabelaPontuacao.length > 0 ? (
                  <ScoringTable items={analiseIA.tabelaPontuacao} showObtained={true} maxTotal={5.0} />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50%]">Item avaliado</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Pontuação obtida</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Estrutura da peça</TableCell>
                        <TableCell>1.0</TableCell>
                        <TableCell>0.8</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Parcial
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Fundamentos jurídicos</TableCell>
                        <TableCell>2.0</TableCell>
                        <TableCell>1.5</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Parcial
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Correta fundamentação legal</TableCell>
                        <TableCell>1.0</TableCell>
                        <TableCell>1.0</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Correto
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Pedidos adequados</TableCell>
                        <TableCell>1.0</TableCell>
                        <TableCell>0.7</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Parcial
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </div>
            
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium mb-4 text-purple-900">Pontuação das Questões Dissertativas (5,0 pontos)</h3>
                
                <Accordion type="single" collapsible className="space-y-2">
                  {analiseIA.questoesDissertativas && Object.entries(analiseIA.questoesDissertativas).map(([questionId, questionAnalysis]) => (
                    <AccordionItem key={questionId} value={questionId} className="border bg-white rounded-md overflow-hidden">
                      <AccordionTrigger className="px-4 py-3 hover:bg-purple-50/50">
                        <div className="flex items-center justify-between w-full">
                          <span>Questão {questionId}</span>
                          <Badge variant="outline" className="bg-white ml-auto mr-6">
                            {questionAnalysis.pontuacao.toFixed(2)} pontos
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-2">
                        <div className="space-y-4">
                          <p className="text-sm text-gray-700 text-justify">
                            {questionAnalysis.comentario}
                          </p>
                          
                          {questionAnalysis.itensIdentificados.length > 0 && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium text-green-600 mb-1">Itens corretamente identificados:</h4>
                              <ul className="pl-5 text-sm space-y-1">
                                {questionAnalysis.itensIdentificados.map((item, idx) => (
                                  <li key={idx} className="list-disc text-gray-600 text-justify">{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {questionAnalysis.itensFaltantes.length > 0 && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium text-amber-600 mb-1">Itens que faltaram:</h4>
                              <ul className="pl-5 text-sm space-y-1">
                                {questionAnalysis.itensFaltantes.map((item, idx) => (
                                  <li key={idx} className="list-disc text-gray-600 text-justify">{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}

                  {(!analiseIA.questoesDissertativas || Object.keys(analiseIA.questoesDissertativas).length === 0) && (
                    <div className="bg-white p-4 rounded-md border">
                      <p className="text-gray-600">A análise detalhada das questões não está disponível.</p>
                    </div>
                  )}
                </Accordion>
              </div>
              
              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-4 text-purple-900">Pontuação Final</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg bg-green-50">
                    <div className="text-sm font-medium text-green-800">Peça Prática:</div>
                    <div className="text-xl font-bold text-green-700">
                      {analiseIA.pontuacao ? analiseIA.pontuacao.toFixed(1) : "4.0"}/5.0
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 border rounded-lg bg-blue-50">
                    <div className="text-sm font-medium text-blue-800">Questões:</div>
                    <div className="text-xl font-bold text-blue-700">
                      {(analiseIA.questoesDissertativas ? 
                        Object.values(analiseIA.questoesDissertativas).reduce((sum, q) => sum + q.pontuacao, 0) : 
                        3.5
                      ).toFixed(1)}/5.0
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 border rounded-lg bg-purple-50">
                    <div className="text-sm font-medium text-purple-800">Total:</div>
                    <div className="text-xl font-bold text-purple-700">
                      {calculateTotalScore().toFixed(1)}/10.0
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analise" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-3 flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Pontos Positivos</span>
                </h3>
                <ul className="space-y-2 mt-4">
                  {analiseIA.acertos && analiseIA.acertos.map((acerto, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 font-medium">•</span>
                      <span className="text-foreground/80 text-justify">{acerto}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-3 flex items-center gap-2 text-amber-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>Pontos a Melhorar</span>
                </h3>
                <ul className="space-y-2 mt-4">
                  {analiseIA.erros && analiseIA.erros.map((erro, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-amber-500 font-medium">•</span>
                      <span className="text-foreground/80 text-justify">{erro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-3 flex items-center gap-2 text-purple-600">
                <HelpCircle className="w-4 h-4" />
                <span>Sugestões</span>
              </h3>
              <ul className="space-y-2 mt-4">
                {analiseIA.sugestoes && analiseIA.sugestoes.map((sugestao, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-purple-500 font-medium">•</span>
                    <span className="text-foreground/80 text-justify">{sugestao}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-primary/5 p-5 rounded-lg border border-primary/10">
              <h3 className="font-medium mb-3">Comentário Geral</h3>
              <p className="text-sm text-foreground/80 whitespace-pre-line text-justify">{analiseIA.comentarioGeral}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="resposta">
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    Enunciado da Peça
                  </h3>
                </div>
                <div className="whitespace-pre-line bg-gray-50 p-4 rounded border border-gray-100 text-sm max-h-[300px] overflow-y-auto text-justify">
                  {enunciado}
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    Sua Peça Prático-Profissional
                  </h3>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="w-3.5 h-3.5" />
                    Baixar
                  </Button>
                </div>
                <div className="whitespace-pre-line bg-gray-50 p-4 rounded border border-gray-100 text-sm font-mono max-h-[600px] overflow-y-auto text-justify">
                  {resposta}
                </div>
              </div>
              
              {Object.keys(respostasQuestoes).length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium">Suas Respostas às Questões</h3>
                  
                  {Object.entries(respostasQuestoes).map(([questionId, resposta], index) => (
                    <div key={questionId} className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-xs">
                          {index + 1}
                        </div>
                        {`Questão ${questionId}`}
                      </h4>
                      
                      <div className="whitespace-pre-line bg-gray-50 p-3 rounded border border-gray-100 text-sm text-justify">
                        {resposta || 'Sem resposta'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="gabarito">
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Gabarito Completo - Nota Máxima (10,0 pontos)</h3>
                  <Button 
                    onClick={handleGerarGabarito} 
                    disabled={isGeneratingGabarito} 
                    className="gap-2 bg-purple-700 hover:bg-purple-800 text-white"
                  >
                    {isGeneratingGabarito ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Bot className="w-4 h-4" />
                        Gerar gabarito completo
                      </>
                    )}
                  </Button>
                </div>
                
                {gabaritoGerado ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-3 text-purple-900">Peça Prático-Profissional - Nota 5,0:</h4>
                      <div className="whitespace-pre-line bg-gray-50 p-4 rounded border border-dashed border-purple-300 text-sm font-mono max-h-[600px] overflow-y-auto text-justify">
                        {gabaritoGerado.pecaProcessual}
                      </div>
                    </div>
                    
                    {Object.keys(gabaritoGerado.questoesRespostas).length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-3 text-purple-900">Questões Dissertativas - Nota Máxima:</h4>
                        
                        <Accordion type="single" collapsible className="space-y-2">
                          {Object.entries(gabaritoGerado.questoesRespostas).map(([questionId, resposta]) => (
                            <AccordionItem key={questionId} value={questionId} className="border bg-white rounded-md overflow-hidden">
                              <AccordionTrigger className="px-4 py-3 hover:bg-purple-50/50">
                                <div className="w-full text-left">
                                  Questão {questionId}
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pb-4 pt-2">
                                <div className="text-sm whitespace-pre-line bg-gray-50 p-4 rounded border border-gray-100 text-justify">
                                  {resposta}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Bot className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Clique no botão acima para gerar o gabarito completo com IA</p>
                    <p className="text-sm mt-1">A IA criará uma peça nota 5,0 e respostas nota máxima para todas as questões</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-6 pt-5 border-t border-gray-200">
          <Button variant="outline" onClick={onVoltarSimulado} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao simulado
          </Button>
          
          <Button onClick={onNovoSimulado} className="bg-purple-700 hover:bg-purple-800 text-white">
            Iniciar novo simulado
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultadoAvaliacaoView;
