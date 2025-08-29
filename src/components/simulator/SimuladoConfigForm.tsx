import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertTriangle, Star } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

// Subareas with star ratings to indicate frequency on exams
const subareas: Record<string, { name: string; stars: number }[]> = {
  "Direito Administrativo": [
    { name: "Serviços Públicos", stars: 3 },
    { name: "Intervenção do Estado na Propriedade Privada", stars: 2 },
    { name: "Lei 8.112/1990 (Servidores Públicos)", stars: 2 },
    { name: "Organização Administrativa", stars: 2 },
    { name: "Licitações (Lei 14.133/2021)", stars: 2 },
    { name: "Improbidade Administrativa", stars: 2 },
    { name: "Controle da Administração", stars: 2 }
  ],
  "Direito Civil": [
    { name: "Direito de Família", stars: 3 },
    { name: "Direito das Coisas", stars: 3 },
    { name: "Obrigações", stars: 2 },
    { name: "Contratos (Espécies)", stars: 2 },
    { name: "Sucessões", stars: 2 },
    { name: "Fatos Jurídicos", stars: 2 },
    { name: "Responsabilidade Civil", stars: 2 }
  ],
  "Direito do Consumidor": [
    { name: "Qualidade de Produtos e Serviços, Prevenção e Reparação de Danos", stars: 3 },
    { name: "Proteção Contratual", stars: 2 },
    { name: "Práticas Comerciais", stars: 2 },
    { name: "Direitos Básicos do Consumidor", stars: 2 },
    { name: "Defesa do Consumidor em Juízo", stars: 2 },
    { name: "Disposições Gerais e Princípios do CDC", stars: 2 }
  ],
  "Direito Processual Civil": [
    { name: "Processo de Conhecimento e Cumprimento de Sentença", stars: 3 },
    { name: "Sujeitos do Processo", stars: 2 },
    { name: "Recursos e Meios de Impugnação", stars: 2 },
    { name: "Processo de Execução", stars: 2 },
    { name: "Tutela Provisória", stars: 2 },
    { name: "Atos Processuais", stars: 2 },
    { name: "Função Jurisdicional", stars: 1 }
  ],
  "Leis Civis Especiais": [
    { name: "Jurisdição Constitucional das Liberdades", stars: 3 },
    { name: "Direito Processual Tributário", stars: 2 },
    { name: "Locação de Imóveis Urbanos", stars: 2 },
    { name: "Procedimento Sumaríssimo (Juizados Especiais)", stars: 2 },
    { name: "Formas Alternativas de Resolução de Conflitos", stars: 2 },
    { name: "LINDB (Decreto-Lei 4.657/42)", stars: 2 },
    { name: "SFI e Alienação Fiduciária de Imóvel", stars: 1 }
  ],
  "Direito da Criança e do Adolescente": [
    { name: "Direitos Fundamentais (ECA)", stars: 3 },
    { name: "Acesso à Justiça (ECA)", stars: 2 },
    { name: "Ato Infracional", stars: 2 },
    { name: "Prevenção (ECA)", stars: 2 },
    { name: "Política de Atendimento", stars: 2 },
    { name: "Conselho Tutelar", stars: 2 },
    { name: "Infrações Administrativas", stars: 1 }
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
    { name: "Resposta Trabalhista (contestação, exceções etc.)", stars: 2 },
    { name: "Procedimentos Sumário e Sumaríssimo", stars: 1 }
  ],
  "Direito Empresarial": [
    { name: "Sociedade", stars: 3 },
    { name: "Recuperação Judicial e Falência", stars: 3 },
    { name: "Direito de Empresa", stars: 2 },
    { name: "Títulos de Crédito", stars: 2 },
    { name: "Contratos Mercantis", stars: 1 },
    { name: "Propriedade Industrial", stars: 1 },
    { name: "Registro Empresarial e Atos Societários", stars: 1 }
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
  "Direito Processual Penal": [
    { name: "Recursos e Sucedâneos Recursais Criminais", stars: 3 },
    { name: "Processos Criminais em Espécie", stars: 2 },
    { name: "Ação Penal", stars: 2 },
    { name: "Competência Processual Penal", stars: 2 },
    { name: "Prova", stars: 2 },
    { name: "Questões e Processos Incidentes", stars: 2 },
    { name: "Prisão, Medidas Cautelares e Liberdade Provisória", stars: 2 }
  ],
  "Leis Penais Especiais": [
    { name: "Lei de Execução Penal (Lei 7.210/1984)", stars: 3 },
    { name: "Juizados Especiais Criminais (Lei 9.099/1995)", stars: 2 },
    { name: "Crimes de Trânsito (CTB)", stars: 2 },
    { name: "Lei de Drogas (Lei 11.343/2006)", stars: 2 },
    { name: "Crimes no ECA (arts. 225 ao 244-B)", stars: 2 },
    { name: "Lei do Meio Ambiente (Lei 9.605/1998)", stars: 2 },
    { name: "Lei Maria da Penha (Lei 11.340/2006)", stars: 2 }
  ],
  "Direito Tributário": [
    { name: "Crédito Tributário", stars: 3 },
    { name: "Impostos (Federais, Estaduais e Municipais)", stars: 2 },
    { name: "Obrigação Tributária", stars: 2 },
    { name: "Limitações Constitucionais ao Poder de Tributar", stars: 2 },
    { name: "Espécies de Tributos", stars: 2 },
    { name: "Legislação Tributária", stars: 2 },
    { name: "Jurisprudência em Direito Tributário", stars: 2 }
  ],
  "Direitos Humanos": [
    { name: "Convenções Internacionais de Direitos Humanos", stars: 3 },
    { name: "Sistema Internacional de Proteção dos DH", stars: 2 },
    { name: "Direitos Humanos na Constituição Federal", stars: 2 },
    { name: "Carta Internacional dos Direitos Humanos", stars: 2 },
    { name: "Direitos das Pessoas com Deficiência", stars: 2 },
    { name: "Conceitos e Gerações dos DH", stars: 2 },
    { name: "Conselho Nacional dos Direitos Humanos (Lei 12.986/14)", stars: 2 }
  ],
  "Direito Ambiental": [
    { name: "Política, Licenciamento e Impacto Ambiental", stars: 3 },
    { name: "Direito Ambiental Constitucional", stars: 2 },
    { name: "Unidades de Conservação", stars: 2 },
    { name: "Florestas", stars: 2 },
    { name: "Infrações e Responsabilidade Ambiental", stars: 2 },
    { name: "Resíduos Sólidos", stars: 2 },
    { name: "Águas (Recursos Hídricos)", stars: 2 }
  ],
  "Direito Internacional": [
    { name: "Direito Internacional Privado", stars: 3 },
    { name: "Nacionalidade e Condição Jurídica do Estrangeiro", stars: 3 },
    { name: "Sujeitos de Direito Internacional", stars: 2 },
    { name: "Solução Pacífica de Conflitos", stars: 2 },
    { name: "Relações Diplomáticas e Consulares", stars: 2 },
    { name: "Fontes do Direito Internacional", stars: 2 },
    { name: "Direito do Comércio Internacional", stars: 2 }
  ],
  "Teoria Geral e Filosofia do Direito": [
    { name: "Direito, Moral e Justiça", stars: 3 },
    { name: "Juspositivismo e Jusnaturalismo", stars: 2 },
    { name: "Hermenêutica Jurídica", stars: 2 },
    { name: "Teoria da Argumentação", stars: 2 },
    { name: "Utilitarismo", stars: 2 },
    { name: "Razão Prática", stars: 2 }
  ],
  "Estatuto da OAB": [
    { name: "Ética do Advogado (CED)", stars: 3 },
    { name: "Direitos dos Advogados", stars: 3 },
    { name: "Infrações e Sanções Disciplinares", stars: 2 },
    { name: "Atividade da Advocacia", stars: 2 },
    { name: "Sociedade de Advogados", stars: 2 },
    { name: "Honorários Advocatícios", stars: 2 },
    { name: "Ordem dos Advogados do Brasil (estrutura)", stars: 2 }
  ],
  "Direito Financeiro": [
    { name: "Orçamento Público", stars: 3 },
    { name: "Lei de Responsabilidade Fiscal (LRF)", stars: 3 },
    { name: "Despesa Pública", stars: 3 },
    { name: "Receita Pública", stars: 2 },
    { name: "Créditos Adicionais", stars: 2 },
    { name: "Ciclo Orçamentário", stars: 2 },
    { name: "Programação e Descentralização", stars: 2 }
  ],
  "Direito Previdenciário": [
    { name: "Prestações em Geral", stars: 3 },
    { name: "Seguridade Social", stars: 2 },
    { name: "Beneficiários do RGPS", stars: 2 },
    { name: "Regime Próprio de Previdência", stars: 2 },
    { name: "Custeio da Previdência Social", stars: 2 },
    { name: "Jurisprudência em Previdenciário", stars: 2 },
    { name: "Habilitação, Reabilitação e Serviço Social", stars: 2 }
  ]
};

const formSchema = z.object({
  area: z.string({
    required_error: "Por favor, selecione uma área.",
  }),
  subarea: z.string().optional(),
  numQuestoes: z.string({
    required_error: "Selecione o número de questões.",
  }),
  palavraChave: z.string().optional(),
  simuladoCompleto: z.boolean().default(false),
});

interface SimuladoConfigFormProps {
  onStartSimulado: (config: SimuladoConfig) => void;
}

export interface SimuladoConfig {
  area: string;
  subarea?: string;
  numQuestoes: number;
  palavraChave?: string;
  simuladoCompleto: boolean;
}

// Helper component to render stars based on frequency
const StarRating = ({ count }: { count: number }) => {
  return (
    <div className="flex">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
};

const SimuladoConfigForm: React.FC<SimuladoConfigFormProps> = ({ onStartSimulado }) => {
  const [showFullSimuladoWarning, setShowFullSimuladoWarning] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      area: "",
      subarea: "",
      numQuestoes: "5",
      palavraChave: "",
      simuladoCompleto: false,
    },
  });

  const selectedArea = form.watch("area");
  const availableSubareas = selectedArea ? subareas[selectedArea] || [] : [];

  React.useEffect(() => {
    form.setValue("subarea", "");
  }, [selectedArea, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const config: SimuladoConfig = {
      area: values.area,
      subarea: values.subarea,
      numQuestoes: parseInt(values.numQuestoes),
      palavraChave: values.palavraChave,
      simuladoCompleto: false,
    };
    
    onStartSimulado(config);
  };

  const handleFullSimuladoClick = () => {
    setShowFullSimuladoWarning(true);
  };

  const startFullSimulado = () => {
    onStartSimulado({
      area: "todas",
      subarea: "",
      numQuestoes: 80,
      palavraChave: "",
      simuladoCompleto: true,
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Simulado Personalizado</CardTitle>
          <CardDescription>
            Configure seu simulado de acordo com suas necessidades de estudo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área Jurídica</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma área" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px]">
                          {areasJuridicas.map((area) => (
                            <SelectItem key={area} value={area}>
                              {area}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subarea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temas Frequentes</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!selectedArea || availableSubareas.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um tema" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px]">
                          {availableSubareas.map((subarea) => (
                            <SelectItem key={subarea.name} value={subarea.name}>
                              <div className="flex items-center justify-between w-full">
                                <span>{subarea.name}</span>
                                <StarRating count={subarea.stars} />
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        As estrelas (★) indicam a frequência do tema em provas anteriores
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numQuestoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Questões</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a quantidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 5, 8, 10, 15, 20].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} questões
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Selecione a quantidade de questões para o seu simulado
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="palavraChave"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Palavra-chave (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: prescrição, usucapião, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Especifique um assunto para as questões
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">Iniciar Simulado Personalizado</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Simulado Completo da OAB</CardTitle>
          <CardDescription>
            Simulado com 80 questões seguindo o formato oficial do Exame de Ordem
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showFullSimuladoWarning ? (
            <div className="space-y-6">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Atenção: Alto Consumo de Tokens</AlertTitle>
                <AlertDescription>
                  Gerar um simulado completo com 80 questões irá consumir todos os seus tokens diários.
                  Você só poderá gerar outro simulado completo no dia seguinte.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setShowFullSimuladoWarning(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={startFullSimulado}>
                  Continuar Mesmo Assim
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleFullSimuladoClick}
            >
              Iniciar Simulado Completo (80 questões)
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimuladoConfigForm;
