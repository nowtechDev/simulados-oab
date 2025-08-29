
import { supabase } from '@/integrations/supabase/client';
import { AIInteraction } from './types';

export class InteractionLogger {
  static async logInteraction(interaction: AIInteraction): Promise<void> {
    try {
      // Obter o ID do usuário autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('Usuário não autenticado para registrar interação');
        return;
      }

      const { error } = await supabase
        .from('ia_interactions')
        .insert({
          user_id: user.id,
          provider: interaction.provider,
          model: interaction.model,
          prompt: interaction.prompt,
          response: interaction.response,
          tokens_used: interaction.tokens_used,
          cost_usd: interaction.cost_usd,
          page_context: interaction.page_context,
          metadata: interaction.metadata || {}
        });

      if (error) {
        console.error('Erro ao registrar interação com IA:', error);
      }
    } catch (error) {
      console.error('Erro ao registrar interação:', error);
    }
  }
}
