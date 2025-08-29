
import { Dialog, DialogContent } from "@/components/ui/dialog";
import UserDialogHeader from "./UserDialogHeader";
import UserDialogForm from "./UserDialogForm";
import { User } from '@/hooks/useAdminData';

interface UserDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  mode: 'create' | 'edit';
  selectedUser: User | null;
  onSuccess: () => Promise<void>;
}

const UserDialog = ({ 
  isOpen, 
  setIsOpen, 
  mode, 
  selectedUser, 
  onSuccess 
}: UserDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <UserDialogHeader mode={mode} />
        <UserDialogForm 
          mode={mode} 
          selectedUser={selectedUser} 
          onSuccess={onSuccess} 
          onCancel={() => setIsOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
