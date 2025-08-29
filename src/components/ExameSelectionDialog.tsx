import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SegundaFaseAreaDialog from './SegundaFaseAreaDialog';

interface ExameSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ExameSelectionDialog: React.FC<ExameSelectionDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [selectedExame, setSelectedExame] = useState<string | null>(null);
  const [isAreaDialogOpen, setIsAreaDialogOpen] = useState(false);
  const [availableExams, setAvailableExams] = useState<Array<{id: string, label: string}>>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch available exams from Supabase
  useEffect(() => {
    const fetchAvailableExams = async () => {
      if (!open) return;
      
      setLoading(true);
      try {
        // Get unique exam numbers from provas_oab table
        const { data, error } = await supabase
          .from('provas_oab')
          .select('prova')
          .not('prova', 'is', null)
          .order('prova', { ascending: true });

        if (error) {
          console.error('Erro ao buscar exames:', error);
          // Fallback to default exams
          setAvailableExams(Array.from({ length: 43 }, (_, i) => ({
            id: (i + 1).toString(),
            label: `${i + 1}º Exame de Ordem`
          })));
        } else {
          // Create unique list of exams
          const uniqueExams = [...new Set(data.map(item => item.prova))];
          const examOptions = uniqueExams
            .filter(exam => exam !== null)
            .sort((a, b) => a - b)
            .map(exam => ({
              id: exam.toString(),
              label: `${exam}º Exame de Ordem`
            }));
          
          console.log('Exames encontrados no Supabase:', examOptions);
          setAvailableExams(examOptions);
        }
      } catch (err) {
        console.error('Erro ao carregar exames:', err);
        // Fallback to default exams
        setAvailableExams(Array.from({ length: 43 }, (_, i) => ({
          id: (i + 1).toString(),
          label: `${i + 1}º Exame de Ordem`
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableExams();
  }, [open]);

  const handleNext = () => {
    console.log("Exame selecionado para Primeira Fase:", selectedExame);
    
    // Store the selected exame in session storage
    sessionStorage.setItem('selectedPrimeiraFaseExame', selectedExame || '');
    
    // Close current dialog and open the area selection dialog
    onOpenChange(false);
    setIsAreaDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedExame(null);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#4F1964]">
              Selecione o Exame da OAB - Primeira Fase
            </DialogTitle>
            <DialogDescription>
              Escolha qual exame da OAB deseja utilizar para a simulação da 1ª fase.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4F1964]"></div>
              </div>
            ) : (
              <RadioGroup value={selectedExame || ""} onValueChange={setSelectedExame} className="space-y-2 max-h-60 overflow-y-auto">
                {availableExams.map((exam) => (
                  <div key={exam.id} className="flex items-center space-x-2 border rounded-lg p-3 hover:border-[#4F1964]/60 transition-colors">
                    <RadioGroupItem value={exam.id} id={exam.id} />
                    <Label htmlFor={exam.id} className="font-medium cursor-pointer flex-grow">{exam.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <Button 
              onClick={handleNext}
              disabled={!selectedExame || loading}
              className="bg-[#4F1964] hover:bg-[#6B3182] text-white"
            >
              Próximo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <SegundaFaseAreaDialog 
        open={isAreaDialogOpen} 
        onOpenChange={setIsAreaDialogOpen} 
        fromFgvExam={false}
        areas={[]}
      />
    </>
  );
};

export default ExameSelectionDialog;
