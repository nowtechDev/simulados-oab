
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, QrCode } from 'lucide-react';
import { PaymentSuccessView } from './PaymentSuccessView';
import { PaymentMethodTabs } from './PaymentMethodTabs';

interface PaymentFormProps {
  step: 'dados' | 'cartao' | 'revisao';
  form: UseFormReturn<{ paymentMethod: "card" | "pix" }>;
  watchPaymentMethod: "card" | "pix";
  planId: number;
  userId: string;
  planUserId?: string;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ 
  step, 
  form, 
  watchPaymentMethod, 
  planId, 
  userId,
  planUserId 
}) => {
  console.log('PaymentForm - Props recebidas:', { step, planId, userId, planUserId });
  
  const [showSuccessView, setShowSuccessView] = useState(false);

  const handlePaymentSuccess = () => {
    console.log('PaymentForm - Pagamento realizado com sucesso, mostrando tela de confirmação');
    setShowSuccessView(true);
  };

  if (step === 'cartao') {
    // Se o pagamento foi aprovado, mostrar tela de sucesso
    if (showSuccessView) {
      return <PaymentSuccessView />;
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Formas de pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentMethodTabs
            form={form}
            watchPaymentMethod={watchPaymentMethod}
            planId={planId}
            userId={userId}
            planUserId={planUserId}
            paymentError={null}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </CardContent>
      </Card>
    );
  }

  if (step === 'revisao') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revisão do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Método de Pagamento Selecionado:</h4>
              <p className="flex items-center gap-2">
                {watchPaymentMethod === 'card' ? (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Cartão de Crédito
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4" />
                    PIX
                  </>
                )}
              </p>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Ao confirmar o pagamento, você concorda com nossos termos de uso e política de privacidade.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};
