
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Languages, Sun, Moon } from 'lucide-react';

interface Preferences {
  language: string;
  theme: string;
  emailNotifications: boolean;
}

interface PreferencesTabProps {
  preferences: Preferences;
  setPreferences: (prefs: Preferences) => void;
  onUpdatePreferences: () => void;
  loading: boolean;
}

export const PreferencesTab = ({ preferences, setPreferences, onUpdatePreferences, loading }: PreferencesTabProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Languages className="h-5 w-5 text-[#4F1964]" />
        Preferências
      </h2>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Idioma</Label>
          <RadioGroup 
            value={preferences.language}
            onValueChange={(value) => setPreferences({...preferences, language: value})}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pt" id="pt" />
              <Label htmlFor="pt">Português</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="en" id="en" />
              <Label htmlFor="en">Inglês</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <Label>Tema</Label>
          <RadioGroup 
            value={preferences.theme}
            onValueChange={(value) => setPreferences({...preferences, theme: value})}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light" className="flex items-center gap-2">
                <Sun className="h-4 w-4" /> Claro
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark" className="flex items-center gap-2">
                <Moon className="h-4 w-4" /> Escuro
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications">Notificações por e-mail</Label>
            <p className="text-sm text-muted-foreground">
              Receba e-mails sobre atualizações e novidades
            </p>
          </div>
          <Switch 
            id="notifications"
            checked={preferences.emailNotifications}
            onCheckedChange={(checked) => setPreferences({...preferences, emailNotifications: checked})}
          />
        </div>
        
        <Button 
          className="w-full bg-[#4F1964] hover:bg-[#6B3182]" 
          onClick={onUpdatePreferences}
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar preferências'}
        </Button>
      </div>
    </div>
  );
};
