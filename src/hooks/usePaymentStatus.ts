
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePaymentStatus = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkPaymentStatus = async (userId: string, planId: number, paymentId?: string): Promise<boolean> => {
    setLoading(true);
    try {
      console.log('Verificando status do pagamento para usuário:', userId, 'plano:', planId, 'paymentId:', paymentId);

      // Primeiro, verificar na tabela plans_user - buscar o mais recente
      const { data: planData, error: planError } = await supabase
        .from('plans_user')
        .select('expiration, status')
        .eq('user_id', userId)
        .eq('plan_id', planId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (planError) {
        console.error('Erro ao verificar plans_user:', planError);
        throw planError;
      }

      // Verificar se existe registro e se tem data de expiração e status true
      const hasValidPlanData = planData && 
        planData.expiration !== null && 
        planData.status === true;

      if (!hasValidPlanData) {
        console.log('Plano não encontrado ou dados inválidos');
        return false;
      }

      // Verificar se a data de expiração é maior que hoje
      const expirationDate = new Date(planData.expiration);
      const today = new Date();
      
      if (expirationDate <= today) {
        console.log('Plano expirado');
        return false;
      }

      // Se temos paymentId, verificar na tabela payments
      if (paymentId) {
        const { data: paymentData, error: paymentError } = await supabase
          .from('payments')
          .select('status, expiration')
          .eq('payment_id', paymentId)
          .maybeSingle();

        if (paymentError) {
          console.error('Erro ao verificar payments:', paymentError);
          // Não falhar por isso, pode ser que o pagamento ainda não esteja registrado
        } else if (paymentData) {
          const paymentStatus = paymentData.status?.toLowerCase();
          const isPaymentConfirmed = paymentStatus === 'received' || paymentStatus === 'confirmed';
          
          if (!isPaymentConfirmed) {
            console.log('Pagamento não confirmado. Status:', paymentStatus);
            return false;
          }

          // Verificar se a data de expiração do pagamento também é maior que hoje
          if (paymentData.expiration) {
            const paymentExpirationDate = new Date(paymentData.expiration);
            if (paymentExpirationDate <= today) {
              console.log('Pagamento expirado na tabela payments');
              return false;
            }
          }
        } else {
          console.log('Registro de pagamento não encontrado');
          return false;
        }
      }

      console.log('Pagamento confirmado - todas as validações passaram');
      
      toast({
        title: "Pagamento confirmado!",
        description: "Seu pagamento foi processado com sucesso.",
      });

      return true;
    } catch (error) {
      console.error('Erro ao verificar status do pagamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível verificar o status do pagamento.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    checkPaymentStatus
  };
};
