
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";

type SimuladoFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  simuladoToEdit?: any;
  onSuccess: () => void;
  category?: string;
};

const AREAS_JURIDICAS = [
  { value: "direito_administrativo", label: "Direito Administrativo" },
  { value: "direito_civil", label: "Direito Civil" },
  { value: "direito_constitucional", label: "Direito Constitucional" },
  { value: "direito_do_trabalho", label: "Direito do Trabalho" },
  { value: "direito_empresarial", label: "Direito Empresarial" },
  { value: "direito_penal", label: "Direito Penal" },
  { value: "direito_tributario", label: "Direito Tributário" },
];

const SimuladoFormDialog = ({ open, onOpenChange, simuladoToEdit, onSuccess, category = 'fgv' }: SimuladoFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<number>(80);
  const [duration, setDuration] = useState('');
  const [difficulty, setDifficulty] = useState('médio');
  const [type, setType] = useState('oab');
  const [path, setPath] = useState('');
  const [phase, setPhase] = useState('primeira');
  const [area, setArea] = useState('');
  
  const { toast } = useToast();
  
  // Reset form or populate with simulado data when dialog opens
  useEffect(() => {
    if (open) {
      if (simuladoToEdit) {
        setTitle(simuladoToEdit.title || '');
        setDescription(simuladoToEdit.description || '');
        setQuestions(simuladoToEdit.questions || 80);
        setDuration(simuladoToEdit.duration || '');
        setDifficulty(simuladoToEdit.difficulty || 'médio');
        setType(simuladoToEdit.type || 'oab');
        setPath(simuladoToEdit.path || '');
        setPhase(simuladoToEdit.phase || 'primeira');
        setArea(simuladoToEdit.area || '');
      } else {
        // Reset form for new simulado
        setTitle('');
        setDescription('');
        setQuestions(80);
        setDuration('');
        setDifficulty('médio');
        setType(category === 'ia' ? 'ia' : 'oab');
        setPath('');
        setPhase('primeira');
        setArea('');
      }
    }
  }, [open, simuladoToEdit, category]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha pelo menos o título do simulado",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const simuladoData = {
        title,
        description,
        questions,
        duration,
        difficulty,
        type,
        path,
        phase,
        area: phase === 'segunda' ? area : null,
        category: simuladoToEdit?.category || category,
      };

      let response;
      
      if (simuladoToEdit) {
        // Update existing simulado
        response = await supabase
          .from('simulados')
          .update(simuladoData)
          .eq('id', simuladoToEdit.id)
          .select();
      } else {
        // Insert new simulado
        response = await supabase
          .from('simulados')
          .insert(simuladoData)
          .select();
      }

      if (response.error) throw response.error;
      
      toast({
        title: simuladoToEdit ? "Simulado atualizado" : "Simulado criado",
        description: simuladoToEdit 
          ? "O simulado foi atualizado com sucesso" 
          : "O simulado foi criado com sucesso",
      });
      
      onSuccess();
      onOpenChange(false);
      
    } catch (error) {
      console.error("Erro ao salvar simulado:", error);
      toast({
        title: "Erro",
        description: `Não foi possível ${simuladoToEdit ? 'atualizar' : 'criar'} o simulado. Tente novamente.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{simuladoToEdit ? 'Editar Simulado' : 'Novo Simulado'}</DialogTitle>
          <DialogDescription>
            {simuladoToEdit 
              ? 'Atualize as informações do simulado abaixo.' 
              : 'Preencha as informações para criar um novo simulado.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid gap-2">
            <Label htmlFor="title">Título*</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Simulado OAB XXXVIII"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição do simulado"
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="questions">Questões</Label>
              <Input
                id="questions"
                type="number"
                value={questions}
                onChange={(e) => setQuestions(Number(e.target.value))}
                min={1}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="duration">Duração</Label>
              <Input
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ex: 120 min"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="difficulty">Dificuldade</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fácil">Fácil</SelectItem>
                  <SelectItem value="médio">Médio</SelectItem>
                  <SelectItem value="difícil">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oab">OAB</SelectItem>
                  <SelectItem value="fgv">FGV</SelectItem>
                  <SelectItem value="ia">IA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phase">Fase</Label>
              <Select value={phase} onValueChange={setPhase}>
                <SelectTrigger id="phase">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primeira">Primeira Fase</SelectItem>
                  <SelectItem value="segunda">Segunda Fase</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {phase === 'segunda' && (
              <div className="grid gap-2">
                <Label htmlFor="area">Área</Label>
                <Select value={area} onValueChange={setArea}>
                  <SelectTrigger id="area">
                    <SelectValue placeholder="Selecione a área" />
                  </SelectTrigger>
                  <SelectContent>
                    {AREAS_JURIDICAS.map((areaOption) => (
                      <SelectItem key={areaOption.value} value={areaOption.value}>
                        {areaOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="path">Caminho (URL)</Label>
            <Input
              id="path"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="Ex: /simulado/xxxviii"
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? 'Salvando...' 
                : simuladoToEdit ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SimuladoFormDialog;
