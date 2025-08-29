
import { Dialog, DialogContent } from "@/components/ui/dialog";
import InstitutionDialogHeader from "./InstitutionDialogHeader";
import InstitutionDialogForm from "./InstitutionDialogForm";
import { Institution } from '@/hooks/useAdminData';

interface InstitutionDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  mode: 'create' | 'edit';
  selectedInstitution: Institution | null;
  onSuccess: () => void;
}

const InstitutionDialog = ({ 
  isOpen, 
  setIsOpen, 
  mode,
  selectedInstitution,
  onSuccess 
}: InstitutionDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <InstitutionDialogHeader mode={mode} />
        <InstitutionDialogForm 
          mode={mode} 
          selectedInstitution={selectedInstitution} 
          onSuccess={onSuccess}
          onCancel={() => setIsOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default InstitutionDialog;
