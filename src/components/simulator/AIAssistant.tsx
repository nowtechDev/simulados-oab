
import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea";

interface AIAssistantProps {
  aiQuery: string;
  aiResponse: string;
  isQueryingAI: boolean;
  setAiQuery: (query: string) => void;
  onQueryAI: () => void;
}

const formatTextWithBold = (text: string) => {
  // Split text by asterisks and create spans with bold formatting
  const parts = text.split(/\*\*(.*?)\*\*/g);
  
  return parts.map((part, index) => {
    // Every odd index (1, 3, 5...) is content between asterisks
    if (index % 2 === 1) {
      return <strong key={index}>{part}</strong>;
    }
    return part;
  });
};

const AIAssistant = ({
  aiQuery,
  aiResponse,
  isQueryingAI,
  setAiQuery,
  onQueryAI
}: AIAssistantProps) => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
      <h3 className="font-medium mb-4 flex items-center gap-2">
        <HelpCircle className="h-4 w-4 text-purple-600" />
        <span className="text-purple-800">Assistente de Estudo</span>
      </h3>
      
      <div className="space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2 text-purple-700">Tire suas dúvidas sobre esta questão com o Menthor:</label>
          <Textarea 
            placeholder="Ex: Por que a alternativa B está incorreta? Qual o fundamento legal desta questão?" 
            value={aiQuery} 
            onChange={e => setAiQuery(e.target.value)} 
            className="min-h-[80px] resize-none border-purple-300 focus:border-purple-500 focus:ring-purple-200" 
          />
        </div>
        
        <Button 
          onClick={onQueryAI} 
          disabled={isQueryingAI} 
          className="w-full flex gap-2 items-center justify-center bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
        >
          {isQueryingAI ? (
            <>
              <div className="h-4 w-4 border-t-2 border-white rounded-full animate-spin" />
              Consultando IA...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Enviar pergunta
            </>
          )}
        </Button>
        
        {aiResponse && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm mt-4"
          >
            <h4 className="font-medium text-sm mb-2 text-purple-800">Resposta do Menthor:</h4>
            <div className="text-sm text-gray-700 whitespace-pre-line">
              {formatTextWithBold(aiResponse)}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
