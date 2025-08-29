
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText } from 'lucide-react';

interface Prova {
  numero: number;
  totalQuestoes: number;
}

interface ProvasSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  simuladoId: number;
  simuladoTitle: string;
}

const ProvasSelectionDialog = ({ open, onOpenChange, simuladoId, simuladoTitle }: ProvasSelectionDialogProps) => {
  const [provas, setProvas] = useState<Prova[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (open && simuladoId) {
      fetchProvas();
    }
  }, [open, simuladoId]);

  const fetchProvas = async () => {
    setIsLoading(true);
    try {
      const pageSize = 1000;
      let allData: { prova: number | string }[] = [];
      let from = 0;
      let to = pageSize - 1;
      let finished = false;
  
      console.log('Buscando provas paginadas para simulado ID:', simuladoId);
  
      // Busca paginada
      while (!finished) {
        const { data, error } = await supabase
          .from('provas_oab')
          .select('prova')
          .eq('simulado_id', simuladoId)
          .not('prova', 'is', null)
          .range(from, to);
  
        if (error) throw error;
        if (data && data.length > 0) {
          allData = allData.concat(data);
          console.log(`Recebidos ${data.length} registros (${from} a ${to})`);
          if (data.length < pageSize) {
            finished = true; // última página
          } else {
            from += pageSize;
            to += pageSize;
          }
        } else {
          finished = true;
        }
      }
  
      console.log('Total de registros obtidos:', allData.length);
  
      // Agrupando e contando no front
      const provasMap = new Map<number, number>();
      allData.forEach(item => {
        const provaNum = Number(item.prova);
        if (!isNaN(provaNum)) {
          provasMap.set(provaNum, (provasMap.get(provaNum) || 0) + 1);
        }
      });
  
      const provasArray = Array.from(provasMap.entries()).map(([numero, totalQuestoes]) => ({
        numero,
        totalQuestoes
      })).sort((a, b) => a.numero - b.numero);
  
      setProvas(provasArray);
  
      console.log('Provas processadas:', provasArray);
      console.log('Total de provas únicas encontradas:', provasArray.length);
  
      if (provasArray.length === 0) {
        toast({
          title: 'Nenhuma prova encontrada',
          description: `Não foram encontradas provas para o simulado ID ${simuladoId}.`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao buscar provas:', error);
      toast({
        title: 'Erro ao carregar provas',
        description: 'Não foi possível carregar as provas disponíveis.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProva = (numeroProva: number) => {
    navigate(`/prova/${simuladoId}/${numeroProva}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold text-[#4F1964]">
            Selecionar Prova - {simuladoTitle}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8 flex-1">
            <Loader2 className="h-6 w-6 animate-spin text-[#4F1964]" />
            <span className="ml-2">Carregando provas...</span>
          </div>
        ) : provas.length > 0 ? (
          <div className="flex flex-col flex-1 min-h-0">
            <p className="text-sm text-gray-600 mb-4 flex-shrink-0">
              Escolha uma das {provas.length} provas disponíveis:
            </p>
            <div className="space-y-3 pr-4 overflow-y-auto" style={{ height: '350px' }}>
              {provas.map((prova) => (
                <Button
                  key={prova.numero}
                  variant="outline"
                  className="w-full justify-between hover:bg-[#F8E6FF] hover:border-[#4F1964] transition-colors"
                  onClick={() => handleSelectProva(prova.numero)}
                >
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-[#4F1964]" />
                    <span className="font-medium">Prova {prova.numero}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {prova.totalQuestoes} questões
                  </span>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 flex-1 flex flex-col justify-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma prova encontrada para este simulado.</p>
            <p className="text-sm text-gray-500 mt-2">Simulado ID: {simuladoId}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProvasSelectionDialog;
