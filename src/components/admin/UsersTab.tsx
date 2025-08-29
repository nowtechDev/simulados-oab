
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileDown, Search, UserPlus } from "lucide-react";
import UsersTable from "@/components/admin/UsersTable";
import { useToast } from "@/hooks/use-toast";
import { User } from '@/hooks/useAdminData';

interface UsersTabProps {
  users: User[];
  isLoadingUsers: boolean;
  openCreateDialog: () => void;
  openEditDialog: (user: User) => void;
  openDeleteDialog: (user: User) => void;
}

const UsersTab = ({ 
  users, 
  isLoadingUsers, 
  openCreateDialog, 
  openEditDialog, 
  openDeleteDialog 
}: UsersTabProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Add debug logging on mount and when users prop changes
  useEffect(() => {
    console.log("UsersTab: Component rendered with users:", users);
  }, []);

  useEffect(() => {
    console.log("UsersTab: Users prop updated:", users);
  }, [users]);

  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Os dados de usuários estão sendo exportados em formato CSV.",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>Todos os Usuários ({users.length})</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar usuário..."
                className="pl-10 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="default" 
              className="bg-[#4F1964] hover:bg-[#3D1052] flex items-center gap-2"
              onClick={openCreateDialog}
            >
              <UserPlus className="h-4 w-4" />
              <span>Novo Usuário</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <UsersTable 
          users={users} 
          isLoading={isLoadingUsers} 
          searchQuery={searchQuery}
          onEditClick={openEditDialog}
          onDeleteClick={openDeleteDialog}
        />
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={handleExportData} className="ml-auto">
          <FileDown className="mr-2 h-4 w-4" />
          Exportar Usuários (CSV)
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UsersTab;
