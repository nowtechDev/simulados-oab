
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Institution } from '@/hooks/useAdminData';
import { useAuthStatus } from "@/components/navbar/useAuthStatus";
import InstitutionFormFields from "./InstitutionFormFields";
import InstitutionDialogActions from "./InstitutionDialogActions";

interface InstitutionDialogFormProps {
  mode: 'create' | 'edit';
  selectedInstitution: Institution | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const InstitutionDialogForm = ({
  mode,
  selectedInstitution,
  onSuccess,
  onCancel
}: InstitutionDialogFormProps) => {
  const [nome, setNome] = useState("");
  const [usuarios, setUsuarios] = useState<number>(0);
  const [plano, setPlano] = useState<string>("Básico");
  const [adminEmail, setAdminEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { isAdmin, isLoggedIn } = useAuthStatus();

  const { toast } = useToast();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      console.log("InstitutionDialog: Checking auth, isAdmin:", isAdmin, "isLoggedIn:", isLoggedIn);
      
      if (!isLoggedIn) {
        console.log("InstitutionDialog: Not logged in");
        setAuthError("Você precisa estar autenticado para gerenciar instituições.");
        return;
      }
      
      if (!isAdmin) {
        console.log("InstitutionDialog: User is not admin (type_user !== 1)");
        setAuthError("Você precisa ter permissões de administrador para gerenciar instituições.");
        return;
      }
      
      console.log("InstitutionDialog: User is authenticated and admin");
      setAuthError(null);
    };
    
    checkAuth();
  }, [isAdmin, isLoggedIn]);

  // Reset form when dialog opens/closes or when selectedInstitution changes
  useEffect(() => {
    if (mode === 'edit' && selectedInstitution) {
      setNome(selectedInstitution.nome);
      setUsuarios(selectedInstitution.usuarios || 0);
      setPlano(selectedInstitution.plano || "Básico");
      setAdminEmail(selectedInstitution.admin_email || "");
    } else if (mode === 'create') {
      // Reset form for create mode
      setNome("");
      setUsuarios(0);
      setPlano("Básico");
      setAdminEmail("");
    }
  }, [mode, selectedInstitution]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!nome.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "O nome da instituição é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    if (adminEmail && !validateEmail(adminEmail)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um e-mail válido.",
        variant: "destructive"
      });
      return;
    }

    // Verify authentication and admin status before proceeding
    if (!isLoggedIn || !isAdmin) {
      toast({
        title: "Erro de permissão",
        description: "Você precisa estar logado como administrador para gerenciar instituições.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        // Create new institution
        console.log("Creating institution with data:", { nome, usuarios, plano, admin_email: adminEmail });
        const { data, error } = await supabase
          .from('institutions')
          .insert([
            { 
              nome, 
              usuarios: Number(usuarios) || 0,
              plano,
              admin_email: adminEmail || null
            }
          ])
          .select();
          
        if (error) {
          console.error("Error creating institution:", error);
          throw error;
        }
        
        toast({
          title: "Instituição criada",
          description: `A instituição ${nome} foi criada com sucesso.`
        });
      } else if (mode === 'edit' && selectedInstitution) {
        // Update existing institution
        console.log("Updating institution with data:", { id: selectedInstitution.id, nome, usuarios, plano, admin_email: adminEmail });
        const { error } = await supabase
          .from('institutions')
          .update({ 
            nome, 
            usuarios: Number(usuarios) || 0,
            plano,
            admin_email: adminEmail || null
          })
          .eq('id', selectedInstitution.id);
          
        if (error) {
          console.error("Error updating institution:", error);
          throw error;
        }
        
        toast({
          title: "Instituição atualizada",
          description: `A instituição ${nome} foi atualizada com sucesso.`
        });
      }
      
      // Close dialog and refresh data
      onCancel();
      onSuccess();
    } catch (error: any) {
      console.error("Error saving institution:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar a instituição.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InstitutionFormFields
        nome={nome}
        setNome={setNome}
        plano={plano}
        setPlano={setPlano}
        usuarios={usuarios}
        setUsuarios={setUsuarios}
        adminEmail={adminEmail}
        setAdminEmail={setAdminEmail}
        authError={authError}
      />
      <InstitutionDialogActions
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        mode={mode}
        authError={authError}
      />
    </form>
  );
};

export default InstitutionDialogForm;
