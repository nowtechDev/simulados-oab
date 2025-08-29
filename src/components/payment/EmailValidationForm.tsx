
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EmailValidationFormProps {
  onEmailSubmit: (email: string) => void;
  isLoading: boolean;
}

export const EmailValidationForm: React.FC<EmailValidationFormProps> = ({
  onEmailSubmit,
  isLoading
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEmailSubmit(email);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contratar Plano</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Digite seu e-mail"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#4F1964] hover:bg-[#6B3182]"
            disabled={isLoading || !email}
          >
            {isLoading ? 'Verificando...' : 'Continuar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
