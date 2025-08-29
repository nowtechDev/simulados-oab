import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Book, Save, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ListaAnotacoes from '@/components/cadernos/ListaAnotacoes';
import EditorAnotacao from '@/components/cadernos/EditorAnotacao';
import NovoCadernoDialog from '@/components/cadernos/NovoCadernoDialog';
import { Caderno, Anotacao, MateriaJuridica } from '@/types/caderno';
import { getCaderno, getCadernos, adicionarAnotacao } from '@/services/cadernoService';
import OpenAIConfig from '@/components/OpenAIConfig';

const CadernoView = () => {
  const { id } = useParams<{ id: string; }>();
  const cadernoId = parseInt(id || '0');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [caderno, setCaderno] = useState<Caderno | null>(null);
  const [cadernosDaMateria, setCadernosDaMateria] = useState<Caderno[]>([]);
  const [materiaAtiva, setMateriaAtiva] = useState<MateriaJuridica | null>(null);
  const [anotacaoSelecionadaId, setAnotacaoSelecionadaId] = useState<string | null>(null);
  const [anotacaoAtual, setAnotacaoAtual] = useState<Anotacao | null>(null);
  const [isNovoCadernoDialogOpen, setIsNovoCadernoDialogOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [conteudoEditor, setConteudoEditor] = useState('');

  const loadCadernoData = () => {
    console.log("Loading caderno data for id:", cadernoId);
    
    if (cadernoId) {
      const cadernoEncontrado = getCaderno(cadernoId);
      console.log("Caderno found:", cadernoEncontrado ? `${cadernoEncontrado.titulo} (${cadernoEncontrado.id})` : "null");
      
      if (cadernoEncontrado) {
        setCaderno(cadernoEncontrado);
        setMateriaAtiva(cadernoEncontrado.materia as MateriaJuridica);
        if (cadernoEncontrado.anotacoes.length > 0) {
          const primeiraAnotacao = cadernoEncontrado.anotacoes[0];
          setAnotacaoSelecionadaId(primeiraAnotacao.id);
          setAnotacaoAtual(primeiraAnotacao);
        } else {
          setAnotacaoSelecionadaId(null);
          setAnotacaoAtual(null);
        }
      } else {
        console.log("Caderno not found, redirecting to /cadernos2");
        toast({
          title: "Caderno não encontrado",
          description: "O caderno foi deletado ou não existe mais.",
          variant: "destructive"
        });
        navigate('/cadernos2');
      }
    }
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
      return;
    }
    
    loadCadernoData();
  }, [navigate, toast, cadernoId]);

  useEffect(() => {
    const handleStorageChange = () => {
      console.log("Storage changed, reloading caderno data");
      loadCadernoData();
    };
    
    const handleCadernoUpdate = () => {
      console.log("Caderno updated event received, reloading data");
      loadCadernoData();
    };

    // Adicionar listener para mudanças diretas no localStorage
    const handleStorageEventDirect = (e: StorageEvent) => {
      if (e.key === 'cadernos') {
        console.log("Direct storage event for cadernos, checking if current caderno still exists");
        const cadernos = e.newValue ? JSON.parse(e.newValue) : [];
        const cadernoExiste = cadernos.find((c: Caderno) => c.id === cadernoId);
        
        if (!cadernoExiste) {
          console.log("Current caderno no longer exists, redirecting");
          navigate('/cadernos2');
        } else {
          loadCadernoData();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cadernoUpdated', handleCadernoUpdate);
    window.addEventListener('storage', handleStorageEventDirect);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cadernoUpdated', handleCadernoUpdate);
      window.removeEventListener('storage', handleStorageEventDirect);
    };
  }, [cadernoId, navigate]);

  useEffect(() => {
    if (materiaAtiva) {
      const cadernos = getCadernos();
      const filtrados = cadernos.filter(c => c.materia === materiaAtiva);
      setCadernosDaMateria(filtrados);
    }
  }, [materiaAtiva]);

  useEffect(() => {
    if (caderno && anotacaoSelecionadaId) {
      const anotacaoEncontrada = caderno.anotacoes.find(a => a.id === anotacaoSelecionadaId);
      setAnotacaoAtual(anotacaoEncontrada || null);
    } else {
      setAnotacaoAtual(null);
    }
  }, [caderno, anotacaoSelecionadaId]);

  const handleSelecionarMateria = (materia: MateriaJuridica) => {
    setMateriaAtiva(materia);
    const cadernos = getCadernos();
    const cadernosDaMateria = cadernos.filter(c => c.materia === materia);
    if (cadernosDaMateria.length > 0) {
      navigate(`/caderno/${cadernosDaMateria[0].id}`);
    } else {
      setIsNovoCadernoDialogOpen(true);
    }
  };

  const handleSelecionarAnotacao = (id: string) => {
    setAnotacaoSelecionadaId(id);
  };

  const handleNovaAnotacao = () => {
    setAnotacaoSelecionadaId(null);
    setAnotacaoAtual(null);
  };

  const handleAnotacaoSalva = (anotacao: Anotacao) => {
    if (cadernoId) {
      const cadernoAtualizado = getCaderno(cadernoId);
      if (cadernoAtualizado) {
        setCaderno(cadernoAtualizado);
        setAnotacaoSelecionadaId(anotacao.id);
      }
    }
  };

  const handleNovoCadernoAdicionado = () => {
    if (materiaAtiva) {
      const cadernos = getCadernos();
      const filtrados = cadernos.filter(c => c.materia === materiaAtiva);
      setCadernosDaMateria(filtrados);
    }
  };

  const handleSalvar = () => {
    if (!conteudoEditor.trim()) {
      toast({
        title: "Conteúdo vazio",
        description: "Por favor, escreva algo antes de salvar.",
        variant: "destructive"
      });
      return;
    }

    try {
      let anotacao: Anotacao = adicionarAnotacao(cadernoId, conteudoEditor);
      
      toast({
        title: "Anotação salva",
        description: "Sua anotação foi salva com sucesso."
      });
      
      handleAnotacaoSalva(anotacao);
    } catch (error) {
      console.error("Erro ao salvar anotação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a anotação. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleExportar = () => {
    if (!anotacaoAtual) {
      toast({
        title: "Nenhuma anotação selecionada",
        description: "Selecione ou crie uma anotação antes de exportar.",
        variant: "destructive"
      });
      return;
    }

    const exportEvent = new CustomEvent('exportanotacao', { detail: { anotacaoId: anotacaoAtual.id } });
    window.dispatchEvent(exportEvent);
  };

  if (!isLoggedIn) {
    return null;
  }

  // Se o caderno não existe mais, não renderizar nada (já redirecionamos)
  if (!caderno) {
    return null;
  }

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        <div className="p-4 border-b flex justify-between items-center bg-[#F9F0FF]">
          <Button variant="ghost" size="sm" onClick={() => navigate('/cadernos2')}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar
          </Button>
          
          {caderno && (
            <div className="flex items-center flex-grow justify-center">
              <Book className="w-6 h-6 mr-2 text-[#4F1964]" />
              <div>
                <h1 className="text-2xl font-bold text-[#4F1964]">
                  {caderno.titulo}
                </h1>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSalvar}
            >
              <Save className="w-4 h-4 mr-1" />
              Salvar
            </Button>
            {anotacaoAtual?.iaAprimorado && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportar}
              >
                <Download className="w-4 h-4 mr-1" />
                Exportar
              </Button>
            )}
            <OpenAIConfig className="h-9 ml-2" />
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          <ListaAnotacoes 
            anotacoes={caderno?.anotacoes || []} 
            anotacaoSelecionada={anotacaoSelecionadaId} 
            onSelecionarAnotacao={handleSelecionarAnotacao} 
            onNovaAnotacao={handleNovaAnotacao} 
            materiaAtiva={materiaAtiva} 
            onSelecionarMateria={handleSelecionarMateria} 
            onNovoCaderno={() => setIsNovoCadernoDialogOpen(true)} 
          />
          
          <div className="flex-1 p-6 overflow-y-auto">
            {caderno && (
              <EditorAnotacao 
                cadernoId={caderno.id} 
                cadernoTitulo={caderno.titulo} 
                anotacaoAtual={anotacaoAtual} 
                onAnotacaoSalva={handleAnotacaoSalva} 
                onExport={handleExportar}
              />
            )}
          </div>
        </div>
      </div>
      
      <NovoCadernoDialog 
        open={isNovoCadernoDialogOpen} 
        onOpenChange={setIsNovoCadernoDialogOpen} 
        onCadernoAdicionado={handleNovoCadernoAdicionado} 
      />
    </Layout>
  );
};

export default CadernoView;
