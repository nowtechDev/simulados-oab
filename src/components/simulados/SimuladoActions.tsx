
import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import SimuladoFormDialog from './SimuladoFormDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

type SimuladoActionsProps = {
  simulado: any;
  onUpdate: () => void;
  isAdmin: boolean;
};

const SimuladoActions = ({ simulado, onUpdate, isAdmin }: SimuladoActionsProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Don't render actions if user is not admin or simulado is undefined
  if (!isAdmin || !simulado) return null;
  
  // Handle clicks to prevent event propagation to parent card
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleEditClick}
        title="Editar simulado"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleDeleteClick}
        title="Excluir simulado"
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      
      <SimuladoFormDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        simuladoToEdit={simulado}
        onSuccess={onUpdate}
      />
      
      <DeleteConfirmationDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        simuladoToDelete={simulado}
        onSuccess={onUpdate}
      />
    </div>
  );
};

export default SimuladoActions;
