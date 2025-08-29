
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { useAuthStatus } from "@/components/navbar/useAuthStatus";
import { AuthStatus } from './types';

export const useAuthStatusCheck = () => {
  const [currentAuthStatus, setCurrentAuthStatus] = useState<AuthStatus | null>(null);
  const { isLoggedIn, userType, isAdmin } = useAuthStatus();
  const { toast } = useToast();

  useEffect(() => {
    console.log("useAuthStatusCheck: Auth status - isLoggedIn:", isLoggedIn, "isAdmin:", isAdmin, "userType:", userType);
    
    // Só define o status quando todos os dados estão disponíveis
    if (isLoggedIn !== undefined && userType !== undefined && isAdmin !== undefined) {
      const getSession = async () => {
        try {
          const { data, error } = await supabase.auth.getSession();
          
          setCurrentAuthStatus({
            isAuthenticated: isLoggedIn,
            user: data?.session?.user || null,
            isAdmin: isAdmin
          });

          console.log("useAuthStatusCheck: Setting auth status - isAuthenticated:", isLoggedIn, "isAdmin:", isAdmin);
        } catch (error) {
          console.error("Error fetching session:", error);
          setCurrentAuthStatus({
            isAuthenticated: isLoggedIn,
            user: null,
            isAdmin: isAdmin
          });
        }
      };
      
      getSession();
    }
  }, [isLoggedIn, isAdmin, userType]);

  return { 
    currentAuthStatus,
    isLoggedIn,
    isAdmin
  };
};
