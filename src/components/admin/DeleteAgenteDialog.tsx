
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface AgenteIA {
  id: string;
  nome: string;
  prompt: string;
  ia_provider: string;
  token_id: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  links?: string[] | null;
  arquivos?: any;
}

interface DeleteAgenteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agente: AgenteIA | null;
  onSuccess: () => void;
}

const DeleteAgenteDialog: React.FC<DeleteAgenteDialogProps> = ({
  open,
  onOpenChange,
  agente,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!agente) return;

    try {
      setIsLoading(true);

      const { error } = await (supabase as any)
        .from('agentes_ia')
        .delete()
        .eq('id', agente.id);

      if (error) throw error;

      toast({
        title: 'Agente excluído',
        description: 'O agente IA foi excluído com sucesso.',
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao excluir agente:', error);
      toast({
        title: 'Erro ao excluir agente',
        description: 'Ocorreu um erro ao excluir o agente IA.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <DialogTitle>Excluir Agente IA</DialogTitle>
          </div>
          <DialogDescription>
            Tem certeza de que deseja excluir o agente "{agente?.nome}"?
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAgenteDialog;
