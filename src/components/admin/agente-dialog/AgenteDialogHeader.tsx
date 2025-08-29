
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AgenteDialogHeaderProps {
  isEditing: boolean;
}

const AgenteDialogHeader: React.FC<AgenteDialogHeaderProps> = ({ isEditing }) => {
  return (
    <DialogHeader>
      <DialogTitle>
        {isEditing ? 'Editar Agente IA' : 'Incluir Novo Agente IA'}
      </DialogTitle>
    </DialogHeader>
  );
};

export default AgenteDialogHeader;
