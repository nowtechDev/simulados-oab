
import React from 'react';

interface PaymentStepsProps {
  currentStep: 'email' | 'dados' | 'cartao' | 'revisao';
}

export const PaymentSteps: React.FC<PaymentStepsProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          currentStep === 'email' 
            ? 'bg-[#4F1964] text-white' 
            : currentStep === 'dados' || currentStep === 'cartao' || currentStep === 'revisao' 
              ? 'bg-[#4F1964]/20 text-[#4F1964]' 
              : 'bg-gray-200'
        }`}>
          1
        </div>
        <span className="text-xs mt-1">E-mail</span>
      </div>
      <div className={`h-1 flex-1 mx-2 ${currentStep === 'email' ? 'bg-gray-200' : 'bg-[#4F1964]/20'}`}></div>
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          currentStep === 'dados' 
            ? 'bg-[#4F1964] text-white' 
            : currentStep === 'cartao' || currentStep === 'revisao' 
              ? 'bg-[#4F1964]/20 text-[#4F1964]' 
              : 'bg-gray-200'
        }`}>
          2
        </div>
        <span className="text-xs mt-1">Dados</span>
      </div>
      <div className={`h-1 flex-1 mx-2 ${currentStep === 'dados' || currentStep === 'email' ? 'bg-gray-200' : 'bg-[#4F1964]/20'}`}></div>
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          currentStep === 'cartao' 
            ? 'bg-[#4F1964] text-white' 
            : currentStep === 'revisao' 
              ? 'bg-[#4F1964]/20 text-[#4F1964]' 
              : 'bg-gray-200'
        }`}>
          3
        </div>
        <span className="text-xs mt-1">Pagamento</span>
      </div>
      <div className={`h-1 flex-1 mx-2 ${currentStep === 'revisao' ? 'bg-[#4F1964]/20' : 'bg-gray-200'}`}></div>
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          currentStep === 'revisao' ? 'bg-[#4F1964] text-white' : 'bg-gray-200'
        }`}>
          4
        </div>
        <span className="text-xs mt-1">Confirmação</span>
      </div>
    </div>
  );
};
