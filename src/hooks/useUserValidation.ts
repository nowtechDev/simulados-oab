
import { supabase } from '@/integrations/supabase/client';

interface UserValidationResult {
  userExists: boolean;
  hasActivePlan: boolean;
  userId?: string;
  message?: string;
}

export const useUserValidation = () => {
  const validateUser = async (email: string, planId: number): Promise<UserValidationResult> => {
    try {
      console.log('Validating user with email:', email, 'for plan:', planId);
      
      const normalizedEmail = email.toLowerCase().trim();
      console.log('Normalized email:', normalizedEmail);

      // Buscar usuário pelo email, incluindo aqueles com type_user nulo ou 2
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id, cpfCnpj, name, lastname, phone, email, type_user')
        .eq('email', normalizedEmail)
        .maybeSingle();

      console.log('User query with email:', normalizedEmail);
      console.log('User query result:', { existingUser, userError });

      if (userError) {
        console.error('Erro ao buscar usuário:', userError);
        throw userError;
      }

      if (!existingUser) {
        console.log('User not found, treating as new user');
        return { userExists: false, hasActivePlan: false };
      }

      console.log('User found:', existingUser);

      // Verificar se o usuário é admin (type_user = 1)
      if (existingUser.type_user === 1) {
        console.log('User is admin, blocking purchase');
        return {
          userExists: true,
          hasActivePlan: true, // Usamos true para bloquear o processo
          userId: existingUser.id,
          message: 'Usuários administrativos não podem efetuar compras de planos.'
        };
      }

      // Se o usuário existe mas type_user é nulo, vamos atualizar para 2
      if (existingUser.type_user === null) {
        console.log('Updating user type_user to 2 for existing user');
        const { error: updateError } = await supabase
          .from('users')
          .update({ type_user: 2 })
          .eq('id', existingUser.id);

        if (updateError) {
          console.error('Erro ao atualizar type_user:', updateError);
        } else {
          console.log('Successfully updated type_user to 2');
        }
      }

      // Se o usuário existe, verificar se tem plano ativo
      const { data: activePlan, error: planError } = await supabase
        .from('plans_user')
        .select('expiration')
        .eq('user_id', existingUser.id)
        .eq('plan_id', planId)
        .eq('status', true)
        .maybeSingle();

      console.log('Plan query result:', { activePlan, planError });

      if (planError) {
        console.error('Erro ao buscar plano:', planError);
        throw planError;
      }

      if (activePlan && activePlan.expiration) {
        const expirationDate = new Date(activePlan.expiration);
        const today = new Date();
        
        if (expirationDate > today) {
          return {
            userExists: true,
            hasActivePlan: true,
            userId: existingUser.id,
            message: 'Você já possui este plano ativo.'
          };
        }
      }

      return {
        userExists: true,
        hasActivePlan: false,
        userId: existingUser.id
      };
    } catch (error) {
      console.error('Erro na validação:', error);
      throw error;
    }
  };

  return { validateUser };
};
