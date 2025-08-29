
import React from 'react';
import { GraduationCap, Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SimulatorCard from '@/components/SimulatorCard';

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

interface SimuladoSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  simulados: Simulado[];
  isAdmin: boolean;
  onAddNew: () => void;
  onUpdate: () => void;
  emptyMessage: string;
}

const SimuladoSection = ({ 
  title, 
  icon: Icon, 
  simulados, 
  isAdmin, 
  onAddNew, 
  onUpdate, 
  emptyMessage 
}: SimuladoSectionProps) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Icon className="h-6 w-6 text-[#4F1964]" />
          <h2 className="text-2xl font-bold text-[#4F1964]">{title}</h2>
        </div>
        
        {isAdmin && (
          <Button 
            onClick={onAddNew}
            className="bg-[#4F1964] hover:bg-[#6B3182] text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Incluir novo
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {simulados.length > 0 ? (
          simulados.map((simulado, index) => (
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
              isAdmin={isAdmin}
              simuladoId={simulado.id}
              onUpdate={onUpdate}
              category={simulado.category}
              phase={simulado.phase}
              area={simulado.area}
            />
          ))
        ) : (
          <p className="col-span-2 text-center text-muted-foreground">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
};

export default SimuladoSection;
