
import { useState } from 'react';
import { 
  formatCardNumber, 
  formatExpiryDate, 
  formatCVV,
  validateCardNumber,
  validateExpiryDate,
  validateCVV,
  validateCardName
} from '@/utils/cardValidation';

interface CardFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

interface CardFormErrors {
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardName?: string;
}

export const useCardForm = () => {
  const [cardForm, setCardForm] = useState<CardFormData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [cardErrors, setCardErrors] = useState<CardFormErrors>({});

  const handleCardFormChange = (field: keyof CardFormData, value: string) => {
    let formattedValue = value;
    let error = '';

    // Aplicar máscara e validação baseada no campo
    switch (field) {
      case 'cardNumber':
        formattedValue = formatCardNumber(value);
        if (formattedValue && !validateCardNumber(formattedValue)) {
          error = 'Número do cartão deve ter 16 dígitos';
        }
        break;
      case 'expiryDate':
        formattedValue = formatExpiryDate(value);
        if (formattedValue.length === 5) {
          const validation = validateExpiryDate(formattedValue);
          if (!validation.isValid) {
            error = validation.error || 'Data inválida';
          }
        }
        break;
      case 'cvv':
        formattedValue = formatCVV(value);
        if (formattedValue && !validateCVV(formattedValue)) {
          error = 'CVV deve ter 3 ou 4 dígitos';
        }
        break;
      case 'cardName':
        formattedValue = value.toUpperCase();
        if (formattedValue && !validateCardName(formattedValue)) {
          error = 'Nome deve conter apenas letras';
        }
        break;
    }

    setCardForm(prev => ({ ...prev, [field]: formattedValue }));
    setCardErrors(prev => ({ ...prev, [field]: error }));
  };

  const isCardFormValid = () => {
    return (
      validateCardNumber(cardForm.cardNumber) &&
      validateExpiryDate(cardForm.expiryDate).isValid &&
      validateCVV(cardForm.cvv) &&
      validateCardName(cardForm.cardName) &&
      Object.values(cardErrors).every(error => !error)
    );
  };

  const resetCardForm = () => {
    setCardForm({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: ''
    });
    setCardErrors({});
  };

  return {
    cardForm,
    cardErrors,
    handleCardFormChange,
    isCardFormValid,
    resetCardForm
  };
};
