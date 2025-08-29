
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { User } from './types';

export const useUserData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async (isLoggedIn: boolean, isAdmin: boolean) => {
    // Check if authenticated and admin before fetching
    if (!isLoggedIn || !isAdmin) {
      console.log("useUserData: Not authenticated as admin, skipping user fetch");
      setIsLoadingUsers(false);
      return;
    }
    
    setIsLoadingUsers(true);
    try {
      console.log("useUserData: Fetching users from Supabase...");
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("useUserData: Supabase error:", error);
        throw error;
      }
      
      console.log("useUserData: Users data received:", data);
      
      if (data) {
        console.log("useUserData: Setting users state with data length:", data.length);
        setUsers(data);
      } else {
        console.log("useUserData: No data returned from users query");
        setUsers([]);
      }
    } catch (error: any) {
      console.error("useUserData: Error fetching users:", error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários. Detalhes no console.",
        variant: "destructive"
      });
      setUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  return {
    users,
    isLoadingUsers,
    fetchUsers,
    setUsers
  };
};
