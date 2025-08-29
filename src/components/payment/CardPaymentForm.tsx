
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCardForm } from '@/hooks/useCardForm';
import { useCardPayment } from '@/hooks/useCardPayment';

interface CardPaymentFormProps {
  planId: number;
  userId: string;
  planUserId?: string;
  onPaymentSuccess?: () => void;
}

export const CardPaymentForm: React.FC<CardPaymentFormProps> = ({
  planId,
  userId,
  planUserId,
  onPaymentSuccess
}) => {
  const { cardForm, cardErrors, handleCardFormChange, isCardFormValid, resetCardForm } = useCardForm();
  const { processCardPayment, loading: cardLoading, resetPaymentState } = useCardPayment();

  const handleCardPayment = async () => {
    console.log('CardPaymentForm - Iniciando pagamento com planUserId:', planUserId);
    
    // Resetar estado anterior
    resetPaymentState();

    // Validar campos obrigatórios
    if (!isCardFormValid()) {
      return;
    }

    // Preparar dados do cartão no formato esperado pela API
    const [expiryMonth, expiryYear] = cardForm.expiryDate.split('/');
    const cardData = {
      holderName: cardForm.cardName,
      number: cardForm.cardNumber.replace(/\s/g, ''), // Remover espaços
      expiryMonth: expiryMonth.padStart(2, '0'),
      expiryYear: `20${expiryYear}`, // Assumindo formato AA -> 20AA
      ccv: cardForm.cvv
    };

    console.log('CardPaymentForm - Chamando processCardPayment com:', {
      planId,
      userId,
      cardData,
      planUserId
    });

    const result = await processCardPayment(planId, userId, cardData, planUserId);
    
    // Se o pagamento foi aprovado, resetar os dados do cartão por segurança e chamar callback
    if (result.success) {
      resetCardForm();
      console.log('CardPaymentForm - Pagamento aprovado, chamando onPaymentSuccess');
      onPaymentSuccess?.();
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="cardNumber">Número do Cartão *</Label>
          <Input 
            id="cardNumber" 
            placeholder="0000 0000 0000 0000" 
            value={cardForm.cardNumber}
            onChange={(e) => handleCardFormChange('cardNumber', e.target.value)}
            className={cardErrors.cardNumber ? 'border-red-500' : ''}
            maxLength={19}
          />
          {cardErrors.cardNumber && (
            <p className="text-red-500 text-sm mt-1">{cardErrors.cardNumber}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiryDate">Validade *</Label>
            <Input 
              id="expiryDate" 
              placeholder="MM/AA" 
              value={cardForm.expiryDate}
              onChange={(e) => handleCardFormChange('expiryDate', e.target.value)}
              className={cardErrors.expiryDate ? 'border-red-500' : ''}
              maxLength={5}
            />
            {cardErrors.expiryDate && (
              <p className="text-red-500 text-sm mt-1">{cardErrors.expiryDate}</p>
            )}
          </div>
          <div>
            <Label htmlFor="cvv">CVV *</Label>
            <Input 
              id="cvv" 
              placeholder="000" 
              value={cardForm.cvv}
              onChange={(e) => handleCardFormChange('cvv', e.target.value)}
              className={cardErrors.cvv ? 'border-red-500' : ''}
              maxLength={4}
            />
            {cardErrors.cvv && (
              <p className="text-red-500 text-sm mt-1">{cardErrors.cvv}</p>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="cardName">Nome no Cartão *</Label>
          <Input 
            id="cardName" 
            placeholder="NOME COMO IMPRESSO NO CARTÃO" 
            value={cardForm.cardName}
            onChange={(e) => handleCardFormChange('cardName', e.target.value)}
            className={cardErrors.cardName ? 'border-red-500' : ''}
          />
          {cardErrors.cardName && (
            <p className="text-red-500 text-sm mt-1">{cardErrors.cardName}</p>
          )}
        </div>
      </div>
      
      <Button 
        onClick={handleCardPayment}
        disabled={cardLoading || !isCardFormValid()}
        className="w-full bg-[#4F1964] hover:bg-[#6B3182]"
      >
        {cardLoading ? 'Processando...' : 'Confirmar Pagamento'}
      </Button>
    </div>
  );
};
