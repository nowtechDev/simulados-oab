
import { useState, useEffect } from 'react';
import { Filter, X, ChevronDown, ChevronUp, Search, Check, ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Available exam numbers
const examNumbers = Array.from({ length: 40 }, (_, i) => (i + 1).toString());

const areasJuridicas = [
  "Estatuto da OAB",
  "Direito Administrativo",
  "Direito Civil",
  "Direito do Consumidor",
  "Direito Processual Civil",
  "Leis Civis Especiais",
  "Direito da Criança e do Adolescente",
  "Direito Constitucional",
  "Direito do Trabalho",
  "Direito Processual do Trabalho",
  "Direito Empresarial",
  "Direito Penal",
  "Direito Processual Penal",
  "Leis Penais Especiais",
  "Direito Tributário",
  "Direitos Humanos",
  "Direito Ambiental",
  "Direito Internacional",
  "Teoria Geral e Filosofia do Direito",
  "Direito Financeiro",
  "Direito Previdenciário"
];

// Complete subareas with star ratings to indicate frequency on exams
const subareas: Record<string, { name: string; stars: number }[]> = {
  "Direito Civil": [
    { name: "Direito de Família", stars: 3 },
    { name: "Direito das Coisas", stars: 3 },
    { name: "Obrigações", stars: 2 },
    { name: "Contratos (Espécies)", stars: 2 },
    { name: "Sucessões", stars: 2 },
    { name: "Fatos Jurídicos", stars: 2 },
    { name: "Responsabilidade Civil", stars: 2 }
  ],
  "Direito Penal": [
    { name: "Teoria do Crime", stars: 3 },
    { name: "Das Penas", stars: 2 },
    { name: "Crimes contra a Pessoa", stars: 2 },
    { name: "Crimes contra o Patrimônio", stars: 2 },
    { name: "Crimes contra a Administração Pública", stars: 2 },
    { name: "Lei Penal", stars: 2 },
    { name: "Extinção da Punibilidade", stars: 2 }
  ],
  "Direito Administrativo": [
    { name: "Serviços Públicos", stars: 3 },
    { name: "Intervenção do Estado na Propriedade Privada", stars: 2 },
    { name: "Lei 8.112/1990 (Servidores Públicos)", stars: 2 },
    { name: "Organização Administrativa", stars: 2 },
    { name: "Licitações (Lei 14.133/2021)", stars: 2 },
    { name: "Improbidade Administrativa", stars: 2 },
    { name: "Controle da Administração", stars: 2 }
  ],
  "Direito Constitucional": [
    { name: "Organização dos Poderes", stars: 3 },
    { name: "Direitos e Garantias Fundamentais", stars: 3 },
    { name: "Organização do Estado", stars: 2 },
    { name: "Controle de Constitucionalidade", stars: 2 },
    { name: "Ordem Social", stars: 2 },
    { name: "Teoria Constitucional", stars: 2 },
    { name: "Defesa do Estado e das Instituições Democráticas", stars: 1 }
  ],
  "Direito do Trabalho": [
    { name: "Contrato de Trabalho", stars: 3 },
    { name: "Duração do Trabalho", stars: 2 },
    { name: "Remuneração", stars: 2 },
    { name: "Jurisprudência Trabalhista", stars: 2 },
    { name: "Direito Coletivo do Trabalho", stars: 2 },
    { name: "Responsabilidade Trabalhista", stars: 2 },
    { name: "Teletrabalho", stars: 1 }
  ],
  "Direito Processual do Trabalho": [
    { name: "Recursos Trabalhistas", stars: 3 },
    { name: "Jurisprudência Processual Trabalhista", stars: 2 },
    { name: "Execução Trabalhista", stars: 2 },
    { name: "Procedimentos Especiais Trabalhistas", stars: 2 },
    { name: "Provas", stars: 2 },
    { name: "Resposta Trabalhista", stars: 2 },
    { name: "Procedimentos Sumário e Sumaríssimo", stars: 1 }
  ],
  "Direito Processual Civil": [
    { name: "Processo de Conhecimento", stars: 3 },
    { name: "Recursos Cíveis", stars: 3 },
    { name: "Sujeitos do Processo", stars: 2 },
    { name: "Processo de Execução", stars: 2 },
    { name: "Tutela Provisória", stars: 2 },
    { name: "Atos Processuais", stars: 2 },
    { name: "Função Jurisdicional", stars: 1 }
  ],
  "Direito do Consumidor": [
    { name: "Proteção ao Consumidor", stars: 3 },
    { name: "Direitos Básicos", stars: 3 },
    { name: "Responsabilidade pelo Fato do Produto/Serviço", stars: 2 },
    { name: "Práticas Abusivas", stars: 2 },
    { name: "Proteção Contratual", stars: 2 },
    { name: "Defesa do Consumidor em Juízo", stars: 2 }
  ],
  "Leis Civis Especiais": [
    { name: "Locação de Imóveis Urbanos", stars: 3 },
    { name: "Lei de Incorporações", stars: 2 },
    { name: "Estatuto da Cidade", stars: 2 },
    { name: "Estatuto da Pessoa com Deficiência", stars: 2 },
    { name: "Lei de Registros Públicos", stars: 2 },
    { name: "Lei de Arbitragem", stars: 2 }
  ],
  "Direito Empresarial": [
    { name: "Sociedades Empresárias", stars: 3 },
    { name: "Títulos de Crédito", stars: 3 },
    { name: "Recuperação Judicial e Falência", stars: 2 },
    { name: "Estabelecimento Empresarial", stars: 2 },
    { name: "Propriedade Industrial", stars: 2 },
    { name: "Contratos Mercantis", stars: 2 }
  ],
  "Direito Processual Penal": [
    { name: "Ação Penal", stars: 3 },
    { name: "Prisão e Liberdade Provisória", stars: 3 },
    { name: "Provas", stars: 2 },
    { name: "Recursos", stars: 2 },
    { name: "Procedimentos", stars: 2 },
    { name: "Competência", stars: 2 }
  ],
  "Leis Penais Especiais": [
    { name: "Lei de Drogas", stars: 3 },
    { name: "Crimes Hediondos", stars: 3 },
    { name: "Execução Penal", stars: 2 },
    { name: "Lei Maria da Penha", stars: 2 },
    { name: "Estatuto do Desarmamento", stars: 2 },
    { name: "Crimes Ambientais", stars: 2 }
  ],
  "Direito Tributário": [
    { name: "Crédito Tributário", stars: 3 },
    { name: "Competência Tributária", stars: 3 },
    { name: "Limitações ao Poder de Tributar", stars: 2 },
    { name: "Impostos Federais", stars: 2 },
    { name: "Impostos Estaduais", stars: 2 },
    { name: "Impostos Municipais", stars: 2 }
  ],
  "Direitos Humanos": [
    { name: "Proteção Internacional", stars: 3 },
    { name: "Tratados de Direitos Humanos", stars: 3 },
    { name: "Sistema Interamericano", stars: 2 },
    { name: "Jurisprudência Internacional", stars: 2 },
    { name: "Grupos Vulneráveis", stars: 2 },
    { name: "Tribunal Penal Internacional", stars: 2 }
  ],
  "Direito Ambiental": [
    { name: "Princípios", stars: 3 },
    { name: "Licenciamento Ambiental", stars: 3 },
    { name: "Responsabilidade Ambiental", stars: 2 },
    { name: "Áreas de Preservação", stars: 2 },
    { name: "Recursos Hídricos", stars: 2 },
    { name: "Política Nacional do Meio Ambiente", stars: 2 }
  ],
  "Direito Internacional": [
    { name: "Fontes do Direito Internacional", stars: 3 },
    { name: "Tratados Internacionais", stars: 3 },
    { name: "Nacionalidade", stars: 2 },
    { name: "Proteção Diplomática", stars: 2 },
    { name: "Direito dos Tratados", stars: 2 },
    { name: "Organizações Internacionais", stars: 2 }
  ],
  "Teoria Geral e Filosofia do Direito": [
    { name: "Norma Jurídica", stars: 3 },
    { name: "Hermenêutica", stars: 3 },
    { name: "Justiça e Equidade", stars: 2 },
    { name: "Positivismo Jurídico", stars: 2 },
    { name: "Jusnaturalismo", stars: 2 },
    { name: "Interpretação Jurídica", stars: 2 }
  ],
  "Direito da Criança e do Adolescente": [
    { name: "Medidas Socioeducativas", stars: 3 },
    { name: "Conselho Tutelar", stars: 3 },
    { name: "Adoção", stars: 2 },
    { name: "Ato Infracional", stars: 2 },
    { name: "Direito à Convivência Familiar", stars: 2 },
    { name: "Sistema de Garantias", stars: 2 }
  ],
  "Direito Previdenciário": [
    { name: "Benefícios Previdenciários", stars: 3 },
    { name: "Aposentadorias", stars: 3 },
    { name: "Pensão por Morte", stars: 2 },
    { name: "Auxílio-Doença", stars: 2 },
    { name: "Salário-Maternidade", stars: 2 },
    { name: "Contribuições Sociais", stars: 2 }
  ],
  "Estatuto da OAB": [
    { name: "Processo Disciplinar", stars: 3 },
    { name: "Direitos e Deveres do Advogado", stars: 3 },
    { name: "Honorários Advocatícios", stars: 2 },
    { name: "Incompatibilidades e Impedimentos", stars: 2 },
    { name: "Sociedade de Advogados", stars: 2 },
    { name: "Inscrição na OAB", stars: 2 }
  ],
  "Direito Financeiro": [
    { name: "Orçamento Público", stars: 3 },
    { name: "Lei de Responsabilidade Fiscal", stars: 3 },
    { name: "Receita Pública", stars: 2 },
    { name: "Despesa Pública", stars: 2 },
    { name: "Créditos Orçamentários", stars: 2 },
    { name: "Controle da Execução Financeira", stars: 2 }
  ]
};

// Star rating component to show frequency
const StarRating = ({ count }: { count: number }) => {
  return (
    <div className="flex">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="h-3 w-3 fill-purple-400 text-purple-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
};

interface FilterDrawerProps {
  onApplyFilters: (filters: {
    selectedAreas: string[];
    selectedSubareas: string[];
    selectedExams: string[];
    searchKeyword: string;
  }) => void;
}

export function FilterDrawer({ onApplyFilters }: FilterDrawerProps) {
  const [open, setOpen] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedSubareas, setSelectedSubareas] = useState<string[]>([]);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // Handle area selection toggle
  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area)
        ? prev.filter((a) => a !== area)
        : [...prev, area]
    );
  };

  // Handle subarea selection toggle
  const toggleSubarea = (subarea: string) => {
    setSelectedSubareas((prev) =>
      prev.includes(subarea)
        ? prev.filter((s) => s !== subarea)
        : [...prev, subarea]
    );
  };

  // Handle exam selection toggle
  const toggleExam = (examNumber: string) => {
    setSelectedExams((prev) =>
      prev.includes(examNumber)
        ? prev.filter((e) => e !== examNumber)
        : [...prev, examNumber]
    );
  };

  // Remove filter
  const removeFilter = (type: 'area' | 'subarea' | 'exam' | 'keyword', value?: string) => {
    switch (type) {
      case 'area':
        setSelectedAreas((prev) => prev.filter((a) => a !== value));
        break;
      case 'subarea':
        setSelectedSubareas((prev) => prev.filter((s) => s !== value));
        break;
      case 'exam':
        setSelectedExams((prev) => prev.filter((e) => e !== value));
        break;
      case 'keyword':
        setSearchKeyword('');
        break;
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedAreas([]);
    setSelectedSubareas([]);
    setSelectedExams([]);
    setSearchKeyword('');
  };

  // Apply filters
  const applyFilters = () => {
    onApplyFilters({
      selectedAreas,
      selectedSubareas,
      selectedExams,
      searchKeyword,
    });
    setOpen(false);
  };

  // Get available subareas based on selected areas
  const availableSubareas = selectedAreas.flatMap(
    (area) => subareas[area] || []
  );

  // Count selected filters
  const selectedFiltersCount = 
    selectedAreas.length + 
    selectedSubareas.length + 
    selectedExams.length + 
    (searchKeyword ? 1 : 0);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 bg-white hover:bg-gray-50 border-purple-100"
        >
          <Filter className="h-4 w-4 text-purple-600" />
          <span className="text-purple-600 font-medium">Filtros</span>
          {selectedFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 rounded-full px-1.5 py-0.5 bg-purple-600 text-white">
              {selectedFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-screen max-w-md p-0 border border-purple-100 shadow-lg" align="end">
        <div className="bg-gray-50/80">
          <div className="flex items-center justify-between p-4 pb-2">
            <h3 className="text-lg font-semibold text-purple-800">Filtros</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-purple-600 hover:text-purple-800 hover:bg-purple-50"
            >
              Limpar
            </Button>
          </div>
          
          {/* Applied filters */}
          {selectedFiltersCount > 0 && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-1">
                {selectedExams.map((exam) => (
                  <Badge key={exam} variant="secondary" className="pl-2 pr-1 py-1.5 flex items-center gap-1 text-xs bg-purple-100 text-purple-800 border-purple-200">
                    {exam}º
                    <button
                      onClick={() => removeFilter('exam', exam)}
                      className="ml-1 rounded-full hover:bg-purple-200 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                
                {selectedAreas.map((area) => (
                  <Badge key={area} variant="secondary" className="pl-2 pr-1 py-1.5 flex items-center gap-1 text-xs bg-purple-100 text-purple-800 border-purple-200">
                    {area}
                    <button
                      onClick={() => removeFilter('area', area)}
                      className="ml-1 rounded-full hover:bg-purple-200 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                
                {selectedSubareas.map((subarea) => (
                  <Badge key={subarea} variant="secondary" className="pl-2 pr-1 py-1.5 flex items-center gap-1 text-xs bg-purple-100 text-purple-800 border-purple-200">
                    {subarea}
                    <button
                      onClick={() => removeFilter('subarea', subarea)}
                      className="ml-1 rounded-full hover:bg-purple-200 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                
                {searchKeyword && (
                  <Badge variant="secondary" className="pl-2 pr-1 py-1.5 flex items-center gap-1 text-xs bg-purple-100 text-purple-800 border-purple-200">
                    "{searchKeyword}"
                    <button
                      onClick={() => removeFilter('keyword')}
                      className="ml-1 rounded-full hover:bg-purple-200 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="bg-white">
          <Accordion type="multiple" className="w-full">
            {/* Exames section - made more compact */}
            <AccordionItem value="exams" className="border-b border-purple-100">
              <AccordionTrigger className="py-4 px-4 hover:bg-purple-50/50 hover:no-underline">
                <div className="flex items-center gap-2 text-purple-800">
                  <ListFilter className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Exames</span>
                  {selectedExams.length > 0 && (
                    <Badge className="ml-2 bg-purple-100 text-purple-800 border-none">
                      {selectedExams.length}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                {/* Made the grid have more columns to be more compact */}
                <ScrollArea className="h-[200px]">
                  <div className="grid grid-cols-8 gap-1.5">
                    {examNumbers.map((examNum) => {
                      const isSelected = selectedExams.includes(examNum);
                      return (
                        <button
                          key={examNum}
                          className={`p-1.5 rounded-md text-sm font-medium flex items-center justify-center transition-colors ${
                            isSelected 
                              ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                              : 'hover:bg-gray-100 border border-transparent'
                          }`}
                          onClick={() => toggleExam(examNum)}
                        >
                          {examNum}º
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
            
            {/* Área Jurídica section */}
            <AccordionItem value="areas" className="border-b border-purple-100">
              <AccordionTrigger className="py-4 px-4 hover:bg-purple-50/50 hover:no-underline">
                <div className="flex items-center gap-2 text-purple-800">
                  <Filter className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Área Jurídica</span>
                  {selectedAreas.length > 0 && (
                    <Badge className="ml-2 bg-purple-100 text-purple-800 border-none">
                      {selectedAreas.length}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <ScrollArea className="h-[300px] pr-4">
                  <div className="grid grid-cols-1 gap-1">
                    {areasJuridicas.map((area) => {
                      const isSelected = selectedAreas.includes(area);
                      return (
                        <button
                          key={area}
                          className={`px-3 py-2 rounded-md text-sm flex items-center transition-colors ${
                            isSelected 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                          onClick={() => toggleArea(area)}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <div 
                              className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                                isSelected ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                              }`}
                            >
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <span className={isSelected ? "font-medium" : ""}>{area}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
            
            {/* Temas Frequentes section */}
            <AccordionItem value="subareas" className="border-b border-purple-100">
              <AccordionTrigger className="py-4 px-4 hover:bg-purple-50/50 hover:no-underline">
                <div className="flex items-center gap-2 text-purple-800">
                  <Check className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Temas Frequentes</span>
                  {selectedSubareas.length > 0 && (
                    <Badge className="ml-2 bg-purple-100 text-purple-800 border-none">
                      {selectedSubareas.length}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <ScrollArea className="h-[250px] pr-4">
                  {availableSubareas.length > 0 ? (
                    <div className="grid grid-cols-1 gap-1">
                      {availableSubareas.map((subarea) => {
                        const isSelected = selectedSubareas.includes(subarea.name);
                        return (
                          <button
                            key={subarea.name}
                            className={`px-3 py-2 rounded-md text-sm flex items-center justify-between transition-colors ${
                              isSelected 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'hover:bg-gray-100 text-gray-700'
                            }`}
                            onClick={() => toggleSubarea(subarea.name)}
                          >
                            <div className="flex items-center gap-2">
                              <div 
                                className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                                  isSelected ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                                }`}
                              >
                                {isSelected && <Check className="h-3 w-3 text-white" />}
                              </div>
                              <span className={isSelected ? "font-medium" : ""}>{subarea.name}</span>
                            </div>
                            <StarRating count={subarea.stars} />
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-3 text-gray-500">
                      Selecione uma área jurídica para ver os temas frequentes
                    </div>
                  )}
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
            
            {/* Busca por Palavra-chave section */}
            <AccordionItem value="keyword" className="border-b-0">
              <AccordionTrigger className="py-4 px-4 hover:bg-purple-50/50 hover:no-underline">
                <div className="flex items-center gap-2 text-purple-800">
                  <Search className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Busca por palavra-chave</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Ex: habeas corpus, alimentos, etc."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="border-purple-200 focus-visible:ring-purple-500"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="p-4 border-t border-purple-100 flex gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1 border-purple-200 text-purple-800 hover:bg-purple-50 hover:text-purple-900"
          >
            Cancelar
          </Button>
          <Button
            onClick={applyFilters}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
          >
            Aplicar Filtros
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
