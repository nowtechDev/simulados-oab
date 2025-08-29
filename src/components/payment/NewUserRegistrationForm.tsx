
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { ExistingUserDataDisplay } from './ExistingUserDataDisplay';

interface FormData {
  cpfCnpj: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
}

interface NewUserRegistrationFormProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}

export const NewUserRegistrationForm: React.FC<NewUserRegistrationFormProps> = ({
  formData,
  updateFormData,
  showPassword,
  setShowPassword
}) => {
  return (
    <>
      <ExistingUserDataDisplay 
        formData={formData}
        updateFormData={updateFormData}
      />

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => updateFormData({ password: e.target.value })}
            required
            placeholder="Crie uma senha segura"
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
    </>
  );
};
