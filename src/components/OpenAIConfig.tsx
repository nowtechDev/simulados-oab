import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
interface OpenAIConfigProps {
  className?: string;
}
const OpenAIConfig = ({
  className
}: OpenAIConfigProps) => {
  const {
    toast
  } = useToast();
  // Pre-fill with the provided API key
  const [apiKey, setApiKey] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    // Always make sure the API key is set in localStorage when component mounts
    // const predefinedKey = "";
    const savedKey = localStorage.getItem('openai-api-key') || import.meta.env.VITE_OPENAI_API_KEY || "";
    setApiKey(savedKey);
  }, []);
  const handleSave = () => {
    // Validate and save the API key
    if (!apiKey.trim().startsWith('sk-')) {
      toast({
        title: "Chave API inválida",
        description: "A chave da API da OpenAI deve começar com 'sk-'",
        variant: "destructive"
      });
      return;
    }

    // Store the key in localStorage
    localStorage.setItem('openai-api-key', apiKey);

    // Show success message
    setIsOpen(false);
    toast({
      title: "Configuração salva",
      description: "Sua chave de API da OpenAI foi salva com sucesso."
    });
  };
  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#4F1964]">Configuração da OpenAI</DialogTitle>
          <DialogDescription>
            Configure sua chave de API da OpenAI para habilitar a assistência inteligente.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Chave da API da OpenAI</Label>
            <Input id="api-key" type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx" className="focus:border-[#4F1964] focus:ring-[#4F1964]" />
            <p className="text-xs text-muted-foreground">
              A chave será armazenada apenas no seu navegador e nunca será enviada para nossos servidores.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="outline" className="border-[#4F1964]/30 text-[#4F1964] hover:bg-[#F8E6FF]/50">
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!apiKey.trim().startsWith('sk-')} className="bg-[#4F1964] hover:bg-[#6B3182]">
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};
export default OpenAIConfig;