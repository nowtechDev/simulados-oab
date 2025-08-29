
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, UserRound } from 'lucide-react';

interface UserInfo {
  name: string;
  email: string;
  phone: string;
}

interface ProfileTabProps {
  userInfo: UserInfo;
  setUserInfo: (info: UserInfo) => void;
  onUpdateProfile: () => void;
  loading: boolean;
}

export const ProfileTab = ({ userInfo, setUserInfo, onUpdateProfile, loading }: ProfileTabProps) => {
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <UserRound className="h-5 w-5 text-[#4F1964]" />
          Informações da Conta
        </h2>
        <Button 
          variant="outline" 
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? 'Cancelar' : 'Editar dados'}
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name" className="flex gap-2 items-center">
            <User className="h-4 w-4" /> Nome
          </Label>
          <Input 
            id="name" 
            value={userInfo.name} 
            onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
            disabled={!editMode}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="email" className="flex gap-2 items-center">
            <Mail className="h-4 w-4" /> E-mail
          </Label>
          <Input 
            id="email" 
            type="email" 
            value={userInfo.email} 
            onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
            disabled={!editMode}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="phone" className="flex gap-2 items-center">
            <Phone className="h-4 w-4" /> Telefone (opcional)
          </Label>
          <Input 
            id="phone" 
            value={userInfo.phone} 
            onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
            disabled={!editMode}
            placeholder="(00) 00000-0000"
          />
        </div>
        
        {editMode && (
          <Button 
            className="w-full bg-[#4F1964] hover:bg-[#6B3182]" 
            onClick={onUpdateProfile}
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        )}
      </div>
    </div>
  );
};
