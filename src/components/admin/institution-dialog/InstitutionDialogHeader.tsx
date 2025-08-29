
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface InstitutionDialogHeaderProps {
  mode: 'create' | 'edit';
}

const InstitutionDialogHeader = ({ mode }: InstitutionDialogHeaderProps) => {
  return (
    <DialogHeader>
      <DialogTitle>
        {mode === 'create' ? 'Criar Nova Instituição' : 'Editar Instituição'}
      </DialogTitle>
    </DialogHeader>
  );
};

export default InstitutionDialogHeader;
