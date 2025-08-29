
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PaymentSuccessView: React.FC = () => {
  const navigate = useNavigate();

  const handleAccessPlatform = () => {
    navigate('/');
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl text-center space-y-6 border border-green-100">
          {/* Ícone principal de sucesso */}
          <div className="relative">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-scale-in">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            {/* Efeito de confete com estrelas */}
            <Star className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
            <Gift className="w-5 h-5 text-green-400 absolute -bottom-1 -left-3 animate-bounce" />
          </div>

          {/* Título principal */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-green-800">
              🎉 Pagamento Confirmado!
            </h2>
            <p className="text-lg text-green-700 font-medium">
              Parabéns! Seu plano foi contratado com sucesso
            </p>
          </div>

          {/* Informações do plano */}
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-green-200">
            <div className="space-y-2">
              <p className="text-green-800 font-semibold">✅ Plano Essencial Ativado</p>
              <p className="text-green-600 text-sm">
                Agora você tem acesso a todos os recursos da plataforma
              </p>
            </div>
          </div>

          {/* Próximos passos */}
          <div className="space-y-4">
            <p className="text-green-700 text-sm">
              Seu pagamento foi processado e confirmado. 
              <br />
              Você já pode começar a usar todos os recursos disponíveis!
            </p>

            <Button 
              onClick={handleAccessPlatform}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              size="lg"
            >
              🚀 Acessar Plataforma
            </Button>
          </div>

          {/* Informação adicional */}
          <div className="pt-4 border-t border-green-200">
            <p className="text-green-600 text-xs">
              Um e-mail de confirmação foi enviado para você com todos os detalhes
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
