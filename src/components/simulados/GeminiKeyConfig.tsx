
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, AlertCircle, CheckCircle } from 'lucide-react';

interface GeminiKeyConfigProps {
  onKeyConfigured?: () => void;
}

const GeminiKeyConfig: React.FC<GeminiKeyConfigProps> = ({ onKeyConfigured }) => {
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini-api-key');
    if (savedKey) {
      setIsConfigured(true);
      setApiKey(savedKey);
    }
  }, []);

  const handleSaveKey = async () => {
    if (!apiKey.trim()) return;

    setIsValidating(true);
    
    try {
      // Validar a API key fazendo uma requisição simples
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: 'Teste de validação da API key'
                }
              ]
            }
          ]
        }),
      });

      if (response.ok || response.status === 400) {
        // 400 também pode ser válido (problema com o prompt, não com a key)
        localStorage.setItem('gemini-api-key', apiKey);
        setIsConfigured(true);
        setShowInput(false);
        onKeyConfigured?.();
      } else {
        throw new Error('API key inválida');
      }
    } catch (error) {
      console.error('Erro ao validar API key:', error);
      alert('API key inválida. Verifique se está correta.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveKey = () => {
    localStorage.removeItem('gemini-api-key');
    setIsConfigured(false);
    setApiKey('');
    setShowInput(false);
  };

  if (isConfigured && !showInput) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          API key do Gemini configurada com sucesso.{' '}
          <Button 
            variant="link" 
            className="h-auto p-0 text-green-600"
            onClick={() => setShowInput(true)}
          >
            Alterar
          </Button>
          {' | '}
          <Button 
            variant="link" 
            className="h-auto p-0 text-red-600"
            onClick={handleRemoveKey}
          >
            Remover
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-orange-800 flex items-center">
          <Key className="h-5 w-5 mr-2" />
          Configurar API Key do Gemini
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-orange-300 bg-orange-100">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            É necessário configurar sua API key do Google Gemini para gerar simulados personalizados.
            <br />
            <a 
              href="https://makersuite.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-600 underline hover:text-orange-700"
            >
              Obtenha sua API key aqui
            </a>
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <Label htmlFor="gemini-key" className="text-orange-800">
            API Key do Gemini
          </Label>
          <Input
            id="gemini-key"
            type="password"
            placeholder="Cole sua API key aqui..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="border-orange-300 focus:ring-orange-500"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleSaveKey}
            disabled={!apiKey.trim() || isValidating}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isValidating ? 'Validando...' : 'Salvar Configuração'}
          </Button>
          
          {showInput && (
            <Button 
              variant="outline" 
              onClick={() => {
                setShowInput(false);
                setApiKey(isConfigured ? localStorage.getItem('gemini-api-key') || '' : '');
              }}
              className="border-orange-300 text-orange-600"
            >
              Cancelar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GeminiKeyConfig;
