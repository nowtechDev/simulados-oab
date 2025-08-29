
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePlanUserManagement = () => {
  const { toast } = useToast();

  const createPlanUserEntry = async (userId: string, planId: number): Promise<{ success: boolean; planUserId?: string }> => {
    try {
      // Primeiro, buscar informações do plano para pegar o valor
      const { data: planData, error: planInfoError } = await supabase
        .from('plans')
        .select('price')
        .eq('id', planId)
        .single();

      if (planInfoError) {
        console.error('Erro ao buscar informações do plano:', planInfoError);
        throw planInfoError;
      }

      if (!planData) {
        throw new Error('Plano não encontrado');
      }

      // Criar entrada na tabela plans_user com o valor real do plano
      const { data: planUserData, error: planUserError } = await supabase
        .from('plans_user')
        .insert({
          user_id: userId,
          plan_id: planId,
          value: planData.price, // Valor real do plano
          expiration: null, // Será preenchido após confirmação do pagamento
          status: false // Por padrão false
        })
        .select('id')
        .single();

      if (planUserError) {
        console.error('Erro ao criar entrada plans_user:', planUserError);
        throw planUserError;
      }

      console.log('Entrada plans_user criada com sucesso:', planUserData);
      return { success: true, planUserId: planUserData.id.toString() };
    } catch (error: any) {
      console.error('Erro ao criar entrada plans_user:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar o plano",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  return { createPlanUserEntry };
};
