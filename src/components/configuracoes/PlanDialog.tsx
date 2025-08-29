
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Plan } from '@/hooks/usePlans';

const formSchema = z.object({
  slug: z.string().min(1, 'Slug é obrigatório'),
  display_name: z.string().min(1, 'Nome de exibição é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  price: z.number().min(0, 'Preço deve ser maior ou igual a 0'),
  billing_cycle: z.enum(['mensal', 'anual', 'vitalicio']),
  benefits: z.string().min(1, 'Benefícios são obrigatórios'),
  is_popular: z.boolean().default(false),
  color_theme: z.string().min(1, 'Tema de cor é obrigatório'),
  active: z.boolean().default(true),
  sort_order: z.number().min(0).default(0),
});

type FormData = z.infer<typeof formSchema>;

interface PlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: Plan | null;
  onSuccess: () => void;
}

export const PlanDialog: React.FC<PlanDialogProps> = ({
  open,
  onOpenChange,
  plan,
  onSuccess,
}) => {
  const { toast } = useToast();
  const isEditing = !!plan;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: '',
      display_name: '',
      name: '',
      description: '',
      price: 0,
      billing_cycle: 'mensal',
      benefits: '',
      is_popular: false,
      color_theme: '#4F1964',
      active: true,
      sort_order: 0,
    },
  });

  useEffect(() => {
    if (plan) {
      const benefitsString = Array.isArray(plan.benefits) 
        ? plan.benefits.join('\n') 
        : '';
      
      form.reset({
        slug: plan.slug || '',
        display_name: plan.display_name || '',
        name: plan.name || '',
        description: plan.description || '',
        price: plan.price || 0,
        billing_cycle: plan.billing_cycle as 'mensal' | 'anual' | 'vitalicio' || 'mensal',
        benefits: benefitsString,
        is_popular: plan.is_popular || false,
        color_theme: plan.color_theme || '#4F1964',
        active: plan.active ?? true,
        sort_order: plan.sort_order || 0,
      });
    } else {
      form.reset({
        slug: '',
        display_name: '',
        name: '',
        description: '',
        price: 0,
        billing_cycle: 'mensal',
        benefits: '',
        is_popular: false,
        color_theme: '#4F1964',
        active: true,
        sort_order: 0,
      });
    }
  }, [plan, form]);

  const onSubmit = async (data: FormData) => {
    try {
      // Converter benefits de string para array
      const benefitsArray = data.benefits.split('\n').filter(benefit => benefit.trim() !== '');
      
      // Calcular value em centavos
      const valueInCents = Math.round(data.price * 100);

      const planData = {
        slug: data.slug,
        display_name: data.display_name,
        name: data.name,
        description: data.description,
        price: data.price,
        value: valueInCents,
        billing_cycle: data.billing_cycle,
        benefits: benefitsArray,
        is_popular: data.is_popular,
        color_theme: data.color_theme,
        active: data.active,
        sort_order: data.sort_order,
      };

      let error;
      
      if (isEditing) {
        const result = await supabase
          .from('plans')
          .update(planData)
          .eq('id', plan.id);
        error = result.error;
      } else {
        const result = await supabase
          .from('plans')
          .insert(planData);
        error = result.error;
      }

      if (error) {
        console.error('Erro ao salvar plano:', error);
        toast({
          title: "Erro",
          description: `Não foi possível ${isEditing ? 'atualizar' : 'criar'} o plano`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: `Plano ${isEditing ? 'atualizado' : 'criado'}`,
        description: `O plano foi ${isEditing ? 'atualizado' : 'criado'} com sucesso`,
      });

      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar plano:', error);
      toast({
        title: "Erro",
        description: `Não foi possível ${isEditing ? 'atualizar' : 'criar'} o plano`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Plano' : 'Criar Novo Plano'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Altere as informações do plano abaixo.' : 'Preencha as informações para criar um novo plano.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="plano-basico" {...field} />
                    </FormControl>
                    <FormDescription>
                      Identificador único para URLs (sem espaços)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="display_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome de Exibição</FormLabel>
                    <FormControl>
                      <Input placeholder="Plano Básico" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do plano" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descrição detalhada do plano" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        placeholder="59.90" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billing_cycle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciclo de Cobrança</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o ciclo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mensal">Mensal</SelectItem>
                        <SelectItem value="anual">Anual</SelectItem>
                        <SelectItem value="vitalicio">Vitalício</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefícios</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Digite um benefício por linha..."
                      rows={5}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Digite um benefício por linha
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="color_theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor do Tema</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sort_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordem de Exibição</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="is_popular"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Plano Popular</FormLabel>
                      <FormDescription>
                        Destacar este plano como popular
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Ativo</FormLabel>
                      <FormDescription>
                        Plano disponível para assinatura
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? 'Atualizar' : 'Criar'} Plano
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
