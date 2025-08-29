
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Layout } from '@/components/Layout';
import { EmailValidationStep } from '@/components/payment/EmailValidationStep';
import { CheckoutUserForm } from '@/components/payment/CheckoutUserForm';
import { PaymentSteps } from '@/components/payment/PaymentSteps';
import { PaymentForm } from '@/components/payment/PaymentForm';
import { PlanSummary } from '@/components/payment/PlanSummary';
import { Button } from '@/components/ui/button';
import { usePlans } from '@/hooks/usePlans';

const PagamentoEssencial = () => {
  const [currentStep, setCurrentStep] = useState<'email' | 'dados' | 'cartao' | 'revisao'>('email');
  const [userId, setUserId] = useState<string | null>(null);
  const [planUserId, setPlanUserId] = useState<string | undefined>(undefined);
  const [userEmail, setUserEmail] = useState<string>('');
  const [existingUserData, setExistingUserData] = useState<any>(null);
  const navigate = useNavigate();
  const { data: plans, isLoading: isLoadingPlans } = usePlans();

  const form = useForm<{ paymentMethod: "card" | "pix" }>({
    defaultValues: {
      paymentMethod: "card"
    }
  });

  const handleNewUser = (email: string) => {
    console.log('PagamentoEssencial - Novo usuário com email:', email);
    setUserEmail(email);
    setExistingUserData(null);
    setCurrentStep('dados');
  };

  const handleExistingUser = (userData: any) => {
    console.log('PagamentoEssencial - Usuário existente:', userData);
    setUserEmail(userData.email);
    setExistingUserData(userData);
    setCurrentStep('dados');
  };
  
  const handleUserValidated = async (userData: {
    userId: string;
    planUserId?: string;
    name: string;
    email: string;
    phone: string;
    cpfCnpj: string;
  }) => {
    console.log('PagamentoEssencial - Usuário validado:', userData);
    console.log('PagamentoEssencial - planUserId recebido:', userData.planUserId);
    setUserId(userData.userId);
    setPlanUserId(userData.planUserId);
    console.log('PagamentoEssencial - planUserId definido no estado:', userData.planUserId);
    setCurrentStep('cartao');
  };

  const handlePaymentSuccess = () => {
    setCurrentStep('revisao');
  };

  const handleAccessPlatform = () => {
    navigate('/');
  };

  const planInfo = plans?.find(plan => plan.id === 1);

  if (isLoadingPlans) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#4F1964] mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando informações do plano...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Pagamento - Plano Essencial
            </h1>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <PaymentSteps currentStep={currentStep as any} />
            
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {currentStep === 'email' && (
                  <EmailValidationStep
                    planId={1}
                    onNewUser={handleNewUser}
                    onExistingUser={handleExistingUser}
                  />
                )}

                {currentStep === 'dados' && (
                  <CheckoutUserForm
                    planId={1}
                    email={userEmail}
                    existingUserData={existingUserData}
                    onUserValidated={handleUserValidated}
                  />
                )}

                {currentStep === 'cartao' && (
                  <>
                    {console.log('PagamentoEssencial - Renderizando PaymentForm com planUserId:', planUserId)}
                    <PaymentForm
                      step={currentStep}
                      form={form}
                      watchPaymentMethod={form.watch('paymentMethod')}
                      planId={1}
                      userId={userId!}
                      planUserId={planUserId}
                    />
                  </>
                )}

                {currentStep === 'revisao' && (
                  <PaymentForm
                    step={currentStep}
                    form={form}
                    watchPaymentMethod={form.watch('paymentMethod')}
                    planId={1}
                    userId={userId!}
                    planUserId={planUserId}
                  />
                )}
              </div>

              <div className="lg:col-span-1">
                {planInfo && <PlanSummary planInfo={planInfo} />}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              {currentStep === 'cartao' && (
                <Button onClick={handlePaymentSuccess}>
                  Confirmar Pagamento
                </Button>
              )}
              {currentStep === 'revisao' && (
                <Button onClick={handleAccessPlatform}>
                  Acessar Plataforma
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default PagamentoEssencial;
