
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormData {
  cpfCnpj: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
}

interface ExistingUserDataDisplayProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export const ExistingUserDataDisplay: React.FC<ExistingUserDataDisplayProps> = ({
  formData,
  updateFormData
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="cpfCnpj">CPF/CNPJ *</Label>
        <Input
          id="cpfCnpj"
          type="text"
          value={formData.cpfCnpj}
          onChange={(e) => updateFormData({ cpfCnpj: e.target.value })}
          required
          placeholder="Digite seu CPF ou CNPJ"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            required
            placeholder="Seu nome"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastname">Sobrenome *</Label>
          <Input
            id="lastname"
            type="text"
            value={formData.lastname}
            onChange={(e) => updateFormData({ lastname: e.target.value })}
            required
            placeholder="Seu sobrenome"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          required
          placeholder="seu@email.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone *</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => updateFormData({ phone: e.target.value })}
          required
          placeholder="(11) 99999-9999"
        />
      </div>
    </>
  );
};
