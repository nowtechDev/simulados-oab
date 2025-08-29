
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, QrCode } from 'lucide-react';
import { CardPaymentForm } from './CardPaymentForm';
import { PixPayment } from './PixPayment';

interface PaymentMethodTabsProps {
  form: UseFormReturn<{ paymentMethod: "card" | "pix" }>;
  watchPaymentMethod: "card" | "pix";
  planId: number;
  userId: string;
  planUserId?: string;
  paymentError: string | null;
  onPaymentSuccess?: () => void;
}

export const PaymentMethodTabs: React.FC<PaymentMethodTabsProps> = ({
  form,
  watchPaymentMethod,
  planId,
  userId,
  planUserId,
  paymentError,
  onPaymentSuccess
}) => {
  return (
    <Tabs value={watchPaymentMethod} onValueChange={(value) => form.setValue('paymentMethod', value as "card" | "pix")}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="card" className="flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Cartão
        </TabsTrigger>
        <TabsTrigger value="pix" className="flex items-center gap-2">
          <QrCode className="w-4 h-4" />
          PIX
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="card" className="mt-6">
        <CardPaymentForm 
          planId={planId} 
          userId={userId} 
          planUserId={planUserId}
          onPaymentSuccess={onPaymentSuccess}
        />
        {paymentError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{paymentError}</p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="pix" className="mt-6">
        <PixPayment planId={planId} userId={userId} planUserId={planUserId} />
      </TabsContent>
    </Tabs>
  );
};
