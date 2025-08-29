
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Institution } from './types';

export const useInstitutionData = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoadingInstitutions, setIsLoadingInstitutions] = useState(true);
  const { toast } = useToast();

  const fetchInstitutions = async (isLoggedIn: boolean, isAdmin: boolean) => {
    // Check if authenticated and admin before fetching
    if (!isLoggedIn || !isAdmin) {
      console.log("useInstitutionData: Not authenticated as admin, skipping institutions fetch");
      setIsLoadingInstitutions(false);
      return;
    }
    
    setIsLoadingInstitutions(true);
    try {
      console.log("useInstitutionData: Fetching institutions from Supabase...");
      
      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("useInstitutionData: Supabase error fetching institutions:", error);
        throw error;
      }
      
      console.log("useInstitutionData: Institutions data received:", data);
      
      if (data) {
        console.log("useInstitutionData: Setting institutions state with data length:", data.length);
        setInstitutions(data);
      } else {
        console.log("useInstitutionData: No data returned from institutions query");
        setInstitutions([]);
      }
    } catch (error: any) {
      console.error("useInstitutionData: Error fetching institutions:", error);
      toast({
        title: "Erro ao carregar instituições",
        description: "Não foi possível carregar a lista de instituições. Detalhes no console.",
        variant: "destructive"
      });
      setInstitutions([]);
    } finally {
      setIsLoadingInstitutions(false);
    }
  };

  return {
    institutions,
    isLoadingInstitutions,
    fetchInstitutions,
    setInstitutions
  };
};
