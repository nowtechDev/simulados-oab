
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface UserDialogHeaderProps {
  mode: 'create' | 'edit';
}

const UserDialogHeader = ({ mode }: UserDialogHeaderProps) => {
  return (
    <DialogHeader>
      <DialogTitle>
        {mode === 'create' ? 'Adicionar Novo Usuário' : 'Editar Usuário'}
      </DialogTitle>
      <DialogDescription>
        {mode === 'create' 
          ? 'Preencha os dados abaixo para criar um novo usuário na plataforma.'
          : 'Edite as informações do usuário selecionado.'
        }
      </DialogDescription>
    </DialogHeader>
  );
};

export default UserDialogHeader;
