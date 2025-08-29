
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import AgenteDialogHeader from './AgenteDialogHeader';
import AgenteFormFields from './AgenteFormFields';
import LinksSection from './LinksSection';
import FilesSection from './FilesSection';
import AgenteDialogActions from './AgenteDialogActions';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const agenteFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  prompt: z.string().min(1, "Prompt é obrigatório"),
  ia_provider: z.string().min(1, "Provider é obrigatório"),
  versao: z.string().optional(),
  token_agente: z.string().optional(),
  ativo: z.boolean().default(true),
  links: z.array(z.string()).default([]),
});

export type AgenteFormData = z.infer<typeof agenteFormSchema>;

interface AgenteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agente?: any;
  onSuccess: () => void;
}

export function AgenteDialog({ open, onOpenChange, agente, onSuccess }: AgenteDialogProps) {
  const [uploadedFiles, setUploadedFiles] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  const form = useForm<AgenteFormData>({
    resolver: zodResolver(agenteFormSchema),
    defaultValues: {
      nome: "",
      prompt: "",
      ia_provider: "",
      versao: "",
      token_agente: "",
      ativo: true,
      links: [],
    },
  });

  const watchedLinks = form.watch('links');

  // Reset and populate form when agente changes or dialog opens
  useEffect(() => {
    if (open) {
      if (agente) {
        console.log('Carregando dados do agente para edição:', agente);
        form.reset({
          nome: agente.nome || "",
          prompt: agente.prompt || "",
          ia_provider: agente.ia_provider || "",
          versao: agente.versao || "",
          token_agente: agente.token_agente || "",
          ativo: agente.ativo ?? true,
          links: Array.isArray(agente.links) ? agente.links : [],
        });
      } else {
        console.log('Resetando formulário para novo agente');
        form.reset({
          nome: "",
          prompt: "",
          ia_provider: "",
          versao: "",
          token_agente: "",
          ativo: true,
          links: [],
        });
      }
    }
  }, [open, agente, form]);

  async function onSubmit(values: AgenteFormData) {
    setIsLoading(true);
    try {
      const agenteData = {
        nome: values.nome,
        prompt: values.prompt,
        ia_provider: values.ia_provider,
        versao: values.versao || null,
        token_agente: values.token_agente || null,
        ativo: values.ativo,
        links: values.links,
      };

      if (agente) {
        // Editing existing agente
        console.log('Atualizando agente:', agente.id, agenteData);
        const { error } = await supabase
          .from('agentes_ia')
          .update(agenteData)
          .eq('id', agente.id);

        if (error) {
          console.error("Erro ao atualizar agente:", error);
          throw new Error(error.message);
        }
      } else {
        // Creating a new agente
        console.log('Criando novo agente:', agenteData);
        const { error } = await supabase
          .from('agentes_ia')
          .insert([agenteData]);

        if (error) {
          console.error("Erro ao criar agente:", error);
          throw new Error(error.message);
        }
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Erro ao submeter o formulário:", error);
      alert(`Erro ao submeter o formulário: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <AgenteDialogHeader isEditing={!!agente} />
            
            <AgenteFormFields 
              control={form.control} 
            />
            
            <LinksSection 
              form={form}
              watchedLinks={watchedLinks}
            />
            
            <FilesSection 
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
            />
            
            <AgenteDialogActions 
              onCancel={() => onOpenChange(false)}
              isLoading={isLoading}
              isUploading={isUploading}
              isEditing={!!agente}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AgenteDialog;
