import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';

interface Area {
  id: string | number;
  name?: string;
  nome?: string;
  slug?: string;
}

interface SegundaFaseFGVExameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExameSelect: (exame: number) => void;
  area: Area | null;
}

const SegundaFaseFGVExameDialog = ({ open, onOpenChange, onExameSelect, area }: SegundaFaseFGVExameDialogProps) => {
  const [exames, setExames] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && area) {
      console.log("Buscando exames para a área:", area);
      fetchExames();
    } else if (open && !area) {
      console.error("Área não fornecida ao abrir SegundaFaseFGVExameDialog");
    }
  }, [open, area]);

  const fetchExames = async () => {
    if (!area) {
      console.error("Área não fornecida para buscar exames");
      return;
    }
    
    try {
      setIsLoading(true);
      console.log("Buscando exames para área_id:", area.id);
      
      // Verificar o tipo de id (string ou número)
      const areaId = area.id.toString();
      
      console.log(`Buscando exames na tabela segunda_fase_questoes com area_id=${areaId}`);
      
      const { data, error } = await supabase
        .from('segunda_fase_questoes')
        .select('numero_exame')
        .eq('area_id', areaId)
        .order('numero_exame', { ascending: false });

      if (error) {
        console.error('Erro ao buscar exames:', error);
        
        // Tentar alternativas de busca se falhar com o ID normal
        console.log("Tentando busca alternativa com UUID formatado");
        const { data: dataAlt, error: errorAlt } = await supabase
          .from('segunda_fase_questoes')
          .select('numero_exame')
          .or(`area_id.eq.${areaId},area_id.eq."${areaId}"`)
          .order('numero_exame', { ascending: false });
          
        if (errorAlt) {
          console.error('Erro na busca alternativa:', errorAlt);
          throw error; // Manter o erro original
        }
        
        if (dataAlt && dataAlt.length > 0) {
          console.log("Busca alternativa bem-sucedida:", dataAlt);
          // Extrair números únicos dos exames
          const uniqueExames = [...new Set(dataAlt.map(item => item.numero_exame) || [])];
          console.log("Exames únicos encontrados:", uniqueExames);
          setExames(uniqueExames);
          return;
        }
        
        throw error;
      }

      console.log("Dados de exames recebidos:", data);
      
      // Extrair números únicos dos exames
      const uniqueExames = [...new Set(data?.map(item => item.numero_exame) || [])];
      console.log("Exames únicos encontrados:", uniqueExames);
      
      setExames(uniqueExames);
    } catch (error) {
      console.error('Erro ao buscar exames:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExameSelect = (exame: number) => {
    onExameSelect(exame);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Selecione o número do Exame FGV</DialogTitle>
          <DialogDescription>
            Selecione o número do exame que você deseja visualizar as questões.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isLoading ? (
            <p>Carregando exames...</p>
          ) : (
            exames.map((exame) => (
              <div key={exame} className="flex items-center space-x-2">
                <Checkbox
                  id={`exame-${exame}`}
                  onCheckedChange={() => handleExameSelect(exame)}
                />
                <label
                  htmlFor={`exame-${exame}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Exame {exame}
                </label>
              </div>
            ))
          )}
        </div>
        <Button onClick={() => onOpenChange(false)}>Fechar</Button>
      </DialogContent>
    </Dialog>
  );
};

export default SegundaFaseFGVExameDialog;
