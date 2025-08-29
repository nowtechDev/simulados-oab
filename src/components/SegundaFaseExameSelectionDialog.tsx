
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';

interface Area {
  id: number;
  nome: string;
}

interface SegundaFaseExameSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExameSelect: (exame: number) => void;
  area: Area | null;
}

const SegundaFaseExameSelectionDialog = ({ open, onOpenChange, onExameSelect, area }: SegundaFaseExameSelectionDialogProps) => {
  const [exames, setExames] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>("");

  useEffect(() => {
    if (open && area) {
      fetchExames();
    }
  }, [open, area]);

  const fetchExames = async () => {
    if (!area) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('segunda_fase_questoes')
        .select('numero_exame')
        .eq('area_id', area.id.toString())
        .order('numero_exame', { ascending: true });

      if (error) throw error;

      // Extrair números únicos dos exames
      const uniqueExames = [...new Set(data?.map(item => item.numero_exame) || [])];
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
          <DialogTitle>Selecione o Exame</DialogTitle>
          <DialogDescription>
            Selecione o número do exame para filtrar as questões.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            Carregando exames...
          </div>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedValue
                  ? `Exame ${selectedValue}`
                  : "Selecione o número do exame..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Buscar exame..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>Nenhum exame encontrado.</CommandEmpty>
                  <CommandGroup>
                    {exames.map((exame) => (
                      <CommandItem
                        key={exame}
                        value={exame.toString()}
                        onSelect={(currentValue) => {
                          setSelectedValue(currentValue);
                          const selectedExame = parseInt(currentValue);
                          handleExameSelect(selectedExame);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedValue === exame.toString() ? "opacity-100" : "opacity-0"
                          )}
                        />
                        Exame {exame}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SegundaFaseExameSelectionDialog;
