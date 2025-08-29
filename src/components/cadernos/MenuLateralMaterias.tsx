
import React from 'react';
import { BookText, PlusCircle, Scale, Gavel, BookOpen, Building, ScrollText, History, Briefcase, Calculator, FileCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { materias } from '@/services/cadernoService';
import { Button } from '@/components/ui/button';
import { MateriaJuridica } from '@/types/caderno';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface MenuLateralMateriasProps {
  materiaAtiva: MateriaJuridica | null;
  onSelecionarMateria: (materia: MateriaJuridica) => void;
  onNovoCaderno: () => void;
}

// Função para obter o ícone de cada matéria
const getIconForMateria = (materia: MateriaJuridica) => {
  switch(materia) {
    case "Direito Constitucional": return <Scale className="w-5 h-5 mr-2" />;
    case "Direito Civil": return <BookOpen className="w-5 h-5 mr-2" />;
    case "Direito Penal": return <Gavel className="w-5 h-5 mr-2" />;
    case "Direito Administrativo": return <Building className="w-5 h-5 mr-2" />;
    case "Direito Processual Civil": return <ScrollText className="w-5 h-5 mr-2" />;
    case "Direito Processual Penal": return <History className="w-5 h-5 mr-2" />;
    case "Direito do Trabalho": return <Briefcase className="w-5 h-5 mr-2" />;
    case "Direito Empresarial": return <Calculator className="w-5 h-5 mr-2" />;
    case "Direito Tributário": return <Calculator className="w-5 h-5 mr-2" />;
    case "Ética Profissional": return <FileCheck className="w-5 h-5 mr-2" />;
    default: return <BookText className="w-5 h-5 mr-2" />;
  }
};

// Função para obter apenas o ícone (sem margem)
const getIconOnly = (materia: MateriaJuridica) => {
  switch(materia) {
    case "Direito Constitucional": return <Scale className="w-5 h-5" />;
    case "Direito Civil": return <BookOpen className="w-5 h-5" />;
    case "Direito Penal": return <Gavel className="w-5 h-5" />;
    case "Direito Administrativo": return <Building className="w-5 h-5" />;
    case "Direito Processual Civil": return <ScrollText className="w-5 h-5" />;
    case "Direito Processual Penal": return <History className="w-5 h-5" />;
    case "Direito do Trabalho": return <Briefcase className="w-5 h-5" />;
    case "Direito Empresarial": return <Calculator className="w-5 h-5" />;
    case "Direito Tributário": return <Calculator className="w-5 h-5" />;
    case "Ética Profissional": return <FileCheck className="w-5 h-5" />;
    default: return <BookText className="w-5 h-5" />;
  }
};

const MenuLateralMaterias = ({ 
  materiaAtiva, 
  onSelecionarMateria,
  onNovoCaderno
}: MenuLateralMateriasProps) => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Collapsible
      open={!collapsed}
      onOpenChange={(open) => setCollapsed(!open)}
      className={cn(
        "border-r bg-background transition-all duration-300 flex flex-col h-full overflow-hidden",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className={cn("font-semibold text-lg", collapsed && "hidden")}>Matérias</h3>
        <div className="flex items-center gap-2">
          {!collapsed && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-[#4F1964]"
              onClick={onNovoCaderno}
            >
              <PlusCircle className="w-4 h-4 mr-1" />
              <span>Novo</span>
            </Button>
          )}
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsibleContent className="overflow-y-auto flex-grow">
        <div className="p-2 space-y-1.5">
          {materias.map((materia) => (
            <Button
              key={materia}
              variant="ghost"
              className={cn(
                "w-full justify-start text-left py-3",
                materiaAtiva === materia 
                  ? "bg-[#F8E6FF] text-[#4F1964] font-medium" 
                  : "text-muted-foreground hover:text-foreground hover:bg-[#F8E6FF]/50"
              )}
              onClick={() => onSelecionarMateria(materia)}
            >
              {getIconForMateria(materia)}
              <span className="truncate">{materia}</span>
            </Button>
          ))}
        </div>
      </CollapsibleContent>

      {/* Exibir apenas ícones quando colapsado */}
      {collapsed && (
        <div className="p-2 space-y-1.5 overflow-y-auto">
          {materias.map((materia) => (
            <Button
              key={materia}
              variant="ghost"
              className={cn(
                "w-full h-10 p-0 flex justify-center",
                materiaAtiva === materia 
                  ? "bg-[#F8E6FF] text-[#4F1964]" 
                  : "text-muted-foreground hover:bg-[#F8E6FF]/50"
              )}
              onClick={() => onSelecionarMateria(materia)}
              title={materia}
            >
              {getIconOnly(materia)}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="icon"
            className="w-full h-10 mt-2 text-[#4F1964]"
            onClick={onNovoCaderno}
            title="Novo Caderno"
          >
            <PlusCircle className="w-5 h-5" />
          </Button>
        </div>
      )}
    </Collapsible>
  );
};

export default MenuLateralMaterias;
