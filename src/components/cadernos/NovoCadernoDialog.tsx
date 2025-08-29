
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { adicionarCaderno } from '@/services/cadernoService';
import { MateriaJuridica } from '@/types/caderno';

interface NovoCadernoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCadernoAdicionado: () => void;
}

const NovoCadernoDialog = ({ 
  open, 
  onOpenChange,
  onCadernoAdicionado
}: NovoCadernoDialogProps) => {
  const { toast } = useToast();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titulo) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe um título para o caderno.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Usamos o título como matéria também, já que eles são redundantes
      const novoCaderno = adicionarCaderno(titulo, titulo as MateriaJuridica, descricao);
      
      // Dispatch custom event for synchronization with both pages
      const event = new CustomEvent('cadernoUpdated', { 
        detail: { 
          action: 'add',
          caderno: novoCaderno
        }
      });
      window.dispatchEvent(event);
      
      // Limpar o formulário
      setTitulo('');
      setDescricao('');
      
      // Fechar o diálogo
      onOpenChange(false);
      
      // Notificar o componente pai
      onCadernoAdicionado();

      toast({
        title: "Caderno criado",
        description: "Seu novo caderno foi criado com sucesso."
      });
    } catch (error) {
      console.error("Erro ao criar caderno:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o caderno. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md animate-fade-in shadow-elegant border border-[#F8E6FF]">
        <DialogHeader>
          <DialogTitle className="text-[#4F1964] text-2xl">Novo Caderno</DialogTitle>
          <DialogDescription>
            Crie um novo caderno para organizar suas anotações jurídicas.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex.: Direito Civil VI"
              required
              className="transition-all focus:border-[#4F1964] focus:ring-[#4F1964] focus:ring-2 border-[#F8E6FF]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição (opcional)</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Breve descrição sobre este caderno..."
              className="resize-none transition-all focus:border-[#4F1964] focus:ring-[#4F1964] focus:ring-1 border-[#F8E6FF]"
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => onOpenChange(false)}
              className="transition-all hover:bg-gray-100 border-[#F8E6FF]"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#4F1964] hover:bg-[#6B3182] hover:scale-105 transition-all shadow-md"
            >
              {isSubmitting ? 'Criando...' : 'Criar Caderno'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NovoCadernoDialog;
