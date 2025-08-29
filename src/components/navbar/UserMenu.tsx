
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserMenuProps {
  userEmail: string;
  userType: number | null;
}

export const UserMenu = ({ userEmail, userType }: UserMenuProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get user initials for the avatar
  const getUserInitials = () => {
    if (!userEmail || typeof userEmail !== 'string') return 'U';
    
    const emailPart = userEmail.split('@')[0];
    if (!emailPart) return 'U';
    
    const parts = emailPart.split('.');
    if (parts.length > 1 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    
    return emailPart[0] ? emailPart[0].toUpperCase() : 'U';
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      
      // Clear localStorage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userType');
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso"
      });
      
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Erro ao realizar logout",
        description: "Ocorreu um problema ao tentar desconectar",
        variant: "destructive"
      });
    }
  };

  // Admin menu items to show if user is admin (type 1)
  const adminItems = userType === 1 ? [
    {
      name: 'Admin Institucional',
      path: '/admin-institucional'
    },
    {
      name: 'Admin Plataforma',
      path: '/admin-plataforma'
    }
  ] : [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">
          <Avatar>
            <AvatarFallback className="bg-[#F8E6FF] text-[#4F1964]">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigate('/configuracoes')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações da Conta</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/configuracoes#pagamento')}>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Plano e Pagamento</span>
        </DropdownMenuItem>

        {/* Admin menu items */}
        {userType === 1 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Administração</DropdownMenuLabel>
            {adminItems.map((item) => (
              <DropdownMenuItem key={item.path} onClick={() => navigate(item.path)}>
                <span>{item.name}</span>
              </DropdownMenuItem>
            ))}
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
