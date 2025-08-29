
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCheckoutUser } from '@/hooks/useCheckoutUser';
import { useCheckoutForm } from '@/hooks/useCheckoutForm';
import { ExistingUserDataDisplay } from './ExistingUserDataDisplay';
import { NewUserRegistrationForm } from './NewUserRegistrationForm';
import { useToast } from '@/hooks/use-toast';

interface CheckoutUserFormProps {
  planId: number;
  email?: string;
  existingUserData?: {
    userId: string; 
    planUserId?: string; 
    name: string; 
    lastname: string;
    email: string; 
    phone: string; 
    cpfCnpj: string 
  };
  onUserValidated: (userData: { 
    userId: string; 
    planUserId?: string; 
    name: string; 
    email: string; 
    phone: string; 
    cpfCnpj: string 
  }) => void;
}

export const CheckoutUserForm: React.FC<CheckoutUserFormProps> = ({ 
  planId, 
  email = '',
  existingUserData,
  onUserValidated 
}) => {
  const { createOrUpdateUser, loading } = useCheckoutUser();
  const { toast } = useToast();
  const {
    formData,
    updateFormData,
    showPassword,
    setShowPassword,
    isExistingUser
  } = useCheckoutForm(email, existingUserData);

  const validateRequiredFields = () => {
    const errors = [];
    
    if (!formData.name.trim()) {
      errors.push('Nome é obrigatório');
    }
    
    if (!formData.lastname.trim()) {
      errors.push('Sobrenome é obrigatório');
    }
    
    if (!formData.email.trim()) {
      errors.push('Email é obrigatório');
    }
    
    if (!formData.phone.trim()) {
      errors.push('Telefone é obrigatório');
    }
    
    if (!formData.cpfCnpj.trim()) {
      errors.push('CPF/CNPJ é obrigatório');
    }
    
    // Para novos usuários, senha é obrigatória
    if (!isExistingUser && !formData.password.trim()) {
      errors.push('Senha é obrigatória para novos usuários');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obrigatórios
    const validationErrors = validateRequiredFields();
    if (validationErrors.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: validationErrors.join(', '),
        variant: "destructive",
      });
      return;
    }
    
    // Se for usuário existente, apenas validar e prosseguir
    if (existingUserData) {
      console.log('CheckoutUserForm - Processando usuário existente, planUserId:', existingUserData.planUserId);
      onUserValidated({
        userId: existingUserData.userId,
        planUserId: existingUserData.planUserId,
        name: `${formData.name} ${formData.lastname}`.trim(),
        email: formData.email,
        phone: formData.phone,
        cpfCnpj: formData.cpfCnpj
      });
      return;
    }

    // Para novo usuário, criar conta
    console.log('CheckoutUserForm - Criando novo usuário para planId:', planId);
    console.log('CheckoutUserForm - Dados do formulário:', {
      name: formData.name,
      lastname: formData.lastname,
      email: formData.email,
      phone: formData.phone,
      cpfCnpj: formData.cpfCnpj,
      hasPassword: !!formData.password
    });
    
    const result = await createOrUpdateUser({
      name: formData.name,
      lastname: formData.lastname,
      email: formData.email,
      phone: formData.phone,
      cpfCnpj: formData.cpfCnpj,
      password: formData.password
    }, planId);
    
    console.log('CheckoutUserForm - Resultado da criação do usuário:', result);
    
    if (result.success && result.userId) {
      console.log('CheckoutUserForm - Usuário criado com sucesso, prosseguindo para pagamento');
      console.log('CheckoutUserForm - Chamando onUserValidated com planUserId:', result.planUserId);
      onUserValidated({
        userId: result.userId,
        planUserId: result.planUserId,
        name: `${formData.name} ${formData.lastname}`.trim(),
        email: formData.email,
        phone: formData.phone,
        cpfCnpj: formData.cpfCnpj
      });
    } else {
      console.log('CheckoutUserForm - Falha na criação do usuário');
      toast({
        title: "Erro",
        description: "Não foi possível processar seus dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isExistingUser ? 'Confirme seus dados' : 'Dados Pessoais'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isExistingUser ? (
            <ExistingUserDataDisplay 
              formData={formData}
              updateFormData={updateFormData}
            />
          ) : (
            <NewUserRegistrationForm
              formData={formData}
              updateFormData={updateFormData}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          )}

          <Button 
            type="submit" 
            className="w-full bg-[#4F1964] hover:bg-[#6B3182]"
            disabled={loading}
          >
            {loading ? 'Processando...' : 'Continuar para Pagamento'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
