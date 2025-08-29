import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Bot, Edit, Trash2, Link, FileText, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AgenteIADialog from '@/components/admin/AgenteIADialog';
import DeleteAgenteDialog from '@/components/admin/DeleteAgenteDialog';

interface AgenteIA {
  id: string;
  nome: string;
  prompt: string;
  ia_provider: string;
  token_id: string | null;
  token_agente?: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  links?: string[] | null;
  arquivos?: any;
}

const AgentesIA2 = () => {
  const [agentes, setAgentes] = useState<AgenteIA[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAgente, setSelectedAgente] = useState<AgenteIA | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verificação de autenticação e autorização
  useEffect(() => {
    const checkAuthAndPermissions = async () => {
      try {
        console.log("AgentesIA2: Checking authentication and permissions...");
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log("AgentesIA2: No session found, redirecting to login");
          navigate('/login');
          return;
        }

        // Verificar se o usuário é admin consultando diretamente o banco
        const { data: userData, error } = await supabase
          .from('users')
          .select('type_user')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error("AgentesIA2: Error checking user type:", error);
          toast({
            title: "Erro de acesso",
            description: "Não foi possível verificar suas permissões.",
            variant: "destructive"
          });
          navigate('/dashboard');
          return;
        }

        if (userData?.type_user !== 1) {
          console.log("AgentesIA2: User is not admin, redirecting to dashboard");
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para acessar esta página.",
            variant: "destructive"
          });
          navigate('/dashboard');
          return;
        }

        console.log("AgentesIA2: User is authorized as admin");
        setIsAuthorized(true);
        setIsCheckingAuth(false);
        fetchAgentes();
      } catch (error) {
        console.error("AgentesIA2: Auth check error:", error);
        navigate('/login');
      }
    };

    checkAuthAndPermissions();
  }, [navigate, toast]);

  const fetchAgentes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('agentes_ia')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgentes(data || []);
    } catch (error) {
      console.error('Erro ao buscar agentes:', error);
      toast({
        title: 'Erro ao carregar agentes',
        description: 'Não foi possível carregar a lista de agentes IA.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (agente: AgenteIA) => {
    setSelectedAgente(agente);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (agente: AgenteIA) => {
    setSelectedAgente(agente);
    setIsDeleteDialogOpen(true);
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'OpenAI':
        return 'bg-green-100 text-green-800';
      case 'Gemini':
        return 'bg-blue-100 text-blue-800';
      case 'DeepSeek':
        return 'bg-purple-100 text-purple-800';
      case 'Grok':
        return 'bg-orange-100 text-orange-800';
      case 'Claude':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Mostrar loading enquanto verifica auth
  if (isCheckingAuth) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4F1964] mx-auto mb-4"></div>
              <p className="text-muted-foreground">Verificando permissões...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Se não autorizado, não renderizar nada (já redirecionou)
  if (!isAuthorized) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#4F1964] flex items-center gap-2">
              <Bot className="h-8 w-8" />
              Agentes IA v2
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie os agentes de inteligência artificial da plataforma
            </p>
          </div>
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Incluir Novo Agente
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4F1964] mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando agentes...</p>
            </div>
          </div>
        ) : agentes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                Nenhum agente IA encontrado
              </h3>
              <p className="text-muted-foreground mb-4">
                Comece criando seu primeiro agente IA para a plataforma.
              </p>
              <Button onClick={openCreateDialog} className="gap-2">
                <Plus className="h-4 w-4" />
                Criar Primeiro Agente
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentes.map((agente) => (
              <Card key={agente.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold text-[#4F1964] truncate">
                      {agente.nome}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(agente)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(agente)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Badge className={getProviderColor(agente.ia_provider)}>
                        {agente.ia_provider}
                      </Badge>
                      <Badge 
                        variant={agente.ativo ? "default" : "secondary"} 
                        className="ml-2"
                      >
                        {agente.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {agente.prompt}
                      </p>
                    </div>
                    {agente.token_agente && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Key className="h-3 w-3" />
                        <span>Token configurado</span>
                      </div>
                    )}
                    {agente.links && agente.links.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Link className="h-3 w-3" />
                        <span>{agente.links.length} link(s)</span>
                      </div>
                    )}
                    {agente.arquivos && Array.isArray(agente.arquivos) && agente.arquivos.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        <span>{agente.arquivos.length} arquivo(s)</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AgenteIADialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={fetchAgentes}
      />

      <AgenteIADialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        agente={selectedAgente}
        onSuccess={fetchAgentes}
      />

      <DeleteAgenteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        agente={selectedAgente}
        onSuccess={fetchAgentes}
      />
    </Layout>
  );
};

export default AgentesIA2;
