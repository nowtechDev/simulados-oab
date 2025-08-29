
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type SimuladoFaseTipoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSimulado: (phase: string, category: string) => void;
  category: string;
};

const SimuladoFaseTipoDialog = ({
  open,
  onOpenChange,
  onCreateSimulado,
  category,
}: SimuladoFaseTipoDialogProps) => {
  const [selectedPhase, setSelectedPhase] = useState<string>("primeira");

  const handleConfirm = () => {
    onCreateSimulado(selectedPhase, category);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Escolha o tipo de simulado</DialogTitle>
          <DialogDescription>
            Selecione se deseja criar um simulado de primeira ou segunda fase.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <RadioGroup
            value={selectedPhase}
            onValueChange={setSelectedPhase}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent">
              <RadioGroupItem value="primeira" id="option-primeira" />
              <Label
                htmlFor="option-primeira"
                className="flex-grow cursor-pointer font-medium"
              >
                Primeira Fase
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent">
              <RadioGroupItem value="segunda" id="option-segunda" />
              <Label
                htmlFor="option-segunda"
                className="flex-grow cursor-pointer font-medium"
              >
                Segunda Fase
              </Label>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>Continuar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SimuladoFaseTipoDialog;
