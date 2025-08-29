
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { HelpCircle, BookOpen, Award, Scissors } from 'lucide-react';
import { ExamQuestion } from '@/types/simulator';

interface QuestionViewProps {
  question: ExamQuestion;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedOption: string | undefined;
  showExplanation: boolean;
  onSelectOption: (optionId: string) => void;
  onToggleExplanation: () => void;
  isAnswered: boolean;
  isCorrect: boolean;
  onMarkAnswer: () => void;
  fontSize?: number;
  strikedOptions?: string[];
  onToggleStrike?: (optionId: string) => void;
}

const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  selectedOption,
  showExplanation,
  onSelectOption,
  onToggleExplanation,
  isAnswered,
  isCorrect,
  onMarkAnswer,
  fontSize = 16,
  strikedOptions = [],
  onToggleStrike
}) => {
  const [isVerified, setIsVerified] = React.useState(false);
  const [hoveredOption, setHoveredOption] = React.useState<string | null>(null);
  
  return (
    <Card className="bg-white shadow-lg border border-purple-200 rounded-xl overflow-visible relative">
      <div className="p-6 space-y-6">
        {/* Question Header */}
        <div className="space-y-4">
          {/* Question Number and Tags */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold px-4 py-2 rounded-lg text-sm shadow-md">
                  <Award className="w-4 h-4 mr-2" />
                  Questão {currentQuestionIndex + 1}
                </div>
                
                {question.area && (
                  <Badge className="bg-purple-100 text-purple-700 border-purple-300 px-3 py-1 text-xs font-medium rounded-full">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {question.area}
                    {question.tags && question.tags[0] && (
                      <span className="ml-2 text-purple-600">• {question.tags[0]}</span>
                    )}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Question Text */}
          <div className="bg-white p-6 rounded-lg border border-purple-300">
            <div 
              className="text-gray-800 leading-relaxed text-justify font-semibold"
              style={{ fontSize: `${fontSize + 2}px` }}
            >
              {question.text}
            </div>
          </div>
        </div>
        
        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option) => {
            const isOptionSelected = selectedOption === option.id;
            const isCorrectOption = option.id === question.correctOption;
            const isStriked = strikedOptions.includes(option.id);
            const isHovered = hoveredOption === option.id;
            
            return (
              <div
                key={option.id}
                className="relative flex items-center"
                onMouseEnter={() => setHoveredOption(option.id)}
                onMouseLeave={(e) => {
                  // Only hide if mouse is not moving to the scissors area
                  const rect = e.currentTarget.getBoundingClientRect();
                  const mouseX = e.clientX;
                  const leftBoundary = rect.left - 60; // Give some buffer for the scissors area
                  
                  if (mouseX < leftBoundary) {
                    // Mouse is far to the left, hide
                    setHoveredOption(null);
                  } else if (mouseX > rect.right) {
                    // Mouse is to the right, hide
                    setHoveredOption(null);
                  }
                  // If mouse is in the scissors area, keep hover active
                }}
              >
                {/* Scissors Icon - positioned absolutely relative to the option */}
                {onToggleStrike && (
                  <div 
                    className={cn(
                      "absolute -left-14 top-1/2 transform -translate-y-1/2 bg-white border border-purple-300 hover:bg-purple-50 text-purple-600 p-2 rounded-full shadow-lg transition-all duration-200",
                      (isHovered || isStriked) && !isVerified
                        ? "opacity-100 visible z-50"
                        : "opacity-0 invisible pointer-events-none"
                    )}
                    onMouseEnter={() => setHoveredOption(option.id)}
                    onMouseLeave={() => setHoveredOption(null)}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStrike(option.id);
                      }}
                      className="w-4 h-4 flex items-center justify-center"
                    >
                      <Scissors className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <motion.div
                  className={cn(
                    "group flex items-center p-4 rounded-lg border transition-all duration-200 cursor-pointer w-full bg-white",
                    !isVerified && "hover:bg-purple-50 hover:border-purple-400",
                    isOptionSelected && !isVerified && "border-purple-500 bg-purple-50 shadow-md",
                    isVerified && isCorrectOption && "border-green-500 bg-green-50 shadow-md",
                    isVerified && isOptionSelected && !isCorrectOption && "border-red-500 bg-red-50 shadow-md",
                    isVerified && !isOptionSelected && !isCorrectOption && "opacity-60 border-gray-200",
                    !isVerified && !isOptionSelected && "border-purple-300 hover:shadow-sm"
                  )}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  onClick={() => !isVerified && onSelectOption(option.id)}
                >
                  {/* Option Letter */}
                  <div className="mr-4 flex-shrink-0 flex items-center">
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-lg border-2 text-sm font-bold transition-all duration-200",
                      isOptionSelected && !isVerified && "border-purple-500 bg-purple-600 text-white shadow-md",
                      isVerified && isCorrectOption && "border-green-500 bg-green-600 text-white shadow-md",
                      isVerified && isOptionSelected && !isCorrectOption && "border-red-500 bg-red-600 text-white shadow-md",
                      !isOptionSelected && !isVerified && "border-purple-400 text-purple-700 bg-white group-hover:border-purple-500 group-hover:text-purple-800"
                    )}>
                      {option.id}
                    </div>
                  </div>
                  
                  {/* Option Text */}
                  <div className="flex-1">
                    <p 
                      className={cn(
                        "text-gray-800 leading-relaxed text-justify",
                        isStriked && "line-through opacity-50"
                      )}
                      style={{ fontSize: `${fontSize - 1}px` }}
                    >
                      {option.text}
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Verify Button */}
        {selectedOption && !isVerified && (
          <div className="flex justify-center pt-4">
            <Button 
              size="lg" 
              onClick={() => setIsVerified(true)}
              className="min-w-[200px] bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Verificar Resposta
            </Button>
          </div>
        )}

        {/* Explanation Button */}
        {isVerified && (
          <div className="flex justify-center pt-4">
            <Button 
              variant="outline" 
              onClick={onToggleExplanation}
              className="gap-2 min-w-[180px] hover:bg-purple-50 border-purple-400 text-purple-700 font-medium py-2 px-4 rounded-lg transition-all duration-200"
            >
              <HelpCircle className="h-4 w-4" />
              {showExplanation ? 'Ocultar' : 'Ver'} Explicação
            </Button>
          </div>
        )}

        {/* Explanation */}
        {showExplanation && (
          <Card className="p-6 bg-white border border-purple-300 rounded-lg shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white flex-shrink-0 shadow-md">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg text-purple-800 mb-3">Explicação da Questão:</h4>
                <p 
                  className="text-gray-700 leading-relaxed text-justify"
                  style={{ fontSize: `${fontSize - 1}px` }}
                >
                  {question.explanation}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Card>
  );
};

export default QuestionView;
