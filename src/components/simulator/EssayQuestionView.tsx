
import React from 'react';
import { ExamQuestion } from '@/types/simulator';
import { Textarea } from '@/components/ui/textarea';

interface EssayQuestionViewProps {
  question: ExamQuestion;
  questionNumber: number;
  answer: string;
  onAnswerChange: (questionId: number, answer: string) => void;
}

const EssayQuestionView = ({
  question,
  questionNumber,
  answer,
  onAnswerChange
}: EssayQuestionViewProps) => {
  // Split answer into parts (A and B)
  const parts = answer.split('===PART_SEPARATOR===');
  const answerA = parts[0] || '';
  const answerB = parts[1] || '';

  // Separate handlers for part A and part B
  const handleAnswerAChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswer = `${e.target.value}===PART_SEPARATOR===${answerB}`;
    onAnswerChange(question.id, newAnswer);
  };

  const handleAnswerBChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswer = `${answerA}===PART_SEPARATOR===${e.target.value}`;
    onAnswerChange(question.id, newAnswer);
  };

  // Calculate total points for this question
  const totalPoints = (question.pointsA || 0) + (question.pointsB || 0);

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-lg text-purple-800 mb-2">
            Questão {questionNumber} 
            {totalPoints > 0 && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({totalPoints.toFixed(2)} pontos)
              </span>
            )}
          </h4>
          
          <div className="bg-white border border-gray-200 rounded-md p-4 mb-6">
            <p className="text-sm text-gray-700 whitespace-pre-line text-justify">{question.text}</p>
          </div>
        </div>

        {/* Part A */}
        <div className="space-y-2">
          <h5 className="font-medium text-purple-700 mb-2 flex items-start">
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md mr-2 font-bold">Letra A</span>
            {question.pointsA && <span className="text-sm text-gray-500 mt-1">({question.pointsA.toFixed(2)} pontos)</span>}
          </h5>
          <Textarea
            value={answerA}
            onChange={handleAnswerAChange}
            placeholder="Digite sua resposta para a letra A..."
            className="min-h-[150px] font-mono text-sm text-justify"
            style={{ resize: 'vertical', height: '150px' }}
          />
        </div>

        {/* Part B */}
        <div className="space-y-2 mt-6">
          <h5 className="font-medium text-purple-700 mb-2 flex items-start">
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md mr-2 font-bold">Letra B</span>
            {question.pointsB && <span className="text-sm text-gray-500 mt-1">({question.pointsB.toFixed(2)} pontos)</span>}
          </h5>
          <Textarea
            value={answerB}
            onChange={handleAnswerBChange}
            placeholder="Digite sua resposta para a letra B..."
            className="min-h-[150px] font-mono text-sm text-justify"
            style={{ resize: 'vertical', height: '150px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default EssayQuestionView;
