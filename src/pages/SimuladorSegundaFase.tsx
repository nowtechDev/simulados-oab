import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, FileText, BookOpen, Scale } from 'lucide-react';
import { Layout } from '@/components/Layout';
import OpenAIConfig from '@/components/OpenAIConfig';
import { useSimulador } from '@/hooks/useSimulador';
import { formatarTempo } from '@/utils/formatters';
import { pecaExemplo } from '@/data/pecasProcessuais';
import RedacaoView from '@/components/simulador/RedacaoView';
import CorrecaoView from '@/components/simulador/CorrecaoView';
import InstrucoesView from '@/components/simulador/InstrucoesView';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Peca } from '@/types/simulador';

// Update pecaExemplo with OAB-style data and adjusted point values
if (!pecaExemplo.numero) {
  pecaExemplo.numero = "42º Exame de Ordem Unificado";
  pecaExemplo.dataAplicacao = "16/02/2025";
  pecaExemplo.descricao = "Prova Prático-Profissional da OAB com peça processual valendo 5,0 pontos e 4 questões dissertativas valendo 5,0 pontos no total. A pontuação é feita por item identificado conforme os critérios de correção.";
  pecaExemplo.tabelaPontuacao = [{
    item: "Endereçamento correto",
    valor: 0.40
  }, {
    item: "Qualificação das partes",
    valor: 0.40
  }, {
    item: "Fundamentos jurídicos do Art. 1.009 do CPC",
    valor: 0.50
  }, {
    item: "Fundamentos jurídicos do Art. 1.010 do CPC",
    valor: 0.50
  }, {
    item: "Pedido de prioridade na tramitação (idoso)",
    valor: 0.40
  }, {
    item: "Alegação de inviabilidade da condenação em litigância",
    valor: 0.50
  }, {
    item: "Contradições em cláusulas contratuais (CDC)",
    valor: 0.50
  }, {
    item: "Mútuo sob consignação e condição de idosa",
    valor: 0.50
  }, {
    item: "Interpretação mais favorável ao aderente (Art. 423 CC)",
    valor: 0.50
  }, {
    item: "Destaque da boa-fé objetiva",
    valor: 0.40
  }, {
    item: "Pedido de reforma da sentença",
    valor: 0.40
  }, {
    item: "Datação e assinatura",
    valor: 0.50
  }];

  // Calculate total points for the piece
  const totalPointsPiece = pecaExemplo.tabelaPontuacao.reduce((sum, item) => sum + item.valor, 0);

  // Calculate the remaining points for essay questions (total should be 5.0)
  const totalEssayPoints = 5.0;

  // Add essay questions in OAB style with adjusted point values
  pecaExemplo.questoes = [{
    id: 1,
    title: "Questão 1",
    text: "Amanda e Cristiano são pais de Ravi, hoje com dois anos de idade. Desde que engravidou, Amanda é responsável por todos os gastos e todos os cuidados referentes à criança, não tendo Cristiano, com quem Amanda somente se relacionou por uma noite, demonstrado qualquer interesse em exercer a paternidade ou arcar com as despesas do filho. Cristiano, inclusive, nunca contou à própria família sobre Ravi.\n\nOcorre que, há um mês, Amanda, profissional liberal, sofreu um acidente, ficando impossibilitada para o trabalho por período indeterminado, razão pela qual teme pela subsistência do filho. Ao procurar Cristiano para conversar a respeito do pagamento de uma pensão para Ravi, este negou qualquer ajuda, pelo fato de ter começado um curso superior, motivo pelo qual parou de trabalhar. Amanda sabe, contudo, que os pais de Cristiano têm excelentes condições financeiras.",
    area: "Direito Civil",
    isEssay: true,
    letterA: "Os pais de Cristiano podem ser obrigados a prestar alimentos a Ravi? Indique a natureza da eventual obrigação dos avós.",
    letterB: "Amanda, sabendo que Cristiano se negará a prestar alimentos em favor de Ravi, pode promover ação diretamente em face dos avós? Indique como deve ser formulado o pedido.",
    pointsA: 0.65,
    pointsB: 0.60,
    options: [] // Empty array for essay questions
  }, {
    id: 2,
    title: "Questão 2",
    text: "Rodrigo Carvalho e Patrícia Almeida vivem em união estável desde 2005 quando, inclusive, registraram sua união no registro civil de pessoas naturais. Não tiveram filhos em comum, mas as duas filhas de Patrícia vivem com o casal e Rodrigo sempre exerceu a função paterna.\n\nEste ano, no contexto da celebração de 20 anos de união, Rodrigo pretende alterar o seu sobrenome com a inclusão do patronímico \"Almeida\", a fim de ostentar o mesmo sobrenome de Patrícia e das filhas já maiores de idade. Pretende realizar essa alteração em segredo e presentear a companheira com a cópia da certidão com o novo nome.",
    area: "Direito Civil",
    isEssay: true,
    letterA: "Rodrigo poderá incluir o sobrenome de Patrícia sem o consentimento dela? Justifique.",
    letterB: "Como Rodrigo deverá proceder para, da forma mais célere, satisfazer o seu interesse, bem como os eventuais requisitos e o prazo para o exercício da alteração pretendida? Justifique.",
    pointsA: 0.65,
    pointsB: 0.60,
    options: [] // Empty array for essay questions
  }, {
    id: 3,
    title: "Questão 3",
    text: "Wanessa e Camilla são filhas maiores e capazes de José, falecido há cerca de um mês. Após o falecimento do pai, as irmãs entraram em litígio, pois Camilla descobriu que em vida José doou um terreno para Wanessa construir sua casa, porém esta entende que o terreno não deve integrar o inventário do pai, já que compõe apenas a parte disponível do patrimônio, apesar de não constar tal informação do contrato de doação lavrado em instrumento público.",
    area: "Direito Civil",
    isEssay: true,
    letterA: "Assiste razão à pretensão de Wanessa? Justifique.",
    letterB: "Supondo que, no inventário judicial, Wanessa foi nomeada inventariante, deixando de incluir o terreno na relação de bens apresentada em primeiras declarações, o que pode ser feito por Camilla? Justifique.",
    pointsA: 0.60,
    pointsB: 0.65,
    options: [] // Empty array for essay questions
  }, {
    id: 4,
    title: "Questão 4",
    text: "Maria Clara Boal, residente e domiciliada na comarca de Valença do Piauí, PI, adquiriu um automóvel novo marca XYZ, fabricado pela sociedade empresária Autocarros S.A., na concessionária Piufi Automóveis Piauienses Ltda.\n\nDez dias após a compra, trafegando normalmente e na velocidade adequada, Maria Clara perdeu o controle do veículo, causando um grave acidente, que levou à perda da mobilidade das pernas. Uma minuciosa perícia técnica revelou que o acidente foi causado por um defeito de fábrica no veículo, em razão do qual a roda traseira esquerda se desprendeu completamente devido à quebra do seu cubo. Inconformada e perplexa, Maria Clara promoveu ação de perdas e danos em face da concessionária Piufi Automóveis Piauienses Ltda.",
    area: "Direito Civil",
    isEssay: true,
    letterA: "A concessionária responde direta e civilmente pelos danos sofridos por Maria Clara? Justifique sua resposta, indicando a natureza da responsabilidade da concessionária e sua qualificação na relação com Maria Clara.",
    letterB: "Qual a providência, com o respectivo instrumento processual, que deverá ser utilizada pela ré em sua defesa visando à sua exclusão na relação processual sem a condenação nas despesas processuais? Justifique.",
    pointsA: 0.65,
    pointsB: 0.60,
    options: [] // Empty array for essay questions
  }];

  // Verify and adjust total points if necessary
  const totalEssayPointsCalculated = pecaExemplo.questoes.reduce((sum, q) => {
    return sum + (q.pointsA || 0) + (q.pointsB || 0);
  }, 0);
  if (Math.abs(totalEssayPointsCalculated - totalEssayPoints) > 0.01) {
    // Adjust points proportionally to match 5.0 total
    const adjustmentFactor = totalEssayPoints / totalEssayPointsCalculated;
    pecaExemplo.questoes.forEach(q => {
      if (q.pointsA) q.pointsA = parseFloat((q.pointsA * adjustmentFactor).toFixed(2));
      if (q.pointsB) q.pointsB = parseFloat((q.pointsB * adjustmentFactor).toFixed(2));
    });
  }
}

