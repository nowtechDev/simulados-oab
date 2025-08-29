import React, { useState, useEffect } from 'react';
import { Send, Sparkles, Loader2, Download, Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { generateCompletion } from '@/services/openaiCadernos';
import { Anotacao } from '@/types/caderno';
import { adicionarAnotacao, atualizarAnotacaoIA } from '@/services/cadernoService';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';

interface EditorAnotacaoProps {
  cadernoId: number;
  cadernoTitulo: string;
  anotacaoAtual: Anotacao | null;
  onAnotacaoSalva: (anotacao: Anotacao) => void;
  onExport?: () => void;
}

const EditorAnotacao = ({ 
  cadernoId, 
  cadernoTitulo, 
  anotacaoAtual,
  onAnotacaoSalva,
  onExport
}: EditorAnotacaoProps) => {
  const { toast } = useToast();
  const [conteudo, setConteudo] = useState(anotacaoAtual?.conteudo || '');
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState<string>(anotacaoAtual?.iaAprimorado ? 'visualizar' : 'editar');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showProcessingDialog, setShowProcessingDialog] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingMessage, setProcessingMessage] = useState('');

  useEffect(() => {
    setConteudo(anotacaoAtual?.conteudo || '');
    if (anotacaoAtual?.iaAprimorado) {
      setTab('visualizar');
    }
  }, [anotacaoAtual]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showProcessingDialog && processingProgress < 100) {
      timer = setInterval(() => {
        setProcessingProgress((prev) => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            clearInterval(timer);
          }
          return newProgress;
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [showProcessingDialog, processingProgress]);

  useEffect(() => {
    if (processingProgress < 30) {
      setProcessingMessage('Analisando o conteúdo jurídico...');
    } else if (processingProgress < 60) {
      setProcessingMessage('Integrando conhecimentos jurídicos relevantes...');
    } else if (processingProgress < 90) {
      setProcessingMessage('Aprimorando a estrutura do documento...');
    } else {
      setProcessingMessage('Finalizando o documento aprimorado...');
    }
  }, [processingProgress]);

  useEffect(() => {
    const handleExportEvent = (event: CustomEvent) => {
      if (event.detail && event.detail.anotacaoId === anotacaoAtual?.id) {
        handleExportar();
      }
    };
    
    window.addEventListener('exportanotacao', handleExportEvent as EventListener);
    return () => {
      window.removeEventListener('exportanotacao', handleExportEvent as EventListener);
    };
  }, [anotacaoAtual]);

  const handleSalvar = async () => {
    if (!conteudo.trim()) {
      toast({
        title: "Conteúdo vazio",
        description: "Por favor, escreva algo antes de salvar.",
        variant: "destructive"
      });
      return;
    }

    try {
      let anotacao: Anotacao;
      
      if (anotacaoAtual) {
        anotacao = adicionarAnotacao(cadernoId, conteudo);
      } else {
        anotacao = adicionarAnotacao(cadernoId, conteudo);
      }
      
      toast({
        title: "Anotação salva",
        description: "Sua anotação foi salva com sucesso."
      });
      
      onAnotacaoSalva(anotacao);
    } catch (error) {
      console.error("Erro ao salvar anotação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a anotação. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleAtivarIA = async () => {
    if (!conteudo.trim()) {
      toast({
        title: "Conteúdo vazio",
        description: "Por favor, escreva algo antes de ativar a IA.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setShowProcessingDialog(true);
    setProcessingProgress(0);

    try {
      let anotacao = anotacaoAtual;
      if (!anotacao) {
        anotacao = adicionarAnotacao(cadernoId, conteudo);
        onAnotacaoSalva(anotacao);
      }

      const prompt = `Você é um professor e assistente acadêmico com expertise em Direito.
Quero que você aprofunde e melhore as seguintes anotações sobre ${cadernoTitulo}, adicionando:
1. Conceitos jurídicos relevantes
2. Referências a artigos de leis importantes 
3. Exemplos práticos ou casos relevantes
4. Conexões com outros temas do Direito quando pertinente
5. Mantenha o formato Markdown para melhor organização

Anotações originais:
${conteudo}

Responda apenas com o conteúdo aprimorado, sem introduções ou comentários adicionais.`;

      const resultado = await generateCompletion({
        prompt,
        context: `Aprimoramento de anotações jurídicas para o caderno "${cadernoTitulo}"`
      });

      if (resultado.isError) {
        throw new Error(resultado.content);
      }

      const anotacaoAtualizada = atualizarAnotacaoIA(cadernoId, anotacao.id, resultado.content);
      
      toast({
        title: "Conteúdo aprimorado",
        description: "A IA aprimorou seu conteúdo com sucesso."
      });

      onAnotacaoSalva(anotacaoAtualizada);
      setTab('visualizar');
    } catch (error) {
      console.error("Erro ao ativar IA:", error);
      toast({
        title: "Erro",
        description: "Não foi possível ativar a IA. Verifique sua conexão e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setShowProcessingDialog(false);
        setProcessingProgress(0);
      }, 500);
    }
  };

  const handleExportar = () => {
    const conteudoFinal = anotacaoAtual?.iaAprimorado || conteudo;
    if (!conteudoFinal) {
      toast({
        title: "Nada para exportar",
        description: "Por favor, crie conteúdo antes de exportar.",
        variant: "destructive"
      });
      return;
    }

    const cleanContent = conteudoFinal.replace(/\*\*/g, '').replace(/\*/g, '');

    const paragraphs: Paragraph[] = cleanContent.split('\n').map(line => {
      let fontSize = 24;
      let bold = false;
      
      if (line.startsWith('# ')) {
        line = line.substring(2);
        fontSize = 32;
        bold = true;
      } else if (line.startsWith('## ')) {
        line = line.substring(3);
        fontSize = 28;
        bold = true;
      } else if (line.startsWith('### ')) {
        line = line.substring(4);
        fontSize = 26;
        bold = true;
      } else if (line.startsWith('* ') || line.startsWith('- ') || /^\d+\.\s/.test(line)) {
        line = '• ' + line.replace(/^[*\-\d]+\.?\s/, '');
      }

      return new Paragraph({
        children: [
          new TextRun({
            text: line,
            bold: bold,
            size: fontSize,
            font: "Century Gothic"
          })
        ]
      });
    });

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: cadernoTitulo,
                bold: true,
                size: 36,
                font: "Century Gothic"
              })
            ],
            alignment: AlignmentType.CENTER
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Criado em: ${new Date().toLocaleDateString('pt-BR')}`,
                size: 24,
                font: "Century Gothic",
                italics: true
              })
            ],
            alignment: AlignmentType.CENTER
          }),
          new Paragraph({
            text: "",
          }),
          ...paragraphs
        ]
      }]
    });

    Packer.toBlob(doc).then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cadernoTitulo}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Exportação concluída",
        description: "Seu caderno foi exportado com sucesso."
      });
      
      setShowSuccessDialog(false);
    });
  };

  const renderMarkdown = (texto: string) => {
    const formattedText = texto
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold my-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold my-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold my-2">$1</h3>')
      .replace(/^\* (.*$)/gm, '<li class="ml-6 list-disc">$1</li>')
      .replace(/^- (.*$)/gm, '<li class="ml-6 list-disc">$1</li>')
      .replace(/^([0-9]+)\. (.*$)/gm, '<li class="ml-6 list-decimal">$2</li>')
      .replace(/\*\*(.*)\*\*/gm, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gm, '<em>$1</em>')
      .replace(/^> (.*$)/gm, '<blockquote class="pl-4 border-l-4 border-gray-300 italic my-2">$1</blockquote>')
      .replace(/\[(.*)\]\((.*)\)/gm, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
      .replace(/\n\n/gm, '</p><p class="my-2">');
    
    return `<p class="my-2">${formattedText}</p>`;
  };

  return (
    <div className="flex flex-col h-full">
      <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="editar" className="flex items-center">
            <Send className="w-4 h-4 mr-2" />
            Escrever
          </TabsTrigger>
          <TabsTrigger 
            value="visualizar" 
            disabled={!anotacaoAtual?.iaAprimorado}
            className="flex items-center"
          >
            <Check className="w-4 h-4 mr-2" />
            Visualizar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editar" className="flex-1 flex flex-col">
          <Textarea
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            placeholder="Digite o rascunho de sua aula aqui! O Menthor faz o resto. Após isso, se preferir, pode exportar para o Word."
            className="flex-1 min-h-[300px] resize-none p-4 mb-4 font-mono"
            disabled={isLoading}
          />

          <div className="flex justify-center">
            <Button 
              onClick={handleAtivarIA} 
              disabled={isLoading || !conteudo.trim()}
              className="bg-[#4F1964] hover:bg-[#6B3182] w-full py-6"
            >
              <div className="flex items-center">
                <Sparkles className="w-6 h-6 mr-2" />
                <span className="text-lg">Deixe o Menthor melhorar suas anotações!</span>
              </div>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="visualizar" className="flex-1">
          {anotacaoAtual?.iaAprimorado && (
            <Card className="h-full overflow-y-auto">
              <CardContent className="p-6">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: renderMarkdown(anotacaoAtual.iaAprimorado) 
                  }} 
                  className="prose prose-slate max-w-none"
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={showProcessingDialog} onOpenChange={setShowProcessingDialog}>
        <DialogContent className="sm:max-w-md bg-white rounded-lg p-6">
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-24 h-24 mb-4 flex items-center justify-center">
              <div className="text-7xl text-[#4F1964] animate-pulse">
                ♖
              </div>
            </div>
            <DialogTitle className="text-2xl font-semibold text-[#4F1964] mb-2 text-center">
              Menthor trabalhando...
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 mb-4">
              {processingMessage}
            </DialogDescription>
            <Progress value={processingProgress} className="w-full h-2 bg-gray-200 mb-2" />
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-[#4F1964]">
              Exportação Concluída com Sucesso!
            </DialogTitle>
            <DialogDescription className="text-center">
              Seu caderno foi salvo e está pronto para utilização.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-4">
            <Check className="w-16 h-16 text-green-500" />
          </div>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={handleExportar}
              className="bg-[#4F1964] hover:bg-[#6B3182]"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Caderno (.docx)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditorAnotacao;
