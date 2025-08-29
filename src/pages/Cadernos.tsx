import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, BookOpen, ArrowRight } from 'lucide-react';
import NovoCadernoDialog from '@/components/cadernos/NovoCadernoDialog';
import { getCadernos, materias } from '@/services/cadernoService';
import { Caderno, MateriaJuridica } from '@/types/caderno';
import OpenAIConfig from '@/components/OpenAIConfig';
const Cadernos = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cadernos, setCadernos] = useState<Caderno[]>([]);
  const [isNovoCadernoDialogOpen, setIsNovoCadernoDialogOpen] = useState(false);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  useEffect(() => {
    // Verificação de login
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    if (!loggedIn) {
      toast({
        title: "Acesso restrito",
        description: "Faça login para acessar esta página",
        variant: "destructive"
      });
      navigate('/login');
    } else {
      // Carregar cadernos
      const cadernosStorage = getCadernos();
      setCadernos(cadernosStorage);
    }
  }, [navigate, toast]);
  const handleAbrirCaderno = (id: number) => {
    navigate(`/caderno/${id}`);
  };
  const handleNovoCadernoAdicionado = () => {
    // Recarregar cadernos
    const cadernosAtualizados = getCadernos();
    setCadernos(cadernosAtualizados);
  };

  // Agrupar cadernos por matéria
  const cadernosPorMateria = materias.reduce((acc, materia) => {
    acc[materia] = cadernos.filter(caderno => caderno.materia === materia);
    return acc;
  }, {} as Record<string, Caderno[]>);
  if (!isLoggedIn) {
    return null; // Não renderiza nada se não estiver logado
  }

  // Função para renderizar um card de matéria no novo formato
  const renderMateriaCard = (materia: MateriaJuridica) => {
    const cadernosDaMateria = cadernosPorMateria[materia] || [];
    const temCaderno = cadernosDaMateria.length > 0;
    const caderno = temCaderno ? cadernosDaMateria[0] : null;
    return <Card key={materia} className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => temCaderno ? handleAbrirCaderno(caderno!.id) : setIsNovoCadernoDialogOpen(true)}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-[#4F1964] text-2xl">{materia}</CardTitle>
            <BookOpen className="text-[#4F1964] h-6 w-6" />
          </div>
          
        </CardHeader>
        <CardContent className="pt-2 pb-4">
          {temCaderno && <div className="flex justify-between text-gray-500 text-sm">
              
              
            </div>}
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="ghost" className="w-full text-[#4F1964] justify-center gap-2 hover:bg-[#F8E6FF]/50">
            <span>{temCaderno ? 'Abrir caderno' : 'Criar caderno'}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>;
  };
  return <Layout>
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="bg-[#F8E6FF] px-4 py-1.5 rounded-full text-sm font-medium text-[#4F1964] mb-4 inline-block">
            Organização Inteligente
          </span>
          <h1 className="text-4xl font-bold text-[#4F1964] mb-4">
            Cadernos Inteligentes
          </h1>
          <p className="text-foreground/80 text-lg">
            Crie, organize e revise seus cadernos de anotações com o auxílio da inteligência artificial.
            Transforme suas anotações em material de estudo otimizado para o Exame da OAB.
          </p>
        </div>
        
        <div className="mb-8 flex justify-end">
          <div className="flex gap-2">
            <OpenAIConfig className="h-9" />
          </div>
        </div>

        {/* Grid de matérias */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Renderizar todas as matérias como cards */}
          {materias.map(materia => renderMateriaCard(materia))}

          {/* Card de "Novo Caderno" */}
          <Card className="border-dashed border-2 border-[#4F1964]/20 bg-[#F8E6FF]/10 hover:bg-[#F8E6FF]/20 transition-colors cursor-pointer rounded-xl" onClick={() => setIsNovoCadernoDialogOpen(true)}>
            <CardHeader>
              <CardTitle className="text-[#4F1964] text-2xl">+ Novo Caderno</CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Crie um caderno para outra matéria
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <PlusCircle className="h-12 w-12 text-[#4F1964]/40 mb-4" />
              <p className="text-center text-muted-foreground">
                Adicione um caderno personalizado com o tema da sua escolha
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Diálogo para Novo Caderno */}
      <NovoCadernoDialog open={isNovoCadernoDialogOpen} onOpenChange={setIsNovoCadernoDialogOpen} onCadernoAdicionado={handleNovoCadernoAdicionado} />
    </Layout>;
};
export default Cadernos;