const SimuladorSegundaFase = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [examInfo, setExamInfo] = useState({
    area: '',
    areaName: '',
    piece: '',
    exameNumber: ''
  });
  const [pecaAtual, setPecaAtual] = useState<Peca>({...pecaExemplo});
  const [isLoading, setIsLoading] = useState(true);

  // Extract query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const area = params.get('area') || sessionStorage.getItem('selectedAreaId') || '';
    const areaName = params.get('areaName') || sessionStorage.getItem('selectedAreaName') || '';
    const piece = params.get('piece') || '';
    const exame = params.get('exame') || sessionStorage.getItem('selectedSegundaFaseFGVExame') || '';
    
    console.log("SimuladorSegundaFase - Parâmetros recebidos:", { area, areaName, piece, exame });
    
    setExamInfo({
      area,
      areaName,
      piece,
      exameNumber: exame
    });

    // Fetch specific questions for this area and exam
    if (area && exame && piece === 'Prova FGV') {
      fetchExamQuestions(area, exame);
    } else {
      // Use default example if no specific area/exam
      setPecaAtual({
        ...pecaExemplo,
        area: areaName || 'Direito Civil',
        numero: exame ? `${exame}º Exame de Ordem Unificado` : '42º Exame de Ordem Unificado',
        tipo: "Peça Prático-Profissional da OAB"
      });
      setIsLoading(false);
    }
  }, [location.search]);

  // Fetch specific exam questions from Supabase
  const fetchExamQuestions = async (areaSlug: string, examNumber: string) => {
    setIsLoading(true);
    try {
      console.log(`Buscando questões para área ${areaSlug} e exame ${examNumber}`);
      
      // Get area ID from slug
      console.log("Buscando área com slug:", areaSlug);
      
      // Verificar se areaSlug é um UUID (se for, buscar diretamente pelo ID)
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(areaSlug);
      
      let areaData;
      
      if (isUUID) {
        // Se for UUID, buscar diretamente pelo ID
        console.log("areaSlug parece ser um UUID, buscando pelo ID");
        const { data, error } = await supabase
          .from('segunda_fase_areas')
          .select('id, name')
          .eq('id', areaSlug)
          .single();
          
        if (error) {
          console.error("Erro ao buscar área pelo ID:", error);
          throw error;
        }
        
        areaData = data;
      } else {
        // Caso contrário, buscar pelo slug
        const { data, error } = await supabase
          .from('segunda_fase_areas')
          .select('id, name')
          .eq('slug', areaSlug)
          .single();
        
        if (error) {
          console.error("Erro ao buscar área pelo slug:", error);
          throw error;
        }
        
        areaData = data;
      }
      
      if (!areaData) {
        console.error("Área não encontrada para o slug/id:", areaSlug);
        throw new Error("Área não encontrada");
      }
      
      console.log("Área encontrada:", areaData);
      
      // Fetch piece and questions
      const { data: questionData, error: questionError } = await supabase
        .from('segunda_fase_questoes')
        .select('*')
        .eq('area_id', areaData.id.toString())
        .eq('numero_exame', Number(examNumber));
      
      if (questionError) {
        console.error("Erro ao buscar questões:", questionError);
        throw questionError;
      }
      
      console.log("Questões encontradas:", questionData);
      
      // Analise detalhada das questões para diagnóstico
      if (questionData && questionData.length > 0) {
        console.log("Estrutura da primeira questão:", questionData[0]);
        // Verificar campos disponíveis
        const availableFields = Object.keys(questionData[0]);
        console.log("Campos disponíveis nas questões:", availableFields);
        
        // Verificar se há um campo específico para identificar o tipo (peça ou questão)
        if (availableFields.includes('tipo')) {
          console.log("Tipos de questões presentes:", [...new Set(questionData.map(q => q.tipo))]);
        }
      }
      
      if (!questionData || questionData.length === 0) {
        console.warn("Nenhuma questão encontrada para esta área e exame");
        toast({
          title: "Dados não encontrados",
          description: `Nenhuma questão encontrada para ${areaData.name} no exame ${examNumber}. Usando modelo padrão.`,
          variant: "destructive"
        });
        
        // Use default with proper metadata
        setPecaAtual({
          ...pecaExemplo,
          area: areaData.name,
          numero: `${examNumber}º Exame de Ordem Unificado`,
          tipo: "Peça Prático-Profissional da OAB"
        });
        setIsLoading(false);
        return;
      }
      
      // Process the data to create a Peca object
      // Precisamos identificar qual item é a peça processual e quais são as questões
      let examProblem = null;
      let questionsList = [];
      
      // Verificar cada item para classificar entre peça e questões
      questionData.forEach(item => {
        // Verificar campos para diagnóstico
        console.log(`Analisando item: ID=${item.id}, tipo=${item.tipo}, numero_questao=${item.numero_questao}`);
        
        // CRITÉRIOS PARA IDENTIFICAÇÃO DA PEÇA:
        // 1. Campo tipo explicitamente marcado como peça
        // 2. Número de questão nulo ou zero (peça geralmente não tem número)
        // 3. Conteúdo do enunciado contém palavras-chave de peça processual
        
        if (
          // Critério 1: Campo tipo explícito
          (item.tipo && ['peca', 'peça', 'problema'].includes(item.tipo.toLowerCase())) ||
          // Critério 2: Sem número de questão ou número zero
          (
            !item.numero_questao ||
            item.numero_questao === '0' ||
            String(item.numero_questao) === '0' ||
            item.numero_questao === '' ||
            (typeof item.numero_questao === 'number' && item.numero_questao === 0)
          ) ||
          // Critério 3: Análise do conteúdo do enunciado para identificar peça
          (item.enunciado && (
            item.enunciado.toLowerCase().includes('elabore uma peça') || 
            item.enunciado.toLowerCase().includes('redija a peça') ||
            item.enunciado.toLowerCase().includes('confeccione a peça') ||
            item.enunciado.toLowerCase().includes('peça processual') ||
            item.enunciado.toLowerCase().includes('peça profissional') ||
            (
              // Combinação de termos que geralmente indicam peça
              item.enunciado.toLowerCase().includes('elabore') && 
              (
                item.enunciado.toLowerCase().includes('petição') ||
                item.enunciado.toLowerCase().includes('recurso') ||
                item.enunciado.toLowerCase().includes('contestação') ||
                item.enunciado.toLowerCase().includes('agravo') ||
                item.enunciado.toLowerCase().includes('apelação') ||
                item.enunciado.toLowerCase().includes('mandado') ||
                item.enunciado.toLowerCase().includes('habeas')
              )
            )
          ))
        ) {
          console.log("✅ Item identificado como PEÇA PROCESSUAL:", item.id);
          examProblem = item;
        } 
        else {
          // CRITÉRIOS PARA QUESTÕES DISSERTATIVAS:
          // 1. Tem número de questão não nulo
          // 2. Tipo explicitamente marcado como questão ou dissertativa
          // 3. Não foi identificado como peça nos critérios anteriores
          
          console.log("✅ Item identificado como QUESTÃO DISSERTATIVA:", item.id);
          questionsList.push(item);
        }
      });
      
      // Se não encontramos uma peça específica, usamos o primeiro item
      if (!examProblem && questionData.length > 0) {
        console.log("⚠️ Nenhum item marcado como peça encontrado, usando o primeiro item como peça");
        examProblem = questionData[0];
        // Remover o primeiro item da lista de questões para não duplicar
        questionsList = questionData.filter(q => q.id !== examProblem.id);
      }
      
      console.log("📑 Peça identificada:", examProblem);
      console.log("❓ Questões identificadas:", questionsList.length);
      
      // Transform questions data into the format needed
      // Limitamos a 4 questões, conforme padrão da OAB
      const processedQuestions = questionsList.slice(0, 4).map((q, index) => {
        console.log(`Processando questão ${index + 1}:`, q);
        
        // NOVA ABORDAGEM: Manter enunciado completo, apenas identificar pontuação
        // Texto completo do enunciado
        const mainText = q.enunciado || "";
        
        // Simplificar para Letra A/B apenas no título
        const letterA = "Letra A";
        const letterB = "Letra B";
        
        // Tentar extrair pontuação do enunciado se não estiver explícita no banco
        if (!q.pointsA) {
          const aPointsMatch = mainText.match(/A\).*?\((?:Valor|valor|pontos|Pontos):\s*([\d,\.]+)\)/s);
          if (aPointsMatch && aPointsMatch[1]) {
            q.pointsA = parseFloat(aPointsMatch[1].replace(',', '.'));
          } else {
            q.pointsA = 0.65; // Valor padrão
          }
        }
        
        if (!q.pointsB) {
          const bPointsMatch = mainText.match(/B\).*?\((?:Valor|valor|pontos|Pontos):\s*([\d,\.]+)\)/s);
          if (bPointsMatch && bPointsMatch[1]) {
            q.pointsB = parseFloat(bPointsMatch[1].replace(',', '.'));
          } else {
            q.pointsB = 0.60; // Valor padrão
          }
        }
        
        console.log("========== NOVA ABORDAGEM: ENUNCIADO COMPLETO ==========");
        console.log("ID da Questão:", q.id);
        console.log("Texto Completo:", mainText.substring(0, 100) + "...");
        console.log("Pontuação A:", q.pointsA);
        console.log("Pontuação B:", q.pointsB);
        console.log("=====================================================");
        
        return {
          id: index + 1,
          title: `Questão ${index + 1}`,
          text: mainText,  // Texto completo do enunciado
          area: areaData.name,
          isEssay: true,
          letterA: letterA,
          letterB: letterB,
          pointsA: q.pointsA || 0.65,
          pointsB: q.pointsB || 0.60,
          options: []
        };
      });
      
      // Create the new Peca object with actual data
      const newPeca: Peca = {
        ...pecaExemplo,
        id: examProblem?.id || pecaExemplo.id || '',
        area: areaData.name,
        numero: `${examNumber}º Exame de Ordem Unificado`,
        tipo: "Peça Prático-Profissional da OAB",
        problema: examProblem?.enunciado || pecaExemplo.problema,
        questoes: processedQuestions.length > 0 ? processedQuestions : pecaExemplo.questoes
      };
      
      console.log("Nova peça criada com:", {
        id: newPeca.id,
        area: newPeca.area,
        problema: newPeca.problema ? newPeca.problema.substring(0, 50) + "..." : "Nenhum",
        qtdQuestoes: newPeca.questoes.length
      });
      setPecaAtual(newPeca);
      
    } catch (error) {
      console.error("Erro ao buscar questões específicas:", error);
      toast({
        title: "Erro ao carregar questões",
        description: "Não foi possível carregar as questões específicas. Usando modelo padrão.",
        variant: "destructive"
      });
      
      // Use default with proper metadata
      setPecaAtual({
        ...pecaExemplo,
        area: examInfo.areaName,
        numero: `${examNumber}º Exame de Ordem Unificado`,
        tipo: "Peça Prático-Profissional da OAB"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const {
    currentStep,
    resposta,
    tempoRestante,
    isAnalisando,
    analiseIA,
    respostasQuestoes,
    setResposta,
    setRespostaQuestao,
    setCurrentStep,
    handleComecarRedacao,
    analisarResposta,
    handleDownloadResposta,
    resetSimulador
  } = useSimulador(pecaAtual);
  
  const renderCurrentStepView = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4F1964]"></div>
          <p className="mt-4 text-gray-600">Carregando exame...</p>
        </div>
      );
    }
    
    switch (currentStep) {
      case 'instrucoes':
        return <InstrucoesView peca={pecaAtual} onComecarRedacao={handleComecarRedacao} />;
      case 'redacao':
        return <RedacaoView peca={pecaAtual} resposta={resposta} tempoRestante={tempoRestante} isAnalisando={isAnalisando} formatarTempo={formatarTempo} onRespostaChange={setResposta} onVoltarInstrucoes={() => setCurrentStep('instrucoes')} onAnalisarResposta={analisarResposta} respostasQuestoes={respostasQuestoes} onRespostaQuestaoChange={setRespostaQuestao} />;
      case 'correcao':
        return <CorrecaoView peca={pecaAtual} resposta={resposta} analiseIA={analiseIA} onVoltarRedacao={() => setCurrentStep('redacao')} onReiniciar={resetSimulador} onDownloadResposta={handleDownloadResposta} respostasQuestoes={respostasQuestoes} />;
      default:
        return <InstrucoesView peca={pecaAtual} onComecarRedacao={handleComecarRedacao} />;
    }
  };
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Simulado Segunda Fase OAB - FGV
                {examInfo.exameNumber && examInfo.areaName && (
                  <span className="ml-2 text-lg font-normal text-gray-600">
                    ({examInfo.exameNumber}º Exame - {examInfo.areaName})
                  </span>
                )}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <OpenAIConfig />
          </div>
        </div>
        
        {renderCurrentStepView()}
      </div>
    </Layout>
  );
};

export default SimuladorSegundaFase;
