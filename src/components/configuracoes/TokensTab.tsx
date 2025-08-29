
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Shield, Trash2 } from 'lucide-react';

interface Token {
  id: string;
  nome_ia: string;
  token: string;
  created_at: string;
}

interface NewToken {
  nome_ia: string;
  token: string;
}

interface TokensTabProps {
  tokens: Token[];
  newToken: NewToken;
  setNewToken: (token: NewToken) => void;
  onAddToken: () => void;
  onDeleteToken: (tokenId: string) => void;
  tokenLoading: boolean;
}

export const TokensTab = ({ tokens, newToken, setNewToken, onAddToken, onDeleteToken, tokenLoading }: TokensTabProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Shield className="h-5 w-5 text-[#4F1964]" />
        Tokens de IA
      </h2>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Adicionar Novo Token</h3>
          
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nome-ia">Nome da IA</Label>
              <Input 
                id="nome-ia" 
                value={newToken.nome_ia} 
                onChange={(e) => setNewToken({...newToken, nome_ia: e.target.value})}
                placeholder="Ex: OpenAI, Claude, etc."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="token-valor">Token</Label>
              <Input 
                id="token-valor" 
                type="password" 
                value={newToken.token} 
                onChange={(e) => setNewToken({...newToken, token: e.target.value})}
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
              />
              <p className="text-xs text-muted-foreground">
                Os tokens são armazenados de forma criptografada e somente você terá acesso a eles.
              </p>
            </div>
            
            <Button 
              className="w-full bg-[#4F1964] hover:bg-[#6B3182] mt-2" 
              onClick={onAddToken}
              disabled={tokenLoading}
            >
              {tokenLoading ? 'Salvando...' : 'Adicionar token'}
            </Button>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Tokens Salvos</h3>
          
          {tokens.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>Você ainda não adicionou nenhum token.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tokens.map((token) => (
                <div key={token.id} className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <p className="font-medium">{token.nome_ia}</p>
                    <p className="text-sm text-muted-foreground">
                      Token: ••••••••••••••••••
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Adicionado em {new Date(token.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteToken(token.id)}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
