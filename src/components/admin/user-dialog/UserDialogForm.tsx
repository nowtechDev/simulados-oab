
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import UserFormFields from './UserFormFields';
import UserDialogActions from './UserDialogActions';
import { User } from '@/hooks/useAdminData';

interface Institution {
  id: string;
  nome: string;
}

interface UserDialogFormProps {
  mode: 'create' | 'edit';
  selectedUser: User | null;
  onSuccess: () => Promise<void>;
  onCancel: () => void;
}

const UserDialogForm = ({ 
  mode, 
  selectedUser, 
  onSuccess, 
  onCancel 
}: UserDialogFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userInstitutionId, setUserInstitutionId] = useState("");
  const [userAdmin, setUserAdmin] = useState(false);
  const [userDisabled, setUserDisabled] = useState(false);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoadingInstitutions, setIsLoadingInstitutions] = useState(false);
  
  const { toast } = useToast();
  
  // Fetch institutions when form is rendered
  useEffect(() => {
    const fetchInstitutions = async () => {
      setIsLoadingInstitutions(true);
      try {
        const { data, error } = await supabase
          .from('institutions')
          .select('id, nome')
          .order('nome');
          
        if (error) throw error;
        
        if (data) {
          setInstitutions(data);
        }
      } catch (error) {
        console.error('Error fetching institutions:', error);
        toast({
          title: "Erro ao carregar instituições",
          description: "Não foi possível carregar a lista de instituições.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingInstitutions(false);
      }
    };
    
    fetchInstitutions();
  }, [toast]);
  
  useEffect(() => {
    if (mode === 'edit' && selectedUser) {
      setUserName(selectedUser.name || "");
      setUserEmail(selectedUser.email || "");
      setUserInstitutionId(selectedUser.institution_id || "");
      setUserAdmin(selectedUser.type_user === 1);
      setUserDisabled(selectedUser.disabled || false);
    } else {
      resetFormFields();
    }
  }, [mode, selectedUser]);
  
  const resetFormFields = () => {
    setUserName("");
    setUserEmail("");
    setUserPassword("");
    setUserInstitutionId("");
    setUserAdmin(false);
    setUserDisabled(false);
  };
  
  const handleCreateUser = async () => {
    if (!userEmail || !userName || !userPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome, email e senha são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      console.log("Creating user with signup method...");
      
      // Use the regular signup method instead of admin.createUser
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userEmail,
        password: userPassword,
        options: {
          data: {
            name: userName,
            type_user: userAdmin ? 1 : 0,
            institution_id: userInstitutionId === "none" ? null : userInstitutionId || null,
            disabled: userDisabled
          }
        }
      });

      if (authError) {
        console.error("Error creating user:", authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Failed to create user");
      }
      
      console.log("User created with ID:", authData.user.id);

      toast({
        title: "Usuário criado",
        description: "O usuário foi criado com sucesso. Um email de confirmação foi enviado."
      });

      onCancel();
      resetFormFields();
      await onSuccess();
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        title: "Erro ao criar usuário",
        description: error.message || "Não foi possível criar o usuário.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleUpdateUser = async () => {
    if (!selectedUser || !userEmail || !userName) {
      toast({
        title: "Dados inválidos",
        description: "Nome e email são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Determine the institution_id value
      const institutionId = userInstitutionId === "none" ? null : userInstitutionId || null;
      
      const { error } = await supabase
        .from('users')
        .update({ 
          name: userName, 
          email: userEmail, 
          type_user: userAdmin ? 1 : 0,
          institution_id: institutionId,
          disabled: userDisabled
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      toast({
        title: "Usuário atualizado",
        description: "Os dados do usuário foram atualizados com sucesso."
      });

      onCancel();
      await onSuccess();
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Erro ao atualizar usuário",
        description: "Não foi possível atualizar os dados do usuário.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = () => {
    if (mode === 'create') {
      handleCreateUser();
    } else {
      handleUpdateUser();
    }
  };

  return (
    <>
      <UserFormFields 
        mode={mode}
        userName={userName}
        setUserName={setUserName}
        userEmail={userEmail}
        setUserEmail={setUserEmail}
        userPassword={userPassword}
        setUserPassword={setUserPassword}
        userInstitutionId={userInstitutionId}
        setUserInstitutionId={setUserInstitutionId}
        userAdmin={userAdmin}
        setUserAdmin={setUserAdmin}
        userDisabled={userDisabled}
        setUserDisabled={setUserDisabled}
        institutions={institutions}
        isLoadingInstitutions={isLoadingInstitutions}
      />
      <UserDialogActions 
        mode={mode}
        isProcessing={isProcessing}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default UserDialogForm;
