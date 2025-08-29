
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ResultsViewProps {
  examData: {
    title: string;
    timeLimit: string;
    questions: {
      id: number;
      text: string;
      area: string;
      correctOption: string;
    }[];
  };
  selectedOptions: Record<number, string>;
  calculateScore: () => { score: number; total: number; percentage: number };
  onReturnToSimulados?: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ 
  examData, 
  selectedOptions, 
  calculateScore,
  onReturnToSimulados
}) => {
  const navigate = useNavigate();
  const score = calculateScore();
  
  // Calculate performance by area
  const areaPerformance: Record<string, { correct: number, total: number }> = {};
  
  examData.questions.forEach(question => {
    if (!areaPerformance[question.area]) {
      areaPerformance[question.area] = { correct: 0, total: 0 };
    }
    
    areaPerformance[question.area].total += 1;
    
    if (selectedOptions[question.id] === question.correctOption) {
      areaPerformance[question.area].correct += 1;
    }
  });
  
  // Handle navigation back to simulados page
  const handleReturnToSimulados = () => {
    if (onReturnToSimulados) {
      onReturnToSimulados();
    } else {
      // Garantir que seja redirecionado para a rota correta
      navigate('/simulados', { replace: true });
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass-panel p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{examData.title}</h1>
          <div className="flex items-center text-foreground/60 gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{examData.timeLimit}</span>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Seu Resultado</h2>
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full flex items-center justify-center bg-primary/10 mb-4">
              <span className="text-3xl font-bold text-primary">{score.percentage}%</span>
            </div>
            <p className="text-lg">
              Você acertou <span className="font-bold">{score.score}</span> de {score.total} questões
            </p>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Desempenho por Área</h2>
          <div className="space-y-4">
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
        </div>
        
        <div className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={handleReturnToSimulados}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar aos Simulados
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
