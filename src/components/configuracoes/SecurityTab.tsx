
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key } from 'lucide-react';

interface PasswordInfo {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SecurityTabProps {
  passwordInfo: PasswordInfo;
  setPasswordInfo: (info: PasswordInfo) => void;
  onChangePassword: () => void;
  loading: boolean;
}

export const SecurityTab = ({ passwordInfo, setPasswordInfo, onChangePassword, loading }: SecurityTabProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Key className="h-5 w-5 text-[#4F1964]" />
        Alterar Senha
      </h2>
      
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="current-password">Senha atual</Label>
          <Input 
            id="current-password" 
            type="password" 
            value={passwordInfo.currentPassword} 
            onChange={(e) => setPasswordInfo({...passwordInfo, currentPassword: e.target.value})}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="new-password">Nova senha</Label>
          <Input 
            id="new-password" 
            type="password" 
            value={passwordInfo.newPassword} 
            onChange={(e) => setPasswordInfo({...passwordInfo, newPassword: e.target.value})}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="confirm-password">Confirmar nova senha</Label>
          <Input 
            id="confirm-password" 
            type="password" 
            value={passwordInfo.confirmPassword} 
            onChange={(e) => setPasswordInfo({...passwordInfo, confirmPassword: e.target.value})}
          />
        </div>
        
        <Button 
          className="w-full bg-[#4F1964] hover:bg-[#6B3182]" 
          onClick={onChangePassword}
          disabled={loading || !passwordInfo.currentPassword || !passwordInfo.newPassword || !passwordInfo.confirmPassword}
        >
          {loading ? 'Alterando...' : 'Alterar senha'}
        </Button>
      </div>
    </div>
  );
};
