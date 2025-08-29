
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { FileDown, Filter, Key, Mail, Search, Users, PlusCircle, Trash2, FileUp, Eye, RefreshCw } from "lucide-react";

const AdminInstitucional = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  
  // Dados de exemplo
  const mockInstitutionalUsers = [
    { id: 1, nome: "Ana Silva", email: "ana.silva@email.com", dataRegistro: "2023-08-15", ultimoAcesso: "2023-09-01", status: "Ativo" },
    { id: 2, nome: "Lucas Mendes", email: "lucas.mendes@email.com", dataRegistro: "2023-07-20", ultimoAcesso: "2023-08-30", status: "Ativo" },
    { id: 3, nome: "Carolina Souza", email: "carolina.souza@email.com", dataRegistro: "2023-08-05", ultimoAcesso: "2023-08-28", status: "Inativo" },
    { id: 4, nome: "Marcelo Santos", email: "marcelo.santos@email.com", dataRegistro: "2023-06-10", ultimoAcesso: "2023-08-25", status: "Ativo" },
    { id: 5, nome: "Juliana Costa", email: "juliana.costa@email.com", dataRegistro: "2023-07-05", ultimoAcesso: "2023-08-20", status: "Ativo" },
  ];

  const filteredUsers = mockInstitutionalUsers.filter(user => 
    user.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleResetPassword = (userId: number) => {
    toast({
      title: "Senha resetada",
      description: `Um e-mail de redefinição de senha foi enviado para o usuário ID: ${userId}`,
    });
  };

  const handleAddUser = (email: string) => {
    toast({
      title: "Usuário adicionado",
      description: `Um convite foi enviado para ${email}`,
    });
  };

  const handleRemoveUser = (userId: number) => {
    toast({
      title: "Usuário removido",
      description: `O usuário ID: ${userId} foi removido com sucesso`,
    });
  };

  const handleImportUsers = () => {
    if (importFile) {
      toast({
        title: "Importação iniciada",
        description: `O arquivo ${importFile.name} está sendo processado`,
      });
      setIsImportDialogOpen(false);
      setImportFile(null);
    } else {
      toast({
        title: "Erro na importação",
        description: "Selecione um arquivo CSV para importar",
        variant: "destructive",
      });
    }
  };

  const handleExportUsers = () => {
    toast({
      title: "Exportação iniciada",
      description: "Os dados dos usuários estão sendo exportados em formato CSV",
    });
  };

  const handleChangeEmail = (userId: number, newEmail: string) => {
    toast({
      title: "E-mail alterado",
      description: `O e-mail do usuário ID: ${userId} foi alterado para ${newEmail}`,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#4F1964]">Administração Institucional</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os usuários da sua instituição e acompanhe o desempenho
          </p>
        </header>

        <Tabs defaultValue="usuarios" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="usuarios" className="flex items-center gap-2">
              <Users size={16} />
              <span>Usuários</span>
            </TabsTrigger>
            <TabsTrigger value="estatisticas" className="flex items-center gap-2">
              <RefreshCw size={16} />
              <span>Estatísticas</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="usuarios" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Usuários da Instituição</CardTitle>
                    <CardDescription>
                      Gerencie o acesso dos usuários à plataforma
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-[#4F1964]">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Adicionar Usuário
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                          <DialogDescription>
                            Insira o e-mail do usuário para enviar um convite.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input id="email" placeholder="usuario@exemplo.com" type="email" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={() => handleAddUser("novo.usuario@exemplo.com")}>
                            Enviar Convite
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      variant="outline" 
                      onClick={() => setIsImportDialogOpen(true)}
                    >
                      <FileUp className="mr-2 h-4 w-4" />
                      Importar CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar usuário..."
                      className="pl-10 w-full sm:w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Filtros</span>
                  </Button>
                </div>

                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead>Data de Registro</TableHead>
                        <TableHead>Último Acesso</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.nome}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.dataRegistro}</TableCell>
                          <TableCell>{user.ultimoAcesso}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={user.status === "Ativo" ? "default" : "outline"}
                              className={user.status === "Ativo" ? "bg-green-500" : ""}
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    title="Alterar e-mail"
                                  >
                                    <Mail className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Alterar E-mail do Usuário</DialogTitle>
                                    <DialogDescription>
                                      Modifique o endereço de e-mail de {user.nome}.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="current-email">E-mail atual</Label>
                                      <Input id="current-email" value={user.email} disabled />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="new-email">Novo e-mail</Label>
                                      <Input id="new-email" placeholder="Insira o novo e-mail" />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button onClick={() => handleChangeEmail(user.id, "novo.email@exemplo.com")}>
                                      Salvar alteração
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              <Button
                                variant="outline"
                                size="icon"
                                title="Redefinir senha"
                                onClick={() => handleResetPassword(user.id)}
                              >
                                <Key className="h-4 w-4" />
                              </Button>
                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    title="Ver detalhes"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Detalhes do Usuário</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">Nome</h4>
                                        <p>{user.nome}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">E-mail</h4>
                                        <p>{user.email}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">Data de Registro</h4>
                                        <p>{user.dataRegistro}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">Último Acesso</h4>
                                        <p>{user.ultimoAcesso}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                                        <p>{user.status}</p>
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    title="Remover usuário"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Remover Usuário</DialogTitle>
                                    <DialogDescription>
                                      Tem certeza que deseja remover {user.nome} da instituição?
                                      Esta ação não pode ser desfeita.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter className="mt-4">
                                    <Button variant="outline">Cancelar</Button>
                                    <Button 
                                      variant="destructive"
                                      onClick={() => handleRemoveUser(user.id)}
                                    >
                                      Remover
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredUsers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            Nenhum usuário encontrado
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  onClick={handleExportUsers}
                  className="ml-auto"
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Exportar Usuários (CSV)
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="estatisticas" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Total de Usuários</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">78</div>
                  <p className="text-xs text-muted-foreground mt-1">+12 nos últimos 30 dias</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Usuários Ativos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">65</div>
                  <p className="text-xs text-muted-foreground mt-1">83% de atividade</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Tokens Consumidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">120.450</div>
                  <p className="text-xs text-muted-foreground mt-1">+15.200 nos últimos 7 dias</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Atividade de Usuários</CardTitle>
                  <CardDescription>
                    Usuários mais ativos nos últimos 30 dias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockInstitutionalUsers.slice(0, 4).map((user, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{user.nome}</span>
                          <span className="text-sm text-muted-foreground">{85 - index * 12}% de utilização</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div 
                            className="bg-[#4F1964] h-2.5 rounded-full" 
                            style={{ width: `${85 - index * 12}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Uso de Recursos</CardTitle>
                  <CardDescription>
                    Recursos mais utilizados na plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Simulados</h4>
                        <span className="text-sm font-bold">65%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full w-[65%]"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Cadernos</h4>
                        <span className="text-sm font-bold">45%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full w-[45%]"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Assistente</h4>
                        <span className="text-sm font-bold">35%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-orange-500 h-2.5 rounded-full w-[35%]"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Segunda Fase</h4>
                        <span className="text-sm font-bold">25%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-purple-500 h-2.5 rounded-full w-[25%]"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog for importing users from CSV */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Usuários</DialogTitle>
            <DialogDescription>
              Faça o upload de um arquivo CSV com a lista de usuários para importar.
              O arquivo deve ter as colunas: nome, email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">Arquivo CSV</Label>
              <Input 
                id="csv-file" 
                type="file" 
                accept=".csv" 
                onChange={(e) => setImportFile(e.target.files ? e.target.files[0] : null)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Exemplo de formato do arquivo:</p>
              <pre className="mt-2 rounded bg-muted p-2 overflow-x-auto">
                nome,email<br/>
                João Silva,joao.silva@email.com<br/>
                Maria Santos,maria.santos@email.com
              </pre>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleImportUsers}>
              Importar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminInstitucional;
