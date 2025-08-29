
export const formatCardNumber = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 16 dígitos
  const limited = numbers.slice(0, 16);
  
  // Adiciona espaços a cada 4 dígitos
  return limited.replace(/(\d{4})(?=\d)/g, '$1 ');
};

export const formatExpiryDate = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 4 dígitos (MMAA)
  const limited = numbers.slice(0, 4);
  
  // Adiciona barra após o segundo dígito
  if (limited.length >= 2) {
    return `${limited.slice(0, 2)}/${limited.slice(2)}`;
  }
  
  return limited;
};

export const formatCVV = (value: string): string => {
  // Remove todos os caracteres não numéricos e limita a 4 dígitos
  return value.replace(/\D/g, '').slice(0, 4);
};

export const validateCardNumber = (cardNumber: string): boolean => {
  const numbers = cardNumber.replace(/\s/g, '');
  return numbers.length === 16 && /^\d+$/.test(numbers);
};

export const validateExpiryDate = (expiryDate: string): { isValid: boolean; error?: string } => {
  if (!expiryDate || expiryDate.length !== 5) {
    return { isValid: false, error: 'Formato inválido (MM/AA)' };
  }

  const [month, year] = expiryDate.split('/');
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(`20${year}`, 10);

  if (monthNum < 1 || monthNum > 12) {
    return { isValid: false, error: 'Mês inválido' };
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
    return { isValid: false, error: 'Cartão expirado' };
  }

  if (yearNum > currentYear + 20) {
    return { isValid: false, error: 'Data muito distante' };
  }

  return { isValid: true };
};

export const validateCVV = (cvv: string): boolean => {
  return cvv.length >= 3 && cvv.length <= 4 && /^\d+$/.test(cvv);
};

export const validateCardName = (name: string): boolean => {
  return name.trim().length >= 2 && /^[a-zA-ZÀ-ÿ\s]+$/.test(name.trim());
};
