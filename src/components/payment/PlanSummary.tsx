
import React from 'react';
import { CheckCircle, Shield, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plan } from '@/hooks/usePlans';

interface PlanSummaryProps {
  planInfo: Plan;
}

export const PlanSummary: React.FC<PlanSummaryProps> = ({ planInfo }) => {
  return (
    <Card className="bg-white shadow-md border-[#4F1964]/10 sticky top-24">
      <CardHeader>
        <CardTitle>Resumo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium text-lg">{planInfo.display_name}</p>
            <p className="text-sm text-gray-500">Cobrança {planInfo.billing_cycle}</p>
          </div>
          <p className="font-bold text-lg">R$ {planInfo.price.toFixed(2).replace('.', ',')}</p>
        </div>
        
        <Separator />
        
        <div>
          <p className="font-medium mb-2">O que está incluído:</p>
          <ul className="space-y-2">
            {planInfo.benefits.map((beneficio, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-4 w-4 text-[#4F1964] mr-2 mt-1 flex-shrink-0" />
                <span className="text-sm">{beneficio}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Separator />
        
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>R$ {planInfo.price.toFixed(2).replace('.', ',')}/{planInfo.billing_cycle}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3 items-start">
        <div className="flex items-center text-sm text-gray-500">
          <Shield className="h-4 w-4 mr-2 text-[#4F1964]" />
          <span>Pagamento 100% seguro</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-2 text-[#4F1964]" />
          <span>Acesso imediato após confirmação</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <AlertCircle className="h-4 w-4 mr-2 text-[#4F1964]" />
          <span>Cancele quando quiser</span>
        </div>
      </CardFooter>
    </Card>
  );
};
