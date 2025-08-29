
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUserValidation } from './useUserValidation';
import { useUserCreation } from './useUserCreation';
import { usePlanUserManagement } from './usePlanUserManagement';

interface CheckoutUserData {
  name: string;
  lastname?: string;
  email: string;
  phone: string;
  cpfCnpj: string;
  password?: string;
}

interface UserValidationResult {
  userExists: boolean;
  hasActivePlan: boolean;
  userId?: string;
  message?: string;
}

export const useCheckoutUser = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { validateUser } = useUserValidation();
  const { createUser, updateUser } = useUserCreation();
  const { createPlanUserEntry } = usePlanUserManagement();

  const createOrUpdateUser = async (userData: CheckoutUserData, planId: number): Promise<{ success: boolean; userId?: string; planUserId?: string }> => {
    setLoading(true);
    try {
      console.log('useCheckoutUser - Iniciando processo de criação/atualização do usuário');
      console.log('useCheckoutUser - Dados recebidos:', {
        email: userData.email,
        name: userData.name,
        lastname: userData.lastname,
        phone: userData.phone,
        cpfCnpj: userData.cpfCnpj,
        planId,
        hasPassword: !!userData.password
      });

      // Primeiro, validar o usuário
      console.log('useCheckoutUser - Validando usuário...');
      const validation = await validateUser(userData.email, planId);
      console.log('useCheckoutUser - Resultado da validação:', validation);
      
      if (validation.hasActivePlan) {
        console.log('useCheckoutUser - Usuário já tem plano ativo, bloqueando processo');
        toast({
          title: "Plano já ativo",
          description: validation.message,
          variant: "destructive",
        });
        return { success: false };
      }

      let userId = validation.userId;

      if (validation.userExists && userId) {
        console.log('useCheckoutUser - Usuário já existe, atualizando dados');
        // Usuário já existe, apenas atualizar os dados
        const updateResult = await updateUser(userId, userData);
        if (!updateResult.success) {
          console.log('useCheckoutUser - Falha na atualização do usuário');
          return { success: false };
        }
        console.log('useCheckoutUser - Usuário atualizado com sucesso');
      } else {
        console.log('useCheckoutUser - Usuário não existe, criando novo usuário');
        // Usuário não existe, criar novo
        const createResult = await createUser(userData);
        if (!createResult.success || !createResult.userId) {
          console.log('useCheckoutUser - Falha na criação do usuário');
          return { success: false };
        }
        userId = createResult.userId;
        console.log('useCheckoutUser - Novo usuário criado com sucesso, ID:', userId);
      }

      // Criar entrada na tabela plans_user
      console.log('useCheckoutUser - Criando entrada na tabela plans_user para userId:', userId, 'planId:', planId);
      const planUserResult = await createPlanUserEntry(userId, planId);
      if (!planUserResult.success) {
        console.log('useCheckoutUser - Falha na criação da entrada plans_user');
        return { success: false };
      }

      console.log('useCheckoutUser - Processo concluído com sucesso');
      console.log('useCheckoutUser - Retornando:', {
        success: true,
        userId,
        planUserId: planUserResult.planUserId
      });

      return { 
        success: true, 
        userId, 
        planUserId: planUserResult.planUserId 
      };
    } catch (error: any) {
      console.error('useCheckoutUser - Erro no processo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar os dados do usuário",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    validateUser,
    createOrUpdateUser
  };
};
