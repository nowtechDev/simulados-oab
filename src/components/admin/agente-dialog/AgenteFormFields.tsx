
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AgenteFormData } from './index';

interface AgenteFormFieldsProps {
  control: Control<AgenteFormData>;
}

const PROVEDORES_IA = [
  { value: 'Gemini', label: 'Gemini' },
  { value: 'OpenAI', label: 'OpenAI' },
  { value: 'DeepSeek', label: 'DeepSeek' },
  { value: 'Grok', label: 'Grok' },
  { value: 'Claude', label: 'Claude' },
];

const AgenteFormFields: React.FC<AgenteFormFieldsProps> = ({ control }) => {
  return (
    <>
      <FormField
        control={control}
        name="nome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Agente</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Assistente de Direito Civil" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="prompt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prompt do Sistema</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descreva como o agente deve se comportar..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="ia_provider"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Provedor de IA</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o provedor" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {PROVEDORES_IA.map((provedor) => (
                  <SelectItem key={provedor.value} value={provedor.value}>
                    {provedor.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="versao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Modelo/Versão</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ex: gemini-1.5-flash, gpt-4o-mini, claude-3-sonnet-20240229"
                {...field} 
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
            <p className="text-xs text-muted-foreground">
              Especifique o modelo exato a ser usado (opcional)
            </p>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="token_agente"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Token do Agente</FormLabel>
            <FormControl>
              <Input 
                placeholder="Insira o token de acesso da IA"
                type="password"
                {...field} 
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
            <p className="text-xs text-muted-foreground">
              Token de acesso para comunicação com o provedor de IA selecionado
            </p>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="ativo"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <FormLabel>Agente Ativo</FormLabel>
              <div className="text-sm text-muted-foreground">
                Determina se o agente está disponível para uso
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default AgenteFormFields;
