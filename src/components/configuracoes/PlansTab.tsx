
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { usePlans } from '@/hooks/usePlans';
import { PlanDialog } from './PlanDialog';
import { DeletePlanDialog } from './DeletePlanDialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Plan } from '@/hooks/usePlans';

export const PlansTab = () => {
  const { data: plans, isLoading, refetch } = usePlans();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsDialogOpen(true);
  };

  const handleDelete = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedPlan(null);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPlan) return;
    
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', selectedPlan.id);

      if (error) {
        console.error('Erro ao deletar plano:', error);
        toast({
          title: "Erro",
          description: "Não foi possível deletar o plano",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Plano deletado",
        description: "O plano foi removido com sucesso",
      });

      refetch();
      setIsDeleteDialogOpen(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error('Erro ao deletar plano:', error);
      toast({
        title: "Erro",
        description: "Não foi possível deletar o plano",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Planos</CardTitle>
          <CardDescription>Carregando planos...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gerenciar Planos</CardTitle>
              <CardDescription>
                Visualize, crie, edite e remova planos de assinatura
              </CardDescription>
            </div>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Plano
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Ciclo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Popular</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans?.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{plan.display_name}</div>
                      <div className="text-sm text-muted-foreground">{plan.slug}</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(plan.price)}</TableCell>
                  <TableCell className="capitalize">{plan.billing_cycle}</TableCell>
                  <TableCell>
                    <Badge variant={plan.active ? "default" : "secondary"}>
                      {plan.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {plan.is_popular && <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(plan)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(plan)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {!plans || plans.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum plano encontrado. Crie seu primeiro plano!
            </div>
          )}
        </CardContent>
      </Card>

      <PlanDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        plan={selectedPlan}
        onSuccess={() => {
          refetch();
          setIsDialogOpen(false);
          setSelectedPlan(null);
        }}
      />

      <DeletePlanDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        plan={selectedPlan}
        onConfirm={confirmDelete}
        loading={actionLoading}
      />
    </>
  );
};
