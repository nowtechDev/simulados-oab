
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { QuestaoSimulado } from '@/services/simuladoIAService';
import { FileText, Send } from 'lucide-react';

interface QuestionarioSimuladoProps {
  questoes: QuestaoSimulado[];
  onSubmitRespostas: (respostas: Record<string, string>) => void;
  isLoading?: boolean;
}

const QuestionarioSimulado = ({ 
  questoes, 
  onSubmitRespostas, 
  isLoading = false 
}: QuestionarioSimuladoProps) => {
  const [respostas, setRespostas] = useState<Record<string, string>>({});

  const handleRespostaChange = (questaoId: string, resposta: string) => {
    setRespostas(prev => ({
      ...prev,
      [questaoId]: resposta
    }));
  };

  const handleSubmit = () => {
    // Verificar se todas as questões foram respondidas
    const questoesNaoRespondidas = questoes.filter(q => !respostas[q.id]?.trim());
    
    if (questoesNaoRespondidas.length > 0) {
      alert(`Por favor, responda todas as questões. Faltam ${questoesNaoRespondidas.length} questão(ões).`);
      return;
    }

    onSubmitRespostas(respostas);
  };

  if (questoes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhuma questão disponível.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#4F1964] mb-2">
          Simulado da Segunda Fase - OAB
        </h2>
        <p className="text-gray-600">
          Responda todas as questões dissertativas abaixo
        </p>
      </div>

      {questoes.map((questao, index) => (
        <Card key={questao.id} className="overflow-hidden border-[#F8E6FF]/30 shadow-md">
          <CardHeader className="bg-gradient-to-r from-[#F8E6FF]/50 to-[#F8E6FF]/30 border-b border-[#F8E6FF]/20">
            <CardTitle className="text-[#4F1964] flex items-center">
              <span className="bg-[#4F1964] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
                {index + 1}
              </span>
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Questão {questao.numero_questao || (index + 1)}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-[#F8E6FF]/10 rounded-md border border-[#F8E6FF]/30">
                <h4 className="font-semibold text-gray-800 mb-2">Enunciado:</h4>
                <div 
                  className="text-gray-700 leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: questao.enunciado }}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Sua resposta:
                </label>
                <Textarea
                  placeholder="Digite sua resposta dissertativa aqui..."
                  value={respostas[questao.id] || ''}
                  onChange={(e) => handleRespostaChange(questao.id, e.target.value)}
                  className="min-h-[200px] w-full border-[#F8E6FF]/30 focus:ring-[#4F1964]/20"
                  disabled={isLoading}
                />
                <div className="text-xs text-gray-500">
                  Caracteres: {(respostas[questao.id] || '').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-center pt-6">
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#4F1964] to-[#9b59b6] hover:opacity-90 transition-all duration-200 shadow-md px-8 py-3 h-auto"
        >
          {isLoading ? (
            <>
              <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
              Processando...
            </>
          ) : (
            <>
              <Send className="h-5 w-5 mr-2" />
              Submeter Respostas
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default QuestionarioSimulado;
