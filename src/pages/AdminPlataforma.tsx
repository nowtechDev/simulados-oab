
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Building2, Users } from "lucide-react";

// Import component tabs
import DashboardTab from '@/components/admin/DashboardTab';
import UsersTab from '@/components/admin/UsersTab';
import InstitutionsTab from '@/components/admin/InstitutionsTab';

// Import dialogs
import UserDialog from "@/components/admin/user-dialog";
import DeleteConfirmationDialog from "@/components/admin/DeleteConfirmationDialog";
import InstitutionDialog from "@/components/admin/InstitutionDialog";
import DeleteInstitutionDialog from "@/components/admin/DeleteInstitutionDialog";

// Import custom hook
import { useAdminData, User, Institution } from '@/hooks/useAdminData';

const AdminPlataforma = () => {
  // Use our custom hook for data and authentication
  const { 
    users, 
    institutions,
    isLoadingUsers, 
    isLoadingInstitutions,
    currentAuthStatus, 
    userStats, 
    fetchUsers,
    fetchInstitutions
  } = useAdminData();
  
  // User dialog states
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Institution dialog states
  const [isCreateInstitutionDialogOpen, setIsCreateInstitutionDialogOpen] = useState(false);
  const [isEditInstitutionDialogOpen, setIsEditInstitutionDialogOpen] = useState(false);
  const [isDeleteInstitutionDialogOpen, setIsDeleteInstitutionDialogOpen] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);

  // Sample data for tokens usage chart in dashboard
  const mockTokensUsage = [
    { instituicao: "Universidade Federal", tokens: 145200, percentualDoTotal: 40 },
    { instituicao: "Faculdade Estadual", tokens: 89600, percentualDoTotal: 25 },
    { instituicao: "Escritório Jurídico", tokens: 72400, percentualDoTotal: 20 },
    { instituicao: "Faculdade Privada", tokens: 54300, percentualDoTotal: 15 },
  ];

  // Add debug logging
  useEffect(() => {
    console.log("AdminPlataforma: users received from useAdminData:", users.length, "users");
    console.log("AdminPlataforma: institutions received from useAdminData:", institutions.length, "institutions");
  }, [users, institutions]);

  // User dialog handlers
  const openCreateUserDialog = () => {
    setIsCreateUserDialogOpen(true);
  };

  const openEditUserDialog = (user: User) => {
    setSelectedUser(user);
    setIsEditUserDialogOpen(true);
  };

  const openDeleteUserDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteUserDialogOpen(true);
  };
  
  // Institution dialog handlers
  const openCreateInstitutionDialog = () => {
    setIsCreateInstitutionDialogOpen(true);
  };

  const openEditInstitutionDialog = (institution: Institution) => {
    setSelectedInstitution(institution);
    setIsEditInstitutionDialogOpen(true);
  };

  const openDeleteInstitutionDialog = (institution: Institution) => {
    setSelectedInstitution(institution);
    setIsDeleteInstitutionDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#4F1964]">Administração da Plataforma</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie todos os usuários, instituições e acompanhe métricas da plataforma
        </p>
        {currentAuthStatus && (
          <div className="mt-2 text-sm bg-slate-100 p-2 rounded-md">
            <p>Status de autenticação: <strong>{currentAuthStatus.isAuthenticated ? 'Autenticado' : 'Não autenticado'}</strong></p>
            {currentAuthStatus.user && (
              <p>Email: <strong>{currentAuthStatus.user.email}</strong></p>
            )}
          </div>
        )}
      </header>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <PieChart size={16} />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="flex items-center gap-2">
            <Users size={16} />
            <span>Usuários</span>
          </TabsTrigger>
          <TabsTrigger value="instituicoes" className="flex items-center gap-2">
            <Building2 size={16} />
            <span>Instituições</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DashboardTab 
            userStats={userStats}
            tokensUsage={mockTokensUsage}
          />
        </TabsContent>

        <TabsContent value="usuarios">
          <UsersTab 
            users={users}
            isLoadingUsers={isLoadingUsers}
            openCreateDialog={openCreateUserDialog}
            openEditDialog={openEditUserDialog}
            openDeleteDialog={openDeleteUserDialog}
          />
        </TabsContent>

        <TabsContent value="instituicoes">
          <InstitutionsTab 
            institutions={institutions}
            isLoadingInstitutions={isLoadingInstitutions}
            openCreateDialog={openCreateInstitutionDialog}
            openEditDialog={openEditInstitutionDialog}
            openDeleteDialog={openDeleteInstitutionDialog}
          />
        </TabsContent>
      </Tabs>

      {/* User Dialogs */}
      <UserDialog 
        isOpen={isCreateUserDialogOpen} 
        setIsOpen={setIsCreateUserDialogOpen}
        mode="create"
        selectedUser={null}
        onSuccess={fetchUsers}
      />

      <UserDialog 
        isOpen={isEditUserDialogOpen} 
        setIsOpen={setIsEditUserDialogOpen}
        mode="edit"
        selectedUser={selectedUser}
        onSuccess={fetchUsers}
      />

      <DeleteConfirmationDialog 
        isOpen={isDeleteUserDialogOpen}
        setIsOpen={setIsDeleteUserDialogOpen}
        selectedUser={selectedUser}
        onSuccess={fetchUsers}
      />

      {/* Institution Dialogs */}
      <InstitutionDialog 
        isOpen={isCreateInstitutionDialogOpen} 
        setIsOpen={setIsCreateInstitutionDialogOpen}
        mode="create"
        selectedInstitution={null}
        onSuccess={fetchInstitutions}
      />

      <InstitutionDialog 
        isOpen={isEditInstitutionDialogOpen} 
        setIsOpen={setIsEditInstitutionDialogOpen}
        mode="edit"
        selectedInstitution={selectedInstitution}
        onSuccess={fetchInstitutions}
      />

      <DeleteInstitutionDialog 
        isOpen={isDeleteInstitutionDialogOpen}
        setIsOpen={setIsDeleteInstitutionDialogOpen}
        selectedInstitution={selectedInstitution}
        onSuccess={fetchInstitutions}
      />
    </div>
  );
};

export default AdminPlataforma;
