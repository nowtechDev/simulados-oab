
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface Institution {
  id: string;
  nome: string;
}

interface UserFormFieldsProps {
  mode: 'create' | 'edit';
  userName: string;
  setUserName: (name: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  userPassword: string;
  setUserPassword: (password: string) => void;
  userInstitutionId: string;
  setUserInstitutionId: (id: string) => void;
  userAdmin: boolean;
  setUserAdmin: (isAdmin: boolean) => void;
  userDisabled: boolean;
  setUserDisabled: (isDisabled: boolean) => void;
  institutions: Institution[];
  isLoadingInstitutions: boolean;
}

const UserFormFields = ({
  mode,
  userName,
  setUserName,
  userEmail,
  setUserEmail,
  userPassword,
  setUserPassword,
  userInstitutionId,
  setUserInstitutionId,
  userAdmin,
  setUserAdmin,
  userDisabled,
  setUserDisabled,
  institutions,
  isLoadingInstitutions
}: UserFormFieldsProps) => {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input 
          id="name" 
          placeholder="Nome do usuário" 
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="email@exemplo.com"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
      </div>
      
      {mode === 'create' && (
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input 
            id="password" 
            type="password" 
            placeholder="Senha para o usuário"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="institution">Instituição</Label>
        <Select 
          value={userInstitutionId} 
          onValueChange={setUserInstitutionId}
        >
          <SelectTrigger id="institution" className="w-full">
            <SelectValue placeholder="Selecione uma instituição" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhuma instituição</SelectItem>
            {institutions.map((institution) => (
              <SelectItem 
                key={institution.id} 
                value={institution.id}
              >
                {institution.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isLoadingInstitutions && (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="ml-2 text-sm text-muted-foreground">
              Carregando instituições...
            </span>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="admin" 
          checked={userAdmin}
          onCheckedChange={(checked) => setUserAdmin(checked === true)}
        />
        <Label htmlFor="admin" className="cursor-pointer">Usuário administrador</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="disabled" 
          checked={userDisabled}
          onCheckedChange={(checked) => setUserDisabled(checked === true)}
        />
        <Label htmlFor="disabled" className="cursor-pointer">Usuário inativo</Label>
      </div>
    </div>
  );
};

export default UserFormFields;
