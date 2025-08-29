import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client'; 
import SimulatorCard from '@/components/SimulatorCard';
import SegundaFaseAreaDialog from '@/components/SegundaFaseAreaDialog';
import ExameSelectionDialog from '@/components/ExameSelectionDialog';
import SegundaFaseFGVExameDialog from '@/components/SegundaFaseFGVExameDialog';
import ProvasSelectionDialog from '@/components/simulados/ProvasSelectionDialog';
import { School, Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SimuladoFormDialog from '@/components/simulados/SimuladoFormDialog';
import SimuladoFaseTipoDialog from '@/components/simulados/SimuladoFaseTipoDialog';

const SimuladosDesbloqueado = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fgvSimulados, setFgvSimulados] = useState([]);
  const [iaSimulados, setIaSimulados] = useState([]);
  const [segundaFaseAreas, setSegundaFaseAreas] = useState([]);
  const [isSegundaFaseDialogOpen, setIsSegundaFaseDialogOpen] = useState(false);
  const [isExameSelectionDialogOpen, setIsExameSelectionDialogOpen] = useState(false);
  const [isSegundaFaseFGVExameDialogOpen, setIsSegundaFaseFGVExameDialogOpen] = useState(false);
  const [isProvasSelectionDialogOpen, setIsProvasSelectionDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isFaseTipoDialogOpenFGV, setIsFaseTipoDialogOpenFGV] = useState(false);
  const [isFaseTipoDialogOpenIA, setIsFaseTipoDialogOpenIA] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('');
  const [selectedArea, setSelectedArea] = useState(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
      
      // Check if user is admin (type_user = 1)
      const userType = Number(localStorage.getItem('userType'));
      console.log("Current user type:", userType);
      setIsAdmin(userType === 1);

      return loggedIn;
    };

    const loggedIn = checkLoginStatus();
    
    if (!loggedIn) {
      toast({
        title: "Acesso restrito",
        description: "Faça login para acessar esta página",
        variant: "destructive",
      });
      navigate('/login');
    } else {
      // Only fetch simulados if user is logged in
      fetchSimulados();
      fetchSegundaFaseAreas();
    }
  }, [navigate, toast]);

  const fetchSegundaFaseAreas = async () => {
    try {
      console.log("Iniciando busca por áreas da segunda fase...");
      const { data, error } = await supabase
        .from('segunda_fase_areas')
        .select('*')
        .eq('active', true);

      if (error) {
        console.error('Erro ao buscar áreas da segunda fase:', error);
        toast({
          title: 'Erro ao carregar áreas',
          description: 'Não foi possível carregar as áreas da segunda fase.',
          variant: 'destructive',
        });
        throw error;
      }

      console.log("Áreas da segunda fase encontradas:", data);
      setSegundaFaseAreas(data || []);
    } catch (err) {
      console.error('Erro ao buscar áreas da segunda fase:', err);
      toast({
        title: 'Erro ao carregar áreas',
        description: err.message || 'Não foi possível carregar as áreas da segunda fase.',
        variant: 'destructive',
      });
    }
  };

  const fetchSimulados = async () => {
    try {
      console.log("Fetching simulados started...");
      setIsLoading(true);

      // Fetch FGV simulados
      const { data: fgvData, error: fgvError } = await supabase
        .from('simulados')
        .select('*')
        .eq('category', 'fgv');

      if (fgvError) {
        console.error('Erro ao buscar simulados FGV:', fgvError);
        throw fgvError;
      }

      // Fetch IA simulados
      const { data: iaData, error: iaError } = await supabase
        .from('simulados')
        .select('*')
        .eq('category', 'ia');

      if (iaError) {
        console.error('Erro ao buscar simulados IA:', iaError);
        throw iaError;
      }

      console.log("FGV data:", fgvData || []);
      console.log("IA data:", iaData || []);

      // Process FGV simulados
      const processedFgvSimulados = (fgvData || []).map(simulado => {
        let customClickHandler = undefined;
        
        // Check if it's Primeira Fase FGV specifically
        if (simulado.phase === 'primeira' && simulado.title && simulado.title.includes('Primeira Fase FGV')) {
          customClickHandler = () => setIsProvasSelectionDialogOpen(true);
        } else if (simulado.phase === 'segunda' && simulado.title && simulado.title.includes('Segunda Fase FGV')) {
          customClickHandler = () => setIsSegundaFaseDialogOpen(true);
        } else if (simulado.path === '#') {
          customClickHandler = () => setIsExameSelectionDialogOpen(true);
        }

        return {
          ...simulado,
          type: simulado.type || 'fgv',
          difficulty: simulado.difficulty || 'médio',
          questions: simulado.questions || 0,
          duration: simulado.duration || '0 min',
          description: simulado.description || '',
          path: simulado.path || '#',
          customClickHandler
        };
      });

      // Process IA simulados with correct paths
      const processedIaSimulados = (iaData || []).map(simulado => {
        let simuladoPath = simulado.path || '#';
        let customClickHandler = undefined;

        // Set correct paths for IA simulados based on their titles
        if (simulado.title && simulado.title.includes('Primeira Fase')) {
          simuladoPath = '/simulado-primeira-fase-ia';
        } else if (simulado.title && simulado.title.includes('Segunda Fase')) {
          simuladoPath = '/simulado-ia';
        }

        return {
          ...simulado,
          type: simulado.type || 'ia',
          difficulty: simulado.difficulty || 'médio',
          questions: simulado.questions || 0,
          duration: simulado.duration || '0 min',
          description: simulado.description || '',
          path: simuladoPath,
          customClickHandler
        };
      });

      setFgvSimulados(processedFgvSimulados);
      setIaSimulados(processedIaSimulados);
      console.log("Simulados processed successfully:", 
                  "FGV:", processedFgvSimulados.length, 
                  "IA:", processedIaSimulados.length);
    } catch (err) {
      console.error('Erro ao buscar simulados:', err);
      toast({
        title: 'Erro ao carregar simulados',
        description: err.message || 'Não foi possível carregar os simulados.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      console.log("Fetch complete, loading state set to false");
    }
  };

  const handleFaseTipoClick = (category) => {
    setCurrentCategory(category);
    
    if (category === 'fgv') {
      setIsFaseTipoDialogOpenFGV(true);
    } else {
      setIsFaseTipoDialogOpenIA(true);
    }
  };

  const handleAreaSelect = (area) => {
    console.log("handleAreaSelect recebeu área:", area);
    
    // Verificar se área tem as propriedades necessárias
    if (!area || !area.id) {
      console.error("Área inválida recebida:", area);
      toast({
        title: "Erro ao selecionar área",
        description: "A área selecionada é inválida.",
        variant: "destructive",
      });
      return;
    }
    
    // Salvar detalhes da área na sessionStorage para uso em diferentes componentes
    sessionStorage.setItem('selectedAreaId', area.id);
    sessionStorage.setItem('selectedAreaName', area.name);
    sessionStorage.setItem('selectedAreaSlug', area.slug || '');
    
    console.log("Área selecionada salva em sessionStorage:", {
      id: area.id,
      name: area.name,
      slug: area.slug
    });
    
    setSelectedArea(area);
    setIsSegundaFaseDialogOpen(false);
    setIsSegundaFaseFGVExameDialogOpen(true);
  };

  const handleCreateSimulado = (phase, category) => {
    setCurrentCategory(category);
    setIsCreateDialogOpen(true);
  };

  // If not logged in, return nothing (will redirect in useEffect)
  if (!isLoggedIn) {
    return null;
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="bg-[#F8E6FF] px-4 py-1.5 rounded-full text-sm font-medium text-[#4F1964] mb-4 inline-block">
            Acesso Total Desbloqueado
          </span>
          <h1 className="text-4xl font-bold text-[#4F1964] mb-4">
            Escolha seu Simulado
          </h1>
          <p className="text-foreground/80 text-lg">
            Acesso completo a todos os simulados disponíveis.
            Receba feedback detalhado e instruções para melhorar seu desempenho.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-center text-lg text-foreground/80 mb-2">Carregando simulados...</p>
            <div className="animate-pulse h-2 w-40 bg-[#4F1964]/30 rounded-full"></div>
          </div>
        ) : (
          <>
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <School className="h-6 w-6 text-[#4F1964]" />
                  <h2 className="text-2xl font-bold text-[#4F1964]">Simulados Oficiais FGV</h2>
                </div>
                
                {isAdmin && (
                  <Button 
                    onClick={() => handleFaseTipoClick('fgv')}
                    className="bg-[#4F1964] hover:bg-[#6B3182] text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Incluir novo
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fgvSimulados.length > 0 ? (
                  fgvSimulados.map((simulado, index) => {
                    // Update customClickHandler for Segunda Fase FGV to use the new page
                    let customClickHandler = simulado.customClickHandler;
                    
                    if (simulado.phase === 'segunda' && simulado.title && simulado.title.includes('Segunda Fase FGV')) {
                      customClickHandler = () => navigate('/segunda-fase-simulados');
                    }

                    return (
                      <SimulatorCard
                        key={index}
                        title={simulado.title}
                        questions={simulado.questions}
                        duration={simulado.duration}
                        difficulty={simulado.difficulty}
                        type={simulado.type}
                        path={simulado.path}
                        description={simulado.description}
                        customClickHandler={customClickHandler}
                        isAdmin={isAdmin}
                        simuladoId={simulado.id}
                        onUpdate={fetchSimulados}
                        category={simulado.category}
                        phase={simulado.phase}
                        area={simulado.area}
                      />
                    );
                  })
                ) : (
                  <p className="col-span-2 text-center text-muted-foreground">Nenhum simulado FGV encontrado.</p>
                )}
              </div>
            </div>
            
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-[#4F1964]" />
                  <h2 className="text-2xl font-bold text-[#4F1964]">Simulados Personalizados com IA</h2>
                </div>
                
                {isAdmin && (
                  <Button 
                    onClick={() => handleFaseTipoClick('ia')}
                    className="bg-[#4F1964] hover:bg-[#6B3182] text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Incluir novo
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {iaSimulados.length > 0 ? (
                  iaSimulados.map((simulado, index) => (
                    <SimulatorCard
                      key={index}
                      title={simulado.title}
                      questions={simulado.questions}
                      duration={simulado.duration}
                      difficulty={simulado.difficulty}
                      type="ia"
                      path={simulado.path}
                      description={simulado.description}
                      isAdmin={isAdmin}
                      simuladoId={simulado.id}
                      onUpdate={fetchSimulados}
                      category={simulado.category}
                      phase={simulado.phase}
                      area={simulado.area}
                    />
                  ))
                ) : (
                  <p className="col-span-2 text-center text-muted-foreground">Nenhum simulado IA encontrado.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <SegundaFaseAreaDialog 
        open={isSegundaFaseDialogOpen} 
        onOpenChange={setIsSegundaFaseDialogOpen} 
        areas={segundaFaseAreas}
        fromFgvExam={true}
        onAreaSelect={handleAreaSelect}
      />

      <ExameSelectionDialog 
        open={isExameSelectionDialogOpen} 
        onOpenChange={setIsExameSelectionDialogOpen} 
      />

      <SegundaFaseFGVExameDialog 
        open={isSegundaFaseFGVExameDialogOpen} 
        onOpenChange={setIsSegundaFaseFGVExameDialogOpen} 
        onExameSelect={(exame) => {
          console.log('Exame selecionado:', exame, 'Área:', selectedArea);
          
          if (!selectedArea || !selectedArea.id) {
            console.error("Área inválida ao selecionar exame:", selectedArea);
            toast({
              title: "Erro ao selecionar exame",
              description: "Área não selecionada corretamente.",
              variant: "destructive",
            });
            return;
          }
          
          // Resetar os estados após a seleção
          setIsSegundaFaseFGVExameDialogOpen(false);
          
          // Salvar área e exame na sessionStorage para uso posterior
          sessionStorage.setItem('selectedAreaId', selectedArea.id);
          sessionStorage.setItem('selectedAreaName', selectedArea.name);
          sessionStorage.setItem('selectedAreaSlug', selectedArea.slug || '');
          sessionStorage.setItem('selectedSegundaFaseFGVExame', exame.toString());
          
          console.log("Navegando para simulador com parâmetros:", {
            area: selectedArea.id,
            areaName: selectedArea.name,
            exame: exame
          });
          
          // Usar o ID como identificador principal, que é mais confiável
          navigate(`/simulador-segunda-fase?area=${selectedArea.id}&piece=${encodeURIComponent('Prova FGV')}&areaName=${encodeURIComponent(selectedArea.name)}&exame=${exame}`);
        }}
        area={selectedArea}
      />

      <ProvasSelectionDialog 
        open={isProvasSelectionDialogOpen} 
        onOpenChange={setIsProvasSelectionDialogOpen}
        simuladoId={1}
        simuladoTitle="Simulado OAB - Primeira Fase FGV"
      />

      <SimuladoFormDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={fetchSimulados}
        category={currentCategory}
      />

      <SimuladoFaseTipoDialog
        open={isFaseTipoDialogOpenFGV}
        onOpenChange={setIsFaseTipoDialogOpenFGV}
        onCreateSimulado={handleCreateSimulado}
        category="fgv"
      />

      <SimuladoFaseTipoDialog
        open={isFaseTipoDialogOpenIA}
        onOpenChange={setIsFaseTipoDialogOpenIA}
        onCreateSimulado={handleCreateSimulado}
        category="ia"
      />
    </Layout>
  );
};

export default SimuladosDesbloqueado;
