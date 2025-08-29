
import React from 'react';
import SimuladoFormDialog from '@/components/simulados/SimuladoFormDialog';
import SimuladoFaseTipoDialog from '@/components/simulados/SimuladoFaseTipoDialog';
import ExameSelectionDialog from '@/components/ExameSelectionDialog';
import SegundaFaseFGVExameDialog from '@/components/SegundaFaseFGVExameDialog';
import ProvasSelectionDialog from '@/components/simulados/ProvasSelectionDialog';
import SegundaFaseAreaDialog from '@/components/SegundaFaseAreaDialog';

interface AreaDialog {
  id: string;
  name: string;
  slug: string;
}

interface SimuladoDialogsProps {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  isFaseTipoDialogOpenFGV: boolean;
  setIsFaseTipoDialogOpenFGV: (open: boolean) => void;
  isFaseTipoDialogOpenIA: boolean;
  setIsFaseTipoDialogOpenIA: (open: boolean) => void;
  isExameSelectionDialogOpen: boolean;
  setIsExameSelectionDialogOpen: (open: boolean) => void;
  isSegundaFaseFGVExameDialogOpen: boolean;
  setIsSegundaFaseFGVExameDialogOpen: (open: boolean) => void;
  isProvasSelectionDialogOpen: boolean;
  setIsProvasSelectionDialogOpen: (open: boolean) => void;
  currentCategory: string;
  segundaFaseAreas: AreaDialog[];
  onSuccess: () => void;
  onCreateSimulado: (phase: string, category: string) => void;
}

const SimuladoDialogs = ({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  isFaseTipoDialogOpenFGV,
  setIsFaseTipoDialogOpenFGV,
  isFaseTipoDialogOpenIA,
  setIsFaseTipoDialogOpenIA,
  isExameSelectionDialogOpen,
  setIsExameSelectionDialogOpen,
  isSegundaFaseFGVExameDialogOpen,
  setIsSegundaFaseFGVExameDialogOpen,
  isProvasSelectionDialogOpen,
  setIsProvasSelectionDialogOpen,
  currentCategory,
  segundaFaseAreas,
  onSuccess,
  onCreateSimulado
}: SimuladoDialogsProps) => {
  // Transform areas to match expected interface
  const transformedAreas = segundaFaseAreas.map(area => ({
    id: area.id,
    label: area.name
  }));

  return (
    <>
      <SimuladoFormDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={onSuccess}
        category={currentCategory}
      />

      <SimuladoFaseTipoDialog
        open={isFaseTipoDialogOpenFGV}
        onOpenChange={setIsFaseTipoDialogOpenFGV}
        onCreateSimulado={onCreateSimulado}
        category="fgv"
      />

      <SimuladoFaseTipoDialog
        open={isFaseTipoDialogOpenIA}
        onOpenChange={setIsFaseTipoDialogOpenIA}
        onCreateSimulado={onCreateSimulado}
        category="ia"
      />

      <ExameSelectionDialog 
        open={isExameSelectionDialogOpen} 
        onOpenChange={setIsExameSelectionDialogOpen}
      />

      <SegundaFaseFGVExameDialog
        open={isSegundaFaseFGVExameDialogOpen}
        onOpenChange={setIsSegundaFaseFGVExameDialogOpen}
        onExameSelect={(exame) => console.log('Exame selecionado:', exame)}
        area={null}
      />

      <ProvasSelectionDialog 
        open={isProvasSelectionDialogOpen} 
        onOpenChange={setIsProvasSelectionDialogOpen}
        simuladoId={1}
        simuladoTitle="Simulado OAB - Primeira Fase FGV"
      />
      
      <SegundaFaseAreaDialog
        open={false}
        onOpenChange={() => {}}
        areas={transformedAreas}
        fromFgvExam={false}
      />
    </>
  );
};

export default SimuladoDialogs;
