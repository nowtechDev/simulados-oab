import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import {
  ProfileTab,
  SecurityTab,
  PreferencesTab,
  TokensTab,
  PaymentTab,
  PlansTab
} from '@/components/configuracoes';

interface Token {
  id: string;
  nome_ia: string;
  token: string;
  created_at: string;
}

const Configuracoes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // User information state
  const [userInfo, setUserInfo] = useState({
    name: 'Usuário OAB',
    email: '',
    phone: '',
  });
  
  // Password state
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Preferences state
  const [preferences, setPreferences] = useState({
    language: 'pt',
    theme: 'light',
    emailNotifications: true,
  });
  
  // Payment state
  const [paymentInfo] = useState({
    plan: 'Plano Mensal',
    price: 'R$100',
    nextBilling: '05/11/2024',
    paymentMethod: 'Cartão de crédito terminado em 1234',
  });

  // Tokens state
  const [tokens, setTokens] = useState<Token[]>([]);
  const [newToken, setNewToken] = useState({
    nome_ia: '',
    token: '',
  });
  const [tokenLoading, setTokenLoading] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      // Check if user is logged in
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const email = localStorage.getItem('userEmail');
      
      setIsLoggedIn(loggedIn);
      
      if (!loggedIn) {
        toast({
          title: "Acesso restrito",
          description: "Faça login para acessar esta página",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }
      
      if (email) {
        setUserInfo(prev => ({ ...prev, email }));
      }

      // Check if user is admin
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: userData } = await supabase
            .from('users')
            .select('type_user')
            .eq('id', user.id)
            .single();
          
          if (userData?.type_user === 1) {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar status de admin:', error);
      }

      loadTokens();
    };

    checkUserStatus();
  }, [navigate, toast]);

  const loadTokens = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('tokens')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar tokens:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os tokens",
          variant: "destructive",
        });
        return;
      }

      setTokens(data || []);
    } catch (error) {
      console.error('Erro ao carregar tokens:', error);
    }
  };

  const handleAddToken = async () => {
    if (!newToken.nome_ia.trim() || !newToken.token.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o nome da IA e o token",
        variant: "destructive",
      });
      return;
    }

    setTokenLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('tokens')
        .insert({
          user_id: user.id,
          nome_ia: newToken.nome_ia,
          token: newToken.token,
        });

      if (error) {
        console.error('Erro ao salvar token:', error);
        toast({
          title: "Erro",
          description: "Não foi possível salvar o token",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Token salvo",
        description: "Seu token foi salvo com sucesso",
      });

      setNewToken({ nome_ia: '', token: '' });
      loadTokens();
    } catch (error) {
      console.error('Erro ao salvar token:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o token",
        variant: "destructive",
      });
    } finally {
      setTokenLoading(false);
    }
  };

  const handleDeleteToken = async (tokenId: string) => {
    setTokenLoading(true);
    try {
      const { error } = await supabase
        .from('tokens')
        .delete()
        .eq('id', tokenId);

      if (error) {
        console.error('Erro ao deletar token:', error);
        toast({
          title: "Erro",
          description: "Não foi possível deletar o token",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Token deletado",
        description: "Token removido com sucesso",
      });

      loadTokens();
    } catch (error) {
      console.error('Erro ao deletar token:', error);
    } finally {
      setTokenLoading(false);
    }
  };

  const handleUpdateProfile = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('userEmail', userInfo.email);
      setLoading(false);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso",
      });
    }, 1000);
  };

  const handleChangePassword = () => {
    setLoading(true);
    
    // Validate passwords
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      setLoading(false);
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setPasswordInfo({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setLoading(false);
      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso",
      });
    }, 1000);
  };

  const handleUpdatePreferences = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Preferências salvas",
        description: "Suas preferências foram atualizadas com sucesso",
      });
    }, 1000);
  };

  const handleCancelSubscription = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Assinatura cancelada",
        description: "Sua assinatura foi cancelada com sucesso",
      });
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso"
    });
    navigate('/');
  };

  if (!isLoggedIn) {
    return null; // Don't render anything if not logged in
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#4F1964] mb-2">Configurações da Conta</h1>
            <p className="text-foreground/70">Gerencie suas informações pessoais, preferências e detalhes de assinatura</p>
          </div>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className={`grid ${isAdmin ? 'grid-cols-6' : 'grid-cols-5'} mb-8`}>
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="security">Segurança</TabsTrigger>
              <TabsTrigger value="preferences">Preferências</TabsTrigger>
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
              <TabsTrigger value="payment">Pagamento</TabsTrigger>
              {isAdmin && <TabsTrigger value="plans">Planos</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <ProfileTab
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                onUpdateProfile={handleUpdateProfile}
                loading={loading}
              />
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6">
              <SecurityTab
                passwordInfo={passwordInfo}
                setPasswordInfo={setPasswordInfo}
                onChangePassword={handleChangePassword}
                loading={loading}
              />
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-6">
              <PreferencesTab
                preferences={preferences}
                setPreferences={setPreferences}
                onUpdatePreferences={handleUpdatePreferences}
                loading={loading}
              />
            </TabsContent>
            
            <TabsContent value="tokens" className="space-y-6">
              <TokensTab
                tokens={tokens}
                newToken={newToken}
                setNewToken={setNewToken}
                onAddToken={handleAddToken}
                onDeleteToken={handleDeleteToken}
                tokenLoading={tokenLoading}
              />
            </TabsContent>
            
            <TabsContent value="payment" id="pagamento" className="space-y-6">
              <PaymentTab
                paymentInfo={paymentInfo}
                onCancelSubscription={handleCancelSubscription}
              />
            </TabsContent>
            
            {isAdmin && (
              <TabsContent value="plans" className="space-y-6">
                <PlansTab />
              </TabsContent>
            )}
          </Tabs>
          
          <div className="mt-8 space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Termos e Políticas</h2>
              <div className="space-y-2">
                <a href="#" className="text-[#4F1964] hover:underline block">Termos de uso</a>
                <a href="#" className="text-[#4F1964] hover:underline block">Política de privacidade</a>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-destructive">Encerrar Sessão</h2>
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleLogout}
              >
                Sair da Conta
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Configuracoes;
