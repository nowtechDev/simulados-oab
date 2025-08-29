
export { AIProvidersService } from './ai/aiProvidersService';
export { InteractionLogger } from './ai/interactionLogger';
export type { AIInteraction, AIResponse, AIProvider } from './ai/types';

// Create and export the singleton instance
import { AIProvidersService } from './ai/aiProvidersService';
export const aiProvidersService = AIProvidersService.getInstance();
