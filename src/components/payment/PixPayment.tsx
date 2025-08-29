
import React from 'react';
import { Copy, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePixPayment } from '@/hooks/usePixPayment';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';
import { useNavigate } from 'react-router-dom';

interface PixPaymentProps {
  planId: number;
  userId: string;
  planUserId?: string;
}

export const PixPayment: React.FC<PixPaymentProps> = ({ planId, userId, planUserId }) => {
  const { pixData, paymentId, createPixPayment, copyPixCode, loading: pixLoading } = usePixPayment();
  const { checkPaymentStatus, loading: statusLoading } = usePaymentStatus();
  const [paymentConfirmed, setPaymentConfirmed] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (planId && userId) {
      createPixPayment(planId, userId, planUserId);
    }
  }, [planId, userId, planUserId]);

  const handleCheckPayment = async () => {
    console.log('Verificando pagamento com paymentId:', paymentId);
    const isConfirmed = await checkPaymentStatus(userId, planId, paymentId || undefined);
    setPaymentConfirmed(isConfirmed);
  };

  const handleAccessPlatform = () => {
    navigate('/');
  };

  if (pixLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4F1964] mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Gerando PIX...</p>
      </div>
    );
  }

  if (paymentConfirmed) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl text-center space-y-6 border border-green-100">
          {/* Ícone principal de sucesso */}
          <div className="relative">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-scale-in">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Título principal */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-green-800">
              🎉 Pagamento Confirmado!
            </h2>
            <p className="text-lg text-green-700 font-medium">
              Parabéns! Seu plano foi adquirido com sucesso
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

          <Button 
            onClick={handleAccessPlatform}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            size="lg"
          >
            🚀 Acessar Plataforma
          </Button>

          {/* Informação adicional */}
          <div className="pt-4 border-t border-green-200">
            <p className="text-green-600 text-xs">
              Um e-mail de confirmação foi enviado para você com todos os detalhes
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!pixData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Erro ao carregar dados do PIX.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#F8E6FF]/30 p-6 rounded-lg text-center space-y-4">
        <h3 className="font-medium text-[#4F1964]">Finalize seu pagamento via Pix</h3>
        <p className="text-sm">Escaneie o QR Code abaixo ou copie o código Pix para pagar com segurança.</p>
        
        <div className="mx-auto w-64 h-64 bg-white p-3 rounded-lg flex items-center justify-center">
          {pixData.encodedImage ? (
            <img 
              src={`data:image/png;base64,${pixData.encodedImage}`} 
              alt="QR Code PIX" 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-muted-foreground">QR Code não disponível</div>
          )}
        </div>
        
        <div className="rounded-md border border-dashed border-[#4F1964]/40 p-3 bg-white">
          <div className="flex justify-between items-center gap-2">
            <p className="text-xs text-muted-foreground break-all flex-1">{pixData.payload}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={copyPixCode}
              className="flex-shrink-0"
            >
              <Copy className="h-3.5 w-3.5 mr-1" />
              Copiar
            </Button>
          </div>
        </div>
        
        <div className="bg-[#4F1964]/10 p-3 rounded text-sm">
          <p><strong>Validade:</strong> {new Date(pixData.expirationDate).toLocaleString('pt-BR')}</p>
          <p className="mt-1">Após realizar o pagamento, clique no botão abaixo para confirmar.</p>
        </div>

        <Button 
          onClick={handleCheckPayment}
          disabled={statusLoading}
          className="bg-[#4F1964] hover:bg-[#6B3182] w-full"
        >
          {statusLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Verificando...
            </>
          ) : (
            'Confirmar Pagamento'
          )}
        </Button>
      </div>
    </div>
  );
};
