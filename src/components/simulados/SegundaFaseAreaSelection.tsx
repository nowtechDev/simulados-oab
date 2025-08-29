
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Area {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface Exame {
  id: string;
  numero_exame: number;
  enunciado: string;
  tipo: string;
  numero_questao: string;
  area_id: string;
}

const SegundaFaseAreaSelection = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [exames, setExames] = useState<Exame[]>([]);
  const [examsByNumber, setExamsByNumber] = useState<Record<number, Exame[]>>({});
  const [isLoadingAreas, setIsLoadingAreas] = useState(true);
  const [isLoadingExames, setIsLoadingExames] = useState(false);
  const navigate = useNavigate();

  // Buscar áreas ativas
  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    console.log('🔍 Buscando áreas da segunda fase...');
    try {
      setIsLoadingAreas(true);
      const { data, error } = await supabase
        .from('segunda_fase_areas')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) {
        console.error('❌ Erro ao buscar áreas:', error);
        throw error;
      }

      console.log('✅ Áreas encontradas:', data?.length || 0);
      setAreas(data || []);
    } catch (error) {
      console.error('Erro ao carregar áreas:', error);
    } finally {
      setIsLoadingAreas(false);
    }
  };

  const fetchExamesByArea = async (areaId: string) => {
    console.log(`🔍 Buscando exames para área: ${areaId}`);
    try {
      setIsLoadingExames(true);
      const { data, error } = await supabase
        .from('segunda_fase_questoes')
        .select('*')
        .eq('area_id', areaId)
        .eq('ativa', true)
        .order('numero_exame', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar exames:', error);
        throw error;
      }

      console.log('✅ Exames encontrados:', data?.length || 0);
      setExames(data || []);

      // Agrupar por número de exame
      const grouped = (data || []).reduce((acc, exame) => {
        if (!acc[exame.numero_exame]) {
          acc[exame.numero_exame] = [];
        }
        acc[exame.numero_exame].push(exame);
        return acc;
      }, {} as Record<number, Exame[]>);

      console.log('📊 Exames agrupados por número:', Object.keys(grouped).length, 'exames diferentes');
      setExamsByNumber(grouped);
    } catch (error) {
      console.error('Erro ao carregar exames:', error);
    } finally {
      setIsLoadingExames(false);
    }
  };

  const handleAreaSelect = (area: Area) => {
    console.log('🎯 Área selecionada:', area.name);
    setSelectedArea(area);
    fetchExamesByArea(area.id);
  };

  const handleExameSelect = (numeroExame: number) => {
    if (!selectedArea) return;
    
    console.log('🎯 Navegando para exame:', numeroExame, 'da área:', selectedArea.name);
    navigate(`/simulador-segunda-fase?area=${selectedArea.id}&areaName=${selectedArea.name}&exame=${numeroExame}&piece=Prova%20FGV`);
  };

  const handleVoltar = () => {
    setSelectedArea(null);
    setExames([]);
    setExamsByNumber({});
  };

  if (isLoadingAreas) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#8B5CF6]" />
        <span className="ml-2 text-lg">Carregando áreas...</span>
      </div>
    );
  }

  // Se nenhuma área selecionada, mostrar lista de áreas
  if (!selectedArea) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#4F1964] mb-2">Escolha uma Área Jurídica</h2>
          <p className="text-gray-600">Selecione a área para ver os exames disponíveis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {areas.map((area) => (
            <Card 
              key={area.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-[#8B5CF6]"
              onClick={() => handleAreaSelect(area)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#8B5CF6]" />
                  <CardTitle className="text-lg">{area.name}</CardTitle>
                </div>
                {area.description && (
                  <CardDescription className="text-sm">
                    {area.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-[#8B5CF6]/10 text-[#8B5CF6]">
                    Segunda Fase
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Se área selecionada, mostrar exames
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" onClick={handleVoltar} className="mb-4">
            ← Voltar para Áreas
          </Button>
          <h2 className="text-2xl font-bold text-[#4F1964]">{selectedArea.name}</h2>
          <p className="text-gray-600">Escolha um exame para praticar</p>
        </div>
      </div>

      {isLoadingExames ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#8B5CF6]" />
          <span className="ml-2 text-lg">Carregando exames...</span>
        </div>
      ) : Object.keys(examsByNumber).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum exame encontrado para esta área.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(examsByNumber)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([numeroExame, questoes]) => (
            <Card 
              key={numeroExame}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-[#8B5CF6]"
              onClick={() => handleExameSelect(Number(numeroExame))}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {numeroExame}º Exame de Ordem
                </CardTitle>
                <CardDescription>
                  {questoes.length} questão{questoes.length !== 1 ? 'ões' : ''} dissertativa{questoes.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {selectedArea.name}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SegundaFaseAreaSelection;
