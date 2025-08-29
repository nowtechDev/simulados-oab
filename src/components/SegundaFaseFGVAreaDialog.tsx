
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Áreas específicas para Segunda Fase FGV da OAB (fallback)
const segundaFaseFGVAreasFallback = [
  {
    id: 'direito-administrativo',
    label: 'Direito Administrativo'
  },
  {
    id: 'direito-civil',
    label: 'Direito Civil'
  },
  {
    id: 'direito-constitucional',
    label: 'Direito Constitucional'
  },
  {
    id: 'direito-trabalho',
    label: 'Direito do Trabalho'
  },
  {
    id: 'direito-empresarial',
    label: 'Direito Empresarial'
  },
  {
    id: 'direito-penal',
    label: 'Direito Penal'
  },
  {
    id: 'direito-tributario',
    label: 'Direito Tributário'
  },
];

interface SegundaFaseFGVAreaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SegundaFaseFGVAreaDialog: React.FC<SegundaFaseFGVAreaDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [availableAreas, setAvailableAreas] = useState<Array<{id: string, label: string}>>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch areas from Supabase when dialog opens
  useEffect(() => {
    const fetchAreasFromSupabase = async () => {
      if (!open) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('segunda_fase_areas')
          .select('id, slug, name, description')
          .eq('active', true)
          .order('name', { ascending: true });

        if (error) {
          console.error('Erro ao buscar áreas FGV do Supabase:', error);
          setAvailableAreas(segundaFaseFGVAreasFallback);
        } else {
          console.log('Áreas FGV encontradas no Supabase:', data);
          
          if (data && data.length > 0) {
            // Convert Supabase areas to component format
            const supabaseAreas = data.map(area => ({
              id: area.slug,
              label: area.name
            }));
            setAvailableAreas(supabaseAreas);
          } else {
            // Use fallback if no areas found
            setAvailableAreas(segundaFaseFGVAreasFallback);
          }
        }
      } catch (err) {
        console.error('Erro ao conectar com Supabase para áreas FGV:', err);
        setAvailableAreas(segundaFaseFGVAreasFallback);
        toast({
          title: 'Erro ao carregar áreas',
          description: 'Usando áreas padrão. Verifique a conexão com o banco de dados.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAreasFromSupabase();
  }, [open, toast]);
  
  console.log("SegundaFaseFGVAreaDialog aberto:", open);
  
  const handleAreaChange = (areaId: string) => {
    console.log("Área selecionada para Segunda Fase FGV:", areaId);
    setSelectedArea(areaId);
    
    const selectedAreaObj = availableAreas.find(area => area.id === areaId);
    
    // Get the exame number from session storage
    const selectedExame = sessionStorage.getItem('selectedSegundaFaseFGVExame');
    
    console.log("Navegando para segunda fase FGV com:", {
      area: areaId,
      areaName: selectedAreaObj?.label,
      exame: selectedExame
    });
    
    // Close dialog and navigate to the correct route
    onOpenChange(false);
    navigate(`/simulador-segunda-fase?area=${areaId}&piece=${encodeURIComponent('Prova FGV')}&areaName=${encodeURIComponent(selectedAreaObj?.label || '')}&exame=${selectedExame}`);
  };
  
  const resetDialog = () => {
    setSelectedArea(null);
  };
  
  // Reset dialog state when it's closed
  React.useEffect(() => {
    if (!open) {
      resetDialog();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#4F1964]">
            Selecione a Área Jurídica - Segunda Fase FGV
          </DialogTitle>
          <DialogDescription>
            Escolha a área jurídica para a simulação da 2ª fase do exame da OAB:
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4F1964]"></div>
            </div>
          ) : (
            <RadioGroup value={selectedArea || ""} onValueChange={handleAreaChange} className="grid grid-cols-1 gap-3">
              {availableAreas.map((area) => (
                <div key={area.id} className="flex items-center space-x-2 border rounded-lg p-3 hover:border-[#4F1964]/60 transition-colors">
                  <RadioGroupItem value={area.id} id={area.id} />
                  <Label htmlFor={area.id} className="font-medium cursor-pointer flex-grow">{area.label}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SegundaFaseFGVAreaDialog;
