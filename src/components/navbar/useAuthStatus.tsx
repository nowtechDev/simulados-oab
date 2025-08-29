
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuthStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userType, setUserType] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false); // Added explicit isAdmin state

  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log("useAuthStatus: Checking auth status...");
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("useAuthStatus: Error fetching session:", error);
      }
      
      if (session) {
        console.log("useAuthStatus: Session found:", session.user.email);
        setIsLoggedIn(true);
        setUserEmail(session.user.email || '');
        
        // Get user type from the database directly
        try {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('type_user')
            .eq('id', session.user.id)
            .single();
          
          if (userError) throw userError;
          
          const type = userData?.type_user;
          console.log("useAuthStatus: User type from database:", type);
          setUserType(type);
          setIsAdmin(type === 1); // Set admin status based on type_user === 1
          
          // Store in localStorage for convenience
          localStorage.setItem('userType', type ? type.toString() : '');
        } catch (err) {
          console.error("useAuthStatus: Error fetching user type:", err);
          
          // Fallback to localStorage if DB query fails
          const storedUserType = localStorage.getItem('userType');
          if (storedUserType) {
            console.log("useAuthStatus: Using user type from localStorage:", storedUserType);
            const type = parseInt(storedUserType);
            setUserType(type);
            setIsAdmin(type === 1);
          }
        }
      } else {
        console.log("useAuthStatus: No active session");
        setIsLoggedIn(false);
        setUserEmail('');
        setUserType(null);
        setIsAdmin(false);
      }
    };
    
    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("useAuthStatus: Auth state changed:", event, session?.user?.email || "no user");
      if (event === 'SIGNED_IN' && session) {
        setIsLoggedIn(true);
        setUserEmail(session.user.email || '');
        
        // Re-check user type when signed in
        setTimeout(() => {
          checkAuthStatus();
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUserEmail('');
        setUserType(null);
        setIsAdmin(false);
      }
    });
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      subscription.unsubscribe();
    };
  }, []);

  return { isLoggedIn, userEmail, userType, isAdmin };
};
