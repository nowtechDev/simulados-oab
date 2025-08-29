# Edge Functions

Este diretório contém as Edge Functions do Supabase para referência.

⚠️ **Importante**: Estas funções são deployadas diretamente no Supabase, não fazem parte do build do projeto.

## Funções Disponíveis

### `process-links`
- **URL**: `https://jrxwmpmsziwtslxxjrsg.supabase.co/functions/v1/process-links`
- **Propósito**: Processar conteúdo de links com otimização inteligente
- **Usado por**: `agenteManager.ts` como fallback para busca de links

### Como atualizar
1. Acesse o dashboard do Supabase
2. Vá em Edge Functions
3. Edite a função `process-links`
4. Copie o código de `index.ts`
5. Faça deploy

## Arquivos

- `process-links/index.ts` - Código da função (apenas referência)
- `README.md` - Esta documentação
