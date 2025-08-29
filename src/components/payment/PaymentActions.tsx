
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';

interface PaymentActionsProps {
  step: 'dados' | 'cartao' | 'revisao';
  loading: boolean;
  watchPaymentMethod: "card" | "pix";
  onBack: () => void;
  onNext: () => void;
  onComplete: () => void;
}

export const PaymentActions: React.FC<PaymentActionsProps> = ({
  step,
  loading,
  watchPaymentMethod,
  onBack,
  onNext,
  onComplete
}) => {
  return (
    <CardFooter className="flex justify-between">
      {step !== 'dados' && (
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
      )}
      {step === 'dados' && (
        <Button className="ml-auto bg-[#4F1964] hover:bg-[#6B3182]" onClick={onNext}>
          Continuar
        </Button>
      )}
      {step === 'cartao' && (
        <Button className="bg-[#4F1964] hover:bg-[#6B3182]" onClick={onNext}>
          {watchPaymentMethod === "pix" ? "Verificar status do PIX" : "Revisar e confirmar"}
        </Button>
      )}
      {step === 'revisao' && (
        <Button className="bg-[#4F1964] hover:bg-[#6B3182]" onClick={onComplete} disabled={loading}>
          {loading ? "Processando..." : "Finalizar pagamento"}
        </Button>
      )}
    </CardFooter>
  );
};
