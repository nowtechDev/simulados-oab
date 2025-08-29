import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import promptSelecaoQuestoes from '@/services/prompts/promptSelecaoQuestoes';

interface AgenteSelecaoProps {
  agenteId?: string;
}

const AgenteSelecaoEditor = ({ agenteId }: AgenteSelecaoProps) => {
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchAgente = async () => {
      setIsLoading(true);
      try {
        // Se não houver ID, buscar o agente IA Civil
        const { data, error } = await supabase
          .from('agentes_ia')
          .select('*')
          .eq('nome', 'IA Civil')
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setPrompt(data.prompt || '');
        }
      } catch (error) {
        console.error('Erro ao buscar agente:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar o agente',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAgente();
  }, [agenteId]);
  
  const resetToDefault = () => {
    setPrompt(promptSelecaoQuestoes);
  };
  
  const savePrompt = async () => {
    setIsSaving(true);
    try {
      // Se não houver ID, buscar o agente IA Civil
      const { data: agente, error: fetchError } = await supabase
        .from('agentes_ia')
        .select('id')
        .eq('nome', 'IA Civil')
        .single();
        
      if (fetchError) {
        throw fetchError;
      }
      
      if (!agente) {
        throw new Error('Agente não encontrado');
      }
      
      // Atualizar o prompt
      const { error } = await supabase
        .from('agentes_ia')
        .update({ prompt })
        .eq('id', agente.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Sucesso',
        description: 'Prompt do agente atualizado com sucesso',
      });
    } catch (error) {
      console.error('Erro ao salvar prompt:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o prompt',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4F1964]"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Editor de Prompt - Agente de Seleção de Questões</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prompt do Agente IA Civil
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
              placeholder="Digite o prompt do agente aqui..."
            />
          </div>
          
          <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
            <p className="text-amber-800 text-sm">
              <strong>Dicas para um prompt eficaz:</strong>
            </p>
            <ul className="list-disc list-inside text-amber-700 text-sm mt-2 space-y-1">
              <li>Seja extremamente claro sobre o formato de saída (array JSON com IDs)</li>
              <li>Evite solicitar explicações ou texto adicional</li>
              <li>Forneça critérios específicos para seleção de questões</li>
              <li>Mantenha as instruções diretas e objetivas</li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={resetToDefault}
          disabled={isSaving}
        >
          Restaurar Padrão
        </Button>
        <Button 
          onClick={savePrompt}
          disabled={isSaving}
          className="bg-[#4F1964]"
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
              Salvando...
            </>
          ) : 'Salvar Prompt'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AgenteSelecaoEditor;
