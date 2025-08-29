
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ArrowRight, Clock, FileText, Sparkles, Lock, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SimuladoFormDialog from '@/components/simulados/SimuladoFormDialog';
import DeleteConfirmationDialog from '@/components/simulados/DeleteConfirmationDialog';

interface SimulatorCardProps {
  title: string;
  questions: number;
  duration: string;
  difficulty: 'fácil' | 'médio' | 'difícil';
  type: 'oab' | 'concurso' | 'residência' | 'ia' | 'fgv';
  path: string;
  className?: string;
  description?: string;
  customClickHandler?: () => void;
  additionalDetails?: {
    icon?: React.ReactNode;
    text?: string;
  }[];
  locked?: boolean;
  lockMessage?: string;
  isAdmin?: boolean;
  simuladoId?: number | string;
  onUpdate?: () => void;
  category?: string;
  phase?: string;
  area?: string;
}

const SimulatorCard = ({
  title,
  questions,
  duration,
  difficulty,
  type,
  path,
  className,
  description,
  customClickHandler,
  additionalDetails,
  locked = false,
  lockMessage,
  isAdmin = false,
  simuladoId,
  onUpdate,
  category,
  phase,
  area
}: SimulatorCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const difficultyColor = {
    'fácil': 'bg-green-100 text-green-700',
    'médio': 'bg-amber-100 text-amber-700',
    'difícil': 'bg-red-100 text-red-700'
  }[difficulty];

  const typeColor = {
    'oab': 'bg-primary/10 text-primary',
    'concurso': 'bg-purple-100 text-purple-700',
    'residência': 'bg-blue-100 text-blue-700',
    'ia': 'bg-[#F8E6FF] text-[#4F1964]',
    'fgv': 'bg-primary/10 text-primary'
  }[type];

  const typeLabel = type === 'ia' ? 'IA' : type === 'fgv' ? 'OAB' : type.toUpperCase();

  // Handle admin actions
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDeleteDialogOpen(true);
  };

  const renderActionButton = () => {
    if (locked) {
      return (
        <div className="w-full mt-auto">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-between group p-4 h-auto", 
              "border border-[#8B5CF6]/20 bg-[#F8E6FF]/20", 
              "transition-all duration-300 ease-in-out"
            )}
            disabled
          >
            <div className="flex items-center">
              <Lock className="h-4 w-4 mr-2 text-[#8B5CF6]" />
              <span className="text-[#4F1964]">Simulado bloqueado</span>
            </div>
            <ArrowRight className="h-4 w-4 text-[#8B5CF6]" />
          </Button>
        </div>
      );
    }
    
    if (customClickHandler) {
      return (
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-between group p-4 h-auto", 
            "border border-primary/10 hover:border-primary/20", 
            "transition-all duration-300 ease-in-out", 
            isHovered ? "bg-[#F8E6FF]/30" : ""
          )} 
          onClick={customClickHandler}
        >
          <span>Iniciar Simulado</span>
          <ArrowRight className={cn("h-4 w-4 transition-transform duration-300", isHovered ? "translate-x-1" : "")} />
        </Button>
      );
    }
    
    return (
      <Link to={path} className="w-full block">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-between group p-4 h-auto", 
            "border border-primary/10 hover:border-primary/20", 
            "transition-all duration-300 ease-in-out", 
            isHovered ? "bg-[#F8E6FF]/30" : ""
          )}
        >
          <span>Iniciar Simulado</span>
          <ArrowRight className={cn("h-4 w-4 transition-transform duration-300", isHovered ? "translate-x-1" : "")} />
        </Button>
      </Link>
    );
  };

  const simuladoForEdit = simuladoId ? {
    id: simuladoId,
    title,
    questions,
    duration,
    difficulty,
    type,
    path,
    description,
    category,
    phase,
    area
  } : null;

  return (
    <div 
      className={cn(
        "rounded-xl border overflow-hidden bg-white flex flex-col relative group",
        "transition-all duration-300 ease-in-out shadow-sm h-full",
        isHovered && "shadow-md border-[#F8E6FF]/60",
        className
      )} 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10 flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-sm"
            onClick={handleEditClick}
          >
            <Pencil className="h-4 w-4 text-[#4F1964]" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-sm text-red-500"
            onClick={handleDeleteClick}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="p-6 flex-grow flex flex-col">
        <div className="flex gap-2 mb-4">
          <div className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", typeColor, "flex items-center gap-1")}>
            {type === 'ia' && <Sparkles className="h-3 w-3" />}
            {typeLabel}
          </div>
          {locked && (
            <div className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F8E6FF] text-[#4F1964] flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Bloqueado
            </div>
          )}
        </div>
        
        <h3 className="text-xl font-bold mb-3 text-[#4F1964] leading-tight">{title}</h3>
        
        {description && <p className="text-foreground/80 text-sm mb-4 leading-relaxed">{description}</p>}
        
        <div className="flex items-center text-foreground/60 text-sm gap-4 mb-6">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            <span>{questions} questões</span>
          </div>
          {additionalDetails && additionalDetails.map((detail, i) => (
            <div key={i} className="flex items-center gap-1.5">
              {detail.icon}
              <span>{detail.text}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-auto">
          {renderActionButton()}
        </div>
      </div>

      {/* Edit and Delete Dialogs */}
      {simuladoForEdit && (
        <>
          <SimuladoFormDialog 
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            simuladoToEdit={simuladoForEdit}
            onSuccess={onUpdate}
          />
          
          <DeleteConfirmationDialog 
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            simuladoToDelete={simuladoForEdit}
            onSuccess={onUpdate}
          />
        </>
      )}
    </div>
  );
};

export default SimulatorCard;
