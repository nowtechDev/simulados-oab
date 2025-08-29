
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface InstitutionFormFieldsProps {
  nome: string;
  setNome: (value: string) => void;
  plano: string;
  setPlano: (value: string) => void;
  usuarios: number;
  setUsuarios: (value: number) => void;
  adminEmail: string;
  setAdminEmail: (value: string) => void;
  authError: string | null;
}

const InstitutionFormFields = ({
  nome,
  setNome,
  plano,
  setPlano,
  usuarios,
  setUsuarios,
  adminEmail,
  setAdminEmail,
  authError
}: InstitutionFormFieldsProps) => {
  return (
    <div className="space-y-4 py-4">
      {authError && (
        <div className="bg-destructive/15 p-3 rounded-md mb-4 text-destructive text-sm">
          {authError}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="nome">Nome da Instituição</Label>
        <Input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          placeholder="Nome da instituição"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="plano">Plano</Label>
        <Select value={plano} onValueChange={setPlano}>
          <SelectTrigger id="plano">
            <SelectValue placeholder="Selecione o plano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Básico">Básico</SelectItem>
            <SelectItem value="Premium">Premium</SelectItem>
            <SelectItem value="Enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="usuarios">Quantidade de Usuários</Label>
        <Input
          id="usuarios"
          type="number"
          min="0"
          value={usuarios}
          onChange={(e) => setUsuarios(parseInt(e.target.value) || 0)}
          placeholder="Quantidade de usuários"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="admin-email">Email do Administrador</Label>
        <Input
          id="admin-email"
          type="email"
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
          placeholder="Email do administrador da instituição"
        />
      </div>
    </div>
  );
};

export default InstitutionFormFields;
