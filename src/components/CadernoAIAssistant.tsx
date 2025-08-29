
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { generateCompletion } from '@/services/openaiCadernos';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import OpenAIConfig from './OpenAIConfig';

interface CadernoAIAssistantProps {
  cadernoTitle?: string;
  cadernoContent?: string;
}

const CadernoAIAssistant = ({ cadernoTitle, cadernoContent }: CadernoAIAssistantProps) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResponse('');

    try {
      const context = cadernoTitle 
        ? `Este prompt está relacionado ao caderno "${cadernoTitle}".`
        : undefined;

      const result = await generateCompletion({ 
        prompt,
        context
      });

      setResponse(result.content);
    } catch (error) {
      console.error("Erro ao enviar prompt:", error);
      setResponse("Ocorreu um erro ao processar sua solicitação. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8">
      {!showAssistant ? (
        <Button 
          onClick={() => setShowAssistant(true)}
          className="bg-[#4F1964] hover:bg-[#6B3182] flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Abrir Assistente IA</span>
        </Button>
      ) : (
        <Card className="border border-[#4F1964]/10 shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-[#4F1964]">Assistente IA</CardTitle>
              <OpenAIConfig className="h-8" />
            </div>
            <CardDescription>
              Use o poder da IA para melhorar suas anotações, criar resumos, gerar perguntas de estudo e mais.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="O que você deseja fazer com seu caderno? Ex: 'Resumir este tópico', 'Criar perguntas de estudo', 'Explicar este conceito'..."
                className="min-h-[120px] border-[#4F1964]/20 focus:border-[#4F1964]"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
              />
              
              {response && (
                <div className="mt-4 p-4 bg-[#F8E6FF]/30 rounded-md whitespace-pre-wrap">
                  {response}
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="justify-between">
            <Button 
              variant="outline" 
              onClick={() => setShowAssistant(false)}
            >
              Fechar
            </Button>
            <Button 
              type="submit" 
              className="bg-[#4F1964] hover:bg-[#6B3182]"
              disabled={isLoading || !prompt.trim()}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default CadernoAIAssistant;
