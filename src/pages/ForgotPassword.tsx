
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe seu e-mail",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulando o envio de e-mail de recuperação (em uma implementação real, isso seria conectado a um backend)
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      
      toast({
        title: "E-mail enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha",
      });
    }, 1500);
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <Card className="w-full max-w-md border-[#4F1964]/10">
          <CardHeader className="space-y-1">
            {!isSubmitted ? (
              <>
                <CardTitle className="text-2xl font-bold text-center text-[#4F1964]">
                  Recuperar senha
                </CardTitle>
                <CardDescription className="text-center">
                  Digite seu e-mail para receber um link de recuperação de senha
                </CardDescription>
              </>
            ) : (
              <>
                <CardTitle className="text-2xl font-bold text-center text-[#4F1964]">
                  E-mail enviado
                </CardTitle>
                <CardDescription className="text-center">
                  Verifique sua caixa de entrada e siga as instruções para redefinir sua senha
                </CardDescription>
              </>
            )}
          </CardHeader>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-[#4F1964] hover:bg-[#6B3182]"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar link de recuperação"}
                </Button>
                
                <div className="text-center text-sm">
                  <Link to="/login" className="text-[#4F1964] hover:underline font-medium flex items-center justify-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para o login
                  </Link>
                </div>
              </CardFooter>
            </form>
          ) : (
            <CardFooter className="flex flex-col space-y-4 pt-6">
              <div className="text-center text-sm mb-4">
                Não recebeu o e-mail? Verifique sua pasta de spam ou
                <Button 
                  variant="link" 
                  className="text-[#4F1964] hover:underline font-medium p-0 h-auto ml-1"
                  onClick={() => setIsSubmitted(false)}
                >
                  tente novamente
                </Button>
              </div>
              
              <Link to="/login" className="w-full">
                <Button 
                  className="w-full bg-[#4F1964] hover:bg-[#6B3182]"
                >
                  Voltar para o login
                </Button>
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
