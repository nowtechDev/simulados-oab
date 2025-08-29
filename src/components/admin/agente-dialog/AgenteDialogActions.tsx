
import React from 'react';
import { Button } from '@/components/ui/button';

interface AgenteDialogActionsProps {
  onCancel: () => void;
  isLoading: boolean;
  isUploading: boolean;
  isEditing: boolean;
}

const AgenteDialogActions: React.FC<AgenteDialogActionsProps> = ({
  onCancel,
  isLoading,
  isUploading,
  isEditing,
}) => {
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancelar
      </Button>
      <Button type="submit" disabled={isLoading || isUploading}>
        {isLoading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
      </Button>
    </div>
  );
};

export default AgenteDialogActions;
