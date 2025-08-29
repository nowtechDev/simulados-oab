// Edge Function para processar conteúdo de links
// Arquivo: supabase/functions/process-links/index.ts

// @ts-ignore - Deno runtime module
import { serve } from "https://deno.land/std@0.220.0/http/server.ts"

interface LinkRequest {
  links: string[]
}

interface LinkContent {
  url: string
  content: string
  success: boolean
  error?: string
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    })
  }

  try {
    const { links }: LinkRequest = await req.json()
    
    if (!Array.isArray(links)) {
      throw new Error('Links deve ser um array')
    }

    const results: LinkContent[] = []

    for (const url of links) {
      try {
        console.log(`Processando link: ${url}`)
        
        // Fazer requisição para o link
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Bot/1.0)',
            'Accept': 'text/html,text/plain,*/*',
          },
          signal: AbortSignal.timeout(15000) // 15 segundos timeout
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        let content = await response.text()
        
        // Se for HTML, extrair apenas o texto
        const contentType = response.headers.get('content-type') || ''
        if (contentType.includes('text/html')) {
          content = extractTextFromHTML(content)
        }

        // Limitar tamanho de forma mais inteligente
        const maxLength = 12000; // Aumentamos o limite
        if (content.length > maxLength) {
          // Tentar preservar conteúdo mais relevante
          content = optimizeContentForEdgeFunction(content, maxLength)
        }

        results.push({
          url,
          content,
          success: true
        })

      } catch (error) {
        console.error(`Erro ao processar ${url}:`, error)
        results.push({
          url,
          content: '',
          success: false,
          error: error.message
        })
      }
    }

    return new Response(
      JSON.stringify({ success: true, links: results }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )

  } catch (error) {
    console.error('Erro na função:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
})

function extractTextFromHTML(html: string): string {
  // Remover scripts e styles
  let text = html.replace(/<script[^>]*>.*?<\/script>/gis, '')
  text = text.replace(/<style[^>]*>.*?<\/style>/gis, '')
  
  // Remover tags HTML
  text = text.replace(/<[^>]*>/g, ' ')
  
  // Limpar espaços
  text = text.replace(/\s+/g, ' ').trim()
  
  // Decodificar entidades HTML básicas
  text = text.replace(/&nbsp;/g, ' ')
  text = text.replace(/&amp;/g, '&')
  text = text.replace(/&lt;/g, '<')
  text = text.replace(/&gt;/g, '>')
  text = text.replace(/&quot;/g, '"')
  
  return text
}

function optimizeContentForEdgeFunction(content: string, maxLength: number): string {
  // Se o conteúdo for menor que o limite, retornar como está
  if (content.length <= maxLength) {
    return content
  }
  
  console.log(`🔧 Otimizando conteúdo: ${content.length} -> ${maxLength} caracteres`)
  
  // Tentar extrair artigos completos se for conteúdo legal
  const articles = content.match(/Art\.\s*\d+[^]*?(?=Art\.\s*\d+|CAPÍTULO|SEÇÃO|TÍTULO|$)/gi)
  if (articles) {
    const selectedArticles: string[] = []
    let currentLength = 0
    
    for (const article of articles) {
      if (currentLength + article.length <= maxLength) {
        selectedArticles.push(article.trim())
        currentLength += article.length + 2
      } else {
        break
      }
    }
    
    if (selectedArticles.length > 0) {
      const result = selectedArticles.join('\n\n')
      console.log(`📚 Extraídos ${selectedArticles.length} artigos completos`)
      return result + '\n\n[Conteúdo otimizado - artigos mais relevantes]'
    }
  }
  
  // Fallback: tentar preservar parágrafos completos
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 30)
  const selected: string[] = []
  let currentLength = 0
  
  // Priorizar parágrafos com palavras-chave jurídicas
  const legalKeywords = ['artigo', 'lei', 'código', 'direito', 'civil', 'penal', 'trabalhista']
  
  for (const paragraph of paragraphs) {
    const hasKeywords = legalKeywords.some(keyword => 
      paragraph.toLowerCase().includes(keyword)
    )
    
    if (hasKeywords && currentLength + paragraph.length <= maxLength) {
      selected.push(paragraph)
      currentLength += paragraph.length + 2
    }
  }
  
  // Completar com outros parágrafos se ainda há espaço
  for (const paragraph of paragraphs) {
    if (!selected.includes(paragraph) && currentLength + paragraph.length <= maxLength) {
      selected.push(paragraph)
      currentLength += paragraph.length + 2
    }
  }
  
  if (selected.length > 0) {
    const result = selected.join('\n\n')
    console.log(`📄 Selecionados ${selected.length} parágrafos relevantes`)
    return result + '\n\n[Conteúdo otimizado - parágrafos mais relevantes]'
  }
  
  // Último recurso: corte simples
  return content.substring(0, maxLength - 100) + '\n\n[Conteúdo truncado...]'
}
