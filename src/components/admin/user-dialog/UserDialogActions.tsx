
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface UserDialogActionsProps {
  mode: 'create' | 'edit';
  isProcessing: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

const UserDialogActions = ({
  mode,
  isProcessing,
  onCancel,
  onSubmit
}: UserDialogActionsProps) => {
  return (
    <DialogFooter>
      <Button 
        variant="outline" 
        onClick={onCancel}
        disabled={isProcessing}
      >
        Cancelar
      </Button>
      <Button 
        onClick={onSubmit}
        disabled={isProcessing}
        className="bg-[#4F1964] hover:bg-[#3D1052]"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : mode === 'create' ? 'Criar Usuário' : 'Salvar Alterações'}
      </Button>
    </DialogFooter>
  );
};

export default UserDialogActions;
