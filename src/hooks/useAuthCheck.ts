
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useAuthCheck = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
      
      // Check if user is admin (type_user = 1)
      const userType = Number(localStorage.getItem('userType'));
      console.log("Current user type:", userType);
      setIsAdmin(userType === 1);

      return loggedIn;
    };

    const loggedIn = checkLoginStatus();
    
    if (!loggedIn) {
      toast({
        title: "Acesso restrito",
        description: "Faça login para acessar esta página",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [navigate, toast]);

  return { isLoggedIn, isAdmin };
};
