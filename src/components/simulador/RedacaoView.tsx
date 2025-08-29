
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Peca } from '@/types/simulador';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import EssayQuestionView from '@/components/simulator/EssayQuestionView';
import ExamTimer from '@/components/simulator/ExamTimer';

interface RedacaoViewProps {
  peca: Peca;
  resposta: string;
  tempoRestante: number;
  isAnalisando: boolean;
  formatarTempo: (segundos: number) => string;
  onRespostaChange: (resposta: string) => void;
  onVoltarInstrucoes: () => void;
  onAnalisarResposta: () => void;
  respostasQuestoes?: Record<number, string>;
  onRespostaQuestaoChange?: (questionId: number, resposta: string) => void;
}

const RedacaoView = ({
  peca,
  resposta,
  tempoRestante,
  isAnalisando,
  formatarTempo,
  onRespostaChange,
  onVoltarInstrucoes,
  onAnalisarResposta,
  respostasQuestoes = {},
  onRespostaQuestaoChange = () => {}
}: RedacaoViewProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }} 
      className="glass-panel p-0 overflow-hidden rounded-lg border border-gray-200 shadow-sm"
    >
      {/* Header with exam details */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div>
              
            </div>
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
              </div>
            </div>
          </div>
          <ExamTimer initialTime={tempoRestante} isStarted={true} className="bg-white/20 text-white" />
        </div>
      </div>
      
      <div className="p-6">
        <Tabs defaultValue="caso" className="mb-6">
          <TabsList className="grid grid-cols-1 mb-4">
            <TabsTrigger value="caso" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Caso Prático
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="caso">
            <div className="bg-white p-5 rounded-lg border border-gray-200 mb-4">
              <div className="text-sm text-foreground/90 whitespace-pre-line text-justify">
                {peca.problema}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-gray-800">Peça Prático-Profissional</h3>
          </div>
          <Textarea 
            id="resposta" 
            value={resposta} 
            onChange={e => onRespostaChange(e.target.value)} 
            placeholder="Redija sua peça processual aqui..." 
            className="min-h-[350px] font-mono text-sm border-gray-200 bg-white text-justify" 
            style={{
              resize: 'none',
              height: '350px'
            }} 
          />
        </div>

        {/* Essay Questions Section */}
        {peca.questoes && peca.questoes.filter(q => q.isEssay).length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Questões Dissertativas</h3>
            
            {peca.questoes.filter(q => q.isEssay).map((question, index) => (
              <EssayQuestionView 
                key={question.id} 
                question={question} 
                questionNumber={index + 1} 
                answer={respostasQuestoes[question.id] || ''} 
                onAnswerChange={onRespostaQuestaoChange} 
              />
            ))}
          </div>
        )}
        
        <div className="flex justify-between border-t pt-5 mt-6">
          <Button variant="outline" onClick={onVoltarInstrucoes} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar às instruções
          </Button>
          
          <Button onClick={onAnalisarResposta} disabled={isAnalisando} className="gap-2 bg-purple-700 hover:bg-purple-800 text-white">
            {isAnalisando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                IA Civil Corretor analisando...
              </>
            ) : (
              <>
                Submeter para correção
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default RedacaoView;
