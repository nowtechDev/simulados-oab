import { useState, useEffect } from 'react';
import { Peca, SimuladorState, OpenAIAnalysisResult } from '@/types/simulador';
import { analizarRespostaComOpenAI } from '@/services/openai';

export const useSimulador = (peca: Peca) => {
  const [currentStep, setCurrentStep] = useState<SimuladorState['currentStep']>('instrucoes');
  const [resposta, setResposta] = useState('');
  const [tempoRestante, setTempoRestante] = useState(60 * 60 * 4); // 4 horas
  const [isAnalisando, setIsAnalisando] = useState(false);
  const [analiseIA, setAnaliseIA] = useState<OpenAIAnalysisResult | string | null>(null);
  const [respostasQuestoes, setRespostasQuestoes] = useState<Record<number, string>>({});

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (currentStep === 'redacao' && tempoRestante > 0) {
      intervalId = setInterval(() => {
        setTempoRestante(prevTempo => prevTempo - 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [currentStep, tempoRestante]);

  const handleComecarRedacao = () => {
    setCurrentStep('redacao');
  };

  const analisarResposta = async () => {
    setIsAnalisando(true);
    try {
      console.log("useSimulador: Iniciando análise da resposta", {
        area: peca.area,
        tipo: peca.tipo,
        temResposta: resposta.length > 0,
        numQuestoes: Object.keys(respostasQuestoes).length
      });
      
      // Verificação de conteúdo antes de enviar
      if (!resposta.trim()) {
        console.warn("useSimulador: Peça processual vazia");
        setAnaliseIA("Por favor, redija a peça processual antes de submeter para correção.");
        setCurrentStep('correcao');
        setIsAnalisando(false);
        return;
      }
      
      // Verificar se há questões não respondidas
      if (peca.questoes && peca.questoes.filter(q => q.isEssay).length > 0) {
        const questoesNaoRespondidas = peca.questoes
          .filter(q => q.isEssay)
          .filter(q => !respostasQuestoes[q.id] || respostasQuestoes[q.id].trim() === '' || respostasQuestoes[q.id].trim() === '===PART_SEPARATOR===');
        
        if (questoesNaoRespondidas.length > 0) {
          console.warn("useSimulador: Há questões não respondidas", {
            questoesNaoRespondidas: questoesNaoRespondidas.map(q => q.id)
          });
          // Continuar mesmo com questões não respondidas, mas logar o aviso
        }
      }
      
      // Iniciar timestamp para medir tempo de resposta
      const startTime = Date.now();
      
      const analysisResult = await analizarRespostaComOpenAI(peca, resposta, respostasQuestoes);
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`useSimulador: Análise concluída em ${duration}s`, {
        tipoResultado: typeof analysisResult,
        sucesso: typeof analysisResult !== 'string'
      });
      
      setAnaliseIA(analysisResult);
      setCurrentStep('correcao');
    } catch (error: any) {
      console.error("useSimulador: Erro grave ao analisar resposta:", error);
      
      // Mensagem de erro mais amigável com base no tipo de erro
      let mensagemErro = "Ocorreu um erro ao analisar sua resposta. Por favor, tente novamente.";
      
      if (error.message?.includes('network') || error.message?.includes('conexão') || error.message?.includes('connect')) {
        mensagemErro = "Erro de conexão. Verifique sua internet e tente novamente.";
      } else if (error.message?.includes('API key') || error.message?.includes('authentication')) {
        mensagemErro = "Erro de autenticação. Verifique se sua chave da API da OpenAI está configurada corretamente.";
      } else if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
        mensagemErro = "A solicitação demorou muito para ser processada. Tente novamente.";
      }
      
      setAnaliseIA(mensagemErro);
      setCurrentStep('correcao');
    } finally {
      setIsAnalisando(false);
    }
  };

  const handleDownloadResposta = () => {
    console.log("useSimulador: Iniciando download da resposta");
    
    // Preparar conteúdo combinado (peça + questões)
    let conteudoCompleto = `PEÇA PROCESSUAL:\n\n${resposta}\n\n`;
    
    // Adicionar respostas das questões
    if (peca.questoes && Object.keys(respostasQuestoes).length > 0) {
      conteudoCompleto += `\n\nQUESTÕES DISSERTATIVAS:\n\n`;
      
      peca.questoes.filter(q => q.isEssay).forEach((question, index) => {
        const respostaQuestao = respostasQuestoes[question.id] || '';
        const [parteA, parteB] = respostaQuestao.split('===PART_SEPARATOR===');
        
        conteudoCompleto += `Questão ${question.title || index + 1}:\n`;
        conteudoCompleto += `${question.text}\n\n`;
        
        conteudoCompleto += `A) ${question.letterA || 'Letra A'}\n`;
        conteudoCompleto += `Resposta: ${parteA || 'Não respondida'}\n\n`;
        
        conteudoCompleto += `B) ${question.letterB || 'Letra B'}\n`;
        conteudoCompleto += `Resposta: ${parteB || 'Não respondida'}\n\n`;
      });
    }
    
    // Gerar nome de arquivo com data e hora
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const nomeArquivo = `Simulado_OAB_${peca.area.replace(/\s+/g, '_')}_${dataFormatada}.txt`;
    
    // Criar e acionar o download
    const element = document.createElement("a");
    const file = new Blob([conteudoCompleto], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = nomeArquivo;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    console.log("useSimulador: Download de resposta concluído", { nomeArquivo });
  };

  const resetSimulador = () => {
    setCurrentStep('instrucoes');
    setResposta('');
    setTempoRestante(60 * 60 * 4);
    setAnaliseIA(null);
    setRespostasQuestoes({});
  };

  const setRespostaQuestao = (questionId: number, resposta: string) => {
    setRespostasQuestoes(prevRespostas => ({
      ...prevRespostas,
      [questionId]: resposta
    }));
  };

  return {
    currentStep,
    resposta,
    tempoRestante,
    isAnalisando,
    analiseIA,
    respostasQuestoes,
    setCurrentStep,
    setResposta,
    setRespostaQuestao,
    handleComecarRedacao,
    analisarResposta,
    handleDownloadResposta,
    resetSimulador
  };
};
