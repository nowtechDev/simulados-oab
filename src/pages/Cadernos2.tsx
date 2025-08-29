
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { BookOpen, PlusCircle, Edit2, ArrowRight, FileText, Sparkles, Trash2 } from 'lucide-react';
import NovoCadernoDialog from '@/components/cadernos/NovoCadernoDialog';
import { getCadernos, getCaderno, deletarCaderno, editarCaderno } from '@/services/cadernoService';
import { Caderno } from '@/types/caderno';
import OpenAIConfig from '@/components/OpenAIConfig';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Cadernos2 = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cadernos, setCadernos] = useState<Caderno[]>([]);
  const [isNovoCadernoDialogOpen, setIsNovoCadernoDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("todos");
  const [editCadernoId, setEditCadernoId] = useState<number | null>(null);
  const [deleteCadernoId, setDeleteCadernoId] = useState<number | null>(null);
  const [novoTitulo, setNovoTitulo] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadCadernos = () => {
    console.log("Loading cadernos from storage");
    const cadernosStorage = getCadernos();
    console.log("Loaded cadernos:", cadernosStorage.length);
    setCadernos(cadernosStorage);
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    if (!loggedIn) {
      toast({
        title: "Acesso restrito",
        description: "Faça login para acessar esta página",
        variant: "destructive"
      });
      navigate('/login');
    } else {
      loadCadernos();
    }

    const handleStorageChange = () => {
      console.log("Storage change detected, reloading cadernos");
      loadCadernos();
    };
    
    const handleCadernoUpdate = () => {
      console.log("Caderno update event received, reloading cadernos");
      loadCadernos();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cadernoUpdated', handleCadernoUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cadernoUpdated', handleCadernoUpdate);
    };
  }, [navigate, toast]);

  const handleAbrirCaderno = (id: number) => {
    // Verificar se o caderno ainda existe antes de navegar
    const cadernoExiste = getCaderno(id);
    if (cadernoExiste) {
      navigate(`/caderno/${id}`);
    } else {
      toast({
        title: "Caderno não encontrado",
        description: "Este caderno foi deletado ou não existe mais.",
        variant: "destructive"
      });
      loadCadernos(); // Recarregar a lista
    }
  };

  const handleNovoCadernoAdicionado = () => {
    console.log("New caderno added, reloading");
    loadCadernos();
    
    toast({
      title: "Caderno criado",
      description: "Seu novo caderno foi criado com sucesso."
    });
  };
  
  const handleEditarCaderno = (id: number, tituloAtual: string) => {
    setEditCadernoId(id);
    setNovoTitulo(tituloAtual);
  };
  
  const handleSalvarEdicao = () => {
    if (!editCadernoId) return;
    
    const sucesso = editarCaderno(editCadernoId, novoTitulo);
    
    if (sucesso) {
      loadCadernos();
      setEditCadernoId(null);
      setNovoTitulo("");
      
      toast({
        title: "Caderno renomeado",
        description: "O nome do caderno foi atualizado com sucesso."
      });
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível renomear o caderno.",
        variant: "destructive"
      });
    }
  };
  
  const cancelarEdicao = () => {
    setEditCadernoId(null);
    setNovoTitulo("");
  };

  const handleDeletarCaderno = (id: number) => {
    setDeleteCadernoId(id);
  };

  const confirmarDelecao = () => {
    if (!deleteCadernoId) return;
    
    const sucesso = deletarCaderno(deleteCadernoId);
    
    if (sucesso) {
      loadCadernos();
      setDeleteCadernoId(null);
      
      toast({
        title: "Caderno deletado",
        description: "O caderno foi removido com sucesso."
      });
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível deletar o caderno.",
        variant: "destructive"
      });
    }
  };

  const cancelarDelecao = () => {
    setDeleteCadernoId(null);
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in">
          <span className="bg-gradient-to-r from-[#F8E6FF] to-[#F0D6FA] px-4 py-1.5 rounded-full text-sm font-medium text-[#4F1964] mb-4 inline-block shadow-sm border border-[#F8E6FF]/70">
            <Sparkles className="h-4 w-4 inline mr-1 text-[#6B3182]" />
            Organização Inteligente
          </span>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#4F1964] to-[#6B3182] bg-clip-text text-transparent mb-4">
            Cadernos Inteligentes
          </h1>
          <p className="text-foreground/80 text-lg">
            Crie, organize e revise seus cadernos de anotações com o auxílio da inteligência artificial.
            Transforme suas anotações em material de estudo otimizado para o Exame da OAB.
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end mb-8">
            <div className="flex gap-3">
              <OpenAIConfig className="h-10" />
              <Button 
                onClick={() => setIsNovoCadernoDialogOpen(true)}
                className="bg-[#4F1964] hover:bg-[#6B3182] text-white h-10 hover:scale-105 transition-transform shadow-md"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Caderno
              </Button>
            </div>
          </div>

          <Tabs defaultValue="todos" className="space-y-6" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gradient-to-r from-[#F8E6FF] to-[#F0D6FA] p-1 rounded-xl shadow-sm border border-[#F8E6FF]/70">
              <TabsTrigger 
                value="todos" 
                className="data-[state=active]:bg-white data-[state=active]:text-[#4F1964] data-[state=active]:shadow-sm rounded-lg transition-all duration-300 px-6"
              >
                Todos os Cadernos
              </TabsTrigger>
              <TabsTrigger 
                value="recentes" 
                className="data-[state=active]:bg-white data-[state=active]:text-[#4F1964] data-[state=active]:shadow-sm rounded-lg transition-all duration-300 px-6"
              >
                Recentes
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="todos" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {cadernos.length > 0 ? (
                  cadernos.map((caderno) => (
                    <Card 
                      key={caderno.id} 
                      className="border border-[#F8E6FF]/80 hover:border-[#4F1964]/40 transition-all hover:shadow-elegant cursor-pointer group h-[180px] p-4 flex flex-col rounded-xl hover:bg-[#FDFAFF]"
                      onClick={() => handleAbrirCaderno(caderno.id)}
                    >
                      <CardHeader className="pb-2 p-3 flex-grow">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-semibold text-[#4F1964] truncate" title={caderno.titulo}>
                            {caderno.titulo}
                          </CardTitle>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-1 text-muted-foreground"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditarCaderno(caderno.id, caderno.titulo);
                              }}
                              title="Renomear caderno"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-1 text-red-500 hover:text-red-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletarCaderno(caderno.id);
                              }}
                              title="Deletar caderno"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pb-1 pt-0 mt-auto">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>{caderno.anotacoes.length} anotações</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-3 pt-2">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-center gap-1 text-[#4F1964] hover:bg-[#F8E6FF] hover:text-[#6B3182] group-hover:bg-[#F8E6FF]/50 transition-colors py-1.5 text-sm rounded-lg"
                        >
                          <span>Abrir caderno</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 animate-fade-in">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhum caderno encontrado</h3>
                    <p className="text-muted-foreground mb-6">
                      Comece criando seu primeiro caderno de estudos.
                    </p>
                    <Button 
                      onClick={() => setIsNovoCadernoDialogOpen(true)}
                      className="bg-[#4F1964] hover:bg-[#6B3182] text-white hover:scale-105 transition-all shadow-md"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Criar Caderno
                    </Button>
                  </div>
                )}
                
                {cadernos.length > 0 && (
                  <Card 
                    className="border border-dashed border-[#4F1964]/30 bg-[#F8E6FF]/10 hover:bg-[#F8E6FF]/30 transition-colors cursor-pointer flex flex-col items-center justify-center h-[180px] hover:shadow-elegant rounded-xl"
                    onClick={() => setIsNovoCadernoDialogOpen(true)}
                  >
                    <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4F1964] to-[#6B3182] flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform">
                        <PlusCircle className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-base font-medium mb-1 text-[#4F1964]">Novo Caderno</h3>
                      <p className="text-xs text-muted-foreground">
                        Adicione um novo caderno
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="recentes" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {cadernos.length > 0 ? (
                  [...cadernos]
                    .sort((a, b) => {
                      if (a.anotacoes.length === 0 && b.anotacoes.length === 0) {
                        return b.id - a.id;
                      }
                      
                      if (a.anotacoes.length === 0) return 1;
                      if (b.anotacoes.length === 0) return -1;
                      
                      const lastAnotacaoA = new Date(a.anotacoes[a.anotacoes.length - 1].dataHora);
                      const lastAnotacaoB = new Date(b.anotacoes[b.anotacoes.length - 1].dataHora);
                      return lastAnotacaoB.getTime() - lastAnotacaoA.getTime();
                    })
                    .slice(0, 12)
                    .map((caderno) => (
                      <Card 
                        key={caderno.id} 
                        className="border border-[#F8E6FF]/80 hover:border-[#4F1964]/40 transition-all hover:shadow-elegant cursor-pointer group h-[180px] p-4 flex flex-col rounded-xl hover:bg-[#FDFAFF]"
                        onClick={() => handleAbrirCaderno(caderno.id)}
                      >
                        <CardHeader className="pb-2 p-3 flex-grow">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-semibold text-[#4F1964] truncate" title={caderno.titulo}>
                              {caderno.titulo}
                            </CardTitle>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-1 text-muted-foreground"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditarCaderno(caderno.id, caderno.titulo);
                                }}
                                title="Renomear caderno"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-1 text-red-500 hover:text-red-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletarCaderno(caderno.id);
                                }}
                                title="Deletar caderno"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-3 pb-1 pt-0 mt-auto">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <span>{caderno.anotacoes.length} anotações</span>
                          </div>
                        </CardContent>
                        <CardFooter className="p-3 pt-2">
                          <Button 
                            variant="ghost" 
                            className="w-full justify-center gap-1 text-[#4F1964] hover:bg-[#F8E6FF] hover:text-[#6B3182] group-hover:bg-[#F8E6FF]/50 transition-colors py-1.5 text-sm rounded-lg"
                          >
                            <span>Abrir caderno</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhum caderno encontrado</h3>
                    <p className="text-muted-foreground mb-6">
                      Comece criando seu primeiro caderno de estudos.
                    </p>
                    <Button 
                      onClick={() => setIsNovoCadernoDialogOpen(true)}
                      className="bg-[#4F1964] hover:bg-[#6B3182] text-white hover:scale-105 transition-transform shadow-md"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Criar Caderno
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <NovoCadernoDialog 
        open={isNovoCadernoDialogOpen} 
        onOpenChange={setIsNovoCadernoDialogOpen} 
        onCadernoAdicionado={handleNovoCadernoAdicionado} 
      />
      
      <Dialog open={editCadernoId !== null} onOpenChange={(open) => !open && cancelarEdicao()}>
        <DialogContent className="sm:max-w-md shadow-elegant border border-[#F8E6FF]/70 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#4F1964] text-2xl">Renomear Caderno</DialogTitle>
            <DialogDescription>
              Altere o título do seu caderno de estudos.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Novo título</Label>
              <Input
                id="titulo"
                value={novoTitulo}
                onChange={(e) => setNovoTitulo(e.target.value)}
                placeholder="Ex.: Direito Civil VI"
                autoFocus
                className="transition-all focus:border-[#4F1964] focus:ring-[#4F1964] focus:ring-2 border-[#F8E6FF]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={cancelarEdicao}
              className="border-[#F8E6FF] hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSalvarEdicao}
              className="bg-[#4F1964] hover:bg-[#6B3182] text-white hover:scale-105 transition-all shadow-md"
              disabled={!novoTitulo.trim()}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteCadernoId !== null} onOpenChange={(open) => !open && cancelarDelecao()}>
        <DialogContent className="sm:max-w-md shadow-elegant border border-red-200/70 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-red-600 text-2xl">Deletar Caderno</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar este caderno? Esta ação não pode ser desfeita e todas as anotações serão perdidas.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={cancelarDelecao}
              className="border-gray-300 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button 
              onClick={confirmarDelecao}
              className="bg-red-600 hover:bg-red-700 text-white hover:scale-105 transition-all shadow-md"
            >
              Deletar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Cadernos2;
