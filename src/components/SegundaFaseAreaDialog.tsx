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

// Áreas específicas para Segunda Fase da OAB (fallback)
const segundaFaseAreasFallback = [
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

interface SegundaFaseAreaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fromFgvExam?: boolean;
  areas?: Array<{id: string, label: string}>;
  onAreaSelect?: (area: any) => void;
}

const SegundaFaseAreaDialog: React.FC<SegundaFaseAreaDialogProps> = ({
  open,
  onOpenChange,
  fromFgvExam = false,
  areas = [],
  onAreaSelect
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
          console.error('Erro ao buscar áreas do Supabase:', error);
          setAvailableAreas(segundaFaseAreasFallback);
        } else {
          console.log('Áreas encontradas no Supabase:', data);
          
          if (data && data.length > 0) {
            // Convert Supabase areas to component format
            const supabaseAreas = data.map(area => ({
              id: area.slug,
              label: area.name
            }));
            setAvailableAreas(supabaseAreas);
          } else {
            // Use fallback if no areas found
            setAvailableAreas(segundaFaseAreasFallback);
          }
        }
      } catch (err) {
        console.error('Erro ao conectar com Supabase para áreas:', err);
        setAvailableAreas(segundaFaseAreasFallback);
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
  
  console.log("SegundaFaseAreaDialog aberto:", open);
  
  const handleAreaChange = async (areaId: string) => {
    console.log("Área selecionada para Segunda Fase:", areaId);
    setSelectedArea(areaId);
    
    const selectedAreaObj = availableAreas.find(area => area.id === areaId);
    
    // Get the exame number from session storage based on whether it's from FGV exam
    const selectedExame = fromFgvExam 
      ? sessionStorage.getItem('selectedSegundaFaseFGVExame')
      : sessionStorage.getItem('selectedSegundaFaseExame');
    
    console.log("Área selecionada:", {
      area: areaId,
      areaName: selectedAreaObj?.label,
      exame: selectedExame,
      fromFgvExam
    });
    
    // If onAreaSelect callback is provided, use it
    if (onAreaSelect && fromFgvExam) {
      try {
        // Verificar se o areaId já é um objeto
        if (typeof areaId === 'object' && areaId !== null) {
          console.log("areaId já é um objeto:", areaId);
          onOpenChange(false);
          onAreaSelect(areaId);
          return;
        }
        
        console.log("Buscando área com slug:", areaId);
        
        // Verificar se o areaId é um UUID (validação básica)
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(areaId);
        
        let areaData;
        
        // Primeiro, tentar buscar pelo slug (caso mais comum)
        const { data: dataBySlug, error: errorBySlug } = await supabase
          .from('segunda_fase_areas')
          .select('*')
          .eq('slug', areaId)
          .single();
        
        if (!errorBySlug && dataBySlug) {
          console.log("Área encontrada pelo slug:", dataBySlug);
          areaData = dataBySlug;
        } 
        // Se não encontrar pelo slug ou se o areaId parece ser um UUID, tentar pelo ID
        else if (isUUID || errorBySlug) {
          console.log("Tentando buscar área pelo ID:", areaId);
          
          const { data: dataById, error: errorById } = await supabase
            .from('segunda_fase_areas')
            .select('*')
            .eq('id', areaId)
            .single();
            
          if (!errorById && dataById) {
            console.log("Área encontrada pelo ID:", dataById);
            areaData = dataById;
          } else {
            console.error("Erro ao buscar área pelo ID:", errorById);
            
            // Se ainda não encontrou, tentar uma última busca mais ampla
            console.log("Tentando busca geral de áreas...");
            const { data: allAreas, error: allAreasError } = await supabase
              .from('segunda_fase_areas')
              .select('*')
              .eq('active', true);
            
            if (!allAreasError && allAreas && allAreas.length > 0) {
              // Tentar encontrar por correspondência parcial no nome ou slug
              const foundArea = allAreas.find(area => 
                area.slug?.includes(areaId) || 
                areaId.includes(area.slug) || 
                area.name?.toLowerCase().includes(selectedAreaObj?.label?.toLowerCase() || '') ||
                (selectedAreaObj?.label?.toLowerCase() || '').includes(area.name?.toLowerCase())
              );
              
              if (foundArea) {
                console.log("Área encontrada por correspondência parcial:", foundArea);
                areaData = foundArea;
              }
            }
          }
        }
        
        if (areaData) {
          console.log("Área processada com sucesso:", areaData);
          onOpenChange(false);
          onAreaSelect(areaData);
        } else {
          console.error("Nenhuma área encontrada para identificador:", areaId);
          toast({
            title: "Área não encontrada",
            description: "Não foi possível encontrar a área selecionada no banco de dados.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Erro ao processar área selecionada:", err);
        toast({
          title: "Erro ao processar área",
          description: "Ocorreu um erro ao processar a área selecionada.",
          variant: "destructive",
        });
      }
      return;
    }
    
    // Otherwise, close dialog and navigate to the correct route
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
            Selecione a Área Jurídica - Segunda Fase
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

export default SegundaFaseAreaDialog;
