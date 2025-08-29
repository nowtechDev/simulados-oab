
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SimulatorCard from '@/components/SimulatorCard';
import ExameSelectionDialog from '@/components/ExameSelectionDialog';
import ProvasSelectionDialog from '@/components/simulados/ProvasSelectionDialog';
import { Sparkles, GraduationCap, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SimuladosGratuito = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fgvSimulados, setFgvSimulados] = useState([]);
  const [iaSimulados, setIaSimulados] = useState([]);
  const [isExameSelectionDialogOpen, setIsExameSelectionDialogOpen] = useState(false);
  const [isProvasSelectionDialogOpen, setIsProvasSelectionDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
      fetchSimulados();
    }
  }, [navigate, toast]);

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

      // Process FGV simulados with locked functionality for gratuito plan
      const processedFgvSimulados = (fgvData || []).map(simulado => {
        let customClickHandler = undefined;
        let locked = false;
        let lockMessage = '';
        
        // Check if it's Primeira Fase FGV specifically
        if (simulado.phase === 'primeira' && simulado.title && simulado.title.includes('Primeira Fase FGV')) {
          customClickHandler = () => setIsProvasSelectionDialogOpen(true);
        } else if (simulado.phase === 'segunda' && simulado.title && simulado.title.includes('Segunda Fase FGV')) {
          locked = true;
          lockMessage = 'Disponível nos planos Menthor Aprendiz e Menthor Avançado';
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
          customClickHandler,
          locked,
          lockMessage
        };
      });

      // Process IA simulados - all locked for gratuito plan
      const processedIaSimulados = (iaData || []).map(simulado => {
        let simuladoPath = simulado.path || '#';

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
          locked: true,
          lockMessage: 'Disponível apenas no plano Menthor Avançado'
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
  
  if (!isLoggedIn) {
    return null;
  }

  const handleUpgradeClick = () => {
    navigate('/#pricing');
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-6 max-w-7xl py-0">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="bg-[#F8E6FF] px-4 py-1.5 rounded-full text-sm font-medium text-[#4F1964] mb-4 inline-block">
            Plano Gratuito
          </span>
          <h1 className="text-4xl font-bold text-[#4F1964] mb-4">
            Escolha seu Simulado
          </h1>
          <p className="text-foreground/80 text-lg mb-6">
            Pratique com simulados personalizados que se adaptam ao seu nível de conhecimento.
            Receba feedback detalhado e instruções para melhorar seu desempenho.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 mb-8">
            <div className="bg-[#F8E6FF] border border-[#8B5CF6]/30 rounded-lg p-4 flex items-center gap-3 text-left flex-1">
              <Lock className="h-5 w-5 text-[#8B5CF6] flex-shrink-0" />
              <p className="text-sm text-[#4F1964]">
                <span className="font-semibold">Acesso Limitado:</span> Seu plano gratuito permite resolver até 10 questões da 1ª fase por dia. 
                <span className="block mt-1">
                  <Button variant="link" className="text-[#4F1964] font-medium p-0 h-auto" onClick={handleUpgradeClick}>
                    Assine um plano pago para acesso completo →
                  </Button>
                </span>
              </p>
            </div>
            
            <div className="bg-[#F8E6FF] border border-[#8B5CF6]/30 rounded-lg p-4 flex items-center gap-3 text-left flex-1">
              <Lock className="h-5 w-5 text-[#8B5CF6] flex-shrink-0" />
              <p className="text-sm text-[#4F1964]">
                <span className="font-semibold">Acesso aos Cadernos bloqueado</span> no plano gratuito.
                <span className="block mt-1">
                  <Button variant="link" className="text-[#4F1964] font-medium p-0 h-auto" onClick={handleUpgradeClick}>
                    Ver planos →
                  </Button>
                </span>
              </p>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-center text-lg text-foreground/80 mb-2">Carregando simulados...</p>
            <div className="animate-pulse h-2 w-40 bg-[#4F1964]/30 rounded-full"></div>
          </div>
        ) : (
          <>
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="h-6 w-6 text-[#4F1964]" />
                <h2 className="text-2xl font-bold text-[#4F1964]">Simulados Oficiais FGV</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fgvSimulados.length > 0 ? (
                  fgvSimulados.map((simulado, index) => {
                    return simulado.locked ? (
                      <div key={index} className="relative group">
                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black bg-opacity-10 backdrop-blur-[1px] rounded-xl transition-all duration-300">
                          <div className="transform -translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex flex-col items-center gap-3">
                            <div className="bg-white/95 p-4 rounded-lg shadow-lg border border-primary/10 max-w-[80%]">
                              <div className="flex items-center gap-2 mb-2">
                                <Lock className="h-4 w-4 text-[#4F1964]" />
                                <span className="font-semibold text-[#4F1964]">Conteúdo Bloqueado</span>
                              </div>
                              <p className="text-sm text-gray-700 mb-3">{simulado.lockMessage}</p>
                              <Button size="sm" onClick={handleUpgradeClick} className="w-full">
                                Ver Planos
                              </Button>
                            </div>
                          </div>
                        </div>
                        <SimulatorCard {...simulado} className="opacity-80 hover:transform hover:scale-[1.02] transition-all duration-300 ease-in-out" />
                      </div>
                    ) : (
                      <SimulatorCard 
                        key={index} 
                        title={simulado.title}
                        questions={simulado.questions}
                        duration={simulado.duration}
                        difficulty={simulado.difficulty}
                        type={simulado.type}
                        path={simulado.path}
                        description={simulado.description}
                        customClickHandler={simulado.customClickHandler}
                        className="hover:transform hover:scale-[1.02] transition-all duration-300 ease-in-out" 
                      />
                    );
                  })
                ) : (
                  <p className="col-span-2 text-center text-muted-foreground">Nenhum simulado FGV encontrado.</p>
                )}
              </div>
            </div>
            
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-6 w-6 text-[#4F1964]" />
                <h2 className="text-2xl font-bold text-[#4F1964]">Simulados Personalizados com IA</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {iaSimulados.length > 0 ? (
                  iaSimulados.map((simulado, index) => {
                    return simulado.locked ? (
                      <div key={index} className="relative group">
                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black bg-opacity-10 backdrop-blur-[1px] rounded-xl transition-all duration-300">
                          <div className="transform -translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex flex-col items-center gap-3">
                            <div className="bg-white/95 p-4 rounded-lg shadow-lg border border-primary/10 max-w-[80%]">
                              <div className="flex items-center gap-2 mb-2">
                                <Lock className="h-4 w-4 text-[#4F1964]" />
                                <span className="font-semibold text-[#4F1964]">Conteúdo Bloqueado</span>
                              </div>
                              <p className="text-sm text-gray-700 mb-3">{simulado.lockMessage}</p>
                              <Button size="sm" onClick={handleUpgradeClick} className="w-full">
                                Ver Planos
                              </Button>
                            </div>
                          </div>
                        </div>
                        <SimulatorCard {...simulado} className="opacity-80 hover:transform hover:scale-[1.02] transition-all duration-300 ease-in-out" />
                      </div>
                    ) : (
                      <SimulatorCard key={index} {...simulado} className="hover:transform hover:scale-[1.02] transition-all duration-300 ease-in-out" />
                    );
                  })
                ) : (
                  <p className="col-span-2 text-center text-muted-foreground">Nenhum simulado IA encontrado.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <ExameSelectionDialog open={isExameSelectionDialogOpen} onOpenChange={setIsExameSelectionDialogOpen} />

      <ProvasSelectionDialog 
        open={isProvasSelectionDialogOpen} 
        onOpenChange={setIsProvasSelectionDialogOpen}
        simuladoId={1}
        simuladoTitle="Simulado OAB - Primeira Fase FGV"
      />
    </Layout>
  );
};

export default SimuladosGratuito;
