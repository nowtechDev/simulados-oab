
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Layout } from '@/components/Layout';
import { EmailValidationStep } from '@/components/payment/EmailValidationStep';
import { PaymentSteps } from '@/components/payment/PaymentSteps';
import { CheckoutUserForm } from '@/components/payment/CheckoutUserForm';
import { PaymentForm } from '@/components/payment/PaymentForm';
import { PlanSummary } from '@/components/payment/PlanSummary';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePlans } from '@/hooks/usePlans';

const PagamentoProfissional = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'email' | 'dados' | 'cartao' | 'revisao'>('email');
  const [userId, setUserId] = useState<string | null>(null);
  const [planUserId, setPlanUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [existingUserData, setExistingUserData] = useState<any>(null);
  const { toast } = useToast();
  const { data: plans, isLoading: isLoadingPlans } = usePlans();

  const form = useForm<{ paymentMethod: "card" | "pix" }>({
    defaultValues: {
      paymentMethod: "card"
    }
  });

  const handleNewUser = (email: string) => {
    setUserEmail(email);
    setExistingUserData(null);
    setCurrentStep('dados');
  };

  const handleExistingUser = (userData: any) => {
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
    setUserId(userData.userId);
    setPlanUserId(userData.planUserId || null);
    setCurrentStep('cartao');
  };

  const handlePaymentSuccess = () => {
    setCurrentStep('revisao');
  };

  const handleAccessPlatform = () => {
    navigate('/');
  };

  const planInfo = plans?.find(plan => plan.id === 2);

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
          <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Pagamento Plano Profissional
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
                    planId={2}
                    onNewUser={handleNewUser}
                    onExistingUser={handleExistingUser}
                  />
                )}

                {currentStep === 'dados' && (
                  <CheckoutUserForm
                    planId={2}
                    email={userEmail}
                    existingUserData={existingUserData}
                    onUserValidated={handleUserValidated}
                  />
                )}

                {currentStep === 'cartao' && (
                  <PaymentForm
                    step={currentStep}
                    form={form}
                    watchPaymentMethod={form.watch('paymentMethod')}
                    planId={2}
                    userId={userId!}
                    planUserId={planUserId}
                  />
                )}

                {currentStep === 'revisao' && (
                  <PaymentForm
                    step={currentStep}
                    form={form}
                    watchPaymentMethod={form.watch('paymentMethod')}
                    planId={2}
                    userId={userId!}
                    planUserId={planUserId}
                  />
                )}
              </div>

              <div className="lg:col-span-1">
                {planInfo && <PlanSummary planInfo={planInfo} />}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              {currentStep !== 'email' && currentStep !== 'dados' && (
                <Button variant="outline" onClick={() => setCurrentStep(currentStep === 'cartao' ? 'dados' : 'cartao')}>
                  Voltar
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

export default PagamentoProfissional;
