
import { useState, useEffect } from 'react';

interface ExistingUserData {
  userId: string; 
  planUserId?: string; 
  name: string; 
  lastname: string;
  email: string; 
  phone: string; 
  cpfCnpj: string;
}

interface FormData {
  cpfCnpj: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
}

export const useCheckoutForm = (email: string, existingUserData?: ExistingUserData) => {
  const [formData, setFormData] = useState<FormData>({
    cpfCnpj: '',
    name: '',
    lastname: '',
    email: email,
    phone: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (existingUserData) {
      console.log('useCheckoutForm - Dados de usuário existente recebidos:', existingUserData);
      setFormData({
        cpfCnpj: existingUserData.cpfCnpj,
        name: existingUserData.name,
        lastname: existingUserData.lastname,
        email: existingUserData.email,
        phone: existingUserData.phone,
        password: ''
      });
    } else if (email) {
      setFormData(prev => ({ ...prev, email }));
    }
  }, [existingUserData, email]);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const isExistingUser = !!existingUserData;

  return {
    formData,
    updateFormData,
    showPassword,
    setShowPassword,
    isExistingUser
  };
};
