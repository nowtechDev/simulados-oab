
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { GraduationCap, Sparkles } from 'lucide-react';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { useSimuladoData } from '@/hooks/useSimuladoData';
import PageHeader from '@/components/simulados/PageHeader';
import LoadingView from '@/components/simulados/LoadingView';
import SimuladoSection from '@/components/simulados/SimuladoSection';
import SimuladoDialogs from '@/components/simulados/SimuladoDialogs';

interface Simulado {
  id: number;
  title: string;
  questions: number;
  duration: string;
  difficulty: "fácil" | "médio" | "difícil";
  type: "fgv" | "ia" | "oab" | "concurso" | "residência";
  path: string;
  description: string;
  customClickHandler?: () => void;
  category: string;
  phase: string;
  area: string;
}

interface AreaDialog {
  id: string;
  name: string;
  slug: string;
}

const SimuladosAvancado = () => {
  const { isLoggedIn, isAdmin } = useAuthCheck();
  const { fgvSimulados, iaSimulados, segundaFaseAreas, isLoading, fetchSimulados } = useSimuladoData();
  
  // Dialog states
  const [isExameSelectionDialogOpen, setIsExameSelectionDialogOpen] = useState(false);
  const [isSegundaFaseFGVExameDialogOpen, setIsSegundaFaseFGVExameDialogOpen] = useState(false);
  const [isProvasSelectionDialogOpen, setIsProvasSelectionDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isFaseTipoDialogOpenFGV, setIsFaseTipoDialogOpenFGV] = useState(false);
  const [isFaseTipoDialogOpenIA, setIsFaseTipoDialogOpenIA] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('');

  const handleFaseTipoClick = (category: string) => {
    setCurrentCategory(category);
    
    if (category === 'fgv') {
      setIsFaseTipoDialogOpenFGV(true);
    } else {
      setIsFaseTipoDialogOpenIA(true);
    }
  };

  const handleCreateSimulado = (phase: string, category: string) => {
    setCurrentCategory(category);
    setIsCreateDialogOpen(true);
  };

  // Process FGV simulados with custom click handlers and proper typing
  const processedFgvSimulados: Simulado[] = fgvSimulados.map(simulado => ({
    ...simulado,
    difficulty: (simulado.difficulty as "fácil" | "médio" | "difícil") || "médio",
    type: (simulado.type as "fgv" | "ia" | "oab" | "concurso" | "residência") || "fgv",
    customClickHandler: getCustomClickHandler(simulado)
  }));

  // Process IA simulados with proper typing
  const processedIaSimulados: Simulado[] = iaSimulados.map(simulado => ({
    ...simulado,
    difficulty: (simulado.difficulty as "fácil" | "médio" | "difícil") || "médio",
    type: (simulado.type as "fgv" | "ia" | "oab" | "concurso" | "residência") || "ia",
  }));

  function getCustomClickHandler(simulado: any) {
    if (simulado.phase === 'primeira' && simulado.title && simulado.title.includes('Primeira Fase FGV')) {
      return () => setIsProvasSelectionDialogOpen(true);
    } else if (simulado.phase === 'segunda' && simulado.title && simulado.title.includes('Segunda Fase FGV')) {
      return () => setIsSegundaFaseFGVExameDialogOpen(true);
    } else if (simulado.path === '#') {
      return () => setIsExameSelectionDialogOpen(true);
    }
    return undefined;
  }

  // Convert areas to the expected format for the dialog component
  const areasForDialog: AreaDialog[] = segundaFaseAreas.map(area => ({
    id: area.id,
    name: area.name,
    slug: area.slug
  }));

  // If not logged in, return nothing (will redirect in useEffect)
  if (!isLoggedIn) {
    return null;
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-6 max-w-7xl py-0">
        <PageHeader />
        
        {isLoading ? (
          <LoadingView />
        ) : (
          <>
            <SimuladoSection
              title="Simulados Oficiais FGV"
              icon={GraduationCap}
              simulados={processedFgvSimulados}
              isAdmin={isAdmin}
              onAddNew={() => handleFaseTipoClick('fgv')}
              onUpdate={fetchSimulados}
              emptyMessage="Nenhum simulado FGV encontrado."
            />
            
            <SimuladoSection
              title="Simulados Personalizados com IA"
              icon={Sparkles}
              simulados={processedIaSimulados}
              isAdmin={isAdmin}
              onAddNew={() => handleFaseTipoClick('ia')}
              onUpdate={fetchSimulados}
              emptyMessage="Nenhum simulado IA encontrado."
            />
          </>
        )}
      </div>

      <SimuladoDialogs
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        isFaseTipoDialogOpenFGV={isFaseTipoDialogOpenFGV}
        setIsFaseTipoDialogOpenFGV={setIsFaseTipoDialogOpenFGV}
        isFaseTipoDialogOpenIA={isFaseTipoDialogOpenIA}
        setIsFaseTipoDialogOpenIA={setIsFaseTipoDialogOpenIA}
        isExameSelectionDialogOpen={isExameSelectionDialogOpen}
        setIsExameSelectionDialogOpen={setIsExameSelectionDialogOpen}
        isSegundaFaseFGVExameDialogOpen={isSegundaFaseFGVExameDialogOpen}
        setIsSegundaFaseFGVExameDialogOpen={setIsSegundaFaseFGVExameDialogOpen}
        isProvasSelectionDialogOpen={isProvasSelectionDialogOpen}
        setIsProvasSelectionDialogOpen={setIsProvasSelectionDialogOpen}
        currentCategory={currentCategory}
        segundaFaseAreas={areasForDialog}
        onSuccess={fetchSimulados}
        onCreateSimulado={handleCreateSimulado}
      />
    </Layout>
  );
};

export default SimuladosAvancado;
