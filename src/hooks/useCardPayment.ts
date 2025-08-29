
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CardData {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

interface CardPaymentResponse {
  status: string;
  message?: string;
}

interface ErrorResponse {
  error: {
    errors: Array<{
      code: string;
      description: string;
    }>;
  };
}

export const useCardPayment = () => {
  const [loading, setLoading] = useState(false);
  const [paymentApproved, setPaymentApproved] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { toast } = useToast();

  const processCardPayment = async (
    planId: number, 
    userId: string, 
    cardData: CardData,
    planUserId?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    setPaymentError(null);
    
    try {
      console.log('Processando pagamento no cartão para plano:', planId, 'usuário:', userId, 'planUserId:', planUserId);
      
      const requestBody = {
        plans_user_id: planUserId || null,
        creditCard: {
          holderName: cardData.holderName,
          number: cardData.number,
          expiryMonth: cardData.expiryMonth,
          expiryYear: cardData.expiryYear,
          ccv: cardData.ccv
        }
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`https://menthor.tec.br/api/payment/card/${planId}/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      // Tentar parsear a resposta como JSON primeiro
      let responseData: CardPaymentResponse | ErrorResponse;
      try {
        responseData = await response.json();
      } catch (parseError) {
        throw new Error('Erro ao processar resposta do servidor');
      }

      console.log('Resposta do pagamento por cartão:', responseData);

      if (!response.ok) {
        // Verificar se a resposta contém o formato de erro esperado
        if ('error' in responseData && responseData.error?.errors?.length > 0) {
          const errorMessage = responseData.error.errors[0].description;
          setPaymentError(errorMessage);
          toast({
            title: "Erro no pagamento",
            description: errorMessage,
            variant: "destructive",
          });
          return { success: false, error: errorMessage };
        } else {
          throw new Error('Erro na requisição de pagamento');
        }
      }

      const data = responseData as CardPaymentResponse;

      if (data.status === 'CONFIRMED') {
        setPaymentApproved(true);
        toast({
          title: "Pagamento aprovado!",
          description: "Seu pagamento foi processado com sucesso.",
        });
        return { success: true };
      } else {
        const errorMessage = data.message || 'Pagamento negado. Verifique os dados do cartão e tente novamente.';
        setPaymentError(errorMessage);
        toast({
          title: "Pagamento negado",
          description: errorMessage,
          variant: "destructive",
        });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Erro ao processar pagamento por cartão:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao processar pagamento. Tente novamente.';
      setPaymentError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resetPaymentState = () => {
    setPaymentApproved(false);
    setPaymentError(null);
  };

  return {
    loading,
    paymentApproved,
    paymentError,
    processCardPayment,
    resetPaymentState
  };
};
