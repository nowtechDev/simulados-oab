
import React, { useState } from 'react';
import { EmailValidationForm } from './EmailValidationForm';
import { ExistingUserLoginForm } from './ExistingUserLoginForm';
import { useEmailValidation } from '@/hooks/useEmailValidation';

interface EmailValidationStepProps {
  onNewUser: (email: string) => void;
  onExistingUser: (userData: { 
    userId: string; 
    planUserId?: string; 
    name: string; 
    lastname: string;
    email: string; 
    phone: string; 
    cpfCnpj: string 
  }) => void;
  planId: number;
}

export const EmailValidationStep: React.FC<EmailValidationStepProps> = ({ 
  onNewUser, 
  onExistingUser,
  planId 
}) => {
  const [email, setEmail] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false);
  
  const {
    isLoading,
    loginError,
    setLoginError,
    validateUserEmail,
    loginExistingUser
  } = useEmailValidation(planId);

  const handleEmailValidation = async (emailValue: string) => {
    setEmail(emailValue);
    const result = await validateUserEmail(emailValue, onNewUser, onExistingUser);
    if (result?.userExists) {
      setIsExistingUser(true);
    }
  };

  const handleLogin = async (password: string) => {
    await loginExistingUser(email, password, onExistingUser);
  };

  const handleBackToEmail = () => {
    setIsExistingUser(false);
    setEmail('');
    setLoginError('');
  };

  if (isExistingUser) {
    return (
      <ExistingUserLoginForm
        email={email}
        onLogin={handleLogin}
        onBackToEmail={handleBackToEmail}
        isLoading={isLoading}
        loginError={loginError}
      />
    );
  }

  return (
    <EmailValidationForm
      onEmailSubmit={handleEmailValidation}
      isLoading={isLoading}
    />
  );
};
