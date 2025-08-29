
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Eye, Loader2 } from "lucide-react";
import { Institution } from "@/hooks/useAdminData";

interface InstitutionsTableProps {
  institutions: Institution[];
  isLoading: boolean;
  searchQuery: string;
  onEditClick: (institution: Institution) => void;
  onDeleteClick: (institution: Institution) => void;
}

const InstitutionsTable = ({ 
  institutions, 
  isLoading,
  searchQuery,
  onEditClick,
  onDeleteClick
}: InstitutionsTableProps) => {
  
  // Add debug logging on mount and when institutions prop changes
  useEffect(() => {
    console.log("InstitutionsTable: Component rendered with institutions:", institutions);
  }, []);

  useEffect(() => {
    console.log("InstitutionsTable: Institutions prop updated:", institutions);
  }, [institutions]);

  // Filter institutions based on search query
  const filteredInstitutions = institutions.filter(institution => 
    (institution.nome && institution.nome.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (institution.admin_email && institution.admin_email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Debug log for filtered institutions
  useEffect(() => {
    console.log("InstitutionsTable: Filtered institutions:", filteredInstitutions.length);
  }, [filteredInstitutions]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Carregando instituições...</span>
      </div>
    );
  }

  if (institutions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhuma instituição encontrada.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome da Instituição</TableHead>
            <TableHead>Qtd. Usuários</TableHead>
            <TableHead>Plano</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInstitutions.length > 0 ? (
            filteredInstitutions.map((institution) => (
              <TableRow key={institution.id}>
                <TableCell className="font-medium">{institution.nome}</TableCell>
                <TableCell>{institution.usuarios}</TableCell>
                <TableCell>
                  <Select defaultValue={institution.plano || "Básico"}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Selecionar plano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Básico">Básico</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{institution.admin_email}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-8"
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          Alterar Admin
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Alterar Administrador Institucional</DialogTitle>
                          <DialogDescription>
                            Altere o e-mail do administrador para a instituição {institution.nome}.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-admin">E-mail atual do administrador</Label>
                            <Input id="current-admin" value={institution.admin_email || ''} disabled />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-admin">Novo e-mail do administrador</Label>
                            <Input id="new-admin" placeholder="Insira o e-mail do novo administrador" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button>Salvar alteração</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => onEditClick(institution)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Detalhes
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                Nenhuma instituição encontrada para "{searchQuery}".
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InstitutionsTable;
