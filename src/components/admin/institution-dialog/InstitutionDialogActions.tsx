
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface InstitutionDialogActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  mode: 'create' | 'edit';
  authError: string | null;
}

const InstitutionDialogActions = ({ 
  isSubmitting, 
  onCancel, 
  mode,
  authError
}: InstitutionDialogActionsProps) => {
  return (
    <DialogFooter>
      <Button variant="outline" type="button" onClick={onCancel}>
        Cancelar
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting || !!authError} 
        className="bg-[#4F1964] hover:bg-[#3D1052]"
      >
        {isSubmitting ? 'Salvando...' : mode === 'create' ? 'Criar' : 'Salvar'}
      </Button>
    </DialogFooter>
  );
};

export default InstitutionDialogActions;
