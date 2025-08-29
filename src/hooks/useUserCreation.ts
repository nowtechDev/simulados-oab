
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserCreationData {
  name: string;
  lastname?: string;
  email: string;
  phone: string;
  cpfCnpj: string;
  password?: string;
}

export const useUserCreation = () => {
  const { toast } = useToast();

  const createUser = async (userData: UserCreationData): Promise<{ success: boolean; userId?: string }> => {
    try {
      if (!userData.password) {
        toast({
          title: "Erro",
          description: "Senha é obrigatória para novos usuários",
          variant: "destructive",
        });
        return { success: false };
      }

      console.log('Criando novo usuário no Auth...');
      
      let userId: string;

      try {
        // Tentar criar usuário no Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              name: userData.name,
              lastname: userData.lastname
            }
          }
        });

        if (authError) {
          // Se o erro for "User already registered", significa que o usuário existe no Auth mas não na nossa tabela
          if (authError.message.includes('User already registered')) {
            console.log('Usuário já existe no Auth, mas não na tabela users. Buscando ID do Auth...');
            
            // Tentar fazer login para obter o ID do usuário
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
              email: userData.email,
              password: userData.password,
            });

            if (loginError) {
              console.error('Erro ao fazer login para obter ID:', loginError);
              toast({
                title: "Erro",
                description: "Usuário existe no sistema mas não foi possível acessar. Entre em contato com o suporte.",
                variant: "destructive",
              });
              return { success: false };
            }

            userId = loginData.user.id;
            console.log('ID do usuário obtido via login:', userId);

            // Fazer logout imediatamente
            await supabase.auth.signOut();
          } else {
            console.error('Erro ao criar usuário no Auth:', authError);
            toast({
              title: "Erro ao criar conta",
              description: authError.message,
              variant: "destructive",
            });
            throw authError;
          }
        } else {
          if (!authData.user) {
            throw new Error('Usuário não foi criado no Auth');
          }
          userId = authData.user.id;
          console.log('Usuário criado no Auth com ID:', userId);
        }

        // Aguardar um pouco para garantir que o trigger execute
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verificar se o usuário já foi criado pelo trigger
        const { data: existingUserAfterAuth, error: checkError } = await supabase
          .from('users')
          .select('id')
          .eq('id', userId)
          .maybeSingle();

        if (checkError) {
          console.error('Erro ao verificar usuário após criação no Auth:', checkError);
          throw checkError;
        }

        if (!existingUserAfterAuth) {
          // Se não existe, criar o registro manualmente com type_user = 2
          console.log('Criando registro na tabela users...');
          const { error: userError } = await supabase
            .from('users')
            .insert({
              id: userId,
              email: userData.email,
              name: userData.name,
              lastname: userData.lastname || '',
              phone: userData.phone,
              cpfCnpj: userData.cpfCnpj,
              doc: 'CPF',
              type_user: 2  // IMPORTANTE: Sempre definir como 2
            });

          if (userError) {
            console.error('Erro ao criar usuário na tabela users:', userError);
            throw userError;
          }
        } else {
          // Se já existe (criado pelo trigger), apenas atualizar com os dados completos
          console.log('Atualizando registro criado pelo trigger...');
          const { error: updateError } = await supabase
            .from('users')
            .update({
              name: userData.name,
              lastname: userData.lastname || '',
              phone: userData.phone,
              cpfCnpj: userData.cpfCnpj,
              doc: 'CPF',
              type_user: 2  // IMPORTANTE: Sempre definir como 2
            })
            .eq('id', userId);

          if (updateError) {
            console.error('Erro ao atualizar usuário criado pelo trigger:', updateError);
            throw updateError;
          }
        }

        console.log('Usuário criado/atualizado com sucesso na tabela users:', userId);
        return { success: true, userId };
      } catch (error) {
        console.error('Erro no processo de criação do usuário:', error);
        throw error;
      }
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar os dados do usuário",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  const updateUser = async (userId: string, userData: UserCreationData): Promise<{ success: boolean }> => {
    try {
      console.log('Atualizando usuário existente:', userId);
      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: userData.name,
          lastname: userData.lastname || '',
          phone: userData.phone,
          cpfCnpj: userData.cpfCnpj,
          doc: 'CPF',
          type_user: 2  // Garantir que type_user seja 2
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Erro ao atualizar usuário:', updateError);
        throw updateError;
      }

      console.log('Usuário atualizado com sucesso:', userId);
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os dados do usuário",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  return { createUser, updateUser };
};
