
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

interface ExistingUserLoginFormProps {
  email: string;
  onLogin: (password: string) => void;
  onBackToEmail: () => void;
  isLoading: boolean;
  loginError: string;
}

export const ExistingUserLoginForm: React.FC<ExistingUserLoginFormProps> = ({
  email,
  onLogin,
  onBackToEmail,
  isLoading,
  loginError
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bem-vindo de volta!</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            Você já é nosso cliente! Digite sua senha para continuar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-display">E-mail</Label>
            <Input
              id="email-display"
              type="email"
              value={email}
              disabled
              className="bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Digite sua senha"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {loginError && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <p className="text-red-800 text-sm">{loginError}</p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button 
              type="submit" 
              className="w-full bg-[#4F1964] hover:bg-[#6B3182]"
              disabled={isLoading || !password}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
            
            <div className="text-center">
              <a 
                href="/forgot-password" 
                className="text-sm text-[#4F1964] hover:underline"
              >
                Esqueci minha senha
              </a>
            </div>
            
            <Button 
              type="button"
              variant="outline"
              onClick={onBackToEmail}
              className="w-full"
            >
              Voltar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
