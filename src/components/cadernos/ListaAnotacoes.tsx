
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PlusCircle, File, ChevronRight, ChevronLeft, BookOpen, ChevronDown } from 'lucide-react';
import { Anotacao, MateriaJuridica, Caderno } from '@/types/caderno';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { materias, getCadernos } from '@/services/cadernoService';

interface ListaAnotacoesProps {
  anotacoes: Anotacao[];
  anotacaoSelecionada: string | null;
  onSelecionarAnotacao: (id: string) => void;
  onNovaAnotacao: () => void;
  materiaAtiva: MateriaJuridica | null;
  onSelecionarMateria: (materia: MateriaJuridica) => void;
  onNovoCaderno: () => void;
}

const ListaAnotacoes = ({
  anotacoes,
  anotacaoSelecionada,
  onSelecionarAnotacao,
  onNovaAnotacao,
  materiaAtiva,
  onSelecionarMateria,
  onNovoCaderno
}: ListaAnotacoesProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [materiasCollapsed, setMateriasCollapsed] = useState(false);
  const [allCadernos, setAllCadernos] = useState<Caderno[]>([]);
  const [todasMaterias, setTodasMaterias] = useState<string[]>([]);

  // Load all cadernos and extract unique materias
  const loadCadernosEMaterias = () => {
    console.log("Loading cadernos and materias in ListaAnotacoes");
    const cadernos = getCadernos();
    setAllCadernos(cadernos);
    
    // Extrair todas as matérias únicas dos cadernos (padrão + personalizadas)
    const materiasDeCadernos = new Set(cadernos.map(c => c.materia));
    const todasMateriasUnicas = Array.from(materiasDeCadernos);
    console.log("Unique materias found:", todasMateriasUnicas);
    setTodasMaterias(todasMateriasUnicas);
  };

  useEffect(() => {
    loadCadernosEMaterias();

    // Listen for storage changes
    const handleStorageChange = () => {
      console.log("Storage change detected in ListaAnotacoes");
      loadCadernosEMaterias();
    };
    
    // Custom event listener for caderno updates
    const handleCadernoUpdate = () => {
      console.log("Caderno update event received in ListaAnotacoes");
      loadCadernosEMaterias();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cadernoUpdated', handleCadernoUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cadernoUpdated', handleCadernoUpdate);
    };
  }, []);

  const extrairTitulo = (conteudo: string): string => {
    const match = conteudo.match(/^#+ (.+)$/m);
    if (match) return match[1];
    return conteudo.substring(0, 30) + (conteudo.length > 30 ? '...' : '');
  };

  const formatarData = (dataHora: string): string => {
    const data = new Date(dataHora);
    return data.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit'
    });
  };

  return (
    <Collapsible
      open={!collapsed}
      onOpenChange={(open) => setCollapsed(!open)}
      className={cn(
        "transition-all duration-300 border-r", 
        collapsed ? "w-12" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-2 border-b bg-[#F9F0FF]">
        <h3 className={cn("font-semibold truncate text-[#4F1964]", collapsed && "hidden")}>
          Caderno de Estudos
        </h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="h-[calc(100%-42px)] flex flex-col">
        <div className="border-b">
          <Button
            variant="ghost"
            className="w-full justify-between py-2 px-3 text-left h-auto"
            onClick={() => setMateriasCollapsed(!materiasCollapsed)}
          >
            <span className="font-medium text-[#4F1964]">Matérias</span>
            {materiasCollapsed ? 
              <ChevronRight className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </Button>
          
          {!materiasCollapsed && (
            <ScrollArea className="h-40 pl-2 pr-2 mb-2">
              {todasMaterias.map((materia) => (
                <Button
                  key={materia}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left py-1.5 px-2 h-auto text-sm",
                    materiaAtiva === materia
                      ? "bg-[#F8E6FF] text-[#4F1964]"
                      : ""
                  )}
                  onClick={() => onSelecionarMateria(materia as MateriaJuridica)}
                >
                  <BookOpen className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                  <span className="truncate">{materia}</span>
                </Button>
              ))}
              <Button 
                variant="outline"
                className="w-full mt-2 h-8 text-xs"
                onClick={onNovoCaderno}
              >
                <PlusCircle className="w-3 h-3 mr-1" />
                Novo Caderno
              </Button>
            </ScrollArea>
          )}
        </div>
        
        <div className="flex flex-col flex-grow overflow-hidden">
          <div className="p-2 flex items-center justify-between">
            <span className="text-sm font-medium text-[#4F1964]">Anotações</span>
            <Button 
              onClick={onNovaAnotacao}
              className="h-7 bg-[#4F1964] hover:bg-[#6B3182] text-white text-xs px-2"
              size="sm"
            >
              <PlusCircle className="w-3 h-3 mr-1" />
              Nova
            </Button>
          </div>
          
          <ScrollArea className="flex-grow px-2 py-1">
            <div className="space-y-1">
              {anotacoes.length === 0 ? (
                <div className="text-center p-4 text-sm text-muted-foreground">
                  Nenhuma anotação encontrada.
                </div>
              ) : (
                anotacoes.map((anotacao) => (
                  <Button
                    key={anotacao.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left py-1.5 px-2 h-auto",
                      anotacaoSelecionada === anotacao.id
                        ? "bg-[#F8E6FF] text-[#4F1964]"
                        : ""
                    )}
                    onClick={() => onSelecionarAnotacao(anotacao.id)}
                  >
                    <div className="flex flex-col items-start gap-0.5 w-full">
                      <div className="flex w-full items-center">
                        <File className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                        <span className="font-medium truncate text-sm">
                          {extrairTitulo(anotacao.conteudo)}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground pl-5">
                        {formatarData(anotacao.dataHora)}
                      </span>
                    </div>
                  </Button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </CollapsibleContent>
      
      {collapsed && (
        <div className="flex flex-col items-center pt-2 gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={onNovaAnotacao}
            title="Nova Anotação"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setCollapsed(false)}
            title="Expandir Menu"
          >
            <BookOpen className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Collapsible>
  );
};

export default ListaAnotacoes;
