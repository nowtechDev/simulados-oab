
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExamTimer from '@/components/simulator/ExamTimer';

interface SimulatorHeaderProps {
  examId: string;
  timeRemaining: number;
  isTimerActive: boolean;
  onBackToHome: () => void;
}

export const SimulatorHeader: React.FC<SimulatorHeaderProps> = ({
  examId,
  timeRemaining,
  isTimerActive,
  onBackToHome,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBackToHome}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Exame {examId}</h1>
      </div>
      <ExamTimer 
        initialTime={timeRemaining}
        isStarted={isTimerActive}
      />
    </div>
  );
};
