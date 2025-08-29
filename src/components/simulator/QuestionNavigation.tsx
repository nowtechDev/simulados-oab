
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ExamQuestion } from '@/types/simulator';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuestionNavigationProps {
  questions: ExamQuestion[];
  currentQuestion: number;
  selectedOptions: Record<number, string>;
  onQuestionChange: (index: number) => void;
}

const QuestionNavigation = ({
  questions,
  currentQuestion,
  selectedOptions,
  onQuestionChange
}: QuestionNavigationProps) => {
  // Show only 10 questions at a time
  const VISIBLE_QUESTIONS = 10;
  const [startIndex, setStartIndex] = useState(0);
  
  // Adjust visible question range when current question changes
  useEffect(() => {
    // Check if current question is outside our visible range
    if (currentQuestion < startIndex) {
      setStartIndex(Math.max(0, currentQuestion - Math.floor(VISIBLE_QUESTIONS / 2)));
    } else if (currentQuestion >= startIndex + VISIBLE_QUESTIONS) {
      setStartIndex(Math.min(
        questions.length - VISIBLE_QUESTIONS,
        currentQuestion - Math.floor(VISIBLE_QUESTIONS / 2)
      ));
    }
  }, [currentQuestion, questions.length, startIndex]);
  
  // Calculate end index for visible questions
  const endIndex = Math.min(startIndex + VISIBLE_QUESTIONS, questions.length);
  
  // Calculate if we can navigate back/forward
  const canNavigateBack = startIndex > 0;
  const canNavigateForward = endIndex < questions.length;
  
  // Handle navigation buttons - improved for easier navigation
  const handleNavigateBack = () => {
    if (canNavigateBack) {
      setStartIndex(Math.max(0, startIndex - VISIBLE_QUESTIONS));
    }
  };
  
  const handleNavigateForward = () => {
    if (canNavigateForward) {
      setStartIndex(Math.min(questions.length - VISIBLE_QUESTIONS, startIndex + VISIBLE_QUESTIONS));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 mb-6">
      <div className="flex items-center justify-between mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleNavigateBack} 
          disabled={!canNavigateBack}
          className="h-8 w-8 p-0 text-[#8B5CF6] hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/10"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-sm text-foreground/60">
          Questão {currentQuestion + 1} de {questions.length}
        </span>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleNavigateForward} 
          disabled={!canNavigateForward}
          className="h-8 w-8 p-0 text-[#8B5CF6] hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/10"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex gap-2 flex-wrap justify-center">
        {questions.slice(startIndex, endIndex).map((q, idx) => {
          const index = startIndex + idx;
          const isAnswered = selectedOptions[q.id] !== undefined;
          const isCorrect = isAnswered && selectedOptions[q.id] === q.correctOption;
          
          return (
            <button
              key={q.id}
              onClick={() => onQuestionChange(index)}
              className={cn(
                "w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium transition-colors",
                currentQuestion === index
                  ? "bg-[#8B5CF6] text-white"
                  : isAnswered
                    ? isCorrect
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-red-100 text-red-800 border border-red-300"
                    : "bg-gray-100 text-foreground/70 hover:bg-gray-200"
              )}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionNavigation;
