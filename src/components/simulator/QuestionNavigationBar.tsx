
import React from 'react';
import { cn } from '@/lib/utils';
import { Question } from '@/types/simulator';

interface QuestionNavigationBarProps {
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswers: Record<number, string>;
  onNavigateToQuestion: (index: number) => void;
}

export const QuestionNavigationBar: React.FC<QuestionNavigationBarProps> = ({
  questions,
  currentQuestionIndex,
  selectedAnswers,
  onNavigateToQuestion,
}) => {
  return (
    <div className="overflow-x-auto pb-4 mb-6">
      <div className="flex gap-2 min-w-max">
        {questions.map((q, index) => {
          const isSelected = index === currentQuestionIndex;
          const isQuestionAnswered = selectedAnswers[q.Numero] !== undefined;
          
          return (
            <button
              key={q.Numero}
              onClick={() => onNavigateToQuestion(index)}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-colors",
                isSelected
                  ? "bg-primary text-white"
                  : isQuestionAnswered
                  ? "bg-primary/20 text-primary"
                  : "bg-gray-100 text-foreground/60 hover:bg-gray-200"
              )}
            >
              {q.Numero}
            </button>
          );
        })}
      </div>
    </div>
  );
};
