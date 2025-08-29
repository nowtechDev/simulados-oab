import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Area {
  id: string;
  name: string;
  slug: string;
}

interface Simulado {
  id: number;
  title: string;
  questions: number;
  duration: string;
  difficulty: string;
  type: string;
  path: string;
  description: string;
  category: string;
  phase: string;
  area: string;
}

export const useSimuladoData = () => {
  const [fgvSimulados, setFgvSimulados] = useState<Simulado[]>([]);
  const [iaSimulados, setIaSimulados] = useState<Simulado[]>([]);
  const [segundaFaseAreas, setSegundaFaseAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSimulados = async () => {
    setIsLoading(true);
    try {
      const { data: simuladosData, error: simuladosError } = await supabase
        .from('simulados')
        .select('*');

      if (simuladosError) {
        console.error('Erro ao buscar simulados:', simuladosError);
      } else {
        const fgv = simuladosData?.filter(s => s.category === 'fgv') || [];
        const ia = simuladosData?.filter(s => s.category === 'ia') || [];
        
        setFgvSimulados(fgv as Simulado[]);
        setIaSimulados(ia as Simulado[]);
      }

      const { data: areasData, error: areasError } = await supabase
        .from('segunda_fase_areas')
        .select('*')
        .eq('active', true);

      if (areasError) {
        console.error('Erro ao buscar áreas:', areasError);
      } else {
        // Transform the data to match the expected Area interface
        const transformedAreas = areasData?.map(area => ({
          id: area.id,
          name: area.name,
          slug: area.slug
        })) || [];
        
        setSegundaFaseAreas(transformedAreas);
      }
    } catch (error) {
      console.error('Erro geral ao buscar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSimulados();
  }, []);

  return {
    fgvSimulados,
    iaSimulados,
    segundaFaseAreas,
    isLoading,
    fetchSimulados
  };
};
