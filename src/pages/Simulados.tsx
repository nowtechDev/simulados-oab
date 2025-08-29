import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client'; 
import { Button } from '@/components/ui/button';
import SimuladoFormDialog from '@/components/simulados/SimuladoFormDialog';
import SimuladoCard from '@/components/simulados/SimuladoCard';
import SegundaFaseAreaDialog from '@/components/SegundaFaseAreaDialog';
import ExameSelectionDialog from '@/components/ExameSelectionDialog';
import SegundaFaseExameSelectionDialog from '@/components/SegundaFaseExameSelectionDialog';
import ProvasSelectionDialog from '@/components/simulados/ProvasSelectionDialog';

const Simulados = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [simulados, setSimulados] = useState([]);
  const [isSegundaFaseDialogOpen, setIsSegundaFaseDialogOpen] = useState(false);
  const [isExameSelectionDialogOpen, setIsExameSelectionDialogOpen] = useState(false);
  const [isSegundaFaseExameSelectionDialogOpen, setIsSegundaFaseExameSelectionDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isProvasDialogOpen, setIsProvasDialogOpen] = useState(false);
  const [selectedSimulado, setSelectedSimulado] = useState<{id: number, title: string} | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    // Check if user is admin (type_user = 1)
    const userType = Number(localStorage.getItem('userType'));
    setIsAdmin(userType === 1);

    if (!loggedIn) {
      toast({
        title: "Acesso restrito",
        description: "Faça login para acessar esta página",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [navigate, toast]);

  const fetchSimulados = async () => {
    if (!isLoggedIn) return;
    
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('simulados')
        .select('*');

      if (error) {
        console.log('erro ao listar simulados', error)
        throw error;
      }

      // Map the data to ensure all required properties are present for SimulatorCard
      const processedSimulados = (data || []).map(simulado => ({
        ...simulado,
        type: simulado.type || 'oab',  // Default type if missing
        difficulty: simulado.difficulty || 'médio', // Default difficulty if missing
        questions: simulado.questions || 0,
        duration: simulado.duration || '0 min',
        description: simulado.description || '',
        path: simulado.path || '#',
        customClickHandler: simulado.path === '#' ? () => {
          // Verificar se é um simulado que deve abrir o seletor de provas
          if (simulado.category === 'fgv' || simulado.category === 'oab') {
            setSelectedSimulado({ id: simulado.id, title: simulado.title });
            setIsProvasDialogOpen(true);
          } else {
            setIsExameSelectionDialogOpen(true);
          }
        } : undefined
      }));

      setSimulados(processedSimulados);
    } catch (err) {
      console.error('Erro ao buscar simulados:', err);
      toast({
        title: 'Erro ao carregar simulados',
        description: err.message || 'Não foi possível carregar os simulados.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchSimulados();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="bg-[#F8E6FF] px-4 py-1.5 rounded-full text-sm font-medium text-[#4F1964] mb-4 inline-block">
            Preparação Eficiente
          </span>
          <h1 className="text-4xl font-bold text-[#4F1964] mb-4">
            Escolha seu Simulado
          </h1>
          <p className="text-foreground/80 text-lg">
            Pratique com simulados personalizados que se adaptam ao seu nível de conhecimento.
            Receba feedback detalhado e instruções para melhorar seu desempenho.
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-lg text-foreground/80">Carregando simulados...</p>
        ) : (
          <>
            {/* Seção Simulados */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-[#4F1964]" />
                  <h2 className="text-2xl font-bold text-[#4F1964]">Todos os Simulados</h2>
                </div>
                
                {isAdmin && (
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-[#4F1964] hover:bg-[#6B3182] text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Incluir novo
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {simulados.map((simulado, index) => (
                  <SimuladoCard
                    key={index}
                    simulado={simulado}
                    onUpdate={fetchSimulados}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <SimuladoFormDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={fetchSimulados}
      />

      <SegundaFaseAreaDialog 
        open={isSegundaFaseDialogOpen} 
        onOpenChange={setIsSegundaFaseDialogOpen} 
      />

      <ExameSelectionDialog
        open={isExameSelectionDialogOpen}
        onOpenChange={setIsExameSelectionDialogOpen}
      />

      <SegundaFaseExameSelectionDialog
        open={isSegundaFaseExameSelectionDialogOpen}
        onOpenChange={setIsSegundaFaseExameSelectionDialogOpen}
        onExameSelect={(exame) => console.log('Exame selecionado:', exame)}
        area={null}
      />

      <ProvasSelectionDialog
        open={isProvasDialogOpen}
        onOpenChange={setIsProvasDialogOpen}
        simuladoId={selectedSimulado?.id || 0}
        simuladoTitle={selectedSimulado?.title || ''}
      />
    </Layout>
  );
};

export default Simulados;
