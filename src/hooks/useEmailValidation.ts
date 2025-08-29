
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUserValidation } from './useUserValidation';
import { usePlanUserManagement } from './usePlanUserManagement';

export const useEmailValidation = (planId: number) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const { toast } = useToast();
  const { validateUser } = useUserValidation();
  const { createPlanUserEntry } = usePlanUserManagement();

  const validateUserEmail = async (
    email: string,
    onNewUser: (email: string) => void,
    onExistingUser: (userData: any) => void
  ) => {
    setIsLoading(true);
    setLoginError('');
    
    try {
      const result = await validateUser(email, planId);
      
      if (result.hasActivePlan) {
        toast({
          title: "Plano já ativo",
          description: result.message,
          variant: "destructive",
        });
        return null;
      }

      if (result.userExists) {
        return result;
      } else {
        onNewUser(email);
        return null;
      }
    } catch (error: any) {
      console.error('Erro na validação de email:', error);
      toast({
        title: "Erro",
        description: "Não foi possível validar o email",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const loginExistingUser = async (
    email: string,
    password: string,
    onExistingUser: (userData: any) => void
  ) => {
    setIsLoading(true);
    setLoginError('');

    try {
      // Fazer login para verificar a senha
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        console.error('Erro no login:', loginError);
        setLoginError('Email ou senha incorretos');
        return;
      }

      // Buscar dados do usuário
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, lastname, email, phone, cpfCnpj')
        .eq('id', loginData.user.id)
        .single();

      if (userError) {
        console.error('Erro ao buscar dados do usuário:', userError);
        setLoginError('Erro ao carregar dados do usuário');
        return;
      }

      // Criar entrada na tabela plans_user
      const planUserResult = await createPlanUserEntry(userData.id, planId);
      
      // Fazer logout após obter os dados
      await supabase.auth.signOut();

      if (planUserResult.success) {
        onExistingUser({
          userId: userData.id,
          planUserId: planUserResult.planUserId,
          name: userData.name,
          lastname: userData.lastname,
          email: userData.email,
          phone: userData.phone,
          cpfCnpj: userData.cpfCnpj
        });
      } else {
        setLoginError('Erro ao processar o plano');
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      setLoginError('Erro interno. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    loginError,
    setLoginError,
    validateUserEmail,
    loginExistingUser
  };
};
