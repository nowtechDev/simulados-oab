
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, Edit, Key, Eye, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { User } from '@/hooks/useAdminData';

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  searchQuery: string;
  onEditClick: (user: User) => void;
  onDeleteClick: (user: User) => void;
}

const UsersTable = ({ 
  users, 
  isLoading, 
  searchQuery, 
  onEditClick, 
  onDeleteClick 
}: UsersTableProps) => {
  const { toast } = useToast();
  
  // Add debug logging on mount and when users prop changes
  useEffect(() => {
    console.log("UsersTable: Component rendered with users:", users);
  }, []);

  useEffect(() => {
    console.log("UsersTable: Users prop updated:", users);
  }, [users]);
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Debug log for filtered users
  useEffect(() => {
    console.log("UsersTable: Filtered users:", filteredUsers.length);
  }, [filteredUsers]);
  
  const handleResetPassword = (userId: string) => {
    toast({
      title: "Senha resetada",
      description: `Um e-mail de redefinição de senha foi enviado para o usuário ID: ${userId}`,
    });
  };
  
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex justify-center items-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Carregando usuários...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : filteredUsers && filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name || "—"}</TableCell>
                <TableCell>{user.email || "—"}</TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  <div className={`w-fit p-1.5 rounded-md ${
                    user.type_user === 1 
                      ? "bg-[#4F1964]/10 text-[#4F1964]" 
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    <Shield className="h-4 w-4" />
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.disabled ? "destructive" : "outline"}>
                    {user.disabled ? "Inativo" : "Ativo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      title="Editar usuário"
                      onClick={() => onEditClick(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      title="Redefinir senha"
                      onClick={() => handleResetPassword(user.id)}
                    >
                      <Key className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      title="Ver detalhes"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="destructive"
                      size="icon"
                      title="Excluir usuário"
                      onClick={() => onDeleteClick(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                {searchQuery ? "Nenhum usuário encontrado com esse termo." : "Nenhum usuário cadastrado."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
