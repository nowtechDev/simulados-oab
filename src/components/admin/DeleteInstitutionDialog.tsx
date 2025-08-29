
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Institution } from "@/hooks/useAdminData";
import { useAuthStatus } from "@/components/navbar/useAuthStatus";

interface DeleteInstitutionDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedInstitution: Institution | null;
  onSuccess: () => void;
}

const DeleteInstitutionDialog = ({
  isOpen,
  setIsOpen,
  selectedInstitution,
  onSuccess,
}: DeleteInstitutionDialogProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { isAdmin, isLoggedIn } = useAuthStatus();

  // Check authentication status on mount and when dialog opens
  useEffect(() => {
    const checkAuth = async () => {
      console.log("DeleteInstitutionDialog: Checking auth, isAdmin:", isAdmin, "isLoggedIn:", isLoggedIn);
      
      if (!isLoggedIn) {
        console.log("DeleteInstitutionDialog: Not logged in");
        setAuthError("Você precisa estar autenticado para excluir instituições.");
        return;
      }
      
      if (!isAdmin) {
        console.log("DeleteInstitutionDialog: User is not admin (type_user !== 1)");
        setAuthError("Você precisa ter permissões de administrador para excluir instituições.");
        return;
      }
      
      console.log("DeleteInstitutionDialog: User is authenticated and admin");
      setAuthError(null);
    };
    
    if (isOpen) {
      checkAuth();
    }
  }, [isOpen, isAdmin, isLoggedIn]);

  const handleDelete = async () => {
    if (!selectedInstitution) return;
    
    // Verify authentication and admin status before proceeding
    if (!isLoggedIn || !isAdmin) {
      toast({
        title: "Erro de permissão",
        description: "Você precisa estar logado como administrador para excluir instituições.",
        variant: "destructive"
      });
      return;
    }
    
    setIsDeleting(true);
    
    try {
      console.log(`Deleting institution with ID: ${selectedInstitution.id}`);
      const { error } = await supabase
        .from('institutions')
        .delete()
        .eq('id', selectedInstitution.id);
        
      if (error) {
        console.error("Error deleting institution:", error);
        throw error;
      }
      
      toast({
        title: "Instituição excluída",
        description: `A instituição ${selectedInstitution.nome} foi excluída com sucesso.`
      });
      
      setIsOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error deleting institution:", error);
      toast({
        title: "Erro ao excluir",
        description: error.message || "Não foi possível excluir a instituição.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza de que deseja excluir esta instituição?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a excluir a instituição{" "}
            <span className="font-semibold">{selectedInstitution?.nome}</span>.
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
          {authError && (
            <div className="bg-destructive/15 p-3 rounded-md mt-2 text-destructive text-sm">
              {authError}
            </div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting || !!authError}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? "Excluindo..." : "Sim, excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteInstitutionDialog;
