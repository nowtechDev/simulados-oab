import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, ArrowRight, FileText, BookOpen, Clock, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Peca } from '@/types/simulador';
import { Badge } from '@/components/ui/badge';
interface InstrucoesViewProps {
  peca: Peca;
  onComecarRedacao: () => void;
}
const InstrucoesView = ({
  peca,
  onComecarRedacao
}: InstrucoesViewProps) => {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }} className="glass-panel p-0 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      {/* Header with exam details */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-5">
        <div className="flex items-center gap-4">
          
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
      </div>
      
      <div className="p-6">
        <div className="bg-white p-5 rounded-lg border border-gray-200 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-purple-100">
              <FileText className="w-5 h-5 text-purple-700" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Descrição da Prova</h3>
          </div>
          
          <p className="text-gray-700 text-sm mb-6 leading-relaxed text-justify">
            {peca.descricao}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
              <Scale className="w-5 h-5 text-purple-600 mb-2" />
              <div className="text-center">
                <h4 className="text-sm font-medium text-gray-700">Área</h4>
                <p className="text-sm text-gray-600">{peca.area}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
              <FileText className="w-5 h-5 text-purple-600 mb-2" />
              <div className="text-center">
                <h4 className="text-sm font-medium text-gray-700">Tipo</h4>
                <p className="text-sm text-gray-600">{peca.tipo}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
              <Clock className="w-5 h-5 text-purple-600 mb-2" />
              <div className="text-center">
                <h4 className="text-sm font-medium text-gray-700">Duração</h4>
                <p className="text-sm text-gray-600">5 horas</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg border border-gray-200 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-purple-100">
              <BookOpen className="w-5 h-5 text-purple-700" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Caso Prático</h3>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4 whitespace-pre-line text-gray-700 text-sm leading-relaxed text-justify">
            {peca.problema}
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg border border-gray-200 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-purple-100">
              <CheckCircle className="w-5 h-5 text-purple-700" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Orientações</h3>
          </div>
          
          <ul className="bg-gray-50 p-4 rounded-lg space-y-3">
            {peca.orientacoes.map((orientacao, index) => <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-justify">{orientacao}</span>
              </li>)}
          </ul>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 mb-1">Atenção</h4>
              <p className="text-sm text-amber-700 text-justify">
                Você terá 5 horas para elaborar sua peça processual e responder as questões dissertativas. 
                Após iniciar, o tempo será contabilizado e não poderá ser pausado. 
                Organize seu tempo adequadamente e revise suas respostas antes de submeter.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={onComecarRedacao} className="gap-2 bg-purple-700 hover:bg-purple-800 text-white">
            Começar redação
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>;
};
export default InstrucoesView;