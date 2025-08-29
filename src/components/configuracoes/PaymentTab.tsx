
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CreditCard } from 'lucide-react';

interface PaymentInfo {
  plan: string;
  price: string;
  nextBilling: string;
  paymentMethod: string;
}

interface PaymentTabProps {
  paymentInfo: PaymentInfo;
  onCancelSubscription: () => void;
}

export const PaymentTab = ({ paymentInfo, onCancelSubscription }: PaymentTabProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-[#4F1964]" />
        Plano e Pagamento
      </h2>
      
      <div className="space-y-6">
        <div className="bg-[#F8F9FA] p-4 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-lg">{paymentInfo.plan}</h3>
              <p className="text-muted-foreground">{paymentInfo.price}/mês</p>
            </div>
            <span className="bg-[#4F1964]/10 text-[#4F1964] px-3 py-1 rounded-full text-sm font-medium">
              Ativo
            </span>
          </div>
          <Separator className="my-4" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Próxima cobrança:</span>
              <span>{paymentInfo.nextBilling}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Método de pagamento:</span>
              <span>{paymentInfo.paymentMethod}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Button variant="outline">
            Alterar forma de pagamento
          </Button>
          <Button variant="outline">
            Fazer upgrade
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                Cancelar assinatura
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancelar assinatura?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Você perderá acesso a todos os recursos premium no final do seu período de faturamento atual.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Voltar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={onCancelSubscription} 
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Confirmar cancelamento
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};
