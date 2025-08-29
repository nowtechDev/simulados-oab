
import { useState, useRef, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { User, Send, Lightbulb, Plus, Search, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { generateCompletion } from '@/services/openaiCadernos';
import OpenAIConfig from '@/components/OpenAIConfig';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  date: Date;
}

// Sample conversations for history
const sampleConversations: Conversation[] = [
  { id: '1', title: 'Direito Civil', date: new Date(Date.now() - 3600000 * 24 * 2) },
  { id: '2', title: 'Processo Penal', date: new Date(Date.now() - 3600000 * 24 * 5) },
  { id: '3', title: 'Direito Administrativo', date: new Date(Date.now() - 3600000 * 24 * 7) },
  { id: '4', title: 'Direito Constitucional', date: new Date(Date.now() - 3600000 * 24 * 9) },
];

const Assistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Sou o assistente jurídico da Menthor.IA. Como posso ajudar com suas dúvidas sobre legislação, jurisprudência ou doutrina?',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [currentConversationTitle, setCurrentConversationTitle] = useState('Nova Conversa');
  const [conversations, setConversations] = useState<Conversation[]>(sampleConversations);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  
  // Check if API key is set
  useEffect(() => {
    const apiKey = localStorage.getItem('openai-api-key');
    setIsApiKeySet(!!apiKey);
  }, []);
  
  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Adjust textarea height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [inputValue]);

  const handleNewChat = () => {
    setMessages([{
      id: '1',
      content: 'Olá! Sou o assistente jurídico da Menthor.IA. Como posso ajudar com suas dúvidas sobre legislação, jurisprudência ou doutrina?',
      role: 'assistant',
      timestamp: new Date()
    }]);
    setCurrentConversationTitle('Nova Conversa');
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessageId = Date.now().toString();
    const userMessage: Message = {
      id: userMessageId,
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // If this is the first user message in a new conversation, set the title
    if (messages.length === 1 && currentConversationTitle === 'Nova Conversa') {
      const truncatedTitle = inputValue.length > 30 
        ? inputValue.substring(0, 30) + '...' 
        : inputValue;
      setCurrentConversationTitle(truncatedTitle);
    }
    
    if (!isApiKeySet) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          content: 'Por favor, configure sua chave de API da OpenAI para usar o assistente.',
          role: 'assistant',
          timestamp: new Date()
        }]);
        setIsLoading(false);
      }, 1000);
      return;
    }
    
    try {
      const result = await generateCompletion({ 
        prompt: inputValue,
        context: "Você é um assistente jurídico especializado. Forneça respostas objetivas e precisas."
      });
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: result.content,
        role: 'assistant',
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error("Erro ao processar mensagem:", error);
      toast({
        title: "Erro ao processar mensagem",
        description: "Ocorreu um erro ao processar sua mensagem. Tente novamente.",
        variant: "destructive"
      });
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: "Desculpe, ocorreu um erro ao processar sua mensagem. Verifique sua chave de API e tente novamente.",
        role: 'assistant',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const loadConversation = (conversation: Conversation) => {
    // In a real app, we would load the messages from the conversation
    // For now, we'll just update the title and fake loading it
    setCurrentConversationTitle(conversation.title);
    
    // Simulate loading conversation messages
    setMessages([
      {
        id: '1',
        content: `Esta é uma conversa carregada: ${conversation.title}. Como posso ajudar?`,
        role: 'assistant',
        timestamp: new Date()
      }
    ]);
  };
  
  const exampleQueries = [
    'O que é prescrição no Direito Civil?',
    'Princípios da Administração Pública',
    'Explique o habeas corpus',
    'Tipos de recursos no processo civil'
  ];

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  };

  // Group conversations by date
  const groupedConversations = conversations.reduce((groups, conversation) => {
    const date = formatDate(conversation.date);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(conversation);
    return groups;
  }, {} as Record<string, Conversation[]>);

  return (
    <Layout>
      <div className="flex h-[calc(100vh-64px)] mt-16">
        {/* Sidebar with conversation history - ChatGPT style */}
        <div className={cn(
          "bg-gray-50 border-r border-gray-200 flex flex-col h-full transition-all duration-300 ease-in-out",
          showSidebar ? "w-64" : "w-0 overflow-hidden"
        )}>
          <div className="p-3">
            <Button 
              variant="outline" 
              className="w-full justify-start text-left gap-2 mb-5 bg-white hover:bg-gray-100"
              onClick={handleNewChat}
            >
              <Plus size={16} />
              <span>Nova Conversa</span>
            </Button>
          </div>
          
          <div className="overflow-y-auto flex-1 px-3">
            {Object.entries(groupedConversations).map(([date, dateConversations]) => (
              <div key={date} className="mb-4">
                <div className="text-xs font-medium text-gray-500 mb-2">{date}</div>
                <div className="space-y-1">
                  {dateConversations.map(conversation => (
                    <div 
                      key={conversation.id}
                      className="px-3 py-2 text-sm rounded-md hover:bg-gray-200 cursor-pointer truncate"
                      onClick={() => loadConversation(conversation)}
                    >
                      {conversation.title}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {messages.length > 1 && currentConversationTitle !== 'Nova Conversa' && (
              <div className="mb-4">
                <div className="text-xs font-medium text-gray-500 mb-2">Hoje</div>
                <div className="px-3 py-2 text-sm rounded-md bg-gray-200 cursor-pointer truncate">
                  {currentConversationTitle}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-auto p-3 border-t border-gray-200">
            <OpenAIConfig className="h-auto w-full justify-start py-2 mb-2" />
          </div>
        </div>
        
        {/* Toggle sidebar button (visible only when sidebar is hidden) */}
        {!showSidebar && (
          <button 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-1.5 bg-white border border-gray-200 rounded-r-md shadow-sm hover:bg-gray-50"
            onClick={() => setShowSidebar(true)}
          >
            <ChevronRight size={16} />
          </button>
        )}
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col relative">
          {/* Chat header */}
          <div className="border-b border-gray-200 py-2 px-4 flex items-center">
            {showSidebar && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2"
                onClick={() => setShowSidebar(false)}
              >
                <ChevronLeft size={18} />
              </Button>
            )}
            <h2 className="text-lg font-medium">{currentConversationTitle}</h2>
            <div className="ml-auto flex gap-2">
              <Button variant="ghost" size="icon">
                <Search size={18} />
              </Button>
              <OpenAIConfig className="h-9" />
            </div>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-white">
            {messages.length === 1 && (
              <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8 text-[#4F1964]">Como posso ajudar?</h1>
                
                <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mb-8">
                  {exampleQueries.map((query, index) => (
                    <div 
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setInputValue(query)}
                    >
                      <p className="text-sm">{query}</p>
                    </div>
                  ))}
                </div>
                
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <ExternalLink size={14} />
                  O Menthor IA usa a API OpenAI para processar suas mensagens
                </p>
              </div>
            )}
            
            {messages.length > 1 && (
              <div className="max-w-3xl mx-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "mb-6",
                      message.role === 'user' ? "pl-12" : "pr-12"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center",
                        message.role === 'user' 
                          ? "bg-[#4F1964] text-white" 
                          : "bg-gray-200"
                      )}>
                        {message.role === 'user' 
                          ? <User size={15} /> 
                          : <div className="w-4 h-4 bg-[#4F1964] rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">A</span>
                            </div>
                        }
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-1">
                          {message.role === 'user' ? 'Você' : 'Assistente Jurídico'}
                        </p>
                        <div className="whitespace-pre-wrap text-gray-800">{message.content}</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="mb-6 pr-12">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                        <div className="w-4 h-4 bg-[#4F1964] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">A</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-2">Assistente Jurídico</p>
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 rounded-full bg-[#4F1964] animate-bounce" />
                          <div className="w-2 h-2 rounded-full bg-[#4F1964] animate-bounce [animation-delay:0.2s]" />
                          <div className="w-2 h-2 rounded-full bg-[#4F1964] animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Input area */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="max-w-3xl mx-auto relative">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pergunte algo sobre Direito..."
                className="resize-none rounded-xl pr-14 min-h-[56px] max-h-[200px] border border-gray-300 focus-visible:ring-1 focus-visible:ring-[#4F1964] focus-visible:border-[#4F1964]"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                size="icon"
                className={cn(
                  "absolute right-3 bottom-3 rounded-lg bg-[#4F1964] hover:bg-[#4F1964]/90 h-8 w-8",
                  (!inputValue.trim() || isLoading) && "opacity-50 cursor-not-allowed"
                )}
              >
                <Send size={16} />
              </Button>
              
              {!isApiKeySet && (
                <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                  <Lightbulb className="h-3 w-3" />
                  <span>Configure sua chave de API da OpenAI para usar o assistente.</span>
                </div>
              )}
              
              <div className="mt-2 text-xs text-center text-gray-500">
                O Menthor IA processa suas mensagens usando a API OpenAI. Suas conversas não são salvas em nossos servidores.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Assistant;
