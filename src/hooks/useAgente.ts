
import { useState } from 'react';
import { agenteManager } from '@/services/agenteManager';
import { AgenteExecutionParams, AgenteResponse } from '@/types/agente';
import { useToast } from '@/hooks/use-toast';

export const useAgente = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AgenteResponse | null>(null);
  const { toast } = useToast();

  const executeAgente = async (params: AgenteExecutionParams) => {
    setIsLoading(true);
    try {
      const result = await agenteManager.executeAgente(params);
      setResponse(result);
      
      if (!result.success) {
        toast({
          title: "Erro no Agente",
          description: result.error,
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error: any) {
      const errorResult = {
        success: false,
        error: error.message
      };
      setResponse(errorResult);
      
      toast({
        title: "Erro no Agente",
        description: error.message,
        variant: "destructive"
      });
      
      return errorResult;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    executeAgente,
    isLoading,
    response,
    setResponse
  };
};
