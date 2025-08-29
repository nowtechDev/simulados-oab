import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PixPaymentData {
  success: boolean;
  encodedImage: string;
  payload: string;
  expirationDate: string;
}

interface PaymentStatusData {
  status: boolean;
}

export const usePixPayment = () => {
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<PixPaymentData | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const { toast } = useToast();

  const createPixPayment = async (planId: number, userId: string, planUserId?: string): Promise<{ success: boolean; paymentId?: string }> => {
    setLoading(true);
    try {
      console.log('Criando pagamento PIX para plano:', planId, 'usuário:', userId, 'planUserId:', planUserId);
      
      const requestBody: any = {
        plan_id: planId,
        user_id: userId
      };

      // Adicionar plans_user_id se fornecido (com 's' para corresponder à API)
      if (planUserId) {
        requestBody.plans_user_id = planUserId;
      }

      console.log('Request body PIX:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`https://menthor.tec.br/api/payment/pix/${planId}/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Erro ao criar pagamento PIX');
      }

      const data = await response.json();
      console.log('Resposta da criação do PIX:', data);

      if (data.id) {
        setPaymentId(data.id);
        await getPixQRCode(data.id);
        return { success: true, paymentId: data.id };
      } else {
        throw new Error('ID do pagamento não retornado');
      }
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PIX. Tente novamente.",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const getPixQRCode = async (paymentId: string): Promise<boolean> => {
    try {
      console.log('Buscando QR Code do PIX para pagamento:', paymentId);
      
      const response = await fetch(`https://menthor.tec.br/api/pix-asaas/${paymentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar QR Code do PIX');
      }

      const data: PixPaymentData = await response.json();
      console.log('Dados do PIX recebidos:', data);

      if (data.success) {
        setPixData(data);
        return true;
      } else {
        throw new Error('Dados do PIX inválidos');
      }
    } catch (error) {
      console.error('Erro ao buscar QR Code do PIX:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o QR Code do PIX.",
        variant: "destructive",
      });
      return false;
    }
  };

  const copyPixCode = () => {
    if (pixData?.payload) {
      navigator.clipboard.writeText(pixData.payload);
      toast({
        title: "Código copiado!",
        description: "O código PIX foi copiado para a área de transferência.",
      });
    }
  };

  return {
    loading,
    pixData,
    paymentId,
    createPixPayment,
    getPixQRCode,
    copyPixCode
  };
};
