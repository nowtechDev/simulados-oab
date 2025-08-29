
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Plan {
  id: number;
  slug: string;
  display_name: string;
  name: string;
  description: string;
  price: number;
  value: number;
  billing_cycle: string;
  benefits: string[];
  is_popular: boolean;
  color_theme: string;
  active: boolean;
  sort_order: number;
}

export const usePlans = () => {
  return useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('active', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching plans:', error);
        throw error;
      }

      return data as Plan[];
    },
  });
};

export const usePlanBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['plan', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('slug', slug)
        .eq('active', true)
        .single();

      if (error) {
        console.error('Error fetching plan:', error);
        throw error;
      }

      return data as Plan;
    },
    enabled: !!slug,
  });
};
